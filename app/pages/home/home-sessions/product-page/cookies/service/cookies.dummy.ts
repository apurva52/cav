import { CookiesTable } from "./cookies.model";


export const COOKIES_TABLE: CookiesTable = {
    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [5,10, 25, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'Cookie Name',
            valueField: 'name',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Value',
            valueField: 'value',
            classes: 'text-left',
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
    data: [],
   
    severityBgColorField: 'severityColor',
  };
