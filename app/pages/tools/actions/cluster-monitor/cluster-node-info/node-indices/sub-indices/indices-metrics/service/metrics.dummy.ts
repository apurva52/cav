import { IndicesMetricsData } from './metrics.model';

export const METRICS_INDICES_DATA: IndicesMetricsData = {
  indicesMetricsStats: [
    {
      label: 'Documents',
      value: '5',
    },
    {
      label: 'Primary State',
      value: '161',
    },
    {
      label: 'Total Size',
      value: '161',
    },
    {
      label: 'Total Shards',
      value: '33',
    },
  ],
  indicesMetricsHealth: {
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
  indicesMetricsDocuments: {
    headers: [
      {
        cols: [
          {
            label: 'Label',
            valueField: 'label',
            filter: {
              isFilter: true,
              type: 'contains',
            },
          },
          {
            label: 'Value',
            valueField: 'value',
            classes: 'text-right',
            filter: {
              isFilter: true,
              type: 'contains',
            },
          },
        ],
      },
    ],
    data: [
      {
        label: 'Documents',
        value: '5',
      },
      {
        label: 'Max Documents',
        value: '0',
      },
      {
        label: 'Deleted Documents',
        value: '0',
      },
      {
        label: 'Primary Size',
        value: '0',
      },
      {
        label: 'Total Size',
        value: '0',
      },
    ],
  },
};
