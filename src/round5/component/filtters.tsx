import {Text, StyleSheet, Pressable, ScrollView, View} from 'react-native';
import React from 'react';
import {NewsType} from '../types';

export default function Filtters({
  filttersList,
  selectedFilter,
  onPress,
}: {
  filttersList: string[];
  selectedFilter: NewsType;
  onPress?: (val: NewsType) => {};
}) {
  const renderFilter = (item: NewsType, index: number) => {
    let isSelected = selectedFilter === item;
    return (
      <Pressable
        style={[style.widget, isSelected && style.selected]}
        onPress={onPress?.bind(null, item)}
        disabled={isSelected}
        key={index}>
        <Text style={style.text}>{item}</Text>
      </Pressable>
    );
  };
  return (
    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
      <View style={style.conatiner}>{filttersList.map(renderFilter)}</View>
    </ScrollView>
  );
}

const style = StyleSheet.create({
  conatiner: {
    flexDirection: 'row',
    gap: 20,
  },
  widget: {
    padding: 12,
    backgroundColor: 'orange',
    borderRadius: 20,
  },
  selected: {
    backgroundColor: 'red',
  },
  text: {
    color: 'black',
    fontWeight: '700',
  },
  flex1: {
    flex: 1,
  },
});
