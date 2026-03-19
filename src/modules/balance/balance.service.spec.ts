import { AccountNotFoundError } from '../account/account.errors';
import { AccountRepository } from '../account/account.repository';
import { BalanceService } from './balance.service';

const makeRepository = (): jest.Mocked<AccountRepository> => ({
  findById: jest.fn(),
  save: jest.fn(),
  reset: jest.fn(),
});

describe('BalanceService', () => {
  let repository: jest.Mocked<AccountRepository>;
  let service: BalanceService;

  beforeEach(() => {
    repository = makeRepository();
    service = new BalanceService(repository);
  });

  describe('getBalance', () => {
    it('returns the balance for an existing account', () => {
      repository.findById.mockReturnValue({ id: '100', balance: 20 });

      expect(service.getBalance('100')).toBe(20);
      expect(repository.findById).toHaveBeenCalledWith('100');
    });

    it('throws AccountNotFoundError for a non-existing account', () => {
      repository.findById.mockReturnValue(undefined);

      expect(() => service.getBalance('999')).toThrow(AccountNotFoundError);
    });
  });
});
