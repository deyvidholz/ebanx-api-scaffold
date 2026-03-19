import { Application } from 'express';
import { createServer } from './http/server';
import { InMemoryAccountRepository } from './modules/account/account.in-memory.repository';
import { BalanceService } from './modules/balance/balance.service';
import { EventService } from './modules/event/event.service';
import { ResetService } from './modules/reset/reset.service';

export function createApp(): Application {
  const repository = new InMemoryAccountRepository();

  return createServer({
    balanceService: new BalanceService(repository),
    eventService: new EventService(repository),
    resetService: new ResetService(repository),
  });
}
