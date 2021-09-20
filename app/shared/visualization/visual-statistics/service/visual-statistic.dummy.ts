import { StaticticTable } from './visual-statistic.model';


export const STATISTIC_TABLE: StaticticTable = {
 
  
  headers: [
    {
      cols: [
        {
          label: '',
          valueField: 'timestamp', 
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          width: '80%'                 
        },
        {
          label: '',
          valueField: 'count',
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          width: '20%'
        }          
      ],
    },
  ],
  data: [
    {
      timestamp: 'Query Duration',
      count: '2'
    },
    {
      timestamp: 'Request Duration',
      count: '2'
     
    },
    {
      timestamp: 'Hits',
      count: '2'
     
      
    },
    {
      timestamp: 'Index',
      count: '2'
    
      
    }
  ],

};

