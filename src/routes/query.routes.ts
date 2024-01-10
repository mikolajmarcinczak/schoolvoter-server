import {Router} from 'express';
import {IRoutes} from './iroutes';
import QueryManager from '../controllers/query.manager';

class universityQueryManagerRoutes implements IRoutes {
  router = Router();
  controller = new QueryManager();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/:name', this.controller.querySingle);
    this.router.get('/', this.controller.queryAll);
  }
}

export default new universityQueryManagerRoutes().router;