/**
 * @format
 */

import {AppRegistry} from 'react-native';
// import App from './App';
import {name as appName} from './app.json';
import Round4 from './src/round4/index';
import DynamicFormScreen from './src/poc/formBuilder/screens/DynamicFormScreen';
import FileExploer from './src/poc/fileExploer/index';
import TicTaiToe from './src/poc/ticTaiToe/index';

AppRegistry.registerComponent(appName, () => TicTaiToe);
