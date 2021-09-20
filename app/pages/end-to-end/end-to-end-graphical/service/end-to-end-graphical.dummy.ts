import {
  EndToEndEditData,
  EndToEndGraphical,
} from './end-to-end-graphical.model';

export const END_TO_END_GRAPHICAL_DATA: EndToEndGraphical = {
  endToEndGraphicalView: {
    node: [
      {
        transactionScorecard: {
          label: 'Transaction Scorecard',
          transScoreSeverity: [
            {
              label: 'Normal',
              color: '#707070',
              avg: 75,
              data: 166151,
              percentage: 91,
            },
            {
              label: 'Slow',
              avg: 4036,
              color: '#FADADB',
              data: 25,
              percentage: 0,
            },
            {
              label: 'Very Slow',
              avg: 0,
              color: '#F6B4B4',
              data: 0,
              percentage: 0,
            },
            {
              label: 'Errors',
              avg: 4,
              color: '#F04943',
              data: 17338,
              percentage: 9,
            },
          ],
        },
        nodeHealthInfo: [
          {
            label: 'Alerts',
            nodeHealthData: [
              {
                label: 'Minor',
                color: '#FADADB',
                value: '0',
                propValue: 0,
                percentage: 56,
              },
              {
                label: 'Major',
                color: '#F6B4B4',
                value: '0',
                propValue: 0,
                percentage: 24,
              },
              {
                label: 'Critical',
                color: '#F04943',
                value: '0',
                propValue: 0,
                percentage: 20,
              },
            ],
          },
          {
            label: 'Business Health',
            nodeHealthData: [
              {
                label: 'Normal',
                color: '#707070',
                value: '0',
                propValue: 0,
                percentage: 56,
              },
              {
                label: 'Major',
                color: '#F6B4B4',
                value: '0',
                propValue: 0,
                percentage: 24,
              },
              {
                label: 'Critical',
                color: '#F04943',
                value: '0',
                propValue: 0,
                percentage: 20,
              },
            ],
          },
          {
            label: 'Server Health',
            nodeHealthData: [
              {
                label: 'Normal',
                color: '#707070',
                value: '0',
                propValue: 0,
                percentage: 56,
              },
              {
                label: 'Major',
                color: '#F6B4B4',
                value: '0',
                propValue: 0,
                percentage: 24,
              },
              {
                label: 'Critical',
                color: '#F04943',
                value: '0',
                propValue: 0,
                percentage: 20,
              },
            ],
          },
          {
            label: 'Integration Point Health',
            nodeHealthData: [
              {
                label: 'Normal',
                color: '#707070',
                value: '0',
                propValue: 0,
                percentage: 56,
              },
              {
                label: 'Major',
                color: '#F6B4B4',
                value: '0',
                propValue: 0,
                percentage: 24,
              },
              {
                label: 'Critical',
                color: '#F04943',
                value: '0',
                propValue: 0,
                percentage: 20,
              },
            ],
          },
        ],
        eventAlertCount: 8,
        businessHealthCount: 0,
        serverHealthCount: 1,
        ipHealthCount: 0,
        transactionScorecardCount: 12,
        icon: './assets/icons8-png/icons8-database-100.png',
        nodeName: 'Database',
        from: 'crop',
        to: 'cprod-blue-cscui-prod',
        cpuUtilization: 2,
        avgResTime: 1,
        tps: 2,
        callCount: 69,
        callSec: 21,
        count: 650,
        errorCount: 23,
        errorSec: 56,
        id: 'cprod-blue-cscui-prod-2',
        type: 'outputNode',
        top: 0,
        left: 259.54,
      },
      {
        transactionScorecard: {
          label: 'Transaction Scorecard',
          transScoreSeverity: [
            {
              label: 'Normal',
              color: '#707070',
              avg: 75,
              data: 166151,
              percentage: 91,
            },
            {
              label: 'Slow',
              avg: 4036,
              color: '#FADADB',
              data: 25,
              percentage: 0,
            },
            {
              label: 'Very Slow',
              avg: 0,
              color: '#F6B4B4',
              data: 0,
              percentage: 0,
            },
            {
              label: 'Errors',
              avg: 4,
              color: '#F04943',
              data: 17338,
              percentage: 9,
            },
          ],
        },
        nodeHealthInfo: [
          {
            label: 'Alerts',
            nodeHealthData: [
              {
                label: 'Minor',
                color: '#FADADB',
                value: '0',
                propValue: 0,
                percentage: 56,
              },
              {
                label: 'Major',
                color: '#F6B4B4',
                value: '0',
                propValue: 0,
                percentage: 24,
              },
              {
                label: 'Critical',
                color: '#F04943',
                value: '0',
                propValue: 0,
                percentage: 20,
              },
            ],
          },
          {
            label: 'Business Health',
            nodeHealthData: [
              {
                label: 'Normal',
                color: '#707070',
                value: '0',
                propValue: 0,
                percentage: 56,
              },
              {
                label: 'Major',
                color: '#F6B4B4',
                value: '0',
                propValue: 0,
                percentage: 24,
              },
              {
                label: 'Critical',
                color: '#F04943',
                value: '0',
                propValue: 0,
                percentage: 20,
              },
            ],
          },
          {
            label: 'Server Health',
            nodeHealthData: [
              {
                label: 'Normal',
                color: '#707070',
                value: '0',
                propValue: 0,
                percentage: 56,
              },
              {
                label: 'Major',
                color: '#F6B4B4',
                value: '0',
                propValue: 0,
                percentage: 24,
              },
              {
                label: 'Critical',
                color: '#F04943',
                value: '0',
                propValue: 0,
                percentage: 20,
              },
            ],
          },
          {
            label: 'Integration Point Health',
            nodeHealthData: [
              {
                label: 'Normal',
                color: '#707070',
                value: '0',
                propValue: 0,
                percentage: 56,
              },
              {
                label: 'Major',
                color: '#F6B4B4',
                value: '0',
                propValue: 0,
                percentage: 24,
              },
              {
                label: 'Critical',
                color: '#F04943',
                value: '0',
                propValue: 0,
                percentage: 20,
              },
            ],
          },
        ],
        eventAlertCount: 8,
        businessHealthCount: 0,
        businessHealthMajorCircum: 100,
        businessHealthCriticalCircum: 150,
        serverHealthCount: 1,
        serverHealthMajorCircum: 200,
        serverHealthCriticalCircum: 120,
        ipHealthCount: 0,
        icon: './assets/icons8-png/icons8-java-100.png',
        nodeName: 'Solar Pref',
        cpuUtilization: 2,
        avgResTime: 1,
        tps: 2,
        callCount: 69,
        id: 'cprod-blue-cscui-prod',
        type: 'solarPrefNode',
        top: -22.4588,
        left: 675.199,
      },
    ],
    edge: [
      {
        source: 'cprod-blue-cscui-prod',
        target: 'cprod-blue-cscui-prod-2',
      },
    ],
  },
  endToEndLegend: [
    {
      label: 'Java',
      key: 'all',
      color: '#1d5290',
      selected: true,
      showInLegend: true,
      icon: 'icons8-java',
    },
    {
      label: 'Ldap',
      key: 'critical',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-genealogy',
    },
    {
      label: 'Machine Agent',
      key: 'major',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-computer',
    },
    {
      label: 'Cache',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-database-export',
    },
    {
      label: 'Database',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-database',
    },
    {
      label: 'http',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-globe',
    },
    {
      label: 'Default',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-indeterminate-checkbox',
    },
    {
      label: 'Node Js',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-node-js',
    },
    {
      label: 'PHP',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-php-logo',
    },
    {
      label: 'Python',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-python',
    },
    {
      label: 'Mix Mode',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-shuffle',
    },
    {
      label: 'Go',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-Go', //TODO
    },
    {
      label: '.net',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-.Net', //TODO
    },
    {
      label: 'Jms',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-JMS', //TODO
    },
    {
      label: 'Application Agent Node | Business Health',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-final-state',
    },
    {
      label: 'Machine Agent Node | Server Health',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-circle',
    },
    {
      label: 'Integration Point',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-circled-thin',
    },
    {
      label: 'Normal',
      key: 'minor',
      color: '#707070',
      selected: false,
      showInLegend: true,
      icon: 'icons8-filled-circle',
    },
    {
      label: 'Minor',
      key: 'minor',
      color: '#FADADB',
      selected: false,
      showInLegend: true,
      icon: 'icons8-filled-circle',
    },
    {
      label: 'Major',
      key: 'minor',
      color: '#F6B4B4',
      selected: false,
      showInLegend: true,
      icon: 'icons8-filled-circle',
    },
    {
      label: 'Critical',
      key: 'minor',
      color: '#F04943',
      selected: false,
      showInLegend: true,
      icon: 'icons8-filled-circle',
    },
    {
      label: 'Transaction/sec',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-bar-chart-2',
    },
    {
      label: 'Response Time',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-clock',
    },
    {
      label: 'CPU Utilization',
      key: 'minor',
      color: '#1d5290',
      selected: false,
      showInLegend: true,
      icon: 'icons8-microchip',
    },
  ],
  endToEndMenu: {
    multiDcNodes: [
      {
        label: 'Node All',
        value: 'nodeAll',
      },
      {
        label: 'Node-1',
        value: 'node-1',
      },
      {
        label: 'Node-2',
        value: 'node-2',
      },
    ],
    flowmaps: [
      {
        label: 'Default',
        value: 'default',
      },
      {
        label: 'KIOSKAPP',
        value: 'kioskapp',
      },
      {
        label: 'PNF',
        value: 'pnf',
      },
      {
        label: 'SNB',
        value: 'snb',
      },
      {
        label: 'TVS',
        value: 'tvs',
      },
    ],
    nodes: [
      {
        label: 'Application Agent Node',
        value: 'applicationAgentNode',
        items: [
          { label: 'cprod-blue-cscui-prod', value: 'cprod-blue-cscui-prod' },
          { label: 'cprod-green-cscui-prod', value: 'cprod-green-cscui-prod' },
          { label: 'cprod-blue-hystrix', value: 'cprod-blue-hystrix' },
        ],
      },
      {
        label: 'Integration Point',
        value: 'integrationPoint',
        items: [
          { label: 'HTTP_10.208.30.164', value: 'HTTP_10.208.30.164' },
          {
            label: 'HTTP_inventory.kohls.com',
            value: 'HTTP_inventory.kohls.com',
          },
          {
            label: 'HTTP_oms-services-ordersearch.kohls.com',
            value: 'HTTP_oms-services-ordersearch.kohls.com',
          },
        ],
      },
    ],
    showCallsSettings: [
      {
        label: 'All Connection Calls',
        value: 'allCall',
      },
      {
        label: 'All Connection Calls',
        value: 'allCall',
      },
    ],
    valuesSettings: [
      {
        label: 'Current Value',
        value: 'currentVal',
      },
      {
        label: 'Connection',
        value: 'allCall',
      },
    ],
  },
};

//This Data is for Dropdown when user click on edit button
export const END_TO_END_EDIT_DROPDOWN_OPTIONS: EndToEndEditData = {
  dropdownOptions: {
    transactionPerSecond: [
      {
        label: 'All',
        value: 'Seconds',
      },
      {
        label: 'Seconds',
        value: 'Seconds',
      },
      {
        label: 'Seconds',
        value: 'Seconds',
      },
      {
        label: 'Seconds',
        value: 'Seconds',
      },
      {
        label: 'Seconds',
        value: 'Seconds',
      },
    ],
    responseTime: [
      {
        label: 'All',
        value: 'Time',
      },
      {
        label: 'Time',
        value: 'Time',
      },
      {
        label: 'Time',
        value: 'Time',
      },
      {
        label: 'Time',
        value: 'Time',
      },
      {
        label: 'Time',
        value: 'Time',
      },
    ],
    cpuUtilization: [
      {
        label: 'All',
        value: 'CPU',
      },
      {
        label: 'CPU',
        value: 'CPU',
      },
      {
        label: 'CPU',
        value: 'CPU',
      },
      {
        label: 'CPU',
        value: 'CPU',
      },
      {
        label: 'CPU',
        value: 'CPU',
      },
    ],
    tierSearch: [
      {
        label: 'Cavisson Server1',
        value: 'cs1',
      },
      {
        label: 'Cavisson Server2',
        value: 'cs2',
      },
      {
        label: 'Cavisson Server3',
        value: 'cs3',
      },
      {
        label: 'Cavisson Server4',
        value: 'cs4',
      },
      {
        label: 'Cavisson Server5',
        value: 'cs5',
      },
      {
        label: 'Cavisson Server6',
        value: 'cs6',
      },
      {
        label: 'Cavisson Server7',
        value: 'cs7',
      },
      {
        label: 'Cavisson Server8',
        value: 'cs8',
      },
    ],
  },
};
