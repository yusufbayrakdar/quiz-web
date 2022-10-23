import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { Button, Row } from "antd";
import styled from "styled-components";

import useRedux from "../../hooks/useRedux";
import CustomTable from "../../components/CustomTable";
import { BASE_ENDPOINT, displayDuration, ROLES } from "../../utils";
import SelectStudentModalForQuiz from "../../components/Modals/SelectStudentModalForQuiz";
import DeleteButton from "../../components/Buttons/DeleteButton";
import EditItemButton from "../../components/Buttons/EditItemButton";
import StartButton from "../../components/Buttons/StartButton";
import PermitContainer from "../../components/PermitContainer";
import { CAN, D as DOMAINS } from "../../config/permission";

function Quizzes() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const query = router.query;

  const search = query["search"];
  const page = query["page"] || 1;
  const limit = query["limit"] || 12;

  const user = useSelector((state) => state.auth.user);
  const isStudent = user?.role === ROLES.STUDENT;
  const quizList = useSelector((state) => state.quiz.quizList);
  const totalQuizzes = useSelector((state) => state.quiz.totalQuizzes);
  const quizListLoading = useSelector((state) => state.quiz.quizListLoading);
  const quizSavingInProgress = useSelector(
    (state) => state.quiz.quizSavingInProgress
  );
  const quizDeleteInProgress = useSelector(
    (state) => state.quiz.quizDeleteInProgress
  );

  const [selectStudentModalOpenWithQuiz, setSelectStudentModalOpenWithQuiz] =
    useState(null);

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
      title: "Deneme",
      dataIndex: "name",
      render: (name, { _id }) => (
        <NameWithLink
          onClick={() =>
            router.push(
              isStudent
                ? BASE_ENDPOINT.quiz + "/" + _id
                : BASE_ENDPOINT.quiz + "/detail/" + _id
            )
          }
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
      title: "Öğrenci",
      dataIndex: "studentCount",
      render: (studentCount) => <Info>{studentCount}</Info>,
    },
    {
      title: "Süre",
      dataIndex: "duration",
      render: (duration, { questionList }) => {
        return (
          <Info>
            {displayDuration(
              duration ||
                questionList?.reduce((total, current) => {
                  total += current?.duration?.duration;
                  return total;
                }, 0)
            )}
          </Info>
        );
      },
    },
    {
      title: "Eğitmen",
      dataIndex: "creator",
      render: (creator) =>
        creator && (
          <NameWithLink
            onClick={() =>
              router.push(BASE_ENDPOINT.instructor + "/" + creator._id)
            }
          >
            {creator.fullName}
          </NameWithLink>
        ),
    },
    {
      title: "",
      render: ({ _id, creator }) => {
        const isOwnerInstructor = user?._id === creator?._id;
        return isStudent ? (
          <StartButton _id={_id} />
        ) : (
          <ActionButtons>
            <PermitContainer
              permit={{
                domain: DOMAINS.quiz,
                can: CAN.ASSIGN,
              }}
            >
              <Button
                type="text"
                className="action-button center"
                onClick={() => {
                  setSelectStudentModalOpenWithQuiz(_id);
                }}
              >
                <div className="icon center" id="send-icon">
                  <Image
                    src="/telegram.svg"
                    width={13}
                    height={13}
                    alt="telegram-send-icon"
                  />
                </div>
              </Button>
            </PermitContainer>
            <PermitContainer
              permit={{
                domain: DOMAINS.quiz,
                can: CAN.EDIT,
                except: isOwnerInstructor,
              }}
            >
              <EditItemButton baseEndpoint={BASE_ENDPOINT.quiz} _id={_id} />
            </PermitContainer>
            <PermitContainer
              permit={{
                domain: DOMAINS.quiz,
                can: CAN.DELETE,
                except: isOwnerInstructor,
              }}
            >
              <DeleteButton
                onConfirm={() => deleteQuiz(_id)}
                loading={quizDeleteInProgress}
              />
            </PermitContainer>
          </ActionButtons>
        );
      },
    },
  ];

  const filteredColumns = [];
  if (isStudent) {
    for (let i = 0; i < columns.length; i++) {
      if (i == 2) continue;
      filteredColumns.push(columns[i]);
    }
  }

  return (
    <div>
      <Head>
        <title>Denemeler</title>
        <meta name="quizzes" content="Denemeler" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <Container>
        <SelectStudentModalForQuiz
          open={selectStudentModalOpenWithQuiz}
          onClose={() => setSelectStudentModalOpenWithQuiz(null)}
          quizId={selectStudentModalOpenWithQuiz}
          refreshAction={{
            type: $.GET_QUIZ_LIST_REQUEST,
            payload: {
              search,
              page,
              limit,
            },
          }}
        />
        <CustomTable
          columns={isStudent ? filteredColumns : columns}
          dataSource={quizList}
          totalDocuments={totalQuizzes}
          loading={quizListLoading || quizSavingInProgress}
          baseEndpoint={BASE_ENDPOINT.quiz}
        />
      </Container>
    </div>
  );
}

const Container = styled.div`
  width: 70vw;
  margin: 50px 0;
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
