import authController from "@controllers/api/auth.controller";
import middlewares from "@middlewares/index";
import schemas from "@schemas/index";
import express from "express";

const router = express.Router();

router.post(
  "/login",
  middlewares.validate(schemas.api.auth.login),
  authController.login,
);
router.post(
  "/logout",
  authController.logout,
);
router.post(
  "/register",
  middlewares.validate(schemas.api.auth.register),
  authController.register,
);

export default router;
