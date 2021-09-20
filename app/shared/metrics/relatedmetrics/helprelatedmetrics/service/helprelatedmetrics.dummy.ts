import { HelpRelatedMetricsTable } from './helprelatedmetrics.model';

export const HELP_RELATED_METRICS_DATA: HelpRelatedMetricsTable = 
{
 

    headers: [
      {
        cols: [
          {
            label: 'Criteria',
            valueField: 'criteria',
            classes: 'text-left',
            isSort: true,
            width:'10%'
          },
          {
            label: 'Symbol',
            iconField: true,
            valueField: 'icon',
            classes: 'text-left',
            isSort: true,
            width:'10%'
          },
          {
            label: 'Sample',
            valueField: 'sample',
            classes: 'text-left',
            isSort: true,
            width:'10%'
          },
          {
            label: 'Result',
            valueField: 'result',
            classes: 'text-center',
            isSort: true,
            width:'10%'
          },
          {
            label: 'Incase we have',
           
            valueField: 'incase',
            classes: 'text-center',
            isSort: true,
            width:'10%'
          },
        ],
      },
    ],
    data: [
      {
        criteria:"Character in Range",
        icon:"icons8 icons8-collapse-arrow",
        sample:"CPU[0-2]",
        result: 'CPU0,CPU1,CPU2',
        incase:"CPU0,CPU1,CPU2,CPU3",
      },
      {
        criteria:"Optional Character",
        icon:"icons8 icons8-help",
        sample:"CPU[0-2]",
        result: 'CPU0,CPU1,CPU2',
        incase:"CPU0,CPU1,CPU2,CPU3",
      },
      {
        criteria:"One/More same Preceding element",
        icon:"icons8 icons8-plus-math",
        sample:"CPU[0-2]",
        result: 'CPU0,CPU1,CPU2',
        incase:"CPU0,CPU1,CPU2,CPU3",
      },
      {
        criteria:"Zero/More same Preceding element",
        icon:"icons8 icons8-star-filled",
        sample:"CPU[0-2]",
        result: 'CPU0,CPU1,CPU2',
        incase:"CPU0,CPU1,CPU2,CPU3",
      },
      {
        criteria:"Zero/More different Preceding element",
        icon:"icons8 icons8-star-filled",
        sample:"CPU[0-2]",
        result: 'CPU0,CPU1,CPU2',
        incase:"CPU0,CPU1,CPU2,CPU3",
      },
      {
        criteria:"Starting Portion within a string",
        icon:"icons8 icons8-collapse-arrow",
        sample:"CPU[0-2]",
        result: 'CPU0,CPU1,CPU2',
        incase:"CPU0,CPU1,CPU2,CPU3",
      },
      
    ],
    iconsField: 'icon',
};