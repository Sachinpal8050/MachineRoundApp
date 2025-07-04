import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

export default function TextInputField({
  config,
  value,
  onChange,
  onBlur,
  error,
}: {
  config: any;
  value: string;
  onChange: (name: string, value: string) => void;
  onBlur: (config: any) => void;
  error: string;
}) {
  return (
    <View style={styles.container}>
      <Text>{config.label}</Text>
      <TextInput
        value={value}
        onChangeText={text => onChange(config.name, text)}
        onBlur={() => onBlur(config)}
        placeholder={config.placeholder || ''}
        style={[
          styles.textInput,
          {
            borderColor: error ? 'red' : '#ccc',
          },
        ]}
      />
      {error && <Text style={{color: 'red', marginTop: 4}}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {marginBottom: 16},
  textInput: {
    borderWidth: 1,
    padding: 8,
    borderRadius: 4,
  },
});
