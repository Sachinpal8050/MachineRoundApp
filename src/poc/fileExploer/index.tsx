import {View, StyleSheet} from 'react-native';
import React from 'react';
import Folder from './components/folder';
import {TREEE_DATA} from './data';

export default function FileExploer() {
  return (
    <View style={styles.container}>
      <Folder node={TREEE_DATA} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
