import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  FlatList,
  TouchableOpacity,
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
} from "react-native-paper";
import axios from "axios";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";

const QuranTab = ({ navigation }) => {
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);

  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#37306B" });

  useEffect(() => {
    fetchSurahs();
  }, []);

  const fetchSurahs = async () => {
    try {
      const response = await axios.get("http://api.alquran.cloud/v1/surah");
      setSurahs(response.data.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching surahs:", error);
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
        {/* <ScrollView> */}
        <FlatList
          data={surahs}
          renderItem={renderSurahItem}
          keyExtractor={(item) => item.number.toString()}
          style={{
            marginHorizontal: 5,
            marginTop: 10,
          }}
        />
        {/* </ScrollView> */}
      </View>
    </PaperProvider>
  );
};

export default QuranTab;
