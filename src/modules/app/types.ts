import { AppAttributes } from "../../config/models/app.model";
import { UserAttributes } from "../../config/models/user.model";

interface GetAllAppsFiltered {
  apps: Array<AppAttributes> | Partial<Array<AppAttributes>>;
  count: number;
}

export interface AppServiceType {
  getAllApps: (user: Partial<UserAttributes>) => Promise<Array<AppAttributes>>;
  getSingleApp: (data: { appId: string }) => Promise<AppAttributes>;
  addApp: (
    data: Partial<AppAttributes>,
    user: Partial<UserAttributes>
  ) => Promise<{ appId: string }>;
  updateApp: (data: Partial<AppAttributes>) => Promise<void>;
  deleteApp: (data: { appId: string }) => Promise<void>;
  getAllAppsFiltered: (data: {
    page: number;
    itemsPerPage: number;
  }) => Promise<GetAllAppsFiltered>;
}
