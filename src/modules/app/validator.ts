import { ERRORS } from "../../utils/constants";
import { AppServiceType } from "./types";

// Validating incoming data
const UserValidator = () =>
  ({
    getAllApps: (user) => {
      if (!user || !user.id) return Promise.reject(ERRORS.INVALID_CREDS);
      return Promise.resolve();
    },
    getSingleApp: (data) => {
      if (!data || !data.appId) return Promise.reject(ERRORS.INVALID_CREDS);
      return Promise.resolve();
    },
    addApp: (data, user) => {
      const validKeys = [
        "appName",
        "organization",
        "source",
        "domain",
        "step",
        "appId",
      ];
      if (
        !user ||
        !user.id ||
        !data ||
        !Object.keys(data).every((key) => validKeys.includes(key))
      )
        return Promise.reject(ERRORS.INVALID_CREDS);
      return Promise.resolve();
    },
    updateApp: (data) => {
      const validKeys = ["appId", "appName"];
      if (!data || !Object.keys(data).every((key) => validKeys.includes(key)))
        return Promise.reject(ERRORS.INVALID_CREDS);
      return Promise.resolve();
    },
    deleteApp: (data) => {
      if (!data || !data.appId) return Promise.reject(ERRORS.INVALID_CREDS);
      return Promise.resolve();
    },
    getAllAppsFiltered: (data) => {
      if (!data || !data.page || !data.itemsPerPage)
        return Promise.reject(ERRORS.INVALID_CREDS);
      return Promise.resolve();
    },
  } as AppServiceType);

export default UserValidator;
