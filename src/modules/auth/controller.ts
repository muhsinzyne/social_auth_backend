import { User } from "../../config/models/user.model";
import Bcrypt from "../../library/bcrypt";
import JWT from "../../library/jwt";
import { ERRORS } from "../../utils/constants";
import { AuthServiceType } from "./types";

const { INTERNAL_SERVER } = ERRORS;

const AuthController = () =>
  ({
    logIn: async (data, res) => {
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

        // storing refresh token on headers
        res.cookie("jwt", refreshToken, {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 24 * 60 * 60 * 1000,
        });

        return {
          accessToken,
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
    logout: async (cookies, res) => {
      const { jwt } = cookies;

      if (!jwt) throw new Error(ERRORS.UNAUTHORIZED.message);

      // removing token document from the db
      await JWT.removeTokenDocFromDB(jwt);

      // clearing refresh token from the header
      res.clearCookie("jwt", {
        httpOnly: true,
        sameSite: "None",
        secure: true,
      });
    },
  } as AuthServiceType);

export default AuthController;
