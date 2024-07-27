import { createStackNavigator } from "@react-navigation/stack";
import QuranTab from "./QuranTab";
import SurahDetail from "./SurahDetail";
import { NavigationContainer } from "@react-navigation/native";

const Stack = createStackNavigator();

const Quran = () => (
  <NavigationContainer independent>
    <Stack.Navigator>
      <Stack.Screen
        name="Quran"
        component={QuranTab}
        options={{ title: "Quran" }}
      />
      <Stack.Screen
        name="Surah"
        component={SurahDetail}
        options={({ route }) => ({ title: route.params.surah.englishName })}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

export default Quran;
