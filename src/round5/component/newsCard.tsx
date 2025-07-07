import {View, Text, StyleSheet, Image} from 'react-native';
import React from 'react';
import {NewCardTypoe} from '../types';

function NewsCard({item}: {item: NewCardTypoe}) {
  return (
    <View style={styles.constainer}>
      <View>
        <Text numberOfLines={2}>{item.title}</Text>
        <Text numberOfLines={3}>{item.title}</Text>
      </View>
      <Image style={styles.img} source={{uri: item.imageUrls}} />
    </View>
  );
}

export default NewsCard;

const styles = StyleSheet.create({
  constainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  img: {
    height: 200,
    width: 200,
  },
});
