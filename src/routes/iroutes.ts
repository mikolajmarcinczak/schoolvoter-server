import express from "express";

export interface IRoutes {
  router: express.Router;
  controller: object;
  initRoutes(): void;
}