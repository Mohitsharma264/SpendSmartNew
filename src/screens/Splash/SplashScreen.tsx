import React, { useEffect } from 'react';
import {
  SafeAreaView,
  Text,
  StyleSheet,
  StatusBar,
} from 'react-native';

import { Colors } from '../../constants/Colors';
import { Strings } from '../../constants/Strings';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onFinish) {
        onFinish();
      }
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        backgroundColor={Colors.primary}
        barStyle="light-content"
      />

      <Text style={styles.logo}>💰</Text>

      <Text style={styles.title}>
        {Strings.appName}
      </Text>

      <Text style={styles.tagline}>
        {Strings.tagline}
      </Text>
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    fontSize: 70,
  },

  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: Colors.white,
    marginTop: 15,
  },

  tagline: {
    color: Colors.white,
    fontSize: 16,
    marginTop: 10,
  },
});