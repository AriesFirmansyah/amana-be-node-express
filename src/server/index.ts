/// <reference path="../interfaces/express.d.ts" />
import "./polyfill";
import { Server, createServer } from "http";

import app from "./app";
import connect from "./connections";

const init = () => {
  const server: Server = createServer(app);
  connect(server);
};

init();
