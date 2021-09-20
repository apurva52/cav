import { MetricsTable } from './metrics.model';

export const SETTINGS_TABLE: MetricsTable = {
  allReports: [
    {
      label: 'All Reports',
      value: 'All Reports',
    },
    {
      label: 'Performance Stats Reports',
      value: 'Stats',
    },
    {
      label: 'Compare Reports',
      value: 'Compare',
    },
    {
      label: 'Excel Reports',
      value: 'Excel',
    },
    {
      label: 'Hierarchical Reports',
      value: 'Hierarchical',
    },
    {
      label: 'Summary Reports',
      value: 'Summary',
    },
    {
      label: 'Scheduled Reports',
      value: 'Scheduled',
    }
    ],
  paginator: {
    first: 0,
    rows: 10,
    rowsPerPageOptions: [10, 20, 30, 40, 50],
  },
  headers: [
    {
      cols: [
        {
          label: 'Report Name',
          valueField: 'rN',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          iconField: true,
        },
        {
          label: 'Report Type',
          valueField: 'rT',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },

        {
          label: 'Template Name',
          valueField: 'mO',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Scheduled',
          valueField: 'rS',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Created By',
          valueField: 'uN',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          width: '20%',
        },
        {
          label: 'Created On',
          valueField: 'cD',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true
          
        },
      ],
    },
  ],
  data: [
    {
      rN: 'compare_trend',
      mO: 'for906',
      uN: 'cavisson',
      bR: false,
      rS: 'No',
      rT: 'Compare',
      cD: '02/23/21 17:24:09',
      groupData: {
        name: 'compare_trend'
      }
    },
    {
      rN: 'per_wrd_sch',
      mO: 'for906',
      uN: 'cavisson',
      bR: false,
      rS: 'Yes',
      rT: 'Word',
      cD: '02/23/21 13:46:01',
      groupData: {
        name: 'per_wrd_sch',
        sufix: '@^@18@^@23_02_2021_13_44_00'
      }
    },
    {
      rN: 'per_wrd_sch',
      mO: 'for906',
      uN: 'cavisson',
      bR: false,
      rS: 'Yes',
      rT: 'Word',
      cD: '02/23/21 13:44:01',
      groupData: {
        name: 'per_wrd_sch',
        sufix: '@^@18@^@23_02_2021_13_44_00'
      }
    }
  ],

  tableFilter: true,
  iconsField: 'icon'
};
export const TABLE_JSON = {
  headers: [
    {
      label: "Report Name",
      value: "rN",
    },
    {
      label: "Template Name",
      value: "mO",
    },
    {
      label: "UserName",
      value: "uN",
    },
    {
      label: "Process State",
      value: "bR",
    },
    {
      label: "Report Status",
      value: "rS",
    },
    {
      label: "Report Type",
      value: "rT",
    },
    {
      label: "Creation Details",
      value: "cD",
    },
  ]
}

export const SCHEDULER_TABLE: MetricsTable = {
  allReports: [
    {
      label: 'All Reports',
      value: 'All Reports',
    },
    {
      label: 'Performance Stats Reports',
      value: 'Stats',
    },
    {
      label: 'Compare Reports',
      value: 'Compare',
    },
    {
      label: 'Excel Reports',
      value: 'Excel',
    },
    {
      label: 'Hierarchical Reports',
      value: 'Hierarchical',
    },
    {
      label: 'Summary Reports',
      value: 'Summary',
    }
    ],
  paginator: {
    first: 0,
    rows: 10,
    rowsPerPageOptions: [10, 20, 30, 40, 50],
  },
  headers: [
    {
      cols: [
        {
          label: 'Report Name',
          valueField: 'rN',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          iconField: true,
        },
        {
          label: 'Report Type',
          valueField: 'rT',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Template Name',
          valueField: 'mO',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Created By',
          valueField: 'uN',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          width: '20%',
        },
        {
          label: 'Created On',
          valueField: 'cD',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true
          
        },
      ],
    },
  ],
  data: [
    {
      rN: 'compare_trend',
      mO: 'for906',
      uN: 'cavisson',
      bR: false,
      rS: 'No',
      rT: 'Compare',
      cD: '02/23/21 17:24:09',
      groupData: {
        name: 'compare_trend'
      }
    },
    {
      rN: 'per_wrd_sch',
      mO: 'for906',
      uN: 'cavisson',
      bR: false,
      rS: 'Yes',
      rT: 'Word',
      cD: '02/23/21 13:46:01',
      groupData: {
        name: 'per_wrd_sch',
        sufix: '@^@18@^@23_02_2021_13_44_00'
      }
    },
    {
      rN: 'per_wrd_sch',
      mO: 'for906',
      uN: 'cavisson',
      bR: false,
      rS: 'Yes',
      rT: 'Word',
      cD: '02/23/21 13:44:01',
      groupData: {
        name: 'per_wrd_sch',
        sufix: '@^@18@^@23_02_2021_13_44_00'
      }
    }
  ],

  tableFilter: true,
  iconsField: 'icon'
};
