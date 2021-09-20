import { MonitorGroupTable, MonitorsTable } from './monitors.model';

export const MONITORS_TABLE: MonitorsTable = {
  allReports: [
    {
      label: 'ALL REPORTS',
      value: 'ALL REPORTS',
    },
  ],
  paginator: {
    first: 10,
    rows: 25,
    rowsPerPageOptions: [10, 20, 30, 40, 50],
  },
  headers: [
    {
      cols: [
        {
          label: 'Monitor Group',
          valueField: 'monitorGroup',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          
        },
        {
          label: 'Tier',
          valueField: 'tier',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,          
        },

        {
          label: 'Status',
          valueField: 'status',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          iconField: true,
          actionIcon: true
        }
        
      ],
    },
  ],
  data: [
    {
      monitorGroup: 'Apache Camel',
      icon: 'icons8 icons8-error',
      tier: 'Cavisson',
      status: 'Failed',
      
      
      groupData: {
        name: 'group1',
      },
    }
    ,
    {
        monitorGroup: 'Apache Camel',
        icon: 'icons8 icons8-error',
        tier: 'Cavisson',
        status: 'Failed',
        
        
        groupData: {
          name: 'group2',
        },
      },
      {
        monitorGroup: 'Apache Camel',
        icon: 'icons8 icons8-error',
        tier: 'Cavisson',
        status: 'Failed',
        
        
        groupData: {
          name: 'group3',
        },
      },
      {
        monitorGroup: 'Apache Camel',
        icon: 'icons8 icons8-error',
        tier: 'Cavisson',
        status: 'Failed',
        
        
        groupData: {
          name: 'group4',
        },
      },
      {
        monitorGroup: 'Apache Camel',
        icon: 'icons8 icons8-error',
        tier: 'Cavisson',
        status: 'Failed',
        
        
        groupData: {
          name: 'group5',
        },
      }
    
   
  ],
  tableFilter: true,
  iconsField: 'icon',
};

export const MONITOR_GROUP_TABLE: MonitorGroupTable = {
    
    paginator: {
      first: 10,
      rows: 25,
      rowsPerPageOptions: [10, 20, 30, 40, 50],
    },
    headers: [
      {
        cols: [
          {
            label: 'Server',
            valueField: 'server',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Instance',
            valueField: 'instance',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,          
          },
  
          {
            label: 'Start Date Time',
            valueField: 'startTime',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Last Reconnect Time',
            valueField: 'reconnectTime',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Status',
            valueField: 'status',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            iconField: true
          },
          {
            label: 'Reason',
            valueField: 'reason',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          }
          
        ],
      },
    ],
    data: [
      {
        server: 'NA',
        instance: 'Instance 1',
        startTime: '20/11/20 11:30:00',
        reconnectTime: '20/11/20 11:30:00',
        status: 'Failed',
        reason: 'Error in connecting JMX port',
        icon: 'icons8 icons8-error',
        
      }
      ,
      {
        server: 'NA',
        instance: 'Instance 1',
        startTime: '20/11/20 11:30:00',
        reconnectTime: '20/11/20 11:30:00',
        status: 'Running',
        reason: 'NA',
        icon: 'icons8 icons8-clock',
        
      }
      
     
    ],
    tableFilter: true,
    iconsField: 'icon',
  };
