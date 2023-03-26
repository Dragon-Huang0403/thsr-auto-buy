export const requestFillers = {
  bookByTime: {
    getAvailableTrains: {
      'wicket:interface': ':0:BookingS1Form::IFormSubmitListener',
      'BookingS1Form:hf:0': '',
      backTimeInputField: '',
    },
    confirmTrain: {
      'wicket:interface': ':1:BookingS2Form::IFormSubmitListener',
      'BookingS2Form:hf:0': '',
    },
    submitTicket: {
      'wicket:interface': `:2:BookingS3Form::IFormSubmitListener`,
      'BookingS3FormSP:hf:0': '',
      diffOver: 1,
      TgoError: 1,
      backHome: '',
      isGoBackM: '',
      idInputRadio: 0,
      isSPromotion: 1,
      agree: 'on',
    },
  },
  bookByTrainNo: {
    confirmTrain: {
      'wicket:interface': ':0:BookingS1Form::IFormSubmitListener',
      'BookingS1Form:hf:0': '',
    },
    submitTicket: {
      'wicket:interface': `:1:BookingS3Form::IFormSubmitListener`,
      'BookingS3FormSP:hf:0': '',
      diffOver: 1,
      TgoError: 1,
      backHome: '',
      isGoBackM: '',
      idInputRadio: 0,
      isSPromotion: 1,
      agree: 'on',
    },
  },
} as const;

export type RequestFillers = typeof requestFillers;
