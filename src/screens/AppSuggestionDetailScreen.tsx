import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";

const AppSuggestionDetailScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>AppSuggestionDetailScreen</Text>
    </View>
  );
};

export default AppSuggestionDetailScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
