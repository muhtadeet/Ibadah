import { useMemo, useState } from "react";
import { useColorScheme } from "react-native";
import { StatusBar } from "expo-status-bar";

import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  BottomNavigation,
} from "react-native-paper";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import Home from "./components/Home";
import SalahTimes from "./components/SalahTimes";

export default App = () => {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#37306B" });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home-variant",
      unfocusedIcon: "home-variant-outline",
    },
    {
      key: "times",
      title: "Salah Times",
      focusedIcon: "clock",
      unfocusedIcon: "clock-outline",
    },
  ]);

  const paperTheme = useMemo(
    () =>
      colorScheme === "dark"
        ? { ...MD3LightTheme, colors: theme.light }
        : { ...MD3DarkTheme, colors: theme.dark },
    [colorScheme, theme]
  );

  const HomeRoute = () => <Home />;
  const PrayerRoute = () => <SalahTimes />;

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    times: PrayerRoute,
  });

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar translucent style="auto" />
      <BottomNavigation
        shifting
        sceneAnimationType="shifting"
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </PaperProvider>
  );
};
