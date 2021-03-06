import { Router } from 'express';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import TechController from './app/controllers/TechController';
import UserTechController from './app/controllers/UserTechController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware);

routes.put('/users', UserController.update);
routes.get('/users', UserController.index);
routes.get('/users-by-name', UserController.indexByName);
routes.get('/users-by-email', UserController.indexByEmail);
routes.get('/users/:id', UserController.show);
routes.delete('/users/', UserController.delete);

routes.get('/techs/:id', TechController.show);
routes.get('/techs', TechController.index);
routes.get('/techs-by-name', TechController.indexByName);
routes.get('/techs-by-year', TechController.indexByYear);
routes.post('/techs', TechController.store);
routes.put('/techs/:techId', TechController.update);
routes.delete('/techs/:techId', TechController.delete);

routes.get('/user_techs', UserTechController.index);
routes.get('/user_techs/:id', UserTechController.show);
routes.post('/user_techs', UserTechController.store);
routes.put('/user_techs/:id', UserTechController.update);
routes.delete('/user_techs/:id', UserTechController.delete);

export default routes;
