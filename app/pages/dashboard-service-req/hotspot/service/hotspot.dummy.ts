import { HotspotData } from './hotspot.model';

export const HOTSPOT_DUMMY: HotspotData = {
  panels: [
    {
      paginator: {
        first: 1,
        rows: 33,
        rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
      },
      tableFilter: false,

      label: 'Hotspot Summary (Total Hotspot: 10)',
      collapsed: false,
      menuOption: false,
      headers: [
        {
          cols: [
            {
              label: 'Thread ID',
              valueField: 'field1',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
            },
            {
              label: 'Thread Name',
              valueField: 'field2',
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
            },
            {
              label: 'Tier',
              valueField: 'field3',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
            },
            {
              label: 'Instance',
              valueField: 'field4',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
            },
            {
              label: 'Hotspot Entry Time',
              valueField: 'field5',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
            },
            {
              label: 'Hotspot Duration',
              valueField: 'field6',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
            },
            {
              label: 'Total Hotspot Duration',
              valueField: 'field7',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
            },
            {
              label: 'Thread State',
              valueField: 'field8',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
            },
            {
              label: 'Thread Priority',
              valueField: 'field9',
              selected: true,
              filter: {
                isFilter: true,
                type: 'contains',
              },
              isSort: true,
            },
            {
              label: 'Stack Depth',
              valueField: 'field10',
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
          field1: '9878767656',
          field2: 'Event Dispatch Thread',
          field3: 'MultiDCPerf1',
          field4: 'Instance14',
          field5: '03/31/20 23:21:48',
          field6: '20,391',
          field7: '20,391',
          field8: 'Running',
          field9: '4',
          field10: '1',
        },
        {
          field1: '9878767656',
          field2: 'Event Dispatch Thread',
          field3: 'MultiDCPerf2',
          field4: 'Instance14',
          field5: '03/31/20 23:21:48',
          field6: '20,391',
          field7: '20,391',
          field8: 'Running',
          field9: '4',
          field10: '1',
        },
        {
          field1: '9878767656',
          field2: 'Event Dispatch Thread',
          field3: 'MultiDCPerf',
          field4: 'Instance14',
          field5: '03/31/20 23:21:48',
          field6: '20,391',
          field7: '20,391',
          field8: 'Running',
          field9: '4',
          field10: '1',
        },
        {
          field1: '9878767656',
          field2: 'Event Dispatch Thread',
          field3: 'MultiDCPerf',
          field4: 'Instance14',
          field5: '03/31/20 23:21:48',
          field6: '20,391',
          field7: '20,391',
          field8: 'Running',
          field9: '4',
          field10: '1',
        },
        {
          field1: '9878767656',
          field2: 'Event Dispatch Thread',
          field3: 'MultiDCPerf',
          field4: 'Instance14',
          field5: '03/31/20 23:21:48',
          field6: '20,391',
          field7: '20,391',
          field8: 'Running',
          field9: '4',
          field10: '1',
        },
      ],
      charts: [
        {
          title: 'Pie Chart',
          highchart: {
            chart: {
              type: 'pie',
            },
            title: null,
            tooltip: {
              pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>',
            },
            plotOptions: {
              pie: {
                size: '70%',
                borderWidth: 0,
                dataLabels: {
                  enabled: true,
                  format: '<b>{point.percentage:.1f} %',
                },
              },
            },
            series: [
              {
                name: 'Brands',
                colorByPoint: true,
                data: [
                  {
                    name: 'Chrome',
                    y: 61.41,
                  },
                  {
                    name: 'Internet Explorer',
                    y: 11.84,
                  },
                  {
                    name: 'Firefox',
                    y: 10.85,
                  },
                  {
                    name: 'Edge',
                    y: 4.67,
                  },
                  {
                    name: 'Safari',
                    y: 4.18,
                  },
                  {
                    name: 'Sogou Explorer',
                    y: 1.64,
                  },
                  {
                    name: 'Opera',
                    y: 1.6,
                  },
                  {
                    name: 'QQ',
                    y: 1.2,
                  },
                  {
                    name: 'Other',
                    y: 2.61,
                  },
                ],
              },
            ] as Highcharts.SeriesOptionsType[],
          },
        },
        {
          title: 'Bar Chart',
          highchart: {
            chart: {
              type: 'bar',
            },
            title: {
              text: null,
            },
            xAxis: {
              visible: true,
              title: {
                text: 'StackDept',
              },
            },
            yAxis: {
              min: 0,
              title: {
                text: 'Count',
                align: 'middle',
              },
              labels: {
                overflow: 'justify',
              },
            },
            tooltip: {
              headerFormat: '{series.name}: ',
              pointFormat: '<b>{point.y}</b>',
            },
            plotOptions: {
              bar: {
                dataLabels: {
                  enabled: false,
                },
              },
            },
            legend: {
              enabled: false,
              layout: 'vertical',
              align: 'right',
              verticalAlign: 'top',
              x: -40,
              y: 80,
              floating: true,
              borderWidth: 1,
              backgroundColor: '#FFFFFF',
              shadow: true,
            },
            credits: {
              enabled: false,
            },
            series: [
              {
                name: 'Count',
                data: [10,],
              },
            ] as Highcharts.SeriesOptionsType[],
          },
        },
      ],
    },
    // {
    //   paginator: {
    //     first: 1,
    //     rows: 33,
    //     rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
    //   },
    //   tableFilter: false,
    //   label:
    //     'Thread StackTrace (Thread Id: 33795, HotSpot EntryTime:03/31/20 23:21:48, Hotspot Duration: 20.391 seconds )',
    //   collapsed: true,
    //   menuOption: true,
    //   headers: [
    //     {
    //       cols: [
    //         {
    //           label: 'Method',
    //           valueField: 'field1',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Class',
    //           valueField: 'field2',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Line',
    //           valueField: 'field3',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Source File',
    //           valueField: 'field4',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Elapsed Time',
    //           valueField: 'field5',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Frame',
    //           valueField: 'field6',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //       ],
    //     },
    //   ],
    //   data: [
    //     {
    //       field1: 'getAddressesFromNameService',
    //       field2: 'java.net.InetAddress',
    //       field3: '1311',
    //       field4: 'InetAddress.java',
    //       field5: '>20107',
    //       field6: '70',
    //     },
    //     {
    //       field1: 'getAddressesFromNameService',
    //       field2: 'java.net.InetAddress',
    //       field3: '1311',
    //       field4: 'InetAddress.java',
    //       field5: '>20107',
    //       field6: '70',
    //     },
    //     {
    //       field1: 'getAddressesFromNameService',
    //       field2: 'java.net.InetAddress',
    //       field3: '1311',
    //       field4: 'InetAddress.java',
    //       field5: '>20107',
    //       field6: '70',
    //     },
    //   ],
    // },
    // {
    //   paginator: {
    //     first: 1,
    //     rows: 33,
    //     rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
    //   },
    //   tableFilter: false,
    //   label:
    //     'Integration Point Call(s) (Thread Id: 120, Hotspot EntryTime: 03/31/20 23:21:48, Hotspot Duration: 20,107 seconds)',
    //   collapsed: true,
    //   menuOption: false,
    //   headers: [
    //     {
    //       cols: [
    //         {
    //           label: 'Integration Point',
    //           valueField: 'field1',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Discovered IP Name',
    //           valueField: 'field2',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Type',
    //           valueField: 'field3',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Total Duration',
    //           valueField: 'field4',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Average Duration',
    //           valueField: 'field5',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Max Duration',
    //           valueField: 'field6',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Min Duration',
    //           valueField: 'field7',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Total Count',
    //           valueField: 'field8',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Min Count',
    //           valueField: 'field9',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Max Count',
    //           valueField: 'field10',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Error(s)',
    //           valueField: 'field11',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Avg Network Delay',
    //           valueField: 'field12',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //         {
    //           label: 'Total Network Delay',
    //           valueField: 'field13',
    //           selected: true,
    //           filter: {
    //             isFilter: true,
    //             type: 'contains',
    //           },
    //           isSort: true,
    //         },
    //       ],
    //     },
    //   ],
    //   data: [
    //     {
    //       field1: 'sdas',
    //       field2: '24.23354',
    //       field3: 'HTTP',
    //       field4: '1,093 ',
    //       field5: '1,093',
    //       field6: '2568.191',
    //       field7: '3244.123',
    //       field8: '1',
    //       field9: '1',
    //       field10: '0',
    //       field11: '4',
    //       field12: '4',
    //       field13: '1',
    //     },
    //     {
    //       field1: 'sdas',
    //       field2: '24.23354',
    //       field3: 'HTTP',
    //       field4: '1,093 ',
    //       field5: '1,093',
    //       field6: '2568.191',
    //       field7: '3244.123',
    //       field8: '1',
    //       field9: '1',
    //       field10: '0',
    //       field11: '4',
    //       field12: '4',
    //       field13: '1',
    //     },
    //     {
    //       field1: 'sdas',
    //       field2: '24.23354',
    //       field3: 'HTTP',
    //       field4: '1,093 ',
    //       field5: '1,093',
    //       field6: '2568.191',
    //       field7: '3244.123',
    //       field8: '1',
    //       field9: '1',
    //       field10: '0',
    //       field11: '4',
    //       field12: '4',
    //       field13: '1',
    //     },
    //     {
    //       field1: 'sdas',
    //       field2: '24.23354',
    //       field3: 'HTTP',
    //       field4: '1,093 ',
    //       field5: '1,093',
    //       field6: '2568.191',
    //       field7: '3244.123',
    //       field8: '1',
    //       field9: '1',
    //       field10: '0',
    //       field11: '4',
    //       field12: '4',
    //       field13: '1',
    //     },
    //   ],
    // },
  ],

  
};
