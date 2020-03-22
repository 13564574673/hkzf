/**
 * 首页
 */
// 1.引入核心包
import React from 'react'
import { Carousel,Flex } from 'antd-mobile'
import axios from 'axios'

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
    isSwiperLoaded:false //轮播图数据是否加载完成
  }
  //  *****************操作数据*****************
  // 请求轮播图数据
  async loadSwipersDate(){
    const res = await axios.get('http://localhost:8080/home/swiper')
    console.log( res );
    const {status,body} = res.data
    if(status === 200){
      this.setState({
        swipersData : body,
        isSwiperLoaded:true
      })
    }
    // console.log( this.state.swipersData );
  }

  //  *****************钩子函数*****************
  render(){
    return(
      <div className="index">
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
      </div>
    )
  }
  
  componentDidMount() {
    // 封装一个方法，请求轮播图数据
    this.loadSwipersDate()
  }
  //  *****************渲染元素*****************

}

// 3.导出组件
export default Index