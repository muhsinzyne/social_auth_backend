import { NextFunction, Request, Response } from "express";
import { ERRORS, RESPONSE_TYPES } from "../utils/constants";

const { INTERNAL_SERVER } = ERRORS;

interface ResponseHandlerParams<T = any> {
  validator?: (...args: any[]) => Promise<T>;
  controller: (...args: any[]) => Promise<T>;
  responseType?: string;
  props?: (req: Request, res: Response, next: NextFunction) => any[];
}

export const responseHandler =
  ({
    validator,
    controller,
    responseType = "json",
    props,
  }: ResponseHandlerParams): ((
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate
      if (validator) {
        await validator(...(props ? props(req, res, next) : []));
      }

      // Execute the controller
      const data = await controller(...(props ? props(req, res, next) : []));

      // Handle the response based on responseType
      switch (responseType) {
        case RESPONSE_TYPES.JSON:
          res.json({ success: true, data });
          break;

        case RESPONSE_TYPES.REDIRECT:
          res.redirect(data.url);
          break;

        default:
          break;
      }
    } catch (e) {
      console.error(e);
      res
        .status(e.statusCode || INTERNAL_SERVER.code)
        .json({ success: false, error: e.message || INTERNAL_SERVER.message });
    }
  };
