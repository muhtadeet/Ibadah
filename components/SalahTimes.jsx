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
                marginTop: 0,
                display: "flex",
                alignItems: "center",
                marginBottom: 40,
              }}
            >
              <Text
                variant="displaySmall"
                style={{
                  // fontSize: 35,
                  justifyContent: "center",
                  alignItems: "center",
                  color: theme[colorScheme].tertiaryContainer,
                }}
              >
                Salah times for today
              </Text>
            </View>
            <View>
              <View
                style={{
                  paddingHorizontal: 50,
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexDirection: "row",
                }}
              >
                <Text
                  variant="headlineSmall"
                  style={{
                    // fontSize: 30,
                    color: theme[colorScheme].surface,
                    // letterSpacing: 0,
                    paddingVertical: 10,
                  }}
                >
                  Fajr
                </Text>
                <Text
                  variant="headlineSmall"
                  style={{
                    // fontSize: 30,
                    color: theme[colorScheme].surface,
                    paddingVertical: 10,
                  }}
                >
                  {convTo12(prayerTimes.Fajr)}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 50,
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexDirection: "row",
                }}
              >
                <Text
                  variant="headlineSmall"
                  style={{
                    // fontSize: 30,
                    color: theme[colorScheme].surface,
                    paddingVertical: 10,
                    // letterSpacing: 0,
                  }}
                >
                  Dhuhr
                </Text>
                <Text
                  variant="headlineSmall"
                  style={{
                    // fontSize: 30,
                    color: theme[colorScheme].surface,
                    paddingVertical: 10,
                  }}
                >
                  {convTo12(prayerTimes.Dhuhr)}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 50,
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexDirection: "row",
                }}
              >
                <Text
                  variant="headlineSmall"
                  style={{
                    // fontSize: 30,
                    color: theme[colorScheme].surface,
                    paddingVertical: 10,
                    // letterSpacing: 0,
                  }}
                >
                  Asr
                </Text>
                <Text
                  variant="headlineSmall"
                  style={{
                    // fontSize: 30,
                    color: theme[colorScheme].surface,
                    paddingVertical: 10,
                  }}
                >
                  {convTo12(prayerTimes.Asr)}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 50,
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexDirection: "row",
                }}
              >
                <Text
                  variant="headlineSmall"
                  style={{
                    // fontSize: 30,
                    color: theme[colorScheme].surface,
                    paddingVertical: 10,
                    // letterSpacing: 0,
                  }}
                >
                  Maghrib
                </Text>
                <Text
                  variant="headlineSmall"
                  style={{
                    // fontSize: 30,
                    color: theme[colorScheme].surface,
                    paddingVertical: 10,
                  }}
                >
                  {convTo12(prayerTimes.Maghrib)}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 50,
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexDirection: "row",
                }}
              >
                <Text
                  variant="headlineSmall"
                  style={{
                    // fontSize: 30,
                    color: theme[colorScheme].surface,
                    paddingVertical: 10,
                    // letterSpacing: 0,
                  }}
                >
                  Isha
                </Text>
                <Text
                  variant="headlineSmall"
                  style={{
                    // fontSize: 30,
                    color: theme[colorScheme].surface,
                    paddingVertical: 10,
                  }}
                >
                  {convTo12(prayerTimes.Isha)}
                </Text>
              </View>
              <View
                style={{
                  paddingHorizontal: 50,
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  flexDirection: "row",
                }}
              >
                <Text
                  variant="headlineSmall"
                  style={{
                    // fontSize: 30,
                    color: theme[colorScheme].surface,
                    paddingVertical: 10,
                    // letterSpacing: 0,
                  }}
                >
                  Qiyam
                </Text>
                <Text
                  variant="headlineSmall"
                  style={{
                    // fontSize: 30,
                    color: theme[colorScheme].surface,
                    paddingVertical: 10,
                  }}
                >
                  {convTo12(prayerTimes.Midnight)}
                </Text>
              </View>
              <Card
                elevation={1}
                style={{ marginHorizontal: 20, marginTop: 40 }}
              >
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
                      Sunrise
                    </Text>
                    <Text
                      variant="titleLarge"
                      style={{
                        color: theme[colorScheme].surfaceVariant,
                      }}
                    >
                      {convTo12(prayerTimes.Sunrise)}
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
                      Sunset
                    </Text>
                    <Text
                      variant="titleLarge"
                      style={{
                        color: theme[colorScheme].surfaceVariant,
                      }}
                    >
                      {convTo12(prayerTimes.Sunset)}
                    </Text>
                  </View>
                </Card.Content>
              </Card>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
  // };
};
