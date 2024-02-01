import { sequelize } from "./connection";
import { initAppModel } from "./models/app.model";
import { initJwtModel } from "./models/jwt.model";
import { initUserModel } from "./models/user.model";

const initModels = () => {
  // Initialize models here
  initUserModel(sequelize);
  initJwtModel(sequelize);
  initAppModel(sequelize);
  console.log("Models setup completed");
};

export { initModels };
