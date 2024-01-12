import jwt from "jsonwebtoken";
import { Jwt } from "../config/models/jwt.model";
import { User, UserAttributes } from "../config/models/user.model";
import { ERRORS } from "../utils/constants";
import { CustomError } from "../helpers/customError";

export interface VerifyTokenResponses {
  status: boolean;
  tokenDetails: jwt.JwtPayload;
}

class JWT {
  accessKey: string;
  refreshKey: string;
  constructor() {
    this.accessKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    this.refreshKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
  }

  async genarateTokens(user: Partial<UserAttributes>): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      const payload = {
        id: user.id,
        email: user.email,
      };
      const accessToken = jwt.sign(payload, this.accessKey, {
        expiresIn: "14m",
      });
      const refreshToken = jwt.sign(payload, this.refreshKey, {
        expiresIn: "30d",
      });

      const userToken = await Jwt.findOne({ where: { userId: user.id } });

      if (userToken) await Jwt.destroy({ where: { userId: user.id } });

      await Jwt.create({ userId: user.id, token: refreshToken });

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      console.error(error);
    }
  }

  async verifyAccessToken(token: string): Promise<VerifyTokenResponses | void> {
    return jwt.verify(token, this.accessKey, (err, tokenDetails) => {
      if (err)
        if (err.name === "TokenExpiredError") {
          throw new CustomError(
            ERRORS.INVALID_TOKEN.ACCESS.expired,
            ERRORS.INVALID_TOKEN.code
          );
        } else {
          throw new CustomError(
            ERRORS.INVALID_TOKEN.ACCESS.message,
            ERRORS.INVALID_TOKEN.code
          );
        }

      return {
        status: true,
        tokenDetails,
      };
    });
  }

  async verifyRefreshToken(
    token: string
  ): Promise<VerifyTokenResponses | void> {
    try {
      const tokenDetails = await Jwt.findOne({ where: { token } });

      if (!tokenDetails) throw new Error(ERRORS.INVALID_TOKEN.REFRESH.message);

      return jwt.verify(token, this.refreshKey, (err, tokenDetails) => {
        if (err) {
          if (err.name === "TokenExpiredError") {
            throw new CustomError(
              ERRORS.INVALID_TOKEN.REFRESH.expired,
              ERRORS.INVALID_TOKEN.code
            );
          } else {
            throw new CustomError(
              ERRORS.INVALID_TOKEN.REFRESH.message,
              ERRORS.INVALID_TOKEN.code
            );
          }
        }

        return {
          status: true,
          tokenDetails,
        };
      });
    } catch (error) {
      console.error(error);
      throw new CustomError(
        error.message || ERRORS.INTERNAL_SERVER.message,
        error.statusCode || ERRORS.INTERNAL_SERVER.code
      );
    }
  }

  async generateNewAccessToken(
    tokenDetails: jwt.JwtPayload
  ): Promise<{ accessToken: string }> {
    try {
      if (tokenDetails && tokenDetails.email) {
        const user = await User.findOne({
          where: { email: tokenDetails.email },
        });

        if (!user) throw new Error(ERRORS.UNAUTHORIZED.message);

        const payload = {
          id: user.id,
          email: user.email,
        };

        const accessToken = jwt.sign(payload, this.accessKey, {
          expiresIn: "14m",
        });

        return {
          accessToken,
        };
      }
    } catch (error) {
      console.error(error);
    }
  }

  async removeTokenDocFromDB(token: string): Promise<void> {
    try {
      await Jwt.destroy({ where: { token } });
    } catch (error) {
      console.error(error);
    }
  }
}

export default new JWT();
