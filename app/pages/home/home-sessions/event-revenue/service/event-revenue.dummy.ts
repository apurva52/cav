import { Table } from "src/app/shared/table/table.model";


export const EVENT_REVENUE_TABLE: Table = {
    headers: [
        {
            cols: [
                {
                    label: 'Page',
                    valueField: 'page',
                    classes: 'text-left',
                    selected: true,
                    width:'90px'
                },
                    
                {
                    label: 'Total Session',
                    valueField: 'etotal',
                    classes: 'text-left',
                    selected: true,
                    width:'110px'
                },
                    
                {
                    label: 'Conversion Rate',
                    valueField: 'cre',
                    classes: 'text-left',
                    selected: true,
                    width:'140px'
                },
                {
                    label: 'Est. Revenue Loss($)',
                    valueField: 'ocr',
                    classes: 'text-left',
                    selected: true,
                    width:'165px'
                },
                {
                    label: 'Bounce Rate',
                    valueField: 'ebr',
                    classes: 'text-left',
                    selected: true,
                    width: '120px'
                },
                
            ],
        },
    ],
    data: [
        

    ],
};