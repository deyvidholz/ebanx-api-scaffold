import { Account } from './account.entity';
import { AccountRepository } from './account.repository';

export class InMemoryAccountRepository implements AccountRepository {
  private accounts = new Map<string, Account>();

  findById(id: string): Account | undefined {
    return this.accounts.get(id);
  }

  save(account: Account): void {
    this.accounts.set(account.id, { ...account });
  }

  reset(): void {
    this.accounts.clear();
  }
}
