import React from "react";
import { withRouter } from "react-router-dom";
import style from "./index.module.scss";
import PropTypes from "prop-types";
class SeachHeader extends React.Component {
  static propTypes = {
    cityName: PropTypes.string.isRequired
  };
  render() {
    return (
      <div className={[style.search, this.props.className].join(" ")}>
        <div className="search-main">
          <div
            className="address"
            onClick={() => this.props.history.push("/city")}
          >
            {this.props.cityName}
            <span className="iconfont icon-arrow"></span>
          </div>
          <div className="input">
            <span className="iconfont icon-seach"></span>
            <span className="text">请输入小区地址</span>
          </div>
        </div>
        <div
          className="search-icon"
          onClick={() => this.props.history.push("/map")}
        >
          <span className="iconfont icon-map"></span>
        </div>
      </div>
    );
  }
}
export default withRouter(SeachHeader);
