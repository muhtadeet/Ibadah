import { useEffect, useMemo, useState } from "react";
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
import { SafeAreaView, ScrollView, useColorScheme, View } from "react-native";

const useHadithOfTheDay = () => {
  const [hadith, setHadith] = useState(null);

  useEffect(() => {
    const getHadithOfTheDay = async () => {
      const response = await axios.get(
        "https://random-hadith-generator.vercel.app/bukhari/"
      );
      const data = response.data;
      setHadith(data);
    };

    getHadithOfTheDay();
  }, []);

  //   console.log(hadith.data.refno);
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
    return <Text>Loading...</Text>;
  }

  return (
    <PaperProvider theme={paperTheme}>
      <View style={{marginTop: 40}}>
        <Card elevation={1} style={{ marginHorizontal: 20, paddingTop: 15 }}>
          <Card.Title title="Hadith of the Day" titleVariant="headlineMedium" />
          <Card.Content>
            <Text
              variant="titleLarge"
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
              variant="titleLarge"
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
