import { ERRORS } from "../../utils/constants";
import { AuthServiceType } from "./types";

// Validating incoming data
const AuthValidator = () =>
  ({
    logIn: (data, res) => {
      if (!res || !data || !data.email || !data.password)
        return Promise.reject(ERRORS.INVALID_CREDS);
      return Promise.resolve();
    },
    logout: (cookies, res) => {
      if (!cookies || !cookies.jwt || !res)
        return Promise.reject(ERRORS.INVALID_CREDS);
      return Promise.resolve();
    },
  } as AuthServiceType);

export default AuthValidator;
