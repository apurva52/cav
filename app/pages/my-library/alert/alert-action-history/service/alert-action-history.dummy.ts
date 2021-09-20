
import { AlertActionHistoryTable } from './alert-action-history.model';

export const GET_ACTIONS_HISTORY = 48;
export const DELETE_ACTIONS_HISTORY = 49;

export const ACTION_HISTORY_TABLE_DATA : AlertActionHistoryTable  = {

    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [5, 10, 25, 50, 100],
    },
  
    headers: [
      {
        cols: [
          {
            label: 'Selection Mode',
            valueField: "selected",
            classes: 'left',
            selected: true,
            width: "4%",
            filters: {
              filter: false,
              type: "contains"
           }
          },
          {
            label: 'Status',
            valueField: "severity",
            classes: 'left',
            selected: true,
            width: "7%",
            filters: {
              filter: true,
              type: "contains"
           }
          },
          {
            label: "Rule Name",
            valueField: "ruleName",
            classes: 'left',
            selected: true,
            width: "19%",
            filters: {
              filter: true,
              type: "contains"
           }
          },
         
          {
            label: "Action Time",
            valueField: "actionTime",
            classes: 'left',
            selected: true,
            width: "20%",
            filters: {
              filter: true,
              type: "contains"
           }
            
          },
         
          {
            label: "Action Type",
            valueField: "type",
            classes: 'left',
            selected: true,
            width: "20%",
            filters: {
              filter: true,
              type: "contains"
           }
          },
          {
            label: 'Description',
            valueField: "msg",
            classes: 'left',
            selected: true,
            width: "30%",
            filters: {
              filter: true,
              type: "contains"
           }
          },
        ],
      },
    ],
    data: [],
    status:{}
  };