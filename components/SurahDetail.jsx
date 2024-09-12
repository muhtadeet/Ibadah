import React, { useState, useEffect, useMemo } from "react";
import { View, ScrollView, useColorScheme } from "react-native";
import {
  Text,
  ActivityIndicator,
  MD3LightTheme,
  MD3DarkTheme,
  PaperProvider,
  Appbar,
} from "react-native-paper";
import axios from "axios";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

const SurahDetail = ({ route }) => {
  const { surah } = route.params;
  const [verses, setVerses] = useState([]);
  const [versesEn, setVersesEn] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurahDetails();
    fetchSurahDetailsEn();
  }, [surah.number]);

  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#37306B" });
  const paperTheme = useMemo(
    () =>
      colorScheme === "light"
        ? { ...MD3LightTheme, colors: theme.dark }
        : { ...MD3DarkTheme, colors: theme.light },
    [colorScheme, theme]
  );

  const fetchSurahDetails = async () => {
    try {
      const response = await axios.get(
        `http://api.alquran.cloud/v1/surah/${surah.number}`
      );
      setVerses(response.data.data.ayahs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching surah details:", error);
      setLoading(false);
    }
  };

  const fetchSurahDetailsEn = async () => {
    try {
      const response = await axios.get(
        `http://api.alquran.cloud/v1/surah/${surah.number}/en.asad`
      );
      setVersesEn(response.data.data.ayahs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching surah details:", error);
      setLoading(false);
    }
  };

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
          title={surah.englishName}
          titleStyle={{
            color: theme[colorScheme].tertiaryContainer,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        />
      </Appbar.Header>
      <ScrollView
        style={{
          paddingHorizontal: 15,
          paddingVertical: 10,
          backgroundColor: theme[colorScheme].onSecondaryContainer,
        }}
      >
        <Text
          variant="titleMedium"
          style={{
            marginBottom: 30,
            alignSelf: "center",
            color: theme[colorScheme].primaryContainer,
          }}
        >
          {surah.englishNameTranslation}
        </Text>
        {verses.map((verse, index) => (
          <View
            key={verse.number}
            style={{ marginBottom: 40, marginHorizontal: 10, gap: 5 }}
          >
            <Text variant="titleLarge" style={{ alignSelf: "flex-end" }}>
              {verse.text}
            </Text>
            <Text
              variant="bodyMedium"
              style={{
                fontStyle: "italic",
              }}
            >
              {versesEn[index]?.numberInSurah} {versesEn[index]?.text}
            </Text>
          </View>
        ))}
      </ScrollView>
    </PaperProvider>
  );
};

export default SurahDetail;
