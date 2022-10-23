import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import CustomTable from "../../components/CustomTable";
import useRedux from "../../hooks/useRedux";
import { BASE_ENDPOINT, displayDate, ROLES } from "../../utils";

const defaultPageSize = 12;

function Scores() {
  const { dispatchAction, $ } = useRedux();
  const user = useSelector((state) => state.auth.user);
  const isStudent = user?.role === ROLES.STUDENT;
  const scoreList = useSelector((state) => state.score.scoreList);
  const totalScores = useSelector((state) => state.score.totalScores);
  const router = useRouter();
  const query = router.query;

  const page = query["page"] || 1;
  const limit = query["limit"] || defaultPageSize;

  useEffect(() => {
    dispatchAction($.GET_SCORE_LIST_REQUEST, { page, limit });
  }, [$, dispatchAction, page, limit]);

  const columns = [
    {
      title: "Öğrenci",
      dataIndex: "student",
      render: (student) => (
        <NameWithLink
          available={student?._id ? 1 : 0}
          onClick={() =>
            router.push(BASE_ENDPOINT.student + "/" + student?._id)
          }
        >
          {student?.fullName || "-"}
        </NameWithLink>
      ),
    },
    {
      title: "Deneme",
      dataIndex: "quiz",
      render: (quiz) => {
        console.log(quiz);
        return (
          <NameWithLink
            available={quiz?._id ? 1 : 0}
            onClick={() =>
              quiz?._id &&
              router.push(
                BASE_ENDPOINT.quiz + (isStudent ? "/" : "/detail/") + quiz?._id
              )
            }
          >
            {quiz?.name || "-"}
          </NameWithLink>
        );
      },
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

  if (user?.role === ROLES.STUDENT) columns.shift();

  return (
    <div>
      <Container>
        <Head>
          <title>Sonuçlar | BilsemAI</title>
          <meta name="score" content="Sonuçlar" />
          <link rel="icon" href="/ideas.png" />
        </Head>
        <CustomTable
          columns={columns}
          dataSource={scoreList}
          baseEndpoint={BASE_ENDPOINT.score}
          totalDocuments={totalScores}
          defaultPageSize={defaultPageSize}
        />
      </Container>
    </div>
  );
}

const NameWithLink = styled.div`
  color: ${({ theme, available }) =>
    theme.colors[available ? "primary" : "black"]};
  cursor: ${({ available }) => (available ? "pointer" : "default")};
`;

const Container = styled.div`
  width: 70vw;
  margin: 50px 0;
`;

export default Scores;
