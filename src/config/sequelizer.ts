import "reflect-metadata";
import { Sequelize } from "sequelize-typescript";
import { env } from "./env.config";

const sequelize = new Sequelize({
  database: env.database.name,
  username: env.database.user,
  password: env.database.password,
  host: env.database.host,
  port: env.database.port,
  dialect: "postgres",
  logging: false,
});

export default sequelize;