/**
 * 封装定位城市
 */
import axios from 'axios'
// 导入封装的本地操作城市组件
import {getCity,setCity} from './city'
function getCurrentCity(callback){
  // 0.先尝试从本地获取定位城市
  let currentCity = getCity()
  // 判断本地是否存储定位城市
  if(!currentCity){
    // console.log( '没有值' );
    // 1.创建 promise 实例
    // 成功走 resolve,失败走reject
    let p = new Promise((resolve,reject)=>{
      const BMap = window.BMap
      // 1.拿到地图实例
      var City = new BMap.LocalCity();
      // 2.调get方法获取城市名称
      City.get(async (res)=>{
        // console.log( '定位城市:',res );
        // 3.验证定位城市是否有房源
        let city = await axios.get('http://localhost:8080/area/info',{
          params:{
            name:res.name
          }
        })
        const {status,body} = city.data  
        if(status === 200){
          // 封装保存到本地
          // localStorage.setItem('city',JSON.stringify(body))
          setCity(body)
          // 返回
          resolve(body)
        }
      })
    })
    // 2.返回 promise 实例
    return p
  }else{
    // console.log( '有值' );
    // let p = new Promise((resolve,reject)=>{
    //   resolve(currentCity)
    // })
    return Promise.resolve(currentCity)
  }
}

export { getCurrentCity }
// 导出本地存取定位城市组件
export { getCity,setCity }

// ***********************************************
// const BMap = window.BMap
// // 1.拿到地图实例
// var City = new BMap.LocalCity();
// // 2.调get方法获取城市名称
// City.get(async (res)=>{
//   // console.log( '定位城市:',res );
//   // 3.验证定位城市是否有房源
//   let res1 = await axios.get('http://localhost:8080/area/info',{
//     params:{
//       name:res.name
//     }
//   })
//   // console.log( res1 );
//   const {status,body} = res1.data  
//   if(status === 200){
//     callback && callback(body)
//   }
// })