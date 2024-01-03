// jwt.model.ts
import { DataTypes, Model, Sequelize } from "sequelize";

interface JWTAttributes {
  userId: number;
  token: string;
}

class Jwt extends Model<JWTAttributes> implements JWTAttributes {
  public userId!: number;
  public token!: string;
}

const initJwtModel = (sequelize: Sequelize) => {
  Jwt.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "Jwt",
    }
  );
};

export { Jwt, initJwtModel };
