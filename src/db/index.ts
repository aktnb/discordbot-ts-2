import { sequelize } from "./config";
import { Member } from "./Member";
import { Join } from "./Join";
import { NoticeSetting } from "./NoticeSetting";
import { PrivateChannel } from "./PrivateChannel";
import { VC } from "./VC";

export const dbInit = async () => {
  PrivateChannel.belongsTo(VC, {
    foreignKey: "voicechannelId",
    targetKey: "voicechannelId"
  });
  VC.hasOne(PrivateChannel, {
    foreignKey: "voicechannelId"
  });
  VC.hasMany(Join, {
    foreignKey: "voicechannelId"
  });
  VC.hasMany(NoticeSetting, {
    foreignKey: "voicechannelId"
  });
  Join.belongsTo(VC, {
    foreignKey: "voicechannelId",
    targetKey: "voicechannelId"
  });
  Join.belongsTo(Member, {
    foreignKey: "memberId",
    targetKey: "memberId"
  });
  NoticeSetting.belongsTo(VC, {
    foreignKey: "voicechannelId",
    targetKey: "voicechannelId"
  });
  NoticeSetting.belongsTo(Member, {
    foreignKey: "memberId",
    targetKey: "memberId"
  });
  Member.hasOne(Join, {
    foreignKey: "memberId"
  });
  Member.hasMany(NoticeSetting, {
    foreignKey: "memberId"
  });

  await sequelize.sync();
};

export { sequelize, Member, Join, VC, NoticeSetting, PrivateChannel };