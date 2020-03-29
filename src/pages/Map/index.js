// 1.引入核心包
import React from 'react'
import NavHeader from '../../components/NavHeader'
import styles from './index.module.scss'
import {getCurrentCity} from '../../utils'
import axios from 'axios'
// 引入加载组件
import {Toast} from 'antd-mobile'
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
        <NavHeader className={styles.myNavbar}>地图找房</NavHeader>
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

    // 2.创建地图实例
    const BMap = window.BMap
    var map = new BMap.Map("container");
    this.map = map
    // 监听缩放比例
    map.addEventListener('zoomend',(e)=>{
      var ZoomNum = map.getZoom()
      console.log( '滚动缩放比例',ZoomNum );
    })
    // 添加平移缩放控件
    map.addControl(new BMap.NavigationControl())

    // 给 地图注册一个事件
    map.addEventListener('movestart',()=>{
      if(this.state.isShowHouseList){
        console.log( '移动了' );
        this.setState({
          isShowHouseList:false
        })
      }

    })
    // 3.创建地址解析器实例
    var myGeo = new BMap.Geocoder();
    // 将地址解析结果显示在地图上,并调整地图视野
    myGeo.getPoint(label, point=>{
      if (point) {
        map.centerAndZoom(point, 11);
        // 渲染覆盖物 - 区
        this.renderOverlays(value)        
      }else{
        console.log("您选择地址没有解析到结果!");
      }
    }, label);
  }

  // --------------------被封装的部分 start-----------------
  
  /**
   *  封装方法1：渲染覆盖物-(区 镇 小区)
   * 区：传递 市的id => 渲染 区的覆盖物
   * 镇：传递 区的id => 渲染 镇的覆盖物
   * 小区：传递 镇的id => 渲染 小区的覆盖物
   */
  async renderOverlays(id){
    Toast.loading('loading...',0)
    // 1.根据id值获取 所有的区
    let res = await axios.get(`http://localhost:8080/area/map?id=${id}`)
    // console.log( res );

    // 手动隐藏加载框
    Toast.hide()
    
    // 3.计算类型 和下一次的缩放级别
    const {type,nextZoom} = this.getTaypeAndNextZoom()
    console.log( '类型:',type,'下一次缩放级别:',nextZoom );
    // 2.解构请求获取的值 进行判断，有值才进行下面的渲染
    const {status,body} = res.data
    if(status === 200){
      // 遍历
      body.forEach(item =>{
        this.createOverlays(item,type,nextZoom)
      })
    }
  }

  /**
   *  封装方法2：创建覆盖物
   */
  createOverlays(item,type,nextZoom){
    if(type === 'circle'){
      this.createCircle(item,nextZoom)
    }else{
      this.createRect(item)
    }
  }
  /**
   * 封装方法3：渲染圆覆盖物
   */
  createCircle(item,nextZoom){
    // 1.解构数据
    const {count,coord:{longitude,latitude},value,label} = item
    const BMap = window.BMap
    const point = new BMap.Point(longitude,latitude)
    // 2.创建文本覆盖物
    var opts = {
      position : point,    // 指定文本标注所在的地理位置
      offset   : new BMap.Size(-35, -35)    //设置文本偏移量
    }
    var myLabel = new BMap.Label("欢迎使用百度地", opts);  // 创建文本标注对象
    myLabel.setStyle({
      height : "0",
      lineHeight : "0",
      border:'none'
    });
    // 3.渲染
    myLabel.setContent(`
    <div class="${styles.bubble}">
      <p class="${styles.name}">${label}</p>
      <p >${count}套</p>
    </div>
    `)
    // 4.注册点击事件
    myLabel.addEventListener('click',()=>{
      // console.log( '111' );
      // 1.修改缩放级别
      this.map.centerAndZoom(point, nextZoom);
      // 2.清除区的覆盖物
      setTimeout(()=>{
        this.map.clearOverlays()
      },0)
      // 3.渲染镇的覆盖物
      this.renderOverlays(value)
    })
    this.map.addOverlay(myLabel);  
  }

  /**
   * 封装方法4：渲染方覆盖物
   */
  createRect(item){
    // 1.解构数据
    const {count,coord:{longitude,latitude},value,label} = item
    const BMap = window.BMap
    const point = new BMap.Point(longitude,latitude)
    // 2.创建文本覆盖物
    var opts = {
      position : point,    // 指定文本标注所在的地理位置
      offset   : new BMap.Size(-50, -14)    //设置文本偏移量
    }
    var myLabel = new BMap.Label("欢迎使用百度地", opts);  // 创建文本标注对象
    myLabel.setStyle({
      height : "0",
      lineHeight : "0",
      border:'none'
    });

    // 3.渲染
    myLabel.setContent(`
    <div class="${styles.rect}">
      <span class="${styles.housename}">${label}</span>
      <span class="${styles.housename}">${count}套</span>
      <i class="${styles.arrow}"></i>
    </div>
    `)
    // 4.注册点击事件
    // debugger
    myLabel.addEventListener('click',(e)=>{
      this.loadHouseListData(value)
      let x = e.changedTouches[0].clientX - (window.innerWidth/2)
      let y = e.changedTouches[0].clientY - 50 - (window.innerHeight-330-50)/2
      // console.log( clientX );
      // console.log( clientY );
      // 偏移
      this.map.panBy(-x,-y)
    })
    this.map.addOverlay(myLabel);  
  }
    /**
   *  封装方法5：计算类型和下一次缩放级别
   */
  getTaypeAndNextZoom(){
    // 11 13 =>圆 circle
    // 15    =>方 rect
    // 1.获取当前类型
    let curZoom = this.map.getZoom()
    // 覆盖物类型
    let type =''
    // 下一次缩放级别
    let nextZoom
    console.log( '当前缩放级别',curZoom );

    // 2.判断
    if(curZoom >10 && curZoom <= 12){
      type='circle'
      nextZoom = 13
    }else if(curZoom >12 && curZoom <= 14){
      type='circle'
      nextZoom = 15
    }else{
      type='rect'
    }
    return {type,nextZoom}
  }

  // --------------------被封装的部分 end-----------------

  // 点击小区：请求小区的房屋列表
  async loadHouseListData(id){
    Toast.loading('loading...',0)
    // 1.根据小区的id 获取小区的房屋列表数据
    let res = await axios.get(`http://localhost:8080/houses?cityId=${id}`)
    // 手动隐藏加载框
    Toast.hide()
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
}

// 3.导出组件
export default Map