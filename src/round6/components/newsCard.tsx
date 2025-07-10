import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {INewsCard} from '../type';

const NewsCard = ({title, salary, phoneNumer, location}: INewsCard) => {
  return (
    <View style={styles.container}>
      <Text>{title}</Text>
      <Text>Salary: {salary}</Text>
      <Text>Location: {location}</Text>
      <Text>Phone Number: {phoneNumer}</Text>
    </View>
  );
};

export default NewsCard;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
  },
});
