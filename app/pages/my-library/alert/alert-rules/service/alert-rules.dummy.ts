import { AlertRuleTable } from './alert-rules.model';


export const ALERT_ACTION_NO = 0;
export const ALERT_ACTION_EMAIL = 1;
export const ALERT_ACTION_SMS = 2;
export const ALERT_ACTION_SNAPSHOT = 3;
export const ALERT_ACTION_SNMPTRAP = 4;
export const ALERT_ACTION_THREAD_DUMP = 5;
export const ALERT_ACTION_HEAP_DUMP = 6;
export const ALERT_ACTION_TCP_DUMP= 7;
export const ALERT_ACTION_CPU_PROFILING = 8;
export const ALERT_ACTION_JAVA_FLIGHT_RECORDER = 9;
export const ALERT_ACTION_RUN_SCRIPT = 10;
export const ALERT_ACTION_SEND_TO_EXTENSION = 11;



export const ALERT_RULE_DATA: AlertRuleTable = {
  "paginator": {
    "first": 1,
    "rows": 20,
    "rowsPerPageOptions": [10, 20, 50, 100]
  },

    "headers": [
    {
      "cols": [
        {
          "classes": "text-center",
          "dataClasses": "text-right",
          "filters": {
            "filter": false,
            "type": "contains",
          },
          "label": "Select",
          "selected": true,
          "sort": false,
          "valueField": "selected",
          "icon": true,
          "width": "4%"
        },
        {
          "classes": "text-center",
          "dataClasses": "text-right",
          "filters": {
            "filter": false,
            "type": "contains",
          },
          "label": "Enable/Disable",
          "selected": true,
          "sort": false,
          "valueField": "enableDisable",
          "icon": true,
          "width": "4%"
        },
        {
          "classes": "text-left",
          "dataClasses": "text-right",
          "filters": {
            "filter": true,
            "type": "contains",
          },
          "label": "Rule Name",
          "selected": true,
          "sort": false,
          "valueField": "ruleName",
          "icon": true,
          "width": "26%"
        },
        {
          "classes": "text-left",
          "dataClasses": "text-right",
          "filters": {
            "filter": true,
            "type": "contains",
          },
          "label": "Condition Expression",
          "selected": true,
          "sort": false,
          "valueField": "condiExp",
          "icon": true,
          "width": "30%"
        },
        {
          "classes": "text-left",
          "dataClasses": "text-right",
          "filters": {
            "filter": true,
            "type": "contains",
          },
          "label": "Alert Message",
          "selected": true,
          "sort": false,
          "valueField": "alertMessage",
          "icon": true,
          "width": "30%"
        },
        {
          "classes": "text-left",
          "dataClasses": "text-right",
          "filters": {
            "filter": true,
            "type": "contains",
          },
          "label": "Alert Actions",
          "selected": true,
          "sort": false,
          "valueField": "alertAction",
          "icon": true,
          "width": "20%"
        },
        {
          "classes": "text-left",
          "dataClasses": "text-right",
          "filters": {
            "filter": false,
            "type": "contains",
          },
          "label": "Actions",
          "selected": true,
          "sort": false,
          "valueField": "edit",
          "icon": true,
          "width": "6%"
        }
      ],
    },
  ],
  "data": [],
  "iconsField": "icon",
  "iconsFieldEvent": "iconStruggling",
  "tableFilter": true,
};
