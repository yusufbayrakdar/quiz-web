import React, { useEffect } from "react";
import Head from "next/head";
import useRedux from "../../hooks/useRedux";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import { useRouter } from "next/router";
import Question from "../../components/Question";

function Questions() {
  const { dispatchAction, $ } = useRedux();

  const questionList = useSelector(
    (state: RootState) => state.question.questionList
  );

  const prepareList = (list: Array<object>) => {
    return list?.reduce((store: any, current: any) => {
      store[current.coordinate] = current.shape;
      return store;
    }, {});
  };

  // In progress
  const question = prepareList(questionList[0]?.question);
  const choices = prepareList(questionList[0]?.choices);

  const router = useRouter();
  const query = router.query;

  const search = query["search"];
  const page = query["page"];
  const limit = query["limit"];

  useEffect(() => {
    dispatchAction($.GET_QUESTION_LIST_REQUEST, { search, page, limit });
  }, [$, dispatchAction, search, page, limit]);

  return (
    <div className="w-10/12">
      <Head>
        <title>Sorular</title>
        <meta name="questions" content="Sorular" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      Questions list will be ready soon...
      <div style={{ width: 300, height: 400 }}>
        <Question data={{ question, choices }} showMode={true} small={true} />
      </div>
    </div>
  );
}

export default Questions;
