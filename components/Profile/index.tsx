import React from "react";
import { useSelector } from "react-redux";
import { Col, Row, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";

import { RootState } from "../../redux/configureStore";

function index() {
  const instructor = useSelector((state: RootState) => state.auth.instructor);
  const student = useSelector((state: RootState) => state.auth.student);

  if (!student && !instructor) return null;
  const { firstName, lastName, nickname, phone, confirmed } =
    instructor || student;

  const renderIcon = () => {
    return confirmed ? (
      <Tooltip title="Onaylı eğitmen" placement="left">
        <CheckCircleOutlined className="text-green-500 justify-self-center bg-white rounded-full" />
      </Tooltip>
    ) : (
      <Tooltip title="Yöneticinin onayı bekleniyor" placement="left">
        <WarningOutlined
          className="text-yellow-500 justify-self-center bg-white"
          style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
        />
      </Tooltip>
    );
  };

  return (
    <Row
      className="rounded-lg p-1 cursor-pointer"
      style={{ borderWidth: 1, borderColor: "rgba(243, 244, 246, 0.3)" }}
    >
      <div className="relative rounded-full flex justify-center items-center w-10 h-10 mr-1 bg-gray-300">
        <UserOutlined style={{ fontSize: 20 }} className="text-white" />
        <div className="absolute bottom-0 left-0">
          {typeof confirmed === "boolean" && renderIcon()}
        </div>
      </div>
      <Col>
        <div className="font-bold text-white gBold">
          {firstName} {lastName}
        </div>
        <div className="text-gray-100 font-light text-xs gMed">
          {(nickname && `@${nickname}`) || phone}
        </div>
      </Col>
    </Row>
  );
}

export default index;
