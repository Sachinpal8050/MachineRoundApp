export enum ToastTypeEnum {
  Success = 'Success',
  Error = 'Error',
  Warring = 'Warring',
  Info = 'Info',
}

export type ToastMessageType = {
  message: string;
  type: ToastTypeEnum;
};

export type ToastListMessageType = {
  message: string;
  type: string;
  id: number;
};
