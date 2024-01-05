import { Application } from "express";

import TriggerValidator from "./validator";
import TriggerController from "./controller";
import { responseHandler } from "../../helpers/HTTPRequestHandler";

export const AuthRoutes = (app: Application) => {
  const Validator = TriggerValidator();
  const Controller = TriggerController();

  app.post(
    "/api/user/login",
    responseHandler({
      validator: Validator.logIn,
      controller: Controller.logIn,
      props: (req, res) => [req.body, res],
    })
  );

  app.post(
    "/api/user/logout",
    responseHandler({
      validator: Validator.logout,
      controller: Controller.logout,
      props: (req, res) => [req.cookies, res],
    })
  );
};
