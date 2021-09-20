import { LogDetailsTable } from './log-details.model';


export const LOG_DETAILS_TABLE: LogDetailsTable = {
  layoutTable :{
  headers: [
    {
      cols: [
        {
          label: 'Time',
          valueField: 'time',
          classes: 'text-left',
        },
        {
          label: '_Source',
          iconField: true,
          valueField: 'keyword',
          classes: 'text-left',
          
        }
      ],
    },
  ],
  data: [
    {
      time: '23:51:24 02/03/21',
      source: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
      icon: 'icons8 icons8-expand-arrow',     
    },
    {
      time: '23:51:24 02/01/21',
      source: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
    },
    {
      time: '23:51:24 02/03/21',
      source: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
    },
    {
      time: '23:51:24 02/01/21',
      source: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s',
    }
  ],
  
},
detailInfoTable :{
  headers: [
    {
      cols: [
        {
          label: 'Fields',
          valueField: 'label',
          classes: 'text-left',
        },
        {
          label: 'Value',
          valueField: 'value',
          classes: 'text-left',
          
        }
      ],
    },
  ],
  data: [
    {
      timestamp: '@timestamp',
      particulars: 'May 6th 2020, 01:44:19 : 481',
    },
    {
      timestamp: 'App_name',
      particulars: 'May 6th 2020, 01:44:19 : 481',
    },
    {
      timestamp: 'App_type',
      particulars: 'search',
    },
    {
      timestamp: '_id',
      particulars: 'discover',
    }
  ],
}
};
