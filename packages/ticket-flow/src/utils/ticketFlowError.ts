export const TicketFlowErrorType = {
  unknown: 'unknown',
  soldOut: 'soldOut',
  thsrServerError: 'thsrServerError',
  cookiesExpired: 'cookiesExpired',
  solvingCaptchaWrong: 'solvingCaptchaWrong',
  parsePageFailed: 'parsePageFailed',
  badRequest: 'badRequest',
} as const;

export type TicketFlowErrorType = keyof typeof TicketFlowErrorType;

/**
 * @reference https://github.com/colinhacks/zod/blob/master/src/ZodError.ts#L192
 */

export class TicketFlowError extends Error {
  message: string;
  type: TicketFlowErrorType;

  constructor(type: TicketFlowErrorType, message?: string) {
    super();

    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (this as any).__proto__ = actualProto;
    }
    this.name = 'TicketFlowError';
    this.type = type ?? TicketFlowErrorType.unknown;
    this.message = message ? message : type;
  }

  toString() {
    return this.message;
  }
}
