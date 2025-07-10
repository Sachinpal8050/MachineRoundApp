import {View, Text, FlatList, TextInput, StyleSheet} from 'react-native';
import React from 'react';
import NewsCard from './components/newsCard';
import {useNewsList} from './hook';

const Round6 = () => {
  const {
    state: {newsList, searchText, isLoading, error, searchedData},
    actions: {handleChangeText, onEndReached},
  } = useNewsList();
  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <NewsCard
        key={index}
        title={item.title}
        salary={item?.primary_details?.Salary}
        phoneNumer={item?.whatsapp_no}
        location={item?.locality}
      />
    );
  };
  return (
    <View style={styles.container}>
      <TextInput
        value={searchText}
        placeholder="Search"
        onChangeText={handleChangeText}
      />
      <FlatList
        contentContainerStyle={styles.list}
        data={searchedData ? searchedData : newsList}
        renderItem={renderItem}
        onEndReached={onEndReached}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      {isLoading && <Text style={styles.loading}>Loading...</Text>}
    </View>
  );
};

export default Round6;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    // flex: 1,
    gap: 20,
    marginHorizontal: 20,
  },
  loading: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#940fdb',
    padding: 20,
  },
  error: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
    padding: 20,
  },
});
