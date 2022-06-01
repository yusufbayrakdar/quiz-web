import { Card, Divider } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import Head from "next/head";
import styled from "styled-components";

import StudentForm from "../../components/StudentForm";

function StudentCreate() {
  const instructor = useSelector((state) => state.auth.instructor);

  if (!instructor?.confirmed) {
    return "Yönetici onayı bekleniyor";
  }

  return (
    <Styled className="center">
      <Head>
        <title>Öğrenci Kayıt</title>
        <meta name="description" content="Öğrenci Kayıt" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <Card className="container">
        <span className="font-bold">Öğrenci Oluştur</span>
        <Divider />
        <StudentForm />
      </Card>
    </Styled>
  );
}

const Styled = styled.div`
  width: 33%;

  .container {
    width: 100%;
    height: 450px;
  }
`;

export default StudentCreate;
