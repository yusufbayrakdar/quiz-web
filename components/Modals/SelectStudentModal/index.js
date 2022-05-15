import React, { useEffect, useRef, useState } from "react";
import { Checkbox, Input, Modal, Spin } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";

import useRedux from "../../../hooks/useRedux";
import { displayFullName } from "../../../utils";

function SelectStudentModal({
  visible,
  onClose,
  quizId,
  selecteds,
  refreshAction,
}) {
  const scrollRef = useRef(null);
  const { dispatchAction, $ } = useRedux();

  const instructor = useSelector((state) => state.auth.instructor);
  const students = useSelector((state) => state.student.students);
  const studentsLoading = useSelector((state) => state.student.studentsLoading);
  const hasNextPage = useSelector((state) => state.student.hasNextPage);
  const nextPage = useSelector((state) => state.student.nextPage);

  const [studentSet, setStudentSet] = useState(new Set(selecteds));
  const [search, setSearch] = useState();

  const addStudent = (studentId) => {
    if (studentSet.has(studentId)) studentSet.delete(studentId);
    else studentSet.add(studentId);
    setStudentSet(new Set(studentSet));
  };

  let page = 1;
  let limit = 100;
  const studentItemHeight = 22;

  useEffect(() => {
    if (visible) {
      const listHeight = 0.6 * window.screen.height;
      if (listHeight && limit * studentItemHeight <= listHeight) {
        limit = Math.ceil((2 * listHeight) / studentItemHeight);
      }
      if (instructor?._id) {
        dispatchAction($.GET_STUDENTS, {
          page,
          limit,
          search,
          instructor: instructor._id,
        });
      }
    }
  }, [dispatchAction, $, page, limit, search, instructor, visible, search]);

  useEffect(() => {
    setStudentSet(new Set(selecteds));
  }, [selecteds]);

  const onOk = () => {
    dispatchAction($.UPDATE_QUIZ_REQUEST, {
      _id: quizId,
      assignedStudents: Array.from(studentSet),
      refreshAction,
    });
    setStudentSet(new Set());
    onClose?.();
  };

  const onCancel = () => {
    onClose?.();
  };

  let scrollPrevPercent = 0;
  const onScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const percent = (scrollTop / (scrollHeight - clientHeight)) * 100;

    if (
      instructor?._id &&
      scrollPrevPercent < percent &&
      percent > 59 &&
      !studentsLoading &&
      hasNextPage
    ) {
      dispatchAction($.GET_STUDENTS, {
        page: nextPage,
        limit,
        search,
        instructor: instructor._id,
        action: $.ADD_STUDENTS,
      });
    }
    scrollPrevPercent = percent;
  };

  return (
    <Modal
      title="Öğrenci Seç"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      okText="Gönder"
      cancelText="İptal"
    >
      <Search
        onChange={(e) => setSearch(e.target.value)}
        loading={studentsLoading}
      />
      <StudentList ref={scrollRef} onScroll={onScroll}>
        {students.map((student) => (
          <StudentItem>
            <Checkbox
              onChange={() => addStudent(student._id)}
              checked={studentSet.has(student._id)}
              style={{ width: "100%" }}
            >
              {displayFullName(student)}
            </Checkbox>
          </StudentItem>
        ))}
        <LoadingLayout loading={studentsLoading}>
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

export default SelectStudentModal;
