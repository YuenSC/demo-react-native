import { makeStyles } from "@rneui/themed";
import { View } from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import GroupForm from "@/components/GroupForm";
import UserListForm from "@/components/UserListForm";
import { useAppDispatch } from "@/hooks/reduxHook";
import { addGroup, setCurrentGroupId } from "@/store/reducers/groups";
import { IStackScreenProps } from "@/types/navigation";

const GroupFormScreen = ({
  navigation,
  route: {
    params: { step, groupId },
  },
}: IStackScreenProps<"GroupForm">) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      {step === 0 && (
        <GroupForm
          groupId={undefined}
          onSubmit={(values) => {
            const groupId = uuidv4();
            dispatch(addGroup({ ...values, id: groupId }));
            navigation.replace("GroupForm", { step: 1, groupId });
          }}
        />
      )}
      {step === 1 && (
        <UserListForm
          buttonText="Done"
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
