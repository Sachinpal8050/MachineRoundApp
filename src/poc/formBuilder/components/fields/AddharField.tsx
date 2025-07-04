import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

export default function AadhaarInputField({
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
  const handleChange = (text: string) => {
    // Remove non-digit characters and limit to 12 digits
    const digitsOnly = text.replace(/\D/g, '').slice(0, 12);
    onChange(config.name, digitsOnly);
  };

  return (
    <View style={styles.container}>
      <Text>{config.label}</Text>
      <TextInput
        value={value}
        onChangeText={handleChange}
        onBlur={() => onBlur(config)}
        placeholder={config.placeholder || 'Enter Aadhaar Number'}
        keyboardType="numeric"
        maxLength={12}
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
