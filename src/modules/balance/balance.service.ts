import { AccountNotFoundError } from '../account/account.errors';
import { AccountRepository } from '../account/account.repository';

export class BalanceService {
  constructor(private readonly repository: AccountRepository) {}

  getBalance(accountId: string): number {
    const account = this.repository.findById(accountId);
    if (!account) throw new AccountNotFoundError(accountId);
    return account.balance;
  }
}
