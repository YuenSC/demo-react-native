import { makeStyles } from "@rneui/themed";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ProfileScreen = () => {
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.container}>
      <Text>ProfileScreen</Text>
    </SafeAreaView>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
  },
}));

export default ProfileScreen;
