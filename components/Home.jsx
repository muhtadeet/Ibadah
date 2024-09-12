import { useCallback, useEffect, useMemo, useState } from "react";
import {
  View,
  useColorScheme,
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  AppState,
} from "react-native";
import axios from "axios";
import * as Location from "expo-location";
import moment from "moment";
import {
  PaperProvider,
  MD3LightTheme,
  MD3DarkTheme,
  Card,
  Divider,
  Text,
  Icon,
  Button,
} from "react-native-paper";
import { useMaterial3Theme } from "@pchmn/expo-material3-theme";
import DailyHadith from "./DailyHadith";
import CountDown from "react-native-countdown-fixed";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";

const BACKGROUND_FETCH_TASK = "background-fetch-task";

const convTo12 = (time) => {
  const timeObject = moment(time, "HH:mm");
  return timeObject.format("h:mm A");
};

const setUpNotifications = async () => {
  await Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
};

const scheduleNotifications = async (prayerTimes) => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const scheduleTimes = [
    { name: "Fajr", time: prayerTimes.Fajr },
    { name: "Sunrise", time: prayerTimes.Sunrise },
    { name: "Dhuhr", time: prayerTimes.Dhuhr },
    { name: "Asr", time: prayerTimes.Asr },
    { name: "Maghrib", time: prayerTimes.Maghrib },
    { name: "Isha", time: prayerTimes.Isha },
    { name: "Qiyam", time: prayerTimes.Midnight },
    { name: "Sunset", time: prayerTimes.Sunset },
  ];

  for (const { name, time } of scheduleTimes) {
    const [hours, minutes] = time.split(":").map(Number);
    const scheduledTime = new Date();
    scheduledTime.setHours(hours, minutes, 0, 0);

    if (scheduledTime <= new Date()) {
      scheduledTime.setDate(scheduledTime.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: `Time for ${name}`,
        body: `It's ${time}. Time for ${name}`,
        data: { screen: "Home" },
      },
      trigger: {
        hour: hours,
        minute: minutes,
        repeats: true,
      },
    });
  }
};

// const scheduleTestNotification = async () => {
//   await Notifications.scheduleNotificationAsync({
//     content: {
//       title: "Test Notification",
//       body: "Tap this notification to open the app",
//       data: { screen: "salah-times" },
//     },
//     trigger: {
//       seconds: 1, // This will trigger the notification after 5 seconds
//     },
//   });
// };

const getPrayerTimes = async () => {
  const now = new Date();
  const location = await Location.getCurrentPositionAsync({});
  const address = await Location.reverseGeocodeAsync(location.coords);

  if (address && address[0]) {
    const today = now.toDateString();
    const cacheKey = `prayerTimes_${address[0].region}`;
    const lastFetchDateKey = `lastFetchDate_${address[0].region}`;

    try {
      const params = {
        address: address[0].region,
      };

      const response = await axios.get(
        `https://api.aladhan.com/v1/timingsByAddress?adjustment=0`,
        { params }
      );

      if (response.data.data) {
        const dataToCache = {
          timings: response.data.data.timings,
          date: response.data.data.date,
        };
        // Cache the data
        await AsyncStorage.setItem(cacheKey, JSON.stringify(dataToCache));
        // Update the last fetch date
        await AsyncStorage.setItem(lastFetchDateKey, today);

        // Schedule notifications for the new prayer times
        await scheduleNotifications(response.data.data.timings);

        return dataToCache;
      }
    } catch (error) {
      console.error("Error fetching prayer times:", error);
    }
  }
  return null;
};

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
  const now = new Date();
  if (now.getHours() === 0 && now.getMinutes() === 0) {
    try {
      await getPrayerTimes();
      return BackgroundFetch.BackgroundFetchResult.NewData;
    } catch (error) {
      console.error("Failed to fetch prayer times in background", error);
      return BackgroundFetch.BackgroundFetchResult.Failed;
    }
  } else {
    return BackgroundFetch.BackgroundFetchResult.NoData;
  }
});

export default Home = () => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  const [prayerTimes, setPrayerTimes] = useState({});
  const [date, setDate] = useState({});
  const [month, setMonth] = useState({});

  const colorScheme = useColorScheme();
  const { theme } = useMaterial3Theme({ fallbackSourceColor: "#37306B" });

  const time = new Date();
  const now = time.getHours() * 3600 + time.getMinutes() * 60;

  let IshaOrQiyam,
    QiyamOrFajr,
    FajrOrDhuhr,
    DhuhrOrAsr,
    AsrOrMaghrib,
    MagribOrIsha;

  if (prayerTimes.Midnight) {
    const time2 = prayerTimes.Midnight.split(":");
    IshaOrQiyam = Number(time2[0]) * 3600 + Number(time2[1]) * 60;
  }

  if (prayerTimes.Fajr) {
    const time2 = prayerTimes.Fajr.split(":");
    QiyamOrFajr = Number(time2[0]) * 3600 + Number(time2[1]) * 60;
  }

  if (prayerTimes.Dhuhr) {
    const time2 = prayerTimes.Dhuhr.split(":");
    FajrOrDhuhr = Number(time2[0]) * 3600 + Number(time2[1]) * 60;
  }

  if (prayerTimes.Asr) {
    const time2 = prayerTimes.Asr.split(":");
    DhuhrOrAsr = Number(time2[0]) * 3600 + Number(time2[1]) * 60;
  }

  if (prayerTimes.Maghrib) {
    const time2 = prayerTimes.Maghrib.split(":");
    AsrOrMaghrib = Number(time2[0]) * 3600 + Number(time2[1]) * 60;
  }

  if (prayerTimes.Isha) {
    const time2 = prayerTimes.Isha.split(":");
    MagribOrIsha = Number(time2[0]) * 3600 + Number(time2[1]) * 60;
  }

  const paperTheme = useMemo(
    () =>
      colorScheme === "light"
        ? { ...MD3LightTheme, colors: theme.dark }
        : { ...MD3DarkTheme, colors: theme.light },
    [colorScheme, theme]
  );

  useEffect(() => {
    const requestNotificationPermissions = async () => {
      const { status } = await Notifications.requestPermissionsAsync({
        ios: {
          allowAlert: true,
          allowBadge: true,
          allowSound: true,
          allowAnnouncements: true,
        },
      });
      if (status !== "granted") {
        alert(
          "You need to enable notifications to receive prayer time alerts."
        );
      }
    };

    requestNotificationPermissions();
  }, []);

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

  useEffect(() => {
    setUpNotifications();
  }, []);

  const router = useRouter();

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const screenToOpen = response.notification.request.content.data.screen;
        if (screenToOpen === "Home") {
          router.push("/");
        }
      }
    );
  
    return () => subscription.remove();
  }, [router]);

  const loadPrayerTimes = useCallback(async () => {
    if (location) {
      const cacheKey = `prayerTimes_${location[0].region}`;
      try {
        const cachedData = await AsyncStorage.getItem(cacheKey);
        if (cachedData) {
          const parsedData = JSON.parse(cachedData);
          setPrayerTimes(parsedData.timings);
          setDate(parsedData.date.hijri);
          setMonth(parsedData.date.hijri.month);

          // Schedule notifications for the cached prayer times
          await scheduleNotifications(parsedData.timings);
        } else {
          // If no cached data, trigger getPrayerTimes
          const newData = await getPrayerTimes();
          if (newData) {
            setPrayerTimes(newData.timings);
            setDate(newData.date.hijri);
            setMonth(newData.date.hijri.month);

            // Schedule notifications for the new prayer times
            await scheduleNotifications(newData.timings);
          } else {
            console.log("Failed to fetch prayer times data.");
          }
        }
      } catch (error) {
        console.error("Error loading prayer times:", error);
      }
    }
  }, [location]);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        loadPrayerTimes();
      }
    });

    return () => {
      subscription.remove();
    };
  }, [loadPrayerTimes]);

  useEffect(() => {
    loadPrayerTimes();
  }, [loadPrayerTimes]);

  useEffect(() => {
    const registerBackgroundFetch = async () => {
      try {
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 60 * 60, // 1 hour
          stopOnTerminate: false,
          startOnBoot: true,
        });
      } catch (err) {
        console.error("Failed to register background fetch task", err);
      }
    };

    registerBackgroundFetch();

    return () => {
      BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
    };
  }, []);

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
        <ActivityIndicator
          size="large"
          color={theme[colorScheme].tertiaryContainer}
        />
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
                size={17}
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
      {/* <Button
        onPress={scheduleTestNotification}              //to test notifications
        mode="contained"
        style={{ margin: 20 }}
      >
        Test Notification
      </Button> */}
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
                  <Text
                    variant="titleLarge"
                    style={{ color: theme[colorScheme].primaryContainer }}
                  >
                    After
                  </Text>
                  <CountDown
                    until={86400 - now + IshaOrQiyam}
                    size={17}
                    onFinish={() => alert("Isha")}
                    digitStyle={{ backgroundColor: "transparent", margin: -15 }}
                    digitTxtStyle={{
                      color: theme[colorScheme].tertiaryContainer,
                    }}
                    timeLabelStyle={{
                      color: theme[colorScheme].primaryContainer,
                    }}
                    timeToShow={["H", "M", "S"]}
                    timeLabels={{ h: "Hours", m: "Mins", s: "Secs" }}
                  />
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
                  <Text
                    variant="titleLarge"
                    style={{ color: theme[colorScheme].primaryContainer }}
                  >
                    After
                  </Text>
                  <CountDown
                    until={QiyamOrFajr - now}
                    size={17}
                    onFinish={() => alert("Isha")}
                    digitStyle={{ backgroundColor: "transparent", margin: -15 }}
                    digitTxtStyle={{
                      color: theme[colorScheme].tertiaryContainer,
                    }}
                    timeLabelStyle={{
                      color: theme[colorScheme].primaryContainer,
                    }}
                    timeToShow={["H", "M", "S"]}
                    timeLabels={{ h: "Hours", m: "Mins", s: "Secs" }}
                  />
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
                  <Text
                    variant="titleLarge"
                    style={{ color: theme[colorScheme].primaryContainer }}
                  >
                    After
                  </Text>
                  <CountDown
                    until={FajrOrDhuhr - now}
                    size={17}
                    onFinish={() => alert("Isha")}
                    digitStyle={{ backgroundColor: "transparent", margin: -15 }}
                    digitTxtStyle={{
                      color: theme[colorScheme].tertiaryContainer,
                    }}
                    timeLabelStyle={{
                      color: theme[colorScheme].primaryContainer,
                    }}
                    timeToShow={["H", "M", "S"]}
                    timeLabels={{ h: "Hours", m: "Mins", s: "Secs" }}
                  />
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
                  <Text
                    variant="titleLarge"
                    style={{ color: theme[colorScheme].primaryContainer }}
                  >
                    After
                  </Text>
                  <CountDown
                    until={DhuhrOrAsr - now}
                    size={17}
                    onFinish={() => alert("Isha")}
                    digitStyle={{ backgroundColor: "transparent", margin: -15 }}
                    digitTxtStyle={{
                      color: theme[colorScheme].tertiaryContainer,
                    }}
                    timeLabelStyle={{
                      color: theme[colorScheme].primaryContainer,
                    }}
                    timeToShow={["H", "M", "S"]}
                    timeLabels={{ h: "Hours", m: "Mins", s: "Secs" }}
                  />
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
                  <Text
                    variant="titleLarge"
                    style={{ color: theme[colorScheme].primaryContainer }}
                  >
                    After
                  </Text>
                  <CountDown
                    until={AsrOrMaghrib - now}
                    size={17}
                    onFinish={() => alert("Isha")}
                    digitStyle={{ backgroundColor: "transparent", margin: -15 }}
                    digitTxtStyle={{
                      color: theme[colorScheme].tertiaryContainer,
                    }}
                    timeLabelStyle={{
                      color: theme[colorScheme].primaryContainer,
                    }}
                    timeToShow={["H", "M", "S"]}
                    timeLabels={{ h: "Hours", m: "Mins", s: "Secs" }}
                  />
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
                  <Text
                    variant="titleLarge"
                    style={{ color: theme[colorScheme].primaryContainer }}
                  >
                    After
                  </Text>
                  <CountDown
                    until={MagribOrIsha - now}
                    size={17}
                    onFinish={() => alert("Isha")}
                    digitStyle={{ backgroundColor: "transparent", margin: -15 }}
                    digitTxtStyle={{
                      color: theme[colorScheme].tertiaryContainer,
                    }}
                    timeLabelStyle={{
                      color: theme[colorScheme].primaryContainer,
                    }}
                    timeToShow={["H", "M", "S"]}
                    timeLabels={{ h: "Hours", m: "Mins", s: "Secs" }}
                  />
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
                {/* <Text
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
                </Text> */}
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
                {/* <Text
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
                </Text> */}
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
