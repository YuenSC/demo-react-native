import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Button, Text, makeStyles } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { useCallback, useRef } from "react";
import { View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppSelector } from "@/hooks/reduxHook";
import { currentGroupSelector } from "@/store/reducers/groups";
import { IStackScreenProps } from "@/types/navigation";

const SignUpSuccessBottomSheet = ({
  navigation,
}: IStackScreenProps<"SignUpSuccessBottomSheet">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);

  const bottomSheetRef = useRef<BottomSheet>(null);

  const currentGroup = useAppSelector(currentGroupSelector);

  const handleClose = useCallback(() => {
    navigation.navigate("Drawer", {
      screen: "BottomTab",
      params: { id: currentGroup?.id },
    });
  }, [currentGroup?.id, navigation]);

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        onClose={handleClose}
        enablePanDownToClose
        enableDynamicSizing
      >
        <BottomSheetView style={styles.contentContainer}>
          <AnimatedLottieView
            autoPlay
            loop={false}
            style={styles.lottie}
            source={require("@/assets/lottie/congrat.json")}
          />
          <View style={styles.content}>
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
        </BottomSheetView>
      </BottomSheet>
    </View>
  );
};

const useStyles = makeStyles((theme, inset: EdgeInsets) => ({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.backdrop,
  },
  contentContainer: {
    flex: 0,
    minHeight: 100,
    paddingHorizontal: 24,
    paddingBottom: Math.max(inset.bottom, 16),
  },
  content: {
    marginTop: -50,
  },
  lottie: {
    width: "60%",
    aspectRatio: 1,
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

export default SignUpSuccessBottomSheet;
