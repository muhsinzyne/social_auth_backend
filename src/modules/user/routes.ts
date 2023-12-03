import { Application } from "express";

import TriggerController from "./controller";
import { responseHandler } from "../../helpers/HTTPRequestHandler";

export const UserRoutes = (app: Application) => {
  const Controller = TriggerController();

  app.get(
    "/api/user",
    responseHandler({
      controller: Controller.getAllUsers,
    })
  );

  app.get("/api/user:id", Controller.getSingleUser);

  app.post("/api/user", Controller.addUser);

  app.put("/api/user", Controller.updateUsers);

  app.patch("/api/user", Controller.updateSingleUser);

  app.delete("/api/user:id", Controller.deleteUser);
};
