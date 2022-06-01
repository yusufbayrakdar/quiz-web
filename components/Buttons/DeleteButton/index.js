import { faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Popconfirm } from "antd";
import React from "react";

function DeleteButton({ onConfirm, style, loading }) {
  return (
    <Popconfirm
      placement="bottomLeft"
      title="Silmek istediğinizden emin misiniz?"
      okText="Evet"
      cancelText="Hayır"
      onConfirm={onConfirm}
      disabled={loading}
    >
      <Button
        danger
        type="text"
        className="center"
        style={{ borderRadius: "50%", ...style }}
      >
        <FontAwesomeIcon
          icon={faTrashAlt}
          width={12}
          style={{ position: "absolute" }}
        />
      </Button>
    </Popconfirm>
  );
}

export default DeleteButton;
