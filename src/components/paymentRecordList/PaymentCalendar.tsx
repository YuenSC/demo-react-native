import { Text, makeStyles, useTheme } from "@rneui/themed";
import { memo, useMemo } from "react";
import { View } from "react-native";
import { Calendar } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

import { PaymentRecord } from "@/types/PaymentRecord";

type IPaymentCalendarProps = {
  date: Date;
  onDateChange: (date: Date) => void;
  records: PaymentRecord[];
};

const PaymentCalendar = memo<IPaymentCalendarProps>(
  ({ onDateChange, records, date }) => {
    const styles = useStyles();
    const { theme } = useTheme();

    const isSelectedDateHasRecord = records.some(
      (record) =>
        record.date.split("T")[0] === date.toISOString().split("T")[0],
    );

    const markedDates = useMemo(
      () =>
        records.reduce((acc, record) => {
          const recordDate = record.date.split("T")[0];
          const selected = date.toISOString().split("T")[0] === recordDate;
          acc[record.date.split("T")[0]] = {
            marked: true,
            selected,
            disableTouchEvent: selected,
          };
          return acc;
        }, {} as MarkedDates),
      [date, records],
    );

    return (
      <Calendar
        style={styles.container}
        theme={{
          backgroundColor: theme.colors.background,
          calendarBackground: theme.colors.background,
          selectedDayTextColor: theme.colors.white,
          selectedDayBackgroundColor: theme.colors.primary,
          dayTextColor: theme.colors.black,
          arrowColor: theme.colors.primary,
          textDisabledColor: theme.colors.grey5,
          monthTextColor: theme.colors.black,
          dotColor: theme.colors.primary,
          selectedDotColor: theme.colors.white,
          todayTextColor: theme.colors.primary,
        }}
        initialDate={date.toISOString().split("T")[0]}
        date={date.toISOString().split("T")[0]}
        onDayPress={(day) => onDateChange(new Date(day.dateString))}
        markedDates={{
          ...markedDates,
          ...(isSelectedDateHasRecord
            ? {}
            : {
                [date.toISOString().split("T")[0]]: { selected: true },
              }),
        }}
      />
    );
  },
);

const useStyles = makeStyles((theme) => ({
  container: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    overflow: "hidden",
  },
}));

PaymentCalendar.displayName = "PaymentCalendar";

export default PaymentCalendar;
