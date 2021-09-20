import { KPIPre, KPIData, KPIDCData } from './kpi.model';


export const PRE_KPI_DUMMY_1: KPIPre = {
  autoplay: {
    timer: {
      list: [
        {
          label: '3 Sec',
          value: 3000,
        },
        {
          label: '10 Sec',
          value: 10000,
        },
        {
          label: '15 Sec',
          value: 15000,
        },
        {
          label: '20 Sec',
          value: 20000,
        },
        {
          label: '25 Sec',
          value: 25000,
        },
        {
          label: '30 Sec',
          value: 30000,
        },
      ],
      selected: 3000,
    },
    enabled: false,
    ratio: '1:2',
  },
  panels: [
    {
      label: 'WCS',
      dcs: ['Mosaic_Solr', 'WCS', 'MOSAIC'],
      headers: [
        {
          cols: [
            { label: '1', colspan: 1 },
            { label: '2', colspan: 10 },
            { label: '3', colspan: 3 },
            { label: '4', colspan: 3 },
          ],
        },
        {
          cols: [
            {
              label: '1',
            },
            {
              label: '1',
              valueField: '{DC}.data1_{TIER}.data1_1.data1_1_1.value',
            },
            {
              label: '2',
              valueField: 'field2',
            },
            {
              label: '3',
              valueField: 'field3',
            },
            {
              label: '4',
              valueField: 'field4',
            },
            {
              label: '5',
              valueField: 'field5',
            },
            {
              label: '6',
              valueField: 'field6',
            },
            {
              label: '7',
              valueField: 'field7',
            },
            {
              label: '8',
              valueField: 'field8',
            },
            {
              label: '9',
              valueField: 'field9',
            },
            {
              label: '10',
              valueField: 'field9',
            },
            {
              label: '1',
              valueField: 'field1',
            },
            {
              label: '2',
              valueField: 'field2',
            },
            {
              label: '3',
              valueField: 'field3',
            },
            {
              label: '1',
              valueField: 'field2',
            },
            {
              label: '2',
              valueField: 'field3',
            },
            {
              label: '3',
              valueField: 'field3',
            },
          ],
        },
      ],
      tiers: [
        'SnBSvc',
        'Solr',
        'CSCUI',
        'Taxware',
        'Taxware',
        'AccSvc',
        'CncSvc',
      ],
      zones: [],
    },
    {
      label: 'Mosaic_Solr',
      dcs: ['Mosaic_Solr', 'WCS', 'MOSAIC'],
      headers: [
        {
          cols: [
            { label: '1', colspan: 1 },
            { label: '2', colspan: 4 },
            { label: '3', colspan: 2 },
            { label: '4', colspan: 2 },
          ],
        },
        {
          cols: [
            { label: '1', rowspan: 2 },
            { label: '2', colspan: 1 },
          ],
        },
        {
          cols: [
            {
              label: '1',
              valueField: '{DC}.data1_{ZONE}.data1_{TIER}.data1_1_1.value',
            },
            {
              label: '2',
              valueField: 'field2',
            },
            {
              label: '3',
              valueField: 'field3',
            },
            {
              label: '1',
              valueField: 'field1',
            },
            {
              label: '1',
              valueField: 'field1',
            },
            {
              label: '2',
              valueField: 'field2',
            },
            {
              label: '1',
              valueField: 'field2',
            },
            {
              label: '2',
              valueField: 'field3',
            },
          ],
        },
      ],
      tiers: [
        'SnBSvc',
        'Solr',
        'CSCUI',
        'Taxware',
        'Taxware',
        'AccSvc',
        'CncSvc',
      ],
      zones: ['green'],
    },
    {
      label: 'MosaicAccount',
      dcs: ['MOSAIC', 'MOSAIC_dummy1'],
      headers: [
        {
          cols: [
            { label: '1', colspan: 1 },
            { label: '2', colspan: 4 },
            { label: '3', colspan: 2 },
            { label: '4', colspan: 2 },
          ],
        },
        {
          cols: [
            { label: '1', rowspan: 2 },
            { label: '2', colspan: 1 },
          ],
        },
        {
          cols: [
            {
              label: '1',
              valueField: '{DC}.data1_{ZONE}.data1_{TIER}.data1_1_1.value',
            },
            {
              label: '2',
              valueField: 'field2',
            },
            {
              label: '3',
              valueField: 'field3',
            },
            {
              label: '1',
              valueField: 'field1',
            },
            {
              label: '1',
              valueField: 'field1',
            },
            {
              label: '2',
              valueField: 'field2',
            },
            {
              label: '1',
              valueField: 'field2',
            },
            {
              label: '2',
              valueField: 'field3',
            },
          ],
        },
      ],
      tiers: ['SnBUI', 'SnBSvc', 'CncUI', 'cncSvc', 'AccUI'],
      zones: ['green', 'blue'],
    },
    {
      label: 'MOSAIC',
      dcs: ['MOSAIC_dummy1'],
      headers: [
        {
          cols: [
            { label: '1', colspan: 1 },
            { label: '2', colspan: 4 },
            { label: '3', colspan: 2 },
            { label: '4', colspan: 2 },
          ],
        },
        {
          cols: [
            { label: '1', rowspan: 2 },
            { label: '2', colspan: 1 },
          ],
        },
        {
          cols: [
            {
              label: '1',
              valueField: '{DC}.data1_{ZONE}.data1_{TIER}.data1_1_1.value',
            },
            {
              label: '2',
              valueField: 'field2',
            },
            {
              label: '3',
              valueField: 'field3',
            },
            {
              label: '1',
              valueField: 'field1',
            },
            {
              label: '1',
              valueField: 'field1',
            },
            {
              label: '2',
              valueField: 'field2',
            },
            {
              label: '1',
              valueField: 'field2',
            },
            {
              label: '2',
              valueField: 'field3',
            },
          ],
        },
      ],
      tiers: ['SnBUI', 'SnBSvc', 'CncUI', 'cncSvc', 'AccUI'],
      zones: ['green', 'blue', 'pink'],
    },
    {
      label: 'MOSAIC Dummy',
      dcs: ['MOSAIC_dummy1'],
      headers: [
        {
          cols: [
            { label: '1', colspan: 1 },
            { label: '2', colspan: 4 },
            { label: '3', colspan: 2 },
            { label: '4', colspan: 2 },
          ],
        },
        {
          cols: [
            { label: '1', rowspan: 2 },
            { label: '2', colspan: 1 },
          ],
        },
        {
          cols: [
            {
              label: '1',
              valueField: '{DC}.data1_{ZONE}.data1_{TIER}.data1_1_1.value',
            },
            {
              label: '2',
              valueField: 'field2',
            },
            {
              label: '3',
              valueField: 'field3',
            },
            {
              label: '1',
              valueField: 'field1',
            },
            {
              label: '1',
              valueField: 'field1',
            },
            {
              label: '2',
              valueField: 'field2',
            },
            {
              label: '1',
              valueField: 'field2',
            },
            {
              label: '2',
              valueField: 'field3',
            },
          ],
        },
      ],
      tiers: ['SnBUI', 'SnBSvc', 'CncUI', 'cncSvc', 'AccUI'],
      zones: ['green', 'blue', 'pink', 'red'],
    }
  ],
  dcs: [
    {
      name: 'string',
      tr: 'string',
      zones: [
        {
          name: 'green',
          selected: true,
        },
      ],
      url: 'string',
      tiers: [
        {
          name: 'string',
          dc: 'string',
        },
      ],
    },
  ],
  orderRevenue: {
    channels: {
      headers: [
        {
          cols: [
            {
              label: 'Platform',
              colspan: 2,
            },
          ],
        },
      ],
      data: [
        {
          cols: [
            {
              label: 'Mobile',
              rowspan: 5,
              icon: 'icons8 icons8-touchscreen',
            },
          ],
        },
        {
          cols: [
            {
              label: 'm.com',
            },
          ],
        },
        {
          cols: [
            {
              label: 'Tablet',
            },
          ],
        },
        {
          cols: [
            {
              label: 'iPhone',
            },
          ],
        },
        {
          cols: [
            {
              label: 'Android',
            },
          ],
        },
        {
          cols: [
            {
              label: 'Web Store',
              icon: 'icons8 icons8-online-shop',
              colspan: 2,
            },
          ],
        },
        {
          cols: [
            {
              label: 'Kiosk',
              icon: 'icons8 icons8-self-service-kiosk',
              colspan: 2,
            },
          ],
        },
        {
          cols: [
            {
              label: 'CSC',
              icon: 'icons8 icons8-bookmark',
              colspan: 2,
            },
          ],
        },
        {
          cols: [
            {
              label: 'Total',
              colspan: 2,
              classes: 'text-bold',
            },
          ],
        },
      ],
    },
    duration: {
      list: [
        {
          label: 'Last 15 mins',
          value: 'last_15_mins',
        },
        {
          label: 'Last 4 hours',
          value: 'last_4_hours',
        },
        {
          label: 'Today',
          value: 'today',
        },
        {
          label: 'This Week',
          value: 'this_week',
        },
        {
          label: 'Custom',
          value: 'custom',
        },
      ],
      selected: ['last_15_mins', 'last_4_hours', 'today'],
    },
    dc: 'string'
  },
  refreshInterval: 0,
  graphical: 'string',
};

export const PRE_KPI_DUMMY_2: KPIPre = {
  autoplay: {
    timer: {
      list: [
        {
          label: '3 Sec',
          value: 3000,
        },
        {
          label: '5 Sec',
          value: 5000,
        },
      ],
      selected: 3000,
    },
    enabled: false,
    ratio: '1:2',
  },
  panels: [
    {
      label: 'WCS',
      dcs: ['Mosaic_Solr'],
      headers: [
        {
          cols: [
            { label: '1', colspan: 1 },
            { label: '2', colspan: 10 },
          ],
        },
        {
          cols: [
            {
              label: '1',
            },
            {
              label: '1',
              valueField: '{DC}.{TIER}_data.var.value',
            },
            {
              label: '2',
              valueField: 'field2',
            },
            {
              label: '3',
              valueField: 'field3',
            },
            {
              label: '4',
              valueField: 'field4',
            },
            {
              label: '5',
              valueField: 'field5',
            },
            {
              label: '6',
              valueField: 'field6',
            },
            {
              label: '7',
              valueField: 'field7',
            },
            {
              label: '8',
              valueField: 'field8',
            },
            {
              label: '9',
              valueField: 'field9',
            },
            {
              label: '10',
              valueField: 'field9',
            },
          ],
        },
      ],
      tiers: [
        'SnBSvc',
        'Solr',
        'CSCUI',
      ],
      zones: [],
    },
    {
      label: 'MosaicAccount',
      dcs: ['MOSAIC'],
      headers: [
        {
          cols: [
            { label: '1', colspan: 1 },
            { label: '2', colspan: 4 },
          ],
        },
        {
          cols: [
            { label: '1', rowspan: 2 },
            { label: '2', colspan: 1 },
          ],
        },
        {
          cols: [
            {
              label: '1',
              valueField: '{DC}.{TIER}_data_{ZONE}.var.value',
            },
            {
              label: '2',
              valueField: 'field2',
            },
            {
              label: '3',
              valueField: 'field3',
            },
            {
              label: '1',
              valueField: 'field1',
            },
          ],
        },
      ],
      tiers: ['SnBUI', 'SnBSvc'],
      zones: ['green', 'blue'],
    },
    {
      label: 'MosaicAccountSingle',
      dcs: ['MOSAIC'],
      headers: [
        {
          cols: [
            {
              label: '1',
              valueField: '{DC}.{TIER}_data_{ZONE}.var.value',
            },
            {
              label: '2',
              valueField: 'field2',
            },
            {
              label: '3',
              valueField: 'field3',
            },
            {
              label: '4',
              valueField: 'field1',
            },
          ],
        },
      ],
      tiers: ['SnBUI', 'SnBSvc'],
      zones: []
    },
  ],
  dcs: [
    {
      name: 'Mosaic_Solr',
      tr: 'string',
      zones: [],
      url: 'string',
      tiers: [
        {
          name: 'SnBSvc',
          dc: 'Mosaic_Solr',
        },
      ],
    },
    {
      name: 'WCS',
      tr: 'string',
      zones: [
        {
          name: 'green',
          selected: true,
        },
        {
          name: 'blue',
          selected: true,
        },
      ],
      url: 'string',
      tiers: [
        {
          name: 'Solr',
          dc: 'WCS',
        },
      ],
    },
    {
      name: 'MOSAIC',
      tr: 'string',
      zones: [
        {
          name: 'green',
          selected: true,
        },
        {
          name: 'blue',
          selected: true,
        },
      ],
      url: 'string',
      tiers: [
        {
          name: 'SnBUI',
          dc: 'MOSAIC',
        },
      ],
    },
  ],
  orderRevenue: {
    channels: {
      headers: [
        {
          cols: [
            {
              label: 'Platform',
              colspan: 2,
            },
          ],
        },
      ],
      data: [
        {
          cols: [
            {
              label: 'Mobile',
              rowspan: 5,
              icon: 'icons8 icons8-touchscreen',
            },
          ],
        },
        {
          cols: [
            {
              label: 'm.com',
            },
          ],
        },
        {
          cols: [
            {
              label: 'Tablet',
            },
          ],
        },
        {
          cols: [
            {
              label: 'iPhone',
            },
          ],
        },
        {
          cols: [
            {
              label: 'Android',
            },
          ],
        },
        {
          cols: [
            {
              label: 'Web Store',
              icon: 'icons8 icons8-online-shop',
              colspan: 2,
            },
          ],
        },
        {
          cols: [
            {
              label: 'Kiosk',
              icon: 'icons8 icons8-self-service-kiosk',
              colspan: 2,
            },
          ],
        },
        {
          cols: [
            {
              label: 'CSC',
              icon: 'icons8 icons8-bookmark',
              colspan: 2,
            },
          ],
        },
        {
          cols: [
            {
              label: 'Total',
              colspan: 2,
              classes: 'text-bold',
            },
          ],
        },
      ],
    },
    duration: {
      list: [
        {
          label: 'Last 5 Minutes',
          value: 'Last_5_Minutes'
        },
        {
          label: 'Last 1 Hour',
          value: 'Last_1_Hour'
        },
        {
          label: 'Today',
          value: 'Today'
        }
      ],
      selected: [
        'Last_5_Minutes',
        'Last_1_Hour',
        'Today'
      ]
    },
    dc: 'Mosaic_Solr'
  },
  refreshInterval: 0,
  graphical: 'string',
};


export const KPI_DATA_DUMMY: any = {
  SnBSvc_data: {
    var: {
      value: 255
    }
  },
  SnBUI_data_green: {
    var: {
      value: 255
    }
  }
};

export const KPI_ORDER_REVENUE_DATA: any = {
  headers: [
    {
      cols: [
        {
          label: 'Orders',
          value: 'orderValue',
          classes: 'text-center',
        },
        {
          label: 'Revenue',
          value: 'revenueValue',
          classes: 'text-center',
        },
      ],
    },
  ],
  data: [
    {
      orderValue: 151,
      revenueValue: 2000,
      dataClasses: 'align-right',
    },
    {
      orderValue: 23,
      revenueValue: 343,
    },
    {
      orderValue: 76,
      revenueValue: 5252,
    },
    {
      orderValue: 42,
      revenueValue: 4341,
    },
    {
      orderValue: 5553,
      revenueValue: 203,
    },
    {
      orderValue: 1070,
      revenueValue: 500,
    },
    {
      orderValue: 842,
      revenueValue: 4320,
    },
    {
      orderValue: 842,
      revenueValue: 4320,
    },
  ],
};
