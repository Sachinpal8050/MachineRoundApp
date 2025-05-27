import {View, Text, StyleSheet, DeviceEventEmitter} from 'react-native';
import React, {useCallback, useContext, useEffect, useState} from 'react';
import ToastContainer from '.';
import {ToastListMessageType, ToastMessageType} from './types';

type ToastContextType = {
  showToast: ({message, type}: ToastMessageType) => void;
};

const TIMER = 7000;
const MAX_TOAST_COUNT = 3;
const ToastContext = React.createContext<ToastContextType | null>(null);

const ToastProvider = ({children}: {children: any}) => {
  const [toastList, setToastList] = useState<ToastListMessageType[]>([]);

  const removeToast = (id: number) => {
    setToastList(prev => prev.filter(toast => toast.id !== id));
  };

  const showToast = useCallback(({message, type}: ToastMessageType) => {
    setToastList(prev => {
      let newToast = {id: Date.now(), message, type};
      setTimeout(() => {
        removeToast(newToast.id);
      }, TIMER);
      let updatedToast = [newToast, ...prev].slice(0, MAX_TOAST_COUNT);
      return updatedToast;
    });
  }, []);

  useEffect(() => {
    const listner = DeviceEventEmitter.addListener('showAppToast', value => {
      showToast(value);
    });
    return () => listner.remove();
  }, [showToast]);

  return (
    <ToastContext.Provider value={{showToast}}>
      {children}
      <ToastContainer removeToast={removeToast} toasts={toastList} />
    </ToastContext.Provider>
  );
};

export default ToastProvider;

export const useShowToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useShowToast must be used within ToastProvider');
  }
  return ctx;
};
