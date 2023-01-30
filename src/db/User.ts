import { InferAttributes, InferCreationAttributes, DataTypes, Model, CreationOptional } from "sequelize";
import { sequelize } from "./config";

class User extends Model<InferAttributes<User>, InferCreationAttributes<User>> {
  declare userId: string;
  declare privatechannelId: CreationOptional<number|null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

User.init({
  userId: {
    type: DataTypes.STRING(24),
    primaryKey: true
  },
  privatechannelId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  tableName: "users",
  version: true,
});

export { User };
