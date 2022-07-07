/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import type {Node} from 'react';
import { SafeAreaView } from 'react-native';

import { SetupScreen } from './Setup/Setup';

const App: () => Node = () => {

  const backgroundStyle = {
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <SetupScreen />
    </SafeAreaView>
  );
};

export default App;
