import { makeStyles } from "@rneui/themed";
import { memo } from "react";
import { View, ViewProps } from "react-native";

type CustomStyles = {
  gap?: number;
  alignItems?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline";
  justifyContent?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
};

type IHStackProps = ViewProps & CustomStyles;

const HStack = memo<IHStackProps>(
  ({ gap, alignItems, justifyContent, children, ...props }) => {
    const styles = useStyles({ gap, alignItems, justifyContent });

    return (
      <View {...props} style={[props.style, styles.container]}>
        {children}
      </View>
    );
  },
);

const useStyles = makeStyles((theme, style: CustomStyles) => ({
  container: {
    gap: style.gap,
    flexDirection: "row",
    alignItems: style.alignItems || "center",
    justifyContent: style.justifyContent || "space-between",
  },
}));

HStack.displayName = "HStack";

export default HStack;
