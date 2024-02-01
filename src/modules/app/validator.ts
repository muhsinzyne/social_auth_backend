import { ERRORS } from "../../utils/constants";
import { AppServiceType } from "./types";

// Validating incoming data
const UserValidator = () =>
  ({
    getAllApps: (user) => {
      if (!user || !user.id) return Promise.reject(ERRORS.INVALID_CREDS);
      return Promise.resolve();
    },
    addApp: (data, user) => {
      if (
        !data ||
        !data.appName ||
        !data.organization ||
        !data.source ||
        !user ||
        !user.id
      )
        return Promise.reject(ERRORS.INVALID_CREDS);
      return Promise.resolve();
    },
  } as AppServiceType);

export default UserValidator;
