/**
 * 首页
 */
// 1.引入核心包
import React from 'react'
import { Carousel,Flex,WingBlank,Toast } from 'antd-mobile'
import axios from 'axios'
import {getCurrentCity} from '../../utils'

import './index.scss'

import nav1 from '../../assets/images/nav-1.png'
import nav2 from '../../assets/images/nav-2.png'
import nav3 from '../../assets/images/nav-3.png'
import nav4 from '../../assets/images/nav-4.png'
// 2.类组件
class Index extends React.Component{
  state = {
    swipersData: [], //轮播图初始值
    imgHeight: 176,
    isSwiperLoaded:false, //轮播图数据是否加载完成
    groups:[], //租房小组
    news : [], //最新资讯
    currentCityName:'上海' //当前城市名称
  }
  //  *****************操作数据*****************
  // 请求轮播图数据
  async loadSwipersDate(){
    const res = await axios.get('http://localhost:8080/home/swiper')
    // console.log( res );
    const {status,body} = res.data
    if(status === 200){
      this.setState({
        swipersData : body,
        isSwiperLoaded:true
      })
    }
    // console.log( this.state.swipersData );
  }
  // 请求租房小组数据
  async getGroups(){
    let res = await axios.get('http://localhost:8080/home/groups?area=AREA%7C88cff55c-aaa4-e2e0')
    // console.log( res );
    const {status,body} = res.data
    if(status === 200){
      this.setState({
        groups:body
      })
    }
  }
  // 请求最新资讯数据
  async getNews() {
    let res = await axios.get(
   	 'http://localhost:8080/home/news?area=AREA%7C88cff55c-aaa4-e2e0'
    )
    const {status,body} = res.data
    if(status === 200){
      this.setState({
        news: body
      })
    }

  }
  // 获取定位城市
  getCurrentCity(){
    const BMap = window.BMap
    // 1.拿到地图实例
    var City = new BMap.LocalCity();
    // 2.调get方法获取城市名称
    City.get(async (res)=>{
      // console.log( '定位城市:',res );
      let res1 = await axios.get('http://localhost:8080/area/info',{
        params:{
          name:res.name
        }
      })
      console.log( res1 );
      const {status,body} = res1.data  
      if(status === 200){
        this.setState({
          currentCityName : body.label
        })
      }else{
        Toast.offline('当前城市没有房源！', 1)
      }
    })
  }
  //  *****************钩子函数*****************
  render(){
    const {history} = this.props
    return(
      <div className="index">
         {/* 顶部导航 */}
        <Flex className='search-box'>
            <Flex className="search-left">
                      <div
                        className="location"
                        onClick={() => history.push('/city-list')}
                      >
                        <span>{this.state.currentCityName}</span>
                        <i className="iconfont icon-arrow" />
                      </div>
                      <div
                        className="search-form"
                        onClick={() => history.push('/search')}
                      >
                        <i className="iconfont icon-seach" />
                        <span>请输入小区或地址</span>
                      </div>
              </Flex>
                    <i
                      className="iconfont icon-map"
                      onClick={() => history.push('/map')}
                    />
        </Flex>
        {/* 轮播图 */}
        {this.state.isSwiperLoaded && (
          <Carousel
            autoplay={true}
            infinite
            dotActiveStyle={{backgroundColor:'red'}}
            dotStyle={{backgroundColor:'#fff'}}
          >
            {this.state.swipersData.map(val => (
              <a
                key={val}
                href="http://www.alipay.com"
                style={{ display: 'inline-block', width: '100%', height: this.state.imgHeight }}
              >
                <img
                  src={"http://localhost:8080"+ val.imgSrc}
                  alt=""
                  style={{ width: '100%', verticalAlign: 'top' }}
                  onLoad={() => {
                    this.setState({ imgHeight: 'auto' });
                  }}
                />
              </a>
            ))}
          </Carousel>
        )}
        {/* 导航菜单 */}
        <div className="nav">
          <Flex>
            <Flex.Item>
              <img src={nav1} alt=""/>
              <p>整租</p>
            </Flex.Item>
            <Flex.Item>
              <img src={nav2} alt=""/>
              <p>合租</p>
            </Flex.Item>
            <Flex.Item>
              <img src={nav3} alt=""/>
              <p>地图找房</p>
            </Flex.Item>
            <Flex.Item>
              <img src={nav4} alt=""/>
              <p>去出租</p>
            </Flex.Item>
          </Flex>
        </div>
        {/* 1 */}
        <div className="groups">
          <div className="groups-title clearfix">
            <h3>租房小组</h3>
            <span>更多</span>
          </div>
          {/* 宫格 */}
          <div className="groups-main">
            {this.groupsMain()}
          </div>
          {/* 最新快讯 */}
          <div className="news">
            <h3 className="group-title">最新资讯</h3>
            <WingBlank size="md">{this.renderNews()}</WingBlank>
          </div>
        </div>
      </div>
    )
  }
  
  async componentDidMount() {
    // 封装一个方法，请求轮播图数据
    this.loadSwipersDate()
    // 租房小组数据
    this.getGroups()
    // 最新资讯数据
    this.getNews()
    // 获取当前定位城市
    // this.getCurrentCity()
    let {label} = await getCurrentCity()
    this.setState({
      currentCityName : label
    })    
  }
  //  *****************渲染元素*****************
  // 租房小组封装渲染方法
  groupsMain(){
    return this.state.groups.map(item=>(
        <div className="groups-item " key={item.id}>
          <div className="desc">
            <p className="title">{item.title}</p>
            <span className="info">{item.desc}</span>
          </div>
          <img src={`http://localhost:8080${item.imgSrc}`} alt=""/>    
        </div>
      )
    )
  }
  // 最新资讯封装渲染方法
  // 渲染最新资讯
  renderNews() {
    return this.state.news.map(item => (
      <div className="news-item" key={item.id}>
        <div className="imgwrap">
          <img
            className="img"
            src={`http://localhost:8080${item.imgSrc}`}
            alt=""
          />
        </div>
        <Flex className="content" direction="column" justify="between">
          <h3 className="title">{item.title}</h3>
          <Flex className="info" justify="between">
            <span>{item.from}</span>
            <span>{item.date}</span>
          </Flex>
        </Flex>
      </div>
    ))
  }
}

// 3.导出组件
export default Index