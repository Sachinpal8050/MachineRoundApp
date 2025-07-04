import React from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';

export default function RegNumberField({
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
    // Allow only uppercase A-Z and digits, remove spaces
    const cleaned = text.toUpperCase().replace(/[^A-Z0-9]/g, '');
    onChange(config.name, cleaned);
  };

  return (
    <View style={styles.container}>
      <Text>{config.label}</Text>
      <TextInput
        value={value}
        onChangeText={handleChange}
        onBlur={() => onBlur(config)}
        placeholder={config.placeholder || 'e.g. MH12AB1234'}
        autoCapitalize="characters"
        maxLength={10} // Standard Indian reg numbers are 10 characters
        style={[
          styles.textInput,
          {
            borderColor: error ? 'red' : '#ccc',
          },
        ]}
      />
      {error && <Text style={styles.error}>{error}</Text>}
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
  error: {
    color: 'red',
    marginTop: 4,
  },
});
