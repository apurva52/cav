import { SessionsDataTable } from "./session-page-data.model";

export const SESSION_PAGE_DATA: SessionsDataTable = {
  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },

  headers: [
    {
      cols: [
        {
          label: 'Action',
          valueField: 'actions',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Time',
          valueField: 'name',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Session Id',
          valueField: 'topology',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          iconField: true,
        },
        
      ],
    },
  ],
  data: [
        {
          name:'23:51:16, 02/05/2020',
          topology: 'Sessionid: 56464651121545 IP - 108.255.554.256',
          severityColor: '#FF8484',
        },
        {
          name:'23:51:16, 02/05/2020',
          topology: 'Sessionid: 56464651121545 IP - 108.255.554.256',
          severityColor: '#FF8484',
        },
        {
          name:'23:51:16, 02/05/2020',
          topology: 'Sessionid: 56464651121545 IP - 108.255.554.256',
          severityColor: '#FF8484',
        },
        {
          name:'23:51:16, 02/05/2020',
          topology: 'Sessionid: 56464651121545 IP - 108.255.554.256',
          severityColor: '#FF8484',
        },
        {
          name:'23:51:16, 02/05/2020',
          topology: 'Sessionid: 56464651121545 IP - 108.255.554.256',
          severityColor: '#FF8484',
        },
        {
          name:'23:51:16, 02/05/2020',
          topology: 'Sessionid: 56464651121545 IP - 108.255.554.256',
          severityColor: '#FF8484',
        },
        {
          name:'23:51:16, 02/05/2020',
          topology: 'Sessionid: 56464651121545 IP - 108.255.554.256',
          severityColor: '#FF8484',
        },
        {
          name:'23:51:16, 02/05/2020',
          topology: 'Sessionid: 56464651121545 IP - 108.255.554.256',
          severityColor: '#FF8484',
        },
        {
          name:'23:51:16, 02/05/2020',
          topology: 'Sessionid: 56464651121545 IP - 108.255.554.256',
          severityColor: '#FF8484',
        },
        {
          name:'23:51:16, 02/05/2020',
          topology: 'Sessionid: 56464651121545 IP - 108.255.554.256',
          severityColor: '#FF8484',
        },
        {
          name:'23:51:16, 02/05/2020',
          topology: 'Sessionid: 56464651121545 IP - 108.255.554.256',
          severityColor: '#FF8484',
        },
        {
          name:'23:51:16, 02/05/2020',
          topology: 'Sessionid: 56464651121545 IP - 108.255.554.256',
          severityColor: '#FF8484',
        },
        {
          name:'23:51:16, 02/05/2020',
          topology: 'Sessionid: 56464651121545 IP - 108.255.554.256',
          severityColor: '#FF8484',
        },
  ],
  severityBgColorField: 'severityColor',
};