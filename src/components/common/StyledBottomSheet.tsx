import GorhomBottomSheet from "@gorhom/bottom-sheet";
import { makeStyles } from "@rneui/themed";
import { ComponentProps, forwardRef, memo } from "react";

type IStyledBottomSheetProps = ComponentProps<typeof GorhomBottomSheet>;

const StyledBottomSheet = forwardRef<
  GorhomBottomSheet,
  IStyledBottomSheetProps
>(({ children, ...props }, ref) => {
  const styles = useStyles();

  return (
    <GorhomBottomSheet
      {...props}
      ref={ref}
      containerStyle={[styles.backdrop, props.containerStyle]}
      backgroundStyle={[styles.background, props.backgroundStyle]}
      handleIndicatorStyle={[
        styles.handleIndicator,
        props.handleIndicatorStyle,
      ]}
    >
      {children}
    </GorhomBottomSheet>
  );
});

const useStyles = makeStyles((theme) => ({
  backdrop: {
    backgroundColor: theme.colors.backdrop,
  },
  background: {
    backgroundColor: theme.colors.modal,
  },
  handleIndicator: {
    backgroundColor: theme.colors.black,
  },
}));

StyledBottomSheet.displayName = "BottomSheet";

export default StyledBottomSheet;
