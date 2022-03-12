import moment from "moment";
import { Button, Card, Col, Select, Input, Row, Form, Tooltip } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";
import styled from "styled-components";

import useRedux from "../../../hooks/useRedux";
import AiDnD from "../../../components/AIDnD";
import Info from "../../../components/Info";
import Question from "../../../components/Question";
import { showWarningMessage } from "../../../utils";

const { Option } = Select;

function QuestionCreate() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const { id } = router.query;
  const editMode = id && id.length >= 24;

  const scrollRef = useRef(null);
  const shapes = useSelector((state) => state.question.shapes);
  const shapesLoading = useSelector((state) => state.question.shapesLoading);
  const nextPageShapes = useSelector((state) => state.question.nextPageShapes);
  const hasNextPageShapes = useSelector(
    (state) => state.question.hasNextPageShapes
  );
  const activeQuestion = useSelector((state) => state.question.activeQuestion);
  const grades = useSelector((state) => state.question.grades);
  const durations = useSelector((state) => state.question.durations);
  const categories = useSelector((state) => state.question.categories);
  const resetForm = useSelector((state) => state.question.resetForm);
  const questionSavingInProgress = useSelector(
    (state) => state.question.questionSavingInProgress
  );
  const instructor = useSelector((state) => state.auth.instructor);

  const displayDuration = (duration) =>
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
    // @ts-ignore
    if (scrollRef?.current?.scrollTop) scrollRef.current.scrollTop = 0;
    dispatchAction($.GET_SHAPES, { search: searchInput, action: $.SET_SHAPES });
  }, [searchInput]);

  useEffect(() => {
    if (editMode && !questionSavingInProgress)
      dispatchAction($.GET_QUESTION_DETAIL_REQUEST, id);
    else dispatchAction($.CREATE_QUESTION_FINISHED);
  }, [editMode, questionSavingInProgress]);

  useEffect(() => {
    if (activeQuestion) {
      const selectedCategory = categories?.find(
        (c) => c.category === activeQuestion.category
      );

      if (selectedCategory) setCategory(selectedCategory?._id);

      const selectedDuration = durations?.find(
        (d) => d.duration === activeQuestion.duration
      );

      if (selectedDuration) setDuration(selectedDuration?._id);

      const selectedGrade = grades?.find(
        (g) => g.grade === activeQuestion.grade
      );

      if (selectedGrade) setGrade(selectedGrade?._id);

      form.setFieldsValue({
        videoUrl: activeQuestion?.videoUrl,
        description: activeQuestion?.description,
      });
      setVideoUrl(activeQuestion?.videoUrl ?? "");
    }
  }, [
    activeQuestion?.category,
    activeQuestion?.duration,
    activeQuestion?.grade,
    activeQuestion?.videoUrl,
    activeQuestion?.description,
  ]);

  useEffect(() => {
    resetOptions();
  }, [durations, grades, categories]);

  const [form] = Form.useForm();

  useEffect(() => {
    if (!shapes.length) {
      dispatchAction($.GET_SHAPES, { action: $.SET_SHAPES });
      dispatchAction($.GET_QUESTION_CONFIGS_REQUEST);
    }
  }, [$, dispatchAction]);

  useEffect(() => {
    if (resetForm) {
      resetOptions();
      dispatchAction($.QUESTION_FORM_RESET);
    }
  }, [resetForm]);

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

  const getVideoId = (url) => {
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

  const onFinish = (values) => {
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

    if (activeQuestion.question?.length === 0) {
      return showWarningMessage("Soru için yeterli şekil yüklenmeli");
    }

    if (activeQuestion.choices?.length < 2) {
      return showWarningMessage("En az iki seçenek belirlenmelidir");
    }

    if (!activeQuestion.correctAnswer.includes(",")) {
      return showWarningMessage("Lütfen doğru cevabı seçiniz");
    }

    dispatchAction(
      editMode ? $.UPDATE_QUESTION_REQUEST : $.CREATE_QUESTION_REQUEST,
      {
        ...activeQuestion,
        ...values,
        duration,
        grade,
        category,
      }
    );
  };

  let scrollPrevPercent = 0;
  const onScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    const percent = (scrollTop / (scrollHeight - clientHeight)) * 100;

    if (
      scrollPrevPercent < percent &&
      percent > 59 &&
      !shapesLoading &&
      hasNextPageShapes
    ) {
      dispatchAction($.GET_SHAPES, {
        page: nextPageShapes,
        search: searchInput,
        action: $.ADD_SHAPES,
      });
    }
    scrollPrevPercent = percent;
  };

  const configSelectStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: 32,
  };

  return (
    <Styled>
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
          className="form"
          onFinish={onFinish}
        >
          <div className="end">
            <Button
              className="submit-button center gBold"
              onClick={() => form.submit()}
              type="primary"
              loading={questionSavingInProgress}
            >
              {editMode ? "Kaydet" : "Oluştur"}
            </Button>
          </div>
          <Row>
            <Col span={19}>
              <Question editMode={editMode} />
              <Card className="shapes-container">
                <Input onChange={(e) => setSearchInput(e.target.value)} />
                <Row
                  className="shapes hide-scrollbar"
                  onScroll={onScroll}
                  ref={scrollRef}
                >
                  {shapes.map((shape, i) => (
                    <Col
                      span={2}
                      key={`shape-${i}`}
                      onDragStart={() => {
                        dispatchAction($.SET_DRAG_ITEM, shapes[i]);
                      }}
                    >
                      <AiDnD itemInfo={shape} key={i}>
                        <div className="image-container center">
                          <img src={shape.imageUrl} />
                        </div>
                      </AiDnD>
                    </Col>
                  ))}
                </Row>
              </Card>
              <div style={{ paddingBottom: 40 }}>
                <Info
                  title="Açıklama"
                  titleWidthPercent={50}
                  largePadding={true}
                >
                  {renderVideo()}
                  <Form.Item label="Video" name="videoUrl" className="mt-4">
                    <Input
                      placeholder="https..."
                      onChange={(e) => setVideoUrl(e.target.value)}
                    />
                  </Form.Item>
                  <Form.Item label="Açıklama metni" name="description">
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </Info>
              </div>
            </Col>
            <Col offset={1} flex="auto">
              {durations && (
                <Info
                  title={"Süre"}
                  titleWidthPercent={90}
                  style={configSelectStyle}
                >
                  <Select
                    value={duration}
                    onChange={setDuration}
                    bordered={false}
                  >
                    {renderSelects(durations, "duration", displayDuration)}
                  </Select>
                </Info>
              )}
              {grades && (
                <Info
                  title={"Sınıf"}
                  titleWidthPercent={90}
                  style={configSelectStyle}
                >
                  <Select value={grade} onChange={setGrade} bordered={false}>
                    {renderSelects(grades, "grade")}
                  </Select>
                </Info>
              )}
              {categories && (
                <Info
                  title={"Kategori"}
                  titleWidthPercent={90}
                  style={configSelectStyle}
                >
                  <Select
                    value={category}
                    onChange={setCategory}
                    bordered={false}
                  >
                    {renderSelects(categories, "category")}
                  </Select>
                </Info>
              )}
            </Col>
          </Row>
        </Form>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  width: 83%;
  .form {
    margin: 40px 0;
  }
  .option {
    padding: 0 8px;
  }
  .submit-button {
    margin-right: 36px;
    margin-bottom: 20px;
    border-radius: 12px;
    padding: 1.2vw 2vw;
    font-size: 1vw;
    border-color: ${({ theme }) => theme.colors.darkPrimary};
    background-color: ${({ theme }) => theme.colors.darkPrimary};
  }
  .shapes-container {
    margin: 16px 0;
    border-radius: 12px;
    height: 30%;
    position: relative;
  }
  .shapes {
    position: absolute;
    top: 75px;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: scroll;
  }
  .image-container {
    padding: 8px;
    img {
      object-fit: contain;
      pointer-events: none;
      width: 2.5vw;
      height: 2.5vw;
    }
  }
`;

export default QuestionCreate;
