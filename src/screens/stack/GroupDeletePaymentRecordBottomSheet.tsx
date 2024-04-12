import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Button, Text, makeStyles } from "@rneui/themed";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import StyledBottomSheet from "@/components/common/StyledBottomSheet";
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
    <StyledBottomSheet
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
    gap: 12,
    paddingBottom: inset.bottom,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
}));

export default GroupDeletePaymentRecordBottomSheet;
