import { sequelize } from "./config";
import { BotMessage } from "./BotMessage";
import { Member } from "./Member";
import { PrivateChannel } from "./PrivateChannel";
import { VC } from "./VC";

export const dbInit = async () => {
  Member.belongsTo(VC, {
    foreignKey: "voicechannelId",
    targetKey: "voicechannelId",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    as: "voiceChannel",
  });
  PrivateChannel.hasOne(VC, {
    foreignKey: "privatechannelId",
    sourceKey: "id",
    onDelete: "SET NULL",
    onUpdate: "CASCADE",
    as: "privateChannel",
  });
  await sequelize.sync({ force: false });
};

export { sequelize, Member, VC, PrivateChannel, BotMessage };