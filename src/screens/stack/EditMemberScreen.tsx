import { Button, Input, Text, makeStyles } from "@rneui/themed";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { View } from "react-native";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { deleteMember, updateMember } from "@/store/reducers/groups";
import { IStackScreenProps } from "@/types/navigation";

const EditMemberScreen = ({
  navigation,
  route: {
    params: { id, groupId },
  },
}: IStackScreenProps<"EditMember">) => {
  const styles = useStyles();
  const dispatch = useAppDispatch();

  const group = useAppSelector((state) =>
    state.groups.groups.find((group) => group.id === groupId),
  );
  const member = group?.members?.find((member) => member.id === id);

  const { control, handleSubmit } = useForm<{ name: string }>({
    defaultValues: {
      name: member?.name, // TODO: remove default value after testing,
    },
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: member?.name
        ? `Edit ${member.name}'s information`
        : "Edit Member",
    });
  }, [member.name, navigation]);

  if (!member) {
    return (
      <View style={styles.container}>
        <Text>Member not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text h1 style={styles.title}>
        Edit Member
      </Text>

      <Controller
        control={control}
        name="name"
        rules={{ required: "Member Name is required" }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            autoFocus
            onChangeText={onChange}
            value={value}
            placeholder={member.name}
            label="Member Name"
            errorMessage={error?.message}
          />
        )}
      />
      <Button
        title="Save"
        containerStyle={styles.button}
        onPress={handleSubmit((values) => {
          dispatch(
            updateMember({
              groupId,
              memberId: id,
              name: values.name.trim(),
            }),
          );
          navigation.goBack();
        })}
      />
      <Button
        title="Delete"
        type="outline"
        color="error"
        onPress={() => {
          dispatch(deleteMember({ groupId, memberId: id }));
          navigation.goBack();
        }}
      />
    </View>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 16,
  },
  title: {
    marginBottom: 24,
  },
  button: {
    marginBottom: 8,
  },
}));

export default EditMemberScreen;
