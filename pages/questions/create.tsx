import moment from "moment";
import { Button, Card, Col, Select, Input, Row, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";

import useRedux from "../../hooks/useRedux";
import { RootState } from "../../redux/configureStore";
import AiDnD from "../../components/AIDnD";
import Info from "../../components/Info";
import Question from "../../components/Question";
import { showWarningMessage } from "../../utils";

const { Option } = Select;

function QuestionCreate() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const query = router.query;

  const shapes = useSelector((state: RootState) => state.question.shapes);
  const grades = useSelector((state: RootState) => state.question.grades);
  const durations = useSelector((state: RootState) => state.question.durations);
  const resetForm = useSelector((state: RootState) => state.question.resetForm);
  const questionSavingInProgress = useSelector(
    (state: RootState) => state.question.questionSavingInProgress
  );
  const categories = useSelector(
    (state: RootState) => state.question.categories
  );

  const displayDuration = (duration: string) =>
    moment.utc(Number(duration) * 1000).format("mm:ss");

  const [question, setQuestion]: [question: any, setQuestion: Function] =
    useState({});
  const [choices, setChoices]: [choices: any, setChoices: Function] = useState(
    {}
  );
  const [duration, setDuration] = useState("");
  const [grade, setGrade] = useState("");
  const [category, setCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [questionWithChoices, setQuestionWithChoices]: [_: any, _: any] =
    useState({});

  const resetOptions = () => {
    if (durations) {
      setDuration(durations[0]?._id);
    }
    if (grades) {
      setGrade(grades[0]?._id);
    }
    if (categories) {
      setCategory(categories[0]?._id);
    }
  };

  useEffect(() => {
    resetOptions();
  }, [durations, grades, categories]);

  const [form] = Form.useForm();

  const search = query["search"];
  const page = query["page"];
  const limit = query["limit"] || Number.MAX_SAFE_INTEGER; // TODO: set limit according to screen size to paginate

  useEffect(() => {
    dispatchAction($.GET_SHAPES, { search, page, limit });
    dispatchAction($.GET_QUESTION_CONFIGS_REQUEST);
  }, [$, dispatchAction, search, page, limit]);

  useEffect(() => {
    if (resetForm) {
      setQuestion({});
      setChoices({});
      resetOptions();
    }
  }, [resetForm]);

  function InfoCard({ children, title, style = {} }: any) {
    return (
      <Info title={title} style={style}>
        <Card className="h-8 center rounded-xl">{children}</Card>
      </Info>
    );
  }

  const renderSelects = (
    OPTIONS: Array<any>,
    key: string,
    render?: Function
  ) => {
    const options = [];
    for (const option of OPTIONS) {
      options.push(
        <Option value={option._id} className="pl-2 pr-2" key={option._id}>
          {render ? render(option[key]) : option[key]}
        </Option>
      );
    }
    return options;
  };

  const getVideoId = (url: string) => {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  };

  const renderVideo = () => {
    const videoId = getVideoId(videoUrl);
    if (!videoId) return null;
    return (
      <iframe
        width="560"
        height="315"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      />
    );
  };

  function prepareList(map: any) {
    const preparedList = [];
    for (const key in map) {
      preparedList.push({ shape: map[key], coordinate: key });
    }
    return preparedList;
  }

  const onFinish = (values: any) => {
    if (questionWithChoices?.question?.length === 0)
      return showWarningMessage("Soru için yeterli şekil yüklenmeli");

    if (questionWithChoices?.choices?.length < 2)
      return showWarningMessage("En az iki seçenek belirlenmelidir");

    if (!correctAnswer.includes(","))
      return showWarningMessage("Lütfen doğru cevabı seçiniz");

    const questionData = {
      ...values,
      duration,
      grade,
      category,
      question: prepareList(questionWithChoices.question),
      choices: prepareList(questionWithChoices.choices),
      correctAnswer,
    };

    dispatchAction($.CREATE_QUESTION_REQUEST, questionData);
  };

  return (
    <div className="m-auto w-10/12">
      <Head>
        <title>Soru Oluştur</title>
        <meta name="description" content="Soru Oluştur" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <Form
        initialValues={{ remember: true }}
        autoComplete="off"
        layout="vertical"
        form={form}
        className="mb-10"
        onFinish={onFinish}
      >
        <div className="flex justify-end mt-7">
          <Button
            style={{ marginRight: 36, width: 154 }}
            className="rounded-xl bg-blue-900 border-blue-900"
            onClick={() => form.submit()}
            type="primary"
            loading={questionSavingInProgress}
          >
            Oluştur
          </Button>
        </div>
        <Row className="mt-5">
          <Col span={19}>
            <Question
              question={question}
              setQuestion={setQuestion}
              choices={choices}
              setChoices={setChoices}
              getData={(data: any) => setQuestionWithChoices(data)}
              correctAnswer={correctAnswer}
              setCorrectAnswer={setCorrectAnswer}
            />
            <Card className="rounded-xl mt-4">
              <Input onChange={(e) => setSearchInput(e.target.value)} />
              <Row
                className="overflow-scroll hide-scrollbar"
                style={{ height: 150 }}
              >
                {(searchInput
                  ? shapes.filter((e: any) => e.searchTag.includes(searchInput))
                  : shapes
                ).map((shape: any, i: number) => (
                  <AiDnD itemInfo={shape} key={i}>
                    <div className="p-4 center">
                      <img
                        src={shape.imageUrl}
                        className="w-8 h-8 object-contain pointer-events-none"
                      />
                    </div>
                  </AiDnD>
                ))}
              </Row>
            </Card>
            <Info title="Açıklama" width="50%" largePadding={true}>
              <Card className="rounded-xl">
                {renderVideo()}
                <Form.Item label="Video" name="video">
                  <Input
                    placeholder="https..."
                    onChange={(e) => setVideoUrl(e.target.value)}
                  />
                </Form.Item>
                <Form.Item label="Açıklama metni" name="description">
                  <Input.TextArea rows={4} />
                </Form.Item>
              </Card>
            </Info>
          </Col>
          <Col offset={1}>
            <InfoCard title={"Süre"}>
              <Select value={duration} onChange={setDuration} bordered={false}>
                {renderSelects(durations, "duration", displayDuration)}
              </Select>
            </InfoCard>
            <InfoCard style={{ marginTop: 30 }} title={"Sınıf"}>
              <Select value={grade} onChange={setGrade} bordered={false}>
                {renderSelects(grades, "grade")}
              </Select>
            </InfoCard>
            <InfoCard style={{ marginTop: 30 }} title={"Kategori"}>
              <Select value={category} onChange={setCategory} bordered={false}>
                {renderSelects(categories, "category")}
              </Select>
            </InfoCard>
          </Col>
        </Row>
      </Form>
    </div>
  );
}

export default QuestionCreate;
