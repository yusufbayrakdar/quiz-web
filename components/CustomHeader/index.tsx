import React, { useEffect, useState } from "react";
import { Layout, Menu, Row } from "antd";
import { useSelector } from "react-redux";
import { UserOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useRouter } from "next/router";

import { RootState } from "../../redux/configureStore";
import { Route } from "../../utils";
import useRedux from "../../hooks/useRedux";
import MenuItem from "../MenuItem";

const { Header } = Layout;

function CustomHeader() {
  const router = useRouter();
  const { dispatchAction, $ } = useRedux();

  const toggleUserInfo = () => {
    dispatchAction($.TOGGLE_USER_INFO);
  };

  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);
  const userInfoVisible = useSelector(
    (state: RootState) => state.auth.userInfoVisible
  );
  const [currentRoute, setCurrentRoute] = useState(1);

  useEffect(
    () =>
      setCurrentRoute(
        Number(routes.find((r) => r.path.includes(router.pathname))?.order)
      ),
    [router.pathname]
  );

  const routes: Array<Route> = [
    { path: "/", title: "ANA SAYFA", order: 1 },
    { path: "/signin", title: "GİRİŞ YAP", order: 3 },
    { path: "/signup", title: "KAYDOL", order: 4 },
  ];

  if (["/signin", "/signup"].includes(router.pathname))
    return (
      <div
        className="absolute left-7 top-4 z-10 text-4xl font-bold text-gray-100 font-serif cursor-pointer"
        onClick={() => router.push("/")}
      >
        BilsemIQ
      </div>
    );

  return (
    <Header className="relative bg-gradient-to-r from-yellow-400 via-pink-500 to-red-500">
      <Row className="flex flex-1">
        <Link href="/">
          <p className="font-bold text-gray-100 font-sans text-2xl text-center flex justify-center items-center cursor-pointer">
            BilsemIQ
          </p>
        </Link>
        <Menu
          theme="light"
          mode="horizontal"
          selectedKeys={[String(currentRoute)]}
          className="flex flex-1 justify-end"
          style={{ backgroundColor: "rgba(0,0,0,0)" }}
        >
          <MenuItem link="/" title="ANA SAYFA" />
          {!loggedIn && <MenuItem link="/signin" title="GİRİŞ YAP" />}
          {!loggedIn && <MenuItem link="/signup" title="KAYDOL" />}
          {loggedIn && (
            <MenuItem onClick={toggleUserInfo} active={userInfoVisible}>
              <UserOutlined style={{ fontSize: 20 }} />
            </MenuItem>
          )}
        </Menu>
      </Row>
    </Header>
  );
}

export default CustomHeader;
