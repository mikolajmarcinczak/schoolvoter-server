import express from "express";
import {CorsOptions} from "cors";

import client from "./utility/database";
import {config} from "./utility/config";
import Server from "./model/server.model";

const PORT: number = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
const startServer = (configuration : TServerConfig) => {
  const app = express();
  const server = new Server(app, configuration);

  process.on("SIGINT", async () => {
    await closeDatabaseConnection();
    process.exit();
  });

  process.on("SIGTERM", async () => {
    await closeDatabaseConnection();
    process.exit();
  });

  connectToDatabase();

  app.listen(configuration.port, "localhost", () => {
    console.log(`Server listening on port ${configuration.port}`);
  }).on("error",(err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log("ERROR: address already in use, retry...");
    }
    else {
      console.log(err);
    }
  });
}

const connectToDatabase = async () => {
  try {
    await client.connect();
    console.log("Connected to database.");
  } catch (err) {
    console.log(`Redis connection error: ${err}`);
  }
}

const closeDatabaseConnection = async () => {
  try {
    await client.quit();
    console.log("Disconnected from database.");
  } catch (err) {
    console.log(`Error closing Redis connection: ${err}`);
  }
};

export type TServerConfig = {
  port: number;
  corsOptions: CorsOptions;
  limiter: {
    time: number;
    max: number;
  }
}

startServer(config.server);