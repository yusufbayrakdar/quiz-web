import { Button, Card, Col, Select, Input, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";

import useRedux from "../../hooks/useRedux";
import { RootState } from "../../redux/configureStore";
import AiDnD from "../../components/AIDnD";
import Nest from "./nest";
import { CATEGORIES, DURATIONS, GRADES } from "../../utils";

const { Option } = Select;

function QuestionCreate() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const query = router.query;

  const [question, setQuestion] = useState({});
  const [answer, setAnswer] = useState({});
  const [duration, setDuration] = useState(DURATIONS[30]);
  const [grade, setGrade] = useState(GRADES[1]);
  const [category, setCategory] = useState(CATEGORIES[0]);

  const shapes = useSelector((state: RootState) => state.shape.shapes);
  const resetForm = useSelector((state: RootState) => state.student.resetForm);

  const search = query["search"];
  const page = query["page"];
  const limit = query["limit"] || Number.MAX_SAFE_INTEGER;

  useEffect(() => {
    dispatchAction($.GET_SHAPES, { search, page, limit });
  }, [$, dispatchAction, search, page, limit]);

  const renderRowNests = (y: Number, isQuestion = true) => {
    const nests = [];
    for (let i = 0; i < 8; i++) {
      nests.push(
        <Nest
          map={isQuestion ? question : answer}
          setMap={isQuestion ? setQuestion : setAnswer}
          x={i}
          y={y}
        />
      );
    }
    return nests;
  };

  const renderNests = () => {
    const rows = [];
    for (let i = 0; i < 4; i++) {
      rows.push(
        <Row className="flex justify-around items-center">
          {renderRowNests(i)}
        </Row>
      );
    }
    return rows;
  };

  function Info({ children, title, width, largePadding }: any) {
    const widthStyle = width ? { width } : {};
    const paddingConstant = largePadding ? 8 : 4;
    return (
      <div className="relative" style={{ marginTop: largePadding ? 44 : 36 }}>
        <div
          className={`absolute text-white pl-${paddingConstant} pr-${paddingConstant} pb-${paddingConstant} pt-${
            paddingConstant / 4
          } gBold rounded-xl`}
          style={{
            top: largePadding ? -30 : -22,
            left: -16,
            backgroundColor: "#161E68",
            width: "90%",
            ...widthStyle,
          }}
        >
          {title}
        </div>
        {children}
      </div>
    );
  }

  function InfoCard({ children, title, style = {} }: any) {
    return (
      <Info title={title} style={style}>
        <Card className="h-8 center rounded-xl">{children}</Card>
      </Info>
    );
  }

  const renderSelects = (OPTIONS: object) => {
    const options = [];
    const keys = Object.keys(OPTIONS);
    const values = Object.values(OPTIONS);
    for (let i = 0; i < keys.length; i++) {
      options.push(<Option value={keys[i]}>{values[i]}</Option>);
    }
    return options;
  };

  return (
    <div className="m-auto w-10/12">
      <Head>
        <title>Soru Oluştur</title>
        <meta name="description" content="Soru Oluştur" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <div className="flex justify-end mt-7">
        <Button
          style={{ marginRight: 36, width: 154 }}
          className="rounded-xl bg-blue-900"
          onClick={() => console.log(question, answer)}
          type="primary"
        >
          Oluştur
        </Button>
      </div>
      <Row className="mt-5">
        <Col span={19}>
          <Info title="Soru" width="50%" largePadding={true}>
            <Card className="rounded-xl">{renderNests()}</Card>
          </Info>
          <Info title="Seçenekler" width="50%" largePadding={true}>
            <Card className="rounded-xl">
              {
                <Row className="flex justify-around items-center">
                  {renderRowNests(0, false)}
                </Row>
              }
            </Card>
          </Info>
          <Card className="rounded-xl mt-4 center">
            <Input />
            <Row className="overflow-scroll" style={{ height: 150 }}>
              {shapes.map((shape: any) => (
                <AiDnD itemInfo={shape}>
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
        </Col>
        <Col offset={1}>
          <InfoCard title={"Süre"}>
            <Select value={duration} onChange={setDuration} bordered={false}>
              {renderSelects(DURATIONS)}
            </Select>
          </InfoCard>
          <InfoCard style={{ marginTop: 30 }} title={"Sınıf"}>
            <Select value={grade} onChange={setGrade} bordered={false}>
              {renderSelects(GRADES)}
            </Select>
          </InfoCard>
          <InfoCard style={{ marginTop: 30 }} title={"Kategori"}>
            <Select value={category} onChange={setCategory} bordered={false}>
              {CATEGORIES.map((c) => (
                <Option value={c}>{c}</Option>
              ))}
            </Select>
          </InfoCard>
        </Col>
      </Row>
    </div>
  );
}

export default QuestionCreate;
