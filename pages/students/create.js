import { Button, Card, Divider, Form, Input } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import Head from "next/head";
import styled from "styled-components";

import useRedux from "../../hooks/useRedux";
import { showErrorMessage } from "../../utils";

function StudentCreate() {
  const { dispatchAction, $ } = useRedux();
  const [form] = Form.useForm();

  const instructor = useSelector((state) => state.auth.instructor);
  const resetForm = useSelector((state) => state.student.resetForm);

  const onFinish = (values) => {
    const labels = {
      firstName: "Ad",
      lastName: "Soyad",
      nickname: "Kullanıcı Adı",
    };
    let error = false;
    for (const key in values) {
      if (values[key].length < 2 || values[key].length > 16) {
        showErrorMessage(
          { message: `${labels[key]} en az 2 en fazla 16 karakter olmalıdır` },
          "Something went wrong",
          "",
          1
        );
        error = true;
        break;
      }
    }

    if (!error) dispatchAction($.CREATE_STUDENT_REQUEST, values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (resetForm) form.resetFields();
  }, [resetForm]);

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
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Ad"
            name={"firstName"}
            rules={[{ required: true, message: "Lütfen adınızı giriniz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Soyad"
            name={"lastName"}
            rules={[{ required: true, message: "Lütfen soyadınızı giriniz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Kullanıcı Adı"
            name={"nickname"}
            rules={[
              { required: true, message: "Lütfen kullanıcı adınızı giriniz!" },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <div className="end">
              <Button type="primary" htmlType="submit">
                Kaydet
              </Button>
            </div>
          </Form.Item>
        </Form>
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
