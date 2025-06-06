import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';

type JobCardProps = {
  id: string;
  title: string;
  phoneNumber: string;
  salary: string;
  location: string;
};

const JobCard = (props: JobCardProps) => {
  const {title, salary, location, phoneNumber} = props;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text>Salary: {salary}</Text>
      <Text>Location: {location}</Text>
      <Text>Phone Number: {phoneNumber}</Text>
    </View>
  );
};

export default JobCard;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#940fdb',
  },
});
