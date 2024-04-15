import { Button, makeStyles, Text } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";

import { IStackScreenProps } from "@/types/navigation";

const WelcomeScreen = ({ navigation }: IStackScreenProps<"Welcome">) => {
  const styles = useStyles();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <AnimatedLottieView
        autoPlay
        loop={false}
        style={styles.lottie}
        source={require("@/assets/lottie/welcome.json")}
      />

      <Text style={styles.title}>{t("WelcomeScreen:title")}</Text>
      <Text style={styles.subtitle}>{t("WelcomeScreen:subtitle")}</Text>

      <Button
        title={t("common:get-started")}
        containerStyle={styles.buttonContainer}
        onPress={() => navigation.replace("Onboarding", { step: 0 })}
      />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  lottie: {
    width: "100%",
    aspectRatio: 1,
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
