import {View, Text, FlatList, StyleSheet, Pressable} from 'react-native';
import React, {useEffect, useState} from 'react';
import {DUMMY_QUESTIONS} from '../data/questionsList';
import QuestionItem from '../components/questionItem';
import {sendRiskMessageToServer} from '../service';
import {popBack} from '../navigation';

export interface IQuestions {
  id: number;
  question: string;
  options: string[];
  answer?: string;
}

export default function RiskProfile() {
  const [questionsList, setQuestionsList] = useState<IQuestions[]>([]);

  useEffect(() => {
    setQuestionsList(DUMMY_QUESTIONS);
  }, []);

  const onSelectOption = (questionId: number, option: string) => {
    const updatedQuestions = questionsList.map(question => {
      if (question.id === questionId) {
        return {...question, answer: option};
      }
      return question;
    });
    setQuestionsList(updatedQuestions);
  };

  const onSubmit = async () => {
    await sendRiskMessageToServer(questionsList);
    popBack();
  };

  const onReset = () => {
    setQuestionsList(DUMMY_QUESTIONS);
  };

  const renderItem = ({item}: {item: IQuestions}) => {
    return (
      <QuestionItem onSelectOption={onSelectOption} key={item.id} item={item} />
    );
  };

  const listFooter = () => {
    return (
      <View style={styles.footer}>
        <Pressable onPress={onReset} style={styles.button}>
          <Text style={styles.buttonText}>Reset</Text>
        </Pressable>
        <Pressable
          onPress={onSubmit}
          style={[styles.button, styles.submitButton]}>
          <Text style={styles.buttonText}>Submit</Text>
        </Pressable>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        ListFooterComponent={listFooter}
        renderItem={renderItem}
        data={questionsList}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: '#E0E0E0',
    backgroundColor: '#F9F9F9',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});
