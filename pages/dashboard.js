import React from "react";
import Head from "next/head";
import { Card, Row } from "antd";
import { WarningOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import styled from "styled-components";

function Dashboard() {
  const instructor = useSelector((state) => state.auth.instructor);

  return (
    <Styled>
      <Head>
        <title>Dashboard</title>
        <meta name="description" content="Genel bakış" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      {instructor && !instructor.confirmed && (
        <Card>
          <Row className="warning-section">
            <WarningOutlined className="warning-icon center" />
            Yöneticinin onayı bekleniyor
          </Row>
        </Card>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  display: flex;
  align-items: center;

  .warning-section {
    display: flex;
    align-items: center;
  }
  .warning-icon {
    color: ${({ theme }) => theme.colors.yellow};
    font-size: 36px;
    line-height: 40px;
    clip-path: polygon(50% 0%, 0% 100%, 100% 100%);
    padding: 0 2px;
  }
`;

export default Dashboard;
