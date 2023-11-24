import { StyleSheet, Text, View } from "react-native";
import Config from "./Config";
import { PaperProvider } from "react-native-paper";
import { registerRootComponent } from "expo";
import { PaperTheme } from "./styles/PaperTheme";
import Navigation from "./navigation/Navigation";
import "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { StatusBar } from "expo-status-bar";

const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={PaperTheme}>
        <StatusBar style="light" />
        <Navigation />
      </PaperProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

registerRootComponent(App);
