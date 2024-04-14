import { BottomSheetView } from "@gorhom/bottom-sheet";
import { Button, Text, makeStyles } from "@rneui/themed";
import { useTranslation } from "react-i18next";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";

import StyledBottomSheet from "@/components/common/StyledBottomSheet";
import { useAppDispatch } from "@/hooks/reduxHook";
import { deleteGroup } from "@/store/reducers/groups";
import { IStackScreenProps } from "@/types/navigation";

const GroupDeleteBottomSheet = ({
  navigation,
  route: {
    params: { groupId },
  },
}: IStackScreenProps<"GroupDeleteBottomSheet">) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(insets);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  return (
    <StyledBottomSheet
      onClose={() => navigation.goBack()}
      enablePanDownToClose
      enableDynamicSizing
    >
      <BottomSheetView style={styles.content}>
        <Text style={styles.title}>
          {t("GroupDeleteBottomSheet:are-you-sure-to-delete-this-group")}
        </Text>
        <Text style={styles.subtitle}>
          {t("GroupDeleteBottomSheet:warning")}
        </Text>

        <Button
          title={t("Common:back")}
          color="success"
          onPress={() => {
            navigation.goBack();
          }}
        />

        <Button
          title={t("Common:delete")}
          color="error"
          type="clear"
          onPress={() => {
            dispatch(deleteGroup({ id: groupId }));
            navigation.goBack();
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
    paddingBottom: inset.bottom,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    color: theme.colors.grey1,
  },
}));

export default GroupDeleteBottomSheet;
