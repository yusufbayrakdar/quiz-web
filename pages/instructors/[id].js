import Head from "next/head";
import { Card } from "antd";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";

import useRedux from "../../hooks/useRedux";
import CustomTable from "../../components/CustomTable";
import { BASE_ENDPOINT, ROLES } from "../../utils";
import SelectStudentModalForInstructor from "../../components/Modals/SelectStudentModalForInstructor";
import Copyable from "../../components/Copyable";
import ProfilePage from "../../components/ProfilePage";

const defaultPageSize = 10;

function InstructorDetail() {
  const router = useRouter();
  const query = router.query;
  const _id = query.id;
  const { dispatchAction, $ } = useRedux();
  const [selectStudentModalOpen, setSelectStudentModalOpen] = useState(false);

  const activeUser = useSelector((state) => state.user.activeUser);
  const users = useSelector((state) => state.user.users);
  const usersLoading = useSelector((state) => state.user.usersLoading);
  const totalUsers = useSelector((state) => state.user.totalUsers);

  const search = query["search"];
  const page = query["page"] || 1;
  const limit = query["limit"] || defaultPageSize;

  useEffect(() => {
    if (_id) dispatchAction($.GET_USER_DETAIL, _id);
  }, [dispatchAction, $, _id]);

  useEffect(() => {
    dispatchAction($.GET_USERS, {
      page,
      limit,
      search,
      role: ROLES.STUDENT,
      instructor: _id,
    });
  }, [dispatchAction, $, page, limit, search, _id]);

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
      render: (phone) => phone && `(${phone.slice(0, 3)}) ${phone.slice(4)}`,
    },
    {
      title: "İlk Şifre",
      dataIndex: "passwordInit",
      render: (passwordInit) => <Copyable>{passwordInit}</Copyable>,
    },
  ];

  if (!activeUser) return null;
  const { fullName } = activeUser;
  return (
    <Container>
      <Head>
        <title>{fullName} · Eğitmen | BilsemAI</title>
        <meta name="description" content="Eğitmenler" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <SelectStudentModalForInstructor
        instructorId={_id}
        open={selectStudentModalOpen}
        onClose={() => setSelectStudentModalOpen(false)}
        refreshAction={{
          type: $.GET_USERS,
          payload: {
            page,
            limit,
            search,
            role: ROLES.STUDENT,
            instructor: _id,
          },
        }}
      />
      <ProfilePage userProp={activeUser} />
      <Card className="table">
        <div className="table-header">
          <div className="card-title gBold">Kayıtlı Öğrenciler</div>
          <div
            className="add-student-button center"
            onClick={() => setSelectStudentModalOpen(true)}
          >
            <FontAwesomeIcon icon={faUserPlus} width={27} />
          </div>
        </div>
        <CustomTable
          dataSource={users}
          loading={usersLoading}
          totalDocuments={totalUsers}
          defaultPageSize={defaultPageSize}
          baseEndpoint={`${BASE_ENDPOINT.instructor}/${_id}`}
          columns={columns}
          hideOnSinglePage={false}
        />
      </Card>
    </Container>
  );
}

export const Container = styled.div`
  width: 83%;
  margin-top: 10px;

  .table {
    margin-top: 200px;
    width: 73vw;
  }
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
  .table-header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 5px;
  }
  .add-student-button {
    margin-left: 10px;
    cursor: pointer;
    padding: 8px;
    border-radius: 4px;
    &:hover {
      background-color: ${({ theme }) => theme.colors.gray};
    }
  }
  .card-title {
    font-size: 20px;
    color: ${({ theme }) => theme.colors.primaryTextColor};
  }
`;

export default InstructorDetail;
