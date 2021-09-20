import { EndToEnd } from './end-to-end.model';

export const END_TO_END_DATA: EndToEnd = {
  endToEndTableView: {
    paginator: {
      first: 0,
      rows: 10,
      rowsPerPageOptions: [10, 20, 40, 80, 100],
    },
    headers: [
      {
        cols: [
          {
            label: 'From',
            valueField: 'from',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'To',
            valueField: 'to',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'TPS/CPS',
            valueField: 'tps_cps',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Res Time',
            valueField: 'resTime',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'CPU (%)',
            valueField: 'cpu',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type: 'contains',
            },
            isSort: true,
          },
          {
            label: 'Count',
            valueField: 'callCount',
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
          from: 'cprod-blue-cscui-prod',
          to: '',
          tps_cps: '43',
          resTime: '32',
          cpu: '0',
          callCount: '25',
        },
        children: [
          {
            data: {
              from: '',
              to: 'HTTP_10.208.121.116_443',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'HTTP_10.208.12.17_80',
              tps_cps: '1.122',
              resTime: '23.572',
              cpu: '0',
              callCount: '16086',
            },
          },
        ],
      },
      {
        data: {
          from: 'cprod-green-cscui-prod',
          to: '',
          tps_cps: '43',
          resTime: '32',
          cpu: '0',
          callCount: '25',
        },
        children: [
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
        ],
      },
      {
        data: {
          from: 'cprod-blue-hystrix',
          to: '',
          tps_cps: '43',
          resTime: '32',
          cpu: '0',
          callCount: '25',
        },
        children: [
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
        ],
      },
      {
        data: {
          from: 'CC-W-CA-Fremont-HE1',
          to: '',
          tps_cps: '43',
          resTime: '32',
          cpu: '0',
          callCount: '25',
        },
        children: [
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
        ],
      },
      {
        data: {
          from: 'CC-W-CA-Fremont-HE1',
          to: '',
          tps_cps: '43',
          resTime: '32',
          cpu: '0',
          callCount: '25',
        },
        children: [
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '40',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '41',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
        ],
      },
      {
        data: {
          from: 'CC-W-CA-Fremont-HE1',
          to: '',
          tps_cps: '3',
          resTime: '32',
          cpu: '0',
          callCount: '0',
        },
        children: [
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '40',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '49',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
        ],
      },
      {
        data: {
          from: 'CC-W-CA-Fremont-HE1',
          to: '',
          tps_cps: '49',
          resTime: '32',
          cpu: '0',
          callCount: '25',
        },
        children: [
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '49',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '49',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
        ],
      },
      {
        data: {
          from: 'CC-W-CA-Fremont-HE1',
          to: '',
          tps_cps: '48',
          resTime: '32',
          cpu: '0',
          callCount: '25',
        },
        children: [
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '48',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '48',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
        ],
      },
      {
        data: {
          from: 'CC-W-CA-Fremont-HE1',
          to: '',
          tps_cps: '48',
          resTime: '32',
          cpu: '0',
          callCount: '25',
        },
        children: [
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '48',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '48',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
        ],
      },
      {
        data: {
          from: 'CC-W-CA-Fremont-HE1',
          to: '',
          tps_cps: '48',
          resTime: '32',
          cpu: '0',
          callCount: '25',
        },
        children: [
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '48',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '48',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '48',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
        ],
      },
      {
        data: {
          from: 'CC-W-CA-Fremont-HE1',
          to: '',
          tps_cps: '48',
          resTime: '32',
          cpu: '0',
          callCount: '25',
        },
        children: [
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
        ],
      },
      {
        data: {
          from: 'CC-W-CA-Fremont-HE1',
          to: '',
          tps_cps: '43',
          resTime: '32',
          cpu: '0',
          callCount: '25',
        },
        children: [
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
        ],
      },
      {
        data: {
          from: 'CC-W-CA-Fremont-HE1',
          to: '',
          tps_cps: '43',
          resTime: '32',
          cpu: '0',
          callCount: '25',
        },
        children: [
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
          {
            data: {
              from: '',
              to: 'CC-W-CA-Fremont-HE1',
              tps_cps: '43',
              resTime: '32',
              cpu: '0',
              callCount: '25',
            },
          },
        ],
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
  },
};
