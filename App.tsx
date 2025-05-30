// App.tsx
import React, { useState, useEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import NameScreen from './src/screens/NameScreen';
import SchoolScreen from './src/screens/SchoolScreen';
import EducationScreen from './src/screens/EducationScreen';
import StudyTimeScreen from './src/screens/StudyTimeScreen';
import TimerScreen from './src/screens/TimerScreen';
import LeaderboardScreen from './src/screens/LeaderboardScreen';

export type OnboardingStackParamList = {
  Name: undefined;
  School: { name: string };
  Education: { name: string; school: string };
  StudyTime: { name: string; school: string; education: string };
};

export type TabParamList = {
  Timer: undefined;
  Leaderboard: undefined;
};

const OnboardingStack = createStackNavigator<OnboardingStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();
const RootStack = createStackNavigator();

const MainTabs = () => (
  <Tab.Navigator>
    <Tab.Screen name="Timer" component={TimerScreen} />
    <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
  </Tab.Navigator>
);

const App = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Force onboarding every time during development
    AsyncStorage.removeItem('userId');

    AsyncStorage.getItem('userId').then(id => {
      setUserId(id);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <PaperProvider>
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          {!userId ? (
            <RootStack.Screen name="Onboarding" options={{ headerShown: false }}>
              {() => (
                <OnboardingStack.Navigator screenOptions={{ headerShown: false }}>
                  <OnboardingStack.Screen name="Name" component={NameScreen} />
                  <OnboardingStack.Screen name="School" component={SchoolScreen} />
                  <OnboardingStack.Screen name="Education" component={EducationScreen} />
                  <OnboardingStack.Screen name="StudyTime" component={StudyTimeScreen} />
                </OnboardingStack.Navigator>
              )}
            </RootStack.Screen>
          ) : null}
          <RootStack.Screen name="MainTabs" component={MainTabs} />
        </RootStack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
};

export default App;
