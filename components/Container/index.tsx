import { ConfigProvider } from "antd";
import React, { useEffect } from "react";
import useRedux from "../../hooks/useRedux";

function index(props: object) {
  const { dispatchAction, $ } = useRedux();

  useEffect(() => {
    dispatchAction($.AUTO_LOGIN_REQUEST);
  }, [dispatchAction, $]);
  return (
    <div className="w-full h-full">
      <ConfigProvider {...props}></ConfigProvider>
    </div>
  );
}

export default index;
