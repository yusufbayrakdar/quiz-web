import React, { useEffect } from "react";
import { Layout, Menu } from "antd";
import { useRouter } from "next/router";

import { BASE_ENDPOINT, TOKEN } from "../../utils";
import {
  QuestionCircleOutlined,
  FormOutlined,
  PlusCircleOutlined,
  UnorderedListOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserGraduate,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";
import useRedux from "../../hooks/useRedux";
import { useSelector } from "react-redux";

const { Sider } = Layout;

function CustomSider() {
  const router = useRouter();
  const loggedIn = useSelector((state) => state.auth.loggedIn);

  const { dispatchAction, $ } = useRedux();

  const instructor = useSelector((state) => state.auth.instructor);
  const student = useSelector((state) => state.auth.student);
  const restrictedPaths = [
    "/questions",
    "/questions/form/[id]",
    "/students",
    "/students/create",
    "/quizzes/form/[id]",
    "/quizzes/detail/[id]",
  ];

  useEffect(() => {
    if (
      !localStorage.getItem(TOKEN) &&
      !["/signin", "/signup", "/"].includes(router.pathname)
    ) {
      router.push("/");
    }
  }, [router, loggedIn]);

  const isInForbiddenPath = restrictedPaths.includes(router.pathname);
  const unauthorizedInstructor = instructor && !instructor.confirmed;
  useEffect(() => {
    if (isInForbiddenPath && (student || unauthorizedInstructor))
      router.push("/dashboard");
  }, [
    student,
    instructor,
    router.pathname,
    isInForbiddenPath,
    router,
    unauthorizedInstructor,
  ]);

  if (["/signin", "/signup", "/"].includes(router.pathname)) return null;

  return (
    <Sider theme="light">
      <Menu mode="inline" defaultSelectedKeys={[router.pathname.split("?")[0]]}>
        {instructor && (
          <Menu.SubMenu
            key="students-submenu"
            icon={<FontAwesomeIcon icon={faUserGraduate} width={15} />}
            title="Öğrenciler"
            disabled={unauthorizedInstructor}
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
        {instructor && (
          <Menu.SubMenu
            key="questions-submenu"
            icon={<QuestionCircleOutlined />}
            title="Sorular"
            disabled={unauthorizedInstructor}
          >
            <Menu.Item
              key={BASE_ENDPOINT.question}
              icon={<UnorderedListOutlined />}
              onClick={() => router.push(`${BASE_ENDPOINT.question}?page=1`)}
            >
              Liste
            </Menu.Item>
            <Menu.Item
              key={`${BASE_ENDPOINT.question}/form/create`}
              icon={<PlusCircleOutlined />}
              onClick={() =>
                router.push(`${BASE_ENDPOINT.question}/form/create`)
              }
            >
              Oluştur
            </Menu.Item>
          </Menu.SubMenu>
        )}
        <Menu.SubMenu
          key={BASE_ENDPOINT.quiz}
          title="Denemeler"
          icon={<FormOutlined />}
        >
          <Menu.Item
            key={BASE_ENDPOINT.quiz}
            icon={<UnorderedListOutlined />}
            onClick={() => router.push(`${BASE_ENDPOINT.quiz}?page=1`)}
          >
            Liste
          </Menu.Item>
          <Menu.Item
            key={`${BASE_ENDPOINT.quiz}/form/create`}
            icon={<PlusCircleOutlined />}
            onClick={() => router.push(`${BASE_ENDPOINT.quiz}/form/create`)}
          >
            Oluştur
          </Menu.Item>
        </Menu.SubMenu>
        <Menu.Item
          key={BASE_ENDPOINT.profile}
          icon={<UserOutlined />}
          onClick={() => router.push(BASE_ENDPOINT.profile)}
        >
          Profil
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
