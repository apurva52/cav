import { InfoData } from 'src/app/shared/dialogs/informative-dialog/service/info.model';

// export const MY_DASHBOARDS_TABLE: MyDashboardsTableData = {
//   dashboardTableData: {
//     paginator: {
//       first: 0,
//       rows: 15,
//       rowsPerPageOptions: [15, 20, 25, 50, 100],
//     },

//     headers: [
//       {
//         cols: [
//           {
//             label: 'Name',
//             valueField: 'name',
//             classes: 'text-left',
//             selected: true,
//             filter: {
//               isFilter: true,
//               type: 'contains',
//             },
//             isSort: true,
//           },
//           {
//             label: 'Last Modified',
//             valueField: 'lastModified',
//             classes: 'text-left',
//             selected: true,
//             filter: {
//               isFilter: true,
//               type: 'contains',
//             },
//             isSort: true,
//           },
//           {
//             label: 'Date Created',
//             valueField: 'dateCreated',
//             classes: 'text-left',
//             selected: true,
//             filter: {
//               isFilter: true,
//               type: 'contains',
//             },
//             isSort: true,
//           },
//           {
//             label: 'Active Users',
//             valueField: 'activeUsers',
//             classes: 'text-left',
//             selected: true,
//             filter: {
//               isFilter: true,
//               type: 'contains',
//             },
//             isSort: true,
//           },
//           {
//             label: 'Owner',
//             valueField: 'owner',
//             classes: 'text-left',
//             selected: true,
//             filter: {
//               isFilter: true,
//               type: 'contains',
//             },
//             isSort: true,
//           },
//         ],
//       },
//     ],
//     data: [
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//       {
//         name: 'Page Overview Dashboard',
//         lastModified: '07:09(03/24/20)',
//         dateCreated: '07:09(03/24/20)',
//         activeUsers: '15',
//         owner: 'Lorem Ipsum',
//         accessStatus: 'granted',
//       },
//     ],
//   },
//   options: [
//     {
//       label: 'All Users',
//       value: 'All Users',
//     },
//     {
//       label: 'All Users',
//       value: 'All Users1',
//     },
//     {
//       label: 'All Users',
//       value: 'All Users2',
//     },
//   ],
// };

export const CONTENT: InfoData = {
        title: 'Help',
        information: 'Hi @all'

}
export const ADD_CONTENT: InfoData = {
        title: 'Criteria for Creating Dashboard',
        information: "1.Maximum character length of Dashboard name should be of 32  letter." ,
        extraInfo :  "2.Name of the Dashboard should be started with the alphabet.",
        extraInfo1 : "3.Dashboard Name should contain alphanumeric and underscore only.",
        button:'ok'
}