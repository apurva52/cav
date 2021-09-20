import { profileTable } from "./profile.model";

export const PROFILE_TABLE_DATA: profileTable = {

    paginator: {
      first: 1,
      rows: 33,
      rowsPerPageOptions: [5, 10, 25, 50, 100],
    },
  
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
            actionIcon: true
          },
          {
            label: 'Agent',
            valueField: 'agent',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            actionIcon: false
          },
          {
            label: 'Last Updated On',
            valueField: 'updatedOn',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Description',
            valueField: 'description',
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
        name: 'ND Profile 14',
        agent: 'Java',
        updatedOn: '23/11/2020 02:23:20 ',
        description: '-',
        icon: 'icons8 icons8-ok',
      },
      {
        name: 'ND Profile 14',
        agent: 'Java',
        updatedOn: '23/11/2020 02:23:20 ',
        description: '-',
        icon: 'icons8 icons8-ok',
      },
      {
        name: 'ND Profile 14',
        agent: 'Java',
        updatedOn: '23/11/2020 02:23:20 ',
        description: '-',
      },
      {
        name: 'ND Profile 14',
        agent: 'Java',
        updatedOn: '23/11/2020 02:23:20 ',
        description: '-',
      },
      {
        name: 'ND Profile 14',
        agent: 'Java',
        updatedOn: '23/11/2020 02:23:20 ',
        description: '-',
      },
      {
        name: 'ND Profile 14',
        agent: 'Java',
        updatedOn: '23/11/2020 02:23:20 ',
        description: '-',
      },
      {
        name: 'ND Profile 14',
        agent: 'Java',
        updatedOn: '23/11/2020 02:23:20 ',
        description: '-',
      },
      {
        name: 'ND Profile 14',
        agent: 'Java',
        updatedOn: '23/11/2020 02:23:20 ',
        description: '-',
      },
      {
        name: 'ND Profile 14',
        agent: 'Java',
        updatedOn: '23/11/2020 02:23:20 ',
        description: '-',
      },{
        name: 'ND Profile 14',
        agent: 'Java',
        updatedOn: '23/11/2020 02:23:20 ',
        description: '-',
      },
      {
        name: 'ND Profile 14',
        agent: 'Java',
        updatedOn: '23/11/2020 02:23:20 ',
        description: '-',
      },{
        name: 'ND Profile 14',
        agent: 'Java',
        updatedOn: '23/11/2020 02:23:20 ',
        description: '-',
      },
      {
        name: 'ND Profile 14',
        agent: 'Java',
        updatedOn: '23/11/2020 02:23:20 ',
        description: '-',
      },
    ],
  
    tableFilter: false,
  };