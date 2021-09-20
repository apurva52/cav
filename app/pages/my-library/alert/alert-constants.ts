export const ALERT_IMPORT = 0;
export const ALERT_EXPORT = 1;
export const IMPORT_EXPORT_MODULE_TYPE =  {
    ALERT_MAINTENANCE: 0,
    ALERT_RULES: 1,
    ALERT_ACTION: 2,
    ALERT_CONFIG: 3
}

export const IMPORT_EXPORT_FILEPATH = "/webapps/common/unifiedConfig/alert/";

export const IMPORT_MAINTENANCE_LOCAL = 14;
export const EXPORT_MAINTENANCE_LOCAL = 15;
export const IMPORT_MAINTENANCE_SERVER = 16;
export const EXPORT_MAINTENANCE_SERVER = 17;
export const IMPORT_RULE_LOCAL = 36;
export const EXPORT_RULE_LOCAL = 37;
export const IMPORT_RULE_SERVER = 38;
export const EXPORT_RULE_SERVER = 39;
export const IMPORT_ACTION_LOCAL = 44; 
export const EXPORT_ACTION_LOCAL = 45;
export const IMPORT_ACTION_SERVER = 46;
export const EXPORT_ACTION_SERVER = 47;
export const IMPORT_CONFIG_LOCAL = 3;
export const EXPORT_CONFIG_LOCAL = 4;
export const IMPORT_CONFIG_SERVER = 5;
export const EXPORT_CONFIG_SERVER = 6;

//Alert Severity
export const SEVERITY = {
  NORMAL : 0,
  NORMAL_STRING : "Normal",
  MINOR : 1,
  MINOR_STRING : "Minor",
  MINOR_RECOVERY_STRING : "Recovery Minor",
  MAJOR : 2,
  MAJOR_STRING : "Major",
  MAJOR_RECOVERY_STRING : "Recovery Major",
  CRITICAL : 3,
  CRITICAL_STRING : "Critical",
  CRITICAL_RECOVERY_STRING : "Recovery Critical",
  INFO : 4,
  INFO_STRING : "Info",
  ALL_SEVERITY : 5,
  ALL_SEVERITY_STRING : "All Severity",
}

export const REASON = {
    STARTED: "Started",
    CONTINUOUS: "Continuous",
    UPGRADED: "Upgraded",
    DOWNGRADED: "Downgraded",
    ENDED: "Ended"
}

// export const PRESEVERITY = {
//     NORMAL : 1
// }

//Alert - Status 
export const STATUS = {
    STARTED: 1,
    STARTED_STRING: "Started",
    CONTINUOUS: 2,
    CONTINUOUS_STRING: "Continuous",
    UPGRADED: 3,
    UPGRADED_STRING: "Upgraded",
    DOWNGRADED: 4,
    ENDED: 5,
    ENDED_STRING: "Ended",
    DOWNGRADED_STRING: "Downgraded",
    FORCE_CLEAR: 9,
    FORCE_CLEAR_STRING: "Force Clear",

    CLEAR_DUE_TO_DELETE_RULE: 6,
    CLEAR_DUE_TO_DELETE_RULE_STRING: "Clear dueto Delete Rule",
    CLEAR_DUE_TO_UPDATE_RULE: 7,
    CLEAR_DUE_TO_UPDATE_RULE_STRING: "Clear due to Update Rule",
    CLEAR_DUE_TO_DISABLE_RULE: 8,
    CLEAR_DUE_TO_DISABLE_RULE_STRING: "Clear due to Disable Rule",
    ENDED_DUE_TO_MAINTENANCE: 10,
    ENDED_DUE_TO_MAINTENANCE_STRING: "Ended due to maintenance",
    ENDED_DUE_TO_RULE_SCHEDULING: 11,
    ENDED_DUE_TO_RULE_SCHEDULING_STRING: "Ended due to rule scheduling",
    ENDED_DUE_TO_GLOBAL_CONFIG_CHANGE: 12,
    ENDED_DUE_TO_GLOBAL_CONFIG_CHANGE_STRING: "Ended due to global config change",
    ACTION_CONFIG_CHANGE: 13,
    MAINTENANCE_CONFIG_CHANGE: 14,
    GLOBAL_CONFIG_CHANGE: 15
}

export const ALERTTYPE = {
    CAPACITY_ALERT : 0,
    BEHAVIORAL_ALERT : 1,
    ALL_ALERT : 2
}

export const ALERT_MODULES = {
    ALERT_EVENT: "Alert Event",
    ALERT_RULE: "Alert Rule",
    ALERT_ACTION: "Alert Action",
    ALERT_ACTION_HISTORY: "Alert Action History",
    ALERT_MAINTENANCE: "Alert Maintenance",
    ALERT_CONFIGURATION: "Alert Configuration"
}

  //Type
  export const OTHERS = {
      TYPE_INFO : 0,
      TYPE_INFO_STRING : "Info",
      TYPE_ALERT : 1,
      TYPE_ALERT_STRING : "Alert",
      TYPE_ALERT_SETTING : 2,
      TYPE_ALERT_SETTING_STRING : "Alert Setting",
      TYPE_MAINTENANCE : 3,
      TYPE_MAINTENANCE_STRING : "Maintenance",
      TYPE_RULE : 4,
      TYPE_RULE_STRING : "Rule",
      TYPE_ACTION : 5,
      TYPE_ACTION_STRING : "Action",
      TYPE_BASELINE : 6,
      TYPE_BASELINE_STRING : "Baseline",
      TYPE_MAIL_SETTING : 7,
      TYPE_MAIL_SETTING_STRING : "Mail Setting"
  }


export const ALERT_PRESETS = [
    {
        label: "Last 10 Minutes",
        value: "LIVE1"
    },
    {
        label: "Last 30 Minutes",
        value: "LIVE2"
    },
    {
        label: "Last 1 Hour",
        value: "LIVE3"
    },
    {
        label: "Last 2 Hours",
        value: "LIVE4"
    },
    {
        label: "Last 4 Hours",
        value: "LIVE5"
    },
    {
        label: "Last 6 Hours",
        value: "LIVE6"
    },
    {
        label: "Last 12 Hours",
        value: "LIVE8"
    },
    {
        label: "Last 24 Hours",
        value: "LIVE9"
    },
    {
        label: "Today",
        value: "LIVE10",
    },
    {
        label: "Yesterday",
        value: "PAST1"
    },
    {
        label: "Last 7 Days",
        value: "LIVE11"
    },
    {
        label: "Last 30 Days",
        value: "LIVE12"
    },
    {
        label: "Last 90 Days",
        value: "LIVE13"
    },
    {
        label: "This Week",
        value: "LIVE14"
    },
    {
        label: "Last Week",
        value: "PAST2"
    },
    {
        label: "Last 2 Weeks",
        value: "PAST3"
    },
    {
        label: "Last 3 Weeks",
        value: "PAST4"
    },
    {
        label: "Last 4 Weeks",
        value: "PAST5"
    },
    {
        label: "This Month",
        value: "LIVE15"
    },
    {
        label: "Last Month",
        value: "PAST6"
    },
    {
        label: "Last 2 Months",
        value: "PAST7"
    },
    {
        label: "Last 3 Months",
        value: "PAST8"
    },
    {
        label: "Last 6 Months",
        value: "PAST9"
    },
    {
        label: "This Year",
        value: "LIVE16"
    },
    {
        label: "Last Year",
        value: "PAST10"
    },
    {
        label: "Custom",
        value: "custom",
    }
]