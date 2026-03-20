import { Router } from 'express';
import { BalanceController } from '../modules/balance/balance.controller';
import { BalanceService } from '../modules/balance/balance.service';
import { EventController } from '../modules/event/event.controller';
import { EventService } from '../modules/event/event.service';
import { ResetController } from '../modules/reset/reset.controller';
import { ResetService } from '../modules/reset/reset.service';

interface RouterServices {
  balanceService: BalanceService;
  eventService: EventService;
  resetService: ResetService;
}

export function createRouter(services: RouterServices): Router {
  const router = Router();

  const balance = new BalanceController(services.balanceService);
  const event = new EventController(services.eventService);
  const reset = new ResetController(services.resetService);

  router.get('/health', (_req, res) => res.json({ status: 'ok' }));
  router.post('/reset', reset.reset);
  router.get('/balance', balance.getBalance);
  router.post('/event', event.handleEvent);

  return router;
}
