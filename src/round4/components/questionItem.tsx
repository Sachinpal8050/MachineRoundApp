import React, {useState} from 'react';
import {View, Text, Pressable, StyleSheet} from 'react-native';
import {IQuestions} from '../screens/riskProfile';

export default function QuestionItem({
  item,
  onSelectOption,
}: {
  item: IQuestions;
  onSelectOption: (questionId: number, option: string) => void;
}) {
  const handleSelect = (option: string) => {
    onSelectOption(item.id, option);
  };

  return (
    <View key={item.id} style={styles.container}>
      <Text style={styles.question}>{item.question}</Text>
      <View style={styles.optionsWrapper}>
        {item.options.map((option: string, index: number) => (
          <Pressable
            key={index}
            style={[
              styles.option,
              item.answer === option && styles.selectedOption,
            ]}
            onPress={() => handleSelect(option)}>
            <Text
              style={[
                styles.optionText,
                item.answer === option && styles.selectedOptionText,
              ]}>
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  option: {
    width: '48%',
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: 'orange',
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedOption: {
    backgroundColor: 'red',
  },
  optionText: {
    fontSize: 16,
    color: 'white',
  },
  selectedOptionText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
