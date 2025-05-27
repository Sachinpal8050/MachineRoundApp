import {View, Text, Pressable, DeviceEventEmitter} from 'react-native';
import React from 'react';
import {useShowToast} from './ToastComponenet/toastContext';
import {ToastTypeEnum} from './ToastComponenet/types';
import {showToastFun} from './ToastComponenet/utils';

function Child() {
  const {showToast} = useShowToast();
  const showSuccessToast = () => {
    showToastFun();
    // showToast({message: 'Success Toast', type: ToastTypeEnum.Success});
  };
  const showErrorToast = () => {
    showToast({message: 'Error Toast', type: ToastTypeEnum.Error});
  };
  const showWarringToast = () => {
    showToast({message: 'Warring Toast', type: ToastTypeEnum.Warring});
  };
  return (
    <View>
      <Pressable onPress={showSuccessToast}>
        <Text>Success Toast</Text>
      </Pressable>
      <Pressable onPress={showErrorToast}>
        <Text>Error Toast</Text>
      </Pressable>
      <Pressable onPress={showWarringToast}>
        <Text>Warring Toast</Text>
      </Pressable>
    </View>
  );
}
export default Child;
