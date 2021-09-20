// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { Store } from 'src/app/core/store/store';

// proxy.conf.json
// Single DC 4434 | Multi DC 5005
// /SINGLE_DC | /MULTI_DC
// https://cc-w-ca-fremont-he-99.cav-test.com:4434  - SINGLE_DC
// https://cc-w-ca-fremont-he-99.cav-test.com:5005
// https://ncmon1.cav-test.com
// https://cc-w-ca-fremont-he-99.cav-test.com
// https://cc-w-ca-fremont-he-99.cav-test.com:8007   - MULTI_DC

export const environment = {
  production: false,
  api: {
    core: {
      base: null,
      defaultBase: '/DashboardServer/v2',
      endpoint: '',
    } as Store.APIConfig,
    session: {
      pre: {
        endpoint: '/web/session/pre',
      },
      login: {
        endpoint: '/acl/session/login',
      },
      changePassword: {
        endpoint: '/acl/session/changepassword',
      },
      logout: {
        endpoint: '/acl/session/logout',
      },
      forceLogout: {
        endpoint: '/acl/session/logout/force',
      },
      validate: {
        endpoint: '/acl/session/validate',
      },
      dataCenters: {
        endpoint: '/web/session/data-centers',
      },
    } as Store.APIConfigGroup,

    logs: {
      msearch: {
        endpoint: '/web/logmonitor/getdata'
      },
      aggdata: {
        endpoint: '/web/logmonitor/getdata'
      },
      fieldsdata: {
        endpoint: '/web/logmonitor/getdata'
      },
      initialsettings: {
        endpoint: '/web/logmonitor/getdata'
      },
      updatesettings: {
        endpoint: '/web/logmonitor/getdata'
      },

    } as Store.APIConfigGroup,
    help: {
      load: {
        endpoint: '/web/help/content',
      },
    } as Store.APIConfigGroup,
    dashboard: {
      load: {
        endpoint: '/web/dashboard/load',
      },
      update: {
        endpoint: '/web/dashboard/update',
      },
      list: {
        endpoint: '/web/dashboard/list',
      },
      graph: {
        endpoint: '/web/metrictree/graph',
      },
      group: {
        endpoint: '/web/metrictree/group',
      },
      hierarchical: {
        endpoint: '/web/metrictree/hierarchical',
      },
      metaData: {
        endpoint: '/web/dashboard/metaData',
      },
      openRelatedCatalouge: {
        endpoint: '/web/dashboard/saveRelatedCatalogue',
      },
      tree: {
        endpoint: '/web/metrictree/tree',
      },
      treeMenu: {
        endpoint: '/web/metrictree/treemenu',
      },
      treeColor: {
        endpoint: '/web/metrictree/colorlist',
      },
      operations: {
        endpoint: '/web/dashboard/operations',
      },
      avail: {
        endpoint: '/web/dashboard/available',
      },
      setUserOrProjDefault: {
        endpoint: '/web/dashboard/setUserOrProjDefault'
      },
      setUserSequence: {
        endpoint: '/web/dashboard/tabSequence'
      },
      fileImport : {
        endpoint: '/web/dashboard/fileImport'
      },
      uploadFile :{
        endpoint: '/web/dashboard/uploadFile'
      },
      download: {
        endpoint: '/web/metrictree/download',
      },
      deriveMenu: {
        endpoint: '/web/metrictree/derivemenu',
      },
    } as Store.APIConfigGroup,
    dashboardWidget: {
      load: {
        endpoint: '/web/dashboard/widget/load',
      },
      menu: {
        endpoint: '/ddr/ddrmenu',
      },
    } as Store.APIConfigGroup,
    dashboardLayout: {
      load: {
        endpoint: '/web/dashboard/layout/load',
      },
      operations: {
        endpoint: '/web/dashboard/layout/operations',
      },
      avail: {
        endpoint: '/web/dashboard/layout/available',
      },
      list: {
        endpoint: '/web/dashboard/layout/list',
      },
    } as Store.APIConfigGroup,
    configSettings: {
        load:{
          endpoint: '/web/dashboard/getconfigurationsettings'
        },
    } as Store.APIConfigGroup,
    setConfigSettings: {
      load:{
        endpoint: '/web/dashboard/setconfigurationsettings'
      },
  } as Store.APIConfigGroup,
    fileManager: {
      load: {
        endpoint: '/web/filemanager/getfiles',
      },
    } as Store.APIConfigGroup,
    uploadFile: {
      load: {
        endpoint: '/web/filemanager/uploadfile',
      },
    } as Store.APIConfigGroup,
    downloadFile: {
      load: {
        endpoint: '/web/filemanager/downloadfile',
      },
    } as Store.APIConfigGroup,
    newFolder: {
      load: {
        endpoint: '/web/filemanager/newfolder',
      },
    } as Store.APIConfigGroup,
    downloadData: {
      load: {
        endpoint: '/web/download/data',
      },
    } as Store.APIConfigGroup,
    comparisonData: {
      load: {
        endpoint: '/revenue-comparison/load',
      },
    } as Store.APIConfigGroup,
    compareData: {
      load: {
        endpoint: '/web/dashboard/compareData',
      },
    } as Store.APIConfigGroup,
    saveCatalogue: {
      load: {
        endpoint: '/web/dashboard/catalogueManagement',
      },
    } as Store.APIConfigGroup,
    platformData: {
      load: {
        endpoint: '/platformdata/load',
      },
    } as Store.APIConfigGroup,
    chart: {
      load: {
        endpoint: '/chart/load',
      },
    } as Store.APIConfigGroup,
    flowpath: {
      load: {
        endpoint: '/ddr/flowpath',
      },
    } as Store.APIConfigGroup,
    mergeStackTraceData: {
      load: {
        endpoint: '/ddr/mergestacktracedata',
      },
    } as Store.APIConfigGroup,
    compareflowpath: {
      load: {
        endpoint: '/ddr/compareflowpath',
      },
    } as Store.APIConfigGroup,
    methodTiming: {
      load: {
        endpoint: '/ddr/methodTiming',
      },
    } as Store.APIConfigGroup,
    servicemethodtiming: {
      load: {
        endpoint: '/ddr/servicemethodtiming',
      },
    } as Store.APIConfigGroup,
    metadata: {
      load: {
        endpoint: '/ddr/metadata',
      },
    } as Store.APIConfigGroup,
    mctReport: {
      load: {
        endpoint: '/ddr/mct',
      },
    } as Store.APIConfigGroup,
    getChildFlowpath: {
      load: {
        endpoint: '/ddr/mctchildflowpath',
      },
    } as Store.APIConfigGroup,
    flowpathqueryEx: {
      load: {
        endpoint: '/ddr/flowpathqueryEx',
      },
    } as Store.APIConfigGroup,
    dbRequestEx: {
      load: {
        endpoint: '/ddr/dbRequestEx',
      },
    } as Store.APIConfigGroup,
    transactionFlowmapReport: {
      load: {
        endpoint: '/ddr/trxnflowquerydata',
      },
    } as Store.APIConfigGroup,
    transactionFlowmapMetaDataReport: {
      load: {
        endpoint: '/ddr/trxnflowmapmetadata',
      },
    } as Store.APIConfigGroup,
    httpReport: {
      load: {
        endpoint: '/ddr/httpReport',
      },
    } as Store.APIConfigGroup,
    varargs: {
      varargsload: {
        endpoint: '/ddr/getvariableargs',
      },
      downloadsourcecode:{
        endpoint: '/ddr/downloadsourcecode',
      }
    } as Store.APIConfigGroup,
    sourcecode: {
      sourcecodeLoad: {
        endpoint: '/ddr/readmethodbody',
      }
    } as Store.APIConfigGroup,
    exceptionReport: {
      exceptionLoad: {
        endpoint: '/ddr/exceptionReport',
      },
    } as Store.APIConfigGroup,
    aggExceptionData: {
      aggregateLoad: {
        endpoint: '/ddr/aggExceptionData',
      },
    } as Store.APIConfigGroup,
    hotspotData: {
      load: {
        endpoint: '/ddr/hotspotdata',
      },
    } as Store.APIConfigGroup,
    stackTraceData: {
      load: {
        endpoint: '/ddr/stacktracedata',
      },
    } as Store.APIConfigGroup,
    hotspotIpCallsData: {
      load: {
        endpoint: '/ddr/hotspotbackenddata',
      },
    } as Store.APIConfigGroup,
    iphealth: {
      load: {
        endpoint: '/ddr/iphealth',
      },
    } as Store.APIConfigGroup,
    aggbtData: {
      load: {
        endpoint: '/ddr/aggbtcallout',
      },
    } as Store.APIConfigGroup,
    indbtData: {
      load: {
        endpoint: '/ddr/indbtcallout',
      },
    } as Store.APIConfigGroup,
    analyzerData: {
      load: {
        endpoint: '/ddr/fpanalyzerdata',
      },
    } as Store.APIConfigGroup,
    events: {
      load: {
        endpoint: '/web/alert/events',
      },
    },
    allEvent: {
      load: {
        endpoint: '/web/alert/allevents',
      },
    },
    runCommand:{
      tiers: {
        endpoint: '/monitor/topology/getAttributes/Tiers',
      },
      info:{
        endpoint:"/run/command/runCommandInfo"
      },
      onserver:{
        endpoint:"/run/command/runCommandOnServer"
      },
      savecmd:{
        endpoint:"/run/command/saveRunCommand"
      },
      download:{
        endpoint:"/run/command/downloadRunCmdFile"
      },
      graphdata:{
        endpoint:"/run/command/getRunCommandGraphData"
      },
      schedule:{
        savetask:{
          endpoint:"/run/schedule/saveTask"
        },
        gettask:{
          endpoint:"/run/schedule/getTasks"
        },
        deletetask:{
          endpoint:"/run/schedule/deleteRunCmdTask"
        },
        taskinfo:{
          endpoint:"/run/schedule/taskInfo"
        },
        updatetask:{
          endpoint:"/run/schedule/updateTaskInfo"
        },
        edtask:{
          endpoint:"/run/schedule/enableDisableTask"
        }
      }
    },
    alert: {
      maintenance: {
        load: {
          endpoint: '/web/alert/maintenance/load',
        },
        add: {
          endpoint: '/web/alert/maintenance/add',
        },
        all: {
          endpoint: '/web/alert/maintenance/all',
        },
        any: {
          endpoint: '/web/alert/maintenance/any',
        },
        update: {
          endpoint: '/web/alert/maintenance/update',
        },
        delete: {
          endpoint: '/web/alert/maintenance/delete',
        },
        export: {
          endpoint: '/web/alert/maintenance/export',
        },
        import: {
          endpoint: '/web/alert/maintenance/import',
        },
        purged: {
          endpoint: '/web/alert/maintenance/purged',
        }
      } as Store.APIConfigGroup,
      rule: {
        widgetload: {
          endpoint: '/web/dashboard/widget/load',
        },
        load: {
          endpoint: '/web/alert/rule/load',
        },
        any: {
          endpoint: '/web/alert/rule/any',
        },
        all: {
          endpoint: '/web/alert/rule/all',
        },
        group: {
          endpoint: '/web/metrictree/group',
        },
        graph: {
          endpoint: '/web/metrictree/graph',
        },
        add: {
          endpoint: '/web/alert/rule/add',
        },
        update: {
          endpoint: '/web/alert/rule/update',
        },
        delete: {
          endpoint: '/web/alert/rule/delete',
        },
        enable: {
          endpoint: '/web/alert/rule/enable',
        },
        disable: {
          endpoint: '/web/alert/rule/disable',
        },
        upload: {
          endpoint: '/web/alert/rule/upload',
        },
        download: {
          endpoint: '/web/download/data',
        },
        export: {
          endpoint: '/web/alert/rule/export',
        },
        import: {
          endpoint: '/web/alert/rule/import',
        }
      } as Store.APIConfigGroup,
      event: {
        load: {
          endpoint: '/web/alert/event/load',
        },
        all: {
          endpoint: '/web/alert/event/all',
        },
        severity: {
          endpoint: '/web/alert/event/data',
        },
        query: {
          endpoint: '/web/alert/event/query',
        },
        forceclear: {
          endpoint: '/web/alert/event/clear',
        },
        update: {
          endpoint: '/web/alert/event/update',
        },
        counter: {
          endpoint: '/web/alert/event/counter',
        },
        count: {
          endpoint: '/web/alert/event/count',
        },
        filter: {
          endpoint:'/web/alert/history/filter',
        },
        loadhistory: {
          endpoint:'/web/alert/history/load',
        },
        openGraph: {
          endpoint: '/web/alert/event/graph/load',
        }
      } as Store.APIConfigGroup,
      action: {
        load: {
          endpoint: '/web/alert/action/load',
        },
        add: {
          endpoint: '/web/alert/action/add',
        },
        update: {
          endpoint: '/web/alert/action/update',
        },
        all: {
          endpoint: '/web/alert/action/all',
        },
        delete: {
          endpoint: '/web/alert/action/delete',
        },
        export: {
          endpoint: '/web/alert/action/export',
        },
        import: {
          endpoint: '/web/alert/action/import',
        }
      } as Store.APIConfigGroup,
      config: {
        all: {
          endpoint: '/web/alert/config/all',
        },
        update: {
          endpoint: '/web/alert/config/update',
        },
        import: {
          endpoint: '/web/alert/config/import',
        },
        export: {
          endpoint: '/web/alert/config/export',
        }
      } as Store.APIConfigGroup,
      mailSmsConfig: {
        all: {
          endpoint: '/web/alert/mailserver/config/all',
        },
        update: {
          endpoint: '/web/alert/mailserver/config/update',
        }
      } as Store.APIConfigGroup,
      actionHistory:{
        load:{
          endpoint: '/web/alert/action/history/load',
        },
        filter:{
          endpoint: '/web/alert/action/history/filter',
        },
        delete: {
          endpoint: '/web/alert/action/history/delete',
        }
      }as Store.APIConfigGroup,
    },
    auditlog: {
      load: {
        endpoint: '/acl/session/auditlogs',
      },
    },
    allMonitors: {
      load: {
        endpoint: '/web/common/allmonitors',
      },
    },
    nodeConfig: {
      load: {
        endpoint: '/web/common/node-config',
      },
    },
    saveNodeConfig: {
      load: {
        endpoint: '/web/common/save-node-config',
      },
    },
    applyNodeConfig: {
      load: {
        endpoint: '/web/common/apply-node-config',
      },
    },
    themes: {
      load: {
        endpoint: '/web/themes/list',
      },
    },
    userOptions: {
      load: {
        endpoint: '/web/user/menu',
      },
    },
    monitor: {
      // load: {
      //   endpoint: '/web/common/monitor',
      // },
       monStat:{
          endpoint: '/monitor/info/monitorStats'
      },
       availTech:{
          endpoint: '/monitor/info/availTech'
      },
      monConfig: {
          endpoint: '/monitor/driven/monConfig',
      },
      saveConfig: {
          endpoint: '/monitor/driven/saveConfig',
      },
      configInfo: {
         endpoint: '/monitor/driven/configInfo',
      },
      delConfig: {
          endpoint: '/monitor/driven/delConfig',
      },
      getTierList: {
          endpoint: '/monitor/driven/getTierList',
      },
      getServerList: {
        endpoint: '/monitor/driven/getServerList',
      },
      runCmdOnServer:{
        endpoint:'/monitor/custom/runCmdOnServer'
        },
        saveCMD:{
        endpoint: '/monitor/custom/saveCmdMonConfiguration'
        },
        runCmdScript:{
        endpoint: '/monitor/custom/runCmdScript'
        },
        getConfigMon:{
        endpoint: '/monitor/custom/getConfiguredCmdMon'
        },
        getAwsProfile:{
        endpoint: '/monitor/cloud/getAWSProfile'
        },
        saveAWSProfile:{
        endpoint: '/monitor/cloud/saveAWSProfile'
        },
        getAzureProfile:{
        endpoint: '/monitor/cloud/getAzureProfile'
        },
        saveAzureProfile:{
        endpoint: '/monitor/cloud/saveAzureProfile'
        },
        cloudMonList:{
        endpoint: '/monitor/cloud/cloudList'
        },
        getAWSRegion:{
        endpoint: '/monitor/cloud/getAWSRegions'
        },
        getNewRelic:{
        endpoint: '/monitor/cloud/getNewRelicProfile'
        },
        saveNewRelic:{
        endpoint: '/monitor/cloud/saveNewRelicProfile'
        },
        getDTProfile:{
        endpoint: '/monitor/cloud/getDTProfile'
        },
        saveDTProfile:{
        endpoint: '/monitor/cloud/saveDTProfile'
        },
        getGcpProfile:{
        endpoint: '/monitor/cloud/getGCPProfile'
        },
        downloadAccount:{
        endpoint: '/monitor/cloud/downloadAccount'
        },
        gcp:{
        endpoint: '/monitor/cloud/uploadGCPFile'
        },
        getMbeans:{
        endpoint:'/monitor/custom/getMbeans'
        },
        getChildNode:{
        endpoint:'/monitor/custom/getMbeanChildNodes'
        },
        getMbeansNDC:{
        endpoint:'/monitor/custom/getMbeansFromNDC'
        },
        saveJmxConf:{
        endpoint:'/monitor/custom/saveJmxConf'
        },
        editJmxMConfig:{
        endpoint:'/monitor/custom/editConfiguredJMXMon'
        },
        runDBQuery:{
        endpoint: '/monitor/custom/runDbQuery'
        },
        saveDbConf:{
        endpoint: '/monitor/custom/saveDBConf'
        },
        editDbMon:{
        endpoint: '/monitor/custom/editDbMon'
        },
        saveStatsd:{
        endpoint: "/monitor/custom/saveStatsDConf"
        },
        editStatsd:{
        endpoint: "/monitor/custom/getConfiguredStatsDMon"
        },
        savelogMetric:{
        enpoint: '/monitor/custom/saveNFMonConfiguration'
        },
        editLogMetric:
        {
        enpoint: '/monitor/custom/readCustomConfig'
        },
        getGlobalNfSetting:{
        enpoint: '/monitor/custom/getGlobalNFSettings'
        },
        getIndxList:{
        enpoint: '/monitor/custom/getIndexPatternList'
        },
        getMetricList:{
        enpoint: '/monitor/custom/fetchHierarchyMetricList'
        },
        saveGlobalSettingsToConfigIni:{
        enpoint: '/monitor/custom/saveGlobalSettingsToConfigIni'
        },
        reload: {
          endpoint: '/monitor/info/reload',
        },
        useGlobal: {
          endpoint: '/monitor/driven/useGlobalConfig',
       },
        getCustomMonitorByTech:{
           endpoint: '/monitor/info/getCustomMonitorByTech'
        },
       openDbUI:{
           endpoint: '/monitor/custom/openDbMon'
       },
       deleteCustomMonitorByTech:{
          endpoint: '/monitor/info/deleteCustomMonitorByTech'
       },
       getMonStatusOverAll:{
        endpoint: '/monitor/info/getMonStatusOverAll'
        },
        getMonStatusInfo:{
        endpoint: '/monitor/info/getMonStatusInfo'
        },
        getErrorSteps:{
        endpoint: '/monitor/info/getErrorSteps'
        },
  defaultMon:{
          endpoint: '/monitor/info/defaultMon'
      },
      saveDefaultMon:{
        endpoint: '/monitor/info/saveDefaultMon'
    },
    otherMonConfig:{
      endpoint: '/monitor/driven/otherMonConfig'
  },
     saveHealthCheckMonProfile:{
    endpoint: '/monitor/driven/saveHealthCheckMonProfile'
},
getHealthCheckData:{
  endpoint: '/monitor/driven/getHealthCheckData'
} ,
  copyCustMon:
  {
  enpoint: '/monitor/custom/copyCustMon'
  },
  getMonitorStats:{
    enpoint: '/monitor/info/getMonitorStats'
  },
  downloadConfig:{
    endpoint: '/monitor/driven/downloadConfig'
  },
 deleteGCP:{
    endpoint: '/monitor/cloud/deleteAccount'
   },
   testPattern:{
    endpoint: '/monitor/driven/testTierPattern'
   },
    },
    globalTimebar: {
      load: {
        endpoint: '/web/common/global-timebar',
      },
      time: {
        endpoint: '/web/common/global-timebar/time',
      },
      alert: {
        endpoint: '/web/alert/alertData',
      },
    },
    kpi: {
      pre: {
        endpoint: '/kpi/kpi/pre',
      },
      data: {
        endpoint: '/kpi/kpi/data',
      },
      orderRevenueData: {
        endpoint: '/kpi/kpi/order-rev-data',
      },
    },
    e2e: {
      main: {
        endpoint: '/geoend2end/end2end/main',
      },
      top10: {
        endpoint: '/geoend2end/end2end/top10',
      },
      showDashboard: {
        endpoint: '/geoend2end/end2end/tier/dashboard',
      },
      onlineFlowmap: {
        endpoint: '/geoend2end/end2end/onlineFlowmap',
      },
      manageFlowmap: {
        endpoint: '/geoend2end/end2end/manageFlowmap',
      },
      deleteFlowmap: {
        endpoint: '/geoend2end/end2end/deleteFlowmap',
      },
      onlineFlowmapInfo: {
        endpoint: '/geoend2end/end2end/onlineFlowmapInfo',
      },
      edit: {
        endpoint: '/geoend2end/end2end/editFlowmap',
      },
      groupList: {
        endpoint: '/geoend2end/end2end/tiergrouplist',
      },
      createGroup: {
        endpoint: '/geoend2end/end2end/createNewGroup',
      },
      tierInfo: {
        endpoint: '/geoend2end/end2end/tierinfo',
      }
    },
    dataCenters: {
      load: {
        endpoint: '/web/dataCenters',
      },
    },
    geoLocation: {
      load: {
        endpoint: '/geoend2end/geomap/geoInfo',
      },
      topTransactions: {
        endpoint: '/geoend2end/geomap/topTrans',
      },
      businessHealth: {
        endpoint: '/geoend2end/geomap/goodbadstore',
      },
      list: {
        endpoint: '/geoend2end/geomap/storeapps',
      },
      configure: {
        endpoint: '/geoend2end/geomap/getTierList',
      },
      saveApps: {
        endpoint: '/geoend2end/geomap/saveAppTierJson',
      }
    } as Store.APIConfigGroup,
    report: {
      availableTemplates: {
        endpoint: '/webreport/template/availableTemplates',
      },
      deleteTemplate: {
        endpoint: '/webreport/template/deleteTemplate',
      },
      editTemplate: {
        endpoint: '/webreport/template/readTemplate',
      },
      availableReports: {
        endpoint: '/webreport/report/getAvailableReports',
      },
      msrInfo: {
        endpoint: '/webreport/report/getCompareEditModeInfo',
      },
      deleteReports: {
        endpoint: '/webreport/report/deleteReport',
      },
      SchedulerDelete: {
        endpoint: '/webreport/scheduler/deleteReportTask',
      },
      SchedulerEnableDisable: {
        endpoint: '/webreport/scheduler/enableDisableReportTask',
      },
      SchedulerAvailable: {
        endpoint: '/webreport/scheduler/getAddedReportTaskList',
      },
      editTask: {
        endpoint: '/webreport/scheduler/getReportTaskInfo',
      },
      graph: {
        endpoint: '/web/metrictree/graph',
      },
      group: {
        endpoint: '/web/metrictree/group',
      },
      getTemplateFavList: {
        endpoint: '/webreport/report/getTemplateFavList',
      },
      generateReport: {
        endpoint: '/webreport/report/generateReport',
      },
      uploadTemplate: {
        endpoint: '/webreport/template/uploadTemplate',
      },
      transactionCodeList: {
        endpoint: '/ReportRestServices/getSummaryErrorTransactionErrorCodeList',
      },
      saveTemplate: {
        endpoint: '/webreport/template/saveTemplate',
      },
      addReportTask: {
        endpoint: '/webreport/scheduler/addReportTask',
      },
      updateReportTask: {
        endpoint: '/webreport/scheduler/updateReportTask',
      },
      getMetricSource: {
        endpoint: '/webreport/report/getParsedMetricSource',
      },
      enableScheduler: {
        endpoint: '/webreport/scheduler/getIsSchedulerEnable',
      },
      getChartAndReportData:{
        endpoint: '/webreport/report/getChartAndReportData',
      },
      createChartAndReport:{
        endpoint: '/webreport/report/createChartAndReport',
      }
    } as Store.APIConfigGroup,
    dbMonitoring: {
      loadUI: {
        endpoint: '/dbMonitoring/loadUI'
      },
      loadDBSourceList: {
        endpoint: '/dbMonitoring/loadDBSourceList'
      },
      executionStats: {
        endpoint: '/dbMonitoring/sqlactivity/executionStats'
      },
      executionPlan: {
        endpoint: '/dbMonitoring/sqlactivity/executionPlan'
      },
      downloadExecutionPlan: {
        endpoint: '/dbMonitoring/sqlactivity/executionPlan/downloadPlan'
      },
      blockingSession: {
        endpoint: '/dbMonitoring/sqlactivity/blockingSession'
      },
      lock: {
        endpoint: '/dbMonitoring/sqlactivity/lockSession'
      },
      sessionStats: {
        endpoint: '/dbMonitoring/sqlactivity/sessionData'
      },
      ioFileStats: {
        endpoint: '/dbMonitoring/sqlactivity/ioFileStat'
      },
      ioFileStatGraphData: {
        endpoint: '/dbMonitoring/sqlactivity/ioFileStatGraphData'
      },

      deadLockStats: {
        endpoint: '/dbMonitoring/sqlactivity/deadLock'
      },
      databaseStats: {
        endpoint: '/dbMonitoring/database/databaseStats'
      },
      waitStats: {
        endpoint: '/dbMonitoring/waits/waitStats'
      },
      sessionWaitStats: {
        endpoint: '/dbMonitoring/waits/sessionWaitStats'
      },
      tempDBStats:{
        endpoint : '/dbMonitoring/temp/tempDBStats'
    },
    memoryStats:{
        endpoint : '/dbMonitoring/serverStats/memoryStats'
    },
    connectionStats:{
      endpoint : '/dbMonitoring/serverStats/connectionStats'
  },
  connectionDetail:{
    endpoint : '/dbMonitoring/serverStats/connectionDetail'
},
serviceStats:{
    endpoint : '/dbMonitoring/supportServices/serviceStats'
},
batchJobs:{
  endpoint : '/dbMonitoring/supportServices/batchJobs'
},
batchHistory:{
  endpoint : '/dbMonitoring/supportServices/batchHistory'
},
servicesLogs:{
  endpoint : '/dbMonitoring/logs/servicesLogs'
},
queryLogs:{
  endpoint : '/dbMonitoring/logs/queryLogs'
},queryName:{
  endpoint : '/dbMonitoring/customQuery/queryName'
},
queryInfo:{
  endpoint : '/dbMonitoring/customQuery/queryInfo'
}
    } as Store.APIConfigGroup,
    netvision: {
      base: {
        base: '/'
      },
      goalvar: {
        endpoint: 'netvision/rest/webapi/showgoals'
      },
      rumsettingLayout: {
        endpoint: 'netvision/samples/rumsettings.json'
      },
      jsAgentConfigLayout: {
        endpoint: 'netvision/samples/jsAgentConfigLayout.json'
      },
      iosSdkConfigLayout: {
        endpoint: 'netvision/samples/iosSdkConfigLayout.json'
      },
      androidSdkConfigLayout: {
        endpoint: 'netvision/samples/androidSdkConfigLayout.json'
      },
      winSdkConfigLayout: {
        endpoint: 'netvision/samples/winSdkConfigLayout.json'
      },
      reactSdkConfigLayout: {
        endpoint: 'netvision/samples/reactSdkConfigLayout.json'
      },
      sessionlist: {
        endpoint: 'netvision/rest/webapi/sessionfilter'
      },
      activeSession: {
        endpoint: 'netvision/rest/webapi/activesessions'
      },
      activeSessionCount: {
        endpoint: 'netvision/rest/webapi/activesessioncount'
      },
      activeSessionPages: {
        endpoint: 'netvision/rest/webapi/activepages'
      },
      sessionpage: {
        endpoint: 'netvision/rest/webapi/pagedetail'
      },
      custommetrics: {
        endpoint: 'netvision/rest/webapi/nvcustommetrics'
      },
      usertiming:{
        endpoint: 'netvision/rest/webapi/nvaggregateData'
      },
      events: {
        endpoint: 'netvision/rest/webapi/eventsdata'
      },
      appcrash : {
        endpoint: 'netvision/rest/webapi/CrashTabView'
      },
      appcrashfilter:{
        endpoint:'netvision/rest/webapi/aggregatecrash'
      },
      allcrash:{
        endpoint:'netvision/rest/webapi/crashprequestpage'
      },
      backupcleanup: {
        endpoint: 'netvision/rest/webapi/getFileData'
      },
      parser: {
        endpoint: 'netvision/rest/webapi/getparsers'
      },
      deviceperformance: {
        endpoint: 'netvision/rest/webapi/deviceperformance'
      },
      httprequest:{
        endpoint: 'netvision/rest/webapi/nvgetAjaxdata'
      },
      useractions: {
        endpoint: 'netvision/rest/webapi/nvgetuserActions'
      },
      sessionevent: {
        endpoint: 'netvision/rest/webapi/eventAggData'
      },
      rumdataoverview: {
        endpoint: 'netvision/rest/webapi/getrumdata'
      },
      businessProcess: {
        endpoint: 'netvision/rest/webapi/businessprocess'
      },
      performancedetailaggdata: {
        endpoint: 'netvision/rest/webapi/pageperformance'
      },
      performancedetailtrenddata: {
        endpoint: 'netvision/rest/webapi/pageperformancetrend'
      },
      aggregateResource: {
        endpoint: 'netvision/rest/webapi/aggregateResource'
      },
      domainAggData: {
        endpoint: 'netvision/rest/webapi/domainAggData'
      },
      domainTrend: {
        endpoint: 'netvision/rest/webapi/domainTrend'
      },
      allresourceTrend: {
        endpoint: 'netvision/rest/webapi/allresourceTrend'
      },
      alldomainTrend: {
        endpoint: 'netvision/rest/webapi/alldomainTrend'
      },
      maoverview: {
        endpoint: 'netvision/rest/webapi/marketgraph'
      },
      macampaigndata: {
        endpoint: 'netvision/rest/webapi/campaignData'
      },
      macampaigngraph: {
        endpoint: 'netvision/rest/webapi/campaignDetailGraph'
      },
      revenueanalytics: {
        endpoint: 'netvision/rest/webapi/nvrevenuedatastat'
      },
      customMetrics : {
       endpoint :  'netvision/rest/webapi/customMetrics'
      },
      scrollmap : {
        endpoint : 'netvision/rest/webapi/nvscrollmap'
      },
       showUserSegment: {
        endpoint : 'netvision/rest/webapi/showUserSegment'
      },
      addusersegment: {
        endpoint : 'netvision/rest/webapi/addusersegment'
      },
      updateUserSegment : {
        endpoint : 'netvision/rest/webapi/updateUserSegment'
      },
      showbusinessdata: {
        endpoint : 'netvision/rest/webapi/showbusinessdata'
      },
      deleteUserSegment: {
        endpoint : 'netvision/rest/webapi/deleteUserSegment'
      },
      showUserSegmentRule: {
        endpoint : 'netvision/rest/webapi/showUserSegmentRule'
      },
      addanotherrulesusersegment: {
        endpoint : 'netvision/rest/webapi/addanotherrulesusersegment'
      },
      deleteruleUserSegment: {
        endpoint : 'netvision/rest/webapi/deleteruleUserSegment'
      },
      addupdaterulesusersegment: {
        endpoint : 'netvision/rest/webapi/addupdaterulesusersegment'
      },
      formanalyticsreport: {
        endpoint : 'netvision/rest/webapi/formanalyticsreport'
      },
      tsdbformanalyticsreport: {
        endpoint : 'netvision/rest/webapi/tsdbformanalyticsreport'
      },
    } as Store.APIConfigGroup,
  },
  formats: {
    date: {
      // Moment JS date formats
      default: 'MM-DD-YYYY',
      long: 'D-MMM-YYYY',
      short: 'D-MMM-YYYY',
    },
    dateTime: {
      // Moment JS date formats
      default: 'MM-DD-YYYY HH:mm:ss',
    },
    OWL_DATE_TIME_FORMATS: {
      parseInput: 'MM-DD-YYYY HH:mm:ss',
      fullPickerInput: 'MM-DD-YYYY HH:mm:ss',
      datePickerInput: 'MM-DD-YYYY',
      timePickerInput: 'HH:mm:ss',
      monthYearLabel: 'MMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY',
    },
  },
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
