import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  Animated,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Cell from './components/Cell';
import {useGame} from './useGame';

const {height} = Dimensions.get('window');

export default function TicTacToe() {
  const {board, currentPlayer, makeMove, undoMove, winner, reset} = useGame();
  const [showOverlay, setShowOverlay] = useState(false);
  const slideAnim = useRef(new Animated.Value(height)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (winner) {
      setShowOverlay(true);
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: height,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
      ]).start(() => setShowOverlay(false));
    }
  }, [fadeAnim, slideAnim, winner]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Tic Tac Toe</Text>

        <View style={styles.turnContainer}>
          <Text style={styles.turnLabel}>Current Turn:</Text>
          <View
            style={[
              styles.playerIndicator,
              // eslint-disable-next-line react-native/no-inline-styles
              {backgroundColor: currentPlayer === 'X' ? '#e74c3c' : '#3498db'},
            ]}>
            <Text style={styles.playerText}>{currentPlayer}</Text>
          </View>
        </View>

        <View style={styles.board}>
          {board.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((cell, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  value={cell}
                  onPress={() => makeMove(rowIndex, colIndex)}
                />
              ))}
            </View>
          ))}
        </View>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={[styles.button, styles.undoButton]}
            onPress={undoMove}>
            <Text style={styles.buttonText}>Undo Move</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.resetButton]}
            onPress={reset}>
            <Text style={styles.buttonText}>Reset</Text>
          </TouchableOpacity>
        </View>
      </View>

      {showOverlay && (
        <Animated.View
          style={[
            styles.overlay,
            {
              opacity: fadeAnim,
              transform: [{translateY: slideAnim}],
            },
          ]}>
          <Text style={styles.overlayText}>
            {winner === 'draw' ? "It's a draw!" : `Winner is ${winner}! 🎉`}
          </Text>
          <TouchableOpacity style={styles.restartBtn} onPress={reset}>
            <Text style={styles.restartBtnText}>Restart Game</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  container: {
    flex: 1,
    paddingTop: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
  },
  turn: {
    fontSize: 18,
    marginBottom: 10,
  },
  board: {
    marginTop: 20,
  },
  row: {
    flexDirection: 'row',
  },
  buttonWrapper: {
    marginTop: 30,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(44, 62, 80, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  overlayText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  restartBtn: {
    backgroundColor: '#e67e22',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  restartBtnText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
    width: '60%',
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  undoButton: {
    backgroundColor: '#2980b9',
  },
  resetButton: {
    backgroundColor: '#c0392b',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 20,
    textAlign: 'center',
  },
  turnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'center',
  },
  turnLabel: {
    fontSize: 20,
    color: '#34495e',
    marginRight: 10,
  },
  playerIndicator: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: {width: 0, height: 1},
    shadowRadius: 2,
    elevation: 3,
  },
  playerText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
});
