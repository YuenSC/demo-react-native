import BottomSheet from "@gorhom/bottom-sheet";
import { Button, makeStyles } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { useCallback, useMemo, useRef } from "react";
import { Text, View } from "react-native";

import { IStackScreenProps } from "@/types/navigation";

const snapPoints = ["50%"];

const SignUpSuccessBottomSheetModal = ({
  navigation,
}: IStackScreenProps<"SignUpSuccessBottomSheetModal">) => {
  const styles = useStyles();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const handleClose = useCallback(() => {
    navigation.navigate("Drawer", { screen: "GroupDetail", params: {} });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        onClose={handleClose}
        enablePanDownToClose
      >
        <AnimatedLottieView
          autoPlay
          loop={false}
          style={styles.lottie}
          source={require("@/assets/lottie/congrat.json")}
        />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>Congratulations!</Text>
          <Text style={styles.subtitle}>
            {"Let's create your first payment record \n with your friends!"}
          </Text>
          <Button
            title="Get Started"
            containerStyle={styles.buttonContainer}
            onPress={handleClose}
          />
        </View>
      </BottomSheet>
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.backdrop,
  },
  contentContainer: {
    flex: 1,
    marginTop: -64,
    paddingHorizontal: 24,
  },
  lottie: {
    width: "100%",
    height: 300,
    alignSelf: "center",
    marginTop: -8,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 16,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.grey1,
    textAlign: "center",
  },
  buttonContainer: {
    marginTop: 24,
  },
}));

export default SignUpSuccessBottomSheetModal;
