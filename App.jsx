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
import Quran from "./components/Quran";

const App = () => {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#37306B" });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "home",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "times",
      title: "Salah Times",
      focusedIcon: "timer-sand",
      unfocusedIcon: "timer-sand-empty",
    },
    {
      key: "quran",
      title: "Quran",
      focusedIcon: "book-open-page-variant",
      unfocusedIcon: "book-open-variant",
    },
    {
      key: "hadith",
      title: "Hadith",
      focusedIcon: "book-open-page-variant",
      unfocusedIcon: "book-open-variant",
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
  const QuranRoute = () => <Quran />;
  const HadithRoute = () => <Hadith />;

  const renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    times: PrayerRoute,
    quran: QuranRoute,
    hadith: HadithRoute,
  });

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar translucent style="auto" />
      <BottomNavigation
        shifting
        sceneAnimationType="opacity"
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </PaperProvider>
  );
};

export default App;
