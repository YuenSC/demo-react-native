import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Button, Input, Text, makeStyles, useTheme } from "@rneui/themed";
import { memo, useState } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import AvatarIcon from "./AvatarIcon";
import { HStack, VStack } from "./common/Stack";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { addUser, groupUsersSelector } from "@/store/reducers/users";
import { AvatarColor } from "@/types/AvatarColor";
import "react-native-get-random-values";

type IUserListFormProps = {
  groupId?: string;
  onSubmit: () => void;
  buttonText?: string;
};

const UserListForm = memo<IUserListFormProps>(
  ({ groupId, onSubmit, buttonText }) => {
    const styles = useStyles();
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const navigation = useNavigation();
    const { t } = useTranslation();

    const groupUsers = useAppSelector((state) =>
      groupUsersSelector(state, groupId || ""),
    );
    const allUsers = useAppSelector((state) => state.users.users);
    const users = groupId ? groupUsers : allUsers;

    const profile = useAppSelector((state) => state.profile);
    const [username, setUserName] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardDismissMode="on-drag"
      >
        <VStack alignItems="flex-start">
          <Text h1 style={styles.title}>
            {groupId
              ? t("UserListForm:members")
              : t("UserListForm:all-members")}
          </Text>
        </VStack>

        <View>
          {users?.map((member, index) => {
            const isProfileUser = member.id === profile.userId;
            const isLast = index === users.length - 1;

            return (
              <View
                key={member.id}
                style={[
                  styles.memberContainer,
                  isLast && { borderBottomWidth: 0 },
                ]}
              >
                <HStack gap={4}>
                  <AvatarIcon
                    size="small"
                    color={member.avatarColor}
                    userName={member.name}
                  />
                  <HStack gap={2}>
                    <Text style={styles.memberName}>{member.name}</Text>
                    {isProfileUser && (
                      <Text style={styles.memberNameOwner}>
                        {t("Common:profileUserLabel")}
                      </Text>
                    )}
                  </HStack>
                </HStack>

                <HStack gap={8}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate("EditMember", { id: member.id })
                    }
                  >
                    <Feather
                      name="edit"
                      size={24}
                      color={theme.colors.primary}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate("UserDeleteBottomSheet", {
                        groupId,
                        userId: member.id,
                        onDeleteSuccess: navigation.goBack,
                      });
                    }}
                  >
                    <AntDesign
                      name="delete"
                      size={24}
                      color={theme.colors.error}
                    />
                  </TouchableOpacity>
                </HStack>
              </View>
            );
          })}

          {groupId && (
            <View>
              {isFocused ? (
                <Animated.View
                  entering={FadeIn.duration(300)}
                  exiting={FadeOut.duration(300)}
                >
                  <Input
                    autoFocus
                    onChangeText={setUserName}
                    value={username}
                    placeholder={t("UserListForm:type-participant-name")}
                    renderErrorMessage={false}
                    containerStyle={styles.inputContainer}
                    inputContainerStyle={{
                      borderBottomWidth: 0,
                      paddingHorizontal: 0,
                    }}
                    onEndEditing={() => {
                      if (username) {
                        dispatch(
                          addUser({
                            groupIds: [groupId],
                            name: username,
                            avatarColor: AvatarColor.AmethystPurple,
                          }),
                        );
                      }
                      setUserName("");
                      setIsFocused(false);
                    }}
                  />
                </Animated.View>
              ) : (
                <TouchableOpacity
                  onPress={() => setIsFocused(true)}
                  style={[styles.input]}
                >
                  <Entypo name="plus" size={24} color={theme.colors.primary} />
                  <Text style={styles.memberName}>
                    {t("UserListForm:add-participant")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        <VStack alignItems="stretch" gap={8} style={styles.buttonContainer}>
          {groupId && (
            <Button
              title={t("UserListForm:select-existing-user")}
              type="outline"
              onPress={() =>
                navigation.navigate("GroupExistingUserSelectBottomSheet", {
                  groupId,
                })
              }
            />
          )}
          <Button title={buttonText ?? t("Common:next")} onPress={onSubmit} />
        </VStack>
      </ScrollView>
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
  },
  buttonContainer: {
    marginTop: 16,
  },

  memberContainer: {
    padding: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.grey4,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  memberName: {
    fontSize: 18,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    height: 64,
    paddingHorizontal: 8,
  },
  inputContainer: {
    padding: 12,
    paddingHorizontal: 16,
  },
  memberNameOwner: {
    fontStyle: "italic",
    color: theme.colors.primary,
  },
}));

UserListForm.displayName = "UserList";

export default UserListForm;
