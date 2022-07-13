import { Card } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import CustomTable from "../../components/CustomTable";

import ProfilePage from "../../components/ProfilePage";
import useRedux from "../../hooks/useRedux";
import { BASE_ENDPOINT, displayDate } from "../../utils";

function StudentDetail() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const query = router.query;

  const _id = query?.id;
  const page = query["page"] || 1;
  const limit = query["limit"] || 10;

  const activeStudent = useSelector((state) => state.student.activeStudent);

  useEffect(() => {
    if (_id) dispatchAction($.GET_STUDENT_DETAIL_REQUEST, { _id, page, limit });
  }, [$, dispatchAction, _id, page, limit]);

  const columns = [
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
        <title>BilsemAi | Öğrenci Sayfası</title>
        <meta name="students" content="Öğrenci Sayfası" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <ProfilePage studentProp={activeStudent} />

      <div style={{ marginTop: 230, width: "81.4%" }}>
        <CustomTable
          dataSource={activeStudent?.scores?.docs}
          columns={columns}
          totalDocuments={activeStudent?.scores?.totalDocs}
          baseEndpoint={BASE_ENDPOINT.student + "/" + _id}
          defaultPageSize={10}
        />
      </div>
    </>
  );
}

export default StudentDetail;
