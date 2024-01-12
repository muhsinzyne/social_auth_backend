import { User, UserAttributes } from "../../config/models/user.model";
import { CustomError } from "../../helpers/customError";
import Bcrypt from "../../library/bcrypt";
import JWT, { VerifyTokenResponses } from "../../library/jwt";
import { ERRORS, PROVIDERS } from "../../utils/constants";
import { AuthServiceType } from "./types";
import passport from "../../library/passport";

const { INTERNAL_SERVER } = ERRORS;

const AuthController = () =>
  ({
    registration: async (data) => {
      const { email, password } = data;
      try {
        await User.create({ email, password });
      } catch (e) {
        console.error(e);
        throw new Error(e.message || INTERNAL_SERVER);
      }
    },
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
          sameSite: "strict",
          secure: false,
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
    refresh: async (cookies) => {
      const { jwt } = cookies;

      try {
        // verifying refresh token
        const { status, tokenDetails } = (await JWT.verifyRefreshToken(
          jwt
        )) as VerifyTokenResponses;
        if (status && tokenDetails) {
          // fetching new access token
          const { accessToken } = await JWT.generateNewAccessToken(
            tokenDetails
          );

          return {
            accessToken,
          };
        }
      } catch (e) {
        console.error(e);
        throw new CustomError(
          e.message || INTERNAL_SERVER.message,
          e.statusCode || INTERNAL_SERVER.code
        );
      }
    },
    googleAuth: (req, res, next) => {
      return passport.authenticate(PROVIDERS.GOOGLE.name, {
        scope: PROVIDERS.GOOGLE.scope,
      })(req, res, next);
    },

    googleCallback: async (req, res, next) => {
      return new Promise((resolve, reject) => {
        passport.authenticate(
          PROVIDERS.GOOGLE.name,
          (err: any, user: Partial<UserAttributes>, info: any) => {
            if (err) {
              console.error(err);
              return reject(err);
            }
            if (!user) {
              // Handle failed authentication
              resolve({
                url: PROVIDERS.GOOGLE.failUrl,
              });
            }

            // Manually log in the user
            req.login(user, async (loginErr) => {
              if (loginErr) {
                console.error(loginErr);
                return reject(loginErr);
              }

              try {
                // Generating tokens
                const { accessToken, refreshToken } = await JWT.genarateTokens(
                  user
                );

                // Storing refresh token on headers
                res.cookie("jwt", refreshToken, {
                  httpOnly: true,
                  sameSite: "strict",
                  secure: false,
                  maxAge: 24 * 60 * 60 * 1000,
                });

                // Storing access token on headers
                res.cookie("token", accessToken, {
                  httpOnly: false,
                  sameSite: "strict",
                  secure: false,
                  maxAge: 24 * 60 * 60 * 1000,
                });

                resolve({
                  url: PROVIDERS.GOOGLE.successUrl,
                });
              } catch (e) {
                console.error(e);
                reject(new Error(e.message || INTERNAL_SERVER));
              }
            });
          }
        )(req, res, next);
      });
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
