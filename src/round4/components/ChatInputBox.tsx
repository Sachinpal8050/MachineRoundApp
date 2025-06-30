import {View, Text, StyleSheet, TextInput, Pressable} from 'react-native';
import React, {useState} from 'react';
import Suggestions from './Suggestions';

export default function ChatInputBox({
  handleSendMessage,
}: {
  handleSendMessage: (msg: string) => void;
}) {
  const [input, setInput] = useState('');

  const onSendMessage = () => {
    if (input.length > 0) {
      handleSendMessage(input);
      setInput('');
    }
  };

  const onSelectWidget = (text: string) => {
    handleSendMessage(text);
  };

  return (
    <>
      <Suggestions
        onSelectWidget={onSelectWidget}
        suggestions={['Hi', 'Hello', 'How are you?', 'Access Risk Profiling']}
      />
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          value={input}
          onChangeText={setInput}
        />
        <Pressable style={styles.btn} onPress={onSendMessage}>
          <Text style={styles.btnText}>Send</Text>
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
    margin: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    alignItems: 'center',
    elevation: 2,
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 20,
    fontSize: 16,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  btn: {
    backgroundColor: '#ff7f50',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  btnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
