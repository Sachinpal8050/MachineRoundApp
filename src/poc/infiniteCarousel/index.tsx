import {View, Text, StyleSheet, Dimensions, FlatList} from 'react-native';
import React, {useRef} from 'react';
import Animated, {
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
const {width: SCREEN_WIDTH} = Dimensions.get('window');

const ACTUAL_DATA = [{value: 'A'}, {value: 'B'}, {value: 'C'}, {value: 'D'}];

const Dot = ({index, scrollX}: {index: number; scrollX: any}) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    const currentPage =
      Math.round(scrollX.value / SCREEN_WIDTH) % ACTUAL_DATA.length;
    return {
      opacity: currentPage === index ? 1 : 0.5,
    };
  });

  return <Animated.View style={[styles.dot, animatedDotStyle]} />;
};

const Indicator = ({
  scrollX,
  size,
}: {
  scrollX: Animated.SharedValue<number>;
  size: number;
}) => {
  return (
    <View style={styles.indicatorContainer}>
      {Array.from({length: size}, (_, index) => {
        return <Dot key={index} index={index} scrollX={scrollX} />;
      })}
    </View>
  );
};

const Round8 = () => {
  const DATA = [...ACTUAL_DATA, ...ACTUAL_DATA];
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<FlatList>(null);

  const resetFlatList = () => {
    flatListRef.current?.scrollToOffset({
      offset: 0,
      animated: false,
    });
  };
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: event => {
      scrollX.value = event.contentOffset.x;
      if (event.contentOffset.x > SCREEN_WIDTH * ACTUAL_DATA.length) {
        runOnJS(resetFlatList)();
      }
    },
  });
  const renderItem = ({item, index}: any) => {
    return (
      <View key={index} style={styles.itemContainer}>
        <Text style={styles.text}>{item.value}</Text>
      </View>
    );
  };
  return (
    <View style={styles.conatiner}>
      <Animated.FlatList
        ref={flatListRef}
        contentContainerStyle={styles.contentContainerStyle}
        horizontal
        data={DATA}
        onScroll={scrollHandler}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
        pagingEnabled
      />
      <Indicator scrollX={scrollX} size={ACTUAL_DATA.length} />
    </View>
  );
};

export default Round8;

const styles = StyleSheet.create({
  conatiner: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
    height: 200,
    width: SCREEN_WIDTH,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'red',
  },
  contentContainerStyle: {},
  dot: {
    height: 10,
    width: 10,
    backgroundColor: 'red',
    borderRadius: 10,
  },
  indicatorContainer: {
    flexDirection: 'row',
    gap: 2,
    marginTop: 20,
  },
});
