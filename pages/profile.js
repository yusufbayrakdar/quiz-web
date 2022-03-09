import React from "react";
import Head from "next/head";
import Image from "next/image";
import { useSelector } from "react-redux";
import { Button, Card, Col, Row } from "antd";
import { UserOutlined, CheckOutlined, EditOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChild } from "@fortawesome/free-solid-svg-icons";

import { displayFullName } from "../utils/index";

function Profile() {
  const instructor = useSelector((state) => state.auth.instructor);
  const student = useSelector((state) => state.auth.student);

  if (!student && !instructor) return null;
  const { firstName, lastName, nickname, phone, confirmed } =
    instructor || student;

  const RoleBadge = () => (
    <Row
      style={{
        backgroundColor: instructor ? "#0070f3" : "purple",
        marginLeft: 16,
        marginTop: 16,
        borderRadius: 6,
        padding: "0px 6px",
        color: "white",
        paddingRight: 15,
        cursor: "pointer",
      }}
    >
      <div
        style={{ marginLeft: 8, marginRight: 8, marginBottom: 2 }}
        className="center"
      >
        {instructor ? (
          <Image src="/graduation.svg" alt="Eğitmen" width={15} height={15} />
        ) : (
          <FontAwesomeIcon icon={faChild} />
        )}
      </div>
      <div style={{ paddingTop: 2, marginRight: 8 }} className="gMed">
        {instructor ? "Eğitmen" : "Öğrenci"}
      </div>
    </Row>
  );

  const ConfirmBadge = () => (
    <div
      className="center"
      style={{
        backgroundColor: instructor?.confirmed ? "#51D256" : "#F5A623",
        marginLeft: 16,
        marginTop: 16,
        borderRadius: 6,
        padding: "0px 6px",
        color: "white",
        cursor: "pointer",
      }}
    >
      <div style={{ marginLeft: 8, marginRight: 8 }} className="center">
        <CheckOutlined />
      </div>
      <div style={{ marginTop: 2, paddingRight: 16 }} className="gMed center">
        {instructor?.confirmed ? "Onaylı" : "Onay Bekliyor"}
      </div>
    </div>
  );

  return (
    <Card
      style={{
        width: "85%",
        marginTop: 50,
        borderRadius: 12,
        position: "absolute",
        overflow: "hidden",
      }}
    >
      <Head>
        <title>Profil</title>
        <meta name="questions" content="Profil" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <div
        style={{
          width: "100%",
          height: 8,
          backgroundColor: "#161E68",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      />
      <Row
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Col>
          <Row>
            <Col className="relative rounded-full flex justify-center items-center w-28 h-28 mr-1 bg-gray-300">
              <UserOutlined style={{ fontSize: 45 }} className="text-white" />
            </Col>
            <Col
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-around",
              }}
            >
              <div
                className="gBold"
                style={{
                  fontSize: 24,
                  marginLeft: 16,
                  color: "#161E68",
                  position: "relative",
                }}
              >
                {displayFullName({ firstName, lastName })}
                <div
                  className="gMed"
                  style={{
                    position: "absolute",
                    top: 29,
                    fontSize: 12,
                    color: "#0070f3",
                  }}
                >
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
          <Button
            style={{ borderRadius: 4, display: "flex", alignItems: "center" }}
          >
            <EditOutlined style={{ marginBottom: 2 }} />
            Düzenle
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

export default Profile;
