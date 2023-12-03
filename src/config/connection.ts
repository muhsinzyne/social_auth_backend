import { Sequelize } from "sequelize";
import { initModels } from ".";

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    port: 3306,
  }
);

const authenticate = () => {
  sequelize
    .authenticate()
    .then(() => {
      console.log(
        "Connection to the database has been established successfully."
      );
      initModels();
      return sequelize.sync();
      // Close the Sequelize connection
    })
    .catch((error) => {
      console.error("Unable to connect to the database:", error.message);
    });
};

export default { authenticate };
