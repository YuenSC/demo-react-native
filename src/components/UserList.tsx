import { AntDesign, Entypo, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Button, Input, Text, makeStyles, useTheme } from "@rneui/themed";
import { memo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import AvatarIcon from "./AvatarIcon";
import { HStack } from "./common/Stack";

import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { addMember, deleteMember } from "@/store/reducers/groups";
import { AvatarColor } from "@/types/AvatarColor";
import "react-native-get-random-values";

type IUserListProps = {
  groupId: string;
  onSubmitSuccess: () => void;
  buttonText?: string;
};

const UserList = memo<IUserListProps>(
  ({ groupId, onSubmitSuccess, buttonText = "Next" }) => {
    const styles = useStyles();
    const { theme } = useTheme();
    const group = useAppSelector((state) =>
      state.groups.groups.find((group) => group.id === groupId),
    );
    const profile = useAppSelector((state) => state.profile);
    const dispatch = useAppDispatch();
    const [username, setUserName] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const navigation = useNavigation();

    return (
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardDismissMode="on-drag"
      >
        <Text h1 style={styles.title}>
          Members
        </Text>

        <View>
          {group?.members?.map((member) => {
            const isOwner = member.id === profile.id;

            return (
              <View key={member.id} style={styles.memberContainer}>
                <HStack gap={4}>
                  <AvatarIcon
                    size="small"
                    color={member.avatarColor}
                    userName={member.name}
                  />
                  <Text style={styles.memberName}>{member.name}</Text>
                </HStack>

                {isOwner ? (
                  <Text>(Owner)</Text>
                ) : (
                  <HStack gap={8}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("EditMember", {
                          id: member.id,
                          groupId,
                        })
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
                        navigation.navigate("GroupDeleteUserBottomSheet", {
                          groupId,
                          userId: member.id,
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
                )}
              </View>
            );
          })}

          {isFocused ? (
            <Animated.View
              entering={FadeIn.duration(300)}
              exiting={FadeOut.duration(300)}
            >
              <Input
                autoFocus
                onChangeText={setUserName}
                value={username}
                placeholder="Type participant name"
                renderErrorMessage={false}
                containerStyle={styles.inputContainer}
                inputContainerStyle={{
                  borderBottomWidth: 0,
                  paddingHorizontal: 0,
                }}
                onEndEditing={() => {
                  if (username) {
                    dispatch(
                      addMember({
                        groupId,
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
              <Text style={styles.memberName}>Add participant</Text>
            </TouchableOpacity>
          )}
        </View>

        <Button
          title={buttonText}
          containerStyle={styles.button}
          onPress={onSubmitSuccess}
        />
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
    marginBottom: 24,
  },
  button: {
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
}));

UserList.displayName = "UserList";

export default UserList;
