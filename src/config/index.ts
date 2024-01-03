import { sequelize } from "./connection";
import { initJwtModel } from "./models/jwt.model";
import { initUserModel } from "./models/user.model";

const initModels = () => {
  // Initialize models here
  initUserModel(sequelize);
  initJwtModel(sequelize);
  console.log("Models setup completed");
};

export { initModels };
