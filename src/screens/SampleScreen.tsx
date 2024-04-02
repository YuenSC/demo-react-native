import { makeStyles } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SampleScreen = () => {
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedLottieView
        autoPlay
        source={require("@/assets/lottie/coming-soon.json")}
        style={{
          width: "100%",
          aspectRatio: 1,
        }}
      />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
}));

export default SampleScreen;
