import { Sequelize } from "sequelize";

const isTestEnv = process.env.NODE_ENV === "test";
const sequelize = isTestEnv
  ? new Sequelize({ dialect: "sqlite", storage: ":memory:" })
  : new Sequelize("post_office_db", "admin", "admin", {
      host: "localhost",
      dialect: "postgres",
    });

const connectDB = async () => {
  try {
    await sequelize.authenticate();
  } catch (error) {
    console.error("Failed to connect to Postgres", error);
    process.exit(1);
  }
};

export { sequelize, connectDB };
