import {
  faChalkboardTeacher,
  faPoll,
  faShapes,
  faUserGraduate,
} from "@fortawesome/free-solid-svg-icons";
import {
  UserOutlined,
  QuestionCircleOutlined,
  UnorderedListOutlined,
} from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ROUTES } from "../config/permission";

const SIDER_ROUTES = [
  {
    type: "Menu",
    label: "Eğitmenler",
    key: ROUTES.Instructors,
    pathname: ROUTES.Instructors,
    icon: <FontAwesomeIcon icon={faChalkboardTeacher} width={18} />,
  },
  {
    type: "SubMenu",
    label: "Öğrenciler",
    key: "/menu/" + ROUTES.Students,
    icon: <FontAwesomeIcon icon={faUserGraduate} width={15} />,
    children: [
      {
        type: "Menu",
        label: "Liste",
        key: ROUTES.Students,
        pathname: ROUTES.Students,
      },
      {
        type: "Menu",
        label: "Oluştur",
        key: ROUTES.StudentsCreate,
        pathname: ROUTES.StudentsCreate,
      },
    ],
  },
  {
    type: "SubMenu",
    label: "Şekiller",
    key: "/menu/" + ROUTES.Shapes,
    icon: <FontAwesomeIcon icon={faShapes} width={15} />,
    children: [
      {
        type: "Menu",
        label: "Liste",
        key: ROUTES.Shapes,
        pathname: ROUTES.Shapes,
      },
      {
        type: "Menu",
        label: "Oluştur",
        key: ROUTES.ShapesCreate,
        pathname: ROUTES.ShapesCreate,
      },
    ],
  },
  {
    type: "SubMenu",
    label: "Sorular",
    key: "/menu/" + ROUTES.Questions,
    icon: <QuestionCircleOutlined />,
    children: [
      {
        type: "Menu",
        label: "Liste",
        key: ROUTES.Questions,
        pathname: ROUTES.Questions,
      },
      {
        type: "Menu",
        label: "Oluştur",
        key: ROUTES.QuestionsCreate,
        pathname: ROUTES.QuestionsCreate,
      },
    ],
  },
  {
    type: "SubMenu",
    label: "Denemeler",
    key: "/menu/" + ROUTES.Quizzes,
    icon: <UnorderedListOutlined />,
    children: [
      {
        type: "Menu",
        label: "Liste",
        key: ROUTES.Quizzes,
        pathname: ROUTES.Quizzes,
      },
      {
        type: "Menu",
        label: "Oluştur",
        key: ROUTES.QuizzesCreate,
        pathname: ROUTES.QuizzesCreate,
      },
    ],
  },
  {
    type: "Menu",
    label: "Sonuçlar",
    key: ROUTES.Scores,
    pathname: ROUTES.Scores,
    icon: <FontAwesomeIcon icon={faPoll} width={8} />,
  },
  {
    type: "Menu",
    label: "Profil",
    key: ROUTES.Profile,
    pathname: ROUTES.Profile,
    icon: <UserOutlined />,
  },
];

export default SIDER_ROUTES;
