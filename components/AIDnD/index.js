import React from "react";
import { useDrag } from "react-dnd";

function AiDnD({ children, itemInfo }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "shape",
    item: itemInfo,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag}
      style={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "pointer",
      }}
    >
      {children}
    </div>
  );
}

export default AiDnD;
