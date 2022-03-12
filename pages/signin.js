import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Row, Col, Card, Radio } from "antd";
import { useSelector } from "react-redux";
import NumberFormat from "react-number-format";
import { useRouter } from "next/router";
import Head from "next/head";
import styled from "styled-components";

import useRedux from "../hooks/useRedux";
import Animated from "../components/Animated";
import { BASE_ENDPOINT } from "../utils";

function SignUp() {
  const router = useRouter();
  const { dispatchAction, $ } = useRedux();
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const [form] = Form.useForm();
  const [isInstructor, setIsInstructor] = useState(false);

  const onFinish = (values) => {
    if (values.phone) values.phone = values.phone.replace(/[\(\)]/g, "");
    dispatchAction($.LOGIN_REQUEST, values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (loggedIn) {
      form.resetFields();
      router.push("/dashboard");
    }
  }, [loggedIn]);

  return (
    <Styled>
      <Head>
        <title>Giriş</title>
        <meta name="description" content="BilsemAI giriş sayfası" />
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
          <div className="end">
            <Radio.Group
              options={["Eğitmen", "Öğrenci"]}
              onChange={(e) => setIsInstructor(e.target.value === "Eğitmen")}
              optionType="button"
              defaultValue={"Öğrenci"}
            />
          </div>
          {isInstructor ? (
            <Form.Item
              label="Telefon"
              name="phone"
              rules={[
                { required: true, message: "Lütfen telefonunuzu giriniz!" },
              ]}
            >
              <Animated>
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
              </Animated>
            </Form.Item>
          ) : (
            <Form.Item
              label="Kullanıcı Adı"
              name="nickname"
              rules={[
                {
                  required: true,
                  message: "Lütfen kullanıcı adınızı giriniz!",
                },
              ]}
            >
              <Animated>
                <Input />
              </Animated>
            </Form.Item>
          )}

          <Form.Item
            label="Şifre"
            name="password"
            rules={[{ required: true, message: "Lütfen şifrenizi giriniz!" }]}
          >
            <Input.Password />
          </Form.Item>

          <div className="signin-button-container">
            <Form.Item name="remember" valuePropName="checked">
              <Checkbox>Beni hatırla</Checkbox>
            </Form.Item>
            <Button type="primary" htmlType="submit">
              Giriş Yap
            </Button>
            {isInstructor && (
              <Animated className="signup end">
                <a onClick={() => router.push(BASE_ENDPOINT.signup)}>
                  Kayıtlı değil misin?
                </a>
              </Animated>
            )}
          </div>
        </Form>
      </Animated>
    </Styled>
  );
}

const Styled = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;

  .form {
    background-color: ${({ theme }) => theme.colors.white};
    border-radius: 4px;
    padding: 32px 32px;
  }
  .country-code {
    width: 48px;
    height: 32px;
    background-color: ${({ theme }) => theme.colors.gray};
    border-width: 2px;
  }
  .signin-button-container {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .signup {
    font-size: 12px;
    margin-top: 6px;
    cursor: pointer;
  }
`;

export default SignUp;
