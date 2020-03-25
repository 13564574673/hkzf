/**
 * 城市列表页面
 */
// 1.引入核心包
import React from 'react'
import NavHeader from '../../components/NavHeader'
import axios from 'axios'
import {getCurrentCity} from '../../utils'

// 2.类组件
class CityList extends React.Component{
  state = {
    cityList:1,
    CityListObj:{},
    CityIndexArr:[]
  }
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
      const {CityListObj,CityIndexArr} = this.handleCityList(body)
      // 3.处理热门城市
      let hotCity = await axios.get('http://localhost:8080/area/hot')
      // console.log( '热门城市：',hotCity );
      if(hotCity.data.status === 200){
        CityListObj['hot'] = hotCity.data.body
        CityIndexArr.unshift('hot')
      }
      // 4.处理当前定位城市
      // getCurrentCity(currentCity =>{
      //   // console.log( '定位城市:',currentCity );
      //   CityListObj['#'] = [currentCity]
      //   CityIndexArr.unshift('#')
      // })

      getCurrentCity().then(currentCity =>{
        // console.log( '定位城市:',currentCity );
        CityListObj['#'] = [currentCity]
        CityIndexArr.unshift('#')
      })
      console.log( '城市列表：', CityListObj);
      console.log( '城市字母列表：', CityIndexArr);
      this.setState({
        CityListObj,
        CityIndexArr
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
    let CityListObj = {}
    // let CityIndexArr = []
    // 2.遍历传入进来的城市列表数据
    list.forEach(item =>{
      // console.log( item );
      //3. 找到每个城市的首字母, 判断对象里是否存在, 
      let first = item.short.slice(0,1).toUpperCase()
      if(first in CityListObj){
        // 4.存在那么就往数组中往后面追加
        CityListObj[first].push(item)
      }else{
        // 5.如果不存在，那么直接添加
        CityListObj[first] = [item]
      }   
    })
    // console.log( CityListObj );
    // 6.创建一个数组专门存放有序的索引
    let CityIndexArr = Object.keys(CityListObj).sort()
    // console.log( CityIndexArr );
    console.log( {CityListObj,CityIndexArr} );
    // 7.返回 CityListObj,CityIndexArr
    return {CityListObj,CityIndexArr}
  }
  // ******************钩子函数 ******************
  render(){
    return(
      <div className="citylist">
        {/* 导航栏部分 */}
        {/* <NavHeader props={this.props}>城市列表</NavHeader> */}
        <NavHeader>城市列表</NavHeader>
        {/* 列表部分 */}

      </div>
    )
  }
  componentDidMount(){
    this.loadCitylistData()
  }
  // ******************渲染元素 ******************

}

// 3.导出组件
export default CityList