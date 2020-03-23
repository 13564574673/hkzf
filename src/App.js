/**
 * 根组件
 */
// 1.引入核心包
import React from 'react'

// 引入路由所需要的组件
import { BrowserRouter, Route,Redirect } from 'react-router-dom'

// 引入页面组件
import Home from './pages/Home'
import CityList from './pages/CityList'
// 引入antd-mobile 里面的组件
// import { Button } from 'antd-mobile';
// 引入百度地图组件
import Map from './pages/Map'
// 2.类组件
class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="app">
          {/* 出口 */}
          <Route exact path="/" render={()=><Redirect to="/home"/>}></Route>
          <Route path="/home" component={Home}></Route>
          <Route path="/city-list" component={CityList}></Route>
          <Route path="/map" component={Map}></Route>
        </div>
      </BrowserRouter>
    )
  }
}

// 3.导出根组件
export default App