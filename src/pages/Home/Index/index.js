import React from "react";
import { Carousel } from "antd-mobile";
import axios from "axios";
import "./index.scss";
import { getLocalCity } from "utils/index";
import SeachHeader from "common/SeachHeader";
//导入静态图片资源
import nav1 from "assets/images/nav-1.png";
import nav2 from "assets/images/nav-2.png";
import nav3 from "assets/images/nav-3.png";
import nav4 from "assets/images/nav-4.png";
export default class Index extends React.Component {
  state = {
    //轮播图列表
    SwiperList: [],
    imgHeight: (212 / 375) * window.innerWidth,
    //租房小组列表
    groupList: [],
    //资讯列表
    newsList: [],
    //城市信息
    city: {
      label: "北京",
      value: ""
    }
  };
  //挂载时的钩子函数
  async componentDidMount() {
    //轮播图
    this.getSwpers();
    //获取城市名称
    const res = await getLocalCity();
    this.setState(
      {
        city: res
      },
      () => {
        //租房小组
        this.getGroup();
        //资讯列表
        this.getNews();
      }
    );
  }
  //发送轮播图列表数据
  async getSwpers() {
    const res = await axios.get("http://localhost:8080/home/swiper");
    const { status, body } = res.data;
    if (status === 200) {
      this.setState({
        SwiperList: body
      });
    }
  }
  //发送租房小组请求
  async getGroup() {
    const res = await axios.get("http://localhost:8080/home/groups", {
      params: { area: this.state.city.value }
    });
    const { status, body } = res.data;
    if (status === 200) {
      this.setState({
        groupList: body
      });
    }
  }
  //发送资讯列表请求
  async getNews() {
    const res = await axios.get("http://localhost:8080/home/news", {
      params: { area: this.state.city.value }
    });
    const { status, body } = res.data;
    if (status === 200) {
      this.setState({
        newsList: body
      });
    }
  }
  //轮播图列表
  getSwpersList() {
    if (this.state.SwiperList.length > 0) {
      return (
        <Carousel autoplay infinite>
          {this.state.SwiperList.map(item => (
            <a
              key={item.id}
              href="http://www.alipay.com"
              style={{
                display: "inline-block",
                width: "100%",
                height: this.state.imgHeight
              }}
            >
              <img
                src={`http://localhost:8080${item.imgSrc}`}
                alt={item.alt}
                style={{ width: "100%", verticalAlign: "top" }}
                onLoad={() => {
                  window.dispatchEvent(new Event("resize"));
                  this.setState({ imgHeight: "auto" });
                }}
              />
            </a>
          ))}
        </Carousel>
      );
    } else {
      return null;
    }
  }
  //租房小组列表
  getGroupList() {
    if (this.state.groupList.length > 0) {
      return (
        <div className="group-main">
          {this.state.groupList.map(group => {
            return (
              <div key={group.id} className="content">
                <div className="left">
                  <div className="title">{group.title}</div>
                  <div className="desc">{group.desc}</div>
                </div>
                <div className="right">
                  <img src={`http://localhost:8080${group.imgSrc}`} alt="" />
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  }
  //资讯列表
  getNewsList() {
    if (this.state.newsList.length > 0) {
      return (
        <div className="news-main">
          {this.state.newsList.map((item, i) => {
            return (
              <div
                className="content"
                key={item.id}
                style={
                  i + 1 === this.state.newsList.length ? { border: "none" } : {}
                }
              >
                <div className="left">
                  <img src={"http://localhost:8080" + item.imgSrc} alt="" />
                </div>
                <div className="right">
                  <div className="title">{item.title}</div>
                  <div className="detai">
                    <div className="from">{item.from}</div>
                    <div className="date">{item.date}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return null;
    }
  }
  render() {
    return (
      <div className="index">
        {/* 轮播图区域 */}
        <div className="swiper" style={{ height: this.state.imgHeight }}>
          {/* 搜索栏 */}
          <SeachHeader cityName={this.state.city.label}></SeachHeader>
          {this.getSwpersList()}
        </div>
        {/* 导航 */}
        <div className="nav">
          <ul>
            <li onClick={() => this.props.history.push("/home/consul")}>
              <img src={nav1} alt="" />
              <p>整租</p>
            </li>
            <li onClick={() => this.props.history.push("/home/consul")}>
              <img src={nav2} alt="" />
              <p>合租</p>
            </li>
            <li onClick={() => this.props.history.push("/map")}>
              <img src={nav3} alt="" />
              <p>地图找房</p>
            </li>
            <li onClick={() => this.props.history.push("/rent")}>
              <img src={nav4} alt="" />
              <p>去出租</p>
            </li>
          </ul>
        </div>
        {/* 租房小组 */}
        <div className="group">
          <div className="group-title">
            <div className="left">租房小组</div>
            <div className="right">更多</div>
          </div>
          {this.getGroupList()}
        </div>
        {/* 最新资讯 */}
        <div className="news">
          <div className="news-title">最新资讯</div>
          {this.getNewsList()}
        </div>
      </div>
    );
  }
}
