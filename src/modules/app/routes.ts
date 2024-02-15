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

  app.get(
    "/api/app/:appId",
    responseHandler({
      validator: Validator.getSingleApp,
      controller: Controller.getSingleApp,
      props: (req) => [req.params],
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

  app.delete(
    "/api/app/:appId",
    responseHandler({
      validator: Validator.deleteApp,
      controller: Controller.deleteApp,
      props: (req) => [req.params],
    })
  );

  app.post(
    "/api/app/filtered",
    responseHandler({
      validator: Validator.getAllAppsFiltered,
      controller: Controller.getAllAppsFiltered,
      props: (req) => [req.body],
    })
  );
};
