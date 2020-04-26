import React from "react";
import style from "./index.module.scss";
import NavHeader from "common/NavHeader";
import { getLocalCity } from "utils";
import { BASE_URL } from "utils/config";
import { Toast } from "antd-mobile";
import axios from "axios";
export default class Map extends React.Component {
  state = {
    isshow: false,
    HouseList: []
  };
  async componentDidMount() {
    //将地图挂载到对应的容器
    const map = new window.BMap.Map("container");
    this.map = map;
    // 创建地址解析器实例
    var myGeo = new window.BMap.Geocoder();
    const city = await getLocalCity();
    myGeo.getPoint(
      city.label,
      point => {
        //设置地图初始化中心点及级别
        map.centerAndZoom(point, 11);
        //添加控件
        map.addControl(new window.BMap.ScaleControl());
        map.addControl(new window.BMap.NavigationControl());
        //注册事件
        map.addEventListener("movestart", () => {
          if (this.state.isshow) {
            this.setState({
              isshow: false
            });
          }
        });
        //渲染地图覆盖物
        this.renderAreaMap(city.value);
      },
      city.label
    );
  }
  //发送请求渲染
  async renderAreaMap(id) {
    Toast.loading("加载中", 0);
    const res = await axios.get("http://localhost:8080/area/map", {
      params: { id: id }
    });
    const { type, nextZoom } = this.addTypeAndZoom();
    const { status, body } = res.data;
    if (status === 200) {
      Toast.hide();
      body.forEach(item => {
        if (type === "citry") {
          this.getCitry(item, nextZoom);
        } else {
          this.getRect(item, nextZoom);
        }
      });
    }
  }
  //渲染圆形结构
  getCitry(item, nextZoom) {
    //设置坐标点
    const point = new window.BMap.Point(
      item.coord.longitude,
      item.coord.latitude
    );
    // 创建文本标注对象
    var label = new window.BMap.Label(
      `<div class="bubble">
        <p class="name">${item.label}</p>
        <p>${item.count}套</p>
      </div>`,
      {
        position: point,
        offset: new window.BMap.Size(-35, -35)
      }
    );
    // 设置label的样式
    label.setStyle({
      border: "none",
      padding: 0
    });
    //给label注册事件
    label.addEventListener("click", () => {
      window.setTimeout(() => {
        this.map.clearOverlays();
        this.map.centerAndZoom(point, nextZoom);
        this.renderAreaMap(item.value);
      }, 0);
    });
    // 把文字覆盖物添加到地图上
    this.map.addOverlay(label);
  }
  //渲染方形结构
  getRect(item, nextZoom) {
    //设置坐标点
    const point = new window.BMap.Point(
      item.coord.longitude,
      item.coord.latitude
    );
    // 创建文本标注对象
    var label = new window.BMap.Label(
      `<div class="rect">
        <span class="housename">${item.label}</span>
        <span class="housenum">${item.count} 套</span>
        <i class="arrow"></i>
      </div>`,
      {
        position: point,
        offset: new window.BMap.Size(-50, -22)
      }
    );
    // 设置label的样式
    label.setStyle({
      border: "none",
      padding: 0
    });
    //给label注册事件
    label.addEventListener("click", e => {
      const x = window.innerWidth / 2 - e.changedTouches[0].pageX;
      const y =
        (window.innerHeight - 330 - 45) / 2 - (e.changedTouches[0].pageY - 45);
      this.map.panBy(x, y);
      Toast.loading("加载中...", 0);
      axios
        .get("http://localhost:8080/houses", {
          params: {
            cityId: item.value
          }
        })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              HouseList: res.data.body.list,
              isshow: true
            });
            Toast.hide();
          }
        });
    });
    // 把文字覆盖物添加到地图上
    this.map.addOverlay(label);
  }
  //判断类型渲染
  addTypeAndZoom() {
    const zoom = this.map.getZoom();
    let type, nextZoom;
    if (zoom === 11) {
      type = "citry";
      nextZoom = 13;
    } else if (zoom == 13) {
      type = "citry";
      nextZoom = 15;
    } else {
      type = "rect";
      nextZoom = 15;
    }
    return {
      type,
      nextZoom
    };
  }
  //渲染房屋列表
  renderHouseList() {
    return (
      <div className={`houseList ${this.state.isshow ? "show" : ""}`}>
        <div className="titleWrap">
          <h1 className="listTitle">房屋列表</h1>
          <a className="titleMore" href="/house/list">
            更多房源
          </a>
        </div>
        <div className="houseItems">
          {this.state.HouseList.map(item => {
            return (
              <div className="house" key={item.houseCode}>
                <div className="imgWrap">
                  <img className="img" src={BASE_URL + item.houseImg} alt="" />
                </div>
                <div className="content">
                  <h3 className="title">{item.title}</h3>
                  <div className="desc">{item.desc}</div>
                  <div>
                    {item.tags.map((tag, index) => {
                      return (
                        <span
                          key={tag}
                          className={"tag tag" + ((index % 3) + 1)}
                        >
                          {tag}
                        </span>
                      );
                    })}
                  </div>
                  <div className="price">
                    <span className="priceNum">{item.price}</span> 元/月
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  render() {
    return (
      <div className={style.map}>
        <NavHeader>地图找房</NavHeader>
        <div id="container"></div>
        {/* 房源列表 */}
        {this.renderHouseList()}
      </div>
    );
  }
}
