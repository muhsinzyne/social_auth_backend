import jwt, { VerifyTokenResponses } from "../library/jwt";
import { ERRORS } from "../utils/constants";
import { Request, Response, NextFunction } from "express";

const verifyJWT = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader?.startsWith("Bearer ")) {
    res
      .status(ERRORS.UNAUTHORIZED.code)
      .json({ succes: false, error: ERRORS.UNAUTHORIZED.message });
  } else {
    const token = authHeader?.split(" ")[1];
    try {
      const { status, tokenDetails } = (await jwt.verifyAccessToken(
        token
      )) as VerifyTokenResponses;
      if (status && tokenDetails) {
        req.user = tokenDetails;
        next();
      }
    } catch (error) {
      console.error(error);
      res
        .status(error.statusCode)
        .json({ status: false, error: error.message });
    }
  }
};

export default verifyJWT;
