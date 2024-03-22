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
import dayjs from "dayjs";

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

  // if (now < seconds) {
  //   console.log("Fajr");
  // } else {
  //   console.log("Qiyam");
  // }

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
      <View
        style={{
          backgroundColor: theme[colorScheme].onSecondaryContainer,
          paddingTop: 35,
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 20,
          paddingTop: 50,
        }}
      >
        <View
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            marginHorizontal: 30,
          }}
        >
          <Text
            variant="headlineMedium"
            style={{
              fontWeight: "bold",
              color: theme[colorScheme].primaryContainer,
              marginTop: 10,
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
            marginTop: 10,
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
          <Card elevation={1} style={{ marginHorizontal: 20, marginTop: 20 }}>
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
                  variant="titleMedium"
                  style={{
                    color: theme[colorScheme].tertiaryContainer,
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
        </ScrollView>
      </SafeAreaView>
    </PaperProvider>
  );
  // };
};
