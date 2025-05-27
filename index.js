/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import {name as appName} from './app.json';
import Round1 from './src/round1/index';

AppRegistry.registerComponent(appName, () => Round1);
