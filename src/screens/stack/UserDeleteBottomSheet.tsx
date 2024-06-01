import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Button, Text, makeStyles } from "@rneui/themed";
import { useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { useWindowDimensions } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import PaymentRecordDisplay from "@/components/PaymentRecordDisplay";
import { VStack } from "@/components/common/Stack";
import StyledBottomSheet from "@/components/common/StyledBottomSheet";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import {
  groupSelector,
  relatedPaymentsSelector,
} from "@/store/reducers/groups";
import {
  deleteUser,
  removeUserFromGroup,
  userSelector,
} from "@/store/reducers/users";
import { IStackScreenProps } from "@/types/navigation";

const UserDeleteBottomSheet = ({
  navigation,
  route: {
    params: { groupId = "", userId, onDeleteSuccess },
  },
}: IStackScreenProps<"UserDeleteBottomSheet">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const dispatch = useAppDispatch();
  const { height } = useWindowDimensions();
  const { t } = useTranslation();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const group = useAppSelector((state) => groupSelector(state, groupId));

  const user = useAppSelector((state) => userSelector(state, userId));
  const relatedPayments = useAppSelector((state) =>
    relatedPaymentsSelector(state, userId, groupId),
  );

  return (
    <StyledBottomSheet
      ref={bottomSheetRef}
      onClose={navigation.goBack}
      enablePanDownToClose
      snapPoints={
        relatedPayments.length > 0 ? ["50%", height - insets.top] : []
      }
      enableDynamicSizing={relatedPayments.length === 0}
    >
      <BottomSheetFlatList
        data={relatedPayments}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.content}
        ListHeaderComponent={
          <VStack alignItems="flex-start" style={styles.header} gap={4}>
            {/* <Text style={styles.title}>
              {`Are you sure to delete `}
              <Text style={styles.titleHighlight}>{user?.name}</Text>
              {` from `}
              <Text style={styles.titleHighlight}>
                {group?.name || "All Groups"}
              </Text>
              ?
            </Text> */}

            <Trans
              i18nKey="UserDeleteBottomSheet:title" // optional -> fallbacks to defaults if not provided
              values={{
                username: user?.name,
                groupname: group?.name || "All Groups",
              }}
              components={{
                Highlight: <Text style={styles.titleHighlight} />,
                Text: <Text style={styles.title} />,
              }}
            />

            <Text style={styles.warning}>
              {t(
                "UserDeleteBottomSheet:please-note-that-this-action-is-irreversible",
              )}
            </Text>
            {relatedPayments.length > 0 && (
              <Text style={styles.subtitle}>
                {t("UserDeleteBottomSheet:related-payment", {
                  count: relatedPayments.length,
                })}
              </Text>
            )}
          </VStack>
        }
        ListFooterComponent={
          <Button
            title={t("Common:delete")}
            onPress={() => {
              if (groupId) {
                dispatch(
                  removeUserFromGroup({
                    id: user?.id!,
                    groupId,
                  }),
                );
              } else {
                dispatch(deleteUser(userId));
              }

              onDeleteSuccess();
            }}
            color="error"
            disabled={relatedPayments.length > 0}
          />
        }
        renderItem={({ item }) => {
          if (!userId) return null;

          return (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate("EditPayment", {
                  groupId: item.groupId,
                  recordId: item.id,
                })
              }
            >
              <PaymentRecordDisplay record={item} userId={userId} />
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
  contentContainer: {
    padding: 16,
    paddingBottom: Math.max(inset.bottom, 16),
  },
  content: {
    paddingHorizontal: 16,
    gap: 8,
    paddingBottom: inset.bottom,
  },

  header: {
    marginBottom: 16,
  },
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
  warning: {
    color: theme.colors.grey2,
  },
  footer: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.background,
    paddingBottom: inset.bottom,
  },
}));

export default UserDeleteBottomSheet;
