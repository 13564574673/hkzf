// 1.引入核心包
import React from 'react'
import NavHeader from '../../components/NavHeader'
import styles from './index.module.scss'
import {getCurrentCity} from '../../utils'
import axios from 'axios'
// 2.类组件
class Map extends React.Component{
  // ********************* 操作数据 ************************
  state={
    isShowHouseList : false,
    houseListData:[]//房屋列表数据
  }
  // ********************* 钩子函数 ************************
  render(){
    const {isShowHouseList} = this.state
    return(
      <div className={styles.map}>
        {/* 导航栏 */}
        <NavHeader>地图找房</NavHeader>
        {/* 地图详情 */}
        <div id="container"></div>

        {/* 房屋列表结构 */}
        <div className={[styles.houseList, isShowHouseList?styles.show:''].join(' ')}>
          <div className={styles.titleWrap}>
            <h1 className={styles.listTitle}>房屋列表</h1>
            <a className={styles.titleMore} href="/house/list">
              更多房源
            </a>
          </div>
          <div className={styles.houseItems}>
            {this.renderHouse()}
          </div>
        </div>
      </div>
    )
  }
  componentDidMount(){
    this.initMap()
  }
  // ********************* 渲染函数 ************************
  async initMap(){
    // 1.获取定位城市
    let {label,value} = await getCurrentCity()
    this.label = label
    this.value = value
    // console.log( label,value );

    // 2.地址解析
    const BMap = window.BMap
    var map = new BMap.Map("container");
    this.map = map

    // 3.创建地址解析器实例
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(label, point=>{
      if (point) {
        map.centerAndZoom(point, 11);
        // 渲染覆盖物 - 区
        this.renderOverlays_QU(value)        
      }else{
        console.log("您选择地址没有解析到结果!");
      }
    }, label);
  }
  // 渲染覆盖物-区
  async renderOverlays_QU(id){
    // 1.根据id值获取 所有的区
    let res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
    // console.log( res );
    // 2.解构请求获取的值 进行判断，有值才进行下面的渲染
    const {status,body} = res.data
    if(status === 200){
      body.forEach(item=>{
        // console.log( item );
        // 3.解构区里面的数据
        const {count,coord:{longitude,latitude},value,label} = item
        // console.log( latitude,longitude );
        // 样式
        // 4.根据 latitude,longitude，创建 point 实例
        const {myLabel,point} = this.mapRender(longitude,latitude)
        // 渲染
        myLabel.setContent(`
        <div class="${styles.bubble}">
          <p class="${styles.name}">${label}</p>
          <p >${count}套</p>
        </div>
        `)
        // 5.注册点击事件
        myLabel.addEventListener('click',()=>{
          console.log( point );
          // console.log( '111' );
          // 1.修改缩放级别
          this.map.centerAndZoom(point, 13);
          // 2.清除区的覆盖物
          setTimeout(()=>{
            this.map.clearOverlays()
          },0)
          // 3.渲染镇的覆盖物
          this.renderOverlays_ZHEN(value)
        })
        this.map.addOverlay(myLabel);  
      })
    }
  }

  // 渲染覆盖物-镇
  async renderOverlays_ZHEN(id){
    let res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
    // console.log( res );
    // 2.解构请求获取的值 进行判断，有值才进行下面的渲染
    const {status,body} = res.data
    if(status === 200){
      body.forEach(item=>{
        // console.log( item );
        // 3.解构区里面的数据
        const {count,coord:{longitude,latitude},value,label} = item
        // console.log( latitude,longitude );
        // 4.根据 latitude,longitude，创建 point 实例
        const {myLabel,point} = this.mapRender(longitude,latitude)
        // 渲染
        myLabel.setContent(`
        <div class="${styles.bubble}">
          <p class="${styles.name}">${label}</p>
          <p >${count}套</p>
        </div>
        `)
        // 5.注册点击事件
        myLabel.addEventListener('click',()=>{
          // console.log( '111' );
          // 1.修改缩放级别
          this.map.centerAndZoom(point, 15);
          // 2.清除区的覆盖物
          setTimeout(()=>{
            this.map.clearOverlays()
          },0)
          // 3.渲染镇的覆盖物
          this.renderOverlays_XIAOQU(value)
        })
        this.map.addOverlay(myLabel);  
      })
    }
  }
  // 渲染覆盖物-小区
  async renderOverlays_XIAOQU(id){
    let res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
    // console.log( res );
    // 2.解构请求获取的值 进行判断，有值才进行下面的渲染
    const {status,body} = res.data
    if(status === 200){
      body.forEach(item=>{
        // console.log( item );
        // 3.解构区里面的数据
        const {count,coord:{longitude,latitude},value,label} = item
        // console.log( latitude,longitude );
        // 4.根据 latitude,longitude，创建 point 实例
        const {myLabel,point} = this.mapRender(longitude,latitude,-50,-14)
        // 渲染
        myLabel.setContent(`
        <div class="${styles.rect}">
          <span class="${styles.housename}">${label}</span>
          <span class="${styles.housename}">${count}套</span>
          <i class="${styles.arrow}"></i>
        </div>
        `)
        
        // 5.注册点击事件
        myLabel.addEventListener('click',()=>{
          this.loadHouseListData(value)
        })
        this.map.addOverlay(myLabel);  
      })
    }
  }
  // 点击小区：请求小区的房屋列表
  async loadHouseListData(id){
    // 1.根据小区的id 获取小区的房屋列表数据
    let res = await axios.get(`http://localhost:8080/houses?cityId=${id}`)
    console.log( res );
    // 2.解构请求获取的值 进行判断，有值才进行下面的渲染
    const {status,body} = res.data
    if(status === 200){
      this.setState({
        isShowHouseList : true,
        houseListData : body.list
      })
    }
  }
  // 渲染房屋列表数据
  renderHouse(){
    return this.state.houseListData.map((item,index)=>{
      return(
        <div className={styles.house} key={index}>
          <div className={styles.imgWrap}>
            <img
              className={styles.img}
              src={`http://localhost:8080${item.houseImg}`}
              alt=""
            />
          </div>
          <div className={styles.content}>
            <h3 className={styles.title}>
              {item.title}
            </h3>
            <div className={styles.desc}>{item.desc}</div>
            <div>
              {item.tags.map((items,i)=>{
                let tagClass = i<2?`tag${i + 1}`:`tag3`
                return(
                  <span key={i} className={[styles.tag, styles[tagClass]].join(' ')}>
                    {items}
                  </span>
                )
              })}
            </div>
            <div className={styles.price}>
              <span className={styles.priceNum}>{item.price}</span> 元/月
            </div>
          </div>
        </div>
      )
    })
  }
  // 地图初始渲染封装
  mapRender(longitude,latitude,left=-35,top=-35){
    const BMap = window.BMap
    const point = new BMap.Point(longitude,latitude)
    // 添加文本覆盖物
    var opts = {
      position : point,    // 指定文本标注所在的地理位置
      offset   : new BMap.Size(left, top)    //设置文本偏移量
    }
    var myLabel = new BMap.Label("欢迎使用百度地", opts);  // 创建文本标注对象
    myLabel.setStyle({
      height : "0",
      lineHeight : "0",
      border:'none'
    });
    // console.log( point );
    return {point,myLabel}
  }
}

// 3.导出组件
export default Map