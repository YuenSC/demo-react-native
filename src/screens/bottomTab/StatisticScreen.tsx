import { Text, makeStyles, useTheme } from "@rneui/themed";
import { PieChart, pieDataItem } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

const data: pieDataItem[] = [
  {
    value: 47,
    color: "#009FFF",
    gradientCenterColor: "#006DFF",
  },
  {
    value: 40,
    color: "#93FCF8",
    gradientCenterColor: "#3BE9DE",
  },
  {
    value: 16,
    color: "#BDB2FA",
    gradientCenterColor: "#8F80F3",
  },
  {
    value: 3,
    color: "#FFA5BA",
    gradientCenterColor: "#FF7F97",
  },
];

const StatisticScreen = () => {
  const styles = useStyles();
  const { theme } = useTheme();

  return (
    <SafeAreaView style={styles.container}>
      <PieChart
        data={data}
        showText
        donut
        showGradient
        radius={120}
        innerRadius={80}
        innerCircleColor={theme.colors.background}
        centerLabelComponent={() => {
          return <Text style={{ fontSize: 32, color: "white" }}>47%</Text>;
        }}
      />
    </SafeAreaView>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
  },
}));

export default StatisticScreen;
