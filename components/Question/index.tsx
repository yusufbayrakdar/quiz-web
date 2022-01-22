import { Card, Row } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";
import Info from "../Info";
import Nest from "../Nest";

function Question({
  getData,
  correctAnswer,
  setCorrectAnswer,
  data,
  showMode,
  small,
}: any) {
  const [question]: [_: any, _: any] = useState(
    data && data.question ? data.question : {}
  );
  const [choices]: [_: any, _: any] = useState(
    data && data.choices ? data?.choices : {}
  );

  const resetForm = useSelector((state: RootState) => state.question.resetForm);

  const renderRowNests = (y: Number, isQuestion = true) => {
    const nests = [];
    const map = isQuestion ? question : choices;

    for (let x = 0; x < 8; x++) {
      const nestId = `${x},${y}`;
      nests.push(
        <Nest
          key={nestId}
          setMap={(droppedItem: string) => {
            map[nestId] = droppedItem;
            getData({
              question,
              choices,
            });
          }}
          shape={map[nestId]}
          isQuestion={isQuestion}
          isCorrectAnswer={correctAnswer === nestId}
          setCorrectAnswer={() => setCorrectAnswer(nestId)}
          clear={() => {
            if (!showMode) {
              delete map[nestId];
              setCorrectAnswer("");
              getData({
                question,
                choices,
              });
            }
          }}
          reset={resetForm}
          showMode={showMode}
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
    </>
  );
}

export default Question;
