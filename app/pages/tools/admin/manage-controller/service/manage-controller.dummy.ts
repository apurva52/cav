import { Table } from 'src/app/shared/table/table.model';

export const MANAGE_CONTROLLER_TABLE: Table = {
  paginator: {
    first: 1,
    rows: 20,
    rowsPerPageOptions: [10, 20, 30, 50, 100],
  },

  headers: [
    {
      cols: [
        {
          label: 'Appliance Name',
          valueField: 'applianceName',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          
        },
        {
          label: 'Controller Name',
          valueField: 'controllerName',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Controller URL',
          valueField: 'controllerURL',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Service End Point IP',
          valueField: 'serviceIP',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          width: '20%',
        },
      ],
    },
  ],
  data: [
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
    {
      applianceName: 'NS_11',
      controllerName: 'NC_MON_REPLICA',
      controllerURL: 'http://65.91.0.101:8001',
      serviceIP: '65.91.0.101',
    },
  ],
  tableFilter: true,
};

export const SERVICE_PORT_TABLE: Table = {
  paginator: {
    first: 1,
    rows: 15,
    rowsPerPageOptions: [10, 20, 30, 50, 100],
  },
  headers: [
    {
      cols: [
        {
          label: 'Port Name',
          valueField: 'portName',
          classes: 'text-left',
          isSort: true,
          width: '50%',
        },
        {
          label: 'Port Number',
          valueField: 'portNumber',
          classes: 'text-left',
          isSort: true,
        },
      ],
    },
  ],
  data: [
    {
      portName: 'TOMCAT_HTTP_PORT',
      portNumber: '8001',      
    },
    {
      portName: 'TOMCAT_HTTP_PORT',
      portNumber: '8001',      
    },
    {
      portName: 'TOMCAT_HTTP_PORT',
      portNumber: '8001',      
    },
    {
      portName: 'TOMCAT_HTTP_PORT',
      portNumber: '8001',      
    },
    {
      portName: 'TOMCAT_HTTP_PORT',
      portNumber: '8001',      
    },
    {
      portName: 'TOMCAT_HTTP_PORT',
      portNumber: '8001',      
    },
    {
      portName: 'TOMCAT_HTTP_PORT',
      portNumber: '8001',      
    },
    {
      portName: 'TOMCAT_HTTP_PORT',
      portNumber: '8001',      
    }
  ],
};

export const RECORDER_PORT_TABLE: Table = {
  paginator: {
    first: 1,
    rows: 15,
    rowsPerPageOptions: [10, 20, 30, 50, 100],
  },
  headers: [
    {
      cols: [
        {
          label: 'Start',
          valueField: 'start',
          classes: 'text-left',
          isSort: true,
        },
        {
          label: 'End',
          valueField: 'end',
          classes: 'text-left',
          isSort: true,
        },
      ],
    },
  ],
  data: [
    {
      start: '120011',
      end: '8001',      
    },
    {
      start: '120011',
      end: '8001',      
    },
    {
      start: '120011',
      end: '8001',      
    },
    {
      start: '120011',
      end: '8001',      
    },
    {
      start: '120011',
      end: '8001',      
    },
    {
      portName: '120011',
      end: '8001',      
    },
    {
      start: '120011',
      end: '8001',      
    },
    {
      start: '120011',
      end: '8001',      
    }
  ],
};