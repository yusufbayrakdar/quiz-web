import React from "react";
import { useDrag } from "react-dnd";

function AiDnD({ children, itemInfo }: any) {
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
      }}
    >
      {children}
    </div>
  );
}

export default AiDnD;
