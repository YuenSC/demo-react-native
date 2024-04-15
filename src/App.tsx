import { ThemeProvider } from "@rneui/themed";
import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { requestTrackingPermissionsAsync } from "expo-tracking-transparency";
import { useEffect } from "react";
import mobileAds from "react-native-google-mobile-ads";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import "./i18n";

import Navigation from "./navigation/Navigation";
import { persistor, store } from "./store";
import theme from "./styles/rneui";

const useAds = () => {
  useEffect(() => {
    (async () => {
      const { status } = await requestTrackingPermissionsAsync();
      if (status === "granted") {
        mobileAds()
          .initialize()
          .then((adapterStatuses) => {
            // Initialization complete!
            console.log("adapterStatuses", adapterStatuses);
          });
      }
    })();
  }, []);
};

const App = () => {
  useAds();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <ThemeProvider theme={theme}>
            <StatusBar style="light" />
            <Navigation />
          </ThemeProvider>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

registerRootComponent(App);
