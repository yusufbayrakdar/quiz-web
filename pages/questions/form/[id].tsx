import moment from "moment";
import { Button, Card, Col, Select, Input, Row, Form } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Head from "next/head";

import useRedux from "../../../hooks/useRedux";
import AiDnD from "../../../components/AIDnD";
import Info from "../../../components/Info";
import Question from "../../../components/Question";
import { useRouter } from "next/router";
import { showWarningMessage } from "../../../utils";

const { Option } = Select;

function QuestionCreate() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const { id } = router.query;
  const editMode = id && id.length >= 24;

  const shapes = useSelector((state: any) => state.question.shapes);
  const shapesLoading = useSelector(
    (state: any) => state.question.shapesLoading
  );
  const nextPageShapes = useSelector(
    (state: any) => state.question.nextPageShapes
  );
  const hasNextPageShapes = useSelector(
    (state: any) => state.question.hasNextPageShapes
  );
  const activeQuestion = useSelector(
    (state: any) => state.question.activeQuestion
  );
  const grades = useSelector((state: any) => state.question.grades);
  const durations = useSelector((state: any) => state.question.durations);
  const categories = useSelector((state: any) => state.question.categories);
  const resetForm = useSelector((state: any) => state.question.resetForm);
  const questionSavingInProgress = useSelector(
    (state: any) => state.question.questionSavingInProgress
  );
  const instructor = useSelector((state: any) => state.auth.instructor);

  const displayDuration = (duration: string) =>
    moment.utc(Number(duration) * 1000).format("mm:ss");

  const [duration, setDuration] = useState("");
  const [grade, setGrade] = useState("");
  const [category, setCategory] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [videoUrl, setVideoUrl] = useState("");

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
    if (editMode && !questionSavingInProgress)
      dispatchAction($.GET_QUESTION_DETAIL_REQUEST, id);
    else dispatchAction($.CREATE_QUESTION_FINISHED);
  }, [editMode, questionSavingInProgress]);

  useEffect(() => {
    if (activeQuestion) {
      const selectedCategory = categories?.find(
        (c: any) => c.category === activeQuestion.category
      );

      if (selectedCategory) setCategory(selectedCategory?._id);

      const selectedDuration = durations?.find(
        (d: any) => d.duration === activeQuestion.duration
      );

      if (selectedDuration) setDuration(selectedDuration?._id);

      const selectedGrade = grades?.find(
        (g: any) => g.grade === activeQuestion.grade
      );

      if (selectedGrade) setGrade(selectedGrade?._id);
    }
  }, [activeQuestion]);

  useEffect(() => {
    resetOptions();
  }, [durations, grades, categories]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (!shapes.length) {
      dispatchAction($.GET_SHAPES);
      dispatchAction($.GET_QUESTION_CONFIGS_REQUEST);
    }
  }, [$, dispatchAction]);

  useEffect(() => {
    if (resetForm) {
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

  const onFinish = (values: any) => {
    const preparedActiveQuestion = {
      ...activeQuestion,
      question: activeQuestion.question.map((e: any) => {
        const shape = shapes?.find((s: any) => s.imageUrl === e.shape);
        return { ...e, shape: shape?._id };
      }),
      choices: activeQuestion.choices.map((e: any) => {
        const shape = shapes?.find((s: any) => s.imageUrl === e.shape);
        return { ...e, shape: shape?._id };
      }),
    };

    if (!category) {
      return showWarningMessage(
        "Yöneticiden kategori seçeneği eklemesini isteyin"
      );
    }
    if (!grade) {
      return showWarningMessage(
        "Yöneticiden sınıf seçeneği eklemesini isteyin"
      );
    }
    if (!duration) {
      return showWarningMessage("Yöneticiden süre seçeneği eklemesini isteyin");
    }

    if (preparedActiveQuestion.question?.length === 0) {
      return showWarningMessage("Soru için yeterli şekil yüklenmeli");
    }

    if (preparedActiveQuestion.choices?.length < 2) {
      return showWarningMessage("En az iki seçenek belirlenmelidir");
    }

    if (!activeQuestion.correctAnswer.includes(",")) {
      return showWarningMessage("Lütfen doğru cevabı seçiniz");
    }

    dispatchAction(
      editMode ? $.UPDATE_QUESTION_REQUEST : $.CREATE_QUESTION_REQUEST,
      {
        ...preparedActiveQuestion,
        ...values,
        duration,
        grade,
        category,
      }
    );
  };

  let scrollPrevPercent = 0;
  const onScroll = (e: any) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const percent = (scrollTop / (scrollHeight - clientHeight)) * 100;

    if (
      scrollPrevPercent < percent &&
      percent > 59 &&
      !shapesLoading &&
      hasNextPageShapes
    ) {
      dispatchAction($.GET_SHAPES, { page: nextPageShapes });
    }
    scrollPrevPercent = percent;
  };

  return (
    <div className="m-auto w-10/12 h-full">
      <Head>
        <title>Soru Oluştur</title>
        <meta name="description" content="Soru Oluştur" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      {instructor && (
        <Form
          autoComplete="off"
          layout="vertical"
          form={form}
          className="mb-10 h-full"
          onFinish={onFinish}
        >
          <div className="flex justify-end mt-7" style={{ height: "5%" }}>
            <Button
              style={{
                marginRight: 36,
                width: "10%",
                height: "100%",
              }}
              className="rounded-xl bg-blue-900 border-blue-900"
              onClick={() => form.submit()}
              type="primary"
              loading={questionSavingInProgress}
            >
              {editMode ? "Kaydet" : "Oluştur"}
            </Button>
          </div>
          <Row className="mt-5 h-full">
            <Col span={19}>
              <Question editMode={editMode} />
              <Card className="rounded-xl mt-4" style={{ height: "25%" }}>
                <Input onChange={(e) => setSearchInput(e.target.value)} />
                <Row
                  className="overflow-scroll hide-scrollbar absolute bottom-0 left-0 right-0"
                  style={{ top: 75 }}
                  onScroll={onScroll}
                >
                  {(searchInput
                    ? shapes.filter((e: any) =>
                        e.searchTag.includes(String(searchInput).toLowerCase())
                      )
                    : shapes
                  ).map((shape: any, i: number) => (
                    <Col span={2} key={`shape-${i}`}>
                      <AiDnD itemInfo={shape} key={i}>
                        <div className="p-4 center">
                          <img
                            src={shape.imageUrl}
                            className="object-contain pointer-events-none w-8"
                            style={{
                              width: window.screen.width / 45,
                              height: window.screen.width / 45,
                            }}
                          />
                        </div>
                      </AiDnD>
                    </Col>
                  ))}
                </Row>
              </Card>
              <div className="pb-10">
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
              </div>
            </Col>
            <Col offset={1}>
              {durations && (
                <InfoCard title={"Süre"}>
                  <Select
                    value={duration}
                    onChange={setDuration}
                    bordered={false}
                  >
                    {renderSelects(durations, "duration", displayDuration)}
                  </Select>
                </InfoCard>
              )}
              {grades && (
                <InfoCard style={{ marginTop: 30 }} title={"Sınıf"}>
                  <Select value={grade} onChange={setGrade} bordered={false}>
                    {renderSelects(grades, "grade")}
                  </Select>
                </InfoCard>
              )}
              {categories && (
                <InfoCard style={{ marginTop: 30 }} title={"Kategori"}>
                  <Select
                    value={category}
                    onChange={setCategory}
                    bordered={false}
                  >
                    {renderSelects(categories, "category")}
                  </Select>
                </InfoCard>
              )}
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
}

export default QuestionCreate;
