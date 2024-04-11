import { Text, makeStyles, useTheme } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const OptionsScreen = () => {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text h1>Options</Text>
      <Text>Group</Text>
      <Text>Profile</Text>
      <Text>Member</Text>
      <Text>Category</Text>
      <Text>Language</Text>
      <Text>Online Mode</Text>
      <Text>Delete Group Mode</Text>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
}));

export default OptionsScreen;
