import { ThemeProvider } from "@rneui/themed";
import { registerRootComponent } from "expo";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "react-native-gesture-handler";

import Navigation from "./navigation/Navigation";
import theme from "./styles/rneui";

const App = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider theme={theme}>
        <StatusBar style="auto" />
        <Navigation />
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

registerRootComponent(App);
