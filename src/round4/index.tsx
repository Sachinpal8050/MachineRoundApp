import {View, StyleSheet, Text, ToastAndroid} from 'react-native';
import React, {useState} from 'react';
import Header from './components/header';
import ChatWindow from './components/ChatWindow';
import ChatInputBox from './components/ChatInputBox';
import AccessMyProfile from './components/AccessMyProfile';
import {sendMesageToServer} from './service';

function App() {
  const [inputData, setInputData] = useState([]);

  const handleSendMessage = async (message: string) => {
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

export default App;

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
