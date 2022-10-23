import React, { useEffect } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import { Button, Popconfirm, Row } from "antd";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

import useRedux from "../../hooks/useRedux";
import Question from "../../components/Question";
import CustomTable from "../../components/CustomTable";
import { BASE_ENDPOINT, displayDuration } from "../../utils";
import PermitContainer from "../../components/PermitContainer";
import { CAN, D as DOMAINS } from "../../config/permission";

function Questions() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const query = router.query;

  const search = query["search"];
  const page = query["page"];
  const limit = query["limit"];

  const user = useSelector((state) => state.auth.user);
  const questionList = useSelector((state) => state.question.questionList);
  const totalQuestions = useSelector((state) => state.question.totalQuestions);
  const questionsLoading = useSelector(
    (state) => state.question.questionsLoading
  );
  const questionDeleteInProgress = useSelector(
    (state) => state.question.questionDeleteInProgress
  );

  useEffect(() => {
    dispatchAction($.GET_QUESTION_LIST_REQUEST, { search, page, limit });
  }, [$, dispatchAction, search, page, limit]);

  const deleteQuestion = (_id) => {
    dispatchAction($.DELETE_QUESTION_REQUEST, _id);
  };

  const columns = [
    { title: "#", dataIndex: "questionNumber" },
    {
      title: "Soru",
      render: (activeQuestion) => (
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
      render: (duration) => duration && displayDuration(duration),
    },
    {
      title: "Oluşturan",
      dataIndex: "creatorName",
    },
    {
      title: "",
      render: ({ _id, creatorId }) => {
        const isOwnerInstructor = creatorId === user?._id;
        return (
          <Row className="center">
            <PermitContainer
              permit={{
                domain: DOMAINS.question,
                can: CAN.EDIT,
                except: isOwnerInstructor,
              }}
            >
              <Button
                type="text"
                className="action-button center"
                onClick={() =>
                  router.push(`${BASE_ENDPOINT.question}/form/${_id}`)
                }
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  className="icon"
                  id="edit-icon"
                  width={13}
                />
              </Button>
            </PermitContainer>
            <PermitContainer
              permit={{
                domain: DOMAINS.question,
                can: CAN.DELETE,
                except: isOwnerInstructor,
              }}
            >
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
                  className="action-button center"
                  loading={questionDeleteInProgress}
                >
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    className="icon"
                    id="delete-icon"
                    width={12}
                  />
                </Button>
              </Popconfirm>
            </PermitContainer>
          </Row>
        );
      },
    },
  ];

  return (
    <Styled>
      <Head>
        <title>Sorular</title>
        <meta name="questions" content="Sorular" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      {/* @ts-ignore */}
      <CustomTable
        columns={columns}
        dataSource={questionList}
        totalDocuments={totalQuestions}
        loading={questionsLoading}
        baseEndpoint={BASE_ENDPOINT.question}
      />
    </Styled>
  );
}

const Styled = styled.div`
  width: 83%;
  margin-top: 30px;

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
`;

export default Questions;
