/**
 * 资讯页面
 */
// 1.引入核心包
import React from 'react'
import './index.scss'
// 2.类组件
class News extends React.Component{
  render(){
    return(
      <div className="news">
        <p>News页面</p>
        <h1 className="red">我是news 里面的h1</h1>
      </div>
    )
  }
}

// 3.导出组件
export default News