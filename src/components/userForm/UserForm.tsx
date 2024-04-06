import { Button, Input, Text, makeStyles } from "@rneui/themed";
import { memo, useMemo } from "react";
import { Controller, useController, useForm } from "react-hook-form";
import { View } from "react-native";

import ProfileFormAvatarSelect from "./UserFormAvatarSelect";
import { VStack } from "../common/Stack";

import { useAppSelector } from "@/hooks/reduxHook";
import { AvatarColor } from "@/types/AvatarColor";
import { IProfileCreatePayload } from "@/types/ProfileCreate";

type IUserFormProps = {
  type: "profile" | "groupUser";
  isEdit?: boolean;
  onSubmit: (values: IProfileCreatePayload) => void;
  onDelete?: () => void;
  groupId?: string;
  userId?: string;
  submitButtonText: string;
};

const UserForm = memo<IUserFormProps>(
  ({ type, onSubmit, isEdit, groupId, userId, onDelete, submitButtonText }) => {
    const styles = useStyles();
    const primaryUser = useAppSelector((state) => state.profile);
    const groups = useAppSelector((state) => state.groups.groups);

    const defaultUser = useMemo(() => {
      if (!isEdit)
        return {
          name: "Calvin", // TODO: REMOVE THIS LINE
          avatarColor: AvatarColor.AmethystPurple,
        };

      switch (type) {
        case "profile":
          return primaryUser;
        case "groupUser":
          return groups
            .find((group) => group.id === groupId)
            ?.members?.find((member) => member.id === userId);
      }
    }, [groupId, groups, isEdit, primaryUser, type, userId]);

    const { control, handleSubmit } = useForm<IProfileCreatePayload>({
      defaultValues: defaultUser,
    });

    const nameController = useController({
      name: "name",
      control,
      rules: { required: "Your name is required" },
    });

    return (
      <View style={styles.container}>
        {isEdit ? (
          <Text h1 style={styles.title}>
            Edit Member
          </Text>
        ) : (
          <Text h1 style={styles.title}>
            {defaultUser?.name ? `Hi ${defaultUser.name}` : "Create Profile"}
          </Text>
        )}

        <Input
          autoFocus
          onChangeText={nameController.field.onChange}
          value={nameController.field.value}
          placeholder="Name"
          label="Who are you?"
          errorMessage={nameController.fieldState.error?.message}
        />

        {nameController.field.value && (
          <View>
            <Text style={styles.label}>Your avatar color</Text>
            <Controller
              name="avatarColor"
              control={control}
              render={({ field: { value, onChange } }) => (
                <ProfileFormAvatarSelect
                  userName={nameController.field.value}
                  selectedColor={value}
                  onSelectColor={onChange}
                />
              )}
            />
          </View>
        )}

        <VStack alignItems="stretch" gap={4}>
          <Button
            title={submitButtonText}
            containerStyle={styles.button}
            onPress={handleSubmit(onSubmit)}
          />
          {onDelete && (
            <Button
              title="Delete"
              type="outline"
              color="error"
              onPress={onDelete}
            />
          )}
        </VStack>
      </View>
    );
  },
);

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 24,
  },
  button: {
    marginTop: 16,
  },
  label: {
    color: theme.colors.grey3,
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 10,
  },
}));

UserForm.displayName = "UserForm";

export default UserForm;
