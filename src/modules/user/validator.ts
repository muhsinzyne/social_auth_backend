import { ERRORS } from "../../utils/constants";
import { UserServiceType } from "./types";

// Validating incoming data
const UserValidator = () =>
  ({
    getAllUsers: async () => {
      try {
        return [];
      } catch (e) {
        console.log(e);
        return e;
      }
    },
    getSingleUser: async (params) => {},
    addUser: (data) => {
      if (!data || !data.email || !data.password)
        return Promise.reject(ERRORS.INVALID_CREDS);
      return Promise.resolve();
    },
    updateUsers: () => {},
    updateSingleUser: () => {},
    deleteUser: () => {},
  } as UserServiceType);

export default UserValidator;
