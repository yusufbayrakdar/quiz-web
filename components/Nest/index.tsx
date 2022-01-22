import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";
import { CloseOutlined } from "@ant-design/icons";
import { CheckCircleOutlined } from "@ant-design/icons";
import { Row } from "antd";

function Nest({
  setMap,
  shape,
  isQuestion,
  isCorrectAnswer,
  setCorrectAnswer = () => {},
  clear = () => {},
  reset,
  showMode,
}: any) {
  const [bounceInEffect, setBounceInEffect] = useState(false);
  const [bounceOutEffect, setBounceOutEffect] = useState(false);
  const [droppedItem, setDroppedItem]: [_: any, _: any] = useState({
    imageUrl: shape || null,
  });

  const bounce = () => {
    setBounceInEffect(true);
    setTimeout(() => {
      setBounceInEffect(false);
    }, 600);
  };

  useEffect(() => {
    clearNest();
  }, [reset]);

  const clearNest = () => {
    if (!showMode && droppedItem?.imageUrl) {
      setBounceOutEffect(true);
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
          className={`w-8 h-8 object-contain pointer-events-none m-auto select-none ${
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
      drop: (item: any) => {
        setMap(item._id);
        setDroppedItem(item);
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
        className={`bg-gray-100 border-2 border-red-300 text-red-600 rounded-full center text-xs w-4 h-4 ${
          isQuestion && "opacity-0 group-hover:opacity-100"
        }`}
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

  if (showMode && !shape) return null;
  return (
    <div
      onClick={() => isQuestion && clearNest()}
      className={`group rounded-xl w-14 mb-2 cursor-pointer relative group-hover:opacity-100 border-solid border-2 
      ${!isQuestion && isCorrectAnswer ? "border-green-500" : ""}
      ${isQuestion ? "h-10 center" : "h-16 overflow-hidden"} ${
        isOver ? "bg-blue-200" : "bg-gray-200"
      }
      ${
        bounceInEffect
          ? "animate__animated animate__bounceIn animate__faster"
          : ""
      }
      `}
      ref={drop}
    >
      {isQuestion ? (
        <DeleteButton />
      ) : (
        <Row className="bg-gray-300 w-full h-5 mb-1 flex justify-around items-center">
          <DeleteButton />
          <MarkAsCorrectAnswerButton />
        </Row>
      )}
      {renderContent()}
    </div>
  );
}

export default Nest;
