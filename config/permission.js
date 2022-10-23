import store from "../redux/configureStore";

const ROLES = {
  ADMIN: "admin",
  INSTRUCTOR: "instructor",
  STUDENT: "student",
};

export const CAN = {
  CREATE: "CREATE",
  EDIT: "EDIT",
  DELETE: "DELETE",
  LIST_VIEW: "LIST_VIEW",
  DETAIL_VIEW: "DETAIL_VIEW",
  ASSIGN: "ASSIGN",
  ACTIVATE: "ACTIVATE",
  DEACTIVATE: "DEACTIVATE",
  IMAGE_UPLOAD: "IMAGE_UPLOAD",
  CONFIRM_EMAIL: "CONFIRM_EMAIL",
};

export const D = {
  dashboard: "dashboard",
  question: "question",
  student: "student",
  instructor: "instructor",
  shape: "shape",
  quiz: "quiz",
  score: "score",
};

// prettier-ignore
export const PERMITS = {
  [ROLES.ADMIN]: {
    [D.question]: [CAN.CREATE, CAN.EDIT, CAN.DELETE, CAN.LIST_VIEW, CAN.DETAIL_VIEW, CAN.ACTIVATE, CAN.DEACTIVATE],
    [D.quiz]: [CAN.CREATE, CAN.EDIT, CAN.DELETE, CAN.LIST_VIEW, CAN.DETAIL_VIEW, CAN.ASSIGN, CAN.ACTIVATE, CAN.DEACTIVATE],
    [D.student]: [CAN.CREATE, CAN.EDIT, CAN.DELETE, CAN.LIST_VIEW, CAN.DETAIL_VIEW, CAN.ASSIGN, CAN.ACTIVATE, CAN.DEACTIVATE],
    [D.instructor]: [CAN.CREATE, CAN.EDIT, CAN.DELETE, CAN.LIST_VIEW, CAN.DETAIL_VIEW, CAN.ACTIVATE, CAN.DEACTIVATE, CAN.ASSIGN],
    [D.shape]: [CAN.CREATE, CAN.EDIT, CAN.DELETE, CAN.LIST_VIEW, CAN.DETAIL_VIEW, CAN.ACTIVATE, CAN.DEACTIVATE, CAN.IMAGE_UPLOAD],
    [D.score]: [CAN.LIST_VIEW, CAN.DETAIL_VIEW],
  },
  [ROLES.INSTRUCTOR]: {
    [D.question]: [CAN.CREATE, CAN.LIST_VIEW, CAN.DETAIL_VIEW],
    [D.quiz]: [CAN.CREATE, CAN.LIST_VIEW, CAN.DETAIL_VIEW, CAN.ASSIGN],
    [D.student]: [CAN.CREATE, CAN.DELETE, CAN.LIST_VIEW, CAN.DETAIL_VIEW],
    [D.instructor]: [CAN.LIST_VIEW, CAN.DETAIL_VIEW],
    [D.shape]: [CAN.LIST_VIEW, CAN.DETAIL_VIEW],
    [D.score]: [CAN.LIST_VIEW, CAN.DETAIL_VIEW],
  },
  [ROLES.STUDENT]: {
    [D.quiz]: [CAN.LIST_VIEW, CAN.DETAIL_VIEW],
    [D.score]: [CAN.LIST_VIEW, CAN.DETAIL_VIEW],
  },
};

const routes = {
  Home: "/",
  Dashboard: "/dashboard",
  Students: "/students",
  StudentDetail: "/students/[id]",
  StudentsCreate: "/students/create",
  Instructors: "/instructors",
  InstructorDetail: "/instructors/[id]",
  Questions: "/questions",
  QuestionsCreate: "/questions/form/create",
  QuestionsForm: "/questions/form/[id]",
  Quizzes: "/quizzes",
  Quiz: "/quizzes/[id]",
  QuizDetail: "/quizzes/detail/[id]",
  QuizzesCreate: "/quizzes/form/create",
  QuizzesForm: "/quizzes/form/[id]",
  Shapes: "/shapes",
  ShapesCreate: "/shapes/create",
  ShapesForm: "/shapes/[id]",
  Scores: "/scores",
  Profile: "/profile",
};

export const ROUTES = routes;

const PERMIT_FOR_ROUTES = {
  [ROLES.ADMIN]: Object.values(routes),
  [ROLES.INSTRUCTOR]: [
    routes.Students,
    routes.StudentDetail,
    routes.StudentsCreate,
    routes.Questions,
    routes.QuestionsCreate,
    routes.QuestionsForm,
    routes.Quizzes,
    routes.QuizDetail,
    routes.QuizzesCreate,
    routes.QuizzesForm,
    routes.Scores,
    routes.Profile,
  ],
  [ROLES.STUDENT]: [routes.Quizzes, routes.Quiz, routes.Scores, routes.Profile],
};

export const isRoutePermitted = ({ pathname }) => {
  const { user } = store.getState().auth;
  return PERMIT_FOR_ROUTES[user?.role]?.includes(pathname);
};
