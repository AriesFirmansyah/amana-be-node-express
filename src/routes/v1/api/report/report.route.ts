import express from "express";
import reportController from "@controllers/api/report.controller";
import middlewares from "@middlewares/index";
import schemas from "@schemas/index";
import { Role } from "@prisma/client";

const router = express.Router();

router.use(middlewares.auth);

router.get("/summary", reportController.summary);

router
  .route("/")
  .get(
    middlewares.validate(schemas.api.report.index),
    reportController.index,
  )
  .post(
    middlewares.role([Role.REPORTER]),
    middlewares.validate(schemas.api.report.store),
    reportController.store,
  );

router
  .route("/:id")
  .get(
    middlewares.validate(schemas.api.report.detail),
    reportController.detail,
  )
  .put(
    middlewares.validate(schemas.api.report.update),
    reportController.update,
  )
  .patch(
    middlewares.validate(schemas.api.report.update),
    reportController.update,
  )
  .delete(
    middlewares.role([Role.REPORTER]),
    middlewares.validate(schemas.api.report.remove),
    reportController.remove,
  );

router.patch(
  "/:id/submit",
  middlewares.role([Role.REPORTER]),
  middlewares.validate(schemas.api.report.detail),
  reportController.submit,
);

export default router;
