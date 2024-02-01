import { User, UserAttributes } from "../../config/models/user.model";
import { CustomError } from "../../helpers/customError";
import Bcrypt from "../../library/bcrypt";
import JWT, { VerifyTokenResponses } from "../../library/jwt";
import { ERRORS, PROVIDERS } from "../../utils/constants";
import { AuthServiceType } from "./types";
import passport from "../../library/passport";
import NodeMailer from "../../library/nodemailer";

const { INTERNAL_SERVER } = ERRORS;

const AuthController = () =>
  ({
    registration: async (data) => {
      const { email, password } = data;

      try {
        const user = await User.findOne({
          where: { email },
        });

        if (user) {
          if (!user.password && user.googleId) {
            user.password = password;
            await user.save();
          }
        } else {
          await User.create({ email, password });
        }
      } catch (e) {
        console.error(e);
        throw new CustomError(
          e.message || INTERNAL_SERVER.message,
          e.statusCode || INTERNAL_SERVER.code
        );
      }
    },
    accountCheck: async (data) => {
      const { email, source } = data;
      try {
        const user = await User.findOne({
          where: { email },
        });

        // Allowing registration process if user doesn't exist
        if (!user)
          return {
            linkAccount: false,
            login: false,
          };

        // Allowing login process if user has already linked with the account
        if (user.password && user.googleId)
          return {
            linkAccount: false,
            login: true,
          };

        switch (source) {
          case "google":
            // Alerting the user if he already did a manual registration
            if (user.password && !user.googleId) {
              return {
                linkAccount: true,
                login: false,
              };
            }

            return {
              linkAccount: false,
              login: false,
            };

          case "manual":
            // Alerting the user if he already did a google registration
            if (!user.password && user.googleId) {
              return {
                linkAccount: true,
                login: false,
              };
            }

            if (user.password && !user.googleId) {
              throw new CustomError(
                ERRORS.DUPLIACTE_USER.message,
                ERRORS.DUPLIACTE_USER.code
              );
            }

          default:
            return;
        }
      } catch (e) {
        console.error(e);
        throw new CustomError(
          e.message || INTERNAL_SERVER.message,
          e.statusCode || INTERNAL_SERVER.code
        );
      }
    },
    logIn: async (data, res) => {
      const { email, password } = data;
      try {
        const user = await User.findOne({ where: { email } });

        // throwing user not found error
        if (!user)
          throw new CustomError(
            ERRORS.USER_NOT_FOUND.message,
            ERRORS.USER_NOT_FOUND.code
          );

        // comparing the incoming and existing password
        const status = await Bcrypt.compare(password, user.password);

        if (!status)
          throw new CustomError(
            ERRORS.INVALID_CREDS.message,
            ERRORS.INVALID_CREDS.code
          );

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
        throw new CustomError(
          e.message || INTERNAL_SERVER.message,
          e.statusCode || INTERNAL_SERVER.code
        );
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

                // Storing userId on headers
                res.cookie("userId", user.id.toString(), {
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
    authentication: async ({ jwt }) => {
      if (!jwt)
        throw new CustomError(
          ERRORS.INVALID_TOKEN.REFRESH.message,
          ERRORS.INVALID_TOKEN.code
        );

      try {
        await JWT.verifyRefreshToken(jwt);
        return {
          auth: true,
        };
      } catch (e) {
        console.error(e);
        throw new CustomError(
          e.message || INTERNAL_SERVER.message,
          e.statusCode || INTERNAL_SERVER.code
        );
      }
    },
    forgotPassword: async ({ email }) => {
      try {
        // Checking User
        const user = await User.findOne({ where: { email } });

        if (!user)
          throw new CustomError(
            ERRORS.USER_NOT_FOUND.message,
            ERRORS.USER_NOT_FOUND.code
          );

        const { accessToken } = await JWT.generateNewAccessToken(
          { email },
          "5m"
        );

        // Body for to mail
        const link = `${process.env.ORIGIN}/reset-password/${user.id}/${accessToken}`;

        const status = await NodeMailer.sendMail(email, link);

        if (status.mailSent)
          return {
            mailSent: true,
          };

        return {
          mailSent: false,
        };
      } catch (e) {
        console.error(e);
        throw new CustomError(
          e.message || INTERNAL_SERVER.message,
          e.statusCode || INTERNAL_SERVER.code
        );
      }
    },
    resetPassword: async (data) => {
      try {
        const { id, token, newPassword } = data;
        const user = await User.findOne({ where: { id } });

        if (!user)
          throw new CustomError(
            ERRORS.USER_NOT_FOUND.message,
            ERRORS.USER_NOT_FOUND.code
          );

        // Verifying the token from the link
        const { status, tokenDetails } = (await JWT.verifyAccessToken(
          token
        )) as VerifyTokenResponses;

        if (!(status && tokenDetails))
          throw new CustomError(
            ERRORS.INVALID_TOKEN.ACCESS.expired,
            ERRORS.INVALID_TOKEN.code
          );

        // Updating the user with new password
        user.password = newPassword;
        user.save();

        return {
          resetPassword: true,
        };
      } catch (e) {
        console.error(e);
        throw new CustomError(
          e.message || INTERNAL_SERVER.message,
          e.statusCode || INTERNAL_SERVER.code
        );
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
