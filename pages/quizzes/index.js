import React, { useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button, Card, Popconfirm, Row } from "antd";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useRedux from "../../hooks/useRedux";
import CustomTable from "../../components/CustomTable";
import { BASE_ENDPOINT, displayDuration, displayFullName } from "../../utils";

import styled from "styled-components";

function Quizzes() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const query = router.query;

  const search = query["search"];
  const page = query["page"] || 1;
  const limit = query["limit"] || 12;

  const instructor = useSelector((state) => state.auth.instructor);
  const quizList = useSelector((state) => state.quiz.quizList);
  const totalQuizzes = useSelector((state) => state.quiz.totalQuizzes);
  const quizListLoading = useSelector((state) => state.quiz.quizListLoading);
  const quizDeleteInProgress = useSelector(
    (state) => state.quiz.quizDeleteInProgress
  );

  useEffect(() => {
    dispatchAction($.GET_QUIZ_LIST_REQUEST, {
      search,
      page,
      limit,
    });
  }, [$, dispatchAction, search, page, limit]);

  const deleteQuiz = (_id) => {
    dispatchAction($.DELETE_QUIZ_REQUEST, _id);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (name, { _id }) => (
        <NameWithLink
          onClick={() => router.push(BASE_ENDPOINT.quiz + "/detail/" + _id)}
        >
          {name || "-"}
        </NameWithLink>
      ),
    },
    {
      title: "Soru",
      dataIndex: "questionList",
      render: (questionList) =>
        Array.isArray(questionList) && <Info>{questionList.length}</Info>,
    },
    {
      title: "Süre",
      dataIndex: "duration",
      render: (duration) =>
        duration && <Info>{displayDuration(duration)}</Info>,
    },
    {
      title: "Eğitmen",
      dataIndex: "creator",
      render: (creator) => creator && <Info>{displayFullName(creator)}</Info>,
    },
    {
      title: "",
      render: ({ _id, creator }) =>
        creator._id &&
        creator._id === instructor?._id && (
          <ActionButtons className="center">
            <Popconfirm
              placement="bottomLeft"
              title="Silmek istediğinizden emin misiniz?"
              okText="Evet"
              cancelText="Hayır"
              onConfirm={() => deleteQuiz(_id)}
            >
              <Button
                danger
                type="text"
                className="action-button center"
                loading={quizDeleteInProgress}
              >
                <FontAwesomeIcon
                  icon={faTrashAlt}
                  className="icon"
                  id="delete-icon"
                  width={12}
                />
              </Button>
            </Popconfirm>
            <Button
              type="text"
              className="action-button center"
              onClick={() => router.push(`${BASE_ENDPOINT.quiz}/form/${_id}`)}
            >
              <FontAwesomeIcon
                icon={faEdit}
                className="icon"
                id="edit-icon"
                width={13}
              />
            </Button>
            <Button type="text" className="action-button center">
              <div className="icon center" id="send-icon">
                <Image src="/telegram.svg" width={13} height={13} />
              </div>
            </Button>
          </ActionButtons>
        ),
    },
  ];

  return (
    <div>
      <Head>
        <title>Denemeler</title>
        <meta name="quizzes" content="Denemeler" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <Container>
        <CustomTable
          columns={columns}
          dataSource={quizList}
          totalDocuments={totalQuizzes}
          loading={quizListLoading}
          baseEndpoint={BASE_ENDPOINT.quiz}
        />
      </Container>
    </div>
  );
}

const Container = styled(Card)`
  width: 70vw;
  margin: 20px 0;
`;

const Info = styled.div`
  color: ${({ theme }) => theme.colors.deepDarkGray};
`;

const NameWithLink = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
`;

const ActionButtons = styled(Row)`
  .action-button {
    border-radius: 50%;
    margin-left: 4px;
  }
  .icon {
    position: absolute;
  }
  #delete-icon {
    color: ${({ theme }) => theme.colors.red};
  }
  #edit-icon {
    color: ${({ theme }) => theme.colors.primary};
  }
  #send-icon {
    color: ${({ theme }) => theme.colors.green};
  }
`;

export default Quizzes;
