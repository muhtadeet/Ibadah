import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  FlatList,
  Pressable,
  useColorScheme,
} from "react-native";
import {
  Text,
  Card,
  ActivityIndicator,
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  Appbar,
  Button,
} from "react-native-paper";
import axios from "axios";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_KEY = '@QuranSurahs';

const QuranTab = ({ navigation }) => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#37306B" });

  useEffect(() => {
    loadSurahs();
  }, []);

  const loadSurahs = async () => {
    try {
      // Try to load data from cache
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      if (cachedData) {
        console.log("Loading surahs from cache");
        setSurahs(JSON.parse(cachedData));
        setLoading(false);
      } else {
        // If no cached data, fetch from API
        await fetchSurahs();
      }
    } catch (error) {
      console.error("Error loading surahs:", error);
      setError(error.message || "An error occurred while loading surahs");
      setLoading(false);
    }
  };

  const fetchSurahs = async () => {
    try {
      console.log("Fetching surahs from API...");
      const response = await axios.get("http://api.alquran.cloud/v1/surah");
      const fetchedSurahs = response.data.data;
      console.log("Surahs fetched successfully:", fetchedSurahs.length);
      
      // Cache the fetched data
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(fetchedSurahs));
      
      setSurahs(fetchedSurahs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching surahs:", error);
      setError(error.message || "An error occurred while fetching surahs");
      setLoading(false);
    }
  };

  const paperTheme = useMemo(
    () =>
      colorScheme === "light"
        ? { ...MD3LightTheme, colors: theme.dark }
        : { ...MD3DarkTheme, colors: theme.light },
    [colorScheme, theme]
  );

  const renderSurahItem = ({ item }) => (
    <Pressable
      onPress={() => navigation.navigate("SurahDetail", { surah: item })}
    >
      <Card style={{ margin: 5 }}>
        <Card.Content>
          <Text
            variant="titleMedium"
            style={{
              color: theme[colorScheme].tertiaryContainer,
            }}
          >
            {item.number}. {item.englishName}
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              color: theme[colorScheme].primaryContainer,
            }}
          >
            {item.englishNameTranslation}
          </Text>
        </Card.Content>
      </Card>
    </Pressable>
  );

  if (loading) {
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
          color={theme[colorScheme].primaryContainer}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme[colorScheme].onSecondaryContainer,
        }}
      >
        <Text style={{ color: theme[colorScheme].error, marginBottom: 20 }}>
          {error}
        </Text>
        <Button mode="contained" onPress={loadSurahs}>
          Retry
        </Button>
      </View>
    );
  }

  return (
    <PaperProvider theme={paperTheme}>
      <Appbar.Header
        mode="center-aligned"
        style={{
          backgroundColor: theme[colorScheme].onSecondaryContainer,
          color: theme[colorScheme].primaryContainer,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          marginTop: 20,
        }}
      >
        <Appbar.Content
          title="Quran"
          titleStyle={{
            color: theme[colorScheme].primaryContainer,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </Appbar.Header>
      <View
        style={{
          backgroundColor: theme[colorScheme].onSecondaryContainer,
          flex: 1,
        }}
      >
        <FlatList
          data={surahs}
          renderItem={renderSurahItem}
          keyExtractor={(item) => item.number.toString()}
          style={{
            marginHorizontal: 5,
            marginTop: 10,
          }}
        />
      </View>
    </PaperProvider>
  );
};

export default QuranTab;