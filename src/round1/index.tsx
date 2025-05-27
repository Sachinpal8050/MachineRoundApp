import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import ToastProvider from './ToastComponenet/toastContext';
import Child from './Child';

const App = () => {
  return (
    <ToastProvider>
      <View style={style.container}>
        <Text style={style.text}>zepto</Text>
        <Child />
      </View>
    </ToastProvider>
  );
};

export default App;

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#940fdb',
  },
});
