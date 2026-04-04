import type {Draft} from 'immer';
import type {
  DateObjectUnits,
  DateTimeFormatOptions,
  DayNumbers,
  DateTime,
  Duration,
  HourNumbers,
  MinuteNumbers,
  MonthNumbers,
  WeekdayNumbers,
  WeekNumbers,
} from 'luxon';

export type TDraftJsEditorState = unknown;

export type TImmerDraft<G> = Draft<G>;

export type TLuxonDateObjectUnits = DateObjectUnits;
export type TLuxonDateTimeFormatOptions = DateTimeFormatOptions;
export type TLuxonDayNumbers = DayNumbers;
export type TLuxonDayOfWeekNumbers = WeekdayNumbers;
export type TLuxonDuration = Duration;
export type TLuxonDurationValid = Duration<true>;
export type TLuxonHourNumbers = HourNumbers;
export type TLuxonMinuteNumbers = MinuteNumbers;
export type TLuxonMonthNumbers = MonthNumbers;
export type TLuxonParam = number | string | Date | DateTime | null | undefined;
export type TLuxonValid = DateTime<true>;
export type TLuxonWeekOfYearNumbers = WeekNumbers;
