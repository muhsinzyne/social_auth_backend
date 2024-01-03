import { Application } from "express";

import TriggerValidator from "./validator";
import TriggerController from "./controller";
import { responseHandler } from "../../helpers/HTTPRequestHandler";

export const UserRoutes = (app: Application) => {
  const Validator = TriggerValidator();
  const Controller = TriggerController();

  app.post(
    "/api/user/login",
    responseHandler({
      validator: Validator.logIn,
      controller: Controller.logIn,
      props: (req) => [req.body],
    })
  );

  // app.get(
  //   "/api/user",
  //   responseHandler({
  //     controller: Controller.getAllUsers,
  //   })
  // );

  app.get("/api/user:id", Controller.getSingleUser);

  app.post(
    "/api/user",
    responseHandler({
      validator: Validator.addUser,
      controller: Controller.addUser,
      props: (req) => [req.body],
    })
  );

  app.put("/api/user", Controller.updateUsers);

  app.patch("/api/user", Controller.updateSingleUser);

  app.delete("/api/user:id", Controller.deleteUser);
};
