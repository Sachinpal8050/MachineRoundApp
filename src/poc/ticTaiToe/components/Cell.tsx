import React, {useEffect, useRef} from 'react';
import {Animated, Pressable, StyleSheet, Easing} from 'react-native';

export default function Cell({
  value,
  onPress,
}: {
  value: string | null;
  onPress: () => void;
}) {
  const scale = useRef(new Animated.Value(1)).current;
  const fade = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  useEffect(() => {
    if (value) {
      Animated.timing(fade, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
        easing: Easing.out(Easing.ease),
      }).start();
    } else {
      fade.setValue(0);
    }
  }, [fade, value]);

  const animatedStyle = {
    transform: [{scale}],
  };

  return (
    <Pressable onPress={handlePress} disabled={!!value}>
      <Animated.View style={[styles.cell, animatedStyle]}>
        <Animated.Text
          style={[
            styles.cellText,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              opacity: fade,
              color: value === 'X' ? '#e74c3c' : '#3498db',
            },
          ]}>
          {value}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: '#2c3e50',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ecf0f1',
    margin: 2,
    borderRadius: 12,
  },
  cellText: {
    fontSize: 36,
    fontWeight: '900',
  },
});
