import { makeStyles, useTheme } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { IStackScreenProps } from "@/types/navigation";

const GroupSummaryScreen = ({
  navigation,
  route: {
    params: { groupId },
  },
}: IStackScreenProps<"GroupSummary">) => {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      {theme.mode === "light" ? (
        <AnimatedLottieView
          autoPlay
          source={require("@/assets/lottie/coming-soon.json")}
          style={{
            width: "100%",
            aspectRatio: 1,
          }}
        />
      ) : (
        <AnimatedLottieView
          autoPlay
          source={require("@/assets/lottie/coming-soon-dark.json")}
          style={{
            width: "100%",
            aspectRatio: 1,
          }}
        />
      )}
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

export default GroupSummaryScreen;
