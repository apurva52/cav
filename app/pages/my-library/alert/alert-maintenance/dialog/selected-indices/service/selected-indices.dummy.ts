import { MetricIndices } from 'src/app/shared/derived-metric/derived-metric-indices/service/metric-indices.model';
import { IndicesTable } from './selected-indices.model';

export const INDICES_TABLE_DATA: IndicesTable = {

  paginator: {
    first: 1,
    rows: 10,
    rowsPerPageOptions: [5, 10, 25, 50, 100],
  },

  headers: [
    {
      cols: [
        
      ],
    },
  ],
  data: [
   
  ],
  
  tableFilter: false,
};

export const METRIC_DROPDOWN_DATA: MetricIndices = {
  tire: [
    {
      label: 'Tire',
      value: 'tire'
    },
    {
      label: 'Tire1',
      value: 'tire1'
    },
    {
      label: 'Tire2',
      value: 'tire2'
    }
  ],
  instance: [
    {
      label: 'Instance',
      value: 'Instance'
    },
    {
      label: 'Instance',
      value: 'Instance'
    },
    {
      label: 'Instance',
      value: 'Instance'
    }
  ],
  server: [
    {
      label: 'Server',
      value: 'Server'
    },
    {
      label: 'TiServerre1',
      value: 'Server'
    },
    {
      label: 'Server',
      value: 'Server'
    }
  ],
  pages: [
    {
      label: 'Pages',
      value: 'Pages'
    },
    {
      label: 'Pages',
      value: 'Pages'
    },
    {
      label: 'Pages',
      value: 'Pages'
    }
  ]
}
