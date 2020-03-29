// 1.引入核心包
import React from 'react'
import {NavBar} from 'antd-mobile'
import {withRouter} from 'react-router-dom'
import PropTypes from 'prop-types'
import styles from './index.module.scss'
// 2.类组件
class NavHeader extends React.Component{
  render(){
    const {className} = this.props
    return(
      <div className={styles['nav-header'] +' '+ className}>
        <NavBar
          mode="light"
          icon={<i className="iconfont icon-back"></i>}
          // onLeftClick={() => this.props.props.history.goBack()}
          onLeftClick={() => this.props.history.goBack()}
          rightContent={[]}
        >{this.props.children}
        </NavBar>
      </div>
    )
  }
}
// 添加校验规则
NavHeader.propTypes = {
  children:PropTypes.string.isRequired
}
NavHeader = withRouter(NavHeader)

// 3.导出组件
export default NavHeader