import { Request, Response } from 'express';
import { AccountNotFoundError } from '../account/account.errors';
import { EventPayload } from './event.dto';
import { EventService } from './event.service';

export class EventController {
  constructor(private readonly eventService: EventService) {}

  handleEvent = (req: Request, res: Response): void => {
    try {
      const result = this.eventService.handle(req.body as EventPayload);
      res.status(201).json(result);
    } catch (error) {
      if (error instanceof AccountNotFoundError) {
        res.status(404).json(0);
        return;
      }
      throw error;
    }
  };
}
