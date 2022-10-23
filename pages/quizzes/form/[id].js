import { useEffect, useState } from "react";
import Head from "next/head";
import { useSelector } from "react-redux";
import {
  Button,
  Col,
  Form,
  Input,
  Pagination,
  Row,
  Select,
  TimePicker,
  Tooltip,
} from "antd";
import moment from "moment";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import styled from "styled-components";

import useRedux from "../../../hooks/useRedux";
import { BASE_ENDPOINT, displayDuration } from "../../../utils";
import QuestionCard from "../../../components/QuestionCard";
import CreateButton from "../../../components/Buttons/CreateButton";
import SelectStudentModalForQuiz from "../../../components/Modals/SelectStudentModalForQuiz";

const { Option } = Select;

function QuizForm() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const query = router.query;
  const editMode = query?.id?.length >= 24;
  const [form] = Form.useForm();

  const search = query["search"];
  const page = query["page"] || 1;
  const limit = query["limit"] || 12;

  const user = useSelector((state) => state.auth.user);
  const questionList = useSelector((state) => state.question.questionList);
  const totalQuestions = useSelector((state) => state.question.totalQuestions);
  const activeQuiz = useSelector((state) => state.quiz.activeQuiz);
  const quizSavingInProgress = useSelector(
    (state) => state.quiz.quizSavingInProgress
  );
  const activeQuizStudents = useSelector(
    (state) => state.quiz.activeQuizStudents
  );
  const categories = useSelector((state) => state.question.categories);
  const durations = useSelector((state) => state.question.durations);
  const grades = useSelector((state) => state.question.grades);

  const [duration, setDuration] = useState();
  const [grade, setGrade] = useState();
  const [category, setCategory] = useState();
  const [owner, setOwner] = useState(false);
  const [
    selectStudentModalForQSelectStudentModalForQuizOpen,
    setSelectStudentModalForQuizOpen,
  ] = useState(false);

  useEffect(() => {
    if (editMode) dispatchAction($.GET_QUIZ_DETAIL_REQUEST, { _id: query?.id });
    else dispatchAction($.CREATE_QUIZ_FINISHED);
  }, [$, dispatchAction, editMode, query?.id]);

  useEffect(() => {
    const ownerQuery = owner ? { creatorId: user._id } : {};
    dispatchAction($.GET_QUESTION_LIST_REQUEST, {
      search,
      page,
      limit,
      category: category?.category,
      duration: duration?.duration,
      grade: grade?.grade,
      ...ownerQuery,
    });
  }, [
    $,
    dispatchAction,
    search,
    page,
    limit,
    owner,
    category,
    duration,
    grade,
    user?._id,
  ]);

  useEffect(() => {
    dispatchAction($.GET_QUESTION_CONFIGS_REQUEST);
  }, [$, dispatchAction]);

  useEffect(() => {
    if (form && activeQuiz)
      form.setFieldsValue({
        name: activeQuiz?.name,
        duration: activeQuiz.duration
          ? moment().startOf("day").add("seconds", activeQuiz.duration)
          : null,
      });
  }, [form, activeQuiz]);

  const pageTitle = editMode ? "Deneme Düzenle" : "Deneme Oluştur";
  const Header = () => (
    <Head>
      <title>{pageTitle} | BilsemAI</title>
      <meta name="quizzes" content={pageTitle} />
      <link rel="icon" href="/ideas.png" />
    </Head>
  );

  if (!user?.confirmed) {
    return (
      <div className="center">
        <Header />
        Yönetici onayı bekleniyor
      </div>
    );
  }

  const onFinish = (values) => {
    const pickedDate = values.duration?.toDate();
    const name = values.name;
    const [hours, minutes, seconds] = [
      pickedDate?.getHours(),
      pickedDate?.getMinutes(),
      pickedDate?.getSeconds(),
    ];
    const duration = hours * 3600 + minutes * 60 + seconds;
    dispatchAction(editMode ? $.UPDATE_QUIZ_REQUEST : $.CREATE_QUIZ_REQUEST, {
      ...(editMode ? { _id: query.id } : {}),
      name,
      duration,
      questionList: Array.from(activeQuiz.questionSet),
      reset: () => {
        form.resetFields();
        router.push(BASE_ENDPOINT.quiz + `/form/create?page=${1}&limit=${12}`);
      },
    });
  };

  const renderSelects = (OPTIONS, key, render) => {
    const options = [];
    for (const option of OPTIONS) {
      const selectName = render ? render(option[key]) : option[key];
      options.push(
        <Option value={option._id} className="option" key={option._id}>
          {selectName.length > 10 ? (
            <Tooltip title={selectName} placement="left">
              {selectName.substring(0, 10) + "..."}
            </Tooltip>
          ) : (
            selectName
          )}
        </Option>
      );
    }
    return options;
  };

  return (
    <Styled>
      <Header />
      <Form form={form} onFinish={onFinish}>
        <SelectStudentModalForQuiz
          open={selectStudentModalForQSelectStudentModalForQuizOpen}
          onClose={() => setSelectStudentModalForQuizOpen(false)}
          quizId={activeQuiz?._id}
          refreshAction={{
            type: $.GET_STUDENTS_OF_QUIZ_BY_INSTRUCTOR_REQUEST,
            payload: activeQuiz?._id,
          }}
        />
        <div style={{ marginBottom: 15 }} className="end">
          {editMode && (
            <Button
              type="primary"
              style={{ marginRight: 5 }}
              onClick={() => setSelectStudentModalForQuizOpen(true)}
              disabled={quizSavingInProgress}
            >
              Öğrenciler (
              {activeQuizStudents?.filter((s) => s.assigned)?.length || 0})
            </Button>
          )}
          <CreateButton
            onClick={() => form.submit()}
            disabled={quizSavingInProgress}
          >
            {editMode ? "Güncelle" : "Oluştur"}
          </CreateButton>
        </div>
        <Row>
          <Col flex="auto">
            <Form.Item name="name">
              <Input placeholder="Deneme Adı - İsteğe Bağlı" name="name" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item name={"duration"}>
              <TimePicker
                style={{ width: "100%" }}
                placeholder="Süre"
                showNow={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="end">
          <Select
            value={category?.category || "Kategori"}
            onChange={(e) => {
              setCategory(categories.find((c) => c._id === e));
            }}
            allowClear={true}
          >
            {renderSelects(categories, "category")}
          </Select>
          <Select
            value={grade?.grade || "Sınıf"}
            onChange={(e) => {
              setGrade(grades.find((g) => g._id === e));
            }}
            allowClear={true}
          >
            {renderSelects(grades, "grade")}
          </Select>
          <Select
            value={displayDuration(duration?.duration) || "Süre"}
            onChange={(e) => {
              setDuration(durations.find((d) => d._id === e));
            }}
            allowClear={true}
          >
            {renderSelects(durations, "duration", displayDuration)}
          </Select>
          <Button
            className="filter-button-context"
            type={owner ? "primary" : "default"}
            onClick={() => setOwner(!owner)}
          >
            <FontAwesomeIcon
              icon={faUser}
              width={18}
              style={{ marginRight: 10 }}
              className={`${!owner && "filter-button-text-unchecked"}`}
            />
            <div className={`${!owner && "filter-button-text-unchecked"} gMed`}>
              {user?.fullName}
            </div>
          </Button>
        </Row>
        <Row
          gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
          className="questions"
        >
          {questionList?.map((question) => (
            <Col span={8} key={question?._id}>
              <QuestionCard question={question} />
            </Col>
          ))}
        </Row>
        <div className="center pagination">
          <Pagination
            size="small"
            total={totalQuestions}
            pageSize={limit}
            showSizeChanger
            showQuickJumper
            onChange={(page) =>
              router.push(
                BASE_ENDPOINT.quiz +
                  `/form/${
                    editMode ? activeQuiz?._id : "create"
                  }?page=${page}&limit=${limit}`
              )
            }
          />
        </div>
      </Form>
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
  .questions {
    padding-top: 20px;
    padding-bottom: 20px;
  }
  .pagination {
    padding-bottom: 50px;
  }
  .filter-button-context {
    display: flex;
    align-items: center;
  }
  .selected-count {
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.colors.deepDarkGray};
  }
  .filter-button-text {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: row;
  }
  .filter-button-text-unchecked {
    color: ${({ theme }) => theme.colors.deepDarkGray};
  }
`;

export default QuizForm;
