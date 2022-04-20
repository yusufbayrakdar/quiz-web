import React, { useEffect, useState } from "react";
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
import BykCreateButton from "../../../components/Buttons/BykCreateButton";
import { displayFullName } from "../../../utils";

const { Option } = Select;

function Quizzes() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const query = router.query;
  const editMode = query?.id?.length >= 24;
  const [form] = Form.useForm();

  const search = query["search"];
  const page = query["page"] || 1;
  const limit = query["limit"] || 12;

  const instructor = useSelector((state) => state.auth.instructor);
  const questionList = useSelector((state) => state.question.questionList);
  const totalQuestions = useSelector((state) => state.question.totalQuestions);
  const activeQuiz = useSelector((state) => state.quiz.activeQuiz);
  const categories = useSelector((state) => state.question.categories);
  const durations = useSelector((state) => state.question.durations);
  const grades = useSelector((state) => state.question.grades);

  const [duration, setDuration] = useState();
  const [grade, setGrade] = useState();
  const [category, setCategory] = useState();
  const [owner, setOwner] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  useEffect(() => {
    if (editMode) dispatchAction($.GET_QUIZ_DETAIL_REQUEST, { _id: query?.id });
    else dispatchAction($.CREATE_QUIZ_FINISHED);
  }, [$, dispatchAction, editMode]);

  useEffect(() => {
    const ownerQuery = owner ? { creatorId: instructor._id } : {};
    const selectedQuery = selectedIds ? { ids: selectedIds } : {};
    dispatchAction($.GET_QUESTION_LIST_REQUEST, {
      search,
      page,
      limit,
      category: category?.category,
      duration: duration?.duration,
      grade: grade?.grade,
      ...ownerQuery,
      ...selectedQuery,
    });
  }, [
    $,
    dispatchAction,
    search,
    page,
    limit,
    owner,
    selectedIds,
    category,
    duration,
    grade,
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

  const onFinish = (values) => {
    const pickedDate = values.duration.toDate();
    const name = values.name;
    const [hours, minutes, seconds] = [
      pickedDate.getHours(),
      pickedDate.getMinutes(),
      pickedDate.getSeconds(),
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
      <Head>
        <title>Sorular</title>
        <meta name="quizzes" content="Sorular" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <Form form={form} onFinish={onFinish}>
        <div style={{ marginBottom: 15 }} className="end">
          <BykCreateButton onClick={() => form.submit()}>
            {editMode ? "Güncelle" : "Oluştur"}
          </BykCreateButton>
        </div>
        <Row>
          <Col flex="auto">
            <Form.Item name="name">
              <Input placeholder="Deneme Adı - İsteğe Bağlı" name="name" />
            </Form.Item>
          </Col>
          <Col span={4}>
            <Form.Item
              name={"duration"}
              rules={[{ required: true, message: "Lütfen süreyi seçiniz" }]}
            >
              <TimePicker
                style={{ width: "100%" }}
                placeholder="Süre"
                showNow={false}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="filter-section">
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
              {displayFullName(instructor)}
            </div>
          </Button>
        </Row>
        <Row
          gutter={[16, { xs: 8, sm: 16, md: 24, lg: 32 }]}
          className="questions"
        >
          {questionList?.map((question) => (
            <Col span={8}>
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

const CheckIconFilter = styled.div`
  clip-path: polygon(19% 39%, 11% 49%, 46% 80%, 85% 21%, 74% 15%, 44% 55%);
  background-color: ${({ theme, selectedIds }) =>
    selectedIds ? theme.colors.white : theme.colors.deepDarkGray};
  width: 24px;
  height: 24px;
  margin-right: 5px;
`;

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
  .filter-section {
    display: flex;
    justify-content: flex-end;
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

export default Quizzes;
