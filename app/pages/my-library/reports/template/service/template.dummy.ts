import { TemplateTable } from './template.model';
export const TEMPLATE_TABLE_DATA: TemplateTable = {
  paginator: {
    first: 0,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },
  headers: [
    {
      cols: [
        {
          label: 'Template Name',
          valueField: 'tn',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Type',
          valueField: 'type',
          classes: 'text-left',
          selected: true,
          width: '25%',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },

        {
          label: 'Report Sets',
          valueField: 'rptSetNum',
          classes: 'text-center',
          selected: true,
          width: '10%',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Last Modified',
          valueField: 'md',
          classes: 'text-center',
          selected: true,
          width: '10%',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Owner',
          valueField: 'un',
          classes: 'text-center',
          selected: true,
          width: '10%',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Template Description',
          valueField: 'des',
          classes: 'text-center',
          selected: true,
          width: '10%',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
      ],
    },
  ],
  headersRead: [
    {
      cols: [
        {
          label: 'Template Name',
          valueField: 'tn',
          classes: 'text-left',
          selected: true,
          width: '25%',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Type',
          valueField: 'type',
          classes: 'text-left',
          selected: true,
          width: '10%',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },

        {
          label: 'Report Sets',
          valueField: 'rptSetNum',
          classes: 'text-center',
          selected: true,
          width: '10%',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Last Modified',
          valueField: 'md',
          classes: 'text-center',
          selected: true,
          width: '10%',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Owner',
          valueField: 'un',
          classes: 'text-center',
          selected: true,
          width: '10%',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Template Description',
          valueField: 'des',
          classes: 'text-center',
          selected: true,
          width: '35%',
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
      ],
    },
  ],
  tableFilter: false
};
export const TABLE_JSON = {
  headers: [
    {
      label: "Template Name",
      value: "tn",
    },
    {
      label: "Template Description",
      value: "des",
    },
    {
      label: "Created On",
      value: "cd",
    },
    {
      label: "Modified Date",
      value: "md",
    },
    {
      label: "User Name",
      value: "un",
    },
    {
      label: "Test Run",
      value: "tr",
    },
    {
      label: "Report Set Count",
      value: "rptSetNum",
    },
    {
      label: "Type",
      value: "type",
    },
    {
      label: "Extension",
      value: "ext",
    },
  ]
}
