import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SampleScreen = () => (
  <SafeAreaView style={styles.container}>
    <Text>SampleScreen</Text>
  </SafeAreaView>
);

export default SampleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
