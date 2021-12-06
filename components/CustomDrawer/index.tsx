import React, { useEffect, useState } from "react";
import { Drawer, Layout, Menu, Row } from "antd";
import { useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";

import { RootState } from "../../redux/configureStore";
import { useRouter } from "next/router";
import { Route } from "../../utils";
import useRedux from "../../hooks/useRedux";
import Profile from "../Profile";

const { Header, Content } = Layout;

function CustomDrawer() {
  const router = useRouter();
  const { dispatchAction, $ } = useRedux();

  const userInfoVisible = useSelector(
    (state: RootState) => state.auth.userInfoVisible
  );
  const closeUserInfo = () => {
    dispatchAction($.TOGGLE_USER_INFO, false);
  };

  return (
    <Drawer
      title="Profil"
      placement="right"
      onClose={closeUserInfo}
      visible={userInfoVisible}
      getContainer={false}
      closable={false}
      className="absolute"
    >
      <Profile closeDrawer={closeUserInfo} />
    </Drawer>
  );
}

export default CustomDrawer;
