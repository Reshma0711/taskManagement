import express from "express";
import { env } from "./config/env.config";
import { sequelize } from "./models";
import { setupSwagger } from "./config/swagger.config";
import routes from "./routes";


const app = express();

app.use(express.json());
app.use("/api", routes);
setupSwagger(app);

async function startServer() {
  try {
    await sequelize.authenticate();
    await sequelize.sync();

    console.log("PostgreSQL connected");

    app.listen(env.port, () => {
      console.log(`Server running on port ${env.port}`);
    });
  } catch (error) {
    console.error("Server failed:", error);
  }
}

startServer();