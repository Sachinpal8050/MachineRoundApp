import {View, StyleSheet, ToastAndroid} from 'react-native';
import React, {useState} from 'react';
import {sendMesageToServer} from '../service';
import Header from '../components/header';
import ChatWindow from '../components/ChatWindow';
import ChatInputBox from '../components/ChatInputBox';
import {navigateToRiskScreen} from '../navigation';

function ChatScreen() {
  const [inputData, setInputData] = useState([]);

  const handleSendMessage = async (message: string) => {
    if (message === 'Access Risk Profiling') {
      navigateToRiskScreen();
      return;
    }
    const singleMessage = {
      id: Date.now(),
      message: message,
      messageType: 'text',
    };
    const isSuccess = await sendMesageToServer(message);
    if (isSuccess) {
      setInputData(prev => [singleMessage, ...prev]);
    } else {
      ToastAndroid.show('Failed to send message', ToastAndroid.BOTTOM);
    }
  };

  return (
    <View style={style.container}>
      <Header title="Chat" />
      <ChatWindow chatList={inputData} />
      <ChatInputBox handleSendMessage={handleSendMessage} />
    </View>
  );
}

export default ChatScreen;

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  text: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#940fdb',
  },
  listStyle: {
    gap: 20,
  },
  textInputStyle: {
    borderWidth: 1,
  },
});
