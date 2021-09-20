import { TrabsactionTable } from './transaction.model';

export const TRANSACTION_TABLE_DATA: TrabsactionTable = {

    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [5, 10, 25, 50, 100],
    },
  
    headers: [
      {
        cols: [
          {
            label: 'Transaction Name',
            valueField: 'transactionname',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Min',
            valueField: 'min',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Avg',
            valueField: 'avg',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
         
          {
            label: 'Max',
            valueField: 'max',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Std Dev',
            valueField: 'stddev',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Completed',
            valueField: 'completed',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Success',
            valueField: 'success',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Failure(%)',
            valueField: 'failure',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
      
          {
            label: 'TSP',
            valueField: 'tsp',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'TSP(%)',
            valueField: 'tspinpercent',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Think Time',
            valueField: 'thinktime',
            classes: 'text-center',
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
        transactionname:'Index',
        min:'0.000',
        avg:'0.325',
        max:'3.8889',
        stddev:'0.733',
        completed:'2.538',
        success:'551',
        failure:'78.290',
        tsp:'0.176',
        tspinpercent:'0.198',
        thinktime:'0000'
       },
       {
        transactionname:'Index',
        min:'0.000',
        avg:'0.325',
        max:'3.8889',
        stddev:'0.733',
        completed:'2.538',
        success:'551',
        failure:'78.290',
        tsp:'0.176',
        tspinpercent:'0.198',
        thinktime:'0000'
       },
       {
        transactionname:'Index',
        min:'0.000',
        avg:'0.325',
        max:'3.8889',
        stddev:'0.733',
        completed:'2.538',
        success:'551',
        failure:'78.290',
        tsp:'0.176',
        tspinpercent:'0.198',
        thinktime:'0000'
       },
       {
        transactionname:'Index',
        min:'0.000',
        avg:'0.325',
        max:'3.8889',
        stddev:'0.733',
        completed:'2.538',
        success:'551',
        failure:'78.290',
        tsp:'0.176',
        tspinpercent:'0.198',
        thinktime:'0000'
       },
       {
        transactionname:'Index',
        min:'0.000',
        avg:'0.325',
        max:'3.8889',
        stddev:'0.733',
        completed:'2.538',
        success:'551',
        failure:'78.290',
        tsp:'0.176',
        tspinpercent:'0.198',
        thinktime:'0000'
       },
       {
        transactionname:'Index',
        min:'0.000',
        avg:'0.325',
        max:'3.8889',
        stddev:'0.733',
        completed:'2.538',
        success:'551',
        failure:'78.290',
        tsp:'0.176',
        tspinpercent:'0.198',
        thinktime:'0000'
       },
       {
        transactionname:'Index',
        min:'0.000',
        avg:'0.325',
        max:'3.8889',
        stddev:'0.733',
        completed:'2.538',
        success:'551',
        failure:'78.290',
        tsp:'0.176',
        tspinpercent:'0.198',
        thinktime:'0000'
       },
       {
        transactionname:'Index',
        min:'0.000',
        avg:'0.325',
        max:'3.8889',
        stddev:'0.733',
        completed:'2.538',
        success:'551',
        failure:'78.290',
        tsp:'0.176',
        tspinpercent:'0.198',
        thinktime:'0000'
       },
       {
        transactionname:'Index',
        min:'0.000',
        avg:'0.325',
        max:'3.8889',
        stddev:'0.733',
        completed:'2.538',
        success:'551',
        failure:'78.290',
        tsp:'0.176',
        tspinpercent:'0.198',
        thinktime:'0000'
       },
      
       {
        transactionname:'Index',
        min:'0.000',
        avg:'0.325',
        max:'3.8889',
        stddev:'0.733',
        completed:'2.538',
        success:'551',
        failure:'78.290',
        tsp:'0.176',
        tspinpercent:'0.198',
        thinktime:'0000'
       },
       {
        transactionname:'Index',
        min:'0.000',
        avg:'0.325',
        max:'3.8889',
        stddev:'0.733',
        completed:'2.538',
        success:'551',
        failure:'78.290',
        tsp:'0.176',
        tspinpercent:'0.198',
        thinktime:'0000'
       },
     
    
     
    ],
  
    tableFilter: false,
  };