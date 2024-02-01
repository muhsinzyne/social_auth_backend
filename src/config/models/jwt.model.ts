// jwt.model.ts
import { DataTypes, Model, Sequelize } from "sequelize";

interface JWTAttributes {
  id: number;
  userId: number;
  token: string;
}

class Jwt extends Model<JWTAttributes> implements JWTAttributes {
  public id!: number;
  public userId!: number;
  public token!: string;
}

const initJwtModel = (sequelize: Sequelize) => {
  Jwt.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "jwtdetails",
    }
  );
};

export { Jwt, initJwtModel };
