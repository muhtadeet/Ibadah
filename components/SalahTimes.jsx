import { useCallback, useEffect, useMemo, useState } from "react";
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

  const time = new Date();
  // console.log(parseInt(prayerTimes.Fajr));
  const now = time.getHours() * 3600 + time.getMinutes() * 60;
  // console.log(now);

  // const Fajr = prayerTimes.Fajr;
  let IshaOrQiyam;
  if (prayerTimes.Midnight !== undefined) {
    const time2 = prayerTimes.Midnight.split(":");
    IshaOrQiyam = Number(time2[0]) * 3600 + Number(time2[1]) * 60;
  }

  let QiyamOrFajr;
  if (prayerTimes.Fajr !== undefined) {
    const time2 = prayerTimes.Fajr.split(":");
    QiyamOrFajr = Number(time2[0]) * 3600 + Number(time2[1]) * 60;
  }

  let FajrOrDhuhr;
  if (prayerTimes.Dhuhr !== undefined) {
    const time2 = prayerTimes.Dhuhr.split(":");
    FajrOrDhuhr = Number(time2[0]) * 3600 + Number(time2[1]) * 60;
  }

  let DhuhrOrAsr;
  if (prayerTimes.Asr !== undefined) {
    const time2 = prayerTimes.Asr.split(":");
    DhuhrOrAsr = Number(time2[0]) * 3600 + Number(time2[1]) * 60;
  }

  let AsrOrMaghrib;
  if (prayerTimes.Maghrib !== undefined) {
    const time2 = prayerTimes.Maghrib.split(":");
    AsrOrMaghrib = Number(time2[0]) * 3600 + Number(time2[1]) * 60;
  }

  let MagribOrIsha;
  if (prayerTimes.Isha !== undefined) {
    const time2 = prayerTimes.Isha.split(":");
    MagribOrIsha = Number(time2[0]) * 3600 + Number(time2[1]) * 60;
  }

  const paperTheme = useMemo(
    () =>
      colorScheme === "dark"
        ? { ...MD3LightTheme, colors: theme.light }
        : { ...MD3DarkTheme, colors: theme.dark },
    [colorScheme, theme]
  );

  useEffect(() => {
    const requestPermission = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          setErrorMsg("No Location Permissions");
          return;
        }
        const location = await Location.getCurrentPositionAsync({});
        const address = await Location.reverseGeocodeAsync(location.coords);
        setLocation(address);
      } catch (e) {
        console.warn(`Error on requestPermission: ${e}`);
      }
    };

    requestPermission();
  }, []);

  // if (location) {
  //   city = location[0].city;
  //   console.log(location[0]);
  // }

  // useEffect(() => {
  //   if (location) {
  //     const params = {
  //       address: location[0].region,
  //     };

  //     axios
  //       .get(`https://api.aladhan.com/v1/timingsByAddress`, { params })
  //       .then((response) => {
  //         if (response.data.data) {
  //           setPrayerTimes(response.data.data.timings);
  //           setDate(response.data.data.date.hijri);
  //           setMonth(response.data.data.date.hijri.month);
  //           setPlace(response.data.data.meta);
  //         }
  //       })
  //       .catch((error) => console.error(error));
  //   }
  // }, [location]);

  const getPrayerTimes = useCallback(async () => {
    if (location) {
      const params = {
        address: location[0].region,
      };

      try {
        const response = await axios.get(
          `https://api.aladhan.com/v1/timingsByAddress?adjustment=-1`,
          { params }
        );

        if (response.data.data) {
          setPrayerTimes(response.data.data.timings);
          setDate(response.data.data.date.hijri);
          setMonth(response.data.data.date.hijri.month);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, [location]);

  useEffect(() => {
    getPrayerTimes();
  }, [getPrayerTimes]);

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
          title="Salah Times"
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
              <Text variant="titleMedium">Time for</Text>
              {now < IshaOrQiyam && now > MagribOrIsha ? (
                <>
                  <Text
                    variant="displayMedium"
                    style={{ color: theme[colorScheme].tertiaryContainer }}
                  >
                    Isha
                  </Text>
                  <Text variant="titleMedium">
                    Next up is Qiyam at {convTo12(prayerTimes.Midnight)}
                  </Text>
                </>
              ) : now > IshaOrQiyam && now < QiyamOrFajr ? (
                <>
                  <Text
                    variant="displayMedium"
                    style={{ color: theme[colorScheme].tertiaryContainer }}
                  >
                    Qiyam
                  </Text>
                  <Text variant="titleMedium">
                    Next up is Fajr at {convTo12(prayerTimes.Fajr)}
                  </Text>
                </>
              ) : now > QiyamOrFajr && now < FajrOrDhuhr ? (
                <>
                  <Text
                    variant="displayMedium"
                    style={{ color: theme[colorScheme].tertiaryContainer }}
                  >
                    Fajr
                  </Text>
                  <Text variant="titleMedium">
                    Next up is Dhuhr at {convTo12(prayerTimes.Dhuhr)}
                  </Text>
                </>
              ) : now > FajrOrDhuhr && now < DhuhrOrAsr ? (
                <>
                  <Text
                    variant="displayMedium"
                    style={{ color: theme[colorScheme].tertiaryContainer }}
                  >
                    Dhuhr
                  </Text>
                  <Text variant="titleMedium">
                    Next up is Asr at {convTo12(prayerTimes.Asr)}
                  </Text>
                </>
              ) : now > DhuhrOrAsr && now < AsrOrMaghrib ? (
                <>
                  <Text
                    variant="displayMedium"
                    style={{ color: theme[colorScheme].tertiaryContainer }}
                  >
                    Asr
                  </Text>
                  <Text variant="titleMedium">
                    Next up is Maghrib at {convTo12(prayerTimes.Maghrib)}
                  </Text>
                </>
              ) : now > AsrOrMaghrib && now < MagribOrIsha ? (
                <>
                  <Text
                    variant="displayMedium"
                    style={{ color: theme[colorScheme].tertiaryContainer }}
                  >
                    Maghrib
                  </Text>
                  <Text variant="titleMedium">
                    Next up is Isha at {convTo12(prayerTimes.Isha)}
                  </Text>
                </>
              ) : (
                <Text variant="titleMedium">Invalid data</Text>
              )}
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
                >
                  <Text
                    variant="headlineMedium"
                    style={{
                      // fontSize: 35,
                      justifyContent: "center",
                      alignItems: "center",
                      color: theme[colorScheme].tertiaryContainer,
                    }}
                  >
                    Today
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
                      variant="titleMedium"
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
                      variant="titleMedium"
                      style={{
                        // fontSize: 30,
                        color: theme[colorScheme].surface,
                        paddingVertical: 10,
                      }}
                    >
                      {convTo12(prayerTimes.Fajr)}
                    </Text>
                  </View>
                  <Divider
                    bold
                    style={{
                      marginVertical: 5,
                      paddingVertical: 1,
                      borderRadius: 10,
                      opacity: 0.3,
                      marginHorizontal: 50,
                    }}
                  />
                  <View
                    style={{
                      paddingHorizontal: 50,
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      variant="titleMedium"
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
                      variant="titleMedium"
                      style={{
                        // fontSize: 30,
                        color: theme[colorScheme].surface,
                        paddingVertical: 10,
                      }}
                    >
                      {convTo12(prayerTimes.Dhuhr)}
                    </Text>
                  </View>
                  <Divider
                    bold
                    style={{
                      marginVertical: 5,
                      paddingVertical: 1,
                      borderRadius: 10,
                      opacity: 0.3,
                      marginHorizontal: 50,
                    }}
                  />
                  <View
                    style={{
                      paddingHorizontal: 50,
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      variant="titleMedium"
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
                      variant="titleMedium"
                      style={{
                        // fontSize: 30,
                        color: theme[colorScheme].surface,
                        paddingVertical: 10,
                      }}
                    >
                      {convTo12(prayerTimes.Asr)}
                    </Text>
                  </View>
                  <Divider
                    bold
                    style={{
                      marginVertical: 5,
                      paddingVertical: 1,
                      borderRadius: 10,
                      opacity: 0.3,
                      marginHorizontal: 50,
                    }}
                  />
                  <View
                    style={{
                      paddingHorizontal: 50,
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      variant="titleMedium"
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
                      variant="titleMedium"
                      style={{
                        // fontSize: 30,
                        color: theme[colorScheme].surface,
                        paddingVertical: 10,
                      }}
                    >
                      {convTo12(prayerTimes.Maghrib)}
                    </Text>
                  </View>
                  <Divider
                    bold
                    style={{
                      marginVertical: 5,
                      paddingVertical: 1,
                      borderRadius: 10,
                      opacity: 0.3,
                      marginHorizontal: 50,
                    }}
                  />
                  <View
                    style={{
                      paddingHorizontal: 50,
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      variant="titleMedium"
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
                      variant="titleMedium"
                      style={{
                        // fontSize: 30,
                        color: theme[colorScheme].surface,
                        paddingVertical: 10,
                      }}
                    >
                      {convTo12(prayerTimes.Isha)}
                    </Text>
                  </View>
                  <Divider
                    bold
                    style={{
                      marginVertical: 5,
                      paddingVertical: 1,
                      borderRadius: 10,
                      opacity: 0.3,
                      marginHorizontal: 50,
                    }}
                  />
                  <View
                    style={{
                      paddingHorizontal: 50,
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      flexDirection: "row",
                    }}
                  >
                    <Text
                      variant="titleMedium"
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
                      variant="titleMedium"
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
                    style={{ marginHorizontal: 20, marginTop: 20 }}
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
                          variant="titleMedium"
                          style={{
                            color: theme[colorScheme].tertiaryContainer,
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
                          variant="titleMedium"
                          style={{
                            color: theme[colorScheme].tertiaryContainer,
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
            </Card.Content>
          </Card>
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
  // };
};
