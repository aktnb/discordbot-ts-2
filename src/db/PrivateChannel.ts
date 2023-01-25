import { InferAttributes, InferCreationAttributes, DataTypes, Model, CreationOptional } from "sequelize";
import { sequelize } from "./config";

class PrivateChannel extends Model<InferAttributes<PrivateChannel>, InferCreationAttributes<PrivateChannel>> {
  declare id: CreationOptional<number>;
  declare once: CreationOptional<boolean>;
  declare roleId: string|null;
  declare textchannelId: string|null;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

PrivateChannel.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  once: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  roleId: {
    type: DataTypes.STRING(24),
    allowNull: true,
  },
  textchannelId: {
    type: DataTypes.STRING(24),
    allowNull: true,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  tableName: "privatechannels",
  version: true
});

export { PrivateChannel };
