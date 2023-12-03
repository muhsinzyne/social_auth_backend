import { User } from "../../config/models/user.model";

export interface UserControllerType {
  getAllUsers: () => Promise<User[]>;
  getSingleUser: (params: any) => any;
  addUser: () => any;
  updateUsers: () => any;
  updateSingleUser: () => any;
  deleteUser: () => any;
}
