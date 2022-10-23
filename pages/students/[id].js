import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import CustomTable from "../../components/CustomTable";
import ProfilePage from "../../components/ProfilePage";
import useRedux from "../../hooks/useRedux";
import { BASE_ENDPOINT, displayDate } from "../../utils";

const defaultPageSize = 10;

function StudentDetail() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const query = router.query;

  const _id = query?.id;
  const page = query["page"] || 1;
  const limit = query["limit"] || defaultPageSize;

  const activeStudent = useSelector((state) => state.user.activeUser);
  const scoreList = useSelector((state) => state.score.scoreList);
  const totalScores = useSelector((state) => state.score.totalScores);
  const scoreListInProgress = useSelector(
    (state) => state.score.scoreListInProgress
  );

  useEffect(() => {
    if (_id) {
      dispatchAction($.GET_USER_DETAIL, _id);
    }
  }, [$, dispatchAction, _id]);

  useEffect(() => {
    if (_id) {
      dispatchAction($.GET_SCORE_LIST_REQUEST, {
        page,
        limit,
        student: _id,
      });
    }
  }, [$, dispatchAction, _id, page, limit]);

  const columns = [
    {
      title: "Deneme",
      dataIndex: "quiz",
      render: (quiz) =>
        quiz?.name ? (
          <Link href={BASE_ENDPOINT.quiz + "/detail/" + quiz._id}>
            {quiz?.name}
          </Link>
        ) : (
          "-"
        ),
    },
    {
      title: "Skor",
      dataIndex: "score",
    },
    {
      title: "Toplam Soru",
      dataIndex: "totalQuestions",
    },
    {
      title: "Skor %",
      dataIndex: "totalQuestions",
      render: (totalQuestions, { score }) =>
        Math.round((score / totalQuestions) * 100),
    },
    {
      title: "Süre (sn)",
      dataIndex: "finishedAt",
      render: (finishedAt) => Math.round(finishedAt / 10) / 100,
    },
    {
      title: "Tarih",
      dataIndex: "createdAt",
      render: (createdAt) => displayDate(createdAt),
    },
  ];

  return (
    <>
      <Head>
        <title>BilsemAI | Öğrenci Sayfası</title>
        <meta name="students" content="Öğrenci Sayfası" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <ProfilePage userProp={activeStudent} />

      <StyledTable>
        <CustomTable
          dataSource={scoreList}
          columns={columns}
          totalDocuments={totalScores}
          baseEndpoint={BASE_ENDPOINT.student + "/" + _id}
          defaultPageSize={defaultPageSize}
          loading={scoreListInProgress}
        />
      </StyledTable>
    </>
  );
}

const StyledTable = styled.div`
  margin-top: 200px;
  width: 73vw;
`;

export default StudentDetail;
