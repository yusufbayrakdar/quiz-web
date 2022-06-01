import { ConfigProvider } from "antd";
import React, { useEffect } from "react";
import useRedux from "../../hooks/useRedux";

function Container(props) {
  const { dispatchAction, $ } = useRedux();

  useEffect(() => {
    dispatchAction($.AUTO_LOGIN_REQUEST);
  }, [dispatchAction, $]);
  return <ConfigProvider {...props}></ConfigProvider>;
}

export default Container;
