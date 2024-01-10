import {Application} from "express";
import {TServerConfig} from "../server";
import Routes from "../routes";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import limit from "express-rate-limit";

export default class Server {
  configuration: TServerConfig;

  constructor(app: Application, configuration: TServerConfig) {
    this.configuration = configuration;
    this.config(app);
    new Routes(app);
  }

  private config(app: Application): void {
    let time = this.configuration.limiter.time;
    let max = this.configuration.limiter.max;

    app.use(helmet());
    app.use(cors(this.configuration.corsOptions));
    app.use(limit({ windowMs: time, max: max }))
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.disable('x-powered-by');

  }
}