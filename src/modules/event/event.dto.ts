export type EventPayload =
  | { type: 'deposit'; destination: string; amount: number }
  | { type: 'withdraw'; origin: string; amount: number }
  | { type: 'transfer'; origin: string; destination: string; amount: number };
