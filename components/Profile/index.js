import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { Col, Row, Tooltip } from "antd";
import {
  CheckCircleOutlined,
  UserOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

import { BASE_ENDPOINT, ROLES } from "../../utils";

function Profile() {
  const router = useRouter();
  const user = useSelector((state) => state.auth.user);

  if (!user) return null;
  const { fullName, nickname, phone, confirmed, role } = user;

  const StatusIcon = () => {
    if ([ROLES.ADMIN, ROLES.STUDENT].includes(role)) return null;
    return (
      <div className="status-icon">
        {confirmed ? (
          <Tooltip title="Onaylı eğitmen" placement="left">
            <CheckCircleOutlined className="confirmed-icon" />
          </Tooltip>
        ) : (
          <Tooltip title="Yöneticinin onayı bekleniyor" placement="left">
            <WarningOutlined className="warning-icon" />
          </Tooltip>
        )}
      </div>
    );
  };

  return (
    <Styled onClick={() => router.push(BASE_ENDPOINT.profile)}>
      <div className="user-circle center">
        {role === ROLES.ADMIN ? (
          <FontAwesomeIcon className="crown" icon={faCrown} width={20} />
        ) : (
          <UserOutlined className="user-icon" width={20} />
        )}
        <StatusIcon />
      </div>
      <Col>
        <div className="user-name gBold">{fullName}</div>
        <div className="user-identity gMed">
          {nickname ? `@${nickname}` : phone}
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
  min-width: 180px;

  .crown {
    color: ${({ theme }) => theme.colors.primary};
  }
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
    line-height: 10px;
  }
`;

export default Profile;
