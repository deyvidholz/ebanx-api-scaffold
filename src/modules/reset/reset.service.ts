import { AccountRepository } from '../account/account.repository';

export class ResetService {
  constructor(private readonly repository: AccountRepository) {}

  reset(): void {
    this.repository.reset();
  }
}
