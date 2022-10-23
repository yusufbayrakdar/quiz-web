import React, { useEffect } from "react";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

import useRedux from "../../hooks/useRedux";
import { BASE_ENDPOINT, ROLES, TOKEN } from "../../utils";
import { isRoutePermitted } from "../../config/permission";
import SIDER_ROUTES from "../../utils/siderRoutes";

const { Sider } = Layout;

function CustomSider() {
  const router = useRouter();
  const loggedIn = useSelector((state) => state.auth.loggedIn);
  const siderCollapsed = useSelector((state) => state.global.siderCollapsed);
  const user = useSelector((state) => state.auth.user);

  const { dispatchAction, $ } = useRedux();

  useEffect(() => {
    if (
      !localStorage.getItem(TOKEN) &&
      !["/signin", "/signup", "/"].includes(router.pathname)
    ) {
      router.push("/");
    }
  }, [router, loggedIn]);

  const isInForbiddenPath = !isRoutePermitted({ pathname: router.pathname });
  const unauthorizedInstructor =
    user?.role === ROLES.INSTRUCTOR && !user?.confirmed;
  useEffect(() => {
    if (user && isInForbiddenPath) {
      router.push(BASE_ENDPOINT.quiz);
    }
  }, [
    user,
    router.pathname,
    isInForbiddenPath,
    router,
    unauthorizedInstructor,
  ]);

  if (["/signin", "/signup", "/"].includes(router.pathname)) return null;

  const getFilteredItems = () => {
    const navigateTo = (pathname) => {
      if (pathname) router.push(pathname);
    };
    const withNavigateItem = (item) =>
      Object.assign(item, { onClick: () => navigateTo(item.pathname) });

    const Items = SIDER_ROUTES.map((item) => {
      if (item.type === "SubMenu") {
        const filteredChildren = [];
        for (let i = 0; i < item.children.length; i++) {
          const child = item.children[i];
          if (isRoutePermitted(child)) {
            filteredChildren.push(withNavigateItem(child));
          }
        }

        if (!filteredChildren.length) return null;
        return { ...item, children: filteredChildren };
      } else return isRoutePermitted(item) ? withNavigateItem(item) : null;
    });
    Items.push({
      type: "Menu",
      label: "Çıkış",
      key: "logout",
      icon: <FontAwesomeIcon icon={faSignOutAlt} width={15} />,
      onClick: () => dispatchAction($.LOGOUT_REQUEST),
    });

    return Items;
  };

  const currentBasePath = "/" + router.pathname.split("/")[1];

  return (
    <Sider
      theme="light"
      defaultopenkeys={[currentBasePath]}
      collapsible
      collapsed={siderCollapsed}
      onCollapse={(value) =>
        dispatchAction(value ? $.COLLAPSE_SIDER : $.DECOLLAPSE_SIDER)
      }
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={[router.pathname.split("?")[0]]}
        items={getFilteredItems()}
      />
    </Sider>
  );
}

export default CustomSider;
