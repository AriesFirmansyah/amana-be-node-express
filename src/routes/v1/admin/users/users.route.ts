import usersController from "@controllers/admin/users.controller";
import middlewares from "@middlewares/index";
import { Role } from "@prisma/client";
import schemas from "@schemas/index";
import express from "express";

const router = express.Router();

router.use(middlewares.auth);
router.use(middlewares.role([Role.ADMIN]));

router
  .route("/")
  .get(
    middlewares.validate(schemas.admin.users.index),
    usersController.index,
  );

export default router;
