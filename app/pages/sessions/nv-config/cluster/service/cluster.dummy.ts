import { Table } from "src/app/shared/table/table.model";

export const CLUSTER_DATA: Table = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 20, 50, 100],
    },


    headers: [
        {
            cols: [
                {
                    label: 'Name',
                    valueField: 'name',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true
                },
                {
                    label: 'HPD',
                    valueField: 'hpd',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true
                },
                {
                    label: 'TOMCAT',
                    valueField: 'tomcat',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true
                },
                {
                    label: 'CMON_PORT',
                    valueField: 'cmonPort',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    width:'10%'
                },
                {
                    label: 'Weights',
                    valueField: 'weights',
                    classes: 'text-left',
                    isSort: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                    },
                    selected: true,
                    width:'10%'
                }
            ],
        },
    ],
    data: [
        {
            name: 'MainActivity',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },

        {
            name: 'QuestionActivity',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'QuizMainActivity',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'ECOMMMainActivity',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'ActivityCart',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'ActivityCheckout',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        },
        {
            name: 'Others',
            hpd: 'Url Regular Expression',
            tomcat: '/(com.android.attendence.activity.MainActivity)',
            cmonPort: '-',
            weights: '-'
        }
    ],
};
