import { StyleSheet, Text, View } from "react-native";

const SampleScreen = () => (
  <View style={styles.container}>
    <Text>SampleScreen</Text>
  </View>
);

export default SampleScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
