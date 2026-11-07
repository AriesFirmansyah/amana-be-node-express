import express from "express";

import adminRoute from "./admin";
import apiRoute from "./api";

const router = express();

const defaultRoutes = [
  {
    path: "/api/v1",
    route: apiRoute,
  },
  {
    path: "/admin-api/v1",
    route: adminRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
