import React from 'react';
import {View, Text, StyleSheet, TextInput, Pressable} from 'react-native';
import {setItem} from '../store';

const SignUp = ({setIsLogIn}: {setIsLogIn: (val: boolean) => void}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSignupPress = async () => {
    await setItem(email, password);
    setIsLogIn(true);
  };

  const handleLoginPress = () => {};
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        autoCapitalize="none"
      />
      <Pressable onPress={handleSignupPress} style={styles.logInbtn}>
        <Text>SignUp</Text>
      </Pressable>
      <Pressable onPress={handleLoginPress} style={styles.signUp}>
        <Text style={styles.signUpText}>Log In</Text>
      </Pressable>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  logInbtn: {
    backgroundColor: 'orange',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  signUp: {
    marginTop: 50,
  },
  signUpText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
