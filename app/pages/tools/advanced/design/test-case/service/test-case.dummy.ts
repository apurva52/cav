import { Table } from "src/app/shared/table/table.model";

export const TEST_CASE_TABLE: Table = {

    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [10, 20, 30, 50, 100],
    },
  
    headers: [  
      {
        cols: [
          {
            label: 'Project',
            valueField: 'project',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,           
          },
          {
            label: 'Sub Project',
            valueField: 'subProject',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Test Case',
            valueField: 'testCase',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true ,       
          },
          {
            label: 'Scenario',
            valueField: 'scenario',
            classes: 'text-center',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
            width:'20%'  
          },
          {
            label: 'Description',
            valueField: 'description',
            classes: 'text-center',
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
        project: '1',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '2',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '3',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '4',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '5',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '6',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '7',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '8',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '9',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '10',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '11',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '12',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '13',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '14',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '15',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '16',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '17',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '18',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '19',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '20',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '21',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '22',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '23',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '24',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '25',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '26',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
      {
        project: '27',
        subProject: '184.104.0.0',
        testCase: '16',        
        scenario: '184.105.0.0',
        description: '184.105.0.0',
        
        
      },
    ],
  
    tableFilter: true,
  };