import React from "react";

function Animated({
  children,
  className = "",
  style = {},
  type = "fadeIn",
  animation = true,
  original = false,
  ...props
}) {
  const animationClasses = animation
    ? `animate__animated animate__${type} animate__faster `
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
