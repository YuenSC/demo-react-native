import { Text, makeStyles } from "@rneui/themed";
import { useEffect } from "react";
import { View } from "react-native";

import UserForm from "@/components/userForm/UserForm";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { groupUsersSelector, updateUser } from "@/store/reducers/users";
import { IStackScreenProps } from "@/types/navigation";

const EditMemberScreen = ({
  navigation,
  route: {
    params: { id, groupId },
  },
}: IStackScreenProps<"EditMember">) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();

  const groupUsers = useAppSelector((state) =>
    groupUsersSelector(state, groupId),
  );
  const member = groupUsers?.find((member) => member.id === id);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: member?.name
        ? `Edit ${member.name}'s information`
        : "Edit Member",
    });
  }, [member?.name, navigation]);

  if (!member) {
    return (
      <View style={styles.container}>
        <Text>Member not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <UserForm
        isEdit
        groupId={groupId}
        submitButtonText="Save"
        userId={id}
        onSubmit={(values) => {
          dispatch(
            updateUser({
              id,
              groupIds: [...member.groupIds, groupId],
              name: values.name.trim(),
              avatarColor: values.avatarColor,
            }),
          );
          navigation.goBack();
        }}
        onDelete={() => {
          navigation.navigate("GroupDeleteUserBottomSheet", {
            groupId,
            userId: id,
          });
        }}
      />
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.modal,
    paddingVertical: 16,
  },
}));

export default EditMemberScreen;
