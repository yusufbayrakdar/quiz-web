import React, { useEffect, useState } from "react";
import { useDrop } from "react-dnd";

function Nest() {
  const [droppedItem, setDroppedItem] = useState({ imageUrl: null });
  const [{ isOver }, drop] = useDrop(
    () => ({
      accept: "shape",
      drop: (item: any) => {
        setDroppedItem(item);
      },
      collect: (monitor) => ({
        isOver: !!monitor.isOver(),
      }),
    }),
    []
  );

  const renderContent = () => {
    if (droppedItem?.imageUrl) {
      return (
        <img
          src={droppedItem.imageUrl}
          className="w-8 h-8 object-contain pointer-events-none"
        />
      );
    }
  };

  return (
    <div
      className={`rounded-xl w-14 h-10 mb-2 center ${
        isOver ? "bg-blue-200" : "bg-gray-200"
      }`}
      ref={drop}
    >
      {renderContent() || null}
    </div>
  );
}

export default Nest;
