import { AppAttributes } from "../../config/models/app.model";
import { UserAttributes } from "../../config/models/user.model";

interface AddAppCreds {
  appName: string;
  organization: string;
  source: string;
}

export interface AppServiceType {
  getAllApps: (user: Partial<UserAttributes>) => Promise<Array<AppAttributes>>;
  addApp: (data: AddAppCreds, user: Partial<UserAttributes>) => Promise<void>;
}
