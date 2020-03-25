/**
 * 首页
 */
// 1.引入核心包
import React from 'react'

import { TabBar } from 'antd-mobile'

// 引入四个嵌套组件
import { Route } from 'react-router-dom'
import Index from '../Index'
import HouseList from '../HouseList'
import News from '../News'
import Profile from '../Profile'

import './index.css'

const tabItems = [
  {
    id:1,
    title:'首页',
    icon:'icon-ind',
    path:'/home',
    badge:'',
    dot:false
  },
  {
    id:2,
    title:'找房',
    icon:'icon-findHouse',
    path:'/home/house-list',
    badge:'new',
    dot:false
  },
  {
    id:3,
    title:'资讯',
    icon:'icon-infom',
    path:'/home/news',
    badge:'',
    dot:true
  },
  {
    id:4,
    title:'个人中心',
    icon:'icon-my',
    path:'/home/profile',
    badge:'',
    dot:false
  },
]
// 2.类组件
class Home extends React.Component {
  state = {
    selectedTab: this.props.location.pathname ,
  }

  render() {
    return (
      <div className="home">
        {/* 嵌套路由的出口 */}
        <Route exact path="/home" component={Index}></Route>
        <Route path="/home/house-list" component={HouseList}></Route>
        <Route path="/home/news" component={News}></Route>
        <Route path="/home/profile" component={Profile}></Route>
        {/* 底部 tabBar */}
        <TabBar
          unselectedTintColor="#333"
          tintColor="#21b97a"
          barTintColor="white"
        >
          {this.renderTabs()}
        </TabBar>
      </div>
    )
  }
  // 底部 tabBar 渲染函数
  renderTabs(){
    return tabItems.map(item=>(    
        <TabBar.Item
          title={item.title}
          key={item.id}
          badge={item.badge}
          dot={item.dot}
          icon={<i className={"iconfont " +  item.icon}></i>}
          selectedIcon={<i className={`iconfont ${item.icon}`}></i>}
          selected={this.state.selectedTab === item.path}
          onPress={() => {
            this.props.history.push(item.path)
            this.setState({
              selectedTab: item.path ,
            });
          }}
        >
        </TabBar.Item>
      )
    )
  }
}

// 3.导出组件
export default Home