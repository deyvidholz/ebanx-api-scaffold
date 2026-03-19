import { AccountRepository } from '../account/account.repository';
import { ResetService } from './reset.service';

const makeRepository = (): jest.Mocked<AccountRepository> => ({
  findById: jest.fn(),
  save: jest.fn(),
  reset: jest.fn(),
});

describe('ResetService', () => {
  let repository: jest.Mocked<AccountRepository>;
  let service: ResetService;

  beforeEach(() => {
    repository = makeRepository();
    service = new ResetService(repository);
  });

  describe('reset', () => {
    it('delegates to the repository', () => {
      service.reset();

      expect(repository.reset).toHaveBeenCalledTimes(1);
    });
  });
});
