import { ConfigureSidebarData, ConfigureSidebarLoadPayload } from './configure-sidebar.model';


export const CONFIGURE_SIDEBAR_DATA: ConfigureSidebarData = {

  tableData: {
  

    // paginator: {
    //   rows: 10,
    // },

    headers: [
      {
        cols: [
          {
            label: 'Application',
            valueField: 'application',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type:'contains'
            }
          },
          {
            label: 'Tier',
            valueField: 'tier',
            classes: 'text-left',
            filter: {
              isFilter: true,
              type:'contains'
            }
          },
        
        ],
      },
    ],
    data: [
      {
        application: 'Application1',
        tier: 'POC App',
      },
      {
        application: 'Application2',
        tier: 'POC App',
      },
      {
        application: 'Application3',
        tier: 'POC App',
      },
      {
        application: 'Application4',
        tier: 'POC App',
      },
     
      {
        application: 'Application5',
        tier: 'POC App',
      },
      {
        application: 'Application6',
        tier: 'POC App',
      },
      {
        application: 'Application7',
        tier: 'POC App',
      },
      {
        application: 'Application8',
        tier: 'POC App',
      },
      {
        application: 'Application9',
        tier: 'POC App',
      },
      {
        application: 'Application10',
        tier: 'POC App',
      },
      {
        application: 'Application11',
        tier: 'POC App',
      },
      {
        application: 'Application12',
        tier: 'POC App',
      },
      {
        application: 'Application13',
        tier: 'POC App',
      },
      {
        application: 'Application14',
        tier: 'POC App',
      },
      {
        application: 'Application1',
        tier: 'POC App',
      },
      {
        application: 'Application2',
        tier: 'POC App',
      },
      {
        application: 'Application3',
        tier: 'POC App',
      },
      {
        application: 'Application4',
        tier: 'POC App',
      },
     
      {
        application: 'Application5',
        tier: 'POC App',
      },
      {
        application: 'Application6',
        tier: 'POC App',
      },
      {
        application: 'Application7',
        tier: 'POC App',
      },
      {
        application: 'Application8',
        tier: 'POC App',
      },
      {
        application: 'Application9',
        tier: 'POC App',
      },
      {
        application: 'Application10',
        tier: 'POC App',
      },
      {
        application: 'Application11',
        tier: 'POC App',
      },
      {
        application: 'Application12',
        tier: 'POC App',
      },
      {
        application: 'Application13',
        tier: 'POC App',
      },
      {
        application: 'Application14',
        tier: 'POC App',
      }

    ],
  },
  values: {
    tier: [
      { label: 'All', value: 'all' },
      { label: 'Tier1', value: 'Tier1' },
      { label: 'Tier2', value: 'Tier2' },
      { label: 'Tier3', value: 'Tier3' },
      { label: 'Tier4', value: 'Tier4' }
    ],
    front_end_tier: [
      { label: 'All', value: 'all' },
      { label: 'Tier1', value: 'Tier1' },
      { label: 'Tier1', value: 'Tier2' },
      { label: 'Tier1', value: 'Tier3' },
      { label: 'Tier1', value: 'Tier4' }
    ]


  }

};

export const CONFIGURE_SIDEBAR_PAYLOAD: ConfigureSidebarLoadPayload = {
  localDataCtx : {
    fromLocal: true,
    path: "/home/cavisson/work_shankar/webapps/sys/KPI/data/tsdb-dummy.json"
  },
"cctx": {
  "cck": "guest.2861.1611037212681",
  "pk": "guest:192.168.8.219:01-19-2021 00-20-12",
  "prodType": "NetDiagnostics",
  "u": "guest"
},
"dataFilter": [
  0,
  1,
  2,
  3,
  4,
  5
],
"duration": {
  "et": 0,
  "preset": "LIVE1",
  "st": 1611022814718,
  "viewBy": 60
},
"dc": "MosaicAccount",
"appName": "All",
"isAll": false,
"multiDc": false,
"opType": 11,
"storeAlertType": 0,
"tr": 2861
};
