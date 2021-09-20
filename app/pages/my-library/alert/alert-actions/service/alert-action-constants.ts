
import {MailCustomField, booleanFlagProperty} from './alert-actions.model';

export const ACTION_TYPE = {
    NO: 0,
    EMAIL: 1,
    SMS: 2,
    SNAPSHOT: 3,
    SNMPTRAP: 4,
    THREAD_DUMP: 5,
    HEAP_DUMP: 6,
    TCP_DUMP: 7,
    CPU_PROFILING: 8,
    JAVA_FLIGHT_RECORDER: 9,
    RUN_SCRIPT: 10,
    SEND_TO_EXTENSION: 11
  }

export const ACTION_TYPES = [
  { label: "NO", value: 0 },
  { label: "EMAIL", value: 1}, 
  { label: "SMS", value: 2 },
  { label: "SNAPSHOT", value: 3 },
  { label: "SNMP TRAP", value: 4 }, 
  { label: "THREAD DUMP", value: 5 } ,
  { label: "HEAP DUMP", value: 6 },
  { label: "TCP DUMP", value: 7 }, 
  { label: "CPU PROFILING", value: 8 },
  { label: "JAVA FLIGHT RECORDER", value: 9 },
  { label: "RUN SCRIPT", value: 10 }, 
  { label: "SEND TO EXTENSION", value: 11 } 
]



export const ACTION_OPERATONS = {
    GET_ACTIONS: 40,
    ADD_ACTIONS: 41,
    UPDATE_ACTIONS: 42,
    DELETE_ACTIONS: 43,
    IMPORT_ACTIONS: 44,
    EXPORT_ACTIONS:45
}

export const SNMP_ACTION_CONS = {
  SNMP_VERSION_V1 : 0,
  SNMP_VERSION_V2C : 1,
  SNMP_VERSION_V3 : 3,
  SNMP_SECURITY_NO_AUTH_NO_PRIV : 1,//Levels of security NO_AUTH_NO_PRIV = 1, AUTH_NO_PRIV = 2 & AUTH_PRIV = 3
  SNMP_SECURITY_AUTH_NO_PRIV : 2,
  SNMP_SECURITY_AUTH_NO_PRIV_ERROR: -1,
  SNMP_SECURITY_AUTH_PRIV : 3,
  SNMP_AUTH_PROTOCOL_MD5 : 0,//Authentication Protocol MD5 or SHA(0 or 1)
  SNMP_AUTH_PROTOCOL_SHA : 1,
  SNMP_PRIVACY_PROTOCOL_DES : 0,//Privacy DES,3DES,AES128,AES192(0, 1, 2, 3)
  SNMP_PRIVACY_PROTOCOL_3DES : 1,
  SNMP_PRIVACY_PROTOCOL_AES128 : 2,
  SNMP_PRIVACY_PROTOCOL_AES192 : 3,
  SNMP_MIN_PASSWORD_LENGTH: 7
}

export const CHART_TYPE: MailCustomField[] = [
  { label: "line", value: "LINE"},
  { label: "bar", value: "BAR"}, 
  { label: "area", value: "AREA"} 
]

export const REPORT_CHART_TYPE: MailCustomField[] = [
  { label: "line", value: "Line Graph"},
  { label: "bar", value: "Bar Graph"}, 
  { label: "area", value: "Area Graph"} 
]

export const REPORT_TYPE: MailCustomField[] = [
  { label: "Tabular", value: "Tabular"}, 
  { label: "WORD", value: "WORD"},
  { label: "HTML", value: "HTML"} 
]

export const METRIC_FROM_TYPE: MailCustomField[] = [
  { label: "favorite", value: "FAV"},
  { label: "template", value: "TEMP"} 
]

export const MAX_MIN:booleanFlagProperty[] = [
  { label: "maximum", value: true },
  { label: "minimum", value: false }
]

export const WITH_WITHOUT:booleanFlagProperty[] = [
  { label: "with", value: true},
  { label: "without", value: false}
]

export const JFRTIMEDURATION: MailCustomField[] = [
  {label: "Second(s)", value: "s"},{label: "Minute(s)", value: "m"},{label: "Hour(s)", value: "h"}
]
export const JFRFILESIZE: MailCustomField[] = [
  {label: "KB", value: "K"},{label: "MB", value: "M"},{label: "GB", value: "G"}
]

export const MAIL_CUSTOM_FIELDS: MailCustomField[] = [
  { label: "$INDICES", value: "$INDICES"},
  { label: "$SEVERITY", value: "$SEVERITY"},
  { label: "$ALERT_MSG", value: "$ALERT_MSG"},  
  { label: "$PRODUCT_NAME", value: "$PRODUCT_NAME"},
  { label: "$RULE_NAME", value: "$RULE_NAME"},
  { label: "$ALERT_VALUE", value: "$ALERT_VALUE"},
  { label: "$ALERT_TYPE", value: "$ALERT_TYPE"},
  { label: "$CONDITION_INFO", value: "$CONDITION_INFO"},
  { label: "$INDICES_ID", value: "$INDICES_ID"},
  { label: "$FAV_LINK", value: "$FAV_LINK"}
]