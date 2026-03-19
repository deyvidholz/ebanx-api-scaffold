import { Account } from './account.entity';

export interface AccountRepository {
  findById(id: string): Account | undefined;
  save(account: Account): void;
  reset(): void;
}
