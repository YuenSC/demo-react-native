import { makeStyles } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { Pressable, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import StyledText from "@/components/common/StyledText";
import { IStackScreenProps } from "@/types/navigation";

const WelcomeScreen = ({ navigation }: IStackScreenProps<"Welcome">) => {
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedLottieView
        autoPlay
        style={styles.lottie}
        source={require("@/assets/lottie/welcome.json")}
      />

      <StyledText style={styles.title}>Welcome to the app!</StyledText>
      <StyledText style={styles.subtitle}>
        {"Start summarizing your group expenses \n with your friends"}
      </StyledText>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace("CreateGroup")}
      >
        <StyledText style={styles.buttonText}>
          Create your first group
        </StyledText>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  lottie: {
    width: "100%",
  },
  title: {
    textAlign: "center",
    fontSize: 24,
    margin: 16,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 16,
    color: theme.colors.grey1,
  },
  button: {
    backgroundColor: theme.colors.primary,
    padding: 16,
    borderRadius: 8,
    margin: 16,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 32,
  },
  buttonText: {
    color: theme.colors.white,
    fontWeight: "bold",
    fontSize: 16,
  },
}));

export default WelcomeScreen;
