import { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  useColorScheme,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  Appbar,
  Card,
  Divider,
  Text,
  Icon,
  Button,
} from "react-native-paper";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

const Home = () => {
  const systemColorScheme = useColorScheme();
  const [colorScheme, setColorScheme] = useState(systemColorScheme);
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#37306B" });

  const paperTheme = useMemo(
    () =>
      colorScheme === "dark"
        ? { ...MD3DarkTheme, colors: theme.dark }
        : { ...MD3LightTheme, colors: theme.light },
    [colorScheme, theme]
  );

  const toggleColorScheme = useCallback(() => {
    setColorScheme((prevScheme) => (prevScheme === "dark" ? "light" : "dark"));
  }, []);

  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaView
        style={{
          backgroundColor: theme[colorScheme].primaryContainer,
          flex: 1,
        }}
      >
        <Appbar.Header>
          <Appbar.Content title="Home" />
          <Button mode="contained" onPress={toggleColorScheme}>
            Toggle Mode
          </Button>
        </Appbar.Header>
        <ScrollView>
          <View style={{ padding: 16 }}>
            <Text>Welcome to the home screen!</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
};

export default Home;
