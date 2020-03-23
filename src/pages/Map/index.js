// 1.引入核心包
import React from 'react'
import NavHeader from '../../components/NavHeader'
import './index.scss'
// 2.类组件
class Map extends React.Component{
  render(){
    return(
      <div className="map">
        {/* 导航栏 */}
    <NavHeader>地图找房</NavHeader>
        {/* 地图详情 */}
        <div id="container"></div>
      </div>
    )
  }
  componentDidMount(){
    // 创建地图实例
    const BMap = window.BMap
    const map = new BMap.Map("container")
    const point = new BMap.Point(121.374197,31.037776)
    map.centerAndZoom(point, 17);
  }
}

// 3.导出组件
export default Map