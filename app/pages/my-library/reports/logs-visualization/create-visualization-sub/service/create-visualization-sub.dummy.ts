import { CreateVisualizationData } from './create-visualization-sub.model';

export const CREATE_VISUALIZATION_SUB_DATA: CreateVisualizationData = {

  storeTier: [
    {
      label: 'LRM Maintenance',
      value: '',
    },
    {
      label: 'Cavisson Maintenance 2',
      value: '',
    },
    {
      label: 'LRM Maintenance',
      value: '',
    },
    {
      label: 'Cavisson Maintenance 2',
      value: '',
    },
    {
      label: 'LRM Maintenance',
      value: '',
    },
    {
      label: 'Cavisson Maintenance 2',
      value: '',
    },
    {
      label: 'LRM Maintenance',
      value: ''
    },
    {
      label: 'Cavisson Maintenance 2',
      value: ''
    },
  ],
  autocompleteData: [
    { "name": "All" },
    { "name": "Basic" },
  ],
  layoutTable :{
    headers: [
      {
        cols: [
          {
            label: 'Name',
            valueField: 'name',
            classes: 'text-left',
            iconField: true,
            filter: {
              isFilter: true,
              type:'contains'
          },
          },
        ],
      },
    ],
    data: [
      {
        name:"Area Chart",
        icon: 'icons8-area-chart',
      },
      {
        name:"Data Table",
        icon: 'icons8 icons8-table',
      },
      {
        name:"Gauge",
        icon: 'icons8-dashboard',
      },
      {
        name:"Line Chart",
        icon: 'icons8 icons8-line-chart',
      },
      // {
      //   name:"Markdown Widget",
      //   icon: 'icons8 icons8-line-chart',
      // },
      // {
      //   name:"Metric",
      //   icon: 'icons8 icons8-line-chart',
      // },
      {
        name:"Pie Chart",
        icon: 'las-chart-pie-solid',
      },
      // {
      //   name:"Time series",
      //   icon: 'icons8 icons8-futures',
      // },
      {
        name:"Vertical Bar Chart",
        icon: 'icons8-bar-chart',
      },
      // {
      //   name:"Tile Map",
      //   icon: 'icons8 icons8-futures',
      // }
    ]
  },
  visualizationTable :{
    headers: [
      {
        cols: [
          {
            label: 'Name',
            valueField: 'name',
            classes: 'text-left',
            iconField: true,
            filter: {
              isFilter: true,
              type:'contains'
          },
          },
        ],
      },
    ],
    data: [
      {
        name:"Logs",
        icon: 'icons8 icons8-futures',
      },
      {
        name:"New Report",
        icon: 'icons8 icons8-line-chart',
      },
      {
        name:"LRM Report",
        icon: 'icons8 icons8-futures',
      },
      {
        name:"Cavisson Report",
        icon: 'icons8 icons8-futures',
      },
      {
        name:"AAA",
        icon: 'icons8 icons8-line-chart',
      },
      {
        name:"PQR",
        icon: 'icons8 icons8-line-chart',
      },
      {
        name:"XYA",
        icon: 'icons8 icons8-line-chart',
      },
      {
        name:"Cavisson3(Admin)",
        icon: 'icons8 icons8-futures',
      },
    ]
  }
    
};
