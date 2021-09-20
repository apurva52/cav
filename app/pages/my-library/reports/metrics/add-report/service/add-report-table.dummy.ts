// import { MeasurementTable } from './add-report.model';

export const MEASUREMENT_TABLE = {

    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [10, 20, 30, 50, 100],
    },
  
    headers: [
      {
        cols: [
          {
            label: 'Measurement Name',
            valueField: 'measurementName',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,           
          },
          {
            label: 'Preset',
            valueField: 'preset',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Start Date & Time',
            valueField: 'sTime',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true ,       
          },
          {
            label: 'End Date & Time',
            valueField: 'eTime',
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
        measurementName: '1',
        preset: 'Today',
        sTime: '4:30 PM 24/04/2021',        
        eTime: '4:30 PM 24/04/2021'
      },
      {
        measurementName: '2',
        preset: 'Today',
        sTime: '4:30 PM 24/04/2021',        
        eTime: '4:30 PM 24/04/2021'
      },
      {
        measurementName: '3',
        preset: 'Today',
        sTime: '4:30 PM 24/04/2021',        
        eTime: '4:30 PM 24/04/2021'
      },
      {
        measurementName: '4',
        preset: 'Today',
        sTime: '4:30 PM 24/04/2021',        
        eTime: '4:30 PM 24/04/2021'
      },
      {
        measurementName: '5',
        preset: 'Today',
        sTime: '4:30 PM 24/04/2021',        
        eTime: '4:30 PM 24/04/2021'
      },
      {
        measurementName: '6',
        preset: 'Today',
        sTime: '4:30 PM 24/04/2021',        
        eTime: '4:30 PM 24/04/2021'
      },
      {
        measurementName: '7',
        preset: 'Today',
        sTime: '4:30 PM 24/04/2021',        
        eTime: '4:30 PM 24/04/2021'
      } 
    ],
  
    tableFilter: true,
  };