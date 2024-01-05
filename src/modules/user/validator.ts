import { ERRORS } from "../../utils/constants";
import { UserServiceType } from "./types";

// Validating incoming data
const UserValidator = () =>
  ({
    getAllUsers: async () => {
      return [];
    },
    getSingleUser: async (params) => {
      Promise.resolve();
    },
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
