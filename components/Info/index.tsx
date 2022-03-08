import React from "react";

function Info({ children, title, width, largePadding, showMode }: any) {
  const widthStyle = width ? { width } : {};
  const paddingConstant = largePadding ? 32 : 16;
  const containerStyle = showMode
    ? { marginBottom: 10, marginRight: 10 }
    : { marginTop: largePadding ? 44 : 36 };
  return (
    <div className="relative" style={containerStyle}>
      {showMode ? (
        <div
          style={{ backgroundColor: "#161E68" }}
          className="absolute rounded-xl top-1 left-1 w-full h-full"
        />
      ) : (
        <div
          className="gBold"
          style={{
            position: "absolute",
            color: "white",
            paddingLeft: paddingConstant,
            paddingRight: paddingConstant,
            paddingBottom: paddingConstant,
            paddingTop: paddingConstant / 4,
            borderRadius: 12,
            top: largePadding ? -30 : -22,
            left: -16,
            backgroundColor: "#161E68",
            width: "90%",
            ...widthStyle,
          }}
        >
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export default Info;
