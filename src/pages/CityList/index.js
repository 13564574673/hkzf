/**
 * 城市列表页面
 */
// 1.引入核心包
import React from 'react'
import NavHeader from '../../components/NavHeader'
import axios from 'axios'
import {getCurrentCity,setCity} from '../../utils'
import styles from './index.module.scss'
import {List,AutoSizer} from 'react-virtualized';
import {Toast} from 'antd-mobile'

// 业务城市
const CITY_WITH_HOUSE = ['北京','上海','广州','深圳']

// 2.类组件
class CityList extends React.Component{
  state = {
    cityList:1,
    cityListObj:{},
    cityIndexArr:[],
    activeIndex:0
  }
  listRef = React.createRef()
  // ******************操作数据 ******************
  // 请求城市列表数据
  async loadCitylistData(){
    // 1.发送请求获取城市列表
    let res = await axios.get('http://localhost:8080/area/city',{
      params:{
        level:this.state.cityList
      }
    })
    // console.log( res );
    // 2.处理成对象和数组
    const {status,body} = res.data
    if(status === 200){
      const {cityListObj,cityIndexArr} = this.handleCityList(body)
      // 3.处理热门城市
      let hotCity = await axios.get('http://localhost:8080/area/hot')
      // console.log( '热门城市：',hotCity );
      if(hotCity.data.status === 200){
        cityListObj['hot'] = hotCity.data.body
        cityIndexArr.unshift('hot')
      }
      // 4.处理当前定位城市
      // getCurrentCity(currentCity =>{
      //   // console.log( '定位城市:',currentCity );
      //   cityListObj['#'] = [currentCity]
      //   cityIndexArr.unshift('#')
      // })

      getCurrentCity().then(currentCity =>{
        // console.log( '定位城市:',currentCity );
        cityListObj['#'] = [currentCity]
        cityIndexArr.unshift('#')
        this.setState({
          cityListObj,
          cityIndexArr
        })
        console.log( '城市列表：', this.state.cityListObj);
        console.log( '城市字母列表：', this.state.cityIndexArr);
      })
    }
  }
  // 4.处理当前定位城市
  // getCurrentCity(callback){
  //   const BMap = window.BMap
  //   // 1.拿到地图实例
  //   var City = new BMap.LocalCity();
  //   // 2.调get方法获取城市名称
  //   City.get(async (res)=>{
  //     // console.log( '定位城市:',res );
  //     // 3.验证定位城市是否有房源
  //     let res1 = await axios.get('http://localhost:8080/area/info',{
  //       params:{
  //         name:res.name
  //       }
  //     })
  //     // console.log( res1 );
  //     const {status,body} = res1.data  
  //     if(status === 200){
  //       callback && callback(body)
  //     }
  //   })
  // }
  // 处理城市列表数据
  handleCityList(list){
    let cityListObj = {}
    // let cityIndexArr = []
    // 2.遍历传入进来的城市列表数据
    list.forEach(item =>{
      // console.log( item );
      //3. 找到每个城市的首字母, 判断对象里是否存在, 
      let first = item.short.slice(0,1).toUpperCase()
      if(first in cityListObj){
        // 4.存在那么就往数组中往后面追加
        cityListObj[first].push(item)
      }else{
        // 5.如果不存在，那么直接添加
        cityListObj[first] = [item]
      }   
    })
    // console.log( cityListObj );
    // 6.创建一个数组专门存放有序的索引
    let cityIndexArr = Object.keys(cityListObj).sort()
    // console.log( cityIndexArr );
    // console.log( {cityListObj,cityIndexArr} );
    // 7.返回 cityListObj,cityIndexArr
    return {cityListObj,cityIndexArr}
  }
  // ******************钩子函数 ******************
  render(){
    return(
      <div className={styles.citylist}>
        {/* 导航栏部分 */}
        {/* <NavHeader props={this.props}>城市列表</NavHeader> */}
        <NavHeader>城市列表</NavHeader>
        {/* 列表部分 */}
        <AutoSizer>
          {({width,height})=>{
            // console.log( width,height );
            return(
              <List
                width={width}
                height={height-45}
                rowCount={this.state.cityIndexArr.length}
                rowHeight={this.rowHeight}
                rowRenderer={this.rowRenderer}
                onRowsRendered={this.onRowsRendered}
                ref={this.listRef}
                scrollToAlignment="start"
              />
            )
          }}
        </AutoSizer>
       
        {/* 右侧索引 */}
        <ul className={styles["city-index"]}>
          {this.renderCityIndex()}
        </ul>
      </div>
    )
  }
  componentDidMount(){
    this.loadCitylistData()
  }
  // ******************渲染元素 ******************
  // 动态计算行高
  rowHeight = ({index}) => {
    // console.log( index );
    // 1.解构
    const {cityListObj,cityIndexArr} = this.state
    // 2.根据数组拿到索引元素
    const ffirstLetter = cityIndexArr[index]
    // 3.拿到对象中每个key对应的数组个数
    // 再用每列的标题长度 + 内容长度*内容的个数
    // console.log( cityListObj[ffirstLetter].length );
    return 36 + 50 * cityListObj[ffirstLetter].length
  }

  rowRenderer = ({
    key, // 唯一值
    index, // 索引值
    isScrolling, // 是否滚动
    isVisible, // 是否可见
    style, // 计算出来的样式
  }) => {
    // 1.解构
    const {cityListObj,cityIndexArr} = this.state
    // 2.拿到 cityIndexArr 里面的索引元素
    const firstLetter = cityIndexArr[index]
    return (
      <div key={key} style={style} className={styles.city}>
        {/* 标题 */}
        <div className={styles.title}>{this.formatLetter(firstLetter)}</div>
        {/* 内容 */}
        {cityListObj[firstLetter].map(item=>{
          return <div onClick={() => this.clickCity(item)} className={styles.name} key={item.value}>{item.label}</div>
        })}
      </div>
    )
  }
  // 格式化标题
  formatLetter(firstLetter){
    switch (firstLetter) {
      case '#':
        return '当前定位城市'
      case 'hot':
        return '热门城市'
      default:
        return firstLetter
    }
  }

  // 渲染右侧索引
  renderCityIndex(){
    const {cityIndexArr,activeIndex} = this.state
    return cityIndexArr.map((item,index)=>{
      return (
        <li className={styles['city-index-item']}  key={index}>
          {/* 高亮类名：index-active */}
          <span
            onClick={(e) => this.navClick(e,index)} 
            className={index === activeIndex?styles['index-active']:''}
          >
            {item === 'hot' ? '热':item}
          </span>
        </li>
      )
    })
  }
  // 右侧导航点击相应的按钮，高亮
  navClick = (e,index) => {
    // console.log( this.listRef.current.scrollToRow(index) );
    this.listRef.current.scrollToRow(index)
    // console.log( index );
    this.setState({
      activeIndex:index
    })
  }
  // 监听list滚动
  onRowsRendered = ({startIndex}) => {
    if(this.state.activeIndex !== startIndex) {
      console.log( startIndex ); 

      this.setState({
        activeIndex: startIndex
      })
    }
  }

  // 点击城市
  clickCity = (item)=>{
    // 1.判断点击的城市名称在不在业务城市里面
    if(CITY_WITH_HOUSE.includes(item.label)){
      // console.log( item );
      // 2.把点击的城市替换掉本地定位的城市
      setCity(item)
      // 3.提示 切换城市
      Toast.success('切换城市成功',1,()=>{
        this.props.history.goBack()
      })
    }else{
      Toast.info(`该城市-${item.label}-没有房源信息`,1)
      console.log( '没有房源信息' );
    }
  
  }
}

// 3.导出组件
export default CityList

