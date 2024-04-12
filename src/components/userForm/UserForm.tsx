import { Button, Input, Text, makeStyles } from "@rneui/themed";
import { memo, useMemo } from "react";
import { Controller, useController, useForm } from "react-hook-form";
import { View } from "react-native";

import ProfileFormAvatarSelect from "./UserFormAvatarSelect";
import { VStack } from "../common/Stack";

import { useAppSelector } from "@/hooks/reduxHook";
import { userSelector } from "@/store/reducers/users";
import { AvatarColor } from "@/types/AvatarColor";
import { IUserCreatePayload } from "@/types/User";

type IUserFormProps = {
  isEdit?: boolean;
  onSubmit: (values: IUserCreatePayload) => void;
  onDelete?: () => void;
  userId?: string;
  submitButtonText: string;
};

const UserForm = memo<IUserFormProps>(
  ({ onSubmit, isEdit, userId, onDelete, submitButtonText }) => {
    const styles = useStyles();
    const user = useAppSelector((state) => userSelector(state, userId));

    const defaultUser = useMemo(() => {
      return isEdit
        ? user
        : {
            name: "Calvin", // TODO: REMOVE THIS LINE
            avatarColor: AvatarColor.AmethystPurple,
          };
    }, [isEdit, user]);

    const { control, handleSubmit } = useForm<IUserCreatePayload>({
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
