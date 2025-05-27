import {Text, StyleSheet, Pressable, Animated} from 'react-native';
import React from 'react';
import {removeItem} from '../store';

const HEADER_HEIGHT = 60;

type HeaderProps = {
  translateY: Animated.AnimatedInterpolation<string | number>;
  onLOgOutPress: () => void;
  onChangeColumnPress: () => void;
};

const Header = ({
  translateY,
  onLOgOutPress,
  onChangeColumnPress,
}: HeaderProps) => {
  const handleLogOut = async () => {
    await removeItem('isLoggedIn');
    onLOgOutPress();
  };
  return (
    <Animated.View style={[styles.container, {transform: [{translateY}]}]}>
      <Pressable onPress={handleLogOut} style={styles.btn}>
        <Text>Log Out</Text>
      </Pressable>
      <Pressable onPress={onChangeColumnPress} style={styles.btn}>
        <Text>Change Col</Text>
      </Pressable>
    </Animated.View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: HEADER_HEIGHT,
    zIndex: 1000,
    backgroundColor: 'orange',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  btn: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
});
