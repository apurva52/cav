
import { systemsummaryviewTable } from "./system-view.model";


export const SYSTEM_SUMMARY_VIEW_TABLE: systemsummaryviewTable = {
    dataLoaded: [
        {
            header: 'Transaction Time',
            icon: 'icons8 icons8-ok',
            startVal: '5 sec',
            endVal: 'Normal',
            avg: '4.8% in last 7 days',
            borderColor: '#327ABA',
            textColor: '#327ABA',
          
        },
        {
          header: 'Error Rate',
          icon: 'icons8 icons8-info',
          startVal: '20/sec',
          endVal: 'Critical',
          avg: '4.8% in last 7 days',
          borderColor: 'red',
          textColor: 'red',
        
      },
      {
          header: 'TSP',
          icon: 'icons8 icons8-ok',
          startVal: '5 sec',
          endVal: 'Normal',
          avg: '4.8% in last 7 days',
          borderColor: '#327ABA',
          textColor: '#327ABA',
        
      },
      {
          header: 'Health',
          icon: 'icons8 icons8-ok',
          startVal: 'Normal',
          endVal: 'Normal',
          avg: '4.8% in last 7 days',
          borderColor: '#327ABA',
          textColor: '#327ABA',
        
      },
      {
          header: 'Order Rate',
          icon: 'icons8 icons8-info',
          startVal: '2500 / sec',
          endVal: 'Critical',
         avg: '4.8% in last 7 days',
          borderColor: 'red',
          textColor: 'red',
        
      },
      {
          header: 'Revenue',
          icon: 'icons8 icons8-minus-sign',
          startVal: '$212000',
          endVal: 'Major',
          avg: '4.8% in last 7 days',
          borderColor: '#FDB654',
          textColor: '#FDB654',
        
      },
      {
          header: 'Wasted CPU Performance',
          icon: 'icons8 icons8-minus-sign',
          startVal: '40%',
          endVal: 'Major',
          avg: '4.8% in last 7 days',
          borderColor: '#FDB654',
          textColor: '#FDB654',
         
      },
      {
          header: 'Wasted Memory',
          icon: 'icons8 icons8-minus-sign',
          startVal: '34 GB',
          endVal: 'Major',
          avg: '4.8% in last 7 days',
          borderColor: '#FDB654',
          textColor: '#FDB654',
         
      },
  
    ]

};