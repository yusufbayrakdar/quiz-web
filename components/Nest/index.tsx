import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { CloseOutlined } from "@ant-design/icons";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Row } from "antd";
import { useSelector } from "react-redux";

import useRedux from "../../hooks/useRedux";

function Nest({
  coordinate,
  shape,
  isQuestion,
  isCorrectAnswer = false,
  setCorrectAnswer = () => {},
  clear = () => {},
  showMode,
  editMode,
}: any) {
  const { dispatchAction, $ } = useRedux();

  const [bounceInEffect, setBounceInEffect] = useState(false);
  const [bounceOutEffect, setBounceOutEffect] = useState(false);
  const [isDropped, setIsDropped] = useState(false);
  const [droppedItem, setDroppedItem]: [_: any, _: any] = useState({
    imageUrl: shape || null,
  });

  const resetForm = useSelector((state: any) => state.question.resetForm);
  const dragItem = useSelector((state: any) => state.question.dragItem);

  useEffect(() => {
    if (isDropped) {
      setDroppedItem(dragItem);
      setIsDropped(false);
    }
  }, [isDropped]);

  useEffect(() => {
    setDroppedItem({ imageUrl: shape });
  }, [shape]);

  const bounce = () => {
    setBounceInEffect(true);
    setTimeout(() => {
      setBounceInEffect(false);
    }, 600);
  };

  useEffect(() => {
    if (resetForm && !editMode) clearNest();
  }, [resetForm, editMode]);

  const clearNest = () => {
    if (!showMode && droppedItem?.imageUrl) {
      setBounceOutEffect(true);
      dispatchAction(
        isQuestion ? $.REMOVE_SHAPE_TO_QUESTION : $.REMOVE_SHAPE_TO_CHOICES,
        coordinate
      );
      setTimeout(() => {
        clear();
        setDroppedItem({ imageUrl: null });
        setBounceOutEffect(false);
      }, 600);
    }
  };

  const renderContent = () => {
    if (droppedItem?.imageUrl) {
      return (
        <img
          src={droppedItem?.imageUrl}
          className={`h-full p-1 object-contain pointer-events-none m-auto select-none ${
            bounceOutEffect
              ? "animate__animated animate__bounceOut animate__faster"
              : ""
          }`}
          onLoad={bounce}
        />
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

  function DeleteButton() {
    return droppedItem?.imageUrl ? (
      <div
        className={`w-4 h-4 bg-gray-100 border-2 border-red-300 text-red-600 rounded-full center text-xs ${
          !showMode ? "cursor-pointer" : ""
        } ${isQuestion && "opacity-0 group-hover:opacity-100"}`}
        style={isQuestion ? { right: -4, top: -4, position: "absolute" } : {}}
        onClick={clearNest}
      >
        <CloseOutlined style={{ fontSize: 8 }} />
      </div>
    ) : null;
  }

  function MarkAsCorrectAnswerButton() {
    return droppedItem?.imageUrl ? (
      <CheckCircleOutlined
        className={`text-green-500 w-4 h-4`}
        onClick={setCorrectAnswer}
      />
    ) : null;
  }

  return (
    <div
      className={`rounded-xl mb-2 border-solid border-2 group relative group-hover:opacity-100 
      ${!isQuestion && isCorrectAnswer ? "border-green-500 " : ""}
      ${
        bounceInEffect
          ? "animate__animated animate__bounceIn animate__faster"
          : ""
      }`}
    >
      {!showMode &&
        (isQuestion ? (
          <DeleteButton />
        ) : (
          <Row className="bg-gray-300 w-full h-5 flex justify-around items-center rounded-t-lg">
            <DeleteButton />
            <MarkAsCorrectAnswerButton />
          </Row>
        ))}
      <div
        onClick={() => isQuestion && clearNest()}
        className={`
      ${
        isQuestion
          ? `rounded-lg center ${!showMode ? "cursor-pointer" : ""} `
          : `rounded-b-lg overflow-hidden `
      } 
      ${showMode ? "rounded-lg w-10 h-6 " : "w-14 h-10 "}
      ${isOver ? "bg-blue-200 " : "bg-gray-200 "}
      `}
        ref={drop}
      >
        {renderContent()}
      </div>
    </div>
  );
}

export default Nest;
