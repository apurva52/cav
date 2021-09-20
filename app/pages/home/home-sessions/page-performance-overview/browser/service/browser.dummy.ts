import { PageTable } from "./browser.model";

export const PAGE_TABLE: PageTable = {

    paginator: {
        first: 0,
        rows: 5,
        rowsPerPageOptions: [ 5, 10, 25, 50, 100],
    },

    headers: [
        {
            cols: [
                {
                    label: 'Browser Name',
                    field: 'browserall',
                    classes: 'text-left',
                    selected: true,
                    severityColorField: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
			width: '9%',
                    isSort: true,
                },
                {
                    label: 'Page Counts',
                    field: 'pagecount',
                    classes: 'text-center',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                    severity: true,
                    severityColorField: true,
                },
                {
                    label: 'Onload  (Sec)',
                    field: 'timetoload',
                    iconField: true,
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                    //width: '5%'
                },
                {
                    label: 'TTDI  (Sec)',
                    field: 'dominteractivetime',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'TTDL  (Sec)',
                    field: 'domcomplete',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Server Response Time (Sec)',
                    field: 'servertime',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'PRT  (Sec)',
                    field: 'perceivedrendertime',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                   label: 'First Byte Time(sec)',
                   field: 'firstbyte',
                   classes: 'text-left',
                   selected: true,
                   filter: {
                   isFilter: true,
                   type: 'contains',
                   },
                   isSort: true,
                },
                {
                    label: 'DNS  (Sec)',
                    field: 'dnstime',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'SSL  (Sec)',
                    field: 'secure',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Cache Lookup',
                    field: 'cache',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Download (Sec)',
                    field: 'network',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'TCP (Sec)',
                    field: 'connectiontime',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'FCP (Sec)',
                    field: 'first_content_paint_count',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'FP (Sec)',
                    field: 'firstpaint_count',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                  label: 'TTI (Sec)',
                  field: 'time_to_interactive_count',
                  classes: 'text-left',
                  selected: true,
                  filter: {
                      isFilter: true,
                      type: 'contains',
                    },
                  isSort: true,
              },
                {
                    label: 'FID (Sec)',
                    field: 'first_input_delay_count',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                },
                {
                    label: 'Exit PCT',
                    field: 'exitlt',
                    classes: 'text-left',
                    selected: true,
                    filter: {
                        isFilter: true,
                        type: 'contains',
                      },
                    isSort: true,
                }
            ],
        },
    ],
    data: [],

    charts: [
      {
        title: 'Browser Performance Report ',
        highchart: {
          chart: {
            type: 'bar',
            height:'400px'
          },
  
          title: {
            text: null,
          },
         
          xAxis: {
              categories: [],
              title: {
                text: "Browser(s)"
                }
    
          },
          yAxis: {
              min: 0,
              title: {
                  text: 'Value(sec)'
              }
          },
          tooltip: {
            headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
            pointFormat: '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}</b>sec<br/>'
          },
          exporting: {
            enabled: true,
            sourceWidth: 1300,
            sourceHeight: 3000,
        },  
          plotOptions: {
          },
          credits: {
            enabled: false
         },
          legend: {
              layout: 'vertical',
              align: 'right',
              enabled: true,
              verticalAlign: 'middle',
              x: 0,
              y: 0,
          },
          series: [] as Highcharts.SeriesOptionsType[],
        },
      },
    ],


    severityCondition: 'severity',
    tableFilter: true,
};
