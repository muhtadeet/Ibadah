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

// const useHadithOfTheDay = () => {
//   const [hadith, setHadith] = useState(null);

//   useEffect(() => {
//     const getHadithOfTheDay = async () => {
//       const response = await axios.get(
//         "https://random-hadith-generator.vercel.app/bukhari/"
//       );
//       const data = response.data;
//       setHadith(data);
//     };

//     getHadithOfTheDay();
//   }, []);

//   //   console.log(hadith.data.refno);
//   return hadith;
// };

const useHadithOfTheDay = () => {
  const [hadith, setHadith] = useState(null);
  const [date, setDate] = useState(new Date());

  const getHadithOfTheDay = useCallback(async () => {
    const itemData = await AsyncStorage.getItem("hadithOfTheDay");
    if (itemData) {
      const parsedData = JSON.parse(itemData);
      const parsedDate = new Date(parsedData.date);
      if (
        parsedDate.getDate() === date.getDate() &&
        parsedDate.getMonth() === date.getMonth() &&
        parsedDate.getFullYear() === date.getFullYear()
      ) {
        setHadith(parsedData);
      } else {
        try {
          const response = await axios.get(
            "https://random-hadith-generator.vercel.app/bukhari/"
          );
          const data = response.data;
          data.date = date;
          setHadith(data);
          await AsyncStorage.setItem("hadithOfTheDay", JSON.stringify(data));
        } catch (error) {
          console.error(error);
        }
      }
    } else {
      try {
        const response = await axios.get(
          "https://random-hadith-generator.vercel.app/bukhari/"
        );
        const data = response.data;
        data.date = date;
        setHadith(data);
        await AsyncStorage.setItem("hadithOfTheDay", JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    }
  }, [date]);

  useEffect(() => {
    getHadithOfTheDay();
  }, [getHadithOfTheDay, date]);

  return hadith;
};

const App = () => {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#37306B" });

  const paperTheme = useMemo(
    () =>
      colorScheme === "dark"
        ? { ...MD3LightTheme, colors: theme.light }
        : { ...MD3DarkTheme, colors: theme.dark },
    [colorScheme, theme]
  );

  const hadith = useHadithOfTheDay();

  if (!hadith) {
    return (
      <View
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme[colorScheme].onSecondaryContainer,
        }}
      >
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator
            size="large"
            color={theme[colorScheme].tertiaryContainer}
          />
        </View>
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
                // fontSize: 30,
                // marginTop: 10,
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
                // fontSize: 30,
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
