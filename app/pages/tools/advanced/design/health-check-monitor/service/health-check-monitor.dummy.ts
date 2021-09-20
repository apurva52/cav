import { HealthCheckMonitorTable } from "./health-check-monitor.model";


export const HEALTH_CHECK_MONITOR_TABLE_DATA: HealthCheckMonitorTable = {

    paginator: {
      first: 1,
      rows: 33,
      rowsPerPageOptions: [5, 10, 25, 50, 100],
    },
  
    headers: [
      {
        cols: [
          {
            label: 'Server Name',
            valueField: 'servername',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Server Type',
            valueField: 'servertype',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
         
          {
            label: 'Host',
            valueField: 'host',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Port Url',
            valueField: 'porturl',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'User Name',
            valueField: 'username',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Password',
            valueField: 'password',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Is Password Encrypted?',
            valueField: 'ispasswordencrypted',
            classes: 'text-center',
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
        servername: 'A',
        servertype: '#e07eff',
        host: 'System Std Linux',
        porturl: 'Request Per Seconds',
        username: 'Specified Indices',
        password: 'Specified Indices',
        ispasswordencrypted: 'Specified Indices',
     
      },
      {
        servername: 'A',
        servertype: '#e07eff',
        host: 'System Std Linux',
        porturl: 'Request Per Seconds',
        username: 'Specified Indices',
        password: 'Specified Indices',
        ispasswordencrypted: 'Specified Indices',
     
      },
      {
        servername: 'A',
        servertype: '#e07eff',
        host: 'System Std Linux',
        porturl: 'Request Per Seconds',
        username: 'Specified Indices',
        password: 'Specified Indices',
        ispasswordencrypted: 'Specified Indices',
     
      },
      {
        servername: 'A',
        servertype: '#e07eff',
        host: 'System Std Linux',
        porturl: 'Request Per Seconds',
        username: 'Specified Indices',
        password: 'Specified Indices',
        ispasswordencrypted: 'Specified Indices',
     
      },
      {
        servername: 'A',
        servertype: '#e07eff',
        host: 'System Std Linux',
        porturl: 'Request Per Seconds',
        username: 'Specified Indices',
        password: 'Specified Indices',
        ispasswordencrypted: 'Specified Indices',
     
      },
      {
        servername: 'A',
        servertype: '#e07eff',
        host: 'System Std Linux',
        porturl: 'Request Per Seconds',
        username: 'Specified Indices',
        password: 'Specified Indices',
        ispasswordencrypted: 'Specified Indices',
     
      },
      {
        servername: 'A',
        servertype: '#e07eff',
        host: 'System Std Linux',
        porturl: 'Request Per Seconds',
        username: 'Specified Indices',
        password: 'Specified Indices',
        ispasswordencrypted: 'Specified Indices',
     
      },
      {
        servername: 'A',
        servertype: '#e07eff',
        host: 'System Std Linux',
        porturl: 'Request Per Seconds',
        username: 'Specified Indices',
        password: 'Specified Indices',
        ispasswordencrypted: 'Specified Indices',
     
      },
      {
        servername: 'A',
        servertype: '#e07eff',
        host: 'System Std Linux',
        porturl: 'Request Per Seconds',
        username: 'Specified Indices',
        password: 'Specified Indices',
        ispasswordencrypted: 'Specified Indices',
     
      },
      {
        servername: 'A',
        servertype: '#e07eff',
        host: 'System Std Linux',
        porturl: 'Request Per Seconds',
        username: 'Specified Indices',
        password: 'Specified Indices',
        ispasswordencrypted: 'Specified Indices',
     
      },
      {
        servername: 'A',
        servertype: '#e07eff',
        host: 'System Std Linux',
        porturl: 'Request Per Seconds',
        username: 'Specified Indices',
        password: 'Specified Indices',
        ispasswordencrypted: 'Specified Indices',
     
      },
      {
        servername: 'A',
        servertype: '#e07eff',
        host: 'System Std Linux',
        porturl: 'Request Per Seconds',
        username: 'Specified Indices',
        password: 'Specified Indices',
        ispasswordencrypted: 'Specified Indices',
     
      },
      {
        servername: 'A',
        servertype: '#e07eff',
        host: 'System Std Linux',
        porturl: 'Request Per Seconds',
        username: 'Specified Indices',
        password: 'Specified Indices',
        ispasswordencrypted: 'Specified Indices',
     
      },
      {
        servername: 'A',
        servertype: '#e07eff',
        host: 'System Std Linux',
        porturl: 'Request Per Seconds',
        username: 'Specified Indices',
        password: 'Specified Indices',
        ispasswordencrypted: 'Specified Indices',
     
      },
      {
        servername: 'A',
        servertype: '#e07eff',
        host: 'System Std Linux',
        porturl: 'Request Per Seconds',
        username: 'Specified Indices',
        password: 'Specified Indices',
        ispasswordencrypted: 'Specified Indices',
     
      },
      
     
 
    ],
  
    tableFilter: false,
  };
export const ADDED_GRAPH: any[] = [
  {
    index: 'A',
    colorForGraph: '#e07eff',
    metricGroup: 'System Std Linux',
    metricName: 'Request Per Seconds',
    indices: 'Specified Indices',
  },
  {
    index: 'B',
    colorForGraph: '#54f1f1 ',
    metricGroup: 'System Std Linux',
    metricName: 'Free Memory',
    indices: 'All Indices',
  },
  {
    index: 'C',
    colorForGraph: '#82f154',
    metricGroup: 'System Std Linux',
    metricName: 'Free Memory',
    indices: 'All Indices',
  },
  {
    index: 'D',
    colorForGraph: '#f14e5d',
    metricGroup: 'System Std Linux',
    metricName: 'Free Memory',
    indices: 'All Indices',
  },
  {
    index: 'E',
    colorForGraph: '#fd9c09',
    metricGroup: 'System Std Linux',
    metricName: 'Free Memory',
    indices: 'All Indices',
  },
];

export const PANEL_DUMMY: any = {
  panels: [
    { label: '', collapsed: false },
    { label: '', collapsed: false },
    { label: '', collapsed: false },
    { label: '', collapsed: false },
    { label: '', collapsed: false },
  ],
};

export const SEVERITY_PANEL_DUMMY: any = {
  panels: [
    {
      label: 'CRITICAL',
      collapsed: false,
      color: '#f12929',
      state: [
        {
          index: 'X',
          colorForGraph: '#e07eff',
          condition: 'Threshold',
          metricName: 'Request Per Seconds',
          threshold: '60',
          severity: 'Critical',
          recoveryThreshold: '82'
        },
        {
          index: 'Y',
          colorForGraph: '#54f1f1 ',
          condition: 'Anamoly',
          metricName: 'Free Memory',
          threshold: '60',
          severity: 'Minor',
          recoveryThreshold: '82'
        },
      ],
    },
    {
      label: 'MAJOR',
      collapsed: true,
      color: '#ff9898',
      state: [
        {
          index: 'X',
          colorForGraph: '#e07eff',
          condition: 'Threshold',
          metricName: 'Request Per Seconds',
          threshold: '85',
          severity: 'Major',
          recoveryThreshold: '83'
        },
        {
          index: 'Y',
          colorForGraph: '#54f1f1 ',
          condition: 'Anamoly',
          metricName: 'Free Memory',
          threshold: '60',
          severity: 'Minor',
          recoveryThreshold: '83'
        },
      ],
    },
    {
      label: 'MINOR',
      collapsed: true,
      color: '#ffc9c9',
      state: [
        {
          index: 'X',
          colorForGraph: '#e07eff',
          condition: 'Threshold',
          metricName: 'Request Per Seconds',
          threshold: '85',
          severity: 'Major',
          recoveryThreshold: '83'
        },
        {
          index: 'Y',
          colorForGraph: '#54f1f1 ',
          condition: 'Anamoly',
          metricName: 'Free Memory',
          threshold: '60',
          severity: 'Minor',
          recoveryThreshold: '83'
        },
      ],
    },
  ],
};
