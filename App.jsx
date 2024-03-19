import { useEffect, useMemo, useState } from "react";
import { Text, View, useColorScheme } from "react-native";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import moment from "moment";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  Appbar,
  ActivityIndicator,
  Card,
  Divider,
} from "react-native-paper";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

const convTo12 = (time) => {
  const timeObject = moment(time, "HH:mm");
  return timeObject.format("h:mm A");
};

export default App = () => {
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
  //   console.log(location[0].city);
  // }

  useEffect(() => {
    if (location) {
      const params = {
        address: location[0].city,
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
          flex: 1,
        }}
      >
        <Appbar.Header mode="center-aligned" elevated>
          <Appbar.Content title="Ibadah" />
        </Appbar.Header>

        <View
          style={{
            display: "flex",
            flexDirection: "row-reverse",
            justifyContent: "space-between",
            alignItems: "baseline",
            marginTop: 10,
          }}
        >
          {location ? (
            <Text
              style={{
                fontSize: 30,
                fontWeight: "bold",
                fontFamily: "",
                marginTop: 20,
                marginBottom: 10,
                marginRight: 20,
                color: theme[colorScheme].primaryContainer,
              }}
            >
              {location[0].city}
            </Text>
          ) : (
            <Text>No Location</Text>
          )}
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              marginTop: 20,
              marginBottom: 10,
              marginLeft: 20,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                color: theme[colorScheme].tertiaryContainer,
                fontWeight: "bold",
              }}
            >
              {date.day}th&nbsp;
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: theme[colorScheme].tertiaryContainer,
                fontWeight: "bold",
              }}
            >
              {month.en},&nbsp;
            </Text>
            <Text
              style={{
                fontSize: 20,
                color: theme[colorScheme].tertiaryContainer,
                fontWeight: "bold",
              }}
            >
              {date.year}
            </Text>
          </View>
        </View>
        <Divider
          horizontalInset
          bold
          style={{
            marginVertical: 40,
            paddingVertical: 0.5,
            borderRadius: 10,
            opacity: 0.3,
          }}
        />

        <Card
          elevation={1}
          style={{ paddingHorizontal: 10, marginHorizontal: 20 }}
        >
          <Card.Title title="Ramadan Mubarak" titleVariant="headlineSmall" />
          <Card.Content
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text
              style={{
                fontSize: 30,
                marginTop: 10,
                color: theme[colorScheme].surfaceVariant,
              }}
            >
              Imsak🌙
              {"\n"}
              {convTo12(prayerTimes.Imsak)}
            </Text>
            <Text
              style={{
                fontSize: 30,
                marginTop: 10,
                color: theme[colorScheme].surfaceVariant,
              }}
            >
              Iftar&nbsp;&nbsp;🤲
              {"\n"}
              {convTo12(prayerTimes.Maghrib)}
            </Text>
          </Card.Content>
        </Card>
        <Divider
          horizontalInset
          bold
          style={{
            marginVertical: 40,
            paddingVertical: 0.5,
            borderRadius: 10,
            opacity: 0.3,
          }}
        />
        <View
          style={{
            marginTop: 0,
            display: "flex",
            alignItems: "center",
            marginBottom: 40,
          }}
        >
          <Text
            style={{
              fontSize: 35,
              justifyContent: "center",
              alignItems: "center",
              color: theme[colorScheme].tertiaryContainer,
            }}
          >
            Prayer times for today
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
              style={{
                fontSize: 30,
                color: theme[colorScheme].surface,
                // letterSpacing: 0,
              }}
            >
              🌆&nbsp;&nbsp;&nbsp;&nbsp;Fajr
            </Text>
            <Text
              style={{
                fontSize: 30,
                color: theme[colorScheme].surface,
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
              style={{
                fontSize: 30,
                marginTop: 10,
                color: theme[colorScheme].surface,
                // letterSpacing: 0,
              }}
            >
              🌄&nbsp;&nbsp;&nbsp;&nbsp;Sunrise
            </Text>
            <Text
              style={{
                fontSize: 30,
                marginTop: 10,
                color: theme[colorScheme].surface,
              }}
            >
              {convTo12(prayerTimes.Sunrise)}
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
              style={{
                fontSize: 30,
                marginTop: 10,
                color: theme[colorScheme].surface,
                // letterSpacing: 0,
              }}
            >
              ☀️&nbsp;&nbsp;&nbsp;&nbsp;Dhuhr
            </Text>
            <Text
              style={{
                fontSize: 30,
                marginTop: 10,
                color: theme[colorScheme].surface,
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
              style={{
                fontSize: 30,
                marginTop: 10,
                color: theme[colorScheme].surface,
                // letterSpacing: 0,
              }}
            >
              🌥️&nbsp;&nbsp;&nbsp;&nbsp;Asr
            </Text>
            <Text
              style={{
                fontSize: 30,
                marginTop: 10,
                color: theme[colorScheme].surface,
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
              style={{
                fontSize: 30,
                marginTop: 10,
                color: theme[colorScheme].surface,
                // letterSpacing: 0,
              }}
            >
              🌅&nbsp;&nbsp;&nbsp;&nbsp;Maghrib
            </Text>
            <Text
              style={{
                fontSize: 30,
                marginTop: 10,
                color: theme[colorScheme].surface,
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
              style={{
                fontSize: 30,
                marginTop: 10,
                color: theme[colorScheme].surface,
                // letterSpacing: 0,
              }}
            >
              🌙&nbsp;&nbsp;&nbsp;&nbsp;Isha
            </Text>
            <Text
              style={{
                fontSize: 30,
                marginTop: 10,
                color: theme[colorScheme].surface,
              }}
            >
              {convTo12(prayerTimes.Isha)}
            </Text>
          </View>
        </View>

        <StatusBar style="dark" />
      </View>
    </PaperProvider>
  );
};
