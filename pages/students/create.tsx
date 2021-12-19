import { Button, Card, Divider, Form, Input } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useRedux from "../../hooks/useRedux";
import { RootState } from "../../redux/configureStore";
import { showErrorMessage } from "../../utils";
import Head from "next/head";

function StudentCreate() {
  const { dispatchAction, $ } = useRedux();
  const [form] = Form.useForm();

  const instructor = useSelector((state: RootState) => state.auth.instructor);
  const resetForm = useSelector((state: RootState) => state.student.resetForm);

  const onFinish = (values: any) => {
    const labels: any = {
      firstName: "Ad",
      lastName: "Soyad",
      nickname: "Kullanıcı Adı",
    };
    let error = false;
    for (const key in values) {
      if (values[key].length < 3 || values[key].length > 16) {
        showErrorMessage(
          { message: `${labels[key]} en az 3 en fazla 16 karakter olmalıdır` },
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

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (resetForm) form.resetFields();
  }, [resetForm]);

  if (!instructor?.confirmed) {
    return "Yönetici onayı bekleniyor";
  }

  return (
    <div className="m-auto w-96" style={{ height: 450 }}>
      <Head>
        <title>Öğrenci Kayıt</title>
        <meta name="description" content="Öğrenci Kayıt" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <Card>
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
            <Button
              type="primary"
              htmlType="submit"
              className="absolute right-0 top-0 pr-10 pl-10"
            >
              Kaydet
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default StudentCreate;
