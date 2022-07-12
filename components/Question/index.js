import { Row } from "antd";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";

import useRedux from "../../hooks/useRedux";
import { shuffle } from "../../utils";
import Info from "../Info";
import Nest from "../Nest";

function Question({
  showMode,
  questionListItem,
  editMode,
  withoutCard = false,
  style,
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
  const examMode = useSelector((state) => Boolean(state.auth.student));
  const correctAnswer = activeQuestion?.correctAnswer;
  const preparedQuestion = prepareMap(activeQuestion?.question);
  const preparedChoices = prepareMap(activeQuestion?.choices);
  const [showModeQuestionConstraints, setShowModeQuestionConstraints] =
    useState({});
  const [showModeChoicesConstraints, setShowModeChoicesConstraints] = useState(
    {}
  );

  const calculateConstraints = (map, setter) => {
    const constraints = {
      minX: 8,
      maxX: 0,
      minY: 8,
      maxY: 0,
    };
    for (const key in map) {
      const [x, y] = key.split(",");

      constraints.minX = Math.min(constraints.minX, Number(x));
      constraints.maxX = Math.max(constraints.maxX, Number(x));

      constraints.minY = Math.min(constraints.minY, Number(y));
      constraints.maxY = Math.max(constraints.maxY, Number(y));
    }
    setter(constraints);
  };

  useEffect(() => () => dispatchAction($.QUESTION_FORM_RESET), []);

  useEffect(() => {
    calculateConstraints(preparedQuestion, setShowModeQuestionConstraints);
    calculateConstraints(preparedChoices, setShowModeChoicesConstraints);
  }, [activeQuestion]);

  const isInRange = (x, y, constraints) => {
    const { minX, maxX, minY, maxY } = constraints;
    return minX <= x && maxX >= x && minY <= y && maxY >= y;
  };

  const renderRowNests = (y, isQuestion = true) => {
    const nests = [];
    const map = isQuestion ? preparedQuestion : preparedChoices;
    const constraints = isQuestion
      ? showModeQuestionConstraints
      : showModeChoicesConstraints;
    for (let x = 0; x < 8; x++) {
      const nestId = `${x},${y}`;
      const isCorrectAnswer = correctAnswer === map[nestId]?._id;
      if (
        !showMode ||
        ((showMode || examMode) && isInRange(x, y, constraints))
      ) {
        nests.push(
          <Nest
            key={nestId}
            coordinate={nestId}
            shape={map[nestId]}
            isQuestion={isQuestion}
            isCorrectAnswer={isCorrectAnswer}
            showMode={showMode}
            editMode={editMode}
            widthRate={showMode ? 0.7 : 1}
          />
        );
      }
    }
    return isQuestion || !showMode ? nests : shuffle(nests);
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
    <Styled showMode={showMode} examMode={examMode} style={style}>
      {withoutCard ? (
        renderNests()
      ) : (
        <Info title="Soru" largePadding={true} showMode={showMode}>
          {renderNests()}
        </Info>
      )}
      {(!showMode || examMode) && (
        <Info
          title="Seçenekler"
          titleWidthPercent={50}
          largePadding={true}
          showMode={showMode}
          style={showMode ? { marginTop: 15 } : {}}
        >
          {<Row className="justify-around">{renderRowNests(0, false)}</Row>}
        </Info>
      )}
    </Styled>
  );
}

const Styled = styled.div`
  pointer-events: ${({ showMode, examMode }) =>
    !showMode || examMode ? "auto" : "none"};
  .justify-around {
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
`;

export default Question;
