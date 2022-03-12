import React from "react";
import Head from "next/head";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Button, Card, Col, Row } from "antd";
import { UserOutlined, CheckOutlined, EditOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChild } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

import { displayFullName } from "../utils/index";

function Profile() {
  const instructor = useSelector((state) => state.auth.instructor);
  const student = useSelector((state) => state.auth.student);

  if (!student && !instructor) return null;
  const { firstName, lastName, nickname, phone, confirmed } =
    instructor || student;

  const RoleBadge = () => (
    <Row className="badge role-badge">
      <div className="badge-icon center">
        {instructor ? (
          <Image src="/graduation.svg" alt="Eğitmen" width={15} height={15} />
        ) : (
          <FontAwesomeIcon icon={faChild} />
        )}
      </div>
      <div className="badge-info gMed">
        {instructor ? "Eğitmen" : "Öğrenci"}
      </div>
    </Row>
  );

  const ConfirmBadge = () => (
    <Row className="badge confirm-badge" style={{ marginLeft: 16 }}>
      <div className="badge-icon center">
        <CheckOutlined />
      </div>
      <div className="badge-info gMed">
        {confirmed ? "Onaylı" : "Onay Bekliyor"}
      </div>
    </Row>
  );

  return (
    <Styled instructor={instructor}>
      <Head>
        <title>Profil</title>
        <meta name="questions" content="Profil" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <div className="top-line" />
      <Row className="container-1">
        <Col>
          <Row>
            <Col className="avatar center">
              <UserOutlined />
            </Col>
            <Col className="container-2">
              <div>
                <div className="user-name gBold">
                  {displayFullName({ firstName, lastName })}
                </div>
                <div className="user-unique-id gMed">
                  {instructor ? phone : `@${nickname}`}
                </div>
              </div>
              <Row>
                <RoleBadge />
                {instructor && <ConfirmBadge />}
              </Row>
            </Col>
          </Row>
        </Col>
        <Col>
          <Button className="edit-button">
            <EditOutlined />
            Düzenle
          </Button>
        </Col>
      </Row>
    </Styled>
  );
}

const Styled = styled(Card)`
  width: 73%;
  margin-top: 50px;
  border-radius: 12px;
  position: absolute;
  overflow: hidden;

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
    background-color: ${({ theme, instructor }) =>
      theme.colors[instructor ? "primary" : "purple"]};
  }
  .confirm-badge {
    background-color: ${({ theme, instructor }) =>
      theme.colors[instructor?.confirmed ? "green" : "yellow"]};
  }
  .badge-icon {
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

export default Profile;
