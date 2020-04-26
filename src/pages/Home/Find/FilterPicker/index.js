import React from "react";
import { PickerView, Flex } from "antd-mobile";
import styles from "./index.module.scss";
import FlitFooter from "../FileFooter";
class FilterPicker extends React.Component {
  state = {
    value: this.props.selectedValues
  };
  handelChange = value => {
    this.setState({
      value: value
    });
  };
  render() {
    const { onCance, data, cols, onConfirm } = this.props;
    return (
      <div className={styles["filter-picker"]}>
        {/* 三级联动 */}
        <PickerView
          data={data}
          cols={cols}
          value={this.state.value}
          onChange={this.handelChange}
        />
        {/* 底部 */}
        <Flex className="filter-footer">
          <FlitFooter
            onCance={onCance}
            onConfirm={() => onConfirm(this.state.value)}
          ></FlitFooter>
        </Flex>
      </div>
    );
  }
}

export default FilterPicker;
