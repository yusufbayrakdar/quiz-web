import { Card } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import CustomTable from "../../components/CustomTable";
import useRedux from "../../hooks/useRedux";
import { BASE_ENDPOINT } from "../../utils";

const defaultPageSize = 12;

function Scores() {
  const { dispatchAction, $ } = useRedux();
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
      title: "Deneme",
      dataIndex: "quiz",
      render: (quiz) => (
        <NameWithLink
          onClick={() => router.push(BASE_ENDPOINT.quiz + "/" + quiz?._id)}
        >
          {quiz?.name || "-"}
        </NameWithLink>
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
      title: "Yüzde Skor",
      dataIndex: "totalQuestions",
      render: (totalQuestions, { score }) =>
        Math.round((score / totalQuestions) * 100),
    },
    {
      title: "Süre (sn)",
      dataIndex: "finishedAt",
      render: (finishedAt) => Math.round(finishedAt / 10) / 100,
    },
  ];

  return (
    <div>
      <Container>
        <Head>
          <title>Sonuçlar</title>
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
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

const Container = styled(Card)`
  width: 70vw;
  margin: 20px 0;
`;

export default Scores;
