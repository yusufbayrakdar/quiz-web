import { Button, Form, Input } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import useRedux from "../../hooks/useRedux";
import { showErrorMessage, showWarningMessage } from "../../utils";

function StudentForm({ student, refreshAction }) {
  const { dispatchAction, $ } = useRedux();
  const [form] = Form.useForm();

  const instructor = useSelector((state) => state.auth.instructor);
  const resetForm = useSelector((state) => state.student.resetForm);

  useEffect(() => {
    if (resetForm) form.resetFields();
  }, [resetForm, form]);

  useEffect(() => {
    form.setFieldsValue(student);
  }, [student, form]);

  const onFinish = (values) => {
    if (!instructor?.confirmed) {
      return showWarningMessage("Yönetici onayı bekleniyor");
    }

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

    if (!error) {
      const editInfo = student ? { _id: student?._id, refreshAction } : {};
      dispatchAction(
        student ? $.UPDATE_STUDENT_REQUEST : $.CREATE_STUDENT_REQUEST,
        { ...editInfo, ...values }
      );
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
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
  );
}

export default StudentForm;
