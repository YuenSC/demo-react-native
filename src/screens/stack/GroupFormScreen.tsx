import { makeStyles } from "@rneui/themed";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import GroupForm from "@/components/GroupForm";
import UserListForm from "@/components/UserListForm";
import { useAppDispatch } from "@/hooks/reduxHook";
import {
  addGroup,
  setCurrentGroupId,
  updateGroup,
} from "@/store/reducers/groups";
import { IStackScreenProps } from "@/types/navigation";

const GroupFormScreen = ({
  navigation,
  route: {
    params: { step, groupId, shouldEditUserList },
  },
}: IStackScreenProps<"GroupForm">) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      {step === 0 && (
        <GroupForm
          groupId={groupId}
          onSubmit={(values) => {
            const newGroupId = uuidv4();
            if (groupId) {
              dispatch(updateGroup({ ...values, id: groupId }));
            } else {
              dispatch(addGroup({ ...values, id: newGroupId }));
            }

            if (shouldEditUserList)
              navigation.replace("GroupForm", { step: 1, groupId: newGroupId });
            else {
              navigation.goBack();
            }
          }}
        />
      )}
      {step === 1 && (
        <UserListForm
          buttonText={t("Common:done")}
          groupId={groupId || ""}
          onSubmit={() => {
            dispatch(setCurrentGroupId(groupId || ""));
            navigation.push("GroupCreateSuccessBottomSheet", {
              isOnboarding: false,
            });
          }}
        />
      )}
    </View>
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

export default GroupFormScreen;
