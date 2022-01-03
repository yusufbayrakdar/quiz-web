import React, { useState } from "react";
import { useDrop } from "react-dnd";
import { CloseOutlined } from "@ant-design/icons";

function Nest({
  map,
  setMap,
  x,
  y,
}: {
  map: any;
  setMap: Function;
  x: Number;
  y: Number;
}) {
  const [droppedItem, setDroppedItem] = useState({ imageUrl: null });
  const [bounceInEffect, setBounceInEffect] = useState(false);
  const [bounceOutEffect, setBounceOutEffect] = useState(false);

  const bounce = () => {
    setBounceInEffect(true);
    setTimeout(() => {
      setBounceInEffect(false);
    }, 600);
  };

  const clearNest = () => {
    if (droppedItem.imageUrl) {
      setBounceOutEffect(true);
      setTimeout(() => {
        setDroppedItem({ imageUrl: null });
        delete map[`${x},${y}`];
        setBounceOutEffect(false);
      }, 600);
    }
  };

  const renderContent = () => {
    if (droppedItem?.imageUrl) {
      return (
        <img
          src={droppedItem.imageUrl}
          className={`w-8 h-8 object-contain pointer-events-none ${
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
        setDroppedItem(item);
        setMap(Object.assign(map, { [`${x},${y}`]: item._id }));
      },
      collect: (monitor) => ({
        isOver: monitor.isOver(),
      }),
    }),
    []
  );

  return (
    <div
      onClick={() => clearNest()}
      className={`group rounded-xl w-14 h-10 mb-2 center relative cursor-pointer ${
        isOver ? "bg-blue-200" : "bg-gray-200"
      }
      ${
        bounceInEffect
          ? "animate__animated animate__bounceIn animate__faster"
          : ""
      } group-hover:opacity-100
      `}
      ref={drop}
    >
      {droppedItem?.imageUrl && (
        <div
          className="absolute bg-gray-100 border-2 border-red-300 text-red-600 rounded-full center text-xs w-4 h-4 opacity-0 group-hover:opacity-100"
          style={{ right: -4, top: -4 }}
        >
          <CloseOutlined style={{ fontSize: 8 }} />
        </div>
      )}
      {renderContent() || null}
    </div>
  );
}

export default Nest;
