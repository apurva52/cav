import { QueryTable } from './query-settings.model';


export const QUERY_SETTINGS_TABLE: QueryTable = {
    headers: [{
        cols: [
            {
              label: 'Name',
              valueField: 'name',
              classes: 'text-left',
            },
            {
              label: 'Value',
              valueField: 'value',
              classes: 'text-left',
            },
          ],
    }],
    data: [
        {"query:queryString:options":{
            name: 'query:queryString:options',
            value: '{"analyze_wildcard": true}',
            actions: ['edit', 'delete'],
            edit: true,
            delete: false,
            editable: false,
            field: 'input'
        },
        "cacheEnable":{
            name: "cacheEnable",
            value: true,
            actions: ['edit'],
            edit: true,
            delete: false,
            editable: false,
            field: 'radio',
            items: [{
                label: true,
                selected: false
            },
            {
                label: false,
                selected: true
            }]
        },
        "sort:options":{
            name: "sort:options",
            value:  "{ \"unmapped_type\": \"boolean\" }",
            actions: ['edit', 'delete'],
            edit: true,
            delete: false,
            editable: false,
            field: 'input'
        },
        "dateFormat":{
            name: "dateFormat",
            value:  "MMMM Do YYYY, HH:mm:ss.SSS",
            actions: ['edit', 'delete'],
            edit: true,
            delete: false,
            editable: false,
            field: 'input'
        },
        "dateFormat:tz":{
            name: "dateFormat:tz",
            value:   "Browser",
            actions: ['edit', 'delete'],
            edit: true,
            delete: false,
            editable: false,
            field: 'input'
        },
        "defaultColumns":{
            name:  "defaultColumns",
            value:   [
                "_source"
            ],
            actions: ['edit', 'delete'],
            edit: true,
            delete: false,
            editable: false,
            field: 'input'
        },
        "metaFields":{
            name: "metaFields",
            value:   [
                "_source",
                "_id",
                "_type",
                "_index",
                "_score"
            ],
            actions: ['edit', 'delete'],
            edit: true,
            delete: false,
            editable: false,
            field: 'input'
        },
        "_sourceformat":{
            name: "_sourceformat",
            value:   [
                "tier",
                "server",
                "instance",
                "<br>",
                "_index",
                "message",
                "<br>"
            ],
            actions: ['edit', 'delete'],
            edit: true,
            delete: false,
            editable: false,
            field: 'input'
        },
        "discover:sampleSize":{
            name:"discover:sampleSize",
            value:   500,
            actions: ['edit', 'delete'],
            edit: true,
            delete: false,
            editable: false,
            field: 'number'
        },
        
        "pipetempindex":{
            name: "pipetempindex",
            value:   true,
            actions: ['edit', 'delete'],
            edit: true,
            delete: false,
            editable: false,
            field: 'radio',
            items: [{
                label: true,
                selected: false
            },
            {
                label: false,
                selected: true
            }]
        },
        "track_total_hits":{
            name:"track_total_hits",
            value:   10000,
            actions: ['edit', 'delete'],
            edit: true,
            delete: false,
            editable: false,
            field: 'number'
        },
        "large_data_set":{
            name:"large_data_set",
            value:   true,
            actions: ['edit', 'delete'],
            edit: true,
            delete: false,
            editable: false,
            field: 'radio',
            items: [{
                label: true,
                selected: false
            },
            {
                label: false,
                selected: true
            }]
        },
        "timepicker:timeDefaults":{
            name: "timepicker:timeDefaults",
            value: "{\n                \"from\": \"now-15m\",\n                \"to\": \"now\",\n                \"mode\": \"quick\"\n              }",
            actions: ['edit', 'delete'],
            edit: true,
            delete: false,
            editable: false,
            field: 'input'
            
        }}
    ]

}