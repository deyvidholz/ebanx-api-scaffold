import { Account } from '../account/account.entity';
import { AccountNotFoundError } from '../account/account.errors';
import { AccountRepository } from '../account/account.repository';
import { EventPayload } from './event.dto';

export type EventResult =
  | { destination: Account }
  | { origin: Account }
  | { origin: Account; destination: Account };

export class EventService {
  constructor(private readonly repository: AccountRepository) {}

  handle(event: EventPayload): EventResult {
    switch (event.type) {
      case 'deposit':
        return this.deposit(event.destination, event.amount);
      case 'withdraw':
        return this.withdraw(event.origin, event.amount);
      case 'transfer':
        return this.transfer(event.origin, event.destination, event.amount);
    }
  }

  private deposit(destinationId: string, amount: number): { destination: Account } {
    const existing = this.repository.findById(destinationId);
    const destination: Account = existing
      ? { ...existing, balance: existing.balance + amount }
      : { id: destinationId, balance: amount };
    this.repository.save(destination);
    return { destination };
  }

  private withdraw(originId: string, amount: number): { origin: Account } {
    const existing = this.repository.findById(originId);
    if (!existing) throw new AccountNotFoundError(originId);
    const origin: Account = { ...existing, balance: existing.balance - amount };
    this.repository.save(origin);
    return { origin };
  }

  private transfer(
    originId: string,
    destinationId: string,
    amount: number
  ): { origin: Account; destination: Account } {
    const existingOrigin = this.repository.findById(originId);
    if (!existingOrigin) throw new AccountNotFoundError(originId);

    const origin: Account = { ...existingOrigin, balance: existingOrigin.balance - amount };

    const existingDestination = this.repository.findById(destinationId);
    const destination: Account = existingDestination
      ? { ...existingDestination, balance: existingDestination.balance + amount }
      : { id: destinationId, balance: amount };

    this.repository.save(origin);
    this.repository.save(destination);
    return { origin, destination };
  }
}
