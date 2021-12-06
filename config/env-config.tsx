const ENVIRONMENT = {
  DEVELOPMENT: "development",
  STAGING: "staging",
  PRODUCTION: "production",
};
const APP: { [key: string]: string } = {
  development: `http://localhost:5000`,
  staging: `https://bilsemiq-api.herokuapp.com`,
  production: `https://bilsemiq-api.herokuapp.com`,
};
export const activeEnvironment =
  process.env.NODE_ENV === "development"
    ? ENVIRONMENT.DEVELOPMENT
    : ENVIRONMENT.PRODUCTION;

const API_PATH = APP[activeEnvironment];

export default API_PATH;
