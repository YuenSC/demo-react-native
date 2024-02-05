import { makeStyles } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

import AddMemberForm from "@/components/AddMemberForm";
import GroupForm from "@/components/GroupForm";
import ProfileForm from "@/components/ProfileForm";
import { IStackScreenProps } from "@/types/navigation";

const OnboardingScreen = ({
  navigation,
  route: {
    params: { step, groupId },
  },
}: IStackScreenProps<"Onboarding">) => {
  const styles = useStyles();

  return (
    <SafeAreaView style={styles.container}>
      {step === 0 && (
        <ProfileForm
          isEdit={false}
          onSubmit={() => {
            navigation.replace("Onboarding", { step: 1 });
          }}
        />
      )}
      {step === 1 && (
        <GroupForm
          groupId={undefined}
          onSubmit={(groupId) => {
            navigation.replace("Onboarding", { step: 2, groupId });
          }}
        />
      )}
      {step === 2 && (
        <AddMemberForm
          groupId={groupId || ""}
          onSubmit={() => {
            navigation.navigate("SignUpSuccessBottomSheetModal");
          }}
        />
      )}
    </SafeAreaView>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingTop: 32,
    // paddingHorizontal: 16,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
}));

export default OnboardingScreen;
