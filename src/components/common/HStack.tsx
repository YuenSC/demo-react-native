import { makeStyles } from "@rneui/themed";
import { memo } from "react";
import { View, ViewProps } from "react-native";

type IHStackProps = ViewProps & {
  gap?: number;
};

const HStack = memo<IHStackProps>(({ gap, children, ...props }) => {
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
}));

HStack.displayName = "HStack";

export default HStack;
