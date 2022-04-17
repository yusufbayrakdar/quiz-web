import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import {
  faCalendarCheck,
  faCalendarPlus,
  faClock,
  faHashtag,
  faSignature,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Col, Pagination, Row } from "antd";
import styled from "styled-components";

import useRedux from "../../../hooks/useRedux";
import QuestionCard from "../../../components/QuestionCard";
import {
  BASE_ENDPOINT,
  displayDate,
  displayDuration,
  displayFullName,
} from "../../../utils";
import theme from "../../../utils/theme";

function QuizDetail() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const query = router.query;

  const page = query["page"] || 1;
  const limit = query["limit"] || 12;

  const activeQuiz = useSelector((state) => state.quiz.activeQuiz);

  useEffect(() => {
    if (query?.id)
      dispatchAction($.GET_QUIZ_DETAIL_REQUEST, {
        _id: query?.id,
        page,
        limit,
      });
  }, [$, dispatchAction, query?.id, page, limit]);

  const HeaderInfo = ({ icon, color, children }) => (
    <HeaderInfoStyled color={color}>
      <FontAwesomeIcon icon={icon} />
      {children}
    </HeaderInfoStyled>
  );

  return (
    <Styled>
      <Card>
        <Row>
          <HeaderInfo icon={faSignature} color={theme.colors.primary}>
            Deneme Adı: {activeQuiz?.name || "-"}
          </HeaderInfo>
          <HeaderInfo color={theme.colors.yellow} icon={faHashtag}>
            Soru: {activeQuiz?.questionList?.totalDocs}
          </HeaderInfo>
          <HeaderInfo color={theme.colors.red} icon={faClock}>
            Süre: {displayDuration(activeQuiz?.duration)}
          </HeaderInfo>
        </Row>
        <Row>
          <HeaderInfo color={theme.colors.purple} icon={faUser}>
            Oluşturan: {displayFullName(activeQuiz?.creator)}
          </HeaderInfo>
          <HeaderInfo color={theme.colors.green} icon={faCalendarPlus}>
            Oluşturma Tarihi: {displayDate(activeQuiz?.createdAt)}
          </HeaderInfo>
          <HeaderInfo color={theme.colors.darkPrimary} icon={faCalendarCheck}>
            Güncelleme Tarihi: {displayDate(activeQuiz?.updatedAt)}
          </HeaderInfo>
        </Row>
      </Card>
      <Row
        gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
        className="questions"
      >
        {activeQuiz?.questionList?.docs?.map((question) => (
          <Col span={8}>
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
          onChange={(page) =>
            router.push(
              BASE_ENDPOINT.quiz +
                `/detail/${activeQuiz?._id}?page=${page}&limit=${limit}`
            )
          }
        />
      </div>
    </Styled>
  );
}

const HeaderInfoStyled = styled.div`
  background-color: ${({ color }) => color};
  color: ${({ theme }) => theme.colors.white};
  border-radius: 3px;
  width: fit-content;
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