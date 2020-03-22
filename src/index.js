/**
 * 入口文件
 */
// 1.引入
import React from 'react'
import ReactDOM from 'react-dom'
// 3.引入根组件
import App from './App'

// 4.引入antd-mobile的样式
import 'antd-mobile/dist/antd-mobile.css'

// 5.引入自己定义的全局样式,要覆盖antd-mobile的样式
import './index.css'
// 2.渲染
ReactDOM.render(<App></App>,document.getElementById('root'))