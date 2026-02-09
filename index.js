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
import UpdateCound from './src/poc/updateAnimatedCount/index';
import InfiniteCarousel from './src/poc/infiniteCarousel/index';
import AnimatedCarousel from './src/poc/animatedCarousel/index';
import AnimatedTextLoop from './src/poc/animatedText/index';
import Round8 from './src/round8/index';

// import MatrixColorGame from './src/fun/matrixColorGame/index';

AppRegistry.registerComponent(appName, () => Round8);
