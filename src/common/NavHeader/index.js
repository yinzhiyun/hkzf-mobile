import React from "react";
import style from "./index.module.scss";
import { NavBar } from "antd-mobile";
//校验
import PropTypes from "prop-types";
//使用route高阶组件
import { withRouter } from "react-router-dom";
class NavHeader extends React.Component {
  static propTypes = {
    children: PropTypes.string.isRequired
  };
  render() {
    return (
      <div className={style.navbar}>
        <NavBar
          mode="light"
          icon={<span className="iconfont icon-back" />}
          onLeftClick={() => this.props.history.go(-1)}
        >
          {this.props.children}
        </NavBar>
      </div>
    );
  }
}
export default withRouter(NavHeader);
