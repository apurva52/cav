import { NodeDiagnostics } from './node-diagnostics.model';

export const NODE_MONITOR_DATA: NodeDiagnostics = {
  nodeDiagnosticsStats: [
    {
      label: 'Nodes',
      value: '2',
      severityColor: '#707070'
    },
    {
      label: 'Total Shards',
      value: '161',
      severityColor: '#F04943'
    },
    {
      label: 'Successful Shards',
      value: '161',
      severityColor: '#707070'
    },
    {
      label: 'Indices',
      value: '33',
      severityColor: '#FADADB'
    },
    {
      label: 'Documents',
      value: '11732654',
      severityColor: '#707070'
    },
    {
      label: 'Size',
      value: '48.0GB',
      severityColor: '#F6B4B4'
    },
  ],
  nodeSummary: {
    headers: [
      {
        cols: [
          {
            label: 'Label',
            valueField: 'label',
            classes: 'text-center',
          },
          {
            label: 'Value',
            valueField: 'value',
            classes: 'text-right',
            statusField: false,
          },
        ],
      },
    ],
    data: [
      {
        label: 'Status',
        value: 'Normal',
        stats: false,
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Store Size',
        value: '2.0 GB',
      },
      {
        label: 'Index Req Total',
        value: '2.0 GB',
      }

    ],
    statsField: 'stats',
  },
  nodeFileSystem: {
    headers: [
      {
        cols: [
          {
            label: 'Label',
            valueField: 'label',
            classes: 'text-center',
          },
          {
            label: 'Value',
            valueField: 'value',
            classes: 'text-right',
            statusField: false,
          },
        ],
      },
    ],
    data: [
      {
        label: 'Status',
        value: 'Normal',
        stats: false,
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Store Size',
        value: '2.0 GB',
      },
      {
        label: 'Index Req Total',
        value: '2.0 GB',
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
    ],
    statsField: 'stats',
  },
  nodeIndexActivity: {
    headers: [
      {
        cols: [
          {
            label: 'Label',
            valueField: 'label',
            classes: 'text-center',
          },
          {
            label: 'Value',
            valueField: 'value',
            classes: 'text-right',
            statusField: true,
          },
        ],
      },
    ],
    data: [
      {
        label: 'Status',
        value: 'Normal',
        stats: true,
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Store Size',
        value: '2.0 GB',
      },
      {
        label: 'Index Req Total',
        value: '2.0 GB',
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
    ],
    statsField: 'stats',
  },
  nodeMemory: {
    headers: [
      {
        cols: [
          {
            label: 'Label',
            valueField: 'label',
            classes: 'text-center',
          },
          {
            label: 'Value',
            valueField: 'value',
            classes: 'text-right',
            statusField: false,
          },
        ],
      },
    ],
    data: [
      {
        label: 'Status',
        value: 'Normal',
        stats: false,
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Store Size',
        value: '2.0 GB',
      },
      {
        label: 'Index Req Total',
        value: '2.0 GB',
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
      {
        label: 'Document Deleted',
        value: '2.0 GB',
      },
    ],
    statsField: 'stats',
  },
};
