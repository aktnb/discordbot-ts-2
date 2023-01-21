import { InferAttributes, InferCreationAttributes, DataTypes, Model, CreationOptional } from "sequelize";
import { sequelize } from "./config";

class VC extends Model<InferAttributes<VC>, InferCreationAttributes<VC>> {
  declare voicechannelId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

VC.init({
  voicechannelId: {
    type: DataTypes.STRING(24),
    primaryKey: true
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  tableName: "vcs",
  version: true,
});

export { VC };
