import express from "express";

import userRoute from "./user/user.route";
import authRoute from "./auth/auth.route";
import reportRoute from "./report/report.route";

const router = express.Router();

router.use("/authentication", authRoute);
router.use("/profile", userRoute);
router.use("/reports", reportRoute);

export default router;
