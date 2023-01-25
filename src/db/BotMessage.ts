import { InferAttributes, InferCreationAttributes, DataTypes, Model, CreationOptional } from "sequelize";
import { sequelize } from "./config";

class BotMessage extends Model<InferAttributes<BotMessage>, InferCreationAttributes<BotMessage>> {
  declare id: CreationOptional<number>;
  declare key: string;
  declare content: CreationOptional<string|null>;
  declare url: CreationOptional<string|null>;
  declare enable: CreationOptional<boolean>;
  declare creatorId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

BotMessage.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  key: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  url: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
  enable: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  creatorId: {
    type: DataTypes.STRING(24),
    allowNull: false,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  tableName: "botmessages",
  version: true,
});

export { BotMessage };