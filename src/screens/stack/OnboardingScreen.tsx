import { makeStyles } from "@rneui/themed";
import { SafeAreaView } from "react-native-safe-area-context";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import Config from "@/Config";
import GroupForm from "@/components/GroupForm";
import UserListForm from "@/components/UserListForm";
import UserForm from "@/components/userForm/UserForm";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { addGroup } from "@/store/reducers/groups";
import { profileUserSelector, updateProfile } from "@/store/reducers/profile";
import { addUser, updateUser } from "@/store/reducers/users";
import { AvatarColor } from "@/types/AvatarColor";
import { User } from "@/types/User";
import { IStackScreenProps } from "@/types/navigation";

import { useTranslation } from "react-i18next";

const OnboardingScreen = ({
  navigation,
  route: {
    params: { step, groupId },
  },
}: IStackScreenProps<"Onboarding">) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const profileUser = useAppSelector(profileUserSelector);
  const { t } = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      {step === 0 && (
        <UserForm
          submitButtonText={t("Common:next")}
          isEdit={false}
          onSubmit={(values) => {
            const id = uuidv4();
            const payload = { ...values, id };
            dispatch(addUser(payload));
            dispatch(updateProfile(id));
            navigation.replace("Onboarding", { step: 1 });
          }}
        />
      )}
      {step === 1 && (
        <GroupForm
          groupId={undefined}
          onSubmit={(values) => {
            const groupId = uuidv4();
            dispatch(addGroup({ ...values, id: groupId }));
            dispatch(updateUser({ id: profileUser?.id!, groupIds: [groupId] }));
            // Add test users to group
            if (Config.isDev) {
              const testUsers = [
                {
                  id: uuidv4(),
                  name: "Cyu",
                  avatarColor: AvatarColor.CoralPink,
                  groupIds: [groupId],
                },
                {
                  id: uuidv4(),
                  name: "Ching To",
                  avatarColor: AvatarColor.GoldenrodYellow,
                  groupIds: [groupId],
                },
              ] satisfies User[];

              testUsers.forEach((user) => {
                dispatch(addUser(user));
              });
            }
            navigation.replace("Onboarding", { step: 2, groupId });
          }}
        />
      )}
      {step === 2 && (
        <UserListForm
          groupId={groupId || ""}
          onSubmit={() => {
            navigation.navigate("GroupCreateSuccessBottomSheet", {
              isOnboarding: true,
            });
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
    paddingTop: 32,
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
