import { Table } from "src/app/shared/table/table.model";


export const TEST_SUITE_TABLE: Table = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 25, 50, 100],
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
                    label: 'Test Suite',
                    valueField: 'testSuite',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Modification Date',
                    valueField: 'modificationDate',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Test Case Count',
                    valueField: 'testCaseCount',
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
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },
        {
            project: 'Name1',
            subProject: 'Name1',
            testSuite: 'Network',
            modificationDate: '02:23 PM 23/11/2020',
            testCaseCount: '13',
        },

    ],
};