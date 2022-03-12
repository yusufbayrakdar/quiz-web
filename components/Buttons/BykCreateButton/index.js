import React from "react";
import { Button, Row } from "antd";
import { PlusCircleOutlined } from "@ant-design/icons";

function BykCreateButton({
  style = {},
  onClick,
  shape,
  children,
  loading,
  disabled,
}) {
  return (
    <Button
      loading={loading}
      disabled={disabled}
      shape={shape}
      style={style}
      type="primary"
      onClick={onClick}
    >
      <Row style={{ display: "flex", alignItems: "center" }}>
        <PlusCircleOutlined style={{ marginRight: 8 }} />
        {children || "Oluştur"}
      </Row>
    </Button>
  );
}

export default BykCreateButton;
