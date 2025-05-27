import {DeviceEventEmitter} from 'react-native';
import {ToastTypeEnum} from './types';

export const showToastFun = () => {
  DeviceEventEmitter.emit('showAppToast', {
    message: 'Success Toast',
    type: ToastTypeEnum.Success,
  });
};
