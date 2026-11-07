export const ERROR_MESSAGES = {
  NOT_FOUND: "Not found.",
  DUPLICATE_EMAIL: "This email address is already in use",
  UNKNOWN_ERROR: "Oops, something went wrong!",
  INCORRECT_AUTH: "Incorrect email or password",
  DEFAULT_ERROR:
    "Sorry, there are several failure in the server, please try again later.",

  // MIDDLEWARE
  MIDDLEWARE_API_KEY_UNAUTHENTICATED:
    "Sorry, you have no access to this server.",
  MIDDLEWARE_AUTHORIZATION_UNAUTHENTICATED: "Unauthorized, please login.",

  // USER
  USER_NOT_FOUND: "User not found.",
  USER_EMAIL_EXIST:
    "Email address already used, please try with another email.",
  USER_CREATE_FAILED: "User create failed, please try again.",

  // TOKEN
  TOKEN_NOT_FOUND: "Token not found.",

  // AUTH
  AUTH_USER_NOT_FOUND: "Email is not registered, please register first.",
  AUTH_REFRESH_UNAUTHORIZED: "Unauthorized, please login.",
};
