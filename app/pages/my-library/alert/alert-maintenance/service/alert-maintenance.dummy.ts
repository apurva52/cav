import { MaintenanceRequest } from "./alert-maintenance.model"

export const PRESET = [
    {label:'Every Day',value: 0},
    {label:'Every Week', value:1},
    {label:'Every Month', value:2},
    {label:'Every Year', value:3}
]

export const PRESETS =  {
    EVERY_DAY: 0,
    WEEKDAY_OF_EVERY_WEEK: 1,
    DAY_OF_MONTH: 2,
    WEEKDAY_OF_MONTH: 3,
    LAST_DAY_OF_EVERY_MONTH: 4,
    DAY_OF_A_YEAR: 5,
    WEEKDAY_OF_YEAR: 6,
    CUSTOM_EVENT_DAY: 8,
    NON_OF_ABOVE: -1
}

export const day = [
    {label:'1st' ,value:1},{label:'2nd' ,value:2},{label:'3rd' ,value:3},{label:'4th' ,value:4},{label:'5th' ,value:5},
    {label:'6th' ,value:6},{label:'7th' ,value:7},{label:'8th' ,value:8},{label:'9th' ,value:9},{label:'10th' ,value:10},
    {label:'11th' ,value:11},{label:'12th' ,value:12},{label:'13th' ,value:13},{label:'14th' ,value:14},{label:'15th' ,value:16},
    {label:'16th' ,value:16},{label:'17th' ,value:17},{label:'18th' ,value:18},{label:'19th' ,value:19},{label:'20th' ,value:20},
    {label:'21st' ,value:21},{label:'22nd' ,value:22},{label:'23rd' ,value:23},{label:'24th' ,value:24},{label:'25th' ,value:25},
    {label:'26th' ,value:26},{label:'27th' ,value:27},{label:'28th' ,value:28},{label:'29th' ,value:29},{label:'30th' ,value:30},{label:'31ts' ,value:31},
    {label:'Last' ,value:32}
]
export const week = [
    {label: '1st' ,value:1},{label:'2nd',value:2},
    {label:'3rd',value:3},{label:'4th',value:4},{label:'Last',value: 5}
]
export const days = [
    {label: 'Sunday' ,value:0},{label:'Monday',value:1},{label:'Tuesday',value:2},
    {label:'Wednesday',value:3},{label:'Thursday',value:4},{label:'Friday',value: 5},{label:'Saturday',value: 6}
]
export const month = [
    {label: 'January' ,value:0},{label: 'February' ,value:1},{label: 'March' ,value:2},
    {label: 'April' ,value:3},{label: 'May' ,value:4},{label: 'June' ,value:5},
    {label: 'July' ,value:6},{label: 'August' ,value:7},{label: 'September' ,value:8},
    {label: 'October' ,value:9},{label: 'November' ,value:10},{label: 'December' ,value:11}
]

export const weekMonthDays = [
    { label: 'Sunday', value: 0 },
      { label: 'Monday', value: 1 },
      { label: 'Tuesday', value: 2 },
      { label: 'Wednesday', value: 3 },
      { label: 'Thursday', value: 4 },
      { label: 'Friday', value: 5 },
      { label: 'Saturday', value: 6 },
      { label: "Last", value: 42 },
      { label: "1st", value: 11 },
      { label: "2nd", value: 12 },
      { label: "3rd", value: 13 },
      { label: "4th", value: 14 },
      { label: "5th", value: 15 },
      { label: "6th", value: 16 },
      { label: "7th", value: 17 },
      { label: "8th", value: 18 },
      { label: "9th", value: 19 },
      { label: "10th", value: 20 },
      { label: "11th", value: 21 },
      { label: "12th", value: 22 },
      { label: "13th", value: 23 },
      { label: "14th", value: 24 },
      { label: "15th", value: 25 },
      { label: "16th", value: 26 },
      { label: "17th", value: 27 },
      { label: "18th", value: 28 }, 
      { label: "19th", value: 29 },
      { label: "20th", value: 30 },
      { label: "21st", value: 31 },
      { label: "22nd", value: 32 },
      { label: "23rd", value: 33 },
      { label: "24th", value: 34 },
      { label: "25th", value: 35 },
      { label: "26th", value: 36 },
      { label: "27th", value: 37 },
      { label: "28th", value: 38 },
      { label: "29th", value: 39 },
      { label: "30th", value: 40 },
      { label: "31st", value: 41 }
]

export const MAINTENANCE_DATA = {
    "opType": -1,
    "cctx" : null,
    "clientId" : "",
    "appId" : "",
    "maintenances" : [
        {
            "id" : -1,
            "name" : "",
            "createdTs" : -1 ,
            "lastModifiedTs" : -1,
            "creator" : "cavisson", 
            "modifiedBy" : "",
            "attributes" : {
                "subject" : {
                    "tags" : [
                        {
                            "key": "",
                            "value" : "",
                            "mode" : 1
                        },
                        {
                            "key": "",
                            "value" : "",
                            "mode" : 1
                        },
                        {
                            "key": "",
                            "value" : "",
                            "mode" : 1
                        }

                    ],
                    "tagInfo" : ""
                },
                "scheduleConfig" : {
                    "type": -1,
                    "month": 0,
                    "week": 0,
                    "day": 0,
                    "st": 0,
                    "et": 0,
                    "fromHour": 0,
                    "toHour": 0
                },
                "description" : "",
                "mail" : ""
            }

        }
    ]

}