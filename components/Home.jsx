import { useEffect, useMemo, useState } from "react";
import {
  View,
  useColorScheme,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import moment from "moment";
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
import DailyHadith from "./DailyHadith";

const convTo12 = (time) => {
  const timeObject = moment(time, "HH:mm");
  return timeObject.format("h:mm A");
};

export default Home = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [prayerTimes, setPrayerTimes] = useState({});
  const [date, setDate] = useState({});
  const [month, setMonth] = useState({});
  const [place, setPlace] = useState({});

  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#37306B" });

  const paperTheme = useMemo(
    () =>
      colorScheme === "dark"
        ? { ...MD3LightTheme, colors: theme.light }
        : { ...MD3DarkTheme, colors: theme.dark },
    [colorScheme, theme]
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const address = await Location.reverseGeocodeAsync(location.coords);
      setLocation(address);
    })();
  }, []);

  // if (location) {
  //   city = location[0].city;
  //   console.log(location[0]);
  // }

  useEffect(() => {
    if (location) {
      const params = {
        address: location[0].region,
      };

      axios
        .get(`https://api.aladhan.com/v1/timingsByAddress`, { params })
        .then((response) => {
          if (response.data.data) {
            setPrayerTimes(response.data.data.timings);
            setDate(response.data.data.date.hijri);
            setMonth(response.data.data.date.hijri.month);
            setPlace(response.data.data.meta);
          }
        })
        .catch((error) => console.error(error));
    }
  }, [location]);

  if (!location || !date.day) {
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

  return (
    <PaperProvider theme={paperTheme}>
      <SafeAreaView
        style={{
          backgroundColor: theme[colorScheme].onSecondaryContainer,
          flex: 1,
        }}
      >
        <ScrollView>
          <View
            style={{
              backgroundColor: theme[colorScheme].onSecondaryContainer,
              flex: 1,
              marginBottom: 30,
            }}
          >
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View
                style={{
                  marginVertical: 10,
                  marginBottom: 20,
                  marginHorizontal: 30,
                  justifyContent: "center",
                }}
              >
                <Text
                  variant="headlineMedium"
                  style={{
                    fontWeight: "bold",
                    color: theme[colorScheme].primaryContainer,
                  }}
                >
                  Ibadah
                </Text>
              </View>
              <View
                style={{
                  display: "flex",
                  flexDirection: "col",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  marginVertical: 10,
                  marginBottom: 20,
                  marginHorizontal: 30,
                }}
              >
                {location ? (
                  <Text
                    variant="titleMedium"
                    style={{
                      // fontSize: 30,
                      fontWeight: "bold",
                      paddingTop: 5,
                      // marginTop: 20,
                      // marginBottom: 10,
                      // marginRight: 20,
                      color: theme[colorScheme].primaryContainer,
                    }}
                  >
                    <Icon
                      source="bullseye-arrow"
                      size={15}
                      color={theme[colorScheme].primaryContainer}
                    />
                    &nbsp;&nbsp;
                    {location[0].region}, {location[0].country}
                  </Text>
                ) : (
                  <Text variant="titleMedium">No Location</Text>
                )}
                <View
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    // marginTop: 20,
                    // marginBottom: 10,
                    // marginLeft: 20,
                  }}
                >
                  <Text
                    variant="titleSmall"
                    style={{
                      // fontSize: 20,
                      color: theme[colorScheme].tertiaryContainer,
                      fontWeight: "bold",
                    }}
                  >
                    {month.en}&nbsp;
                  </Text>
                  <Text
                    variant="titleSmall"
                    style={{
                      // fontSize: 20,
                      color: theme[colorScheme].tertiaryContainer,
                      fontWeight: "bold",
                    }}
                  >
                    {date.day},&nbsp;
                  </Text>
                  <Text
                    variant="titleSmall"
                    style={{
                      // fontSize: 20,
                      color: theme[colorScheme].tertiaryContainer,
                      fontWeight: "bold",
                    }}
                  >
                    {date.year} AH
                  </Text>
                </View>
              </View>
            </View>
            <Divider
              horizontalInset
              bold
              style={{
                marginTop: 5,
                marginBottom: 40,
                paddingVertical: 1,
                borderRadius: 10,
                opacity: 0.5,
              }}
            />

            <Card elevation={1} style={{ marginHorizontal: 20 }}>
              {/* <Card.Title
                title="Ramadan Mubarak"
                titleVariant="headlineSmall"
              /> */}
              <Card.Content
                style={{
                  flexDirection: "row",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    justifyContent: "flex-end",
                  }}
                >
                  <Text
                    variant="titleLarge"
                    style={{
                      color: theme[colorScheme].surfaceVariant,
                    }}
                  >
                    Imsak
                  </Text>
                  <Text
                    variant="titleLarge"
                    style={{
                      color: theme[colorScheme].surfaceVariant,
                    }}
                  >
                    {convTo12(prayerTimes.Imsak)}
                  </Text>
                </View>
                <View
                  style={{
                    height: "100%",
                    width: 1,
                    backgroundColor: "#909090",
                    borderRadius: 10,
                    opacity: 0.3,
                  }}
                />
                <View
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "flex-start",
                  }}
                >
                  <Text
                    variant="titleLarge"
                    style={{
                      color: theme[colorScheme].surfaceVariant,
                    }}
                  >
                    Iftar
                  </Text>
                  <Text
                    variant="titleLarge"
                    style={{
                      color: theme[colorScheme].surfaceVariant,
                    }}
                  >
                    {convTo12(prayerTimes.Maghrib)}
                  </Text>
                </View>
              </Card.Content>
            </Card>
            <Divider
              horizontalInset
              bold
              style={{
                marginVertical: 40,
                paddingVertical: 1,
                borderRadius: 10,
                opacity: 0.5,
              }}
            />

            <DailyHadith />
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
  // };
};