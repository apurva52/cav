import { SelectItem } from "primeng";

export const SCHEDULE = {
  EVERY_DAY: 0,
  WEEKDAY_OF_EVERY_WEEK: 1,
  DAY_OF_MONTH: 2,
  WEEKDAY_OF_MONTH: 3,
  LAST_DAY_OF_EVERY_MONTH: 4,
  DAY_OF_A_YEAR: 5,
  WEEKDAY_OF_YEAR: 6,
  EVENT_DAY: 7,
  CUSTOM_EVENT_DAY: 8,
  ALL_TIME: 9,
  NON_OF_ABOVE: -1
}

export const REPEAT = {
  EVERY_DAY: 1,
  WEEK_DAY: 7,
  MONTH_DAY: 30,
}

export const MODULE = {
  ALERT_RULE: 0,
  ALERT_MAINTENANCE: 1
}

export const RULE_SCHEDULETYPE_TYPE: SelectItem[] = [
  {
    label: "Every Day",
    value: 0
  },
  {
    label: "Every Week",
    value: 1
  },
  {
    label: "Every Month",
    value: 2
  },
  {
    label: "Every Year",
    value: 3
  },
  {
    label: "Custom",
    value: 4
  }
]

  export const MAINTENANCE_SCHEDULETYPE_TYPE: SelectItem[] = [
    {
      label: "Every Day",
      value: 0
    },
    {
      label: "Every Week",
      value: 1
    },
    {
      label: "Every Month",
      value: 2
    },
    {
      label: "Every Year",
      value: 3
    }
]