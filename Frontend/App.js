import React from 'react';
import {View, LogBox} from 'react-native';
import AppContainer from './src/Configs/AppContainer';
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import FlashMessage from 'react-native-flash-message';

export default function App() {
  LogBox.ignoreAllLogs();
  const initialState = {
    user: null,
    refreshCart: false,
  };

  function reducer(state = initialState, action) {
    switch (action.type) {
      case 'user':
        return {...state, user: action.data};
      case 'refreshCart':
        return {...state, refreshCart: action.data};
      default:
        return state;
    }
  }

  const store = createStore(reducer);

  return (
    <Provider store={store}>
      <View style={{flex: 1}}>
        <AppContainer />
        <FlashMessage position="top" />
      </View>
    </Provider>
  );
}
