import { Application } from "express";

import TriggerValidator from "./validator";
import TriggerController from "./controller";
import { responseHandler } from "../../helpers/HTTPRequestHandler";

import passport from "../../library/passport";
import { PROVIDERS, RESPONSE_TYPES } from "../../utils/constants";

export const AuthRoutes = (app: Application) => {
  const Validator = TriggerValidator();
  const Controller = TriggerController();

  app.post(
    "/api/auth/user/registration",
    responseHandler({
      validator: Validator.registration,
      controller: Controller.registration,
      props: (req) => [req.body],
    })
  );

  app.post(
    "/api/auth/user/login",
    responseHandler({
      validator: Validator.logIn,
      controller: Controller.logIn,
      props: (req, res) => [req.body, res],
    })
  );

  app.get(
    "/api/auth/token/refresh",
    responseHandler({
      validator: Validator.refresh,
      controller: Controller.refresh,
      props: (req) => [req.cookies],
    })
  );

  app.get(
    "/auth/google",
    responseHandler({
      controller: Controller.googleAuth,
      responseType: RESPONSE_TYPES.NULL,
      props: (req, res, next) => [req, res, next],
    })
  );

  app.get(
    "/auth/google/callback",
    responseHandler({
      controller: Controller.googleCallback,
      responseType: RESPONSE_TYPES.REDIRECT,
      props: (req, res, next) => [req, res, next],
    })
  );

  app.post(
    "/api/auth/user/logout",
    responseHandler({
      validator: Validator.logout,
      controller: Controller.logout,
      props: (req, res) => [req.cookies, res],
    })
  );
};
