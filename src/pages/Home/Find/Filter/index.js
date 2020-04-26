import React from "react";
import styles from "./index.module.scss";
import FilterTitle from "../FilterTitle";
import FilterPicker from "../FilterPicker";
import FilterMore from "../FilterMore";
import { getLocalCity } from "utils";
import http from "utils/http";
class Filter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      //选中的标题
      titleSelectedStatus: {
        // area: 区域  mode:方式  price:租金 more:筛选
        // true代表高亮 false代表不亮
        area: false,
        mode: false,
        price: false,
        more: false
      },
      openType: "",
      //条件筛选数据
      filtersList: {},
      //默认选中项
      selectedValues: {
        area: ["area", "null"],
        mode: ["null"],
        price: ["null"],
        more: []
      }
    };
  }
  async componentDidMount() {
    const city = await getLocalCity();
    const res = await http.get(`/houses/condition?id=${city.value}`);
    const { status, body } = res.data;
    if (status === 200) {
      this.setState({
        filtersList: body
      });
    }
  }
  //控制filtertitle高亮
  onChange = type => {
    const newTitle = { ...this.state.titleSelectedStatus };
    newTitle[type] = true;
    this.setState({
      titleSelectedStatus: newTitle,
      openType: type
    });
  };
  //点击footer取消设置
  onCance = () => {
    this.setState({
      openType: ""
    });
  };
  //点击确认设置
  onConfirm = value => {
    const { selectedValues, openType } = this.state;
    const newselectedValues = { ...selectedValues };
    newselectedValues[openType] = value;
    this.setState({
      selectedValues: newselectedValues,
      openType: ""
    });
  };
  render() {
    const { titleSelectedStatus } = this.state;
    return (
      <div className={styles.filter}>
        {this.state.openType === "area" ||
        this.state.openType === "mode" ||
        this.state.openType === "price" ? (
          <div className="mask" onClick={this.onCance} />
        ) : null}
        <div className="content">
          {/* filter组件的内容 */}
          <FilterTitle
            titleSelectedStatus={titleSelectedStatus}
            onChange={this.onChange}
          ></FilterTitle>
          {this.renderFilterPicker()}
          {/* <FilterMore></FilterMore> */}
        </div>
      </div>
    );
  }
  renderFilterPicker() {
    const { openType, filtersList, selectedValues } = this.state;
    if (openType === "more" || openType == "") {
      return null;
    }
    let data, cols, defaultValue;
    if (openType === "area") {
      data = [filtersList.area, filtersList.subway];
      cols = 3;
      defaultValue = selectedValues["area"];
    } else if (openType === "mode") {
      data = filtersList.rentType;
      cols = 1;
      defaultValue = selectedValues["mode"];
    } else if (openType === "price") {
      data = filtersList.price;
      cols = 1;
      defaultValue = selectedValues["price"];
    }
    console.log(defaultValue);
    return (
      <FilterPicker
        onCance={this.onCance}
        data={data}
        cols={cols}
        onConfirm={this.onConfirm}
        selectedValues={defaultValue}
      ></FilterPicker>
    );
  }
}
export default Filter;
