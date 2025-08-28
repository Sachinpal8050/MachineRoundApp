import {View, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import Animated, {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const ITEM_HEIGHT = 40;
const INTERVAL = 2000;

const MovableComponent = ({
  value,
  index,
  scrollY,
}: {
  value: string;
  index: number;
  scrollY: SharedValue<number>;
}) => {
  const animatedItemStyle = useAnimatedStyle(() => {
    const positionY = index * ITEM_HEIGHT;
    const translateY = scrollY.value;
    const distanceFromCenter = positionY + translateY;

    const opacity = interpolate(
      distanceFromCenter,
      [-ITEM_HEIGHT, 0, ITEM_HEIGHT],
      [0, 1, 0],
      Extrapolate.CLAMP,
    );

    return {opacity};
  });
  return (
    <Animated.Text key={index} style={[styles.text, animatedItemStyle]}>
      {value}
    </Animated.Text>
  );
};

const AnimatedText = ({data}: {data: string[]}) => {
  const scrollY = useSharedValue(0);
  const totalItems = data.length;
  const list = [...data, ...data];

  useEffect(() => {
    const interval = setInterval(() => {
      scrollY.value = withTiming(
        scrollY.value - ITEM_HEIGHT,
        {duration: 1000},
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
          <MovableComponent
            key={index}
            index={index}
            value={item}
            scrollY={scrollY}
          />
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
