import { cavissonServicesTable } from './cavisson-services.model';

export const CAVISSON_SERVICES_TABLE_DATA: cavissonServicesTable = {
cavissonServices: {
  paginator: {
    first: 1,
    rows: 33,
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },
  headers: [
    {
      cols: [
        // {
        //   label: 'Process',
        //   valueField: 'process',
        //   classes: 'text-left',
        //   selected: true,
        //   filter: {
        //     isFilter: true,
        //     type: 'contains',
        //   },
        //   isSort: true,
        // },
        {
          label: 'PID',
          valueField: 'pid',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'PPID',
          valueField: 'ppid',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'User',
          valueField: 'user',
          classes: 'text-centre',
          selected: true,
          iconField: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Running Since',
          valueField: 'running',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Elapsed Time',
          valueField: 'elapsedTime',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Threads',
          valueField: 'threads',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Children',
          valueField: 'children',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'VSS(KB)',
          valueField: 'vss',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'RSS(KB)',
          valueField: 'rss',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'CPU %',
          valueField: 'cpu',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Open Files',
          valueField: 'files',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'CMD',
          valueField: 'cmd',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
      ],
    },
  ],
  data: [
    {
      pid: '1313',
      ppid: '1313',
      user: 'Cavisson',
      running: '02/02/2020 00:04:20',
      elapsedTime: '1 days 05:25:07',
      threads: '2,113',
      children: '74',
      vss: '23,235,452',
      rss: '23,235,452',
      cpu: '12.67%',
      files: '575',
      cmd: 'java-XX+S',
    },
    {
      pid: '1313',
      ppid: '1313',
      user: 'Cavisson',
      running: '02/02/2020 00:04:20',
      elapsedTime: '1 days 05:25:07',
      threads: '2,113',
      children: '74',
      vss: '23,235,452',
      rss: '23,235,452',
      cpu: '12.67%',
      files: '575',
      cmd: 'java-XX+S',
    },
    {
      pid: '1314',
      ppid: '1313',
      user: 'Cavisson',
      running: '02/02/2020 00:04:20',
      elapsedTime: '1 days 05:25:07',
      threads: '2,113',
      children: '74',
      vss: '23,235,452',
      rss: '23,235,452',
      cpu: '12.67%',
      files: '575',
      cmd: 'java-XX+S',
    },
    {
      pid: '1313',
      ppid: '1313',
      user: 'Cavisson',
      running: '02/02/2020 00:04:20',
      elapsedTime: '1 days 05:25:07',
      threads: '2,113',
      children: '74',
      vss: '23,235,452',
      rss: '23,235,452',
      cpu: '12.67%',
      files: '575',
      cmd: 'java-XX+S',
    },
    {
      process:'Cmon',
      pid: '1313',
      ppid: '1313',
      user: 'Cavisson',
      running: '02/02/2020 00:04:20',
      elapsedTime: '1 days 05:25:07',
      threads: '2,113',
      children: '74',
      vss: '23,235,452',
      rss: '23,235,452',
      cpu: '12.67%',
      files: '575',
      cmd: 'java-XX+S',
    },
    {
      process:'Cmon',
      pid: '1313',
      ppid: '1313',
      user: 'Cavisson',
      running: '02/02/2020 00:04:20',
      elapsedTime: '1 days 05:25:07',
      threads: '2,113',
      children: '74',
      vss: '23,235,452',
      rss: '23,235,452',
      cpu: '12.67%',
      files: '575',
      cmd: 'java-XX+S',
    },
    {
      process:'Cmon',
      pid: '1313',
      ppid: '1313',
      user: 'Cavisson',
      running: '02/02/2020 00:04:20',
      elapsedTime: '1 days 05:25:07',
      threads: '2,113',
      children: '74',
      vss: '23,235,452',
      rss: '23,235,452',
      cpu: '12.67%',
      files: '575',
      cmd: 'java-XX+S',
    },
    {
      process:'Cmon',
      pid: '1313',
      ppid: '1313',
      user: 'Cavisson',
      running: '02/02/2020 00:04:20',
      elapsedTime: '1 days 05:25:07',
      threads: '2,113',
      children: '74',
      vss: '23,235,452',
      rss: '23,235,452',
      cpu: '12.67%',
      files: '575',
      cmd: 'java-XX+S',
    },
    {
      process:'Cmon',
      pid: '1313',
      ppid: '1313',
      user: 'Cavisson',
      running: '02/02/2020 00:04:20',
      elapsedTime: '1 days 05:25:07',
      threads: '2,113',
      children: '74',
      vss: '23,235,452',
      rss: '23,235,452',
      cpu: '12.67%',
      files: '575',
      cmd: 'java-XX+S',
    },
    
  ],
   tableFilter: false,
    //iconsField: 'icon',
},
allProcesses: {
  paginator: {
    first: 1,
    rows: 33,
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },
  headers: [
    {
      cols: [
        // {
        //   label: 'Process',
        //   valueField: 'process',
        //   classes: 'text-left',
        //   selected: true,
        //   filter: {
        //     isFilter: true,
        //     type: 'contains',
        //   },
        //   isSort: true,
        // },
        {
          label: 'PID',
          valueField: 'pid',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'PPID',
          valueField: 'ppid',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'User',
          valueField: 'user',
          classes: 'text-centre',
          selected: true,
          iconField: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Running Since',
          valueField: 'running',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Elapsed Time',
          valueField: 'elapsedTime',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Threads',
          valueField: 'threads',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Children',
          valueField: 'children',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'VSS(KB)',
          valueField: 'vss',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'RSS(KB)',
          valueField: 'rss',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'CPU %',
          valueField: 'cpu',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Open Files',
          valueField: 'files',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'CMD',
          valueField: 'cmd',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
      ],
    },
  ],
  data: [
    {
      process:'Cmon1',
      pid: '1313',
      ppid: '1313',
      user: 'Cavisson',
      running: '02/02/2020 00:04:20',
      elapsedTime: '1 days 05:25:07',
      threads: '2,113',
      children: '74',
      vss: '23,235,452',
      rss: '23,235,452',
      cpu: '12.67%',
      files: '575',
      cmd: 'java-XX+S',
    },
    {
      process:'Cmon',
      pid: '1313',
      ppid: '1313',
      user: 'Cavisson',
      running: '02/02/2020 00:04:20',
      elapsedTime: '1 days 05:25:07',
      threads: '2,113',
      children: '74',
      vss: '23,235,452',
      rss: '23,235,452',
      cpu: '12.67%',
      files: '575',
      cmd: 'java-XX+S',
    },
    {
      process:'Cmon',
      pid: '1313',
      ppid: '1313',
      user: 'Cavisson',
      running: '02/02/2020 00:04:20',
      elapsedTime: '1 days 05:25:07',
      threads: '2,113',
      children: '74',
      vss: '23,235,452',
      rss: '23,235,452',
      cpu: '12.67%',
      files: '575',
      cmd: 'java-XX+S',
    },
    {
      process:'Cmon',
      pid: '1313',
      ppid: '1313',
      user: 'Cavisson',
      running: '02/02/2020 00:04:20',
      elapsedTime: '1 days 05:25:07',
      threads: '2,113',
      children: '74',
      vss: '23,235,452',
      rss: '23,235,452',
      cpu: '12.67%',
      files: '575',
      cmd: 'java-XX+S',
    },
    {
      process:'Cmon',
      pid: '1313',
      ppid: '1313',
      user: 'Cavisson',
      running: '02/02/2020 00:04:20',
      elapsedTime: '1 days 05:25:07',
      threads: '2,113',
      children: '74',
      vss: '23,235,452',
      rss: '23,235,452',
      cpu: '12.67%',
      files: '575',
      cmd: 'java-XX+S',
    },
    {
      process:'Cmon',
      pid: '1313',
      ppid: '1313',
      user: 'Cavisson',
      running: '02/02/2020 00:04:20',
      elapsedTime: '1 days 05:25:07',
      threads: '2,113',
      children: '74',
      vss: '23,235,452',
      rss: '23,235,452',
      cpu: '12.67%',
      files: '575',
      cmd: 'java-XX+S',
    },
    
  ],
  tableFilter: false,
} 
  
   
};
