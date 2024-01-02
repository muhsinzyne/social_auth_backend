import { Request, Response } from "express";
import { ERRORS } from "../utils/constants";

const { INTERNAL_SERVER } = ERRORS;

interface ResponseHandlerParams<T = any> {
  validator: (...args: any[]) => Promise<T>;
  controller: (...args: any[]) => Promise<T>;
  props?: (req: Request, res: Response) => any[];
}

export const responseHandler =
  ({
    validator,
    controller,
    props,
  }: ResponseHandlerParams): ((req: Request, res: Response) => Promise<void>) =>
  async (req: Request, res: Response): Promise<void> => {
    try {
      await validator(...(props ? props(req, res) : []));

      const data = await controller(...(props ? props(req, res) : []));

      res.json({ success: true, data });
    } catch (e) {
      console.error(e);
      res.json({ success: false, error: e.message || INTERNAL_SERVER.message });
    }
  };
