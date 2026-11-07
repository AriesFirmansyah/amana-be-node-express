import { authMiddleware, roleMiddleware } from "./auth";
import { errorMiddleware } from "./error";
import { validateMiddleware } from "./validate";
import { xssMiddleware } from "./xss";

export default {
  auth: authMiddleware,
  role: roleMiddleware,
  error: errorMiddleware,
  validate: validateMiddleware,
  xss: xssMiddleware,
};
