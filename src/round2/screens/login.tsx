import React from 'react';
import {View, Text, StyleSheet, TextInput, Pressable} from 'react-native';
import {getItem, setItem} from '../store';
import {get} from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

const LogIn = ({
  setIsLogIn,
  setIsSignup,
}: {
  setIsLogIn: (val: boolean) => void;
  setIsSignup: (val: boolean) => void;
}) => {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = async () => {
    const useDataPass = await getItem(email);
    if (useDataPass && useDataPass === password) {
      await setItem('isLoggedIn', 'true');
      setIsLogIn(true);
    } else {
      setIsSignup(true);
    }
  };

  const handleSignupPress = () => {};
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
      <Pressable onPress={handleLogin} style={styles.logInbtn}>
        <Text>Login</Text>
      </Pressable>
      <Pressable onPress={handleSignupPress} style={styles.signUp}>
        <Text style={styles.signUpText}>SignUp</Text>
      </Pressable>
    </View>
  );
};

export default LogIn;

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
