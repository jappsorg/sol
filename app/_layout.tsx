import { Stack } from "expo-router";
import { PaperProvider, MD3LightTheme } from "react-native-paper";
import { useCallback } from "react";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { View } from "react-native";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <PaperProvider theme={MD3LightTheme}>
      <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
        <Stack>
          <Stack.Screen
            name="home"
            options={{
              title: "Spelling Bee",
              headerStyle: {
                backgroundColor: MD3LightTheme.colors.primary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontFamily: "Roboto-Bold",
              },
            }}
          />
          <Stack.Screen
            name="levels/index"
            options={{
              title: "Select Mode",
              headerStyle: {
                backgroundColor: MD3LightTheme.colors.primary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontFamily: "Roboto-Bold",
              },
            }}
          />
          <Stack.Screen
            name="practice/[grade]"
            options={{
              title: "Practice Mode",
              headerStyle: {
                backgroundColor: MD3LightTheme.colors.primary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontFamily: "Roboto-Bold",
              },
            }}
          />
          <Stack.Screen
            name="quiz/[grade]"
            options={{
              title: "Quiz Mode",
              headerStyle: {
                backgroundColor: MD3LightTheme.colors.primary,
              },
              headerTintColor: "#fff",
              headerTitleStyle: {
                fontFamily: "Roboto-Bold",
              },
            }}
          />
        </Stack>
      </View>
    </PaperProvider>
  );
}
