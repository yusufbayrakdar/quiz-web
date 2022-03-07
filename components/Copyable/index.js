import React from "react";
import { Typography } from "antd";
import { CheckOutlined, CopyOutlined } from "@ant-design/icons";
const { Paragraph } = Typography;

export default function Copyable({
  text = null,
  children,
  className = "",
  style = {},
  iconStyle = {
    marginLeft: 4,
    marginBottom: 2,
    fontSize: 16,
  },
}) {
  return (
    <Paragraph
      className={className}
      style={{ margin: "auto", ...style }}
      copyable={{
        icon: [
          <CopyOutlined style={iconStyle} />,
          <CheckOutlined style={iconStyle} />,
        ],
        tooltips: ["copy", "copied"],
        text: text || (typeof children === "string" && children),
      }}
    >
      {children}
    </Paragraph>
  );
}
