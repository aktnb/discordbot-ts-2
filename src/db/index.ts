import { sequelize } from "./config";
import { BotMessage } from "./BotMessage";
import { User } from "./User";
import { Reminder } from "./Reminder";
import { PrivateChannel } from "./PrivateChannel";
import { Message } from "./Message";

export const dbInit = async () => {
  User.belongsTo(PrivateChannel, {
    foreignKey: "privatechannelId",
    targetKey: "id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    as: "PrivateChannel"
  });
  Reminder.belongsTo(User, {
    foreignKey: "userId",
    targetKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: "User"
  });
  BotMessage.belongsTo(User, {
    foreignKey: "creatorId",
    targetKey: "userId",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: "Creator"
  });
  Reminder.belongsTo(Message, {
    foreignKey: "messageId",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: "Message"
  });
  BotMessage.belongsTo(Message, {
    foreignKey: "messageId",
    targetKey: "id",
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
    as: "Message"
  });
  await sequelize.sync({ force: true });
};

export { sequelize, User, Message, Reminder, PrivateChannel, BotMessage };