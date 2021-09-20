import { Table } from "src/app/shared/table/table.model";


export const EVENT_DEFINITION_TABLE: Table = {

    paginator: {
        first: 1,
        rows: 10,
        rowsPerPageOptions: [10, 25, 50, 100],
    },
   
    headers: [
        {
            cols: [
                {
                    label: 'Event Id',
                    valueField: 'eventId',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Event Name',
                    valueField: 'eventName',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                    width: '10%'
                },
                {
                    label: 'Attribute Name',
                    valueField: 'attributeName',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Filter',
                    valueField: 'filter',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Base',
                    valueField: 'base',
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
                    width: '10%'
                },
            ],
        },
    ],
    data: [
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },
        {
            eventId: '1',
            eventName: 'Data Monitor Invalid Data',
            attributeName: 'Server,Gdf,Vector',
            filter: 'Filter with time',
            base: '900000',
            description: 'General events of different monitors'
        },

    ],
};