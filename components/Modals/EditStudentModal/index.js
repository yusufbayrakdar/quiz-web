import { Modal } from "antd";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";

import useRedux from "../../../hooks/useRedux";
import StudentForm from "../../StudentForm";

function EditStudentModal({ visible, onClose, student, refreshAction }) {
  const resetForm = useSelector((state) => state.student.resetForm);
  const { dispatchAction, $ } = useRedux();

  useEffect(() => {
    if (resetForm) {
      onClose?.();
      dispatchAction($.RESET_STUDENT_RESET);
    }
  }, [$, dispatchAction, resetForm, onClose]);

  return (
    <Modal
      title="Öğrenci Düzenle"
      visible={visible}
      onCancel={onClose}
      footer={false}
    >
      <StudentForm student={student} refreshAction={refreshAction} />
    </Modal>
  );
}

export default EditStudentModal;
