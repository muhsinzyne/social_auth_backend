import { User } from "../../config/models/user.model";

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
  logIn: (
    data: AddUserDataType,
    res: CustomResponseLogin
  ) => Promise<LoginResponse>;
  logout: (
    cookies: { jwt: string },
    res: CustomResponseLogout
  ) => Promise<void>;
}

export interface AddUserDataType {
  email: string;
  password: string;
}
