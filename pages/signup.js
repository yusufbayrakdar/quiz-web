import React, { useEffect } from "react";
import { Form, Input, Button, Checkbox, Row, Col, Card } from "antd";
import { useSelector } from "react-redux";
import NumberFormat from "react-number-format";
import { useRouter } from "next/router";
import Head from "next/head";
import styled from "styled-components";

import useRedux from "../hooks/useRedux";
import { BASE_ENDPOINT } from "../utils";
import Animated from "../components/Animated";

function SignUp() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const [form] = Form.useForm();

  const onFinish = (values) => {
    values.phone = values.phone.replace(/[\(\)]/g, "");
    dispatchAction($.SIGNUP_INSTRUCTOR_REQUEST, values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (loggedIn) {
      form.resetFields();
      router.push(BASE_ENDPOINT.dashboard);
    }
  }, [loggedIn]);

  return (
    <Styled className="center">
      <Head>
        <title>Kaydol</title>
        <meta name="description" content="BilsemAI kayıt sayfası" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <Animated style={{ width: "33%" }}>
        <Form
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          layout="vertical"
          className="form"
        >
          <Form.Item
            label="Ad"
            name="firstName"
            rules={[{ required: true, message: "Lütfen adınızı giriniz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Soyad"
            name="lastName"
            rules={[{ required: true, message: "Lütfen soyadınızı giriniz!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Telefon"
            name="phone"
            rules={[{ required: true, message: "Lütfen phoneinizi giriniz!" }]}
          >
            <Row>
              <Col>
                <Card className="country-code center">+90</Card>
              </Col>
              <Col flex="auto">
                <NumberFormat
                  customInput={Input}
                  type="tel"
                  format="(###) ### ## ##"
                  mask="_"
                  allowLeadingZeros={false}
                  allowEmptyFormatting
                />
              </Col>
            </Row>
          </Form.Item>

          <Form.Item
            label="Şifre"
            name="password"
            rules={[{ required: true, message: "Lütfen şifrenizi giriniz!" }]}
          >
            <Input.Password />
          </Form.Item>

          <div className="signup-button-container">
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Beni hatırla</Checkbox>
            </Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              style={{ paddingLeft: 40, paddingRight: 40 }}
            >
              Kaydol
            </Button>
            <a
              className="already-signed-up"
              onClick={() => router.push("/signin")}
            >
              Zaten bir hesabım var
            </a>
          </div>
        </Form>
      </Animated>
    </Styled>
  );
}

const Styled = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  height: 100%;
  width: 100%;

  .form {
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 4px;
    padding: 0px 32px;
    padding-top: 24px;
    padding-bottom: 32px;
    margin-bottom: 16px;
  }
  .country-code {
    width: 48px;
    height: 32px;
    background-color: ${({ theme }) => theme.colors.gray};
    border-width: 2px;
  }
  .signup-button-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .already-signed-up {
    font-size: 12px;
    margin-top: 6px;
    color: ${({ theme }) => theme.colors.primary};
    display: flex;
    justify-content: flex-end;
    cursor: pointer;
  }
`;

export default SignUp;
