import { makeStyles } from "@rneui/themed";
import { memo } from "react";
import { View, ViewProps } from "react-native";

type IVStackProps = ViewProps & {
  gap?: number;
};

const VStack = memo<IVStackProps>(({ gap, children, ...props }) => {
  const styles = useStyles(gap || 0);

  return (
    <View {...props} style={[props.style, styles.container]}>
      {children}
    </View>
  );
});

const useStyles = makeStyles((theme, gap: number) => ({
  container: {
    gap,
  },
}));

VStack.displayName = "VStack";

export default VStack;
