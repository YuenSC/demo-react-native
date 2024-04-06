import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Button, Text, makeStyles } from "@rneui/themed";
import { View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppDispatch } from "@/hooks/reduxHook";
import { deletePaymentRecord } from "@/store/reducers/groups";
import { IStackScreenProps } from "@/types/navigation";

const GroupDeletePaymentRecordBottomSheet = ({
  navigation,
  route: {
    params: { groupId, recordId },
  },
}: IStackScreenProps<"GroupDeletePaymentRecordBottomSheet">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const dispatch = useAppDispatch();

  return (
    <View style={styles.container}>
      <BottomSheet
        onClose={() => navigation.goBack()}
        enablePanDownToClose
        enableDynamicSizing
        snapPoints={["20%"]}
      >
        <BottomSheetView style={styles.content}>
          <Text style={styles.title}>Are you sure to delete this record?</Text>

          <Button
            title="Delete"
            color="error"
            onPress={() => {
              dispatch(deletePaymentRecord({ groupId, recordId }));
              navigation.pop(2);
            }}
          />
        </BottomSheetView>
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

  content: {
    paddingHorizontal: 16,
    gap: 12,
    paddingBottom: inset.bottom + 24,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
}));

export default GroupDeletePaymentRecordBottomSheet;
