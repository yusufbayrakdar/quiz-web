import React, { useEffect } from "react";
import Head from "next/head";
import useRedux from "../../hooks/useRedux";
import { useSelector } from "react-redux";
import { Button, Popconfirm } from "antd";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";

import Question from "../../components/Question";
import CustomTable from "../../components/CustomTable";
import { BASE_ENDPOINT } from "../../utils";

function Questions() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const query = router.query;

  const search = query["search"];
  const page = query["page"];
  const limit = query["limit"];

  const instructor = useSelector((state: any) => state.auth.instructor);
  const questionList = useSelector((state: any) => state.question.questionList);
  const totalQuestions = useSelector(
    (state: any) => state.question.totalQuestions
  );
  const questionsLoading = useSelector(
    (state: any) => state.question.questionsLoading
  );
  const questionDeleteInProgress = useSelector(
    (state: any) => state.question.questionDeleteInProgress
  );

  useEffect(() => {
    dispatchAction($.GET_QUESTION_LIST_REQUEST, { search, page, limit });
  }, [$, dispatchAction, search, page, limit]);

  const deleteQuestion = (_id: string) => {
    dispatchAction($.DELETE_QUESTION_REQUEST, _id);
  };

  const columns = [
    {
      title: "Soru",
      render: (activeQuestion: any) => (
        <div style={{ marginLeft: 10 }}>
          <Question questionListItem={activeQuestion} showMode={true} />
        </div>
      ),
    },
    {
      title: "Kategori",
      dataIndex: "category",
    },
    {
      title: "Sınıf",
      dataIndex: "grade",
    },
    {
      title: "Süre (sn)",
      dataIndex: "duration",
    },
    {
      title: "Oluşturan",
      dataIndex: ["creator", "name"],
    },
    {
      title: "",
      render: ({ _id, creator }: any) =>
        creator._id === instructor._id && (
          <div>
            <Popconfirm
              placement="bottomLeft"
              title="Silmek istediğinizden emin misiniz?"
              okText="Evet"
              cancelText="Hayır"
              onConfirm={() => deleteQuestion(_id)}
            >
              <Button
                danger
                type="text"
                className="rounded-full"
                loading={questionDeleteInProgress}
              >
                <div className="absolute top-0 left-0 right-0 bottom-0 center">
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="text-red-500"
                    width={12}
                  />
                </div>
              </Button>
            </Popconfirm>
            <Button
              type="text"
              className="rounded-full ml-1"
              onClick={() =>
                router.push(`${BASE_ENDPOINT.question}/form/${_id}`)
              }
            >
              <div className="absolute top-0 left-0 right-0 bottom-0 center">
                <FontAwesomeIcon
                  icon={faEdit}
                  className="text-blue-600"
                  width={13}
                />
              </div>
            </Button>
          </div>
        ),
    },
  ];

  return (
    <div className="w-10/12">
      <Head>
        <title>Sorular</title>
        <meta name="questions" content="Sorular" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <div className="mt-5 mb-5">
        {/* @ts-ignore */}
        <CustomTable
          columns={columns}
          totalDocuments={totalQuestions}
          dataSource={questionList}
          loading={questionsLoading}
        />
      </div>
    </div>
  );
}

export default Questions;
