import { InferAttributes, InferCreationAttributes, DataTypes, Model, CreationOptional } from "sequelize";
import { sequelize } from "./config";

class NoticeSetting extends Model<InferAttributes<NoticeSetting>, InferCreationAttributes<NoticeSetting>> {
  declare id: CreationOptional<number>;
  declare voicechannelId: string;
  declare memberId: string;
  declare all: CreationOptional<boolean>;
  declare self: CreationOptional<boolean>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

NoticeSetting.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  voicechannelId: {
    type: DataTypes.STRING(24),
    allowNull: false,
  },
  memberId: {
    type: DataTypes.STRING(24),
    allowNull: false,
  },
  all: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  self: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  tableName: "noticesettings",
  version: true
});

export { NoticeSetting };
