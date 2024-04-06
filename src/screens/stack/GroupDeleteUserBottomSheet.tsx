import BottomSheet, { BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Button, Text, makeStyles } from "@rneui/themed";
import { useRef } from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import PaymentRecordDisplay from "@/components/PaymentRecordDisplay";
import { VStack } from "@/components/common/Stack";
import { useAppDispatch, useAppSelector } from "@/hooks/reduxHook";
import {
  deleteMember,
  memberSelector,
  relatedPaymentsSelector,
} from "@/store/reducers/groups";
import { IStackScreenProps } from "@/types/navigation";

const GroupDeleteUserBottomSheet = ({
  navigation,
  route: {
    params: { groupId, userId },
  },
}: IStackScreenProps<"GroupDeleteUserBottomSheet">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const dispatch = useAppDispatch();

  const bottomSheetRef = useRef<BottomSheet>(null);
  const user = useAppSelector((state) =>
    memberSelector(state, groupId, userId),
  );
  const relatedPayments = useAppSelector((state) =>
    relatedPaymentsSelector(state, groupId, userId),
  );

  return (
    <View style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        onClose={navigation.goBack}
        enablePanDownToClose
        snapPoints={relatedPayments.length > 0 ? ["50%", "90%"] : []}
        enableDynamicSizing={relatedPayments.length === 0}
      >
        <BottomSheetFlatList
          data={relatedPayments}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.content}
          ListHeaderComponent={
            <VStack alignItems="flex-start" style={styles.header} gap={4}>
              <Text style={styles.title}>
                {`Are you sure to delete `}
                <Text style={styles.titleHighlight}>{user?.name}</Text>?
              </Text>
              {relatedPayments.length > 0 && (
                <Text style={styles.subtitle}>
                  You will have to remove {relatedPayments.length} related
                  payment before deleting this user.
                </Text>
              )}
            </VStack>
          }
          ListFooterComponent={
            <Button
              title="Delete"
              onPress={() => {
                dispatch(deleteMember({ groupId, userId }));
                navigation.goBack();
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
                    groupId,
                    recordId: item.id,
                  })
                }
              >
                <PaymentRecordDisplay record={item} userId={userId} />
              </TouchableOpacity>
            );
          }}
        />
      </BottomSheet>
    </View>
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
  footer: {
    marginHorizontal: 16,
    backgroundColor: theme.colors.background,
    paddingBottom: inset.bottom,
  },
}));

export default GroupDeleteUserBottomSheet;
