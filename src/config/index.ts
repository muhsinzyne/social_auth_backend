import { sequelize } from "./connection";
import { initUserModel } from "./models/user.model";

const initModels = () => {
  // Initialize models here
  initUserModel(sequelize);
  console.log("Models setup completed");
};

export { initModels };
