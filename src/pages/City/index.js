import React from "react";
import { Toast } from "antd-mobile";
import style from "./index.module.scss";
import axios from "axios";
import http from "utils/http";
import { getLocalCity } from "utils/index";
import { AutoSizer, List } from "react-virtualized";
import NavHeader from "common/NavHeader";
export default class City extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cityObj: {},
      cityIndex: [],
      currentIndex: 0
    };
    this.ListRef = React.createRef();
  }
  componentDidMount() {
    //城市列表
    this.getCityList();
  }

  //请求城市列表
  async getCityList() {
    const res = await http.get("/area/city?level=1");
    const { status, body } = res.data;
    if (status === 200) {
      const { ArrObj, CityIndex } = this.parsetCity(body);
      //添加热门城市
      const result = await http.get("/area/hot");
      ArrObj.hot = result.data.body;
      CityIndex.unshift("hot");
      //添加定位城市
      const city = await getLocalCity();
      CityIndex.unshift("#");
      ArrObj["#"] = [city];
      this.setState(
        {
          cityObj: ArrObj,
          cityIndex: CityIndex
        },
        () => {
          this.ListRef.current.measureAllRows();
        }
      );
    }
  }
  //处理城市列表数据
  parsetCity(body) {
    const ArrObj = {};
    body.forEach(item => {
      const key = item.short.slice(0, 1);
      if (ArrObj[key]) {
        ArrObj[key].push(item);
      } else {
        ArrObj[key] = [item];
      }
    });
    const CityIndex = Object.keys(ArrObj).sort();
    return {
      ArrObj,
      CityIndex
    };
  }
  //点击切换城市
  qieCity(city) {
    const isArr = ["北京", "上海", "深圳", "广州"];
    if (isArr.includes(city.label)) {
      localStorage.setItem("city_item", JSON.stringify(city));
      this.props.history.go(-1);
    } else {
      Toast.info("该城市暂无房源数据", 1);
    }
  }
  //城市列表渲染结构
  rowRenderer({ key, index, style }) {
    let title = this.state.cityIndex[index];
    const cityList = this.state.cityObj[title];
    if (title === "#") {
      title = "当前定位";
    } else if (title === "hot") {
      title = "热门城市";
    } else {
      title = title.toUpperCase();
    }
    return (
      <div key={key} style={style}>
        <div className="title">{title}</div>
        {cityList.map(item => {
          return (
            <div
              className="name"
              key={item.value}
              onClick={this.qieCity.bind(this, item)}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    );
  }
  //动态获取每一行的高度
  getCityHeight({ index }) {
    const { cityIndex, cityObj } = this.state;
    // 获取到需要显示的标题
    const title = cityIndex[index];
    // 获取需要显示的城市列表
    const list = cityObj[title];
    //每行的title的高度 + 每行name的高度 * 当前渲染行的大小
    return 36 + 50 * list.length;
  }
  //每次滚动行发生改变是的回调
  onRowsRendered({ startIndex }) {
    if (startIndex !== this.state.currentIndex) {
      this.setState({
        currentIndex: startIndex
      });
    }
  }
  //处理点击右边栏同步城市
  handelClick(index) {
    this.ListRef.current.scrollToRow(index);
  }
  render() {
    return (
      <div className={style.city}>
        {/* 头部导航 */}
        <NavHeader>城市选择</NavHeader>
        {/* 城市列表 */}
        <AutoSizer>
          {({ width, height }) => {
            return (
              <List
                ref={this.ListRef}
                width={width}
                height={height}
                //渲染的行数
                rowCount={this.state.cityIndex.length}
                //每行的高度
                rowHeight={this.getCityHeight.bind(this)}
                //渲染的结构
                rowRenderer={this.rowRenderer.bind(this)}
                //滚动时触发的函数
                onRowsRendered={this.onRowsRendered.bind(this)}
                //设置指定定位行的对齐方式
                scrollToAlignment="start"
              />
            );
          }}
        </AutoSizer>
        {/* 右侧栏 */}
        <ul className="city-index">
          {this.state.cityIndex.map((item, i) => {
            return (
              <li key={item} className="city-index-item">
                <span
                  className={
                    i === this.state.currentIndex ? "index-active" : ""
                  }
                  onClick={this.handelClick.bind(this, i)}
                >
                  {item === "hot" ? "热" : item.toUpperCase()}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }
}
