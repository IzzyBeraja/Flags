export const checkEnvironment = () => {
  const environmentErrors = [];

  process.env["DATABASE_URL"] == null && environmentErrors.push("DATABASE_URL is not defined");
  process.env["DATABASE_URL2"] == null && environmentErrors.push("DATABASE_URL2 is not defined");

  process.env["DATABASE_URL_PROD"] == null &&
    environmentErrors.push("DATABASE_URL_PROD is not defined");
  process.env["DATABASE_HOST_PROD"] == null &&
    environmentErrors.push("DATABASE_HOST_PROD is not defined");
  process.env["DATABASE_USERNAME_PROD"] == null &&
    environmentErrors.push("DATABASE_USERNAME_PROD is not defined");
  process.env["DATABASE_PASSWORD_PROD"] == null &&
    environmentErrors.push("DATABASE_PASSWORD_PROD is not defined");

  process.env["DATABASE_URL_DEV"] == null &&
    environmentErrors.push("DATABASE_URL_DEV is not defined");
  process.env["DATABASE_HOST_DEV"] == null &&
    environmentErrors.push("DATABASE_HOST_DEV is not defined");
  process.env["DATABASE_USERNAME_DEV"] == null &&
    environmentErrors.push("DATABASE_USERNAME_DEV is not defined");
  process.env["DATABASE_PASSWORD_DEV"] == null &&
    environmentErrors.push("DATABASE_PASSWORD_DEV is not defined");

  process.env["REDIS_PORT"] == null && environmentErrors.push("REDIS_PORT is not defined");
  process.env["REDIS_HOST"] == null && environmentErrors.push("REDIS_HOST is not defined");
  process.env["REDIS_PASSWORD"] == null && environmentErrors.push("REDIS_PASSWORD is not defined");

  process.env["BACKEND_PORT"] == null && environmentErrors.push("BACKEND_PORT is not defined");
  process.env["FRONTEND_PORT"] == null && environmentErrors.push("FRONTEND_PORT is not defined");
  process.env["NODE_ENV"] == null && environmentErrors.push("NODE_ENV is not defined");

  process.env["SESSION_SECRET"] == null && environmentErrors.push("SESSION_SECRET is not defined");

  return environmentErrors;
};
