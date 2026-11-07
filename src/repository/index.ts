import tokenRepository from "./token";
import userRepository from "./user";
import reportRepository from "./report";

export default {
  user: userRepository,
  token: tokenRepository,
  report: reportRepository,
};
