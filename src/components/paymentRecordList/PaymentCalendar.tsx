import { makeStyles, useTheme } from "@rneui/themed";
import { memo, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Calendar, LocaleConfig } from "react-native-calendars";
import { MarkedDates } from "react-native-calendars/src/types";

import { LanguageEnum } from "@/i18n";
import { PaymentRecord } from "@/types/PaymentRecord";

type IPaymentCalendarProps = {
  date: Date;
  onDateChange: (date: Date) => void;
  records: PaymentRecord[];
};

LocaleConfig.locales.en = LocaleConfig.locales[""];
LocaleConfig.locales[LanguageEnum.JA] = {
  monthNames: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  monthNamesShort: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  dayNames: ["日", "月", "火", "水", "木", "金", "土"],
  dayNamesShort: ["日", "月", "火", "水", "木", "金", "土"],
};
LocaleConfig.locales[LanguageEnum.ZH_HK] = {
  monthNames: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  monthNamesShort: [
    "1月",
    "2月",
    "3月",
    "4月",
    "5月",
    "6月",
    "7月",
    "8月",
    "9月",
    "10月",
    "11月",
    "12月",
  ],
  dayNames: ["日", "一", "二", "三", "四", "五", "六"],
  dayNamesShort: ["日", "一", "二", "三", "四", "五", "六"],
};

const PaymentCalendar = memo<IPaymentCalendarProps>(
  ({ onDateChange, records, date }) => {
    const styles = useStyles();
    const { theme } = useTheme();
    const { i18n } = useTranslation();

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

    LocaleConfig.defaultLocale = i18n.language;

    return (
      <Calendar
        key={i18n.language}
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
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.divider,
    overflow: "hidden",
  },
}));

PaymentCalendar.displayName = "PaymentCalendar";

export default PaymentCalendar;
