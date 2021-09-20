import { Table } from 'src/app/shared/table/table.model';

export const METHOD_MONITOR_TABLE_DATA: Table = {

    paginator: {
      first: 1,
      rows: 33,
      rowsPerPageOptions: [5, 10, 25, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'Fully Qualified Method Name',
            valueField: 'methodName',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Display Name in Monitor',
            valueField: 'displayName',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Description',
            valueField: 'description',
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
        methodName: 'com.cavisson.gui.server.aci.services.ACLUserServer',
        displayName: 'UserValidation',
        description: 'UserValidation',
      },
      {
        methodName: 'com.cavisson.gui.server.aci.services.ACLUserServer',
        displayName: 'UserValidation',
        description: 'UserValidation',
      },
      {
        methodName: 'com.cavisson.gui.server.aci.services.ACLUserServer',
        displayName: 'UserValidation',
        description: 'UserValidation',
      },
      {
        methodName: 'com.cavisson.gui.server.aci.services.ACLUserServer',
        displayName: 'UserValidation',
        description: 'UserValidation',
      },
      {
        methodName: 'com.cavisson.gui.server.aci.services.ACLUserServer',
        displayName: 'UserValidation',
        description: 'UserValidation',
      },
      {
        methodName: 'com.cavisson.gui.server.aci.services.ACLUserServer',
        displayName: 'UserValidation',
        description: 'UserValidation',
      },
      {
        methodName: 'com.cavisson.gui.server.aci.services.ACLUserServer',
        displayName: 'UserValidation',
        description: 'UserValidation',
      },
    ],
    tableFilter: false,
  };