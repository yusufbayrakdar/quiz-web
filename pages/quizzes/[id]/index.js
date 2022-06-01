import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

import useRedux from "../../../hooks/useRedux";
import { BASE_ENDPOINT } from "../../../utils";

function Quiz() {
  const { dispatchAction, $ } = useRedux();
  // const router = useRouter();
  // const quizId = router.query?.id;
  // if (!quizId) router.push(BASE_ENDPOINT.quiz);

  // const activeQuiz = useSelector((state) => state.quiz.activeQuiz);

  // useEffect(() => {
  //   dispatchAction($.GET_QUIZ_DETAIL_REQUEST, { _id: quizId });
  // }, [$, dispatchAction, quizId]);
  return <div>Quiz is being implemented</div>;
}

export default Quiz;
