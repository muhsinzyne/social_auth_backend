import { Application } from "express";

import TriggerValidator from "./validator";
import TriggerController from "./controller";
import { responseHandler } from "../../helpers/HTTPRequestHandler";
import verifyJWT from "../../helpers/verifyJWT";

export const AppRoutes = (app: Application) => {
  const Validator = TriggerValidator();
  const Controller = TriggerController();

  app.use(verifyJWT);

  app.get(
    "/api/app",
    responseHandler({
      validator: Validator.getAllApps,
      controller: Controller.getAllApps,
      props: (req) => [req.user],
    })
  );

  app.post(
    "/api/app",
    responseHandler({
      validator: Validator.addApp,
      controller: Controller.addApp,
      props: (req) => [req.body, req.user],
    })
  );

  app.put(
    "/api/app",
    responseHandler({
      validator: Validator.updateApp,
      controller: Controller.updateApp,
      props: (req) => [req.body],
    })
  );
};
