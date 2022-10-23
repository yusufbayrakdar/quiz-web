import React, { useEffect, useRef, useState } from "react";
import { Checkbox, Input, Modal, Spin } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";

import useRedux from "../../../hooks/useRedux";

function SelectStudentModalForQuiz({ open, onClose, quizId, refreshAction }) {
  const { dispatchAction, $ } = useRedux();

  const activeQuizStudents = useSelector(
    (state) => state.quiz.activeQuizStudents
  );
  const [students, setStudents] = useState(activeQuizStudents);
  const [filteredStudents, setFilteredStudents] = useState(students);
  const studentsLoading = useSelector(
    (state) => state.quiz.activeQuizStudentsInProgress
  );

  const searchRef = useRef();

  useEffect(() => {
    if (quizId) {
      dispatchAction($.GET_STUDENTS_OF_QUIZ_BY_INSTRUCTOR_REQUEST, quizId);
    }
  }, [dispatchAction, $, open, quizId]);

  useEffect(() => {
    if (!studentsLoading) {
      setStudents(activeQuizStudents);
      setFilteredStudents(activeQuizStudents);
    }
  }, [activeQuizStudents, studentsLoading]);

  const onOk = () => {
    const assigneds = [];
    for (let i = 0; i < students.length; i++) {
      if (students[i].assigned) {
        assigneds.push(students[i]._id);
      }
    }
    dispatchAction($.ASSIGN_QUIZ_TO_STUDENT_REQUEST, {
      _id: quizId,
      students: assigneds,
      refreshAction,
    });
    onClose?.();
    if (searchRef.current.value) searchRef.current.value = "";
  };

  const onCancel = () => {
    onClose?.();
    if (searchRef.current.value) searchRef.current.value = "";
  };

  return (
    <Modal
      title="Öğrenci Seç"
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
            setFilteredStudents(
              students.filter((s) => {
                return s.fullName?.toLowerCase().includes(val);
              })
            );
          } else setFilteredStudents(students);
        }}
        ref={searchRef}
        value={searchRef.current?.value}
        loading={studentsLoading}
      />
      <StudentList>
        {(filteredStudents || students).map((student, index) => (
          <StudentItem key={student?._id}>
            <Checkbox
              onChange={() => {
                const newFilteredStudents = [];
                for (let i = 0; i < index; i++) {
                  newFilteredStudents.push(filteredStudents[i]);
                }
                newFilteredStudents.push({
                  ...student,
                  assigned: !student.assigned,
                });
                for (let i = index + 1; i < filteredStudents.length; i++) {
                  newFilteredStudents.push(filteredStudents[i]);
                }
                setFilteredStudents(newFilteredStudents);

                const newStudents = [];
                for (let i = 0; i < students.length; i++) {
                  if (students[i].fullName === student.fullName)
                    newStudents.push({
                      ...student,
                      assigned: !student.assigned,
                    });
                  else newStudents.push(students[i]);
                }
                setStudents(newStudents);
              }}
              checked={student.assigned}
              style={{ width: "100%" }}
            >
              {student.fullName}
            </Checkbox>
          </StudentItem>
        ))}
        <LoadingLayout loading={studentsLoading ? 1 : 0}>
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

export default SelectStudentModalForQuiz;
