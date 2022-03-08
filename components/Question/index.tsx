import { Card, Row } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import useRedux from "../../hooks/useRedux";
import Info from "../Info";
import Nest from "../Nest";

function Question({ showMode, questionListItem, editMode }: any) {
  const { dispatchAction, $ } = useRedux();
  const prepareMap = (list: Array<object>) => {
    if (!list) return {};
    return list?.reduce((store: any, current: any) => {
      store[current.coordinate] = current.shape;
      return store;
    }, {});
  };

  const activeQuestion =
    questionListItem ||
    useSelector((state: any) => state.question.activeQuestion);
  const correctAnswer = activeQuestion?.correctAnswer;
  const setCorrectAnswer = (value: string) => {
    dispatchAction($.SET_CORRECT_ANSWER, value);
  };
  const preparedQuestion = prepareMap(activeQuestion?.question);
  const preparedChoices = prepareMap(activeQuestion?.choices);
  const [showModeConstraints, setShowModeConstraints]: [_: any, _: any] =
    useState({});

  useEffect(() => {
    const constraints = {
      minX: 8,
      maxX: 0,
      minY: 8,
      maxY: 0,
    };
    for (const key in preparedQuestion) {
      const [x, y] = key.split(",");

      constraints.minX = Math.min(constraints.minX, Number(x));
      constraints.maxX = Math.max(constraints.maxX, Number(x));

      constraints.minY = Math.min(constraints.minY, Number(y));
      constraints.maxY = Math.max(constraints.maxY, Number(y));
    }
    setShowModeConstraints(constraints);
  }, [activeQuestion]);

  const isInRange = (x: number, y: number) => {
    const { minX, maxX, minY, maxY } = showModeConstraints;
    return minX <= x && maxX >= x && minY <= y && maxY >= y;
  };

  const renderRowNests = (y: number, isQuestion = true) => {
    const nests = [];
    const map = isQuestion ? preparedQuestion : preparedChoices;
    for (let x = 0; x < 8; x++) {
      const nestId = `${x},${y}`;
      const isCorrectAnswer = correctAnswer === nestId;
      if (!showMode || (showMode && isInRange(x, y)))
        nests.push(
          <Nest
            key={nestId}
            coordinate={nestId}
            shape={map[nestId]?.imageUrl}
            isQuestion={isQuestion}
            isCorrectAnswer={isCorrectAnswer}
            setCorrectAnswer={() => setCorrectAnswer(nestId)}
            clear={() => {
              if (!showMode) {
                delete map[nestId];
                if (isCorrectAnswer) setCorrectAnswer("");
              }
            }}
            showMode={showMode}
            editMode={editMode}
          />
        );
    }
    return nests;
  };

  const renderNests = () => {
    const rows = [];
    for (let i = 0; i < 4; i++) {
      rows.push(
        <Row className="flex justify-around items-center" key={i}>
          {renderRowNests(i)}
        </Row>
      );
    }
    return rows;
  };

  return (
    <>
      <Info title="Soru" width="50%" largePadding={true} showMode={showMode}>
        <Card className="rounded-xl">{renderNests()}</Card>
      </Info>
      {!showMode && (
        <Info title="Seçenekler" width="50%" largePadding={true}>
          <Card className="rounded-xl">
            {
              <Row className="flex justify-around items-center">
                {renderRowNests(0, false)}
              </Row>
            }
          </Card>
        </Info>
      )}
    </>
  );
}

export default Question;
