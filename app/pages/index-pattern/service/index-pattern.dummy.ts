import { IndexPatternTable } from './index-pattern.model';

export const INDEX_PATTERN_TABLE: IndexPatternTable =
{
  headers: [
    {
      cols: [
        {
          label: 'Name',
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
          label: 'Type',
          valueField: 'type',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Format',
          valueField: 'format',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          iconField: true
        },
        {
          label: 'Searchable',
          valueField: 'searchable',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          iconField: true,
        },
        {
          label: 'Aggregatable',
          valueField: 'aggregatable',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          iconField: true,
        },
        {
          label: 'Analayzed',
          valueField: 'analayzed',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
        },
        {
          label: 'Controls',
          valueField: 'controls',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
          isSort: true,
          iconField: true,
        },

      ],
    },
  ],
  data: [
    {
      name: 'Date',
      type: 'String',
      format: '',
      searchable: 'icons8 icons8-checkmark',
      aggregatable: 'icons8 icons8-checkmark',
      analayzed: '',
      controls: 'icons8 icons8-edit-2',
    },
    {
      name: 'Date',
      type: 'String',
      format: '',
      searchable: 'icons8 icons8-checkmark',
      aggregatable: 'icons8 icons8-checkmark',
      analayzed: '',
      controls: 'icons8 icons8-edit-2',
    },
    {
      name: 'Date',
      type: 'String',
      format: '',
      searchable: 'icons8 icons8-checkmark',
      aggregatable: 'icons8 icons8-checkmark',
      analayzed: '',
      controls: 'icons8 icons8-edit-2',
    },
    {
      name: 'Date',
      type: 'String',
      format: '',
      searchable: 'icons8 icons8-checkmark',
      aggregatable: 'icons8 icons8-checkmark',
      analayzed: '',
      controls: 'icons8 icons8-edit-2',
    },
    {
      name: 'Date',
      type: 'String',
      format: '',
      searchable: 'icons8 icons8-checkmark',
      aggregatable: 'icons8 icons8-checkmark',
      analayzed: '',
      controls: 'icons8 icons8-edit-2',

    },
    {
      name: 'Date',
      type: 'String',
      format: '',
      searchable: 'icons8 icons8-checkmark',
      aggregatable: 'icons8 icons8-checkmark',
      analayzed: '',
      controls: 'icons8 icons8-edit-2',
    },
    {
      name: 'Date',
      type: 'String',
      format: '',
      searchable: 'icons8 icons8-checkmark',
      aggregatable: 'icons8 icons8-checkmark',
      analayzed: '',
      controls: 'icons8 icons8-edit-2',

    },
    {
      name: 'Date',
      type: 'String',
      format: '',
      searchable: 'icons8 icons8-checkmark',
      aggregatable: 'icons8 icons8-checkmark',
      analayzed: '',
      controls: 'icons8 icons8-edit-2',
    },


  ],

  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [10, 30, 50, 100],
  },
  tableFilter: false,
};