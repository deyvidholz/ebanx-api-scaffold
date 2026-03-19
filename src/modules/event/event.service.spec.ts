import { AccountNotFoundError } from '../account/account.errors';
import { AccountRepository } from '../account/account.repository';
import { EventService } from './event.service';

const makeRepository = (): jest.Mocked<AccountRepository> => ({
  findById: jest.fn(),
  save: jest.fn(),
  reset: jest.fn(),
});

describe('EventService', () => {
  let repository: jest.Mocked<AccountRepository>;
  let service: EventService;

  beforeEach(() => {
    repository = makeRepository();
    service = new EventService(repository);
  });

  describe('deposit', () => {
    it('creates a new account when destination does not exist', () => {
      repository.findById.mockReturnValue(undefined);

      const result = service.handle({ type: 'deposit', destination: '100', amount: 10 });

      expect(result).toEqual({ destination: { id: '100', balance: 10 } });
      expect(repository.save).toHaveBeenCalledWith({ id: '100', balance: 10 });
    });

    it('adds amount to an existing account', () => {
      repository.findById.mockReturnValue({ id: '100', balance: 10 });

      const result = service.handle({ type: 'deposit', destination: '100', amount: 10 });

      expect(result).toEqual({ destination: { id: '100', balance: 20 } });
      expect(repository.save).toHaveBeenCalledWith({ id: '100', balance: 20 });
    });
  });

  describe('withdraw', () => {
    it('deducts amount from an existing account', () => {
      repository.findById.mockReturnValue({ id: '100', balance: 20 });

      const result = service.handle({ type: 'withdraw', origin: '100', amount: 5 });

      expect(result).toEqual({ origin: { id: '100', balance: 15 } });
      expect(repository.save).toHaveBeenCalledWith({ id: '100', balance: 15 });
    });

    it('throws AccountNotFoundError when origin does not exist', () => {
      repository.findById.mockReturnValue(undefined);

      expect(() => service.handle({ type: 'withdraw', origin: '200', amount: 10 })).toThrow(
        AccountNotFoundError,
      );
    });
  });

  describe('transfer', () => {
    it('moves amount from origin to a new destination account', () => {
      repository.findById
        .mockReturnValueOnce({ id: '100', balance: 15 })
        .mockReturnValueOnce(undefined);

      const result = service.handle({
        type: 'transfer',
        origin: '100',
        destination: '300',
        amount: 15,
      });

      expect(result).toEqual({
        origin: { id: '100', balance: 0 },
        destination: { id: '300', balance: 15 },
      });
    });

    it('moves amount from origin to an existing destination account', () => {
      repository.findById
        .mockReturnValueOnce({ id: '100', balance: 30 })
        .mockReturnValueOnce({ id: '300', balance: 10 });

      const result = service.handle({
        type: 'transfer',
        origin: '100',
        destination: '300',
        amount: 15,
      });

      expect(result).toEqual({
        origin: { id: '100', balance: 15 },
        destination: { id: '300', balance: 25 },
      });
    });

    it('throws AccountNotFoundError when origin does not exist', () => {
      repository.findById.mockReturnValue(undefined);

      expect(() =>
        service.handle({ type: 'transfer', origin: '200', destination: '300', amount: 15 }),
      ).toThrow(AccountNotFoundError);
    });
  });
});
