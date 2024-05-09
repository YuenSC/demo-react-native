import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Button, Text, makeStyles } from "@rneui/themed";
import AnimatedLottieView from "lottie-react-native";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { TouchableOpacity } from "react-native-gesture-handler";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import { HStack, VStack } from "@/components/common/Stack";
import StyledBottomSheet from "@/components/common/StyledBottomSheet";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import { groupNameByIdSelector } from "@/store/reducers/groups";
import { addUserToGroup, groupUsersSelector } from "@/store/reducers/users";
import { IStackScreenProps } from "@/types/navigation";

const GroupExistingUserSelectBottomSheet = ({
  navigation,
  route: {
    params: { groupId },
  },
}: IStackScreenProps<"GroupExistingUserSelectBottomSheet">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const groupUsers = useAppSelector((state) =>
    groupUsersSelector(state, groupId),
  );
  const allUsers = useAppSelector((state) => state.users.users);

  const userNotInGroup = allUsers.filter(
    (user) => !groupUsers.some((groupUser) => groupUser.id === user.id),
  );
  const profileUserId = useAppSelector((state) => state.profile.userId);

  const groupNameById = useAppSelector(groupNameByIdSelector);

  return (
    <StyledBottomSheet
      ref={bottomSheetRef}
      onClose={navigation.goBack}
      enablePanDownToClose
      enableDynamicSizing
    >
      <BottomSheetFlatList
        data={userNotInGroup}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <VStack alignItems="flex-start" style={styles.header} gap={4}>
            <Text h1>
              {t("GroupExistingUserSelectBottomSheet:existing-users")}
            </Text>
          </VStack>
        }
        ListFooterComponent={
          <Button
            title={t("Common:done")}
            style={{ marginTop: 8 }}
            onPress={navigation.goBack}
          />
        }
        ListEmptyComponent={() => {
          return (
            <VStack>
              <AnimatedLottieView
                autoPlay
                style={[styles.lottie]}
                source={require("@/assets/lottie/empty.json")}
              />

              <Text style={styles.emptyText}>
                {t("GroupExistingUserSelectBottomSheet:no-existing-user-found")}
              </Text>
            </VStack>
          );
        }}
        renderItem={({ item }) => {
          const isProfileUser = item.id === profileUserId;
          return (
            <TouchableOpacity
              onPress={() => {
                dispatch(addUserToGroup({ id: item.id, groupId }));
                navigation.goBack();
              }}
            >
              <VStack alignItems="flex-start" style={styles.item}>
                <HStack gap={2}>
                  <Text>User : {item.name}</Text>
                  <Text style={styles.profileUserLabel}>
                    {isProfileUser ? t("Common:profileUserLabel") : ""}
                  </Text>
                </HStack>
                <Text>
                  Related Group :{" "}
                  {item.groupIds?.map((id) => groupNameById[id]).join(",") ||
                    t("Common:NA")}
                </Text>
              </VStack>
            </TouchableOpacity>
          );
        }}
      />
    </StyledBottomSheet>
  );
};

const useStyles = makeStyles((theme, inset: EdgeInsets) => ({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: theme.colors.backdrop,
  },
  content: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: inset.bottom,
  },

  header: {},
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  titleHighlight: {
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.grey1,
    fontWeight: "500",
  },
  profileUserLabel: {
    fontStyle: "italic",
    color: theme.colors.primary,
  },
  lottie: {
    width: "70%",
    aspectRatio: 1,
    marginTop: -64,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 16,
  },
  item: {
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    borderRadius: 8,
  },
}));

export default GroupExistingUserSelectBottomSheet;
