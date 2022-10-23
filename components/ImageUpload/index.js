import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Upload, Modal } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import path from "path";
import styled from "styled-components";
import Image from "next/image";
import moment from "moment";

import useRedux from "../../hooks/useRedux";
import useFirebase from "../../hooks/useFirebase";

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

function ImageUpload({
  imageSize = { width: 256, height: 256 },
  checkDimensions = false,
  setImageErrorMessage = () => {},
  accept = ".png, .jpg, .jpeg",
  getImage = (images) => {},
  disabled = false,
  resetForm,
  defaultImage,
}) {
  const firebaseConfig = useSelector((state) => state.global.firebaseConfig);
  const user = useSelector((state) => state.auth.user);

  const { dispatchAction, $ } = useRedux();

  useEffect(() => {
    if (!firebaseConfig) {
      dispatchAction($.GET_FIREBASE_CONFIG_REQUEST);
    }
  }, [$, dispatchAction, firebaseConfig, user]);

  const { firebaseStorage, app } = useFirebase(firebaseConfig);

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [fileList, setFileList] = useState([]);
  const [isImageValid, setIsImageValid] = useState(true);

  useEffect(() => {
    if (defaultImage) {
      setFileList([
        {
          uid: 1,
          name: defaultImage.imageName,
          status: "done",
          url: defaultImage.imageUrl,
        },
      ]);
    }
  }, [defaultImage]);

  useEffect(() => {
    const [file] = fileList;
    if (file) file.status = isImageValid ? "done" : "error";
  }, [isImageValid, fileList]);

  useEffect(() => {
    if (resetForm) setFileList([]);
  }, [resetForm]);

  if (!firebaseStorage) return null;

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleChange = async ({ fileList }) => {
    setFileList(fileList.slice(-1));
    const image = fileList.slice(-1)[0]?.originFileObj;
    if (!image) return null;
    let uploadTask;
    const uniqueImageName = `${moment().valueOf()}-${image.name}`;
    uploadTask = firebaseStorage.ref("images/" + uniqueImageName).put(image);
    uploadTask.on(
      "state_changed",
      (snapshot) => {},
      (error) => {
        console.log("🤯 error", error);
      },
      () => {
        firebaseStorage
          .ref("images")
          .child(uniqueImageName)
          .getDownloadURL()
          .then((imageUrl) => {
            getImage(
              isImageValid ? { imageUrl, imageName: uniqueImageName } : false
            );
          });
      }
    );
  };

  const handleRemove = (file) => {
    setImageErrorMessage("Image is missing");
    getImage(null);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Yükle</div>
    </div>
  );

  const imageMimes = ["image/jpeg", "image/jpg", "image/png"];
  const imageExt = [".png", ".jpeg", ".jpg", ".JPG"];
  const MB_TO_BITES = 1000000;
  const MAX_IMAGE_SIZE = 15 * MB_TO_BITES;

  const beforeUpload = (file) => {
    const isFileSizeValid = (file) => {
      if (
        !imageMimes.includes(file.type) ||
        !imageExt.includes(path.extname(file.name))
      ) {
        setImageErrorMessage("File is not in valid extension");
        return setIsImageValid(false);
      } else if (Number(file.size) > MAX_IMAGE_SIZE) {
        setImageErrorMessage("File size is bigger than 15 mb");
        return setIsImageValid(false);
      }
      setImageErrorMessage(undefined);
      return setIsImageValid(true);
    };

    function callback(isError) {
      if (isError && checkDimensions) {
        setImageErrorMessage(
          `Image Size should be  W:${imageSize.width}, H:${imageSize.height}`
        );
        setIsImageValid(false);
        file.status = "error";
      } else {
        isFileSizeValid(file);
      }
    }

    const hasFileValidDimensions = (file) => {
      var _URL = window.URL || window.webkitURL;
      var img = new Image();
      img.onload = function () {
        console.log(`width: ${this.width}, height: ${this.height}`);
        callback(
          imageSize.height !== this.height || imageSize.width !== this.width
        );
      };
      img.src = _URL.createObjectURL(file);
    };
    setIsImageValid(true);
    hasFileValidDimensions(file);

    return false;
  };

  return (
    <>
      <Upload
        beforeUpload={beforeUpload}
        listType="picture-card"
        onPreview={handlePreview}
        fileList={fileList}
        accept={accept}
        onRemove={handleRemove}
        disabled={disabled}
        onChange={handleChange}
      >
        {uploadButton}
      </Upload>
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <StyledImage
          alt="preview-uploaded-image"
          src={previewImage}
          priority
          quality={100}
          layout="responsive"
          width={500}
          height={500}
        />
      </Modal>
    </>
  );
}

const StyledImage = styled(Image)`
  object-fit: contain;
`;

export default ImageUpload;
