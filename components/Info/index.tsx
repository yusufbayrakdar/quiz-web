import React from "react";

function Info({ children, title, width, largePadding }: any) {
  const widthStyle = width ? { width } : {};
  const paddingConstant = largePadding ? 8 : 4;
  return (
    <div className="relative" style={{ marginTop: largePadding ? 44 : 36 }}>
      <div
        className={`absolute text-white pl-${paddingConstant} pr-${paddingConstant} pb-${paddingConstant} pt-${
          paddingConstant / 4
        } gBold rounded-xl`}
        style={{
          top: largePadding ? -30 : -22,
          left: -16,
          backgroundColor: "#161E68",
          width: "90%",
          ...widthStyle,
        }}
      >
        {title}
      </div>
      {children}
    </div>
  );
}

export default Info;
