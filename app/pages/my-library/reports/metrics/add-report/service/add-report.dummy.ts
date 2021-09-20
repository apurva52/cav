import { AddReportData } from './add-report.model';

export const ADD_REPORT_DATA: AddReportData = {

  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [10, 20, 30, 50, 100],
  },

  headers: [
    {
      cols: [
        {
          label: 'Measurement Name',
          valueField: 'measurementName',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Preset',
          valueField: 'label',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Start Date & Time',
          valueField: 'sTime',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'End Date & Time',
          valueField: 'eTime',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          width: '20%'
        }
      ],
    },
  ],
  data: [
  ],

  tableFilter: true,

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
  viewBy: [
    {
      label: 'Hour (s)',
      value: 'Hour (s)',
    }
  ],
  value: [
    {
      label: '=',
      value: 0,
    },
    {
      label: '>=',
      value: 3,
    },
    {
      label: '<=',
      value: 4,
    },
    {
      label: 'Top',
      value: 5,
    },
    {
      label: 'Bottom',
      value: 6,
    },
    {
      label: 'In-Between',
      value: 7,
    },
  ],
  dropDownFilterValue: [
    {
      label: 'Avg',
      value: 0,
    },
    {
      label: 'Min',
      value: 1,
    },
    {
      label: 'Max',
      value: 2,
    },
    {
      label: 'Count',
      value: 3,
    }
  ],
  dropDownInclude: [
    {
      label: 'Include',
      value: 'Include',
    },
    {
      label: 'Exclude',
      value: 'Exclude',
    },
  ],

  reportType: [
    {
      label: 'Performance Stats',
      value: 'Stats',
    },
    {
      label: 'Compare',
      value: 'Compare',
    },
    {
      label: 'Excel',
      value: 'Excel',
    },
    {
      label: 'Hierarchical',
      value: 'Hierarchical',
    },
    // {
    //   label: 'Summary',
    //   value: 'Summary',
    // }
  ],
  matrics: [
    {
      label: 'Select Metrics',
      value: '1',
    },
    {
      label: 'Using Template',
      value: '2',
    },
    {
      label: 'Using Favorite',
      value: '4',
    }
  ],
  filter: [
    {
      label: 'All Non Zero',
      value: 'All',
    },
    {
      label: 'All Zero',
      value: 'Zero',
    },
    {
      label: 'Advance',
      value: 'Advance',
    }
  ]
}

export const Report_Preset = {
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

export const Report_Option_Field = {

  HierarchicalOption: [{ label: 'Bar', value: 'Bar' }],
  StatsOption: [{ label: 'Line', value: 'Line' },
  { label: 'Bar', value: 'Bar' },
  { label: 'Area', value: 'Area' },
  { label: 'Stacked Bar', value: 'StackedBar' },
  { label: 'Stacked Area', value: 'StackedArea' },
  { label: 'Line Stacked Bar', value: 'Line Stacked Bar' },
  { label: 'Pie', value: 'Pie' },
  { label: 'Donut', value: 'Donut' }],

  CompareTrendOption:[{ label: 'Line', value: 'Line' }, {label: 'Bar', value: 'Bar'}],

  TimeViewOption: [{ label: 'Minute', value: 'Minute' },
  { label: 'Hour(s)', value: 'Hour' },
  { label: 'Day(s)', value: 'Day' },
  { label: 'Week(s)', value: 'Week' },
  { label: 'Month(s)', value: 'Month' }],

  aggegatedByOption: {
    forMinutes: [{ label: '1', value: '1' },
    { label: '5', value: '5' },
    { label: '10', value: '10' },
    { label: '15', value: '15' },
    { label: '30', value: '30' }],

    forHours: [{ label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '4', value: '4' },
    { label: '6', value: '6' },
    { label: '12', value: '12' },
    { label: '24', value: '24' }],

    forOtherTime: [
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' }
    ]
  },

  reportExcelView: [
    { label: 'Column', value: 0 },
    { label: 'Tab', value: 1 },
  ],

  summeryPerOption: [
    { label: '50', value: '50' },
    { label: '80', value: '80' },
    { label: '90', value: '90' },
    { label: '95', value: '95' },
    { label: '99', value: '99' },
  ],

  TransectionOption: [{ label: 'Min', value: 'Min' },
  { label: 'Avg', value: 'Avg' },
  { label: 'Max', value: 'Max' },
  { label: 'Completed', value: 'Completed' },
  { label: 'Success', value: 'Success' },
  { label: 'Failure(%)', value: 'Failure(%)' },
  { label: 'TPS', value: 'TPS' },
  { label: 'TPS(%)', value: 'TPS(%)' }
  ],

  CmpDataValueOption: [
    { label: 'Avg', value: 0 },
    { label: 'Min', value: 1 },
    { label: 'Max', value: 2 }
  ]

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

