import {NavigationContainerRef} from '@react-navigation/native';
import {createRef} from 'react';

export const navigationRef = createRef<NavigationContainerRef<any>>();

export const navigateToRiskScreen = () => {
  if (navigationRef.current?.isReady()) {
    navigationRef.current?.navigate('RiskProfile');
  }
};

export const popBack = () => {
  if (navigationRef.current?.canGoBack()) {
    navigationRef.current?.goBack();
  }
};
