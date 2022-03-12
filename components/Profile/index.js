import React from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Col, Row, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { BASE_ENDPOINT } from "../../utils";

function Profile() {
  const router = useRouter();
  const instructor = useSelector((state) => state.auth.instructor);
  const student = useSelector((state) => state.auth.student);

  if (!student && !instructor) return null;
  const { firstName, lastName, nickname, phone, confirmed } =
    instructor || student;

  const renderIcon = () => {
    return confirmed ? (
      <Tooltip title="Onaylı eğitmen" placement="left">
        <CheckCircleOutlined className="confirmed-icon" />
      </Tooltip>
    ) : (
      <Tooltip title="Yöneticinin onayı bekleniyor" placement="left">
        <WarningOutlined className="warning-icon" />
      </Tooltip>
    );
  };

  return (
    <Styled onClick={() => router.push(BASE_ENDPOINT.profile)}>
      <div className="user-circle center">
        <UserOutlined className="user-icon" />
        <div className="status-icon">
          {typeof confirmed === "boolean" && renderIcon()}
        </div>
      </div>
      <Col>
        <div className="user-name gBold">
          {firstName} {lastName}
        </div>
        <div className="user-identity gMed">
          {(nickname && `@${nickname}`) || phone}
        </div>
      </Col>
    </Styled>
  );
}

const Styled = styled(Row)`
  border-radius: 8px;
  padding: 4px;
  cursor: pointer;
  border: ${({ theme }) => theme.colors.transparentGray} 1px solid;

  .user-circle {
    border-radius: 50%;
    width: 40px;
    height: 40px;
    margin-right: 4px;
    background-color: ${({ theme }) => theme.colors.darkGray};
    position: relative;
    .user-icon {
      font-size: 20px;
      color: ${({ theme }) => theme.colors.white};
    }
    .status-icon {
      position: absolute;
      bottom: -3px;
      left: 0px;
    }
    .confirmed-icon {
      color: ${({ theme }) => theme.colors.green};
      background-color: ${({ theme }) => theme.colors.white};
      border-radius: 50%;
    }
    .warning-icon {
      color: ${({ theme }) => theme.colors.yellow};
      background-color: ${({ theme }) => theme.colors.white};
      clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    }
  }
  .user-name {
    font-weight: 700;
    color: ${({ theme }) => theme.colors.white};
  }
  .user-identity {
    color: ${({ theme }) => theme.colors.gray};
    font-weight: 300;
    font-size: 12px;
    line-height: 14px;
  }
`;

export default Profile;
