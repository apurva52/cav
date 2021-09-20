import { ServersTable } from "./servers.model";

export const SERVERS_DATA: ServersTable = {

    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [10, 20, 50, 100],
    },
   

    headers: [
        {
            cols: [
                {
                    label: 'Server Name',
                    valueField: 'servername',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    selected: true
                },
                {
                    label: 'Server Type',
                    valueField: 'servertype',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    selected: true
                },
                {
                    label: 'Installation Dir',
                    valueField: 'installationDir',
                    classes: 'text-left',
                    isSort: true,
                   
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    selected: true,
                },
                {
                    label: 'Installation Dir',
                    valueField: 'installationDir',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    selected: true,
                },
                {
                    label: 'JAVA_HOME',
                    valueField: 'javaHome',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    selected: true,
                },
                {
                    label: 'Agentless',
                    valueField: 'agentless',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    selected: true,
                },
                {
                    label: 'SSH Available',
                    valueField: 'ssh',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    selected: true,
                },
                {
                    label: 'User Name',
                    valueField: 'userName',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    selected: true,
                }
            ],
        },
    ],
    data: [
        {
            servername: 'NO',
            servertype: 'Linux Extended',
            installationDir: '/home/cavisson/monitors',
            javaHome: '/user/bin',
            agentless: 'No',
            ssh: 'Yes',
            userName: 'cavisson'
        },
        {
            servername: 'NO',
            servertype: 'Linux Extended',
            installationDir: '/home/cavisson/monitors',
            javaHome: '/user/bin',
            agentless: 'No',
            ssh: 'Yes',
            userName: 'cavisson'
        },
    ],
    tableFilter: true,
};
