import { nodeName } from 'jquery';
import { AddReportSettingsData } from './add-report-settings.model';

export const ADD_REPORT_SETTINGS_DATA: AddReportSettingsData = {
  addTemplateMenuOptions: {
    dropDownGraph: [
      {
        label: 'Normal Graph',
        value: 0,
      },
      {
        label: 'Percentile Graph',
        value: 1,
      },
      {
        label: 'Slab Count Graph',
        value: 2,
      }
    ],
    hierarchicalGraph: [
      {
        label: 'Normal Graph',
        value: 0,
      }
    ],
    trendCompareGraph: [
      {
        label: 'Normal Graph',
        value: 0,
      },
      {
        label: 'Percentile Graph',
        value: 1,
      }
    ],
    trendCompareChart: [
      {
        label: 'Line',
        value: 0,
      },
      {
        label: 'Bar',
        value: 1,
      },
    ],
    dropDown: [
      {
        label: 'Line',
        value: 0,
      },
      {
        label: 'Bar',
        value: 1,
      },
      {
        label: 'Pie',
        value: 5,
      },
      {
        label: 'Donut',
        value: 12,
      },
      {
        label: 'Area',
        value: 2,
      },
      {
        label: 'Stacked Area',
        value: 3,
      },
      {
        label: 'Stacked Bar',
        value: 4,
      },
      {
        label: 'Line Stacked Bar',
        value: 11,
      },
      {
        label: 'Correlated',
        value: 8,
      },
      {
        label: 'Tile',
        value: 7,
      },
      {
        label: 'Multi Axis',
        value: 9,
      },
      {
        label: 'Multi With Layout',
        value: 10,
      },
    ],
    multiLayout: [
      {
        label: 'Line',
        value: 0,
      },
      {
        label: 'Bar',
        value: 1,
      },
      {
        label: 'Pie',
        value: 5,
      },
      {
        label: 'Donut',
        value: 12,
      },
      {
        label: 'Area',
        value: 2,
      },
      {
        label: 'Stacked Area',
        value: 3,
      },
      {
        label: 'Stacked Bar',
        value: 4,
      },
      {
        label: 'Line Stacked Bar',
        value: 11,
      },
      {
        label: 'Correlated',
        value: 8,
      },
      {
        label: 'Tile',
        value: 7,
      },
      {
        label: 'Multi Axis',
        value: 9,
      },
    ],
    compareReport: [
      {
        label: 'Line',
        value: 0,
      },
      {
        label: 'Bar',
        value: 1,
      },
      {
        label: 'Pie',
        value: 5,
      },
      {
        label: 'Donut',
        value: 12,
      },
      {
        label: 'Area',
        value: 2,
      },
      {
        label: 'Stacked Area',
        value: 3,
      },
      {
        label: 'Stacked Bar',
        value: 4,
      },
      {
        label: 'Line Stacked Bar',
        value: 11,
      },
      {
        label: 'Correlated',
        value: 8,
      },
      {
        label: 'Tile',
        value: 7,
      },
    ],
    graphPercentile: [
      {
        label: 'Line',
        value: 0,
      },
      {
        label: 'Bar',
        value: 1,
      },
      {
        label: 'Pie',
        value: 5,
      },
      {
        label: 'Donut',
        value: 12,
      },
      {
        label: 'Area',
        value: 2,
      },
      {
        label: 'Stacked Area',
        value: 3,
      },
      {
        label: 'Stacked Bar',
        value: 4,
      },
      {
        label: 'Line Stacked Bar',
        value: 11,
      },
    ],
    hierarchicalChart: [
      {
        label: 'Bar',
        value: 1,
      },
    ],
    graphSlab: [
      {
        label: 'Line',
        value: 0,
      },
      {
        label: 'Bar',
        value: 1,
      },
      {
        label: 'Pie',
        value: 5,
      },
      {
        label: 'Donut',
        value: 12,
      },
      {
        label: 'Area',
        value: 2,
      },
      {
        label: 'Stacked Area',
        value: 3,
      },
      {
        label: 'Stacked Bar',
        value: 4,
      },
      {
        label: 'Line Stacked Bar',
        value: 11,
      },
      {
        label: 'Frequency Distribution',
        value: 6,
      },
    ],
    dropDownBar: [
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
      },
      {
        label: 'Sum Count',
        value: 4,
      },
    ],
    dropDownPercentile: [
      {
        label: '50',
        value: 50,
      },
      {
        label: '80',
        value: 80,
      },
      {
        label: '90',
        value: 90,
      },
      {
        label: '95',
        value: 95,
      },
      {
        label: '99',
        value: 99,
      },
    ],
    dropDownSlab: [
      {
        label: '1',
        value: 1,
      },
      {
        label: '2',
        value: 2,
      },
      {
        label: '3',
        value: 3,
      },
      {
        label: '4',
        value: 4,
      },
      {
        label: '5',
        value: 5,
      },
      {
        label: '6',
        value: 6,
      },
      {
        label: '7',
        value: 7,
      },
      {
        label: '8',
        value: 8,
      },
      {
        label: '9',
        value: 9,
      },
      {
        label: '10',
        value: 10,
      },
    ],
    formula: [
      {
        label: 'Bar',
        value: 'Bar',
      },
      {
        label: 'Bar',
        value: 'Bar',
      }
    ],

    indicesItems: [
      {
        label: 'Normal',
        value: 'Normal',
      },
      {
        label: 'Selected Indices',
        value: 'Selected Indices',
      }
    ]
  }

};
export const REPORT_SET_TABLE_DATA = {
  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [10, 20, 30, 50, 100],
  },
  headers: [
    {
      cols: [
        {
          valueField: 'rsName',
          selected: true, 
          classes: 'text-left',
          width: '85%', 
        },
        {
          valueField: 'action',
          border:"0",
        }  
      ],
    },
  ],
};