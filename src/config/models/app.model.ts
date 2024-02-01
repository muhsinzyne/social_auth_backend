// app.model.ts
import { DataTypes, Model, Sequelize } from "sequelize";

export interface AppAttributes {
  id: number;
  appId: string;
  appName: string;
  userId: string;
  organization: string;
  source: string;
}

class App extends Model<AppAttributes> implements AppAttributes {
  public id!: number;
  public appId!: string;
  public appName!: string;
  public userId!: string;
  public organization!: string;
  public source!: string;
}

const initAppModel = (sequelize: Sequelize) => {
  App.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      appId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      appName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      organization: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      source: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "appdetails",
    }
  );
};

export { App, initAppModel };
