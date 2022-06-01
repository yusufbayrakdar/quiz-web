import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Head from "next/head";

import CustomTable from "../../components/CustomTable";
import Copyable from "../../components/Copyable";
import useRedux from "../../hooks/useRedux";
import TableHeaderBar from "../../components/TableHeaderBar";
import { BASE_ENDPOINT, capitalizeFirstLetter } from "../../utils";
import theme from "../../utils/theme";
import DeleteButton from "../../components/Buttons/DeleteButton";
import EditItemButton from "../../components/Buttons/EditItemButton";
import EditStudentModal from "../../components/Modals/EditStudentModal";

const defaultPageSize = 10;

function Students() {
  const router = useRouter();
  const query = router.query;
  const { dispatchAction, $ } = useRedux();

  const instructor = useSelector((state) => state.auth.instructor);
  const students = useSelector((state) => state.student.students);
  const studentsLoading = useSelector((state) => state.student.studentsLoading);
  const totalstudents = useSelector((state) => state.student.totalStudents);

  const [
    editStudentFormVisibleWithStudent,
    setEditStudentFormVisibleWithStudent,
  ] = useState();

  const search = query["search"];
  const page = query["page"];
  const limit = query["limit"] || defaultPageSize;
  const hasPhone = query["hasPhone"];

  useEffect(() => {
    if (instructor) {
      dispatchAction($.GET_STUDENTS, {
        page,
        limit,
        search,
        hasPhone,
        instructor: instructor?._id,
      });
    }
  }, [dispatchAction, $, page, limit, search, hasPhone, instructor]);

  const nickNameStyle = {
    marginLeft: 4,
    fontSize: 14,
    fontWeight: 300,
    color: theme.colors.deepDarkGray,
  };

  const deleteStudent = (studentId) => {
    dispatchAction($.DELETE_STUDENT_REQUEST, {
      _id: studentId,
      refreshAction: {
        type: $.GET_STUDENTS,
        payload: {
          page,
          limit,
          search,
          instructor: instructor?._id,
        },
      },
    });
  };

  const columns = [
    {
      title: "Öğrenci",
      dataIndex: "firstName",
      render: (firstName, { lastName, nickname }) => (
        <div>
          {capitalizeFirstLetter(`${firstName} ${lastName}`)}
          <span style={nickNameStyle}>@{nickname}</span>
        </div>
      ),
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      render: (phone) =>
        phone ? `(${phone?.slice(0, 3)}) ${phone?.slice(4)}` : "",
    },
    {
      title: "İlk Şifre",
      dataIndex: "passwordInit",
      render: (password) => <Copyable>{password}</Copyable>,
    },
    {
      title: "",
      render: (student) => (
        <div style={{ display: "flex" }}>
          <EditItemButton
            baseEndpoint={BASE_ENDPOINT.student}
            _id={student?._id}
            customOnclick={() => setEditStudentFormVisibleWithStudent(student)}
          />
          <DeleteButton onConfirm={() => deleteStudent(student?._id)} />
        </div>
      ),
    },
  ];

  return (
    <div style={{ width: "83%" }}>
      <Head>
        <title>Öğrenciler</title>
        <meta name="description" content="Öğrenciler" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <EditStudentModal
        student={editStudentFormVisibleWithStudent}
        visible={editStudentFormVisibleWithStudent}
        onClose={() => setEditStudentFormVisibleWithStudent(null)}
        refreshAction={{
          type: $.GET_STUDENTS,
          payload: {
            page,
            limit,
            search,
            instructor: instructor?._id,
          },
        }}
      />
      <TableHeaderBar
        baseEndpoint={BASE_ENDPOINT.student}
        hideCreate={false}
        showPhoneFilter={true}
      />
      <CustomTable
        dataSource={students}
        loading={studentsLoading}
        totalDocuments={totalstudents}
        defaultPageSize={defaultPageSize}
        baseEndpoint={BASE_ENDPOINT.student}
        columns={columns}
        hideOnSinglePage={false}
      />
    </div>
  );
}

export default Students;
