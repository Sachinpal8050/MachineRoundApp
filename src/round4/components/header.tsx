import {View, Text, StyleSheet} from 'react-native';
import React from 'react';

export default function Header(props: any) {
  const {title} = props;
  return (
    <View style={style.container}>
      <Text style={style.text}>{title}</Text>
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 16,

    backgroundColor: 'orange',
    elevation: 4,
  },
  text: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
  },
  listStyle: {
    gap: 20,
  },
  textInputStyle: {
    // borderWidth: 1,
  },
});
