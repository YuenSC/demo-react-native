import { makeStyles } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";

import GroupForm from "@/components/GroupForm";
import UserList from "@/components/UserList";
import UserForm from "@/components/userForm/UserForm";
import { useAppDispatch } from "@/hooks/reduxHook";
import { updateProfile } from "@/store/reducers/profile";
import { IStackScreenProps } from "@/types/navigation";

const OnboardingScreen = ({
  navigation,
  route: {
    params: { step, groupId },
  },
}: IStackScreenProps<"Onboarding">) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();

  return (
    <SafeAreaView style={styles.container}>
      {step === 0 && (
        <UserForm
          type="profile"
          submitButtonText="Next"
          isEdit={false}
          onSubmit={(values) => {
            dispatch(updateProfile({ ...values, name: values.name.trim() }));
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
        <UserList
          groupId={groupId || ""}
          onSubmitSuccess={() => {
            navigation.navigate("SignUpSuccessBottomSheet");
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
