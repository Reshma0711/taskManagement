import express from "express";
import { env } from "./config/env.config";
import { setupSwagger } from "./config/swagger.config";
import routes from "./routes";
import { sequelize } from "./config/sequelizer";

const app = express();

// Parse JSON
app.use(express.json());


// Routes
app.use("/api", routes);

// API documentation
setupSwagger(app);


// Start server
async function startServer() {
  try {

    // Connect PostgreSQL
    await sequelize.authenticate();
    console.log("PostgreSQL connected");

    // await connectRedis();
    // console.log("Redis connected");

    // Start Express
    app.listen(
      env.port,
      () => {
        console.log(
          "Server running on port 3000"
        );
      }
    );

  } catch (error) {

    console.error(
      "Server failed:",
      error
    );

  }
}

startServer();