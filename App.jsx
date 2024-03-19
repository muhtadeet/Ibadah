import { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, View, useColorScheme } from "react-native";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import * as Location from "expo-location";
import moment from "moment";
import {
  PaperProvider,
  useTheme,
  MD3LightTheme,
  MD3DarkTheme,
} from "react-native-paper";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";

// const theme = {
//   ...DefaultTheme,
//   colors: {
//     primary: "rgb(150, 73, 0)",
//     onPrimary: "rgb(255, 255, 255)",
//     primaryContainer: "rgb(255, 220, 198)",
//     onPrimaryContainer: "rgb(49, 19, 0)",
//     secondary: "rgb(117, 88, 70)",
//     onSecondary: "rgb(255, 255, 255)",
//     secondaryContainer: "rgb(255, 220, 198)",
//     onSecondaryContainer: "rgb(43, 23, 8)",
//     tertiary: "rgb(96, 97, 52)",
//     onTertiary: "rgb(255, 255, 255)",
//     tertiaryContainer: "rgb(229, 230, 173)",
//     onTertiaryContainer: "rgb(28, 29, 0)",
//     error: "rgb(186, 26, 26)",
//     onError: "rgb(255, 255, 255)",
//     errorContainer: "rgb(255, 218, 214)",
//     onErrorContainer: "rgb(65, 0, 2)",
//     background: "rgb(255, 251, 255)",
//     onBackground: "rgb(32, 26, 23)",
//     surface: "rgb(255, 251, 255)",
//     onSurface: "rgb(32, 26, 23)",
//     surfaceVariant: "rgb(244, 222, 211)",
//     onSurfaceVariant: "rgb(82, 68, 60)",
//     outline: "rgb(132, 116, 106)",
//     outlineVariant: "rgb(215, 195, 183)",
//     shadow: "rgb(0, 0, 0)",
//     scrim: "rgb(0, 0, 0)",
//     inverseSurface: "rgb(54, 47, 43)",
//     inverseOnSurface: "rgb(251, 238, 232)",
//     inversePrimary: "rgb(255, 183, 134)",
//     elevation: {
//       level0: "transparent",
//       level1: "rgb(250, 242, 242)",
//       level2: "rgb(247, 237, 235)",
//       level3: "rgb(244, 231, 227)",
//       level4: "rgb(242, 230, 224)",
//       level5: "rgb(240, 226, 219)",
//     },
//     surfaceDisabled: "rgba(32, 26, 23, 0.12)",
//     onSurfaceDisabled: "rgba(32, 26, 23, 0.38)",
//     backdrop: "rgba(58, 46, 38, 0.4)",
//   },
// };

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

  // const theme = useTheme();
  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#37306B" });

  const paperTheme = useMemo(
    () =>
      colorScheme === "dark"
        ? { ...MD3DarkTheme, colors: theme.dark }
        : { ...MD3LightTheme, colors: theme.light },
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

  return (
    <PaperProvider theme={paperTheme}>
      <View
        style={{
          backgroundColor: theme[colorScheme].onSecondaryContainer,
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* <Text style={[styles.title]}>Ibadah</Text> */}
        {location ? (
          <Text
            style={{
              fontSize: 50,
              fontWeight: "bold",
              margin: 20,
              color: theme[colorScheme].primaryContainer,
            }}
          >
            {location[0].city}
          </Text>
        ) : (
          <Text>No Location</Text>
        )}
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text
            style={{
              fontSize: 30,
              marginTop: 10,
              color: theme[colorScheme].tertiaryContainer,
              fontWeight: "bold",
            }}
          >
            {date.day}th&nbsp;
          </Text>
          <Text
            style={{
              fontSize: 30,
              marginTop: 10,
              color: theme[colorScheme].tertiaryContainer,
              fontWeight: "bold",
            }}
          >
            {month.en},&nbsp;
          </Text>
          <Text
            style={{
              fontSize: 30,
              marginTop: 10,
              color: theme[colorScheme].tertiaryContainer,
              fontWeight: "bold",
            }}
          >
            {date.year}
          </Text>
        </View>
        <Text
          style={{
            fontSize: 30,
            marginTop: 10,
            color: theme[colorScheme].surface,
          }}
        >
          Fajr: {convTo12(prayerTimes.Fajr)}
        </Text>
        <Text
          style={{
            fontSize: 30,
            marginTop: 10,
            color: theme[colorScheme].surface,
          }}
        >
          Imsak: {convTo12(prayerTimes.Imsak)}
        </Text>
        <Text
          style={{
            fontSize: 30,
            marginTop: 10,
            color: theme[colorScheme].surface,
          }}
        >
          Sunrise: {convTo12(prayerTimes.Sunrise)}
        </Text>
        <Text
          style={{
            fontSize: 30,
            marginTop: 10,
            color: theme[colorScheme].surface,
          }}
        >
          Dhuhr: {convTo12(prayerTimes.Dhuhr)}
        </Text>
        <Text
          style={{
            fontSize: 30,
            marginTop: 10,
            color: theme[colorScheme].surface,
          }}
        >
          Asr: {convTo12(prayerTimes.Asr)}
        </Text>
        <Text
          style={{
            fontSize: 30,
            marginTop: 10,
            color: theme[colorScheme].surface,
          }}
        >
          Maghrib: {convTo12(prayerTimes.Maghrib)}
        </Text>
        <Text
          style={{
            fontSize: 30,
            marginTop: 10,
            color: theme[colorScheme].surface,
          }}
        >
          Isha: {convTo12(prayerTimes.Isha)}
        </Text>
        <StatusBar style="light" />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    paddingTop: 50,
    backgroundColor: "#303A52",
  },
  date: {
    display: "flex",
    flexDirection: "row",
  },
  title: {
    fontSize: 50,
    fontWeight: "bold",
    margin: 20,
    color: "#FC85AE",
  },
  prayerTimes: {
    marginTop: 20,
  },
  prayerTime: {
    fontSize: 30,
    marginTop: 10,
    color: "#fff",
  },
});
