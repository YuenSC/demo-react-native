import { Button, Dialog, makeStyles, Text } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableWithoutFeedback } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Config from "@/Config";
import { IStackScreenProps } from "@/types/navigation";

const WelcomeScreen = ({ navigation }: IStackScreenProps<"Welcome">) => {
  const styles = useStyles();
  const { t } = useTranslation();
  const [isDebugMode, setIsDebugMode] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback
        onLongPress={() => setIsDebugMode(!isDebugMode)}
      >
        <AnimatedLottieView
          autoPlay
          loop={false}
          style={styles.lottie}
          source={require("@/assets/lottie/welcome.json")}
        />
      </TouchableWithoutFeedback>

      <Text style={styles.title}>{t("WelcomeScreen:title")}</Text>
      <Text style={styles.subtitle}>{t("WelcomeScreen:subtitle")}</Text>

      <Button
        title={t("common:get-started")}
        containerStyle={styles.buttonContainer}
        onPress={() => navigation.replace("Onboarding", { step: 0 })}
      />

      <Dialog
        isVisible={isDebugMode}
        onBackdropPress={() => setIsDebugMode(false)}
      >
        <Text>{JSON.stringify(Config, null, 2)}</Text>
      </Dialog>
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
