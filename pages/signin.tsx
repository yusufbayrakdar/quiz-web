import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Row, Col, Card, Radio } from "antd";
import { useSelector } from "react-redux";
import NumberFormat from "react-number-format";
import { useRouter } from "next/router";
import Head from "next/head";

import useRedux from "../hooks/useRedux";
import { RootState } from "../redux/configureStore";

function SignUp() {
  const router = useRouter();
  const { dispatchAction, $ } = useRedux();
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const [form] = Form.useForm();
  const [isInstructor, setIsInstructor] = useState(false);

  const onFinish = (values: any) => {
    if (values.phone) values.phone = values.phone.replace(/[\(\)]/g, "");
    dispatchAction($.LOGIN_REQUEST, values);
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
    <div className="bg-gradient-to-br from-blue-700 via-blue-600 to-blue-500 h-full w-screen flex justify-center items-center">
      <Head>
        <title>Giriş</title>
        <meta name="description" content="BilsemIA giriş sayfası" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <Form
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 w-1/3"
      >
        <div className="flex justify-end">
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
        ) : (
          <Form.Item
            label="Kullanıcı Adı"
            name="nickname"
            rules={[
              { required: true, message: "Lütfen kullanıcı adınızı giriniz!" },
            ]}
          >
            <Input />
          </Form.Item>
        )}

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
            Giriş Yap
          </Button>
        </Form.Item>
        <Row className="text-xs mr-2 flex justify-end cursor-pointer">
          <p className="text-gray-500 mr-1">Kayıtlı değil misin?</p>
          <a onClick={() => router.push("/signup")} className="text-blue-500">
            Kaydol
          </a>
        </Row>
      </Form>
    </div>
  );
}

export default SignUp;
