import { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  useColorScheme,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
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
} from "react-native-paper";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import axios from "axios";

const Quran = () => {
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#37306B" });
  const paperTheme = useMemo(
    () =>
      colorScheme === "dark"
        ? { ...MD3LightTheme, colors: theme.light }
        : { ...MD3DarkTheme, colors: theme.dark },
    [colorScheme, theme]
  );
  const [quran, setQuran] = useState();
  const getQuran = useCallback(async () => {
    try {
      const response = await axios.get(
        `http://api.alquran.cloud/v1/quran/quran-uthmani`
      );

      if (response.data.data) {
        setQuran(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getQuran();
  }, [getQuran]);

  if (!quran) {
    return (
      <View
        style={{
          flex: 1,
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

  console.log(quran.surahs[1].englishName);
  return (
    <>
      <PaperProvider theme={paperTheme}>
        <Appbar.Header
          mode="center-aligned"
          style={{
            backgroundColor: theme[colorScheme].onSecondaryContainer,
            color: theme[colorScheme].primaryContainer,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Appbar.Content
            title=""
            titleStyle={{
              color: theme[colorScheme].primaryContainer,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </Appbar.Header>
        <SafeAreaView
          style={{
            backgroundColor: theme[colorScheme].onSecondaryContainer,
            flex: 1,
          }}
        >
          <ScrollView>
            <Card elevation={0} style={{ marginHorizontal: 20, marginTop: 20 }}>
              {/* <Card.Title
                title="Ramadan Mubarak"
                titleVariant="headlineSmall"
              /> */}
              <Card.Content
                style={{
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <Text
                  variant="displayMedium"
                  style={{ color: theme[colorScheme].tertiaryContainer }}
                >
                  Quran
                </Text>
              </Card.Content>
            </Card>
            <Card
              style={{ marginTop: 30, paddingVertical: 5, marginBottom: -10 }}
            >
              <Card.Content>
                <View
                  style={{
                    // backgroundColor: theme[colorScheme].onSecondaryContainer,
                    flex: 1,
                    marginBottom: 30,
                  }}
                >
                  <View
                    style={{
                      marginTop: 20,
                      display: "flex",
                      alignItems: "center",
                      marginBottom: 20,
                      paddingHorizontal: 45,
                    }}
                  ></View>
                </View>
              </Card.Content>
            </Card>
          </ScrollView>
        </SafeAreaView>
      </PaperProvider>
    </>
  );
};

export default Quran;
