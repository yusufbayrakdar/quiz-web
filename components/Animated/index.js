import React from "react";

function Animated({
  children,
  className = "",
  style = {},
  type = "fadeIn",
  animation = true,
  original = false,
  delay = 0,
  ...props
}) {
  const animationClasses = animation
    ? `animate__animated animate__${type} animate__faster ${
        delay ? `animate__delay-${delay}s` : ""
      }`
    : "";
  if (original) {
    return {
      ...children,
      props: {
        ...children.props,
        className: `${children.props.className} ${animationClasses}`,
      },
    };
  }
  return (
    <div className={animationClasses + className} style={style} {...props}>
      {children}
    </div>
  );
}

export default Animated;
