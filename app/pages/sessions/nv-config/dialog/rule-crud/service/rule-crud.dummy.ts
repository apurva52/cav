import { EditRuleData } from './rule-crud.model';


export const RULE_DATA: EditRuleData[] =

  [
    {
      label: 'page For pages', options: [
        { label: 'Active Card', value: 'all' },
        { label: 'Active Card', value: 'Active Card' },
       
      ]
    },
    {
      label: 'Types For Rule', options: [
        { label: 'cookie', value: 'all' },
        { label: 'URL pattern', value: 'url pattern' },
        { label: 'Engagement', value: 'Engagement' },
        { label: 'click', value: 'click' },
       
      ]
    },
  
  ]
