import { Table } from "src/app/shared/table/table.model";

export const CONNECTIVITY_TABLE: Table = {

    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [10, 20, 30, 50, 100],
    },
  
    headers: [
      {
        cols: [
          {
            label: 'Client Interface',
            valueField: 'interface',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,           
          },
          {
            label: 'Client Side Gateway Port IP address',
            valueField: 'clientGateway',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Server Side Gateway Port IP address',
            valueField: 'serverGateway',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true ,       
          },
          {
            label: 'Server IP',
            valueField: 'serverIP',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'20%'  
          }     
        ],
      },
    ],
    data: [
      {
        interface: '1',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
      },
      {
        interface: '2',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
      },
      {
        interface: '3',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
      },
      {
        interface: '4',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
      },
      {
        interface: '5',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
      },
      {
        interface: '6',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
      },
      {
        interface: '7',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
      },
      {
        interface: '8',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
      },
      {
        interface: '9',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '10',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '11',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '12',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '13',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '14',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '15',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '16',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '17',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '18',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '19',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '20',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '21',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '22',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '23',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '24',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '25',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '26',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
      {
        interface: '27',
        clientGateway: '184.104.0.0',
        serverGateway: '16',        
        serverIP: '184.105.0.0',
        
        
      },
    ],
  
    tableFilter: true,
  };