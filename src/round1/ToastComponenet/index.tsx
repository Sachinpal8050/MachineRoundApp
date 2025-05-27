import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';
import {ToastListMessageType, ToastTypeEnum} from './types';

function ToastContainer({
  toasts = [],
  removeToast,
}: {
  toasts: ToastListMessageType[];
  removeToast: (id: number) => void;
}) {
  const renderToast = (item: ToastListMessageType) => {
    switch (item.type) {
      case ToastTypeEnum.Success:
        return (
          <View key={item.id} style={style.successConatiner}>
            <Text style={style.textStyle}>{item.message}</Text>
            <Pressable onPress={() => removeToast(item.id)}>
              <Text style={style.cancelText}>Close</Text>
            </Pressable>
          </View>
        );
      case ToastTypeEnum.Error:
        return (
          <View key={item.id} style={style.errorCon}>
            <Text>{item.message}</Text>
            <Pressable onPress={() => removeToast(item.id)}>
              <Text style={style.cancelText}>Close</Text>
            </Pressable>
          </View>
        );
      case ToastTypeEnum.Warring:
        return (
          <View key={item.id} style={style.warringCon}>
            <Text>{item.message}</Text>
            <Pressable onPress={() => removeToast(item.id)}>
              <Text style={style.cancelText}>Close</Text>
            </Pressable>
          </View>
        );
    }
  };
  return (
    <View style={style.container}>
      {toasts.map(item => {
        return renderToast(item);
      })}
    </View>
  );
}

export default ToastContainer;

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 100,
    gap: 20,
    top: 30,
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#940fdb',
  },
  successConatiner: {
    flexDirection: 'row',
    backgroundColor: 'green',
    width: '90%',
    padding: 20,
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  errorCon: {
    flexDirection: 'row',
    backgroundColor: 'red',
    width: '90%',
    padding: 20,
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  warringCon: {
    flexDirection: 'row',
    backgroundColor: 'yellow',
    width: '90%',
    padding: 20,
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  textStyle: {
    fontWeight: '600',
    color: 'white',
  },
  cancelText: {
    fontWeight: '600',
    color: 'black',
  },
});
