import {View, FlatList, StyleSheet} from 'react-native';
import React from 'react';
import {NewCardTypoe} from './types';
import Filtters from './component/filtters';
import NewsCard from './component/newsCard';
import {useNews} from './useNews';

export default function Round5() {
  const {
    state: {news, filters, selectedFilter},
    action: {onSelectFilter},
  } = useNews();
  const renderItem = ({item, index}: {item: NewCardTypoe; index: number}) => {
    return <NewsCard key={index} item={item} />;
  };

  const listHeader = () => {
    return (
      <Filtters
        selectedFilter={selectedFilter}
        onPress={onSelectFilter}
        filttersList={filters}
      />
    );
  };

  return (
    <View style={styles.flex1}>
      {listHeader()}
      <FlatList
        contentContainerStyle={styles.list}
        data={news}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    gap: 20,
  },
  flex1: {
    // flex: 1,
  },
});
