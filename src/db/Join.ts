import { InferAttributes, InferCreationAttributes, DataTypes, Model, CreationOptional } from "sequelize";
import { sequelize } from "./config";

class Join extends Model<InferAttributes<Join>, InferCreationAttributes<Join>> {
  declare id: CreationOptional<number>;
  declare voicechannelId: string;
  declare memberId: string;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

Join.init({
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  voicechannelId: {
    type: DataTypes.STRING(24),
    allowNull: false,
  },
  memberId: {
    type: DataTypes.STRING(24),
    allowNull: false,
  },
  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
}, {
  sequelize,
  tableName: "joins",
  version: true,
});

export { Join };
