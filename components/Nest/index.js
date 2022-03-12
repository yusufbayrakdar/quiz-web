import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { Row } from "antd";
import { useSelector } from "react-redux";
import styled from "styled-components";

import useRedux from "../../hooks/useRedux";
import Animated from "../Animated";

function Nest({
  coordinate,
  shape,
  isQuestion,
  isCorrectAnswer = false,
  setCorrectAnswer = () => {},
  editMode,
  widthRate = 1,
}) {
  const { dispatchAction, $ } = useRedux();

  const [bounceInEffect, setBounceInEffect] = useState(false);
  const [bounceOutEffect, setBounceOutEffect] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [droppedItem, setDroppedItem] = useState({
    imageUrl: shape || null,
  });

  const resetForm = useSelector((state) => state.question.resetForm);
  const dragItem = useSelector((state) => state.question.dragItem);

  const bounce = () => {
    setBounceInEffect(true);
    setTimeout(() => {
      setBounceInEffect(false);
    }, 600);
  };

  const clearNest = () => {
    if (droppedItem?.imageUrl) {
      setBounceOutEffect(true);
      setTimeout(() => {
        dispatchAction(
          isQuestion ? $.REMOVE_SHAPE_TO_QUESTION : $.REMOVE_SHAPE_TO_CHOICES,
          coordinate
        );
        setDroppedItem({ imageUrl: null });
        setBounceOutEffect(false);
      }, 600);
    }
  };

  useEffect(() => {
    if (isDropped) {
      setDroppedItem(dragItem);
      setIsDropped(false);
    }
  }, [isDropped]);

  useEffect(() => {
    setDroppedItem({ imageUrl: shape });
  }, [shape]);

  useEffect(() => {
    if (resetForm && !editMode) clearNest();
  }, [resetForm, editMode]);

  const renderContent = () => {
    if (droppedItem?.imageUrl) {
      return (
        <Animated original={true} animation={bounceOutEffect} type="bounceOut">
          <img src={droppedItem?.imageUrl} className="shape" onLoad={bounce} />
        </Animated>
      );
    }
  };

  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "shape",
      drop: () => {
        setIsDropped(true);
        dispatchAction(
          isQuestion ? $.ADD_SHAPE_TO_QUESTION : $.ADD_SHAPE_TO_CHOICES,
          coordinate
        );
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    []
  );

  function DeleteButton({ className = "" }) {
    return droppedItem?.imageUrl ? (
      <div className={"center delete-button " + className} onClick={clearNest}>
        <div className="delete-icon" />
      </div>
    ) : null;
  }

  function MarkAsCorrectAnswerButton() {
    return droppedItem?.imageUrl ? (
      <div
        className="mark-as-correct-answer-button center"
        onClick={setCorrectAnswer}
      >
        <div className="check-icon" />
      </div>
    ) : null;
  }

  return (
    <StyledAnimated
      type="bounceIn"
      animation={bounceInEffect}
      isQuestion={isQuestion}
      isCorrectAnswer={isCorrectAnswer}
      isOver={isOver}
      widthRate={widthRate}
    >
      <div
        className={
          !isQuestion && isCorrectAnswer ? "correct-answer-shadow" : ""
        }
      >
        {isQuestion ? (
          <DeleteButton className={"absolute-delete-button"} />
        ) : (
          <Row id="action-buttons">
            <DeleteButton />
            <MarkAsCorrectAnswerButton />
          </Row>
        )}
        <div
          onClick={() => isQuestion && clearNest()}
          className={`nest center`}
          ref={drop}
        >
          {renderContent()}
        </div>
      </div>
    </StyledAnimated>
  );
}

const StyledAnimated = styled(Animated)`
  position: relative;
  border-radius: 12px;
  margin-bottom: 8px;
  &:hover .delete-button {
    opacity: 1;
  }

  .nest {
    border-radius: ${({ isQuestion }) => (isQuestion ? "0.7vw 0.7vw" : "0 0")}
      0.7vw 0.7vw;
    ${({ isQuestion }) =>
      isQuestion ? "cursor: pointer;" : "overflow: hidden;"}
    width: ${({ widthRate }) => widthRate * 3.9}vw;
    height: 2.79vw;
    background-color: ${({ theme, isOver }) =>
      isOver ? theme.colors.lightPrimary : theme.colors.nestGray};
  }
  #action-buttons {
    background-color: ${({ theme }) => theme.colors.darkGray};
    width: 100%;
    height: 20px;
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-radius: 0.7vw 0.7vw 0 0;
  }
  .mark-as-correct-answer-button {
    color: ${({ theme }) => theme.colors.green};
    width: 1.15vw;
    height: 1.15vw;
    font-size: 12px;
    line-height: 16px;
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.gray};
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.transparentGreen};
    overflow: hidden;
    .check-icon {
      clip-path: polygon(19% 39%, 11% 49%, 46% 80%, 85% 21%, 74% 15%, 44% 55%);
      background-color: ${({ theme }) => theme.colors.green};
      width: 100%;
      height: 100%;
    }
  }
  .delete-button {
    width: 1.15vw;
    height: 1.15vw;
    font-size: 12px;
    line-height: 16px;
    cursor: pointer;
    background-color: ${({ theme }) => theme.colors.gray};
    border-radius: 50%;
    border: 2px solid ${({ theme }) => theme.colors.lightRed};
    color: ${({ theme }) => theme.colors.lightRed};
    overflow: hidden;
    ${({ isQuestion }) => (isQuestion ? "opacity: 0;" : "")}
    padding: 1px;
    .delete-icon {
      clip-path: polygon(
        0 0,
        0 29%,
        34% 52%,
        0 100%,
        33% 100%,
        53% 70%,
        100% 100%,
        100% 71%,
        69% 49%,
        100% 0,
        71% 0,
        48% 32%
      );
      background-color: ${({ theme }) => theme.colors.red};
      width: 90%;
      height: 90%;
    }
  }
  .absolute-delete-button {
    position: absolute;
    top: -4px;
    right: -4px;
  }
  .shape {
    height: 100%;
    width: 100%;
    padding: 4px;
    object-fit: contain;
    pointer-events: none;
    select: none;
  }
  .correct-answer-shadow {
    -webkit-box-shadow: 0px 0px 7px 3px ${({ theme }) => theme.colors.green};
    box-shadow: 0px 0px 7px 3px ${({ theme }) => theme.colors.green};
    border-radius: 12px;
  }
`;

export default Nest;
