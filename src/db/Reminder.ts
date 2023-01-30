import { CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model } from "sequelize";
import { sequelize } from "./config";

class Reminder extends Model<InferAttributes<Reminder>, InferCreationAttributes<Reminder>> {
  declare id: CreationOptional<number>;
  declare interval: string|null;
  declare triggerAt: Date;
  declare messageId: number;
  declare channelId: string;
  declare userId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Reminder.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  interval: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  triggerAt: {
    type: DataTypes.DATE,
    allowNull: false
  },
  messageId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  channelId: {
    type: DataTypes.STRING(24),
    allowNull: false
  },
  userId: {
    type: DataTypes.STRING(24),
    allowNull: false
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE
}, {
  sequelize, 
  tableName: "reminders",
  version: true
});

export { Reminder };