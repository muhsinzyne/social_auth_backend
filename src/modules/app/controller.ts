import { App } from "../../config/models/app.model";
import { AppServiceType } from "./types";
import { v4 as uuidv4 } from "uuid";
import { ERRORS } from "../../utils/constants";
import { CustomError } from "../../helpers/customError";

const { INTERNAL_SERVER, APP_ID_NOT_FOUND } = ERRORS;

const AppController = () =>
  ({
    getAllApps: async (user) => {
      try {
        const apps = await App.findAll({ where: { userId: user.id } });

        return apps;
      } catch (e) {
        console.error(e);
        throw new Error(e.message || INTERNAL_SERVER);
      }
    },
    getSingleApp: async (data) => {
      try {
        const { appId } = data;
        const app = await App.findOne({ where: { appId } });

        if (!app)
          throw new CustomError(
            APP_ID_NOT_FOUND.message,
            APP_ID_NOT_FOUND.code
          );

        return app;
      } catch (e) {
        console.error(e);
        throw new Error(e.message || INTERNAL_SERVER);
      }
    },
    addApp: async (data, user) => {
      const { appId, ...rest } = data;

      try {
        if (appId) {
          const app = await App.findOne({ where: { appId } });

          await app.update(rest);
          return { appId };
        }

        const generatedAppId = uuidv4();
        if (generatedAppId) {
          data["appId"] = generatedAppId;
          data["userId"] = user.id.toString();
          const createdApp = await App.create(data);
          return { appId: createdApp.appId };
        } else {
          throw new CustomError(
            APP_ID_NOT_FOUND.message,
            APP_ID_NOT_FOUND.code
          );
        }
      } catch (e) {
        console.error(e);
        throw new Error(e.message || INTERNAL_SERVER);
      }
    },
    updateApp: async (data) => {
      try {
        const { appId, ...rest } = data;
        const app = await App.findOne({ where: { appId } });

        if (!app)
          throw new CustomError(
            APP_ID_NOT_FOUND.message,
            APP_ID_NOT_FOUND.code
          );

        await app.update(rest);
      } catch (e) {
        console.error(e);
        throw new Error(e.message || INTERNAL_SERVER);
      }
    },
    deleteApp: async (data) => {
      try {
        const { appId } = data;
        const app = await App.findOne({ where: { appId } });

        if (!app)
          throw new CustomError(
            APP_ID_NOT_FOUND.message,
            APP_ID_NOT_FOUND.code
          );

        await App.destroy({ where: { appId } });
      } catch (e) {
        console.error(e);
        throw new Error(e.message || INTERNAL_SERVER);
      }
    },
    getAllAppsFiltered: async (data) => {
      try {
        const { page, itemsPerPage } = data;

        const filteredApps =
          itemsPerPage !== -1
            ? await App.findAll({
                limit: itemsPerPage,
                offset: (page - 1) * itemsPerPage,
              })
            : await App.findAll();

        const count = await App.count();

        return {
          apps: filteredApps,
          count,
        };
      } catch (e) {
        console.error(e);
        throw new Error(e.message || INTERNAL_SERVER);
      }
    },
  } as AppServiceType);

export default AppController;
