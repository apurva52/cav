import { Table } from 'src/app/shared/table/table.model';

export const PROCESS_INFO_TABLE_DATA: Table = {

    headers: [
      {
        cols: [
          {
            label: 'Attribute',
            valueField: 'attribute',
            classes: 'text-left',
            selected: true,
            isSort: true,
          },
          {
            label: 'Value',
            valueField: 'value',
            classes: 'text-left',
            selected: true,
            isSort: true,
          },
         
        ],
      },
    ],
    data: [
      {
        attribute: 'Process',
        value: 'Cmon',
      },
      
    ],
  
  };