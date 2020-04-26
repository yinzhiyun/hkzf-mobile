import React from "react";
import { Flex } from "antd-mobile";
import styles from "./index.module.scss";
import classNames from "classnames";
// 条件筛选栏标题数组：
const titleList = [
  { title: "区域", type: "area" },
  { title: "方式", type: "mode" },
  { title: "租金", type: "price" },
  { title: "筛选", type: "more" }
];
class FilterTitle extends React.Component {
  render() {
    const { titleSelectedStatus, onChange } = this.props;
    return (
      <Flex align="center" className={styles["filter-title"]}>
        {titleList.map(item => {
          return (
            <Flex.Item key={item.type}>
              {/* 选中类名： selected */}
              <span
                className={classNames("dropdown", {
                  selected: titleSelectedStatus[item.type]
                })}
                onClick={() => onChange(item.type)}
              >
                <span>{item.title}</span>
                <i className="iconfont icon-arrow" />
              </span>
            </Flex.Item>
          );
        })}
      </Flex>
    );
  }
}

export default FilterTitle;
