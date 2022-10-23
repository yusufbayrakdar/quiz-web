import { Modal } from "antd";
import { useRouter } from "next/router";
import React from "react";
import { BASE_ENDPOINT } from "../../../utils";
import ScoreDetail from "../../ScoreDetail";

function ScoreModal({ open, onClose }) {
  const router = useRouter();
  return (
    <Modal
      title="Deneme Sonucu"
      open={open}
      onCancel={() => {
        onClose();
        router.push(BASE_ENDPOINT.quiz);
      }}
      footer={false}
    >
      <ScoreDetail />
    </Modal>
  );
}

export default ScoreModal;
