// 把key 处理为常量
const HKZF_CITY = 'hkzf_city'
// 保存定位城市
const setCity = city => localStorage.setItem(HKZF_CITY,JSON.stringify(city))

// 获取定位城市
const getCity = () => JSON.parse(localStorage.getItem(HKZF_CITY))

// 导出
export {setCity,getCity}