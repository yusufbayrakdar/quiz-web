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
  const animateType = "animate__" + type;
  const animateDelay = delay ? " animate__delay-" + delay : "";
  const animationClasses =
    "animate__animated animate__faster " + animateType + animateDelay;
  const animations = animation ? animationClasses : "";
  const classes = `${animations} ${className}`;

  if (original) {
    return {
      ...children,
      props: {
        ...children.props,
        className: `${children.props.className} ${animations}`,
      },
    };
  }
  return (
    <div className={classes} style={style} {...props}>
      {children}
    </div>
  );
}

export default Animated;
