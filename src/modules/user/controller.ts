import { User } from "../../config/models/user.model";
import { ERRORS } from "../../utils/constants";
import { UserControllerType } from "./types";

const { INTERNAL_SERVER } = ERRORS;

const UserController = () =>
  ({
    getAllUsers: async () => {
      try {
        const users = await User.findAll();
        return users;
      } catch (e) {
        console.log(e);
        return e;
      }
    },
    getSingleUser: async (params) => {
      if (params && params.id) {
        try {
          const user = await User.findOne({ where: { id: params.id } });
          return { success: true, data: user };
        } catch (e) {
          console.error(e);
          return {
            success: false,
            error: e.message || INTERNAL_SERVER.message,
          };
        }
      } else {
        return {
          success: false,
          error: "userId not found",
        };
      }
    },
    addUser: () => {},
    updateUsers: () => {},
    updateSingleUser: () => {},
    deleteUser: () => {},
  } as UserControllerType);

export default UserController;
