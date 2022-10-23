import { Card, Divider } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import Head from "next/head";
import styled from "styled-components";

import StudentForm from "../../components/StudentForm";

function StudentCreate() {
  const user = useSelector((state) => state.auth.user);

  const Header = () => (
    <Head>
      <title>Öğrenci Kayıt | BilsemAI</title>
      <meta name="description" content="Öğrenci Kayıt" />
      <link rel="icon" href="/ideas.png" />
    </Head>
  );

  if (!user?.confirmed) {
    return (
      <div className="center">
        <Header />
        Yönetici onayı bekleniyor
      </div>
    );
  }

  return (
    <Styled className="center">
      <Header />
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
    height: max-content;
  }
`;

export default StudentCreate;
