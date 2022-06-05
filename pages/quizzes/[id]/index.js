import React, { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import styled from "styled-components";
import Countdown, { zeroPad } from "react-countdown";

import Question from "../../../components/Question";
import useRedux from "../../../hooks/useRedux";
import { Button, Tooltip } from "antd";
import { BASE_ENDPOINT } from "../../../utils";
import ScoreModal from "../../../components/Modals/ScoreModal";

function Quiz() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const quizId = router?.query?.id;

  const activeQuiz = useSelector((state) => state.quiz.activeQuiz);
  const { docs: questionList, ...questionListPaginateInfo } =
    activeQuiz?.questionList || {};
  const totalQuestions = activeQuiz?.questionList?.totalDocs;
  const quizSubmission = useSelector((state) => state.quiz.quizSubmission);
  const [questionTurn, setQuestionTurn] = useState(0);
  const [duration, setDuration] = useState();
  const [countdownApi, setCountdownApi] = useState(null);
  const [startDate, setStartDate] = useState(Date.now());
  const [resultModalVisible, setResultModalVisible] = useState(false);

  useEffect(() => {
    return () => {
      dispatchAction($.QUIZ_FORM_RESET);
      dispatchAction($.DECOLLAPSE_SIDER);
      setDuration(null);
      setQuestionTurn(0);
      countdownApi?.stop();
    };
  }, [$, dispatchAction]);

  useEffect(() => dispatchAction($.COLLAPSE_SIDER), [$, dispatchAction]);

  useEffect(() => {
    const nextTurn = quizSubmission?.answerList?.length;
    if (nextTurn < totalQuestions) {
      setQuestionTurn(nextTurn);
    } else if (totalQuestions) {
      countdownApi?.pause();
      dispatchAction($.FINISH_QUIZ_REQUEST, Date.now() - startDate);
      setResultModalVisible(true);
    }
  }, [quizSubmission, totalQuestions]);

  useEffect(() => {
    if (quizId !== activeQuiz?._id) return;

    if (
      questionTurn === questionList?.length - 1 &&
      questionList.length < totalQuestions &&
      questionListPaginateInfo?.hasNextPage
    ) {
      dispatchAction($.GET_QUIZ_DETAIL_REQUEST, {
        _id: activeQuiz?._id,
        populateQuestions: true,
        page: questionListPaginateInfo.nextPage,
        add: true,
      });
    }

    if (
      !duration ||
      (countdownApi?.isCompleted() && !countdownApi.isPaused()) ||
      !activeQuiz?.duration
    ) {
      setDuration(
        new Date().getTime() +
          (activeQuiz?.duration || questionList?.[questionTurn]?.duration) *
            1000
      );
    }
  }, [activeQuiz, questionTurn, countdownApi, quizId]);

  useEffect(() => {
    dispatchAction($.ASSIGN_QUESTION_ID, questionList?.[questionTurn]?._id);
  }, [$, dispatchAction, questionTurn, questionList]);

  useEffect(() => {
    if (quizId) {
      dispatchAction($.GET_QUIZ_DETAIL_REQUEST, {
        _id: quizId,
        populateQuestions: true,
      });
    }
  }, [$, dispatchAction, quizId]);

  const countdownRenderer = ({ hours, minutes, seconds, completed }) => {
    const warningWithColor = !hours && !minutes && seconds <= 5;
    return (
      <StyledCountdown className="gBold" warningWithColor={warningWithColor}>
        {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)}
      </StyledCountdown>
    );
  };

  const onExit = () => {
    router.push(BASE_ENDPOINT.quiz);
  };

  return (
    <Container className="center">
      <Head>
        <title>Deneme{activeQuiz?.name ? ` - ${activeQuiz.name}` : ""}</title>
        <meta name="quiz" content="Deneme" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <ScoreModal
        visible={resultModalVisible}
        onClose={() => setResultModalVisible(false)}
      />
      {duration && activeQuiz?.questionList?.totalDocs ? (
        <div className="header">
          <Countdown
            date={duration}
            renderer={countdownRenderer}
            daysInHours={true}
            onComplete={() => {
              dispatchAction($.SIGN_QUESTION, null);
              if (quizSubmission?.answerList?.length < totalQuestions - 1) {
                countdownApi.start();
              }
            }}
            ref={(countdown) => {
              if (countdown) setCountdownApi(countdown.getApi());
            }}
          />

          <span className="gBold currentQuestionInfo">{`${questionTurn + 1}/${
            activeQuiz?.questionList?.totalDocs
          }`}</span>
        </div>
      ) : null}

      <div className="question-container center">
        <Question
          questionListItem={questionList?.[questionTurn]}
          style={{ width: "50vw" }}
          showMode
        />
      </div>

      <div className="footer">
        <Tooltip title="Daha sonra tekrar dene" placement="topRight">
          <Button danger onClick={onExit}>
            Çık
          </Button>
        </Tooltip>
      </div>
    </Container>
  );
}

const StyledCountdown = styled.span`
  font-size: 18px;
  color: ${({ theme, warningWithColor }) =>
    warningWithColor ? theme.colors.pureRed : theme.colors.darkPrimary};
`;

const Container = styled.div`
  width: 100vw;
  flex-direction: column;
  position: relative;

  .header {
    width: 100%;
    height: 70px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    top: 0;
    padding-left: 40px;
    padding-right: 40px;

    .currentQuestionInfo {
      font-size: 18px;
    }
  }

  .question-container {
    width: 100%;
    flex: 1;
  }

  .footer {
    padding: 20px;
    width: 100%;
    position: absolute;
    bottom: 0;
  }
`;

export default Quiz;
