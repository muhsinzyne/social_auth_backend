import { NextFunction } from "express";
import { User } from "../../config/models/user.model";

interface Cookie {
  cookie(name: string, value: string, options?: any): any;
}

interface CustomResponseLogin extends Response {
  cookie(name: string, value: string, options?: any): any;
}

interface CustomResponseLogout extends Response {
  clearCookie(name: string, options?: any): any;
}

interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface AuthServiceType {
  registration: (data: AddUserDataType) => Promise<void>;
  logIn: (
    data: AddUserDataType,
    res: CustomResponseLogin
  ) => Promise<LoginResponse>;
  refresh: (cookies: { jwt: string }) => Promise<{ accessToken: string }>;
  googleAuth: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<void>;
  googleCallback: (
    req: Request & { login: any },
    res: Response & Cookie,
    next: NextFunction
  ) => Promise<{ url: string }>;
  logout: (
    cookies: { jwt: string },
    res: CustomResponseLogout
  ) => Promise<void>;
}

export interface AddUserDataType {
  email: string;
  password: string;
}
