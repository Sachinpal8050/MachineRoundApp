import {View, Text, StyleSheet, Pressable} from 'react-native';
import React, {useRef, useState} from 'react';

const DIAMETIONS = 4;
const colors = ['red', 'orange', 'yellow'];

const Box = ({
  column,
  row,
  onPress,
  isTreeTicled,
}: {
  column: number;
  row: number;
  onPress: (x: number, y: number, revelColor: string) => void;
  isTreeTicled: boolean;
}) => {
  const [isClickable, setIsClickable] = useState(false);
  const clickedRef = useRef(false);
  const [color] = useState(
    () => colors[Math.floor(Math.random() * colors.length)],
  );
  const handlePress = () => {
    if (clickedRef.current) {
      return;
    }
    clickedRef.current = true;
    onPress(column, row, color);
    setIsClickable(true);
  };
  return (
    <Pressable disabled={isClickable || isTreeTicled} onPress={handlePress}>
      <View
        style={[styles.box, {backgroundColor: !isClickable ? 'gray' : color}]}
      />
    </Pressable>
  );
};

const MatrixColorGame = () => {
  const count = useRef(0);
  const [isTreeTicled, setIsTreeTiled] = useState(false);
  const colorMap = useRef<{[key: string]: number}>({});

  const onPress = (x: number, y: number, revelColor: string) => {
    colorMap.current[revelColor] = (colorMap.current[revelColor] || 0) + 1;
    count.current += 1;
    console.log(count.current, colorMap.current);

    if (colorMap.current[revelColor] === DIAMETIONS) {
      setIsTreeTiled(true);
    }
  };
  return (
    <View>
      {Array.from({length: DIAMETIONS}, (_, column) => {
        return (
          <View key={column} style={styles.row}>
            {Array.from({length: DIAMETIONS}, (_, row) => {
              return (
                <Box
                  key={row + column}
                  onPress={onPress}
                  column={column}
                  row={row}
                  isTreeTicled={isTreeTicled}
                />
              );
            })}
          </View>
        );
      })}
      {isTreeTicled && <Text style={{fontSize: 30}}>{count.current}</Text>}
    </View>
  );
};

export default MatrixColorGame;

const styles = StyleSheet.create({
  box: {
    height: 50,
    width: 50,
    backgroundColor: 'gray',
    margin: 20,
  },
  row: {
    flexDirection: 'row',
    gap: 20,
  },
});
