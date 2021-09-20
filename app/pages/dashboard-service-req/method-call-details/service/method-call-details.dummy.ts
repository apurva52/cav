import { MethodCallDetailsData } from './method-call-details.model';

export const METHOD_CALL_DETAILS_TABLE: MethodCallDetailsData = {
  treeTable: {

    packages: [
      {
        label: 'abc',
        value: 'abc'
      },
      {
        label: 'abc1',
        value: 'abc1'
      },
      {
        label: 'abc2',
        value: 'abc2'
      }
    ],
    classes: [
      {
        label: 'abc',
        value: 'abc'
      },
      {
        label: 'abc1',
        value: 'abc1'
      },
      {
        label: 'abc2',
        value: 'abc2'
      }
    ],
    methods: [
      {
        label: 'abc',
        value: 'abc'
      },
      {
        label: 'abc1',
        value: 'abc1'
      },
      {
        label: 'abc2',
        value: 'abc2'
      }
    ],

    paginator: {
      first: 1,
      rows: 10,
      rowsPerPageOptions: [ 10, 25, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'Methods',
            valueField: 'methods',
            classes: 'text-left',
            severityColorField: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Elapsed Time',
            valueField: 'elapsedTime',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Wall Time',
            valueField: 'wallTime',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Percentage',
            valueField: 'percentage',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'CPU Time',
            valueField: 'cpu',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Thread Queue',
            valueField: 'threadQueue',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Self Time',
            valueField: 'selfTime',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Thread ID',
            valueField: 'threadId',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Thread',
            valueField: 'thread',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Arguments',
            valueField: 'arguments',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Instance',
            valueField: 'instance',
            classes: 'text-left',
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
          data: {
            methods: 'CC-W-CA-Fremont-HE1',
            elapsedTime: '76',
            wallTime: '0',
            percentage: '3.241%',
            cpu: '0',
            threadQueue: '2589.191',
            selfTime: '2589.191',
            threadId: '1',
            thread: '1',
            arguments: '4',
            instance: '0',
            severityBgColorField: '#337ABA'
          },
          children: [
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
              children: [
                {
                  data: {
                    methods: 'CC-W-CA-Fremont-HE1',
                    elapsedTime: '76',
                    wallTime: '0',
                    percentage: '3.241%',
                    cpu: '0',
                    threadQueue: '2589.191',
                    selfTime: '2589.191',
                    threadId: '1',
                    thread: '1',
                    arguments: '4',
                    instance: '0',
                  },
                  children: [
                    {
                      data: {
                        methods: 'CC-W-CA-Fremont-HE1',
                        elapsedTime: '72',
                        wallTime: '0',
                        percentage: '3.241%',
                        cpu: '0',
                        threadQueue: '2589.191',
                        selfTime: '2589.191',
                        threadId: '1',
                        thread: '1',
                        arguments: '4',
                        instance: '0',
                      },
                    }
                  ]
                }
              ]
            },
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE5',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
          ],
        },
        {
          data: {
            methods: 'CC-W-CA-Fremont-HE2',
            elapsedTime: '76',
            wallTime: '0',
            percentage: '3.241%',
            cpu: '0',
            threadQueue: '2589.191',
            selfTime: '2589.191',
            threadId: '1',
            thread: '1',
            arguments: '4',
            instance: '0',
            severityBgColorField: '#FF6B6B'
          },
          children: [
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
          ],
        },
        {
          data: {
            methods: 'CC-W-CA-Fremont-HE1',
            elapsedTime: '76',
            wallTime: '3',
            percentage: '3.241%',
            cpu: '0',
            threadQueue: '2589.191',
            selfTime: '2589.191',
            threadId: '1',
            thread: '1',
            arguments: '4',
            instance: '0',
            severityBgColorField: '#70D6C9'
          },
          children: [
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
          ],
        },
        {
          data: {
            methods: 'CC-W-CA-Fremont-HE1',
            elapsedTime: '76',
            wallTime: '0',
            percentage: '3.241%',
            cpu: '0',
            threadQueue: '2589.191',
            selfTime: '2589.191',
            threadId: '1',
            thread: '1',
            arguments: '4',
            instance: '0',
            severityBgColorField: '#B7EF80'
          },
          children: [
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
              children: [
                {
                  data: {
                    methods: 'CC-W-CA-Fremont-HE1',
                    elapsedTime: '76',
                    wallTime: '0',
                    percentage: '3.241%',
                    cpu: '0',
                    threadQueue: '2589.191',
                    selfTime: '2589.191',
                    threadId: '1',
                    thread: '1',
                    arguments: '4',
                    instance: '0',
                  },
                },
                {
                  data: {
                    methods: 'CC-W-CA-Fremont-HE1',
                    elapsedTime: '76',
                    wallTime: '0',
                    percentage: '3.241%',
                    cpu: '0',
                    threadQueue: '2589.191',
                    selfTime: '2589.191',
                    threadId: '1',
                    thread: '1',
                    arguments: '4',
                    instance: '0',
                  },
                },
              ],
            },
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
              children: [
                {
                  data: {
                    methods: 'CC-W-CA-Fremont-HE1',
                    elapsedTime: '76',
                    wallTime: '0',
                    percentage: '3.241%',
                    cpu: '0',
                    threadQueue: '2589.191',
                    selfTime: '2589.191',
                    threadId: '1',
                    thread: '1',
                    arguments: '4',
                    instance: '0',
                  },
                },
              ],
            },
          ],
        },
        {
          data: {
            methods: 'CC-W-CA-Fremont-HE1',
            elapsedTime: '76',
            wallTime: '0',
            percentage: '3.241%',
            cpu: '0',
            threadQueue: '2589.191',
            selfTime: '2589.191',
            threadId: '1',
            thread: '1',
            arguments: '4',
            instance: '0',
            severityBgColorField: '#D7D7D7'
          },
          children: [
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
          ],
        },
        {
          data: {
            methods: 'CC-W-CA-Fremont-HE1',
            elapsedTime: '76',
            wallTime: '0',
            percentage: '3.241%',
            cpu: '0',
            threadQueue: '2589.191',
            selfTime: '2589.191',
            threadId: '1',
            thread: '1',
            arguments: '4',
            instance: '0',
            severityBgColorField: '#5F5F5F'
          },
          children: [
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
          ],
        },
        {
          data: {
            methods: 'CC-W-CA-Fremont-HE1',
            elapsedTime: '76',
            wallTime: '0',
            percentage: '3.241%',
            cpu: '0',
            threadQueue: '2589.191',
            selfTime: '2589.191',
            threadId: '1',
            thread: '1',
            arguments: '4',
            instance: '0',
          },
          children: [
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
          ],
        },
        {
          data: {
            methods: 'CC-W-CA-Fremont-HE1',
            elapsedTime: '72',
            wallTime: '0',
            percentage: '3.241%',
            cpu: '0',
            threadQueue: '2589.191',
            selfTime: '2589.191',
            threadId: '1',
            thread: '1',
            arguments: '4',
            instance: '0',
          },
          children: [
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
          ],
        },
        {
          data: {
            methods: 'CC-W-CA-Fremont-HE1',
            elapsedTime: '76',
            wallTime: '0',
            percentage: '3.241%',
            cpu: '0',
            threadQueue: '2589.191',
            selfTime: '2589.191',
            threadId: '1',
            thread: '1',
            arguments: '4',
            instance: '0',
          },
          children: [
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
          ],
        },
        {
          data: {
            methods: 'CC-W-CA-Fremont-HE1',
            elapsedTime: '76',
            wallTime: '0',
            percentage: '3.241%',
            cpu: '0',
            threadQueue: '2589.191',
            selfTime: '2589.191',
            threadId: '1',
            thread: '1',
            arguments: '4',
            instance: '0',
          },
          children: [
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
          ],
        },
        {
          data: {
            methods: 'CC-W-CA-Fremont-HE1',
            elapsedTime: '76',
            wallTime: '0',
            percentage: '3.241%',
            cpu: '0',
            threadQueue: '2589.191',
            selfTime: '2589.191',
            threadId: '1',
            thread: '1',
            arguments: '4',
            instance: '0',
          },
          children: [
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
          ],
        },
        {
          data: {
            methods: 'CC-W-CA-Fremont-HE1',
            elapsedTime: '76',
            wallTime: '0',
            percentage: '3.241%',
            cpu: '0',
            threadQueue: '2589.191',
            selfTime: '2589.191',
            threadId: '1',
            thread: '1',
            arguments: '4',
            instance: '0',
          },
          children: [
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
            {
              data: {
                methods: 'CC-W-CA-Fremont-HE1',
                elapsedTime: '76',
                wallTime: '0',
                percentage: '3.241%',
                cpu: '0',
                threadQueue: '2589.191',
                selfTime: '2589.191',
                threadId: '1',
                thread: '1',
                arguments: '4',
                instance: '0',
              },
            },
          ],
        },
      ],

    legend: [
      {
        name: 'HTTP/Thread Callout',
        key: 'all',
        color: '#337ABA',
        selected: true,
        showInLegend: true,
      },
      {
        name: 'UnInstrumented Method',
        key: 'critical',
        color: '#FF6B6B',
        selected: false,
        showInLegend: true,
      },
      {
        name: 'JMS/JDBC Callout',
        key: 'major',
        color: '#70D6C9',
        selected: false,
        showInLegend: true,
      },
      {
        name: 'Method Catching Exceptions',
        key: 'minor',
        color: '#B7EF80',
        selected: false,
        showInLegend: true,
      },
      {
        name: 'Method Throwing Exceptions',
        key: 'minor',
        color: '#F8E062',
        selected: false,
        showInLegend: true,
      },
      {
        name: 'Elapsed Threashold',
        key: 'minor',
        color: '#5F5F5F',
        selected: false,
        showInLegend: true,
      },
      {
        name: 'HighlightWall Time',
        key: 'minor',
        color: '#D7D7D7',
        selected: false,
        showInLegend: true,
      },
    ],
  },
  dataTable:{
    paginator: {
      first: 1,
      rows: 33,
      rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'SequenceNo',
            valueField: 'sequenceno',
            classes: 'text-left',
            selected: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'FlowpathInstance',
            valueField: 'instance',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'LineNo',
            valueField: 'lineno',
            classes: 'text-left',
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
        sequenceno: '76.1',
        instance: '46247678935426711896',
        lineno: '1'
      },
      {
        sequenceno: '76.1',
        instance: '46247678935426711896',
        lineno: '1'
      },
      {
        sequenceno: '76.1',
        instance: '46247678935426711896',
        lineno: '1'
      },
      {
        sequenceno: '76.1',
        instance: '46247678935426711896',
        lineno: '1'
      },
     
   
    ],
  },
  repeatMethodsData:{
    data: [
      {
        sequenceno: '76.1',
        instance: '46247678935426711896',
        lineno: '1'
      },
      {
        sequenceno: '76.1',
        instance: '46247678935426711896',
        lineno: '1'
      },
      {
        sequenceno: '76.1',
        instance: '46247678935426711896',
        lineno: '1'
      },
      {
        sequenceno: '76.1',
        instance: '46247678935426711896',
        lineno: '1'
      },
     
   
    ],
  },
  repeatedCalloutTable:{
    paginator: {
      first: 1,
      rows: 33,
      rowsPerPageOptions: [3, 5, 10, 25, 50, 100],
    },

    headers: [
      {
        cols: [
          {
            label: 'SequenceNo',
            valueField: 'sequenceno',
            classes: 'text-left',
            selected: false,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'FlowpathInstance',
            valueField: 'instance',
            classes: 'text-left',
            selected: true,
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'LineNo',
            valueField: 'lineno',
            classes: 'text-left',
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
   
    ],
  },
  totalQueueTime: '0',
  totalSelfTime:  '0'
};
