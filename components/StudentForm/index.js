import { useEffect } from "react";
import { useSelector } from "react-redux";
import { Button, Form, Input } from "antd";

import useRedux from "../../hooks/useRedux";
import { ROLES, showErrorMessage, showWarningMessage } from "../../utils";

function StudentForm({ student, refreshAction }) {
  const { dispatchAction, $ } = useRedux();
  const [form] = Form.useForm();

  const user = useSelector((state) => state.auth.user);
  const resetForm = useSelector((state) => state.user.resetForm);

  useEffect(() => {
    if (resetForm) form.resetFields();
  }, [resetForm, form]);

  useEffect(() => {
    form.setFieldsValue(student);
  }, [student, form]);

  const onFinish = (values) => {
    if (!user?.confirmed) {
      return showWarningMessage("Yönetici onayı bekleniyor");
    }

    const labels = {
      fullName: "Ad Soyad",
      nickname: "Kullanıcı Adı",
    };
    let error = false;
    for (const key in values) {
      if (values[key].length < 4 || values[key].length > 32) {
        showErrorMessage(
          { message: `${labels[key]} en az 4 en fazla 32 karakter olmalıdır` },
          "Something went wrong",
          "",
          1
        );
        error = true;
        break;
      }
    }

    if (!error) {
      const constantInfo = student
        ? { _id: student?._id, refreshAction }
        : { role: ROLES.STUDENT };
      dispatchAction(
        student ? $.UPDATE_STUDENT_REQUEST : $.CREATE_STUDENT_REQUEST,
        { ...constantInfo, ...values }
      );
    }
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Ad Soyad"
        name={"fullName"}
        rules={[{ required: true, message: "Lütfen öğrenci adını giriniz!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Kullanıcı Adı"
        name={"nickname"}
        rules={[
          {
            required: true,
            message: "Lütfen öğrenci kullanıcı adını giriniz!",
          },
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
