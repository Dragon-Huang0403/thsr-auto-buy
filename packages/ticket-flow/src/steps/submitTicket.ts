import {Got} from 'got';
import {parse} from 'node-html-parser';

import {bookingPageUrl} from '../utils/constants';
import {parseTicketResult, throwIfHasError} from '../utils/parsers';
import {RequestFillers} from '../utils/requestFillers';

export async function submitTicket(client: Got, request: SubmitTicketRequest) {
  const {body: html} = await client.post(bookingPageUrl, {
    searchParams: request,
  });
  const page = parse(html);
  throwIfHasError(page);
  const ticketResult = parseTicketResult(page);

  return ticketResult;
}

type SubmitTicketFiller =
  | RequestFillers['bookByTime']['submitTicket']
  | RequestFillers['bookByTrainNo']['submitTicket'];

type SubmitTicketRequest = SubmitTicketFiller & {
  dummyId: string;
  dummyPhone: string;
  email: string;
  passengerCount: number;
} & (NoMemberRequest | MemberRequest);

type NoMemberRequest = {
  'TicketMemberSystemInputPanel:TakerMemberSystemDataView:memberSystemRadioGroup': string;
};

type MemberRequest = {
  'TicketMemberSystemInputPanel:TakerMemberSystemDataView:memberSystemRadioGroup': string;
  /**
   * Member ID
   */
  'TicketMemberSystemInputPanel:TakerMemberSystemDataView:memberSystemRadioGroup:memberShipNumber': string;
  'TicketMemberSystemInputPanel:TakerMemberSystemDataView:memberSystemRadioGroup:memberSystemShipCheckBox': 'on';
};
