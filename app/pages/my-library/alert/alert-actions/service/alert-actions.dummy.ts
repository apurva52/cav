import { Table } from 'src/app/shared/table/table.model';
import { ActionTable } from './alert-actions.model';

export const ALERT_ACTION_DATA: ActionTable = {

    paginator: {
      first: 1,
      rows: 33,
      rowsPerPageOptions: [5, 10, 25, 50, 100],
    },
  
    headers: [
      {
        cols: [
          {
            label: "Action Name",
            valueField: "name",
            classes: "left",
            selected: true,
            width: "45%",
            filters: {
               filter: true,
               type: "contains"
            }
          },
          {
            label: "Action Type",
            valueField: "type",
            classes: "left",
            selected: true,
            width: "50%",
              filters: {
               filter: true,
               type: "contains"
            }          
          }
        ]
      }  
    ],
    data: []
  };