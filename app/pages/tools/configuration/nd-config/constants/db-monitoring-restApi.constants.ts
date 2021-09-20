/**
 * DB Monitoring Rest Api Constants
 */

export const DB_MONITORING = '/DashboardServer/dbMonitoring/';

export const BLOCKING_SESSION_STATS = 'BlockStats/blockingSessionStats';
export const BLOCKING_SESSION_STATS_DRILLDOWN = 'BlockStats/blockingStatsForDrillDown';
export const CONFIGURATION_POSTGRES_DETAIL = 'ConfigurationStats/postgresDetail';
export const CONFIGURATION_MSSQL_POSTGRES_DETAIL = 'ConfigurationStats/msSqlPostgresDetail';
export const CONFIGURATION_MODULE_QUERY_LOGS = 'ConfigurationStats/moduleQueryLogs';
export const CONFIGURATION_MODULE_SERVICES_LOGS = 'ConfigurationStats/moduleServicesLogs';
export const CUSTUM_QUERY_NAME = 'CustomQuery/queryName';
export const CUSTUM_QUERY_INFO = 'CustomQuery/queryInfo';
export const DATABASE_DATA = 'DatabaseStats/databaseData';
export const DATABASE_GRAPH_DATA = 'DatabaseStats/databaseGraphData';
export const DBACTIVITY_LOCK_DATA = 'DBActivity/lockData';
export const DBACTIVITY_LOCK_TYPES = 'DBActivity/lockTypes';
export const DBACTIVITY_IO_FILE_STATS = 'DBActivity/IOFileStat';
export const DBACTIVITY_IO_FILE_TYPES = 'DBActivity/IOByFileTypes';
export const DBACTIVITY_IO_FILE_STATS_DRILLDOWN = 'DBActivity/IOFileStatForDrillDown';
export const DBACTIVITY_LOCK_DRILLDOWN_DATA = 'DBActivity/IOFileStatForDrillDown';
export const DBQUERYSTATS_QUERY_EXEQUTER_DATA = 'DBQueryStats/queryExecuterData';
export const DBQUERYSTATS_QUERY_PLAN_DATA = 'DBQueryStats/queryPlanData';
export const DBQUERYSTATS_QUERY_ACTUAL_PLAN_DATA = 'DBQueryStats/queryActualPlanData';
export const DBQUERYSTATS_DOWNLOAD_QUERY_PLAN = 'DBQueryStats/downloadQueryPlan';
export const DBQUERYSTATS_QUERY_EXECUTER_FOR_QUERY = 'DBQueryStats/queryExecuterDataForQuery';
export const DBQUERYSTATS_GET_DBSOURCES = 'DBQueryStats/getDbSources';
export const DBQUERYSTATS_GET_DBSOURCES_STATUS = 'DBQueryStats/serverStatus';
export const DBQUERYSTATS_UPDATE_DB_SOURCES = 'DBQueryStats/updateDbSourceConfig';
export const HIGH_AVAILIVILITY_MIRRORING = 'HighAvailability/mirroring';
export const SERVER_MEMORY_STATS_CONFIG = 'ServerStats/memoryStatsAndConfig';
export const SERVER_CONNECTION_STATS = 'ServerStats/connStats';
export const SERVER_CONNECTION_DETAIL = 'ServerStats/connDetail';
export const SESSION_DATA_REALTIME = 'SessionStats/getSessionDatainRealtime';
export const SESSION_GET_DEADLOCK_DATA = 'SessionStats/getDeadLockData';
export const SESSION_GET_PLANQUERY = 'SessionStats/getPlanAndQuery';
export const SESSION_GET_FAVRIOTE_LIST = 'SessionStats/getFavrioteList';
export const SESSION_ID_ANALYZER = 'SessionStats/sessionIdAnalyzer';
export const SESSION_LOAD_DB_FAV_DATA = 'SessionStats/loadSelectedDBFavData';
export const SUPPORT_SERVICES_QUERY_SUPPORTSERVICES = 'SupportServices/querySupportServices';
export const SUPPORT_SERVICES_BATCH_JOBS = 'SupportServices/batchJobs';
export const SUPPORT_SERVICES_BATCH_HISTORY = 'SupportServices/batchHistory';
export const TEMPDB_STATS_TEMPDB_DATA = 'TempDBStats/tempDBData';
export const TEMPDB_STATS_TEMPDB_DRILLDOWN = 'TempDBStats/tempDBDrillDownData';
export const WAIT_STATS_QUERY_WAIT_STATS = 'WaitStats/queryWaitStats';
export const WAIT_STATS_WAITSTATS_DRILLDOWN = 'WaitStats/waitStatsForDrillDown';
export const CONFIGURATION_GET_SETTINGS = 'ConfigurationStats/getConfSettings';
export const CONFIGURATION_SAVE_SETTINGS = 'ConfigurationStats/saveConfSettings';
export const GETMONITORPROPERTIES = 'ConfigurationStats/getMonitorProperties';
export const WAIT_STATS_SESSION_WAIT_STATS = 'WaitStats/getSessionWaitStats';
export const WAIT_STATS_SESSION_ID = 'SessionStats/sessionIdListStats';
export const GETUIDETAILS = '/ProductUI/config/dbMonitoringUI.json.bkp';
export const GETUIDETAILSBKP = '/sys/dbMonitoringUI.json.bkp';
