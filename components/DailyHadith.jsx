import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  Appbar,
  Card,
  Divider,
  Text,
  Icon,
} from "react-native-paper";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  useColorScheme,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const useHadithOfTheDay = () => {
  const [hadith, setHadith] = useState(null);

  const getHadithOfTheDay = useCallback(async () => {
    const today = new Date().toDateString();
    const cacheKey = 'hadithOfTheDay';
    const lastFetchDateKey = 'lastFetchDateHadith';

    try {
      // Check when we last fetched the data
      const lastFetchDate = await AsyncStorage.getItem(lastFetchDateKey);

      // If we've already fetched today, use the cached data
      if (lastFetchDate === today) {
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
          setHadith(JSON.parse(cachedData));
          return;
        }
      }

      // If we haven't fetched today, make API call
      const response = await axios.get(
        "https://random-hadith-generator.vercel.app/bukhari/"
      );
      const data = response.data;

      // Cache the data
      await AsyncStorage.setItem(cacheKey, JSON.stringify(data));
      // Update the last fetch date
      await AsyncStorage.setItem(lastFetchDateKey, today);

      setHadith(data);
    } catch (error) {
      console.error("Error fetching hadith:", error);
    }
  }, []);

  useEffect(() => {
    getHadithOfTheDay();
  }, [getHadithOfTheDay]);

  return hadith;
};

const App = () => {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#37306B" });

  const paperTheme = useMemo(
    () =>
      colorScheme === "light"
        ? { ...MD3LightTheme, colors: theme.dark }
        : { ...MD3DarkTheme, colors: theme.light },
    [colorScheme, theme]
  );

  const hadith = useHadithOfTheDay();

  if (!hadith) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme[colorScheme].onSecondaryContainer,
        }}
      >
        <ActivityIndicator
          size="large"
          color={theme[colorScheme].tertiaryContainer}
        />
      </View>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <View>
        <Card
          elevation={1}
          style={{ marginHorizontal: 20, paddingTop: 15, marginBottom: 30 }}
        >
          <Card.Title
            title="Hadith of the Day"
            titleVariant="titleLarge"
            titleStyle={{ color: theme[colorScheme].tertiaryContainer }}
          />
          <Card.Content>
            <Text
              variant="titleMedium"
              style={{
                color: theme[colorScheme].surfaceVariant,
              }}
            >
              {hadith.data.header}
              {"\n"}
              {hadith.data.hadith_english}
            </Text>
            <Text
              variant="titleMedium"
              style={{
                marginTop: 15,
                paddingBottom: 10,
                color: theme[colorScheme].surfaceVariant,
              }}
            >
              -{hadith.data.refno}
            </Text>
          </Card.Content>
        </Card>
      </View>
    </PaperProvider>
  );
};

export default App;