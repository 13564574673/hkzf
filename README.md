## 移动端租房项目
- 项目介绍 : 本项目是一个在线租房项目, 实现了类似链家等项目的功能, 解决了用户租房的需求
- 核心业务 :  在线地图找房、 条件搜索找房 、用户登录 、房源发布等等

### 项目准备
#### 技术栈
- React 核心库：react、react-dom、react-router-dom 
- 脚手架：create-react-app 
- 数据请求：axios 
- UI组件库： antd-mobile 
- 其他组件库： react-virtualized、formik+yup、react-spring、node-sass 等 
- 百度地图 API

### 项目结构
- 项目结构如下
```js
- src/      	项目源码
    assets/     资源(图片、字体图标)
    components/  公共组件
    pages/ 		页面 or  views
    utils/ 		工具
    App.js 		根组件(配置路由 信息)
    index.css 	全局样式
    index.js	项目入口文件 (渲染根组件、导入组件库)
```
- 项目启动：`yarn start`

### 页面结构
- 页面结构如下
```js
- src/page/ 项目页面结构和样式
    Home/       首页
    CityList/   城市列表
    Index/      首页页面
    HouseList/  找房页面
    News/       资讯页面
    Profile/    个人中心页面
    Map/        百度地图
```

### 项目中两种布局方式
- 有tabBar  => Home 页面： 在路由内部切换路由(嵌套路由)

- 没有tabBar => CityList 页面、Map 地图、HouseList 页面
121.374197,31.037776