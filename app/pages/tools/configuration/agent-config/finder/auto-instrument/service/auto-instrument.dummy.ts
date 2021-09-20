import { AutoInstrumentTable } from "./auto-instrument.model";

export const AUTO_INSTRUMENT_TABLE: AutoInstrumentTable = {
  activeInstrumentationTable: {
    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [10, 20, 30, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'Profile Name',
            valueField: 'profileName',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Project Description',
            valueField: 'proDescription',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Check Rules',
            valueField: 'checkRules',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Last Updated',
            valueField: 'LastUpdated',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width: '20%',
          },
          {
            label: 'Updated By',
            valueField: 'updatedBy',
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
    data: [
      {
        profileName: '1',
        proDescription: '184.104.0.0',
        checkRules: '16',
        LastUpdated: '184.105.0.0',
        updatedBy: '184.105.0.0',
      },
      {
        profileName: '2',
        proDescription: '184.104.0.0',
        checkRules: '16',
        LastUpdated: '184.105.0.0',
        updatedBy: '184.105.0.0',
      },
      {
        profileName: '3',
        proDescription: '184.104.0.0',
        checkRules: '16',
        LastUpdated: '184.105.0.0',
        updatedBy: '184.105.0.0',
      },
      {
        profileName: '4',
        proDescription: '184.104.0.0',
        checkRules: '16',
        LastUpdated: '184.105.0.0',
        updatedBy: '184.105.0.0',
      },
      {
        profileName: '5',
        proDescription: '184.104.0.0',
        checkRules: '16',
        LastUpdated: '184.105.0.0',
        updatedBy: '184.105.0.0',
      },
    ],

    tableFilter: true,
  },
  autoInstrumentationTable: {
    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [10, 20, 30, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'Instrumentation Name',
            valueField: 'profileName',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Project ',
            valueField: 'proDescription',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Rules',
            valueField: 'checkRules',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Last Updated',
            valueField: 'LastUpdated',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width: '20%',
          },
          {
            label: 'Updated',
            valueField: 'updatedBy',
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
    data: [
      {
        profileName: '1',
        proDescription: '184.104.0.0',
        checkRules: '16',
        LastUpdated: '184.105.0.0',
        updatedBy: '184.105.0.0',
      },
      {
        profileName: '2',
        proDescription: '184.104.0.0',
        checkRules: '16',
        LastUpdated: '184.105.0.0',
        updatedBy: '184.105.0.0',
      },
      {
        profileName: '3',
        proDescription: '184.104.0.0',
        checkRules: '16',
        LastUpdated: '184.105.0.0',
        updatedBy: '184.105.0.0',
      },
      {
        profileName: '4',
        proDescription: '184.104.0.0',
        checkRules: '16',
        LastUpdated: '184.105.0.0',
        updatedBy: '184.105.0.0',
      },
      {
        profileName: '5',
        proDescription: '184.104.0.0',
        checkRules: '16',
        LastUpdated: '184.105.0.0',
        updatedBy: '184.105.0.0',
      },
    ],

    tableFilter: true,
  },
};