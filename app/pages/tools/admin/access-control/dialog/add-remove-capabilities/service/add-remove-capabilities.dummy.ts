import { addRemoveCapabilitiesTable } from './add-remove-capabilities.model';

export const ADDREMOVECAPABILITIES_TABLE: addRemoveCapabilitiesTable = {
  // paginator: {
  //   first: 1,
  //   rows: 10,
  //   // rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
  // },
  headers: [
    {
      cols: [
        {
          label: 'Capability',
          valueField: 'capability',
          classes: 'text-left',
          selected: true,
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
        },
        {
          label: 'Description',
          valueField: 'description',
          classes: 'text-left',
          selected: true,
          isSort: true,
          filter: {
            isFilter: true,
            type: 'contains',
          },
        },
      ],
    },
  ],
  data: [
    {
      capability: 'Admin1',
      description: 'Lorem ipsum',
    },
    {
      capability: 'Admin',
      description: 'Lorem ipsum1',
    },
    {
      capability: 'Admin',
      description: 'Lorem ipsum Lorem ipsumLorem ipsum',
    },
    {
      capability: 'Admin',
      description: 'Lorem ipsum Lorem ipsumLorem ipsumLorem ipsumLorem ipsum',
    },
    {
      capability: 'Admin',
      description: 'Lorem ipsumLorem ipsumLorem ipsumLorem ipsum',
    },
  ],
  tableFilter: true,
};
