/**
 * 城市列表页面
 */
// 1.引入核心包
import React from 'react'
import NavHeader from '../../components/NavHeader'
import axios from 'axios'

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
    let res = await axios.get('http://localhost:8080/area/city',{
      params:{
        level:this.state.cityList
      }
    })
    console.log( res );
    const {status,body} = res.data
    if(status === 200){
      const {CityListObj,CityIndexArr} = this.handleCityList(body)
      this.setState({
        CityListObj,
        CityIndexArr
      })
    }
  }
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