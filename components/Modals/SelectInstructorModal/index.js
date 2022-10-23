import React, { useEffect, useState } from "react";
import { Checkbox, Input, Modal, Spin } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";

import useRedux from "../../../hooks/useRedux";

function SelectInstructorModal({ open, onClose, studentId, refreshAction }) {
  const { dispatchAction, $ } = useRedux();

  const instructorsOfStudent = useSelector(
    (state) => state.user.instructorsOfStudent
  );
  const instructorsLoading = useSelector(
    (state) => state.user.instructorsOfStudentLoading
  );
  const [instructors, setInstructors] = useState(instructorsOfStudent);
  const [filteredInstructors, setFilteredInstructors] = useState(instructors);

  useEffect(() => {
    if (studentId) {
      dispatchAction($.GET_INSTRUCTORS_OF_STUDENT_REQUEST, studentId);
    }
  }, [dispatchAction, $, open, studentId]);

  useEffect(() => {
    if (!instructorsLoading) {
      setInstructors(instructorsOfStudent);
      setFilteredInstructors(instructorsOfStudent);
    }
  }, [instructorsOfStudent, instructorsLoading]);

  const onOk = () => {
    const assigneds = [];
    for (let i = 0; i < instructors.length; i++) {
      if (instructors[i].assigned) {
        assigneds.push(instructors[i]._id);
      }
    }
    dispatchAction($.ADD_STUDENT_TO_INSTRUCTORS_REQUEST, {
      _id: studentId,
      instructors: assigneds,
      refreshAction,
    });
    onClose?.();
  };

  const onCancel = () => {
    onClose?.();
  };

  return (
    <Modal
      title="Eğitmen Seç"
      open={open}
      onOk={onOk}
      onCancel={onCancel}
      okText="Gönder"
      cancelText="İptal"
    >
      <Search
        onChange={(e) => {
          const val = e.target.value.toLowerCase();
          if (val) {
            setFilteredInstructors(
              instructors.filter((s) => s.fullName?.toLowerCase().includes(val))
            );
          } else setFilteredInstructors(instructors);
        }}
        loading={instructorsLoading}
      />
      <StudentList>
        {filteredInstructors.map((instructor, index) => (
          <StudentItem key={instructor?._id}>
            <Checkbox
              onChange={() => {
                const newFilteredInstructors = [];
                for (let i = 0; i < index; i++) {
                  newFilteredInstructors.push(filteredInstructors[i]);
                }
                newFilteredInstructors.push({
                  ...instructor,
                  assigned: !instructor.assigned,
                });
                for (let i = index + 1; i < filteredInstructors.length; i++) {
                  newFilteredInstructors.push(filteredInstructors[i]);
                }
                setFilteredInstructors(newFilteredInstructors);

                const newInstructors = [];
                for (let i = 0; i < instructors.length; i++) {
                  if (instructors[i].fullName === instructor.fullName)
                    newInstructors.push({
                      ...instructor,
                      assigned: !instructor.assigned,
                    });
                  else newInstructors.push(instructors[i]);
                }
                setInstructors(newInstructors);
              }}
              checked={instructor.assigned}
              style={{ width: "100%" }}
            >
              {instructor.fullName}
            </Checkbox>
          </StudentItem>
        ))}
        <LoadingLayout loading={instructorsLoading ? 1 : 0}>
          <Spin />
        </LoadingLayout>
      </StudentList>
    </Modal>
  );
}

export const LoadingLayout = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: ${({ loading }) => (loading ? "flex" : "none")};
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.transparentGray};
`;

const Search = styled(Input.Search)`
  margin-bottom: 10px;
`;

const StudentList = styled.div`
  max-height: 60vh;
  overflow-y: scroll;
  position: relative;
`;

const StudentItem = styled.div`
  :hover {
    background-color: ${({ theme }) => theme.colors.gray};
  }
`;

export default SelectInstructorModal;
