import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const ITEM_HEIGHT = 40;
const INTERVAL = 2000;

const AnimatedText = ({data}: {data: string[]}) => {
  const scrollY = useSharedValue(0);
  const totalItems = data.length;
  const list = [...data, ...data];

  useEffect(() => {
    const interval = setInterval(() => {
      scrollY.value = withTiming(
        scrollY.value - ITEM_HEIGHT,
        {duration: 500},
        () => {
          if (Math.abs(scrollY.value) >= ITEM_HEIGHT * totalItems) {
            scrollY.value = 0;
          }
        },
      );
    }, INTERVAL);

    return () => clearInterval(interval);
  }, [scrollY, totalItems]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: scrollY.value}],
    };
  });

  return (
    <View style={styles.clipContainer}>
      <Animated.View style={[styles.textContainer, animatedStyle]}>
        {list.map((item, index) => (
          <Text key={index} style={styles.text}>
            {item}
          </Text>
        ))}
      </Animated.View>
    </View>
  );
};

function AnimatedTextLoop() {
  return (
    <View style={styles.container}>
      <AnimatedText
        data={[
          '🌄 Explore Mountains',
          '🚗 Rent a Car',
          '🏕️ Adventure Trips',
          '🛶 River Rafting',
          '🔥 Camping',
          'Chilling',
        ]}
      />
    </View>
  );
}

export default AnimatedTextLoop;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fefefe',
    height: 50,
    overflow: 'hidden',
    paddingHorizontal: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    marginTop: 50,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 3},
    shadowRadius: 5,
    elevation: 3,
  },
  clipContainer: {
    height: ITEM_HEIGHT,
    overflow: 'hidden',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    height: ITEM_HEIGHT,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  textContainer: {
    justifyContent: 'flex-start',
  },
});
