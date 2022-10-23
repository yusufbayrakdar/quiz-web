import React, { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
  faCalendarCheck,
  faCalendarPlus,
  faClock,
  faHashtag,
  faSignature,
  faUser,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Pagination, Row, Tabs } from "antd";
import styled from "styled-components";

import useRedux from "../../../hooks/useRedux";
import QuestionCard from "../../../components/QuestionCard";
import CustomTable from "../../../components/CustomTable";
import { BASE_ENDPOINT, displayDate, displayDuration } from "../../../utils";
import theme from "../../../utils/theme";
import EditButton from "../../../components/Buttons/EditButton";
import ResultCard from "../../../components/ResultCard";

function QuizDetail() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const query = router.query;

  const page = query["page"] || 1;
  const limit = query["limit"] || 12;

  const activeQuiz = useSelector((state) => state.quiz.activeQuiz);
  const instructor = useSelector((state) => state.auth.instructor);

  useEffect(() => {
    if (query?.id) {
      dispatchAction($.GET_QUIZ_DETAIL_REQUEST, {
        _id: query?.id,
        populateQuestions: true,
        results: true,
        page,
        limit,
      });
    }
  }, [$, dispatchAction, query?.id, page, limit]);

  const HeaderInfo = ({ icon, color, children }) => (
    <HeaderInfoStyled color={color}>
      <FontAwesomeIcon icon={icon} width={16} height={16} />
      {children}
    </HeaderInfoStyled>
  );

  const columns = [
    {
      title: "Öğrenci",
      dataIndex: "student",
      render: (student) => {
        return (
          <NameWithLink
            detailAvailable={student?.fullName}
            onClick={() =>
              student?.fullName &&
              router.push(BASE_ENDPOINT.student + "/" + student?._id)
            }
          >
            {student?.fullName || "-"}
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

  const GeneralResults = () => (
    <Row
      gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
      style={{ display: "flex", justifyContent: "space-around" }}
    >
      <ResultCard
        title="Ortalama Başarı"
        value={activeQuiz?.general?.scoreAvg}
        fullPoint={activeQuiz?.questionList?.totalDocs}
        label={`${Number(
          (activeQuiz?.general?.scoreAvg /
            activeQuiz?.questionList?.totalDocs) *
            100
        ).toFixed(2)}%`}
        useFailColor
      />
      <ResultCard
        title="Ortalama Bitirme Süresi"
        unit="sn"
        value={Math.round(activeQuiz?.general?.finishedAtAvg / 10) / 100}
      />
      <ResultCard
        title="Tamamlanma"
        value={activeQuiz?.general?.completedStudents}
        fullPoint={activeQuiz?.studentCount}
        label={`${activeQuiz?.general?.completedStudents}/${activeQuiz?.studentCount}`}
      />
    </Row>
  );

  const QuestionPaginate = () => (
    <>
      <Row
        gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
        className="questions"
      >
        {activeQuiz?.questionList?.docs?.map((question) => (
          <Col span={8} key={question?._id}>
            <QuestionCard question={question} selectable={false} />
          </Col>
        ))}
      </Row>
      <div className="center pagination">
        <Pagination
          size="small"
          total={activeQuiz?.questionList?.totalDocs}
          pageSize={limit}
          showSizeChanger
          showQuickJumper
          onChange={(page) => {
            console.log("_id", activeQuiz?._id);
            router.push(
              BASE_ENDPOINT.quiz +
                `/detail/${activeQuiz?._id}?page=${page}&limit=${limit}`
            );
          }}
        />
      </div>
    </>
  );

  const Results = () => (
    <CustomTable
      dataSource={activeQuiz?.scores}
      columns={columns}
      baseEndpoint={BASE_ENDPOINT.quiz + "/detail/" + activeQuiz?._id}
      totalDocuments={activeQuiz?.scores?.length}
    />
  );

  const items = [
    { label: "Genel", key: "general", children: <GeneralResults /> }, // remember to pass the key prop
    { label: "Sonuçlar", key: "results", children: <Results /> },
    { label: "Sorular", key: "questions", children: <QuestionPaginate /> },
  ];

  const pageTitle = activeQuiz?.name ? activeQuiz?.name + " · " : "";
  return (
    <Styled>
      <Head>
        <title>{pageTitle}Deneme | BilsemAI</title>
        <meta name="quizzes" content="Deneme Detayı" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <Card>
        <Row>
          <HeaderInfo icon={faSignature} color={theme.colors.primary}>
            Deneme Adı: {activeQuiz?.name || "-"}
          </HeaderInfo>
          <HeaderInfo color={theme.colors.yellow} icon={faHashtag}>
            Soru: {activeQuiz?.questionList?.totalDocs}
          </HeaderInfo>
          <HeaderInfo color={theme.colors.red} icon={faClock}>
            Süre:{" "}
            {displayDuration(
              activeQuiz?.duration ||
                activeQuiz?.questionList?.docs?.reduce((total, current) => {
                  total += current?.duration;
                  return total;
                }, 0)
            )}
          </HeaderInfo>
          <HeaderInfo color={theme.colors.turquoise} icon={faUsers}>
            Öğrenci: {activeQuiz.studentCount || 0}
          </HeaderInfo>
        </Row>
        <Row>
          <HeaderInfo color={theme.colors.purple} icon={faUser}>
            Oluşturan: {activeQuiz?.creator?.fullName}
          </HeaderInfo>
          <HeaderInfo color={theme.colors.green} icon={faCalendarPlus}>
            Oluşturma Tarihi: {displayDate(activeQuiz?.createdAt)}
          </HeaderInfo>
          <HeaderInfo color={theme.colors.darkPrimary} icon={faCalendarCheck}>
            Güncelleme Tarihi: {displayDate(activeQuiz?.updatedAt)}
          </HeaderInfo>
        </Row>
        {activeQuiz?.creator?._id === instructor?._id && instructor?._id && (
          <EditButton
            style={{ position: "absolute", top: 20, right: 20 }}
            baseEndpoint={BASE_ENDPOINT.quiz}
            _id={activeQuiz?._id}
          />
        )}
      </Card>
      <Card style={{ marginTop: 10 }}>
        <Tabs defaultActiveKey="general" items={items} />
      </Card>
    </Styled>
  );
}

const NameWithLink = styled.div`
  color: ${({ theme, detailAvailable }) =>
    detailAvailable && theme.colors.primary};
  cursor: ${({ detailAvailable }) => (detailAvailable ? "pointer" : "default")};
`;

const HeaderInfoStyled = styled.div`
  background-color: ${({ color }) => color};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 3px;
  width: fit-content;
  display: flex;
  align-items: center;
  padding: 3px 7px;
  margin: 3px 5px;
  * {
    margin: 0 5px;
  }
`;

const Styled = styled.div`
  width: 83%;
  margin-top: 30px;

  .questions {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .pagination {
    padding-bottom: 50px;
  }
`;

export default QuizDetail;
