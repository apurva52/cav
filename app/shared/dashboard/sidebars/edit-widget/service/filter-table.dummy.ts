import { InfoData } from 'src/app/shared/dialogs/informative-dialog/service/info.model';
import { FilterTable, WidgetSettingsDropDownData } from './filter-table.model';

export const CONTENT: InfoData = {
  title: 'Error',
  information: 'Not a valid condition.',
  button: 'Ok'
}

export const FILTER_TABLE: FilterTable = {
  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [10, 20, 30, 50, 100],
  },

  headers: [
    {
      cols: [
        {
          label: '#',
          valueField: 'number',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: false,
            type: 'contains',
          },
          isSort: false,
        },
        {
          label: 'Graph Name',
          valueField: 'graph',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: false,
            type: 'contains',
          },
          isSort: false,
        },
        {
          label: 'Operator Type',
          valueField: 'operator',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: false,
            type: 'contains',
          },
          isSort: false,
        },
        {
          label: 'First Filter Value',
          valueField: 'filterValue1',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: false,
            type: 'contains',
          },
          isSort: false,
        },
        {
          label: 'Second Filter Value',
          valueField: 'filterValue2',
          classes: 'text-left',
          selected: true,
          filter: {
            isFilter: false,
            type: 'contains',
          },
          isSort: false,
        },
        {
          label: 'Actions',
          valueField: 'icon1' + 'icon2',
          classes: 'text-center',
          selected: true,
          filter: {
            isFilter: false,
            type: 'contains',
          },
          isSort: false,
          iconField: true,
        },
      ],
    },
  ],
  data: [
    {
      number: 1,
      graph: 'Hello',
      operator: '<= 123',
      filterValue1: 12,
      filterValue2: 23,
      icon1: 'icons8-delete-trash',
      icon2: 'icons8-edit-2',
    },
  ],

  iconsField: 'icon',
};


export const WIDGET_SETTING_DROPDOWN_DATA: WidgetSettingsDropDownData = {

  dataSourceOptions: [
    { label: 'Log', value: 'log' },
    { label: 'Metric', value: 'metric' },
    
  ],

  widgetTypeOptions: [
    {
      label: 'Graph',
      value: 'graph',
    },
    {
      label: 'Data',
      value: 'data',
    },
    {
      label: 'Tabular',
      value: 'tabular',
    },
    {
      label: 'System Health',
      value: 'system_health',
    },
    {
      label: 'Label',
      value: 'label',
    },
  ],

  graphTypeOptions: [
    {
      label: 'Normal Graph',
      value: 'normal_graph',
    },
    {
      label: 'Percentile Graph',
      value: 'percentile_graph',
    },
    {
      label: 'Slab Count Graph',
      value: 'slab_count_graph',
    },
    {
      label: 'Category Graph',
      value: 'category_graph',
    }
    // },
    // {
    //   label: 'Correlated Graph',
    //   value: 'correlated_graph',
    // },
  ],

  chartTypeDataOptions: [
    {
      label: 'Area',
      value: 'area',
    },
    {
      label: 'Bar',
      value: 'bar',
    },
    {
      label: 'Donut',
      value: 'donut',
    },
    {
      label: 'Dial',
      value: 'dial',
    },
    {
      label: 'Line',
      value: 'line',
    },
    {
      label: 'Meter',
      value: 'meter',
    },
    {
      label: 'Pie',
      value: 'pie',
    },
    
    {
      label: 'Stacked Area',
      value: 'stacked_area',
    },
    {
      label: 'Stacked Bar',
      value: 'stacked_bar',
    },
    
    {
      label: 'Dual Axis Line',
      value: 'dual_axis_line',
      disabled: true
    },
    {
      label: 'Dual Axis Bar Line',
      value: 'dual_axis_bar_line',
      disabled: true
    },
    {
      label: 'Dual Axis Area Line',
      value: 'dual_axis_area_line',
      disabled: true
    },
    {
      label: 'Dual Axis Line Stacked Bar',
      value: 'dual_axis_stacked_bar',
      disabled: true
    },
    {
      label: 'Line Stacked Bar',
      value: 'line_stacked_bar',
      disabled: true
    },
    {
      label: 'Geo Map',
      value: 'geo_map',
      disabled: true
    },
    {
      label: 'Geo Map Extended',
      value: 'geo_map_extended',
      disabled: true
    },
  ],

  categoryTypeDataOptions :[
    {
      label: 'Stacked Area',
      value: 'stacked_area',
    },
    {
      label: 'Stacked Bar',
      value: 'stacked_bar',
    },

  ],

  corelatedTypeDataOPrions:[
    {
      label: 'Line',
      value: 'line',
    },
    {
      label: 'Bar',
      value: 'bar',
    },
    {
      label: 'Area',
      value: 'area',
    }
  ],

  normalChartTypeDataOptions: [
    {
      label: 'Area',
      value: 'area',
    },
    {
      label: 'Bar',
      value: 'bar',
    },
    {
      label: 'Donut',
      value: 'donut',
    },
    {
      label: 'Dial',
      value: 'dial',
    },
    {
      label: 'Line',
      value: 'line',
    },
    {
      label: 'Meter',
      value: 'meter',
    },
    {
      label: 'Pie',
      value: 'pie',
    },
    
    {
      label: 'Stacked Area',
      value: 'stacked_area',
    },
    {
      label: 'Stacked Bar',
      value: 'stacked_bar',
    },
    {
      label: 'Dual Axis Line',
      value: 'dual_axis_line',
      disabled: true
    },
    {
      label: 'Dual Axis Bar Line',
      value: 'dual_axis_bar_line',
      disabled: true
    },
    {
      label: 'Dual Axis Area Line',
      value: 'dual_axis_area_line',
      disabled: true
    },
    {
      label: 'Dual Axis Line Stacked Bar',
      value: 'dual_axis_stacked_bar',
      disabled: true
    },
    {
      label: 'Line Stacked Bar',
      value: 'line_stacked_bar',
      disabled: true
    },
    {
      label: 'Geo Map',
      value: 'geo_map',
      disabled: true
    },
    {
      label: 'Geo Map Extended',
      value: 'geo_map_extended',
      disabled: true
    },
  ],
  dataFieldOptions: [
    { label: 'Average', value: 'avg' },
    { label: 'Last Sample', value: 'lastSample' },
    { label: 'Maximum', value: 'max' },
    { label: 'Minimum', value: 'min' },
    { label: 'Sample Count', value: 'count' },
    { label: 'Standard Deviation', value: 'stdDev' },
    { label:'Sum', value: 'sum' },
    { label: 'Vector Count', value: 'vector_count' },
   
  ],
   
    
    
 

  tableTypeDataOptions: [
    { label: 'Graph Stats Based', value: 'graph_stats_based' },
    { label: 'Vector Based', value: 'vector_based' },
  ],

  formulaTypeDataOptions: [
    { label: 'Min', value: 'minimum' },
    { label: 'Max', value: 'maximum' },
    { label: 'Avg', value: 'average' },
    { label: 'Count', value: 'count' },
    { label: 'Sum Count', value: 'sum_count' }

  ],

  FieldDataOptions: [
    { label: 'Average', value: 'avg' },
    { label: 'Last Sample', value: 'lastSample' },
    { label: 'Maximum', value: 'max' },
    { label: 'Minimum', value: 'min' },
    { label: 'Sample Count', value: 'count' },
    { label: 'Standard Deviation', value: 'stdDev' },
  ],

     

  // drillDownOptions : [
  //   { label: 'Test_Fav', value: 'Test_Fav' },
  //   { label: 'Testing_Favorite', value: 'Testing_Favorite' },
  // ],

  basedOnPercentileOptions: [
    { label: '99', value: '99' },
    { label: '95', value: '95' },
    { label: '90', value: '90' },
    { label: '80', value: '80' },
    { label: '70', value: '70' },

  ],

  basedOnSlabOptions: [
    { label: '1', value: '1' },
    { label: '2', value: '2' },
    { label: '3', value: '3' },
    { label: '4', value: '4' },
    { label: '5', value: '5' },
    { label: '6', value: '6' },
    { label: '7', value: '7' },
    { label: '8', value: '8' },
    { label: '9', value: '9' },
    { label: '10', value: '10' }
  ],

  operatorOptions: [
    {label:'Select operator', value: 'Select operator'},
    { label: '>', value: '>' },
    { label: '<', value: '<' },
    { label: '>=', value: '>=' },
    { label: '<=', value: '<=' },
  ],

  fontFamilyOptions: [
    { label: 'Arial', value: 'Arial' },
    { label: 'Calibri', value: 'Calibri' },
    { label: 'Cambria', value: 'Cambria' },
    { label: 'Courier', value: 'Courier' },
    { label: 'Courier-BoldOblique', value:'Courier-BoldOblique'},
    { label: 'Helvetica', value: 'Helvetica' },
    { label: 'Helvetica-BoldOblique', value:  'Helvetica-BoldOblique' },
    { label: "'Montserrat',sans-serif", value: 'Montserrat,sans-serif' },
    { label: "'Noto Sans',sans-serif", value: 'Noto Sans,sans-serif' },
    { label: "'Open Sans',sans-serif", value: 'Open Sans,sans-serif' },
    { label: "'Poppins',sans-serif", value: 'Poppins,sans-serif' },
    { label: 'Roboto', value: 'Roboto' },
    { label: 'Times-Roman', value: 'times_roman' }
  ],

  fontSizeOptions: [
    { label: '8', value: '8' },
    { label: '10', value: '10' },
    { label: '12', value: '12' },
    { label: '14', value: '14' },
    { label: '15', value: '15' },
    { label: '16', value: '16' },
    { label: '18', value: '18' },
    { label: '20', value: '20' },
    { label: '22', value: '22' },
  ],
  gridLineOptions: [
    { label: '0', value: '0' },
    { label: '0.2', value: '0.2' },
    { label: '0.4', value: '0.4' },
    { label: '0.6', value: '0.6' },
    { label: '0.8', value: '0.8' },
    { label: '1', value: '1' },
    { label: '1.2', value: '1.2' },
    { label: '1.4', value: '1.4' },
    { label: '1.6', value: '1.6' },
    { label: '1.8', value: '1.8' },
    { label: '2', value: '2' },
  ],

  compareTrendOptions: [
    { label: 'Daily Trends', value: 'daily_trends' },
    { label: 'Fixed Trend', value: 'fixed_trends' },
    { label: 'Weekly Trends', value: 'weekly_trends' }
    
  ],


  queryTypeOptions: [
    { label: 'Custom Query', value: 'custom_query' },
    { label: 'Saved Query', value: 'saved_query' },
  ],

  legendPositionOptions: [
    { label: 'Bottom', value: 'center' },
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
  ],

  indexPatternDataOptions: [],

  environmentTypeOptions: [],

  valueLabelOptions: [{ label: 'Number', value: '' }, { label: 'Rational Number', value: '' }],

  decimalOptions: [{ label: '-100', value: '' }, { label: '-200', value: '' }],

  graphNameOptions:[
    { label: '', value: '' },
  ],

  criteriaSampleData: [
    { label: 'Exclude', value: 'Exclude' },
    { label: 'Include', value: 'Include' },
    
  ],

  filterBySampleData: [
    { label: 'Avg', value: 'Avg' },
    { label: 'Count', value: 'Count' },
    { label: 'Max', value: 'Max' },
    { label: 'Min', value: 'Min' },
   
   
  ],

  opratersSampleData: [
    { label: '=', value: '=' },
    // { label: '>', value: '>' },
    // { label: '<', value: '<' },
    { label: '>=', value: '>=' },
    { label: '<=', value: '<=' },
    { label: 'Bottom', value: 'Bottom' },
    { label: 'In-Between', value: 'In-Between' },
    { label: 'Top', value: 'Top' },
  ],

  sampleFilterOperatorOptions:[
    { label: '>=', value: '>=' },
    { label: '<=', value: '<=' },
    { label: 'In-Between', value: 'In-Between' },
  ],

  valueSampleData: [
    { label: 'Avg', value: 'avg' },
    { label: 'Min', value: 'min' },
    { label: 'Max', value: 'max' },
    { label: 'Count', value: 'count' },
    { label: 'SumCount', value: 'sumCount' }
  ],

  dialMeterOperatorOptions: [
    { label: '>', value: '>' },
    { label: '<', value: '<' },
    ],

    criticalhealthSeverityOptions :[
      {label:'Select operator', value: 'Select operator'},
      { label: 'Critical', value: 'Critical' },
      { label: 'Major', value: 'Major' }
    ],

    geoMapValueOptions : [
      { label: 'By Avg Value', value: '0' },
      { label: 'By Last Value', value: '1' },
      { label: 'By Max Value', value: '2' }
    ],
    geoMapColorBandOptions : [
      { label: 'Green To Red', value: '0' },
      { label: 'Red To Green', value: '1' }
    ],

    criticalhealthSeverityOperators:[
      {label:'Select operator', value: 'Select operator'},
      { label: 'AND', value: '&&' },
      { label: 'OR', value: '||' }
    ],
    majorhealthSeverityOptions : [
      { label: 'Critical', value: 'Critical' },
      { label: 'Major', value: 'Major' },
      {label:'Select operator', value: 'Select operator'},
     
    ],
    majorhealthSeverityOperators :[
      {label:'Select operator', value: 'Select operator'},
      { label: 'AND', value: '&&' },
      { label: 'OR', value: '||' }
    ]
  }

  export  const monoChromaticColorList = [
    {
    border: "3px solid black",
    id: "1",
    shades : ["#5c0202", "#850505", "#a90606", "#ce0707", "#e27474", "#e45959", "#e63f3f", "#e92828", "#ef0505"]
    },
    {
    border: "Opx solid black",
    id: "2",
    shades :  ["#122501", "#1c3b01", "#2a5802", "#387603", "#458f04", "#5cc005", "#71e909", "#81c784", "#8de73f"]
    },
    {
    border: "Opx solid black",
    id: "3",
    shades :  ["#263238", "#37474f", "#455a64", "#607d8b", "#90a4ae", "#b0bec5", "#b0bec5", "#bdbdbd", "#cfd8dc"]
    },
    {
    border: "Opx solid black",
    id: "4",
    shades:["#02a2f9", "#1565c0", "#1a237e", "#3178ef", "#3f51b5", "#67cbbf", "#9fa8da", "#b3e5df", "#b3e5fc"]
    }
]
