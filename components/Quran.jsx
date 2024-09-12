import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import QuranTab from "./QuranTab";
import SurahDetail from "./SurahDetail";

const Stack = createStackNavigator();

const QuranNavigator = () => (
  <Stack.Navigator screenOptions={{
    headerShown: false
  }}>
    <Stack.Screen
      name="QuranTab"
      component={QuranTab}
      options={{ title: "Quran" }}
    />
    <Stack.Screen
      name="SurahDetail"
      component={SurahDetail}
      options={({ route }) => ({ title: route.params.surah.englishName })}
    />
  </Stack.Navigator>
);

const Quran = () => (
  <NavigationContainer independent>
    <QuranNavigator />
  </NavigationContainer>
);

export default Quran;
