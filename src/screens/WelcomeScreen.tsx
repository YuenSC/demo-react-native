import AsyncStorage from "@react-native-async-storage/async-storage";
import { Button, makeStyles } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import StyledText from "@/components/common/StyledText";
import { IStackScreenProps } from "@/types/navigation";

const WelcomeScreen = ({ navigation }: IStackScreenProps<"Welcome">) => {
  const styles = useStyles();

  // useEffect(() => {
  //   const showAsyncStorageData = async () => {
  //     try {
  //       const keys = await AsyncStorage.getAllKeys();
  //       const result = await AsyncStorage.multiGet(keys);

  //       return result.forEach(([key, value]) => {
  //         log(`key: ${key}, value: ${value}`);
  //       });
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };
  //   showAsyncStorageData();
  // }, []);

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

      <Button
        title="Get Started"
        containerStyle={styles.buttonContainer}
        onPress={() => navigation.replace("Onboarding", { step: 0 })}
      />

      <Button
        title="Reset"
        containerStyle={{ margin: 16 }}
        type="outline"
        onPress={() => AsyncStorage.clear()}
      />
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

  buttonContainer: {
    marginTop: "auto",
    marginHorizontal: 16,
    marginBottom: 32,
  },
}));

export default WelcomeScreen;
