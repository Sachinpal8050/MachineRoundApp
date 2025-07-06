import {View, Text, StyleSheet, Pressable} from 'react-native';
import React from 'react';

export default function Folder({node}: {node: any}) {
  const [show, setShow] = React.useState(true);
  const toggle = () => {
    setShow(!show);
  };
  return (
    <View style={styles.container}>
      <Pressable onPress={toggle}>
        <Text style={styles.folderName}>📁 {node.name}</Text>
      </Pressable>

      {show && (
        <View style={styles.ml20}>
          {node?.files?.map((file: string, index: number) => (
            <Text key={index} style={styles.file}>
              📄 {file}
            </Text>
          ))}

          {node?.children?.map((child: any) => (
            <Folder key={child.id} node={child} />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
  },
  ml20: {
    marginLeft: 20,
    marginTop: 4,
  },
  folderName: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  file: {
    fontSize: 14,
    marginVertical: 2,
  },
});
