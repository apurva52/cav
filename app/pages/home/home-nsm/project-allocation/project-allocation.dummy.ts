//import { Table } from "../../../../../shared/table/table.model";
import { ProjectAllocationTable } from './project-allocation.model';


export const Projectallocation_NAME_DATA: ProjectAllocationTable = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 20, 50, 100],
    },


    headers: [
        {
            cols: [
                {
                    label: 'Select',
                    valueField: 'sl',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                },
                {
                    label: 'SL No',
                    valueField: 'bladename',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                },
                {
                    label: 'Server Name',
                    valueField: 'Bladetype',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                },
                {
                    label: 'Server Ip',
                    valueField: 'team',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                },
                {
                    label: 'Blade Name',
                    valueField: 'project',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                },
                {
                    label: 'Ubuntu',
                    valueField: 'owner',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                },
                {
                    label: 'Type',
                    valueField: 'allocation',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                },
                {
                    label: 'Type',
                    valueField: 'buildversion',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                },
                {
                    label: 'state',
                    valueField: 'BUD',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                },
                {
                    label: 'Allocation',
                    valueField: 'cn',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                },
                {
                    label: 'Shared',
                    valueField: 'cb',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                }, 
                {
                    label: 'Build Version',
                    valueField: 'cb',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                }, 
                {
                    label: 'Bkp Ctrl',
                    valueField: 'cb',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                }, 
                {
                    label: 'Bkp Blade',
                    valueField: 'cb',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                }, 
                {
                    label: 'Upgradation Date',
                    valueField: 'cb',
                    classes: 'text-right',
                    isSort: true,

                    selected: true,
                    width: '5%'
                },
            ],

           
        }
    ],
    data: [
    ],


}