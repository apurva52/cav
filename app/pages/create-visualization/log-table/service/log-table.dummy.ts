import { LogTable } from './log-table.model';

export const LOG_TABLE: LogTable = {
  headers: [
    {
      cols: [
        {
          label: 'Time',
          valueField: 'time',
          classes: 'text-left',
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          width: '10%'
        },
        {
          label: 'Log Information',
          valueField: 'value',
          classes: 'text-left',
          badgeField: true,
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          width: '65%'
        },
        {
          label: '',
          valueField: 'icon',
          classes: 'text-left',
          iconField: true, 
          filter: {
            isFilter: true,
            type: 'contains',
          },        
          width: '20%'
        },
      ],
    },
  ],
  data: [
    {
      no: '#',
      time: '23:51:24 02/03/21',
      response: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
      icon: '',    
      responseBtns:
        [
          {
            label: 'tier: Tomcat4',
            color: 'bg-voilet',
          },
          {
            label: 'server: controller',
            color: 'bg-green',
          },
          {
            label: 'instance: Instance_1_1_1_1_1_1_1_1',
            color: 'bg-pink',
          },
        ], 
    },
    {
      no: '#',
      time: '23:51:24 02/01/21',
      response: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
      icon: '',
      responseBtns:
        [
          {
            label: 'tier: Tomcat4',
            color: 'bg-voilet',
          },
          {
            label: 'message: Tomcat4',
            color: 'bg-yellow',
          }
        ],
    },
    {
      no: '#',
      time: '23:51:24 02/03/21',
      response: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
      icon: '',   
      responseBtns:
        [
          {
            label: 'server: controller',
            color: 'bg-green',
          },
          {
            label: 'message: Tomcat4',
            color: 'bg-yellow',
          }
        ],
    },
    {
      no: '#',
      time: '23:51:24 02/01/21',
      response: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
      icon: '',
      responseBtns:
        [
          {
            label: 'tier: Tomcat4',
            color: 'bg-voilet',
          },
          {
            label: 'server: controller',
            color: 'bg-green',
          },
          {
            label: 'message: Tomcat4',
            color: 'bg-yellow',
          }
        ],
    }
  ],
};
