import express from "express";

import middlewares from "@middlewares/index";
import userController from "@controllers/api/user.controller";

const router = express.Router();

router.use(middlewares.auth);

router.route("/").get(userController.index);

export default router;
