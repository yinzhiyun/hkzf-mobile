import React from "react";
import SeachHeader from "common/SeachHeader";
import { Flex } from "antd-mobile";
import style from "./index.module.scss";
import Filter from "./Filter";
export default class Find extends React.Component {
  render() {
    return (
      <div className={style.find}>
        <div className="find-title">
          <Flex className="search-wrapper">
            <span
              className="iconfont icon-back"
              onClick={() => this.props.history.go(-1)}
            />
            <SeachHeader cityName="上海" className="search"></SeachHeader>
          </Flex>
        </div>
        <Filter></Filter>
      </div>
    );
  }
}
