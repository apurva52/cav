import { AuditLogTable } from './audit-log.model';

export const AUDIT_LOG_TABLE: AuditLogTable = {

    paginator: {
      first: 1,
      rows: 27,
      rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
    },
  
    headers: [
      {
        cols: [
          {
            label: 'No',
            valueField: 'no',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'5%' 
          },
          {
            label: 'Time',
            valueField: 'time',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'10%'
          },
          {
            label: 'User',
            valueField: 'user',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            iconField: true,
            width:'10%'
          },
          {
            label: 'IP Address',
            valueField: 'ipAddress',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'10%'
          },
          {
            label: 'Session Id',
            valueField: 'sessionID',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'15%'
          },
          {
            label: 'Module Name',
            valueField: 'module',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'10%'
          },
          {
            label: 'Activity',
            valueField: 'activity',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'10%'
          },
          {
            label: 'DC Name',
            valueField: 'dcName',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'10%'
          },
          {
            label: 'Response Time',
            valueField: 'responseTime',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'10%'
          },
          {
            label: 'Description',
            valueField: 'description',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'10%'
          }
        ],
      },
    ],
    data: [
      {
        no: '1',
        time: '07:09(03/23/20)',
        user: 'Cavisson User 1',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 1",
        },
        newData: "Favrites Added to Dashboard Named as 'Dashboard-arg2' " 
        
      },
      {
        no: '2',
        time: '07:09(03/23/20)',
        user: 'Cavisson User 2',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Logout',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 1",
        }
      },
      {
        no: '3',
        time: '07:09(03/22/20)',
        user: 'Cavisson User 3',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Click',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 2",
        }
      },
      {
        no: '4',
        time: '07:09(03/21/20)',
        user: 'Cavisson User 4',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'MouseOut',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 3",
        }
      },
      {
        no: '5',
        time: '07:09(03/20/20)',
        user: 'Cavisson User 5',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'KeyUp',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 2",
        }
      },
      {
        no: '6',
        time: '07:09(03/19/20)',
        user: 'Cavisson User 6',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 2",
        }
      },
      {
        no: '7',
        time: '07:09(03/18/20)',
        user: 'Cavisson User 7',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Logout',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 1",
        }
      },
      {
        no: '8',
        time: '07:09(03/17/20)',
        user: 'Cavisson User 8',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'KeyUp',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 3",
        }
      },
      {
        no: '9',
        time: '07:09(03/16/20)',
        user: 'Cavisson User 9',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 1",
        }
      },
      {
        no: '10',
        time: '07:09(03/15/20)',
        user: 'Cavisson User 10',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 2",
        }
      },
      {
        no: '11',
        time: '07:09(03/14/20)',
        user: 'Cavisson User 11',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 2",
        }
      },
      {
        no: '12',
        time: '07:09(03/Login/20)',
        user: 'Cavisson User 12',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 1",
        }
      },
      {
        no: '13',
        time: '07:09(03/12/20)',
        user: 'Cavisson User 13',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 2",
        }
      },
      {
        no: '14',
        time: '07:09(03/11/20)',
        user: 'Cavisson User 14',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 3",
        }
      },
      {
        no: '15',
        time: '07:09(03/10/20)',
        user: 'Cavisson User 15',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 2",
        }
      },
      {
        no: '16',
        time: '07:09(03/09/20)',
        user: 'Cavisson User 16',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 1",
        }
      },
      {
        no: '17',
        time: '07:09(03/08/20)',
        user: 'Cavisson User 17',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 1",
        }
      },
      {
        no: '18',
        time: '07:09(03/07/20)',
        user: 'Cavisson User 18',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 1",
        }
      },
      {
        no: '19',
        time: '07:09(03/05/20)',
        user: 'Cavisson User 19',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 2",
        }
      },
      {
        no: '20',
        time: '07:09(03/04/20)',
        user: 'Cavisson User 20',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 1",
        }
      },
      {
        no: '21',
        time: '07:09(03/03/20)',
        user: 'Cavisson User 21',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 2",
        }
      },
      {
        no: '22',
        time: '07:09(03/02/20)',
        user: 'Cavisson User 22',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 1",
        }
      },
      {
        no: '23',
        time: '07:09(03/01/20)',
        user: 'Cavisson User 23',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 3",
        }
      },
      {
        no: '24',
        time: '07:09(04/24/20)',
        user: 'Cavisson User 24',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 3",
        }
      },
      {
        no: '25',
        time: '07:09(05/24/20)',
        user: 'Cavisson User 25',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 2",
        }
      },
      {
        no: '26',
        time: '07:09(06/24/20)',
        user: 'Cavisson User 26',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 1",
        }
      },
      {
        no: '27',
        time: '07:09(08/24/20)',
        user: 'Cavisson User 27',
        icon: 'icons8 icons8-user',
        ipAddress: '192.168.0.1',
        sessionID: 'Cavisson/sadsd/23123423123/new243rCavisson/sadse/2323321342/new2324r',
        module: 'App Monitoring',
        activity: 'Login',
        dcName: 'DC_MON',
        responseTime: '3.28',
        description: '1.78',
        groupData: {
          name: "Cavisson User 3",
        }
      },
    ],
  
    iconsField: 'icon',
    tableFilter: true,
  };