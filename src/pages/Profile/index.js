/**
 * 个人中心页面
 */
// 1.引入核心包
import React from 'react'

// 2.类组件
class Profile extends React.Component{
  render(){
    return(
      <div className="profile">
        <p>Profile页面</p>
        <h1 className="red">我是profile里面的h1</h1>
      </div>
    )
  }
}

// 3.导出组件
export default Profile