import jwt from "jsonwebtoken";
import { Jwt } from "../config/models/jwt.model";
import { User, UserAttributes } from "../config/models/user.model";
import { ERRORS } from "../utils/constants";

export interface VerifyTokenResponses {
  status: boolean;
  tokenDetails: string | jwt.JwtPayload;
}

class JWT {
  accessKey: string;
  refreshKey: string;
  constructor() {
    this.accessKey = process.env.ACCESS_TOKEN_PRIVATE_KEY;
    this.refreshKey = process.env.REFRESH_TOKEN_PRIVATE_KEY;
  }

  async genarateTokens(user: UserAttributes): Promise<{
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
    // try {
    return jwt.verify(token, this.accessKey, (err, tokenDetails) => {
      if (err)
        if (err.name === "TokenExpiredError") {
          throw new Error(ERRORS.INVALID_TOKEN.ACCESS.expired);
        } else {
          throw new Error(ERRORS.INVALID_TOKEN.ACCESS.message);
        }

      return {
        status: true,
        tokenDetails,
      };
    });

    //   const tokenDetails = jwt.verify(token, this.accessKey);
    //   return {
    //     status: true,
    //     tokenDetails,
    //   };
    // } catch (error) {
    //   console.error(error);
    // }
  }

  async verifyRefreshToken(
    token: string
  ): Promise<VerifyTokenResponses | void> {
    try {
      const tokenDetails = await Jwt.findOne({ where: { token } });

      if (!tokenDetails) throw new Error(ERRORS.INVALID_TOKEN.REFRESH.message);

      jwt.verify(token, this.refreshKey, (err, tokenDetails) => {
        if (err) throw new Error(ERRORS.INVALID_TOKEN.REFRESH.message);

        return {
          status: true,
          tokenDetails,
        };
      });
    } catch (error) {
      console.error(error);
    }
  }

  async generateNewAccessToken(
    tokenDetails: Partial<UserAttributes>
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
