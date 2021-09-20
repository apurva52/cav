import { TierTable, ProjectTable, AdvancedTable} from './capability.model';

export const TIER_TABLE_DATA: TierTable = {

  
    headers: [
      {
        cols: [
          {
            label: 'Servers',
            valueField: 'name',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'20%'
          },
          {
            label: 'Permission Type',
            valueField: 'type',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'30%'
          },
         
          
       
        ],
      },
    ],
    data: [
      {
        name: '23',
        type: 'Read / Write'
     
      },
      {
        name: '23',
        type: 'Read / Write'
     
      },
      {
        name: '23',
        type: 'Read / Write'
     
      },
      {
        name: '23',
        type: 'Read / Write'
     
      }
      
    ],
  
    tableFilter: true,
  };


  export const PROJECT_TABLE_DATA: ProjectTable = {

  
    headers: [
      {
        cols: [
          {
            label: 'Projects',
            valueField: 'name',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'20%'
          },
          {
            label: 'Project Type',
            valueField: 'type',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'25%'
          },
          {
            label: 'Permission',
            valueField: 'permission',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'30%'
          }
         
          
       
        ],
      },
    ],
    data: [
      {
        name: '23',
        type: 'All',
        permission: 'Read / Write'
     
      },
      {
        name: '23',
        type: 'All',
        permission: 'Read / Write'
     
      },
      {
        name: '23',
        type: 'All',
        permission: 'Read / Write'
     
      },
      {
        name: '23',
        type: 'All',
        permission: 'Read / Write'
     
      }
      
    ],
  
    tableFilter: true,
  };


  export const ADVANCED_TABLE_DATA: AdvancedTable = {

  
    headers: [
      {
        cols: [
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
            width:'20%'
          },
          {
            label: 'Component',
            valueField: 'component',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'25%'
          },
          {
            label: 'Permission',
            valueField: 'permission',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'30%'
          }
         
          
       
        ],
      },
    ],
    data: [
      {
        type: '23',
        component: 'All',
        permission: 'Read / Write'
     
      },
      {
        type: '23',
        component: 'All',
        permission: 'Read / Write'
     
      },
      {
        type: '23',
        component: 'All',
        permission: 'Read / Write'
     
      },
      {
        type: '23',
        component: 'All',
        permission: 'Read / Write'
     
      }
      
    ],
  
    tableFilter: true,
  };