import express, { Application } from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';
import { BalanceService } from '../modules/balance/balance.service';
import { EventService } from '../modules/event/event.service';
import { ResetService } from '../modules/reset/reset.service';
import { createRouter } from './router';

interface ServerServices {
  balanceService: BalanceService;
  eventService: EventService;
  resetService: ResetService;
}

export function createServer(services: ServerServices): Application {
  const app = express();

  app.use(express.json());

  const swaggerDocument = YAML.load(path.join(__dirname, '../../swagger.yaml'));
  app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use('/', createRouter(services));

  return app;
}
