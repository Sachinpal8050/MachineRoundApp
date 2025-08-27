import {Image, StyleSheet, View, Dimensions} from 'react-native';
import React from 'react';
import {generateData} from './data';
import Animated, {
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

const {width} = Dimensions.get('window');

const _itemSize = width * 0.7;
const _spacing = 5;
const _itemFullSize = _itemSize + 2 * _spacing;

const _data = generateData();

const AnimatedCard = ({
  item,
  index,
  scrollx,
}: {
  item: any;
  index: number;
  scrollx: SharedValue<number>;
}) => {
  const stylez = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        scrollx.value,
        [index - 1, index, index + 1],
        [0.5, 1, 0.5],
      ),
      transform: [
        {
          scale: interpolate(
            scrollx.value,
            [index - 1, index, index + 1],
            [0.9, 1, 0.9],
          ),
        },
      ],
    };
  });
  return (
    <Animated.View style={[styles.card, stylez]}>
      <Image style={styles.image} source={{uri: item.image}} />
    </Animated.View>
  );
};

const AnimatedDot = ({
  index,
  scrollx,
}: {
  index: number;
  scrollx: SharedValue<number>;
}) => {
  const animatedDotStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollx.value,
      [index - 1, index, index + 1],
      [0.8, 1, 0.8],
    );

    const scale = interpolate(
      scrollx.value,
      [index - 1, index, index + 1],
      [0.8, 1, 0.8],
    );

    return {
      opacity,
      transform: [{scale}],
    };
  });

  return (
    <Animated.View key={index} style={[styles.circle, animatedDotStyle]} />
  );
};

const Pagination = ({
  size,
  scrollx,
}: {
  size: number;
  scrollx: SharedValue<number>;
}) => {
  return (
    <Animated.View style={styles.pageContainer}>
      {Array.from({length: size}, (_, index) => {
        return <AnimatedDot key={index} index={index} scrollx={scrollx} />;
      })}
    </Animated.View>
  );
};

const AnimatedCarousel = () => {
  const scroll = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler(event => {
    scroll.value = event.contentOffset.x / _itemFullSize;
  });
  return (
    <View style={styles.container}>
      <Animated.FlatList
        horizontal
        contentContainerStyle={styles.listContainer}
        data={_data}
        renderItem={({item, index}) => (
          <AnimatedCard
            key={index}
            scrollx={scroll}
            index={index}
            item={item}
          />
        )}
        snapToInterval={_itemFullSize}
        decelerationRate="fast"
        onScroll={scrollHandler}
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
      />
      <Pagination scrollx={scroll} size={_data.length} />
    </View>
  );
};

export default AnimatedCarousel;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  card: {
    width: _itemSize,
    height: 250,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
    borderRadius: 20,
  },
  listContainer: {
    gap: _spacing * 2,
    padding: _spacing * 3,
    paddingHorizontal: _spacing * 12,
  },
  circle: {
    height: 10,
    width: 10,
    borderRadius: 10,
    backgroundColor: 'black',
  },
  pageContainer: {
    flexDirection: 'row',
    gap: _spacing,
  },
});
