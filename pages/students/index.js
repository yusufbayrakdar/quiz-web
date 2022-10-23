import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Head from "next/head";
import styled from "styled-components";

import CustomTable from "../../components/CustomTable";
import Copyable from "../../components/Copyable";
import useRedux from "../../hooks/useRedux";
import TableHeaderBar from "../../components/TableHeaderBar";
import { BASE_ENDPOINT, ROLES } from "../../utils";
import DeleteButton from "../../components/Buttons/DeleteButton";
import RemoveStudentButton from "../../components/Buttons/RemoveStudentButton";
import AddStudentButton from "../../components/Buttons/AddStudentButton";
import EditItemButton from "../../components/Buttons/EditItemButton";
import EditStudentModal from "../../components/Modals/EditStudentModal";
import InstructorListButton from "../../components/Buttons/InstructorListButton";
import PermitContainer from "../../components/PermitContainer";
import { CAN, D as DOMAINS } from "../../config/permission";
import usePermit from "../../hooks/usePermit";
import SelectInstructorModal from "../../components/Modals/SelectInstructorModal";

const defaultPageSize = 10;

function Students() {
  const router = useRouter();
  const query = router.query;
  const { dispatchAction, $ } = useRedux();

  const canAssign = usePermit({
    domain: DOMAINS.student,
    can: CAN.ASSIGN,
  });
  const user = useSelector((state) => state.auth.user);
  const students = useSelector((state) => state.user.users);
  const studentsLoading = useSelector((state) => state.user.usersLoading);
  const totalStudents = useSelector((state) => state.user.totalUsers);

  const [editStudentFormOpenWithStudent, setEditStudentFormOpenWithStudent] =
    useState();
  const [
    selectInstructorModalOpenWithStudentId,
    setSelectInstructorModalOpenWithStudentId,
  ] = useState(false);

  const search = query["search"];
  const page = query["page"] || 1;
  const limit = query["limit"] || defaultPageSize;
  const hasPhone = query["hasPhone"];
  const isOwner = query["isOwner"];

  useEffect(() => {
    if (user) {
      dispatchAction($.GET_USERS, {
        page,
        limit,
        search,
        hasPhone,
        isOwner,
        role: ROLES.STUDENT,
      });
    }
  }, [dispatchAction, $, page, limit, search, hasPhone, isOwner, user]);

  const deleteStudent = (studentId) => {
    dispatchAction($.DELETE_STUDENT_REQUEST, {
      _id: studentId,
      refreshAction: {
        type: $.GET_USERS,
        payload: {
          page,
          limit,
          search,
          hasPhone,
          isOwner,
          role: ROLES.STUDENT,
        },
      },
    });
  };

  const addStudent = (studentId) => {
    dispatchAction($.ADD_STUDENT_REQUEST, {
      _id: studentId,
      refreshAction: {
        type: $.GET_USERS,
        payload: {
          page,
          limit,
          search,
          hasPhone,
          isOwner,
          role: ROLES.STUDENT,
        },
      },
    });
  };

  const ManipulateButton = ({ student }) => {
    if (canAssign && isOwner === "true") {
      return <RemoveStudentButton onConfirm={() => deleteStudent(student)} />;
    }
    if (canAssign && isOwner === "false") {
      return <AddStudentButton onClick={() => addStudent(student)} />;
    }
    return <DeleteButton onConfirm={() => deleteStudent(student)} />;
  };

  const columns = [
    {
      title: "Öğrenci",
      dataIndex: "fullName",
      render: (fullName, { _id, nickname }) => (
        <div
          className="student-name"
          onClick={() => router.push(BASE_ENDPOINT.student + "/" + _id)}
        >
          {fullName}
          <span className="nickname">@{nickname}</span>
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
      render: (student) => {
        const isOwnerInstructor = student?.creator === user?._id;
        return (
          <div style={{ display: "flex" }}>
            <PermitContainer
              permit={{
                domain: DOMAINS.student,
                can: CAN.EDIT,
                except: isOwnerInstructor,
              }}
            >
              <EditItemButton
                baseEndpoint={BASE_ENDPOINT.student}
                _id={student?._id}
                customOnclick={() => setEditStudentFormOpenWithStudent(student)}
              />
            </PermitContainer>
            <PermitContainer
              permit={{
                domain: DOMAINS.student,
                can: CAN.ASSIGN,
              }}
            >
              <InstructorListButton
                onClick={() =>
                  setSelectInstructorModalOpenWithStudentId(student._id)
                }
              />
            </PermitContainer>
            <PermitContainer
              permit={{
                domain: DOMAINS.student,
                can: CAN.DELETE,
              }}
            >
              <ManipulateButton student={student?._id} />
            </PermitContainer>
          </div>
        );
      },
    },
  ];

  return (
    <Styled>
      <Head>
        <title>Öğrenciler | BilsemAI</title>
        <meta name="description" content="Öğrenciler" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <EditStudentModal
        student={editStudentFormOpenWithStudent}
        open={editStudentFormOpenWithStudent}
        onClose={() => setEditStudentFormOpenWithStudent(null)}
        refreshAction={{
          type: $.GET_USERS,
          payload: {
            page,
            limit,
            search,
            role: ROLES.STUDENT,
          },
        }}
      />
      <SelectInstructorModal
        studentId={selectInstructorModalOpenWithStudentId}
        open={selectInstructorModalOpenWithStudentId}
        onClose={() => setSelectInstructorModalOpenWithStudentId(null)}
        refreshAction={{
          type: $.GET_USERS,
          payload: {
            page,
            limit,
            search,
            role: ROLES.STUDENT,
          },
        }}
      />
      <TableHeaderBar
        baseEndpoint={BASE_ENDPOINT.student}
        showCreate
        showPhoneFilter
        showOwnerFilter={canAssign}
      />
      <CustomTable
        dataSource={students}
        loading={studentsLoading}
        totalDocuments={totalStudents}
        defaultPageSize={defaultPageSize}
        baseEndpoint={BASE_ENDPOINT.student}
        columns={columns}
        hideOnSinglePage={false}
      />
    </Styled>
  );
}

const Styled = styled.div`
  width: 83%;

  .student-name {
    color: ${({ theme }) => theme.colors.primary};
    cursor: pointer;
  }
  .nickname {
    margin-left: 4px;
    font-size: 14px;
    fontweight: 300;
    color: ${({ theme }) => theme.colors.deepDarkGray};
  }
`;

export default Students;
