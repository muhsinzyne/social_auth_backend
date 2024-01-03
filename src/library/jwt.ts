import jwt from "jsonwebtoken";
import { Jwt } from "../config/models/jwt.model";
import { UserAttributes } from "../config/models/user.model";

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

  verifyRefreshToken() {}
}

export default new JWT();
