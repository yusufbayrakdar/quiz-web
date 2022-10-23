import store from "../redux/configureStore";

const ROLES = {
  ADMIN: "admin",
  INSTRUCTOR: "instructor",
  STUDENT: "student",
};

export const CAN = {
  ASSIGN: "ASSIGN",
  ACTIVATE: "ACTIVATE",
  CREATE: "CREATE",
  CONFIRM_EMAIL: "CONFIRM_EMAIL",
  DEACTIVATE: "DEACTIVATE",
  DETAIL_VIEW: "DETAIL_VIEW",
  EDIT: "EDIT",
  DELETE: "DELETE",
  IMAGE_UPLOAD: "IMAGE_UPLOAD",
  LIST_VIEW: "LIST_VIEW",
  DETAIL_VIEW: "DETAIL_VIEW",
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
    [D.question]: [CAN.ACTIVATE, CAN.CREATE, CAN.DEACTIVATE, CAN.EDIT, CAN.LIST_VIEW, CAN.DETAIL_VIEW],
    [D.quiz]: [CAN.ACTIVATE, CAN.CREATE, CAN.DEACTIVATE, CAN.EDIT, CAN.LIST_VIEW, CAN.DETAIL_VIEW, CAN.ASSIGN, CAN.DELETE],
    [D.student]: [CAN.ACTIVATE, CAN.CREATE, CAN.DEACTIVATE, CAN.EDIT, CAN.LIST_VIEW, CAN.DETAIL_VIEW, CAN.ASSIGN, CAN.DELETE],
    [D.instructor]: [CAN.ACTIVATE, CAN.CREATE, CAN.DEACTIVATE, CAN.EDIT, CAN.LIST_VIEW, CAN.DETAIL_VIEW, CAN.ASSIGN],
    [D.shape]: [CAN.ACTIVATE, CAN.CREATE, CAN.DEACTIVATE, CAN.EDIT, CAN.LIST_VIEW, CAN.DETAIL_VIEW, CAN.IMAGE_UPLOAD],
    [D.score]: [CAN.LIST_VIEW, CAN.DETAIL_VIEW],
  },
  [ROLES.INSTRUCTOR]: {
    [D.question]: [CAN.CREATE, CAN.LIST_VIEW, CAN.DETAIL_VIEW],
    [D.quiz]: [CAN.CREATE, CAN.LIST_VIEW, CAN.DETAIL_VIEW, CAN.ASSIGN],
    [D.student]: [CAN.CREATE, CAN.LIST_VIEW, CAN.DETAIL_VIEW, CAN.DELETE],
    [D.instructor]: [CAN.CREATE, CAN.LIST_VIEW, CAN.DETAIL_VIEW],
    [D.shape]: [CAN.CREATE, CAN.LIST_VIEW, CAN.DETAIL_VIEW, CAN.IMAGE_UPLOAD],
    [D.score]: [CAN.LIST_VIEW],
  },
  [ROLES.STUDENT]: {
    [D.quiz]: [CAN.LIST_VIEW, CAN.DETAIL_VIEW],
    [D.score]: [CAN.LIST_VIEW],
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

const initialPage = {
  [ROLES.ADMIN]: routes.Dashboard,
  [ROLES.STUDENT]: routes.Dashboard,
  [ROLES.INSTRUCTOR]: routes.Dashboard,
};

export const ROUTES = routes;

const PERMIT_FOR_ROUTES = {
  [ROLES.ADMIN]: Object.values(routes),
  [ROLES.INSTRUCTOR]: [
    routes.Dashboard,
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
  [ROLES.STUDENT]: [
    routes.Dashboard,
    routes.Quizzes,
    routes.Quiz,
    routes.Scores,
    routes.Profile,
  ],
};

export const isRoutePermitted = ({ pathname }) => {
  const { user } = store.getState().auth;
  return PERMIT_FOR_ROUTES[user?.role]?.includes(pathname);
};

export const filterPermittedItems = (routes) => {
  const { user } = store.getState().auth;

  let filteredRoutes = routes.filter(({ path }) =>
    PERMIT_FOR_ROUTES[user?.role]?.includes(path)
  );

  if (!filteredRoutes.find((e) => e.path === ROUTES.Dashboard)) {
    filteredRoutes = [
      { path: ROUTES.Dashboard, name: "", redirect: initialPage[user?.role] },
      ...filteredRoutes,
    ];
  }

  return filteredRoutes;
};
