import { Request, Response } from 'express';
import { ResetService } from './reset.service';

export class ResetController {
  constructor(private readonly resetService: ResetService) {}

  reset = (_req: Request, res: Response): void => {
    this.resetService.reset();
    res.status(200).send('OK');
  };
}
