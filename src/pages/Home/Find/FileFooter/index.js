import React from "react";
import { Flex } from "antd-mobile";
import styles from "./index.module.scss";
import classNames from "classnames";
import PropTypes from "prop-types";
class FilterFooter extends React.Component {
  static propTypes = {
    cancelText: PropTypes.string,
    confirmText: PropTypes.string
  };
  static defaultProps = {
    cancelText: "取消",
    confirmText: "确定"
  };
  render() {
    const {
      className,
      cancelText,
      confirmText,
      onCance,
      onConfirm
    } = this.props;
    return (
      // 不能把className给丢掉
      <Flex className={classNames(styles["filter-footer"], className)}>
        {/* 取消按钮 */}
        <span className="btn cancel" onClick={onCance}>
          {cancelText}
        </span>
        {/* 确定按钮 */}
        <span className="btn ok" onClick={onConfirm}>
          {confirmText}
        </span>
      </Flex>
    );
  }
}

export default FilterFooter;
