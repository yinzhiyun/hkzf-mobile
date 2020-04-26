import React from "react";
import "./index.scss";
//配置子路由信息
import { Route, NavLink, Switch } from "react-router-dom";
import { TabBar } from "antd-mobile";
import Index from "./Index/index";
import Find from "./Find";
import Consul from "./Consul";
import Profile from "./Profile";
const tabs = [
  {
    title: "首页",
    icon: "icon-ind",
    path: "/home"
  },
  {
    title: "找房",
    icon: "icon-findHouse",
    path: "/home/find"
  },
  {
    title: "咨讯",
    icon: "icon-infom",
    path: "/home/consul"
  },
  {
    title: "我的",
    icon: "icon-my",
    path: "/home/profile"
  }
];
class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTab: this.props.location.pathname
    };
  }
  //结构更新完成后的钩子函数
  componentDidUpdate(derprops) {
    if (derprops.location.pathname !== this.props.location.pathname) {
      this.setState({
        selectedTab: this.props.location.pathname
      });
    }
  }
  render() {
    //使用andt-mobile
    return (
      <div className="home">
        <Switch>
          <Route exact path="/home" component={Index}></Route>
          <Route path="/home/find" component={Find}></Route>
          <Route path="/home/consul" component={Consul}></Route>
          <Route path="/home/profile" component={Profile}></Route>
        </Switch>
        <div className="tarbar">
          <TabBar unselectedTintColor="#999" tintColor="#21B97A">
            {tabs.map(item => {
              return (
                <TabBar.Item
                  title={item.title}
                  key={item.title}
                  icon={<span className={"iconfont " + item.icon} />}
                  selectedIcon={<span className={"iconfont " + item.icon} />}
                  selected={this.state.selectedTab === item.path}
                  onPress={() => {
                    this.setState({
                      selectedTab: item.path
                    });
                    this.props.history.push(item.path);
                  }}
                  data-seed="logId"
                ></TabBar.Item>
              );
            })}
          </TabBar>
        </div>
      </div>
    );
    //导航
    /*  return (
      <div className="home">
        
        <div className="tarbar">
          <ul>
            <li>
              <NavLink exact to="/home">
                <span className="iconfont icon-ind"></span>
                <p>首页</p>
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/home/find">
                <span className="iconfont icon-findHouse"></span>
                <p>找房</p>
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/home/consul">
                <span className="iconfont icon-infom"></span>
                <p>咨讯</p>
              </NavLink>
            </li>
            <li>
              <NavLink exact to="/home/profile">
                <span className="iconfont icon-my"></span>
                <p>我的</p>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    ); */
  }
}
export default Home;
