import authService from "./auth/index.service";
import tokenService from "./token/index.service";
import userService from "./user/index.service";
import reportService from "./report/index.service";

export default {
  user: userService,
  auth: authService,
  token: tokenService,
  report: reportService,
};
