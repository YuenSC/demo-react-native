import { Text, makeStyles } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

const SampleScreen = () => {
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.container}>
      <Text>SampleScreen</Text>
    </SafeAreaView>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
}));

export default SampleScreen;
