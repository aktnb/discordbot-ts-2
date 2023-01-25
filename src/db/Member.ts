import { InferAttributes, InferCreationAttributes, DataTypes, Model, CreationOptional } from "sequelize";
import { sequelize } from "./config";

class Member extends Model<InferAttributes<Member>, InferCreationAttributes<Member>> {
  declare memberId: string;
  declare voicechannelId: CreationOptional<string|null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Member.init({
  memberId: {
    type: DataTypes.STRING(24),
    primaryKey: true
  },
  voicechannelId: {
    type: DataTypes.STRING(24),
    allowNull: true,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  tableName: "members",
  version: true,
});

export { Member };
