import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';

export default function Suggestions({
  suggestions = [],
  onSelectWidget,
}: {
  suggestions: string[];
  onSelectWidget: (text: string) => void;
}) {
  return (
    <View style={styles.listStyle}>
      {suggestions.map((item, index) => (
        <Pressable
          key={index}
          onPress={() => onSelectWidget(item)}
          style={styles.widget}>
          <Text style={styles.text}>{item}</Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  listStyle: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  text: {
    fontSize: 14,
  },
  widget: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    elevation: 2,
  },
});
