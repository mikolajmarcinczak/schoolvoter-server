import {Router} from 'express';
import {IRoutes} from './iroutes';
import ContextManager from '../controllers/context.manager';

class universityContextManagerRoutes implements IRoutes {
  router = Router();
  controller = new ContextManager();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.post('/', this.controller.create);
    this.router.put('/:name', this.controller.updateScore);
    this.router.delete('/', this.controller.deleteAll);
    this.router.delete('/:name', this.controller.delete);
  }
}

export default new universityContextManagerRoutes().router;