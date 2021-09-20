import { ScheduleReportData } from './schedulereport.model';

export const SCHEDULE_REPORT_DATA: ScheduleReportData = {
  

  preset: [
      {
        label: 'Today',
        value: 'Today',
      },
      {
        label: 'Today',
        value: 'Today',
      }
    ],
    template: [
      {
        label: 'NDEHealth',
        value: 'NDEHealth',
      },
      {
        label: 'NDEHealth',
        value: 'NDEHealth',
      }
    ],
    viewBy: [
      {
        label: 'Hour (s)',
        value: 'Hour (s)',
      }
    ],
    value: [
      {
        label: '12',
        value: '12',
      },
      {
        label: '10',
        value: '10',
      }
    ],

    reportType: [
      {
        label: 'Excel',
        value: 'Excel',
      },
      {
        label: 'Performance Stats',
        value: 'Performance Stats',
      },
      {
        label: 'Alert Digest Report',
        value: 'Alert Digest Report', 
      },
    //   {
    //     label: 'UX Custom',
    //     value: 'UX Custom',
    //   },
    //   {
    //     label: 'UX Standerd',
    //     value: 'UX Standerd',
    //   },
    //   {
    //     label: 'UX Template',
    //     value: 'UX Template',
    //   },
    //   {
    //     label: 'Log / Visualization',
    //     value: 'Log / Visualization',
    //   },
    ],
    matrics: [
      {
        label: 'Select Matrics',
        value: 'Select Matrics',
      },
      {
        label: 'Using Template',
        value: 'Using Template',
      },
      {
        label: 'Using Favourite',
        value: 'Using Favourite',
      }
    ],
    hourlyType : [
      {
        label: 'Every',
        value: 'Every',
      },
      {
        label: 'Daily',
        value: 'Daily',
      },
     
    ],
    days : [
      {
        label: 'Sunday',
        value: 'Sunday',
      },
      {
        label: 'Monday',
        value: 'Monday',
      },
      {
        label: 'TuesDay',
        value: 'TuesDay',
      },
      {
        label: 'Wednesday',
        value: 'Wednesday',
      },
      {
        label: 'Thirsday',
        value: 'Thirsday',
      },
      {
        label: 'Friday',
        value: 'Friday',
      },
      {
        label: 'Saturday',
        value: 'Saturday',
      },
     
     
    ]
  }
  export const Report_Scheduler_Preset = {
    time: {
      min: {
        raw: null,
        value: 1614311454316
      },
      max: {
        raw: null,
        value: 1614325854316
      },
      frameStart: {
        raw: null,
        value: 1614322254316
      },
      frameEnd: {
        raw: null,
        value: 1614325854316
      }
    },
    timePeriod: {
      selected: {
        id: "LIVE1",
        label: "Last 10 Minutes",
        url: ""
      },
      previous: null,
      options: [
        {
          label: "Live",
          items: []
        }
      ]
    },
    viewBy: {
      selected: {
        id: "600",
        label: "10 Min",
        url: ""
      },
      previous: {
        id: "600",
        label: "10 Min",
        url: ""
      },
      options: [
        {
          id: "M",
          labe: "Min",
          items: [
            {
              id: "60",
              label: "1 Min",
              url: ""
            },
            {
              id: "600",
              label: "10 Min",
              url: ""
            }
          ]
        }
      ]
    }
  
  };
  
  export const Report_Date_Format = {
    formats: {
      date: {
        // Moment JS date formats
        default: 'MM/DD/YYYY',
        long: 'D/MMM/YYYY',
        short: 'D/MMM/YYYY',
      },
      dateTime: {
        // Moment JS date formats
        default: 'MM/DD/YYYY HH:mm',
      },
      OWL_DATE_TIME_FORMATS: {
        parseInput: 'MM/DD/YYYY HH:mm:ss',
        fullPickerInput: 'MM/DD/YYYY HH:mm:ss',
        datePickerInput: 'MM/DD/YYYY',
        timePickerInput: 'HH:mm:ss',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
      },
    },
  }

