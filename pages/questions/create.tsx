import { Button, Card, Col, Divider, Form, Input, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Head from "next/head";
import { useRouter } from "next/router";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

import useRedux from "../../hooks/useRedux";
import { RootState } from "../../redux/configureStore";
import AiDnD from "../../components/AIDnD";
import Nest from "./nest";

function QuestionCreate() {
  const { dispatchAction, $ } = useRedux();
  const router = useRouter();
  const query = router.query;

  const shapes = useSelector((state: RootState) => state.shape.shapes);
  const resetForm = useSelector((state: RootState) => state.student.resetForm);

  const search = query["search"];
  const page = query["page"];
  const limit = query["limit"] || Number.MAX_SAFE_INTEGER;

  useEffect(() => {
    dispatchAction($.GET_SHAPES, { search, page, limit });
  }, [$, dispatchAction, search, page, limit]);

  const renderRowNests = () => {
    const nests = [];
    for (let i = 0; i < 8; i++) {
      nests.push(<Nest />);
    }
    return nests;
  };

  const renderNests = () => {
    const rows = [];
    for (let i = 0; i < 4; i++) {
      rows.push(
        <Row className="flex justify-around items-center">
          {renderRowNests()}
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

  return (
    <div className="m-auto w-10/12">
      <Head>
        <title>Soru Oluştur</title>
        <meta name="description" content="Soru Oluştur" />
        <link rel="icon" href="/ideas.png" />
      </Head>
      <DndProvider backend={HTML5Backend}>
        <Row>
          <Col span={20}>
            <Info title="Soru" width="50%" largePadding={true}>
              <Card className="rounded-xl">{renderNests()}</Card>
            </Info>
            <Info title="Seçenekler" width="50%" largePadding={true}>
              <Card className="rounded-xl">
                {
                  <Row className="flex justify-around items-center">
                    {renderRowNests()}
                  </Row>
                }
              </Card>
            </Info>
            <Card className="rounded-xl mt-4">
              <Input />
              <Row className="overflow-scroll center" style={{ height: 150 }}>
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
            <InfoCard title={"Süre"}>01:00</InfoCard>
            <InfoCard style={{ marginTop: 30 }} title={"Sınıf"}>
              1. Sınıf
            </InfoCard>
            <InfoCard style={{ marginTop: 30 }} title={"Kategori"}>
              Matrix
            </InfoCard>
          </Col>
        </Row>
      </DndProvider>
    </div>
  );
}

export default QuestionCreate;
