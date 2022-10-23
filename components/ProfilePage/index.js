import Image from "next/image";
import { useSelector } from "react-redux";
import { Card, Col, Row } from "antd";
import {
  UserOutlined,
  CheckOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";

import { ROLES } from "../../utils";

function ProfilePage({ userProp }) {
  const user = useSelector((state) => userProp || state.auth.user);

  if (!user) return null;
  const { fullName, nickname, phone, confirmed, role } = user;
  const isStudent = role === ROLES.STUDENT;
  const isInstructor = role === ROLES.INSTRUCTOR;
  const isAdmin = role === ROLES.ADMIN;

  const RoleBadge = () => (
    <Row className="badge role-badge">
      <div className="badge-icon center">
        <Image
          src={isStudent ? "/child.svg" : "/graduation.svg"}
          alt={isStudent ? "student-icon" : "instructor-icon"}
          width={15}
          height={15}
        />
      </div>
      <div className="badge-info gMed">{isStudent ? "Öğrenci" : "Eğitmen"}</div>
    </Row>
  );

  const ConfirmBadge = () => (
    <Row className="badge confirm-badge">
      <div className="badge-icon center">
        {confirmed ? <CheckOutlined /> : <ClockCircleOutlined />}
      </div>
      <div className="badge-info gMed">
        {confirmed ? "Onaylı" : "Onay Bekliyor"}
      </div>
    </Row>
  );

  const AdminBadge = () => {
    return (
      <Row className="badge admin-badge">
        <div className="badge-icon center">
          <FontAwesomeIcon className="crown" icon={faCrown} width={20} />
        </div>
        <div className="badge-info gMed">{"Admin"}</div>
      </Row>
    );
  };

  return (
    <Styled confirmed={confirmed ? 1 : 0} isstudent={isStudent ? 1 : 0}>
      <div className="top-line" />
      <Row className="container-1">
        <Col>
          <Row>
            <Col className="avatar center">
              <UserOutlined />
            </Col>
            <Col className="container-2">
              <div>
                <div className="user-name gBold">{fullName}</div>
                <div className="user-unique-id gMed">
                  {isStudent ? `@${nickname}` : phone}
                </div>
              </div>
              <Row className="badges-container">
                <RoleBadge />
                {isInstructor && <ConfirmBadge />}
                {isAdmin && <AdminBadge />}
              </Row>
            </Col>
          </Row>
        </Col>
        {/* TODO: Instructor Profile Edit */}
        {/* <Col>
          <Button className="edit-button">
            <EditOutlined />
            Düzenle
          </Button>
        </Col> */}
      </Row>
    </Styled>
  );
}

const Styled = styled(Card)`
  width: 73%;
  margin-top: 30px;
  border-radius: 12px;
  position: absolute;
  overflow: hidden;
  z-index: 1;

  .badges-container {
    gap: 10px;
  }
  .top-line {
    width: 100%;
    height: 8px;
    background-color: ${({ theme }) => theme.colors.darkPrimary};
    position: absolute;
    top: 0;
    left: 0;
  }
  .container-1 {
    display: flex;
    justify-content: space-between;
  }
  .avatar {
    position: relative;
    border-radius: 50%;
    width: 112px;
    height: 112px;
    margin-right: 4px;
    background-color: ${({ theme }) => theme.colors.darkGray};
    color: ${({ theme }) => theme.colors.white};
    font-size: 45px;
  }
  .container-2 {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    margin-left: 16px;
  }
  .user-name {
    font-size: 24px;
    color: ${({ theme }) => theme.colors.darkPrimary};
  }
  .user-unique-id {
    font-size: 12px;
    line-height: 1px;
    color: ${({ theme }) => theme.colors.primary};
  }
  .badge {
    border-radius: 6px;
    padding: 0px 6px;
    color: ${({ theme }) => theme.colors.white};
    padding-right: 15;
    cursor: pointer;
    display: flex;
    align-items: center;
    margin-top: 16px;
  }
  .role-badge {
    background-color: ${({ theme, isstudent }) =>
      theme.colors[isstudent ? "purple" : "primary"]};
  }
  .admin-badge {
    background-color: ${({ theme }) => theme.colors.yellow};
  }
  .confirm-badge {
    background-color: ${({ theme, confirmed }) =>
      theme.colors[confirmed ? "green" : "yellow"]};
  }
  .badge-icon {
    color: ${({ theme }) => theme.colors.white};
    margin-right: 8px;
    margin-left: 8px;
  }
  .badge-info {
    padding-top: 2px;
    margin-right: 8px;
  }
  .edit-button {
    border-radius: 4px;
    display: flex;
    align-items: center;
  }
`;

export default ProfilePage;
