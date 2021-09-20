import { UserSegmentRuleTable } from "./rule.model";



export const RULE_TABLE: UserSegmentRuleTable = {

    options: [{
        label: 'Last 30 Minutes', value: 'Last 30 Minutes'
    }],


    paginator: {
        first: 0,
        rows: 5,
        rowsPerPageOptions: [5, 10, 25, 50, 100],
    },


    headers: [
        {
            cols: [
                {
                    label: 'Type',
                    valueField: 'rtype',
                    classes: 'text-left',
                    isSort: true,
                    selected: true,
                    width: '19%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },

                },
                {
                    label: 'Name',
                    valueField: 'arg1',
                    classes: 'text-left',
                    isSort: true,
                    selected: true,
                    width: '19%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                },
                {
                    label: 'Value',
                    valueField: 'arg2',
                    classes: 'text-left',
                    isSort: true,
                    selected: true,
                    width: '19%',
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                },
                {
                    label: '',
                    valueField: 'icon',
                    classes: 'text-center',
                    isSort: false,
                    selected: true,
                    width: '5%',
                    filter: {
                        isFilter: false,
                        type: 'contains',
                    },
                    iconField: true,
                },


            ],
        },
    ],
    data: [
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },
        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },

        {
            type: 'cookie',
            name: 'A',
            value: 'a',
            accessStatus: 'granted',
        },

    ],
    tableFilter: true,
};