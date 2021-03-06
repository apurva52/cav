export class KeywordsModel {
    constructor(
        private RUM_SID_EXPIRY_TIMEOUT: '',
        private MAX_SESSION_DURATION: '',
        private RUM_CAPTURE_PAGE_DUMP: '',
        private NV_LOCATION_IP_RANGE_FILE: '',
        private PARTITION_SETTINGS: '',
        private NV_JCP_STORE_STATS: '',
        private NV_REPORTING_GUI_ADDRESS: '',
        private NV_REPORTING_GUI_PORT: '',
        private NVDBU_UPLOAD_TOOL: '',
        private NRDBU_TRACE_LEVEL: '',
        private NV_RESOURCE_DOMIAIN_COUNT: '',
        private NV_RESOURCE_DOMAIN_UPDATE_FREQUENCY: '',
        private SEND_MAIL_ON_HIGH_PAGE_RESPONSE: '',
        private ENABLE_FORM_ANALYTICS: '',
        private NVDBU_BUFFER_SIZE: '',
        private NVDBU_IDLE_TIME: '',
        private NVDBU_NUM_CYCLES: '',
        private ENABLE_NV_CSP: '',
        private NV_TIMING_OUTLIER: '',
        private NV_OVERLOAD_CONTROL: '',
        private URL_GROUP: any,
        private ND_EXCEPTION_EVENT: '',
        private NV_SESSION_DURATION_THRESHOLD: '',
        private DOS_ATTACK: '',
        private METADATA_RTC: '',
        private NV_PAGE_LOOP_THRESHOLD: '',
        private RUM_CSV_BUFFER: '',


        // those keywords which wont be used in this config-system ts file
        private ENABLE_RUM: '',
        private RUM_LTS_COOKIE_NAME: '',
        private RUM_CAV_EPOCH_YEAR: '',
        private RUM_CLIENT_ID: '',
        private NV_REPORTING_SERVER_IP: '',
        private NV_MONITOR_VECTOR_IDX_ENABLE: '',
        private NV_AGG_REPORTING_TRACE_LEVEL: '',
        private NV_REPORTING_SERVER_PORT: '',
        private RUM_PARTITION_OVERLAP_MINS: '',
        private NV_AUTOGEN_CONFIG: '',
        private NV_JS_LIB_PATH: '',
        private PG_BULKLOAD: '',


        private NV_REPORTING_TRACE_LEVEL: '',
        private NV_SESSION_MANAGEMENT_MODE: '',
        private G_NV_PAGE_RESPONSE_THRESHOLD: '',

        private ENABLE_LOGINID: '',
        private CLIENT_IP_WHITE_LIST: '',

        private NVDBU_TMP_FILE_PATH: '',
        private HPD_MONITOR: '',
        private NV_SAVE_PAGEDUMP: '',


        private NVDBU_NUM_CYCLE: '',
        private ENABLE_OTHER_PROTOCOLS: '',
        private NV_ENABLE_PAGEDUMP_CACHING: '',
        private NV_PC_MFS_TIMESTAMP_DIR_INTERVAL: '',
        private NV_PC_MFS_LOCATION: '',
        private NV_IDLE_SLEEP_TIME: '',
        private NV_PCT_TTL: '',
        private NV_PC_CLEAN_SESSION_PCT: '',
        private NV_PC_IMMEDIATE_CLEAN_SESSION_MAX_PAGES: '',
        private NV_PC_MFS_FREE_SPACE_THRESHOLD: '',
        private PC_TRACE_LEVEL: '',
        private NRDBU_ANALYZE_INTERVAL: '',
        private NV_TRACE_LEVEL: '',
        private NV_AGGREGATOR_RUN_MODE: '',
        private NV_MULTIDISK_OVERLOAD_THRESHOLD: '',
        private MULTIDISK_TABLESPACE_INFO: '',
        private NV_ASSIGN_MULTIDISK_TABLESPACE: '',
        private ENABLE_MONITOR_FILTER_MODE: '',
        private NV_CONFIG_URL_ANDROID: '',



        // Newly added
        private KEEP_ALIVE_TIMEOUT: '',
        private FIRST_REQ_TIMEOUT: '',
        private ACCESS_LOG: '',
        private OPTIMIZE_ETHER_FLOW: '',
        private NUM_PROCESS: '',
        private PROGRESS_ENABLED: '',
        private ENABLE_TRAFFIC_STAT: '',
        private NVDBU_CHUNK_SIZE: '',
        private NV_BD_CHECKSUM: '',
        private BOT_DETECTION_ENABLE: '',
        private NV_SCA_MODE: '',

    ) { }
}