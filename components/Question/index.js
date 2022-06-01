import { Row } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import useRedux from "../../hooks/useRedux";
import Info from "../Info";
import Nest from "../Nest";

function Question({
  showMode,
  questionListItem,
  editMode,
  withoutCard = false,
}) {
  const { dispatchAction, $ } = useRedux();
  const prepareMap = (list) => {
    if (!list) return {};
    return list?.reduce((store, current) => {
      store[current.coordinate] = current.shape;
      return store;
    }, {});
  };

  const activeQuestion = useSelector(
    (state) => questionListItem || state.question.activeQuestion
  );
  const correctAnswer = activeQuestion?.correctAnswer;
  const setCorrectAnswer = (value) => {
    dispatchAction($.SET_CORRECT_ANSWER, value);
  };
  const preparedQuestion = prepareMap(activeQuestion?.question);
  const preparedChoices = prepareMap(activeQuestion?.choices);
  const [showModeConstraints, setShowModeConstraints] = useState({});

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
  }, [activeQuestion, preparedQuestion]);

  const isInRange = (x, y) => {
    const { minX, maxX, minY, maxY } = showModeConstraints;
    return minX <= x && maxX >= x && minY <= y && maxY >= y;
  };

  const renderRowNests = (y, isQuestion = true) => {
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
            showMode={showMode}
            editMode={editMode}
            widthRate={showMode ? 0.7 : 1}
          />
        );
    }
    return nests;
  };

  const renderNests = () => {
    const rows = [];
    for (let i = 0; i < 4; i++) {
      rows.push(
        <Row className="justify-around" key={`nest-row-${i}`}>
          {renderRowNests(i)}
        </Row>
      );
    }
    return rows;
  };

  return (
    <Styled showMode={showMode}>
      {withoutCard ? (
        renderNests()
      ) : (
        <Info title="Soru" largePadding={true} showMode={showMode}>
          {renderNests()}
        </Info>
      )}
      {!showMode && (
        <Info title="Seçenekler" titleWidthPercent={50} largePadding={true}>
          {<Row className="justify-around">{renderRowNests(0, false)}</Row>}
        </Info>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  pointer-events: ${({ showMode }) => (showMode ? "none" : "auto")};
  .justify-around {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
`;

export default Question;
