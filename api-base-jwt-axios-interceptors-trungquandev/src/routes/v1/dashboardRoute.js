// Author: TrungQuanDev: https://youtube.com/@trungquandev
import express from "express";
import { dashboardController } from "~/controllers/dashboardController";
import { authMiddeware } from "~/middlewares/authMiddleware";
const Router = express.Router();

Router.route("/access").get(
  authMiddeware.isAuthorized,
  dashboardController.access
);

export const dashboardRoute = Router;
