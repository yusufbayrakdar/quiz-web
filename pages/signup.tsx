import React, { useEffect } from "react";
import { Form, Input, Button, Checkbox, Row, Col, Card } from "antd";
import useRedux from "../hooks/useRedux";
import { useSelector } from "react-redux";
import { RootState } from "../redux/configureStore";
import NumberFormat from "react-number-format";
import { useRouter } from "next/router";
import Head from "next/head";

function SignUp() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const [form] = Form.useForm();

  const onFinish = (values: any) => {
    values.phone = values.phone.replace(/[\(\)]/g, "");
    dispatchAction($.SIGNUP_INSTRUCTOR_REQUEST, values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (loggedIn) {
      form.resetFields();
      router.push("/dashboard");
    }
  }, [loggedIn]);

  return (
    <div className="bg-blue-600 h-full w-screen flex justify-center items-center">
      <Head>
        <title>Kaydol</title>
        <meta name="description" content="BilsemAI kayıt sayfası" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <Form
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3 animate__animated animate__fadeIn animate__faster"
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
              <Card className="w-12 h-8 flex justify-center items-center  bg-gray-100 border-2">
                +90
              </Card>
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

        <Form.Item name="remember" valuePropName="checked">
          <Checkbox className="flex justify-end">Beni hatırla</Checkbox>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="absolute right-0 top-0 pr-10 pl-10"
          >
            Kaydol
          </Button>
        </Form.Item>
        <a
          className="text-xs text-blue-500 mr-2 flex justify-end cursor-pointer"
          onClick={() => router.push("/signin")}
        >
          Zaten bir hesabım var
        </a>
      </Form>
    </div>
  );
}

export default SignUp;
