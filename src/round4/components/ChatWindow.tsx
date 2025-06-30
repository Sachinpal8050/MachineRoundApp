import {View, Text, StyleSheet, FlatList} from 'react-native';
import React from 'react';

enum messageType {
  text = 'text',
  image = 'image',
}

export default function ChatWindow(props: any) {
  const {chatList = []} = props;
  const renderItem = ({
    item,
  }: {
    item: {id: number; messageType: messageType; message: string};
  }) => {
    switch (item.messageType) {
      case messageType.text:
        return (
          <View key={item.id} style={style.messageContainer}>
            <Text style={style.messageText}>{item.message}</Text>
          </View>
        );
      default:
        return <></>;
    }
  };

  return (
    <View style={style.container}>
      <FlatList
        contentContainerStyle={style.list}
        renderItem={renderItem}
        data={chatList}
        inverted
      />
    </View>
  );
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#940fdb',
  },
  list: {},
  messageText: {
    fontSize: 16,
    color: '#333',
  },
  messageContainer: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 10,
    borderRadius: 10,
    alignSelf: 'flex-start',
    maxWidth: '80%',
    borderWidth: 1,
    borderColor: 'gray',
  },
});
