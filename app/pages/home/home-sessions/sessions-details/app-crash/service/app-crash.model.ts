import { Table } from "src/app/shared/table/table.model";
export interface CrashKey {
    keys: string;
    values: any;
}

export const PANEL_DUMMY: any = {
    panels: [
        { label: '', collapsed: false },
        { label: '', collapsed: false },
    ],
};

export const CRASH_DETAIL_DATA: Table = {

    headers: [
        {
            cols: [
                {
                    label: '',
                    valueField: 'keys',
                    classes: 'text-left',
                    isSort: true,
                    selected: true,
                    width: '20%'
                },
                {
                    label: '',
                    valueField: 'values',
                    classes: 'text-left',
                    isSort: true,
                    selected: true
                }
            ],
        },
    ],
    data: [
        {
            keys: 'Crash Time',
            values: ''
        },
        {
            keys: 'Exception Name',
            values: ''
        },
        {
            keys: 'Crash File',
            values: ''
        },
        {
            keys: 'Crash Reason',
            values: ''
        }
    ],
};

export const REQUEST_HEADERS_DATA: Table = {

    headers: [
        {
            cols: [
                {
                    label: '',
                    valueField: 'keys',
                    classes: 'text-left',
                    isSort: true,
                    selected: true,
                    width: '20%'
                },
                {
                    label: '',
                    valueField: 'values',
                    classes: 'text-left',
                    isSort: true,
                    selected: true
                }
            ],
        },
    ],
    data: [
        {
            keys: 'Application Name',
            values: ''
        },
        {
            keys: 'Channel',
            values: 'Desktop'
        },
        {
            keys: 'Session Duration',
            values: '00:00:01'
        },
        {
            keys: 'Platform',
            values: 'Android'
        },
        {
            keys: 'Location',
            values: 'India'
        },
        {
            keys: 'Application Version',
            values: ''
        },
        {
            keys: 'Segment',
            values: 'Android'
        },
        {
            keys: 'View Count',
            values: ''
        },
        {
            keys: 'Manufacturer',
            values: ''
        },
        {
            keys: 'Session Start Time',
            values: '17:07:51 11/20/19'
        }
    ],
};

export const CRASH_INFO_DATA: Table = {

    headers: [
        {
            cols: [
                {
                    label: '',
                    valueField: 'keys',
                    classes: 'text-left',
                    isSort: true,
                    selected: true,
                    width: '40%'
                },
                {
                    label: '',
                    valueField: 'values',
                    classes: 'text-left',
                    isSort: true,
                    selected: true
                }
            ],
        },
    ],
    data: [
    ]
};