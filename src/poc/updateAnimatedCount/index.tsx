import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  useSharedValue,
  withTiming,
  useDerivedValue,
} from 'react-native-reanimated';
import ReText from './redash';

export default function AnimatedCounter() {
  const counter = useSharedValue(0);

  useEffect(() => {
    counter.value = withTiming(100, {duration: 4000});
  }, [counter]);

  const animatedText = useDerivedValue(() => {
    return counter.value.toFixed(1);
  });

  return (
    <View style={styles.container}>
      <ReText style={styles.text} text={animatedText} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  text: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#000',
  },
});
