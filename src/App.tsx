import { ThemeProvider } from "@rneui/themed";
import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import Navigation from "./navigation/Navigation";
import { persistor, store } from "./store";
import theme from "./styles/rneui";

const App = () => {
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
