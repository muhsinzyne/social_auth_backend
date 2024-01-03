import { User } from "../../config/models/user.model";

export interface UserServiceType {
  logIn: (data: AddUserDataType) => any;
  getAllUsers: () => Promise<User[]>;
  getSingleUser: (params: any) => any;
  addUser: (data: AddUserDataType) => Promise<void>;
  updateUsers: () => any;
  updateSingleUser: () => any;
  deleteUser: () => any;
}

export interface AddUserDataType {
  email: string;
  password: string;
}
