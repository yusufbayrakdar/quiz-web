import React from "react";
import { useRouter } from "next/router";
import { Button } from "antd";
import { EditOutlined } from "@ant-design/icons";

export default function EditButton({
  _id,
  size = "default",
  type = "link",
  children,
  onClick,
  baseEndpoint,
  style = {},
}) {
  const router = useRouter();

  return (
    <Button
      size={size}
      style={{ color: "#daac0d", ...style }}
      type={type}
      onClick={
        onClick
          ? onClick
          : () => router.push(`${baseEndpoint}/form/${_id || ""}`)
      }
    >
      {children || "Edit"}
      <EditOutlined />
    </Button>
  );
}
