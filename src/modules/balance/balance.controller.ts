import { Request, Response } from 'express';
import { AccountNotFoundError } from '../account/account.errors';
import { BalanceService } from './balance.service';

export class BalanceController {
  constructor(private readonly balanceService: BalanceService) {}

  getBalance = (req: Request, res: Response): void => {
    try {
      const balance = this.balanceService.getBalance(req.query.account_id as string);
      res.status(200).json(balance);
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        res.status(404).json(0);
        return;
      }
      throw error;
    }
  };
}
