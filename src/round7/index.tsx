import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import {useAutoSearch} from './hook';

const Round7 = () => {
  const {
    state: {searchQuery, searchData, loader, error},
    action: {handleChangeText},
  } = useAutoSearch();

  const renderRecepies = (text: string, index: number) => {
    let firstStr;
    let midStr;
    let lastStr;
    const strtIndex = text
      .toLowerCase()
      .indexOf(searchQuery.toLocaleLowerCase());
    const endIndex = strtIndex + searchQuery.length;
    if (strtIndex !== -1 && endIndex <= text.length) {
      firstStr = text.slice(0, strtIndex);
      midStr = text.slice(strtIndex, endIndex);
      lastStr = text.slice(endIndex);
    } else {
      firstStr = text;
      midStr = '';
      lastStr = '';
    }

    return (
      <Text key={index}>
        {firstStr}
        <Text style={styles.highlightedText}>
          {midStr}
          <Text>{lastStr}</Text>
        </Text>
      </Text>
    );
  };

  const renderItem = ({item, index}: {item: any; index: number}) => {
    return (
      <View style={styles.itemStyle} key={index}>
        {item?.name?.split(' ').map(renderRecepies)}
      </View>
    );
  };
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.inputStyle}
        onChangeText={handleChangeText}
        value={searchQuery}
        placeholder="Search"
      />
      <Text style={styles.error}>{error}</Text>
      {!loader && !error.length ? (
        <FlatList
          contentContainerStyle={styles.listStyle}
          data={searchData}
          renderItem={renderItem}
        />
      ) : (
        <ActivityIndicator
          size={'small'}
          color={'red'}
          style={styles.loaderStyle}
        />
      )}
    </View>
  );
};

export default Round7;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputStyle: {
    borderWidth: 1,
    padding: 20,
    borderColor: 'gray',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
  },
  itemStyle: {
    borderWidth: 1,
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 12,
    borderColor: 'gray',
    flexDirection: 'row',
    gap: 10,
  },
  loaderStyle: {
    marginTop: 20,
  },
  error: {
    fontWeight: '400',
    color: 'red',
    fontSize: 20,
  },
  listStyle: {
    gap: 20,
  },
  highlightedText: {
    backgroundColor: 'red',
    color: 'white',
  },
});
