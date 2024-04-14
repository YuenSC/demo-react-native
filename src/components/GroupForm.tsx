import { Button, Input, Text, makeStyles } from "@rneui/themed";
import { memo } from "react";
import { Controller, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

import { useAppSelector } from "@/hooks/reduxHook";
import { IGroupCreatePayload } from "@/types/GroupCreate";

type IGroupFormProps = {
  groupId?: string;
  onSubmit: (values: IGroupCreatePayload) => void;
  isProfileUserIncluded?: boolean;
};

const GroupForm = memo<IGroupFormProps>(({ groupId, onSubmit }) => {
  const styles = useStyles();
  const isEdit = groupId;
  const { t } = useTranslation();

  const group = useAppSelector((state) =>
    state.groups.groups.find((group) => group.id === groupId),
  );
  const { control, handleSubmit } = useForm<IGroupCreatePayload>({
    defaultValues: {
      name: group?.name || "Calvin Group", // TODO: remove default value after testing,
    },
  });

  return (
    <View style={styles.container}>
      <Text h1 style={styles.title}>
        {group?.name || t("GroupForm:create-group")}
      </Text>
      <Controller
        control={control}
        name="name"
        rules={{ required: t("GroupForm:group-name-is-required") }}
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <Input
            autoFocus
            onChangeText={onChange}
            value={value}
            placeholder={t("GroupForm:your-first-group-expense")}
            label={t("GroupForm:group-name")}
            errorMessage={error?.message}
          />
        )}
      />
      <Button
        title={isEdit ? t("Common:done") : t("Common:create")}
        containerStyle={styles.button}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
});

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
}));

GroupForm.displayName = "GroupForm";

export default GroupForm;
