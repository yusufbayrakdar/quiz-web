import { useEffect } from "react";
import { useSelector } from "react-redux";
import Head from "next/head";
import { Button, Card, Divider, Form, Input } from "antd";

import useRedux from "../../hooks/useRedux";
import ImageUpload from "../../components/ImageUpload";

function ShapeForm({ _id }) {
  const { dispatchAction, $ } = useRedux();
  const [form] = Form.useForm();

  const resetForm = useSelector((state) => state.shape.resetForm);
  const activeShape = useSelector((state) => state.shape.activeShape);

  const onFinish = async (values) => {
    let { image, searchTag } = values;
    if (_id) {
      if (!activeShape) return;
      dispatchAction($.UPDATE_SHAPE_REQUEST, {
        ...activeShape,
        ...image,
        searchTag,
      });
    } else {
      dispatchAction($.CREATE_SHAPE_REQUEST, { ...image, searchTag });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(() => {
    if (resetForm) form.resetFields();
  }, [resetForm, form]);

  useEffect(() => {
    if (_id) {
      dispatchAction($.GET_SHAPE_DETAIL_REQUEST, _id);
    } else form.resetFields();
  }, [$, dispatchAction, _id, form]);

  useEffect(() => {
    if (_id && activeShape) {
      form.setFieldsValue({
        image: activeShape.imageUrl,
        searchTag: activeShape.searchTag,
      });
    }
  }, [activeShape, form, _id]);

  const pageTitle = _id ? "Şekil Düzenle" : "Şekil Oluştur";
  return (
    <div className="m-auto" style={{ width: "80%" }}>
      <Head>
        <title>{pageTitle} | BilsemAI</title>
        <meta name="description" content="Şekil Oluştur" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <Card>
        <span className="font-bold">{pageTitle}</span>
        <Divider />
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
        >
          <Form.Item
            label="Şekil"
            name="image"
            rules={[{ required: true, message: "Lütfen şekil ekleyiniz!" }]}
            validateStatus={"error"}
          >
            <ImageUpload
              imageSize={{ width: 256, height: 256 }}
              getImage={(image) => {
                form.setFieldsValue({ image });
              }}
              resetForm={resetForm}
              defaultImage={_id && activeShape}
            />
          </Form.Item>
          <Form.Item
            label="Arama Etiketi"
            name={"searchTag"}
            rules={[
              {
                required: true,
                message: "Lütfen arama etiketini giriniz!",
              },
            ]}
          >
            <Input placeholder="Örn: A" />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="bg-secondPrimary absolute right-0 top-0 pr-10 pl-10"
            >
              Kaydet
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

export default ShapeForm;
