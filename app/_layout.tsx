import { Slot } from "expo-router";
import { StatusBar, useColorScheme } from "react-native";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  BottomNavigation,
} from "react-native-paper";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { useMemo, useState } from "react";
import { useRouter, usePathname } from "expo-router";
import SalahTimes from "@/components/SalahTimes";
import Quran from "@/components/Quran";

export default function AppLayout() {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#37306B" });
  const router = useRouter();
  const pathname = usePathname();

  const paperTheme = useMemo(
    () =>
      colorScheme === "light"
        ? { ...MD3LightTheme, colors: theme.dark }
        : { ...MD3DarkTheme, colors: theme.light },
    [colorScheme, theme]
  );

  const [routes] = useState([
    {
      key: "index",
      title: "Home",
      focusedIcon: "home",
      unfocusedIcon: "home-outline",
    },
    {
      key: "salah-times",
      title: "Salah Times",
      focusedIcon: "timer-sand",
      unfocusedIcon: "timer-sand-empty",
    },
    {
      key: "quran",
      title: "Quran",
      focusedIcon: "book-open-page-variant-outline",
      unfocusedIcon: "book",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    index: () => <Slot />,
    "salah-times": SalahTimes,
    "quran": Quran,
  });

  const getActiveIndex = () => {
    if (pathname === "/") return 0;
    return (
      routes.findIndex((route) => pathname.startsWith(`/${route.key}`)) || 0
    );
  };

  return (
    <PaperProvider theme={paperTheme}>
      <StatusBar barStyle={"light-content"} />
      <BottomNavigation
        navigationState={{ index: getActiveIndex(), routes }}
        onIndexChange={(index) =>
          router.push(
            `/${routes[index].key === "index" ? "" : routes[index].key}`
          )
        }
        renderScene={renderScene}
        shifting={true}
        sceneAnimationType="opacity"
        labeled={false}
      />
    </PaperProvider>
  );
}
