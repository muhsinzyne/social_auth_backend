import { User } from "../../config/models/user.model";
import Bcrypt from "../../library/bcrypt";
import JWT from "../../library/jwt";
import { ERRORS } from "../../utils/constants";
import { UserServiceType } from "./types";

const { INTERNAL_SERVER } = ERRORS;

const UserController = () =>
  ({
    logIn: async (data) => {
      const { email, password } = data;
      try {
        const user = await User.findOne({ where: { email } });

        // throwing user not found error
        if (!user) throw new Error(ERRORS.USER_NOT_FOUND.message);

        // comparing the incoming and existing password
        const status = await Bcrypt.compare(password, user.password);

        if (!status) throw new Error(ERRORS.INVALID_CREDS.message);

        //generating tokens
        const { accessToken, refreshToken } = await JWT.genarateTokens(user);

        return {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            email: user.email,
          },
        };
      } catch (e) {
        console.error(e);
        throw new Error(e.message || INTERNAL_SERVER);
      }
    },
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
    addUser: async (data) => {
      const { email, password } = data;
      try {
        await User.create({ email, password });
      } catch (e) {
        console.error(e);
        throw new Error(e.message || INTERNAL_SERVER);
      }
    },
    updateUsers: () => {},
    updateSingleUser: () => {},
    deleteUser: () => {},
  } as UserServiceType);

export default UserController;
