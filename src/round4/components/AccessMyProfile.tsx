import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

export default function AccessMyProfile() {
  return (
    <View style={style.container}>
      <Text>AccessMyProfile</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#940fdb',
  },
  listStyle: {
    gap: 20,
  },
  textInputStyle: {
    borderWidth: 1,
  },
});
