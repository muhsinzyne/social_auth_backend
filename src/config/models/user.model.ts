// user.model.ts
import { DataTypes, Model, Sequelize } from "sequelize";

export interface UserAttributes {
  id?: number;
  // usernsame: string;
  email: string;
  password: string;
}

class User extends Model<UserAttributes> implements UserAttributes {
  public id!: number;
  // public username!: string;
  public email!: string;
  public password!: string;
}

const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      // username: {
      //   type: DataTypes.STRING,
      //   allowNull: false,
      // },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
};

export { User, initUserModel };
