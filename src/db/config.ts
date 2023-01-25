import { Sequelize } from "sequelize";

export const sequelize = new Sequelize({
  dialect: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "postgres",
  logging: false
});
