import {Application} from "express";
import universityContextManagerRoutes from "./context.routes";
import universityQueryManagerRoutes from "./query.routes";

export default class Routes {
  constructor(app: Application){
    app.use("/api/context", universityContextManagerRoutes);
    app.use("/api/query", universityQueryManagerRoutes);
  }
}