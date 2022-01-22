import React, { useEffect } from "react";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";

import { BASE_ENDPOINT } from "../../utils";
import {
  QuestionCircleOutlined,
  FormOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGraduate,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import useRedux from "../../hooks/useRedux";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/configureStore";

const { Sider } = Layout;

function CustomSider() {
  const router = useRouter();
  const loggedIn = useSelector((state: RootState) => state.auth.loggedIn);

  const { dispatchAction, $ } = useRedux();

  const instructor = useSelector((state: RootState) => state.auth.instructor);

  useEffect(() => {
    if (!loggedIn && !["/signin", "/signup", "/"].includes(router.pathname)) {
      router.push("/");
    }
  }, [loggedIn]);

  if (["/signin", "/signup", "/"].includes(router.pathname)) return null;

  return (
    <Sider theme="light">
      <Menu mode="inline" defaultSelectedKeys={[router.pathname.split("?")[0]]}>
        {instructor && (
          <Menu.SubMenu
            key="students-submenu"
            icon={<FontAwesomeIcon icon={faUserGraduate} width={15} />}
            title="Öğrenciler"
          >
            <Menu.Item
              key={BASE_ENDPOINT.student}
              icon={<UnorderedListOutlined />}
              onClick={() => router.push(`${BASE_ENDPOINT.student}?page=1`)}
            >
              Liste
            </Menu.Item>
            <Menu.Item
              key={`${BASE_ENDPOINT.student}/create`}
              icon={<PlusCircleOutlined />}
              onClick={() => router.push(`${BASE_ENDPOINT.student}/create`)}
            >
              Oluştur
            </Menu.Item>
          </Menu.SubMenu>
        )}
        <Menu.SubMenu
          key="questions-submenu"
          icon={<QuestionCircleOutlined />}
          title="Sorular"
        >
          <Menu.Item
            key={BASE_ENDPOINT.question}
            icon={<UnorderedListOutlined />}
            onClick={() => router.push(`${BASE_ENDPOINT.question}?page=1`)}
          >
            Liste
          </Menu.Item>
          <Menu.Item
            key={`${BASE_ENDPOINT.question}/create`}
            icon={<PlusCircleOutlined />}
            onClick={() => router.push(`${BASE_ENDPOINT.question}/create`)}
          >
            Oluştur
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item
          key={BASE_ENDPOINT.quiz}
          icon={<FormOutlined />}
          onClick={() => router.push(`${BASE_ENDPOINT.quiz}?page=1`)}
        >
          Denemeler
        </Menu.Item>
        <Menu.Item
          key="5"
          icon={<FontAwesomeIcon icon={faSignOutAlt} width={15} />}
          onClick={() => dispatchAction($.LOGOUT_REQUEST)}
        >
          Çıkış
        </Menu.Item>
      </Menu>
    </Sider>
  );
}

export default CustomSider;
