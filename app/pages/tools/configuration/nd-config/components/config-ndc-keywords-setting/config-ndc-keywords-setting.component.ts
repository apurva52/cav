import { Component, OnInit, Output, EventEmitter, Inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { ConfigKeywordsService } from '../../services/config-keywords.service';
import { ConfigUtilityService } from '../../services/config-utility.service';
import { NDCKeywordsInfo } from '../../interfaces/keywords-info';
import { KeywordData, KeywordList } from '../../containers/keyword-data';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NDC_KEYWORD_DATA } from '../../reducers/ndc-keyword-reducer';
import { ConfigUiUtility, cloneObject } from '../../utils/config-utility';
import { NDCCustomKeywordsComponentData, PercentileKeywords } from '../../containers/instrumentation-data';
import { customKeywordMessage } from '../../constants/config-constant';
import { PipeForType } from '../../pipes/config-pipe.pipe';
import { DOCUMENT } from '@angular/common'

import { ImmutableArray } from '../../utils/immutable-array';

import { deleteMany } from '../../utils/config-utility';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
    selector: 'app-ndc-keywords-setting',
    templateUrl: './config-ndc-keywords-setting.component.html',
    styleUrls: ['./config-ndc-keywords-setting.component.css']
})
export class ConfigNDCKeywordsSettingComponent implements OnInit {

    @Output()
    ndcKeywordData = new EventEmitter();
    saveDisable: boolean = false;
    ndcKeywords: Object;

    custom_keywords: Object;

    subscription: Subscription;

    // Variables for values of NDC_TRACING_LEVEL keyword
    NDC_TRACING_LEVEL_VAL;
    NDC_TRACING_LEVEL_SIZE;

    //Variables for values of NDDBU_TRACE_LEVEL keyword
    // NDDBU_TRACE_LEVEL_VAL;
    // NDDBU_TRACE_LEVEL_SIZE;

    //Variables for values of NDDBU_RD_INST_COUNT_AND_SKIP keyword
    // NDDBU_RD_INST_COUNT_AND_SKIP_MIN;
    // NDDBU_RD_INST_COUNT_AND_SKIP_MAX;

    //Variables for values of ND_ENABLE_CAPTURE_DB_TIMING keyword
    JDBC;
    REDIX;
    MONGODB;
    CASSANDRA;
    NEO4J;
    CLOUDANT;
    BIGTABLE;
    BIGQUERY;
    FTP;
    DYNAMO; 

    // //Variables for values of NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE keyword
    // NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_MIN;
    // NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_MAX;

    //Variable for values of NDP_SEQ_BLOB_IN_FILE_FLAG keyword
    NDP_SEQ_BLOB_IN_FILE_FLAG_VAL;
    NDP_SEQ_BLOB_IN_FILE_FLAG_VER;
    NDP_SEQ_BLOB_IN_FILE_FLAG_SIZE;

    //Variables for values of NDC_HS_ST_IN_FILE_FLAG keyword
    NDC_HS_ST_IN_FILE_FLAG_VAL;
    NDC_HS_ST_IN_FILE_FLAG_VER;

    NDC_THRESHOLD_TO_MARK_DELETED_VAL = 8;

    //Variables for values of ND_FPI_MASK keyword
    ndeId1;
    ndeId2;
    appId1;
    appId2;
    timestamp1;
    timestamp2;
    seqNo1;
    seqNo2;

    //Dropdown values containing A and B
    version;

    /**This the list of all NDC keywords. */
    keywordList = [
        'NDC_WAIT_TIME_AFTER_TEST_IS_OVER',
        'NDC_CONTROL_MSG_ACK_TIMEOUT',
        'NDC_CONTROL_THREAD_EPOLL_TIMEOUT',
        'NDC_CONTINUE_ON_CONTROL_CONNECTION_ERROR',
        'NDC_TIME_TO_SEND_HEART_BEAT_TO_BCI',
        'NDP_TR_RUNNING_STATUS_POLL_INTERVAL',
        'NDP_NEW_RAW_DATA_POLL_INTERVAL',
        'ENABLE_METHOD_TIMING_TABLE',
        'NDP_OMIT_NON_NS_FLOWPATHS',
        'NDP_EXCLUDE_FLOWPATHS_OUTSIDE_TESTIDX',
        'NDP_TRACE_LEVEL',
        'MAX_METHOD_CALL_STACK',
        'NDP_INIT_CONCURRENT_FLOWPATHS',
        'NDP_DELTA_CONCURRENT_FLOWPATHS',
        'NDP_MAX_BUFFERED_META_DATA_BUFSIZE',
        'NDP_MAX_BUFFERED_BCI_ARG_BUFSIZE',
        'NDP_MAX_BUFFERED_HTTP_HEADER_MD_BUFSIZE',
        'NDP_MAX_BUFFERED_HTTP_HEADER_BUFSIZE',
        'NDP_MAX_BUFFERED_EXCEPTION_DATA_BUFSIZE',
        'NDP_MAX_BUFFERED_FLOWPATH_BUFSIZE',
        'NDP_MAX_BUFFERED_APPLOG_BUFSIZE',
        'NDP_MAX_BUFFERED_METHOD_TIMING_TABLE_ENTRIES',
        'NDP_MAX_BUFFERED_MEM_ALLOC_BUFSIZE',
        'NDP_MAX_BUFFERED_SQL_TABLE_BUFSIZE',
        'NDP_MAX_BUFFERED_SQL_RECORD_TABLE_BUFSIZE',
        'NDP_DEBUG_LOGFILE_ROLLOVER_SIZE',
        'NDP_FORCE_UPLOAD_TIMEOUT',
        'NDP_SECS_TO_MARK_AN_FP_DEAD',
        'NDP_SECS_TO_CLEAN_DEAD_FLOWPATHS',
        'DB_UPLOAD_MODE',
        'NDP_FORCE_ADD_URC_FOR_NS_FPI_IN_MAPPING_RECORD',
        'NDP_MAX_ENTRY_EXIT_RECORDS_IN_AN_FP',
        'NDP_LOWER_PROCESS_PRIORITY_FLAG',
        'NDP_MAX_BUFFERED_JMS_BUFSIZE',
        'NDP_MAX_CONCURRENT_THREADS_IN_JVM',
        //The  Keywords : NDP_METHOD_TIMING_CSV_FLUSH_INTERVAL_SECS & NDP_DEBUG_LOGLEVEL are commented as per suggested by Manmeet sir
        // 'NDP_METHOD_TIMING_CSV_FLUSH_INTERVAL_SECS',
        'NDP_DISABLE_DUMPING_CAPTURED_HTTP_BODY',
        'NDC_TRACING_LEVEL',
        'NDC_STOP_INSTRUMENTATION_RESPONSE_TIMEOUT',
        'NDC_ACCEPT_NEW_AND_CLOSE_CURRENT_DATA_CONNECTION',
        'NDC_DATA_THD_TERM_RETRY_COUNT',
        'NDC_DATA_THD_TERM_RETRY_INTERVAL_MSEC',
        // 'SND_RESP_TO_BCI_ON_DATA_CONN',
        'NDC_LOG_BCI_AGGREGATE_RAW_DATA',
        // 'NDDBU_TRACE_LEVEL',
        'NDP_SEQ_BLOB_IN_FILE_FLAG',
        'NDP_SEQ_BLOB_IN_FILE_MIN_SIZE',
        'NDP_SEQ_BLOB_COMPRESSION_BUFFER_INIT_SIZE',
        'MAX_BUFFERED_SQB_BUFSIZE',
        'NDC_WAIT_TIME_TO_SEND_FORCE_STOP_COMP_SIG',
        'NDP_DUMP_URC',
        'NDP_META_DATA_RECOVERY_RETRY_TIMEOUT_IN_SEC',
        'NDP_SQL_START_NORM_ID',
        'NDP_ENABLE_SQL_TIMING',
        'NDP_ENABLE_SQL_RECORD',
        'NDP_ENABLE_BCIARG',
        'NDDBU_TMP_FILE_PATH',
        // 'NDDBU_RD_INST_COUNT_AND_SKIP',
        'NDDBU_CHUNK_SIZE',
        'NDDBU_IDLE_TIME',
        // 'NDDBU_NUM_CYCLES',
        'NDP_FORCE_ADD_URC_FOR_MISSING_FP_MAPPING_RECORD',
        'NDP_FREE_FP_MIN_SQB_SIZE',
        'NDP_RAW_DATA_BUF_SIZE',
        'NDP_GENERATE_FP_SIGNATURES',
        'NDP_MIN_RESPTIME_TO_FILTER_L1_FP',
        'NDP_BINARY_FORMAT_FOR_METHOD_TIMING',
        'NDC_BCI_TIME_DIFF_THRESHOLD_IN_MS',
        'NDC_HS_ST_IN_FILE_FLAG',
        'NDC_HS_ST_IN_FILE_MIN_SIZE',
        'NDC_HS_ST_COMPRESSION_BUFFER_INIT_SIZE',
        'ND_FPI_MASK',
        'ND_ENABLE_MONITOR_LOG',
        'NDP_MAX_ENTRY_EXIT_RECORDS_IN_AN_FP_EX2',
        // 'ENABLE_AUTO_SCALING',
        'NDC_MODIFY_TOPO_ENTRY',
        'NDC_DATA_THD_TERM_RETRY_INTERVAL_SEC',
        // 'NDP_DEBUG_LOGLEVEL',
        'NDC_REUSE_INSTANCE_ID_TIME_IN_MIN',
        'NDP_ENABLE_METADATA_RECOVERY',
        'NDP_ALLOW_REQ_DETAIL_BEFORE_SQB_BEGIN_REC',
        'NDC_LOG_BCI_AGGREGATE_RAW_DATA_EX',
        'NDC_BCI_RESPONSE_TIME_FOR_METADATA_IN_SECS',
        'ND_ENABLE_CAPTURE_DB_TIMING',
        'NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE',
        'ENABLE_FP_STAT_MONITOR',
        'SEND_ACTIVE_INSTANCE_REP',
        'NDC_MAX_CTRL_CON',
        'NDP_MAX_SQL_INDEX_FROM_BCI',
        'NDC_THRESHOLD_TO_MARK_DELETED',
        'NDP_DELETED_INSTANCE_CLEANUP_DELAY',
        'SND_RESP_TO_BCI_ON_DATA_CONN',
        'NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS',
        // 'NDC_ENABLE_INSTANCE_LEVEL_PERCENTILE',
        'NDC_PERCENTILES',
        // 'NDC_BT_PERCENTILE_TIERS',
        // 'NDC_IP_PERCENTILE_TIERS'
    	'SERVER_BLACKLIST_SETTINGS',
    	'COPY_PROFILES_INSIDE_TEST',
    	'NDC_DELAY_START_INSTRUMENTATION',
    	'NDP_SQL_QUERY_SIMILARITY_PERCENTAGE',
	'NDC_FILE_KEYWORD_CACHE'
    ];

    appId: number;
    isAppPerm: boolean;
    dropDownLabel = ['hr', 'min', 'sec'];
    dropDownValue = ['hr', 'min', 'sec'];
    dropDownOption = [];
    selectedFormat: any
    enableAutoCleanUp: boolean = true;

    /* Below are the keywords used to handle custom keywords */
    addEditDialog: boolean = false;
    isNew: boolean = false;
    //list holding keywordsNameList
    customKeywordsList = [];

    keywordTypeValue = ['NDP', 'NDC'];
    customKeywordsTypeList = [];

    /**It stores custom keywords data */
    customKeywordsDataList: NDCCustomKeywordsComponentData[];

    /**It stores selected method monitor data for edit or add method-monitor */
    customKeywords: NDCCustomKeywordsComponentData;

    /**It stores selected custom keywords data */
    selectedCustomKeywordsData: NDCCustomKeywordsComponentData[];

    message: string;

    //The below variables are used for implementing Keyword : NDP_DELETED_INSTANCE_CLEANUP_DELAY
    NDP_DELETED_INSTANCE_CLEANUP_DELAY_VAL = 3;
    labelForNDICDelay = ['Day(s)', 'Hour(s)', 'Minute(s)'];
    valueForNDICDelay = ['D', 'H', 'M'];
    dropDownNDICDelayOption = [];
    selectedFormatForNDICDelay: any;


    //The below variables are used for implementing Keyword : NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_VAL
    NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_VAL = 1;

    NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_WAIT_VAL = 10;
    labelForMarkAppInactive = ['hr', 'min', 'sec'];
    valueForMarkAppInactive = ['hr', 'min', 'sec'];
    dropDownForMarkAppInactive = [];
    selectedForMarkAppInactive: any;

    dropDownForWaitMarkAppInactive = [];
    selectedForWaitMarkAppInactive: any;

    //Variables for KeyWord : NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS
    enableAutoCleanUpForInvalidServer: boolean = true;
    selectedFormatForInvalidServer: any;
    NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS_VAL = 1;
    dropDownOptionForInvalidServer = [];

    //Percentile
    // dropDownOptionForIncludeExclude = [];

    //Percentile For IP
    // dropDownForIPIncludeExclude = [];

    // includeExcludeLabel = ['INCLUDE', 'EXCLUDE'];

    // dropDownOptionForFormat = [];

    //Percentile For IP
    // dropDownForIPFormat = [];


    formatLabel = ['minute(s)', 'hour(s)'];
    formatValue = ['m', 'hr'];

    // dropDownOptionForMinuteTime = [];
    //Percentile IP
    // dropDownForIPMinuteTime = [];

    // minuteTimeLabel = ['1', '2', '5', '15', '30'];
    // minuteTimeValue = ['1', '2', '5', '15', '30'];

    // hourTimeLabel = ['1', '2', '4', '8', '12', '24'];
    // hourTimeValue = ['1', '2', '4', '8', '12', '24'];

    //Tier Names Drop down
    // dropDownOptionForTiersName: SelectItem[]


    //Tier Names Drop down
    // dropDownForIPTiersName: SelectItem[]

    tierName: any[] = [];
    //Percentile
   // percentileKeywordsData: PercentileKeywords[] = [];
    // percentileKeywordsDetails: PercentileKeywords;


   // percentileKeywordsIPData: PercentileKeywords[] = [];
  //  percentileKeywordsIPDetails: PercentileKeywords;

    // selectedPercentileKeywordsData: PercentileKeywords[];


    //For percentile IP 
    // selectedpercentileKeywordsIPData: PercentileKeywords[];

    //For bt percentille
    btPercentiles: any[] = []

    btPercentileStr;

    // topoName: string;

    btPercentiles1 : any;
    btPercentiles2 : any;
    btPercentiles3 : any;
    btPercentiles4 : any;
    btPercentiles5 : any;

    //For Add/Edit BT Percentile
    isNewBTPercentile: boolean = true;
    //For IP
    isNewBTIPPercentile: boolean = true;



    // NDC_ENABLE_INSTANCE_LEVEL_PERCENTILE
    //For Keyword : NDC_ENABLE_INSTANCE_LEVEL_PERCENTILE
    // isNDCInstancePercentile : boolean;

    //Variable names to hold values for SERVER_BLACKLIST_SETTINGS setting
    arrServerBlacklistSettings = [];
    isServerBlacklistSettings : boolean;
    connDisscntDuration : any;
    numCounts : any;
    serverBlockDuration : any;

    labelForListofCopyProfiles = ['Do not Copy Profiles', 'Copy profiles', 'Copy profiles in thread mode'];
    valueForListofCopyProfiles = [0, 1, 2];
    dropDownListofCopyProfiles= [];
    selectedDropDownListofCopyProfiles: any;
    COPY_PROFILES_INSIDE_TEST_VAL = 60;

    isDelayCaptureNDData : boolean = false;
    labelForListofDelayCapture = ['sec', 'min', 'hr'];
    valueForListofDelayCapture = ['s', 'm', 'h'];
    dropDownOptionForDelayCapture = [];
    selectedFormatForDelayData : any;
    NDC_DELAY_START_INSTRUMENTATION_VAL = 60;

    //Variable for the keyword NDP_SEQ_BLOB_IN_FILE_FLAG
    isNdpSqlQuerySimilarityPercenatge : boolean;
    ndpSqlQuerySimilarityPercenatgeValue : number;

    //variables for keyword NDC_FILE_KEYWORD_CACHE
    isNDCFileKeywordCache : boolean = false ;
    NDC_FILE_KEYWORD_CACHE_VAL = 60000;
	breadcrumb: BreadcrumbService;
        constructor(private _configUtilityService: ConfigUtilityService,
        private confirmationService: ConfirmationService,
        private _configKeywordsService: ConfigKeywordsService,
        private router: Router,
        private route: ActivatedRoute,
        private store: Store<KeywordList>,
        private configUtilityService: ConfigUtilityService,
        private pipeForType: PipeForType,
	breadcrumbService: BreadcrumbService,
        @Inject(DOCUMENT) private document: Document) {
        //Getting aplication's Id from URL
        this.route.params.subscribe((params: Params) => {
            this.appId = params['appId'];
            // this.topoName = params['topoName'];
        });

        //Getting NDC keyword data from the reducer
        this.subscription = this.store.select(store => store["ndcKeywordData"]).subscribe(data => {
            var keywordDataVal = {}
            this.keywordList.map(function (key) {
                keywordDataVal[key] = data[key];
            })
            this.ndcKeywords = cloneObject(keywordDataVal);
        });
        // this.percentileKeywordsDetails = new PercentileKeywords();

       // this.percentileKeywordsIPDetails = new PercentileKeywords();
        // this.selectedPercentileKeywordsDetails = new PercentileKeywords();
	this.breadcrumb = breadcrumbService;
    }

    ngOnInit() {
	this.breadcrumb.add({label: 'ND Server', routerLink: `/nd-agent-config/application-list/ndc-keywords-setting/${this.appId}`});
        this.isAppPerm = +sessionStorage.getItem("ApplicationAccess") == 4 ? true : false;
        this.document.body.classList.add('ndc_keywords');
        // Getting data on Initial Load
        this.loadDropDownVal();
        this.getNDCKeywords();
    }
    //Loads dropdown data 
    loadDropDownVal() {
        this.version = [];
        var val = ['A', 'B'];
        var key = ['Uncompressed', 'Compressed'];
        this.version = ConfigUiUtility.createListWithKeyValue(key, val);

        //Dropdown for NDP_DELETED_INSTANCE_CLEANUP_DELAY
        this.dropDownNDICDelayOption = ConfigUiUtility.createListWithKeyValue(this.labelForNDICDelay, this.valueForNDICDelay);

        //Dropdown for NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE
        this.dropDownForMarkAppInactive = ConfigUiUtility.createListWithKeyValue(this.labelForMarkAppInactive, this.valueForMarkAppInactive);
        this.dropDownForWaitMarkAppInactive = ConfigUiUtility.createListWithKeyValue(this.labelForMarkAppInactive, this.valueForMarkAppInactive);
        this.dropDownOption = ConfigUiUtility.createListWithKeyValue(this.dropDownValue, this.dropDownLabel);
        this.dropDownOptionForInvalidServer = ConfigUiUtility.createListWithKeyValue(this.dropDownLabel, this.dropDownValue);
        this.dropDownListofCopyProfiles = this.createListWithKeyValueForCopyProf(this.labelForListofCopyProfiles, this.valueForListofCopyProfiles);
	this.dropDownOptionForDelayCapture = ConfigUiUtility.createListWithKeyValue(this.labelForListofDelayCapture, this.valueForListofDelayCapture);
    }

    /**
     * Getting NDC Keywords
     */
    getNDCKeywords() {
        // Getting NDC keywords data from Server
        this._configKeywordsService.getNDCKeywords(this.appId).subscribe(data => {
            this.createDataForTable(data)
            this.splitKeywords(data);
            this.ndcKeywords = cloneObject(data);
            this.custom_keywords = cloneObject(data);
            this.store.dispatch({ type: NDC_KEYWORD_DATA, payload: data });

        });
    }

    //Setting Data into BTPercentile on getting Values from Backend for IP
    // settingDataIntoBTPercentileTableForIP(arr, key) {
    //     this.percentileKeywordsIPDetails = new PercentileKeywords();
    //     this.percentileKeywordsIPDetails.isInclude = arr[0];
    //     let arrTemp = [];
    //     //For Include
    //     if (this.percentileKeywordsIPDetails.isInclude == 'INCLUDE') {
    //         let valueOfTime = '';
    //         arrTemp = key.split(":");
    //         if (arrTemp[1].includes("m")) {
    //             this.percentileKeywordsIPDetails.selectedFormat = 'm';
    //             valueOfTime = arrTemp[1].substring(0, arrTemp[1].indexOf("m"))
    //         }
    //         else {
    //             this.percentileKeywordsIPDetails.selectedFormat = 'hr';
    //             valueOfTime = arrTemp[1].substring(0, arrTemp[1].indexOf("hr"))
    //         }
    //         this.percentileKeywordsIPDetails.selectedTime = valueOfTime;
    //         // this.percentileKeywordsDetails.timeAndFormat = arrTemp[1];
    //         this.percentileKeywordsIPDetails.timeAndFormat = this.percentileKeywordsIPDetails.selectedTime + this.percentileKeywordsIPDetails.selectedFormat;
    //         this.percentileKeywordsIPDetails.tierList = arrTemp[0];
    //     }
    //     //For Exclude 
    //     else {
    //         this.percentileKeywordsIPDetails.tierList = key;
    //         this.percentileKeywordsIPDetails.timeAndFormat = '-';

    //     }
    //     let tier = this.percentileKeywordsIPDetails.tierList;
    //     this.btPercTierToRemoveForIP.push(tier)
    //     // this.percentileKeywordsIPData = ImmutableArray.push(this.percentileKeywordsIPData, this.percentileKeywordsIPDetails)
    // }




    //Setting Data into BTPercentile on getting Values from Backend
    // settingDataIntoBTPercentileTable(arr, key) {
    //     this.percentileKeywordsDetails = new PercentileKeywords();
    //     this.percentileKeywordsDetails.isInclude = arr[0];
    //     let arrTemp = [];
    //     //For Include
    //     if (this.percentileKeywordsDetails.isInclude == 'INCLUDE') {
    //         let valueOfTime = '';
    //         arrTemp = key.split(":");
    //         if (arrTemp[1].includes("m")) {
    //             this.percentileKeywordsDetails.selectedFormat = 'm';
    //             valueOfTime = arrTemp[1].substring(0, arrTemp[1].indexOf("m"))
    //         }
    //         else {
    //             this.percentileKeywordsDetails.selectedFormat = 'hr';
    //             valueOfTime = arrTemp[1].substring(0, arrTemp[1].indexOf("hr"))
    //         }
    //         this.percentileKeywordsDetails.selectedTime = valueOfTime;
    //         // this.percentileKeywordsDetails.timeAndFormat = arrTemp[1];
    //         this.percentileKeywordsDetails.timeAndFormat = this.percentileKeywordsDetails.selectedTime + this.percentileKeywordsDetails.selectedFormat;
    //         this.percentileKeywordsDetails.tierList = arrTemp[0];
    //     }
    //     //For Exclude 
    //     else {
    //         this.percentileKeywordsDetails.tierList = key;
    //         this.percentileKeywordsDetails.timeAndFormat = '-';

    //     }
    //     let tier = this.percentileKeywordsDetails.tierList;
    //     this.btPercTierToRemove.push(tier)
    //     this.percentileKeywordsData = ImmutableArray.push(this.percentileKeywordsData, this.percentileKeywordsDetails)
    // }

    // btPercTierToRemove: any[] = [];

    // btPercTierToRemoveForIP: any[] = [];
    //This method splits the value of those keywords which have can have multiple values 
    splitKeywords(data) {
        // if (data.NDC_ENABLE_INSTANCE_LEVEL_PERCENTILE.value == 0) {
        //     this.isNDCInstancePercentile = false;
        // }
        // else{
        //     this.isNDCInstancePercentile = true; 
        // }
       

        //NDC_TRACING_LEVEL 1 50
        if (data.NDC_TRACING_LEVEL.value.includes(" ")) {
            let val = data.NDC_TRACING_LEVEL.value.split(" ");
            this.NDC_TRACING_LEVEL_VAL = val[0];
            this.NDC_TRACING_LEVEL_SIZE = val[1];
        }
        //NDDBU_TRACE_LEVEL 1 10
        // if (data.NDDBU_TRACE_LEVEL.value.includes(" ")) {
        //     let val = data.NDDBU_TRACE_LEVEL.value.split(" ");
        //     this.NDDBU_TRACE_LEVEL_VAL = val[0];
        //     // this.NDDBU_TRACE_LEVEL_SIZE = val[1];
        // }
        //NDDBU_RD_INST_COUNT_AND_SKIP  0 5
        // if (data.NDDBU_RD_INST_COUNT_AND_SKIP.value.includes(" ")) {
        //     let val = data.NDDBU_RD_INST_COUNT_AND_SKIP.value.split(" ");
        //     this.NDDBU_RD_INST_COUNT_AND_SKIP_MIN = val[0];
        //     this.NDDBU_RD_INST_COUNT_AND_SKIP_MAX = val[1];
        // }

        //ND_ENABLE_CAPTURE_DB_TIMING 1 0 0 0
        if (data.ND_ENABLE_CAPTURE_DB_TIMING.value.includes(" ")) {
            let val = data.ND_ENABLE_CAPTURE_DB_TIMING.value.split(" ");
            this.JDBC = val[0];
            this.REDIX = val[1];
            this.MONGODB = val[2];
            this.CASSANDRA = val[3];
            this.CASSANDRA = val[3];
            this.NEO4J = val[4];
            this.CLOUDANT = val[5];
            this.BIGTABLE = val[6];
            this.BIGQUERY = val[7];
            this.FTP = val[8];
            this.DYNAMO = val[9];
        }

        //NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE 3600000 600000
        // if (data.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE.value.includes(" ")) {
        //     let val = data.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE.value.split(" ");
        //     this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_MIN = val[0];
        //     this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_MAX = val[1];
        // }

        //NDP_SEQ_BLOB_IN_FILE_FLAG 1 B 100000
        if (data.NDP_SEQ_BLOB_IN_FILE_FLAG.value.includes(" ")) {
            let val = data.NDP_SEQ_BLOB_IN_FILE_FLAG.value.split(" ");
            this.NDP_SEQ_BLOB_IN_FILE_FLAG_VAL = val[0];
            this.NDP_SEQ_BLOB_IN_FILE_FLAG_VER = val[1];
            this.NDP_SEQ_BLOB_IN_FILE_FLAG_SIZE = val[2];
        }

        //NDC_HS_ST_IN_FILE_FLAG 1 B
        if (data.NDC_HS_ST_IN_FILE_FLAG.value.includes(" ")) {
            let val = data.NDC_HS_ST_IN_FILE_FLAG.value.split(" ");
            this.NDC_HS_ST_IN_FILE_FLAG_VAL = val[0];
            this.NDC_HS_ST_IN_FILE_FLAG_VER = val[1];
        }

        //ND_FPI_MASK NDEID:56:4;AppID:46:10;TS:8:38;SeqNo:0:8
        if (data.ND_FPI_MASK.value.includes(":")) {
            let val = data.ND_FPI_MASK.value.split(";");
            if (val[0].includes("NDEID")) {
                let ndeId = val[0].split(":");
                this.ndeId1 = ndeId[1];
                this.ndeId2 = ndeId[2];
            }

            if (val[1].includes("AppID")) {
                let appId = val[1].split(":");
                this.appId1 = appId[1];
                this.appId2 = appId[2];
            }

            if (val[2].includes("TS")) {
                let ts = val[2].split(":");
                this.timestamp1 = ts[1];
                this.timestamp2 = ts[2];
            }
            if (val[3].includes("SeqNo")) {
                let seqno = val[3].split(":");
                this.seqNo1 = seqno[1];
                this.seqNo2 = seqno[2];
            }
        }
        if (data.NDC_THRESHOLD_TO_MARK_DELETED.value.includes(" ")) {
            let arr = data.NDC_THRESHOLD_TO_MARK_DELETED.value.split(" ");
            if (arr[0] == 1) {
                this.enableAutoCleanUp = true;
            }
            if (arr[1].includes("h")) {
                this.selectedFormat = "hr";
                let arrtime = arr[1].split("h")
                this.NDC_THRESHOLD_TO_MARK_DELETED_VAL = +arrtime[0];
            }
            else if (arr[1].includes("m")) {
                this.selectedFormat = "min";
                let arrtime = arr[1].split("m")
                this.NDC_THRESHOLD_TO_MARK_DELETED_VAL = +arrtime[0];
            }
            else if (arr[1].includes("s")) {
                this.selectedFormat = "sec";
                let arrtime = arr[1].split("s")
                this.NDC_THRESHOLD_TO_MARK_DELETED_VAL = +arrtime[0];
            }
        }
        else {
            this.enableAutoCleanUp = false;
            this.NDC_THRESHOLD_TO_MARK_DELETED_VAL = 8;
            this.selectedFormat = "hr";
        }

        //Splitting Data of NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS
        if (data.NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS.value.includes(" ")) {
            let arr = data.NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS.value.split(" ");
            if (arr[0] == 1) {
                this.enableAutoCleanUpForInvalidServer = true;
            }
            if (arr[1].includes("h")) {
                this.selectedFormatForInvalidServer = "hr";
                let arrtime = arr[1].split("h")
                this.NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS_VAL = +arrtime[0];
            }
            else if (arr[1].includes("m")) {
                this.selectedFormatForInvalidServer = "min";
                let arrtime = arr[1].split("m")
                this.NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS_VAL = +arrtime[0];
            }
            else if (arr[1].includes("s")) {
                this.selectedFormatForInvalidServer = "sec";
                let arrtime = arr[1].split("s")
                this.NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS_VAL = +arrtime[0];
            }
        }
        else {
            this.enableAutoCleanUpForInvalidServer = false;
            this.NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS_VAL = 1;
            this.selectedFormatForInvalidServer = "hr";
        }


	//Splitting Data of COPY_PROFILES_INSIDE_TEST
        if (data.COPY_PROFILES_INSIDE_TEST.value.includes(" ")) 
	{
            let arr = data.COPY_PROFILES_INSIDE_TEST.value.split(" ");
            if (arr[0] == 2) {
                this.selectedDropDownListofCopyProfiles = +2;
		this.COPY_PROFILES_INSIDE_TEST_VAL = arr[1];
            }
        } else if(data.COPY_PROFILES_INSIDE_TEST.value == 0) {
		this.selectedDropDownListofCopyProfiles = +0;
                this.COPY_PROFILES_INSIDE_TEST_VAL = 60;
        } else if(data.COPY_PROFILES_INSIDE_TEST.value == 1) {
			this.selectedDropDownListofCopyProfiles = +1;
            this.COPY_PROFILES_INSIDE_TEST_VAL = 60;
	}

        //Splitting Data of NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE
        if (data.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE.value.includes("H") || data.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE.value.includes("M") || data.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE.value.includes("S")) {
            let valueOfKeyword = data.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE.value;
            let value = valueOfKeyword.split(" ");
            let valueOfMarkAppInactive = value[0];
            let valueOfWaitMarkAppInactive = value[1];
            let waitMarkAppInactiveValue = valueOfWaitMarkAppInactive.substring(0, valueOfWaitMarkAppInactive.length - 1);
            let markAppInactiveValue = valueOfMarkAppInactive.substring(0, valueOfMarkAppInactive.length - 1);
            this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_VAL = +markAppInactiveValue;
            this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_WAIT_VAL = +waitMarkAppInactiveValue;

            if (valueOfMarkAppInactive.includes('H')) {
                this.selectedForMarkAppInactive = "hr";
            }
            else if (valueOfMarkAppInactive.includes('M')) {
                this.selectedForMarkAppInactive = "min";
            }
            else {
                this.selectedForMarkAppInactive = "sec";
            }

            if (valueOfWaitMarkAppInactive.includes('H')) {
                this.selectedForWaitMarkAppInactive = "hr";
            }
            else if (valueOfWaitMarkAppInactive.includes('M')) {
                this.selectedForWaitMarkAppInactive = "min";
            }
            else {
                this.selectedForWaitMarkAppInactive = "sec";
            }
        }
        else {
            this.selectedForMarkAppInactive = "hr";
            this.selectedForWaitMarkAppInactive = "min";
            data['NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE'].value = "1H 10M";
            this._configKeywordsService.saveNDCKeywords(data, this.appId, true).subscribe(data => {
                this.ndcKeywords = data;
                this.store.dispatch({ type: NDC_KEYWORD_DATA, payload: data });
            });
        }

        //Splitting Data of NDP_DELETED_INSTANCE_CLEANUP_DELAY 
        if (data.NDP_DELETED_INSTANCE_CLEANUP_DELAY.value.includes('D') || data.NDP_DELETED_INSTANCE_CLEANUP_DELAY.value.includes('H') || data.NDP_DELETED_INSTANCE_CLEANUP_DELAY.value.includes('M')) {
            let valueOfKeyword = data.NDP_DELETED_INSTANCE_CLEANUP_DELAY.value.substring(0, data.NDP_DELETED_INSTANCE_CLEANUP_DELAY.value.length - 1);
            this.NDP_DELETED_INSTANCE_CLEANUP_DELAY_VAL = +valueOfKeyword;
            if (data.NDP_DELETED_INSTANCE_CLEANUP_DELAY.value.includes('D')) {
                this.selectedFormatForNDICDelay = "D";
            }
            else if (data.NDP_DELETED_INSTANCE_CLEANUP_DELAY.value.includes('H')) {
                this.selectedFormatForNDICDelay = "H";
            }
            else {
                this.selectedFormatForNDICDelay = "M";
            }
        }
        else {
            this.NDP_DELETED_INSTANCE_CLEANUP_DELAY_VAL = data.NDP_DELETED_INSTANCE_CLEANUP_DELAY.value;
            this.selectedFormatForNDICDelay = "D";
        }

	//Splitting Data of NDC_DELAY_START_INSTRUMENTATION
	if (data.NDC_DELAY_START_INSTRUMENTATION.value.includes(" ")) {
            let arr = data.NDC_DELAY_START_INSTRUMENTATION.value.split(" ");
            if (arr[0] == 1) {
                this.isDelayCaptureNDData = true;
            } else if(arr[0] == 0) {
		this.isDelayCaptureNDData = false;
	    }
            if (arr[1].includes("m")) {
                this.selectedFormatForDelayData = "m";
                let arrtime = arr[1].split("m")
                this.NDC_DELAY_START_INSTRUMENTATION_VAL = +arrtime[0];
            }
            else if (arr[1].includes("s")) {
                this.selectedFormatForDelayData = "s";
                let arrtime = arr[1].split("s")
                this.NDC_DELAY_START_INSTRUMENTATION_VAL = +arrtime[0];
            }
	    else if (arr[1].includes("h")) {
                this.selectedFormatForDelayData = "h";
                let arrtime = arr[1].split("h")
                this.NDC_DELAY_START_INSTRUMENTATION_VAL = +arrtime[0];
            }
        }

	//Splitting Data of NDC_FILE_KEYWORD_CACHE
	if (data.NDC_FILE_KEYWORD_CACHE.value.includes(" ")) {
            let arr = data.NDC_FILE_KEYWORD_CACHE.value.split(" ");
            this.isNDCFileKeywordCache = (arr[0] == 1) ?  true : false;
            this.NDC_FILE_KEYWORD_CACHE_VAL = arr[1];
        }

        this.btPercentileStr = data['NDC_PERCENTILES'].value;
        this.btPercentiles = this.btPercentileStr.split(",");
        [this.btPercentiles1, this.btPercentiles2, this.btPercentiles3, this.btPercentiles4, this.btPercentiles5] = this.btPercentiles;

        //Splitting data related keyword SERVER_BLACKLIST_SETTINGS and set it into respective variable
        this.arrServerBlacklistSettings = data['SERVER_BLACKLIST_SETTINGS'].value.split(" ");
        if(this.arrServerBlacklistSettings[0] == 1)
            this.isServerBlacklistSettings = true;
        else
            this.isServerBlacklistSettings = false;

        this.connDisscntDuration = this.arrServerBlacklistSettings[1];
        this.numCounts = this.arrServerBlacklistSettings[2];
        this.serverBlockDuration = this.arrServerBlacklistSettings[3];

	if (data.NDP_SQL_QUERY_SIMILARITY_PERCENTAGE.value.includes(" ")) {
            let arr = data.NDP_SQL_QUERY_SIMILARITY_PERCENTAGE.value.split(" ");
            if (arr[0] == "0")
                this.isNdpSqlQuerySimilarityPercenatge = false;
            else if (arr[0] == "1")
                this.isNdpSqlQuerySimilarityPercenatge = true;

            this.ndpSqlQuerySimilarityPercenatgeValue = arr[1];
        }	
    }


    //This function is responsible for saving Keywords value in DB
    saveNDCKeywords() {

        // if(this.isNDCInstancePercentile){
        //     this.ndcKeywords['NDC_ENABLE_INSTANCE_LEVEL_PERCENTILE'].value = 1;
        // }
        // else{
        //     this.ndcKeywords['NDC_ENABLE_INSTANCE_LEVEL_PERCENTILE'].value = 0;
        // }
        if (this.enableAutoCleanUp) {
            if (this.selectedFormat == "hr")
                this.ndcKeywords['NDC_THRESHOLD_TO_MARK_DELETED'].value = "1 " + this.NDC_THRESHOLD_TO_MARK_DELETED_VAL + "h";
            else if (this.selectedFormat == "min")
                this.ndcKeywords['NDC_THRESHOLD_TO_MARK_DELETED'].value = "1 " + this.NDC_THRESHOLD_TO_MARK_DELETED_VAL + "m";
            else
                this.ndcKeywords['NDC_THRESHOLD_TO_MARK_DELETED'].value = "1 " + this.NDC_THRESHOLD_TO_MARK_DELETED_VAL + "s";
        }
        else {
            this.ndcKeywords['NDC_THRESHOLD_TO_MARK_DELETED'].value = 0;
            this.NDC_THRESHOLD_TO_MARK_DELETED_VAL = 8;
            this.selectedFormat = "hr"
        }
        //Making Data for Keyword : NDP_DELETED_INSTANCE_CLEANUP_DELAY
        if (this.selectedFormatForNDICDelay == 'D') {
            this.ndcKeywords['NDP_DELETED_INSTANCE_CLEANUP_DELAY'].value = this.NDP_DELETED_INSTANCE_CLEANUP_DELAY_VAL + "D";
        }
        else if (this.selectedFormatForNDICDelay == 'H') {
            this.ndcKeywords['NDP_DELETED_INSTANCE_CLEANUP_DELAY'].value = this.NDP_DELETED_INSTANCE_CLEANUP_DELAY_VAL + "H";
        }
        else {
            this.ndcKeywords['NDP_DELETED_INSTANCE_CLEANUP_DELAY'].value = this.NDP_DELETED_INSTANCE_CLEANUP_DELAY_VAL + "M";
        }

        //Making Data for Keyword : NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE
        if (this.selectedForMarkAppInactive == 'hr') {
            this.ndcKeywords['NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE'].value = this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_VAL + "H";
        }
        else if (this.selectedForMarkAppInactive == 'min') {
            this.ndcKeywords['NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE'].value = this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_VAL + "M";
        }
        else {
            this.ndcKeywords['NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE'].value = this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_VAL + "S";
        }

        if (this.selectedForWaitMarkAppInactive == 'hr') {
            this.ndcKeywords['NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE'].value = this.ndcKeywords['NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE'].value + " " + this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_WAIT_VAL + "H";
        }
        else if (this.selectedForWaitMarkAppInactive == 'min') {
            this.ndcKeywords['NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE'].value = this.ndcKeywords['NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE'].value + " " + this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_WAIT_VAL + "M";
        }
        else {
            this.ndcKeywords['NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE'].value = this.ndcKeywords['NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE'].value + " " + this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_WAIT_VAL + "S";
        }

        if(this.selectedDropDownListofCopyProfiles == 0)
        {
            this.ndcKeywords['COPY_PROFILES_INSIDE_TEST'].value = 0;
	    this.COPY_PROFILES_INSIDE_TEST_VAL = 60;
        }
        else if(this.selectedDropDownListofCopyProfiles == 1)
        {
            this.ndcKeywords['COPY_PROFILES_INSIDE_TEST'].value = 1;
	    this.COPY_PROFILES_INSIDE_TEST_VAL = 60;
        }
        else
            this.ndcKeywords['COPY_PROFILES_INSIDE_TEST'].value = 2 + " " + this.COPY_PROFILES_INSIDE_TEST_VAL;

        //For KeyWord : NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS
        if (this.enableAutoCleanUpForInvalidServer) {
            if (this.selectedFormatForInvalidServer == "hr")
                this.ndcKeywords['NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS'].value = "1 " + this.NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS_VAL + "h";
            else if (this.selectedFormatForInvalidServer == "min")
                this.ndcKeywords['NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS'].value = "1 " + this.NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS_VAL + "m";
            else
                this.ndcKeywords['NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS'].value = "1 " + this.NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS_VAL + "s";
        }
        else {
            this.ndcKeywords['NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS'].value = 0;
            this.NDC_THRESHOLD_TO_DELETE_INVALID_SERVERS_VAL = 1;
            this.selectedFormatForInvalidServer = "hr"
        }

	if (this.isDelayCaptureNDData) {
            this.ndcKeywords['NDC_DELAY_START_INSTRUMENTATION'].value = "1 " + this.NDC_DELAY_START_INSTRUMENTATION_VAL + this.selectedFormatForDelayData;
        }
        else {
	    this.isDelayCaptureNDData = false;
            this.ndcKeywords['NDC_DELAY_START_INSTRUMENTATION'].value = '0 60s';
            this.NDC_DELAY_START_INSTRUMENTATION_VAL = 60;
            this.selectedFormatForDelayData = "s"
        }

	if (this.isNDCFileKeywordCache) {
            this.ndcKeywords['NDC_FILE_KEYWORD_CACHE'].value = "1 " + this.NDC_FILE_KEYWORD_CACHE_VAL;
        }
        else {
            this.isNDCFileKeywordCache = false;
            this.NDC_FILE_KEYWORD_CACHE_VAL = 60000
            this.ndcKeywords['NDC_FILE_KEYWORD_CACHE'].value = '0';
        }
 
        this.btPercentiles = [this.btPercentiles1, this.btPercentiles2, this.btPercentiles3, this.btPercentiles4, this.btPercentiles5];
        //Check for duplicate value
        if (this.btPercentiles != undefined) {
            for (let i = 0; i < this.btPercentiles.length; i++) {
                let m = i;
                for (let j = m + 1; j < this.btPercentiles.length; j++) {
                    if (this.btPercentiles[i] == this.btPercentiles[j] && this.btPercentiles[i] != null) {
                        this.configUtilityService.errorMessage("Duplicate input is not allowed in percentile metrices")
                        return;
                    }
                }
            }
        }
	
	//For keyword NDP_SQL_QUERY_SIMILARITY_PERCENTAGE
        if(this.isNdpSqlQuerySimilarityPercenatge)
            this.ndcKeywords["NDP_SQL_QUERY_SIMILARITY_PERCENTAGE"].value = "1 " + this.ndpSqlQuerySimilarityPercenatgeValue;
        else
            this.ndcKeywords["NDP_SQL_QUERY_SIMILARITY_PERCENTAGE"].value = "0 " + this.ndpSqlQuerySimilarityPercenatgeValue;

        // Saving Data to Server
        this.ndcKeywords = this.joinKeywordsVal(this.ndcKeywords)
        //For percentile keywords
        this.ndcKeywords = this.generatePercentileKeywordsVal(this.ndcKeywords);
        this.ndcKeywords = Object.assign(this.custom_keywords, this.ndcKeywords)
        this._configKeywordsService.saveNDCKeywords(this.ndcKeywords, this.appId, true).subscribe(data => {
            this.ndcKeywords = data;
            this._configUtilityService.successMessage("Saved successfully")
            this.store.dispatch({ type: NDC_KEYWORD_DATA, payload: data });
        });
    }

    //This method will generate the values of NDC Percentile keywords
    generatePercentileKeywordsVal(data) {
        let str = [];
	//If User hasn't configured any values to NDC_BT_PERCENTILE_TIERS && NDC_IP_PERCENTILE_TIERS then NDC_PERCENTILES will be set to its default value
  //      if (this.percentileKeywordsData.length == 0 && this.percentileKeywordsIPData.length == 0) {
  //          data["NDC_PERCENTILES"].value = data["NDC_PERCENTILES"].defaultValue
  //          this.btPercentiles = data["NDC_PERCENTILES"].defaultValue.split(",")
  //          this.btPercentiles1 = '80';
  //          this.btPercentiles2 = '85';
  //          this.btPercentiles3 = '90';
  //          this.btPercentiles4 = '95';
  //          this.btPercentiles5 = '99';
  //      }
  //      else {
        this.btPercentiles = [this.btPercentiles1, this.btPercentiles2, this.btPercentiles3, this.btPercentiles4, this.btPercentiles5];
        for(let key of this.btPercentiles){
            if(key != undefined){
                str.push(key);
            }
        }
        str.join(",")
        data["NDC_PERCENTILES"].value  = str.join(",");
//	}
        //for NDC_BT_PERCENTILE_TIERS
        // let includeMsgArr = [];
        // let excludeMsgArr = [];

        // for (let row of this.percentileKeywordsData) {
        //     //Now create required string for include as <tierName>:<AggregationPeriod>,<tierName>:<AggregationPeriod>
        //     if (row.isInclude == 'INCLUDE') {
        //         includeMsgArr.push(row.tierList + ":" + row.selectedTime + row.selectedFormat)
        //     }
        //     else {
        //         //for exclude tier <tierName>,<tierName>
        //         excludeMsgArr.push(row.tierList);
        //     }
        // }
        // if (includeMsgArr.length > 0)
        //     var includeMsg = "INCLUDE " + includeMsgArr.join(",");
        // if (excludeMsgArr.length > 0)
        //     var excludeMsg = "EXCLUDE " + excludeMsgArr.join(",");
        // if (excludeMsg != undefined) {
        //     if (includeMsg != undefined) {
        //         data["NDC_BT_PERCENTILE_TIERS"].value = includeMsg + " " + excludeMsg;
        //     }
        //     else {
        //         data["NDC_BT_PERCENTILE_TIERS"].value = excludeMsg;
        //     }
        // }
        // else {
        //     data["NDC_BT_PERCENTILE_TIERS"].value = includeMsg;
        // }

        //Percentile IP
        //for NDC_BT_PERCENTILE_TIERS
        // let includeIPMsgArr = [];
        // let excludeIPMsgArr = [];
        // for (let row of this.percentileKeywordsIPData) {
        //     //Now create required string for include as <tierName>:<AggregationPeriod>,<tierName>:<AggregationPeriod>
        //     if (row.isInclude == 'INCLUDE') {
        //         includeIPMsgArr.push(row.tierList + ":" + row.selectedTime + row.selectedFormat)
        //     }
        //     else {
        //         //for exclude tier <tierName>,<tierName>
        //         excludeIPMsgArr.push(row.tierList);
        //     }
        // }
        // if (includeIPMsgArr.length > 0)
        //     var includeIPMsg = "INCLUDE " + includeIPMsgArr.join(",");
        // if (excludeIPMsgArr.length > 0)
        //     var excludeIPMsg = "EXCLUDE " + excludeIPMsgArr.join(",");
        // if (excludeIPMsg != undefined) {
        //     if (includeIPMsg != undefined) {
        //         data["NDC_IP_PERCENTILE_TIERS"].value = includeIPMsg + " " + excludeIPMsg;
        //     }
        //     else {
        //         data["NDC_IP_PERCENTILE_TIERS"].value = excludeIPMsg;
        //     }
        // }
        // else {
        //     data["NDC_IP_PERCENTILE_TIERS"].value = includeIPMsg;
        // }
        return data
    }

    //This method merges the value of those keywords which have more than one values
    joinKeywordsVal(data) {

        //For NDC_TRACING_LEVEL
        data["NDC_TRACING_LEVEL"].value = this.NDC_TRACING_LEVEL_VAL + " " + this.NDC_TRACING_LEVEL_SIZE;

        //For NDDBU_TRACE_LEVEL
        // data["NDDBU_TRACE_LEVEL"].value = this.NDDBU_TRACE_LEVEL_VAL + " " + this.NDDBU_TRACE_LEVEL_SIZE;

        //NDDBU_RD_INST_COUNT_AND_SKIP
        // data["NDDBU_RD_INST_COUNT_AND_SKIP"].value = this.NDDBU_RD_INST_COUNT_AND_SKIP_MIN + " " + this.NDDBU_RD_INST_COUNT_AND_SKIP_MAX;

        //ND_ENABLE_CAPTURE_DB_TIMING
	data["ND_ENABLE_CAPTURE_DB_TIMING"].value = this.JDBC + " " + this.REDIX + " " + this.MONGODB + " " + this.CASSANDRA + " " + this.NEO4J + " " + this.CLOUDANT + " " + this.BIGTABLE + " " + this.BIGQUERY + " " + this.FTP + " " + this.DYNAMO ;

        //NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE
        //data["NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE"].value = this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_MIN + " " + this.NDC_THRESHOLD_TIME_TO_MARK_APP_INACTIVE_MAX;

        //NDP_SEQ_BLOB_IN_FILE_FLAG
        data["NDP_SEQ_BLOB_IN_FILE_FLAG"].value = this.NDP_SEQ_BLOB_IN_FILE_FLAG_VAL + " " + this.NDP_SEQ_BLOB_IN_FILE_FLAG_VER + " " + this.NDP_SEQ_BLOB_IN_FILE_FLAG_SIZE;

        //NDC_HS_ST_IN_FILE_FLAG
        data["NDC_HS_ST_IN_FILE_FLAG"].value = this.NDC_HS_ST_IN_FILE_FLAG_VAL + " " + this.NDC_HS_ST_IN_FILE_FLAG_VER;

        //ND_FPI_MASK
        data["ND_FPI_MASK"].value = "NDEID:" + this.ndeId1 + ":" + this.ndeId2 + ";AppID:" + this.appId1 + ":" + this.appId2 + ";TS:" + this.timestamp1 + ":" + this.timestamp2 + ";SeqNo:" + this.seqNo1 + ":" + this.seqNo2 + ";"

        //SERVER_BLACKLIST_SETTINGS
        if(this.isServerBlacklistSettings)
            data["SERVER_BLACKLIST_SETTINGS"].value = 1 + " " + this.connDisscntDuration + " " + this.numCounts + " " + this.serverBlockDuration;
        else
        {
            this.connDisscntDuration = 60;
            this.numCounts = 3;
            this.serverBlockDuration = 1800;
            data["SERVER_BLACKLIST_SETTINGS"].value = 0 + " " + this.connDisscntDuration + " " + this.numCounts + " " + this.serverBlockDuration;
        }
        return data;
    }

    //Method to reset the default values of the keywords
    resetKeywordData() {
        this.getNDCKeywords()
    }

    /* This method is used to reset the keyword data to its Default value */
    resetKeywordsDataToDefault() {
        // Getting NDC keywords data from Server
        this._configKeywordsService.getNDCKeywords(this.appId).subscribe(data => {
            var keywordDataVal = {}
            keywordDataVal = data
            this.keywordList.map(function (key) {
                keywordDataVal[key].value = data[key].defaultValue
            })
            this.splitKeywords(keywordDataVal);
            this.ndcKeywords = keywordDataVal;
            // this.store.dispatch({ type: NDC_KEYWORD_DATA, payload: data });
        });
    }

    createDataForTable(data) {
        let tableData = [];
        this.customKeywordsList = [];
        for (let key in data) {
            if (data[key]['assocId'] != -1 && (data[key]['type'] == 'NDP' || data[key]['type'] == 'NDC' || data[key]['type'] == 'NDC#' || data[key]['type'] == 'NDP#')) {
                this.customKeywords = new NDCCustomKeywordsComponentData();
                this.customKeywords.ndcKeyId = data[key]["ndcKeyId"];
                this.customKeywords.keywordName = key;
                this.customKeywords.value = data[key]["value"];
                this.customKeywords.description = data[key]['desc'];
                this.customKeywords.type = data[key]['type'];
                this.pipeForType.transform(this.customKeywords.type)
                this.customKeywords.assocId = data[key]["assocId"];
                this.customKeywords.defaultValue = data[key]["defaultValue"];
                this.customKeywords.min = data[key]["min"];
                tableData.push(this.customKeywords);
            }
        }

        this.customKeywordsTypeList = ConfigUiUtility.createListWithKeyValue(this.keywordTypeValue.sort(), this.keywordTypeValue.sort());
        this.customKeywordsDataList = tableData
    }

    /**For showing add  dialog */
    openAddDialog(): void {
        this.customKeywords = new NDCCustomKeywordsComponentData();
        this.isNew = true;
        this.addEditDialog = true;
    }

    /**For showing edit dialog */
    openEditDialog(): void {
        if (!this.selectedCustomKeywordsData || this.selectedCustomKeywordsData.length < 1) {
            this.configUtilityService.errorMessage("Select a row to edit");
            return;
        }
        else if (this.selectedCustomKeywordsData.length > 1) {
            this.configUtilityService.errorMessage("Select only one row to edit");
            return;
        }
        this.customKeywords = new NDCCustomKeywordsComponentData();
        this.customKeywords = Object.assign({}, this.selectedCustomKeywordsData[0]);
        if (this.selectedCustomKeywordsData[0].type == "NDP#") {
            this.customKeywords.type = "NDP"
        }
        else if (this.selectedCustomKeywordsData[0].type == "NDC#") {
            this.customKeywords.type = "NDC"
        }
        else {
            this.customKeywords.type = this.selectedCustomKeywordsData[0].type
        }
        // this.getKeywordList(this.customKeywords.type)
        this.customKeywords.keywordName = this.selectedCustomKeywordsData[0].keywordName
        this.isNew = false;
        this.addEditDialog = true;
    }

    getKeywordList(type) {
        this.customKeywordsList = [];
        for (let key in this.custom_keywords) {
            if (null != this.custom_keywords[key].type) {
                if (this.custom_keywords[key].type.includes(type) && this.custom_keywords[key].assocId == -1) {
                    this.customKeywordsList.push({ 'value': key, 'label': key });
                }
            }
        }
    }

    saveCustomKeywords() {
        this.custom_keywords = cloneObject(this.custom_keywords);
        let keywordExistFlag = false;
        //To check that keyword name already exists or not
        if (this.customKeywordsDataList.length != 0) {
            for (let i = 0; i < this.customKeywordsDataList.length; i++) {
                //checking (isNew) for handling the case of edit functionality
                if (this.isNew && this.customKeywordsDataList[i].keywordName == this.customKeywords.keywordName) {
                    this.configUtilityService.errorMessage("Provided settings already exists");
                    return;
                }
            }
        }

        for (let key in this.custom_keywords) {
            if (key == this.customKeywords.keywordName) {
                this.custom_keywords[key].value = this.customKeywords.value;
                this.custom_keywords[key].desc = this.customKeywords.description;
                keywordExistFlag = true;
            }
        }

        if (this.isNew) {
            this.message = "Added Successfully";
        }
        else {
            this.message = "Edited Successfully";
        }

        if (!keywordExistFlag) {
            this.configUtilityService.errorMessage(customKeywordMessage);
            return;
        }

        this.isNew = false;
        this.selectedCustomKeywordsData = [];
        this._configKeywordsService.saveNDCKeywords(this.custom_keywords, this.appId, false).subscribe(data => {
            this.custom_keywords = data;
            this.createDataForTable(data);
            this._configUtilityService.successMessage(this.message);
            this.store.dispatch({ type: NDC_KEYWORD_DATA, payload: data });
        });
        this.addEditDialog = false;
    }

    // This method is used to delete(disable) the keyword
    deleteCustomKeywords() {
        this.confirmationService.confirm({
            message: 'Do you want to delete the selected row?',
            header: 'Delete Confirmation',
            icon: 'fa fa-trash',
            accept: () => {
                this._configKeywordsService.deleteNDCKeywords(this.selectedCustomKeywordsData, this.appId).subscribe(data => {
                    if (data == "OK") {
                        this.getNDCKeywords();
                        this._configUtilityService.successMessage("Deleted successfully");
                    }
                });
            },
            reject: () => {
            }
        });
    }

    saveKeywordData() {
        this._configKeywordsService.saveNDCKeywordsOnFile(this.custom_keywords, this.appId).subscribe(data => {
            this.custom_keywords = data;
            this.custom_keywords = Object.assign(this.ndcKeywords, this.custom_keywords)
            this._configUtilityService.successMessage("Saved Successfully");
        });
    }

    /**
     * Purpose : To invoke the service responsible to open Help Notification Dialog 
     * related to the current component.
     */
    sendHelpNotification() {
        this._configKeywordsService.getHelpContent("Application", "ND Server Settings", "");
    }
    //On changing Type from Dialog , Method changeOfType() invoked to load corresponding Dropdown
    changeOfType() {
        if (this.customKeywords.type == 'NDC') {
            this.getKeywordList('NDC');
        }
        else {
            this.getKeywordList('NDP');
        }
    }

    //Percentile
    // saveBTPercentileTiers() {
    //     //For Adding New Rows in BT Percentile table
    //     if (this.isNewBTPercentile) {
    //         if (this.percentileKeywordsDetails.tierList == undefined || this.percentileKeywordsDetails.isInclude == undefined) {
    //             this.configUtilityService.errorMessage("Please select Tier Name and Type")
    //             return;
    //         }
    //         if (this.percentileKeywordsDetails.isInclude == 'INCLUDE') {
    //             if (this.percentileKeywordsDetails.selectedFormat == undefined || this.percentileKeywordsDetails.selectedTime == undefined) {
    //                 this.configUtilityService.errorMessage("Please select Time Format and Duration");
    //                 return;
    //             }
    //         }
    //         if (this.percentileKeywordsDetails.isInclude == 'INCLUDE')
    //             this.percentileKeywordsDetails.timeAndFormat = this.percentileKeywordsDetails.selectedTime + this.percentileKeywordsDetails.selectedFormat;
    //         else {
    //             this.percentileKeywordsDetails.timeAndFormat = '-';
    //         }
    //         this.percentileKeywordsData = ImmutableArray.push(this.percentileKeywordsData, this.percentileKeywordsDetails)

    //         for (let key in this.dropDownOptionForTiersName) {
    //             let i = +key;
    //             let obj = this.dropDownOptionForTiersName[key];
    //             if (obj.value == this.percentileKeywordsDetails.tierList) {
    //                 this.dropDownOptionForTiersName.splice(i, 1);
    //             }
    //         }
    //         this.percentileKeywordsDetails = new PercentileKeywords();
    //     }
    //     //For Editing Row in BT Percentile table
    //     else {
    //         if (this.percentileKeywordsDetails.isInclude == 'INCLUDE')
    //             this.percentileKeywordsDetails.timeAndFormat = this.percentileKeywordsDetails.selectedTime + this.percentileKeywordsDetails.selectedFormat;
    //         else {
    //             this.percentileKeywordsDetails.timeAndFormat = '-';
    //         }
    //         let index = this.getBTPercentileIndex();
    //         this.selectedPercentileKeywordsData.length = 0;
    //         this.percentileKeywordsData = ImmutableArray.replace(this.percentileKeywordsData, this.percentileKeywordsDetails, index);
    //         this.configUtilityService.successMessage("Edited Successfully");
    //         for (let key in this.dropDownOptionForTiersName) {
    //             let i = +key;
    //             let obj = this.dropDownOptionForTiersName[key];
    //             if (obj.value == this.percentileKeywordsDetails.tierList) {
    //                 this.dropDownOptionForTiersName.splice(i, 1);
    //             }
    //         }
    //         this.percentileKeywordsDetails = new PercentileKeywords();
    //         this.isNewBTPercentile = true;
    //     }
    // }

    // editBTPercentile() {
    //     this.isNewBTPercentile = false;
    //     if (!this.selectedPercentileKeywordsData || this.selectedPercentileKeywordsData.length < 1) {
    //         this.configUtilityService.errorMessage("Select a row to edit");
    //         return;
    //     }
    //     else if (this.selectedPercentileKeywordsData.length > 1) {
    //         this.configUtilityService.errorMessage("Select only one row to edit");
    //         return;
    //     }
    //     this.percentileKeywordsDetails = new PercentileKeywords();
    //     let a = this.selectedPercentileKeywordsData[0].tierList;
    //     this.dropDownOptionForTiersName.push({ label: a, value: a });
    //     this.percentileKeywordsDetails = Object.assign({}, this.selectedPercentileKeywordsData[0]);
    //     this.loadValue();
    // }

    // getBTPercentileIndex(): number {
    //     if (this.selectedPercentileKeywordsData[0]) {
    //         let tier = this.selectedPercentileKeywordsData[0].tierList;
    //         for (let i = 0; i < this.percentileKeywordsData.length; i++) {
    //             if (this.percentileKeywordsData[i].tierList == tier) {
    //                 return i;
    //             }
    //         }
    //     }
    //     return -1;
    // }

    /**This method is used to delete BTPercentileKeyword */
    // deleteBTPercentile(): void {
    //     if (!this.selectedPercentileKeywordsData || this.selectedPercentileKeywordsData.length < 1) {
    //         this.configUtilityService.errorMessage("Select row(s) to delete");
    //         return;
    //     }
    //     //Get Selected BTPercentile's BTId
    //     let selectedBT = this.selectedPercentileKeywordsData;

    //     let arrBTPercentile = [];

    //     for (let index in selectedBT) {
    //         arrBTPercentile.push(selectedBT[index].tierList);
    //     }
    //     this.deleteBTPercentileFromTable(arrBTPercentile);
    //     for (let bt of arrBTPercentile) {
    //         this.dropDownOptionForTiersName.push({ label: bt, value: bt });
    //     }
    //     //sorting on the basis of value of array
    //     this.dropDownOptionForTiersName.sort(function (a, b) {
    //         if (a.value < b.value) { return -1; }
    //         if (a.value > b.value) { return 1; }
    //         return 0;
    //     })
    //     this.selectedPercentileKeywordsData = [];
    // }

    /**This method is used to delete  from Data Table */
    // deleteBTPercentileFromTable(arrIndex) {
    //     let rowIndex: number[] = [];

    //     for (let index in arrIndex) {
    //         rowIndex.push(this.getBTPercentile(arrIndex[index]));
    //     }
    //     this.percentileKeywordsData = deleteMany(this.percentileKeywordsData, rowIndex);
    // }
    /**This method returns selected BTPercentile row on the basis of selected row */
    // getBTPercentile(tier: any): number {
    //     for (let i = 0; i < this.percentileKeywordsData.length; i++) {
    //         if (this.percentileKeywordsData[i].tierList == tier) {
    //             return i;
    //         }
    //     }
    //     return -1;
    // }
    //Load Value while selecting format 
    // loadValue() {
    //     if (this.percentileKeywordsDetails.selectedFormat == 'm')
    //         this.dropDownOptionForMinuteTime = ConfigUiUtility.createListWithKeyValue(this.minuteTimeLabel, this.minuteTimeValue);
    //     else if(this.percentileKeywordsDetails.selectedFormat == 'hr')
    //         this.dropDownOptionForMinuteTime = ConfigUiUtility.createListWithKeyValue(this.hourTimeLabel, this.hourTimeValue);
    // }


    //Load Value while selecting format For IP 
    // loadValueForIP() {
    //     if (this.percentileKeywordsIPDetails.selectedFormat == 'm')
    //         this.dropDownForIPMinuteTime = ConfigUiUtility.createListWithKeyValue(this.minuteTimeLabel, this.minuteTimeValue);
    //     else if (this.percentileKeywordsIPDetails.selectedFormat == 'hr')
    //         this.dropDownForIPMinuteTime = ConfigUiUtility.createListWithKeyValue(this.hourTimeLabel, this.hourTimeValue);
    // }
    //Fill undefined  while selecting exclude
    // loadValueForFormatAndVAlue() {
    //     if (this.percentileKeywordsDetails.isInclude == 'EXCLUDE') {
    //         this.percentileKeywordsDetails.selectedFormat = undefined;
    //         this.percentileKeywordsDetails.selectedTime = undefined;
    //     }

    //     if (this.percentileKeywordsIPDetails.isInclude == 'EXCLUDE') {
    //         this.percentileKeywordsIPDetails.selectedFormat = undefined;
    //         this.percentileKeywordsIPDetails.selectedTime = undefined;
    //     }

    // }

    //Delete Tier(i.e already present in table) from Dropdown (i.e Array)
    // removeTier() {
    //     this._configKeywordsService.getTierList(this.topoName).subscribe(data => {
    //         this.tierName = [];
    //         // this.tierName.push('All');
    //         let indexToDelete = [];
    //         data.push('All')
    //         data = data.filter((tier, i) => {
    //             for (let tn of this.btPercTierToRemove) {
    //                 if (tier.includes(tn)) {
    //                     indexToDelete.push(i);
    //                 }
    //             }
    //             return data;
    //         })
    //         data = deleteMany(data, indexToDelete);
    //         this.tierName.push(...data);
    //         // this.dropDownOptionForTiersName = ConfigUiUtility.createDropdown(this.tierName);

    //         // this.loadValue();
    //         // this.dropDownOptionForMinuteTime = ConfigUiUtility.createListWithKeyValue(this.minuteTimeLabel, this.minuteTimeValue);
    //         // this.dropDownOptionForMinuteTime = ConfigUiUtility.createListWithKeyValue(this.hourTimeLabel, this.hourTimeValue);


    //         this.dropDownOption = ConfigUiUtility.createListWithKeyValue(this.dropDownValue, this.dropDownLabel);
    //         this.dropDownOptionForInvalidServer = ConfigUiUtility.createListWithKeyValue(this.dropDownLabel, this.dropDownValue);
    //         // this.dropDownOptionForIncludeExclude = ConfigUiUtility.createDropdown(this.includeExcludeLabel);
    //         // this.dropDownOptionForFormat = ConfigUiUtility.createListWithKeyValue(this.formatLabel, this.formatValue);
    //     });
    // }


    //Percentile
    // saveBTPercentileIPTiers() {
    //     //For Adding New Rows in BT Percentile table
    //     if (this.isNewBTIPPercentile) {
    //         if (this.percentileKeywordsIPDetails.tierList == undefined || this.percentileKeywordsIPDetails.isInclude == undefined) {
    //             this.configUtilityService.errorMessage("Please select Tier Name and Type")
    //             return;
    //         }
    //         if (this.percentileKeywordsIPDetails.isInclude == 'INCLUDE') {
    //             if (this.percentileKeywordsIPDetails.selectedFormat == undefined || this.percentileKeywordsIPDetails.selectedTime == undefined) {
    //                 this.configUtilityService.errorMessage("Please select Time Format and Duration");
    //                 return;
    //             }
    //         }
    //         if (this.percentileKeywordsIPDetails.isInclude == 'INCLUDE') {
    //             this.percentileKeywordsIPDetails.timeAndFormat = this.percentileKeywordsIPDetails.selectedTime + this.percentileKeywordsIPDetails.selectedFormat;
    //         }
    //         else {
    //             this.percentileKeywordsIPDetails.timeAndFormat = '-';
    //         }
    //         this.percentileKeywordsIPData = ImmutableArray.push(this.percentileKeywordsIPData, this.percentileKeywordsIPDetails)

    //         for (let key in this.dropDownForIPTiersName) {
    //             let i = +key;
    //             let obj = this.dropDownForIPTiersName[key];
    //             if (obj.value == this.percentileKeywordsIPDetails.tierList) {
    //                 this.dropDownForIPTiersName.splice(i, 1);
    //             }
    //         }
    //         this.percentileKeywordsIPDetails = new PercentileKeywords();
    //     }
    //     //For Editing Row in BT Percentile table
    //     else {
    //         if (this.percentileKeywordsIPDetails.isInclude == 'INCLUDE')
    //             this.percentileKeywordsIPDetails.timeAndFormat = this.percentileKeywordsIPDetails.selectedTime + this.percentileKeywordsIPDetails.selectedFormat;
    //         else {
    //             this.percentileKeywordsIPDetails.timeAndFormat = '-';
    //         }
    //         let index = this.getBTIPPercentileIndex();
    //         this.selectedpercentileKeywordsIPData.length = 0;
    //         this.percentileKeywordsIPData = ImmutableArray.replace(this.percentileKeywordsIPData, this.percentileKeywordsIPDetails, index);
    //         this.configUtilityService.successMessage("Edited Successfully");
    //         for (let key in this.dropDownForIPTiersName) {
    //             let i = +key;
    //             let obj = this.dropDownForIPTiersName[key];
    //             if (obj.value == this.percentileKeywordsIPDetails.tierList) {
    //                 this.dropDownForIPTiersName.splice(i, 1);
    //             }
    //         }
    //         this.percentileKeywordsIPDetails = new PercentileKeywords();
    //         this.isNewBTIPPercentile = true;
    //     }
    // }

    // editBTIPPercentile() {
    //     this.isNewBTIPPercentile = false;
    //     if (!this.selectedpercentileKeywordsIPData || this.selectedpercentileKeywordsIPData.length < 1) {
    //         this.configUtilityService.errorMessage("Select a row to edit");
    //         return;
    //     }
    //     else if (this.selectedpercentileKeywordsIPData.length > 1) {
    //         this.configUtilityService.errorMessage("Select only one row to edit");
    //         return;
    //     }
    //     this.percentileKeywordsIPDetails = new PercentileKeywords();
    //     let a = this.selectedpercentileKeywordsIPData[0].tierList;
    //     this.dropDownForIPTiersName.push({ label: a, value: a });
    //     this.percentileKeywordsIPDetails = Object.assign({}, this.selectedpercentileKeywordsIPData[0]);
    //     this.loadValueForIP();
    // }


    //New
    // /**This method is used to delete BTPercentileKeyword */
    // deleteBTIPPercentile(): void {
    //     if (!this.selectedpercentileKeywordsIPData || this.selectedpercentileKeywordsIPData.length < 1) {
    //         this.configUtilityService.errorMessage("Select row(s) to delete");
    //         return;
    //     }
    //     //Get Selected BTPercentile's BTId
    //     let selectedBT = this.selectedpercentileKeywordsIPData;

    //     let arrBTPercentile = [];

    //     for (let index in selectedBT) {
    //         arrBTPercentile.push(selectedBT[index].tierList);
    //     }
    //     this.deleteBTIPPercentileFromTable(arrBTPercentile);
    //     for (let bt of arrBTPercentile) {
    //         this.dropDownForIPTiersName.push({ label: bt, value: bt });
    //     }
    //     //sorting on the basis of value of array
    //     this.dropDownForIPTiersName.sort(function (a, b) {
    //         if (a.value < b.value) { return -1; }
    //         if (a.value > b.value) { return 1; }
    //         return 0;
    //     })
    //     this.selectedpercentileKeywordsIPData = [];
    // }

    /**This method is used to delete  from Data Table */
    // deleteBTIPPercentileFromTable(arrIndex) {
    //     let rowIndex: number[] = [];

    //     for (let index in arrIndex) {
    //         rowIndex.push(this.getBTIPPercentile(arrIndex[index]));
    //     }
    //     this.percentileKeywordsIPData = deleteMany(this.percentileKeywordsIPData, rowIndex);
    // }
    /**This method returns selected BTPercentile row on the basis of selected row */
    // getBTIPPercentile(tier: any): number {
    //     for (let i = 0; i < this.percentileKeywordsIPData.length; i++) {
    //         if (this.percentileKeywordsIPData[i].tierList == tier) {
    //             return i;
    //         }
    //     }
    //     return -1;
    // }


    // getBTIPPercentileIndex(): number {
    //     if (this.selectedpercentileKeywordsIPData[0]) {
    //         let tier = this.selectedpercentileKeywordsIPData[0].tierList;
    //         for (let i = 0; i < this.percentileKeywordsIPData.length; i++) {
    //             if (this.percentileKeywordsIPData[i].tierList == tier) {
    //                 return i;
    //             }
    //         }
    //     }
    //     return -1;
    // }





    //Delete Tier(i.e already present in table) from Dropdown (i.e Array) For IP
    // removeTierForIP() {
    //     this._configKeywordsService.getTierList(this.topoName).subscribe(data => {
    //         this.tierName = [];
    //         // this.tierName.push('All');
    //         let indexToDelete = [];
    //         data.push('All')
    //         data = data.filter((tier, i) => {
    //             for (let tn of this.btPercTierToRemoveForIP) {
    //                 if (tier.includes(tn)) {
    //                     indexToDelete.push(i);
    //                 }
    //             }
    //             return data;
    //         })
    //         data = deleteMany(data, indexToDelete);
    //         this.tierName.push(...data);
    //         // this.dropDownForIPTiersName = ConfigUiUtility.createDropdown(this.tierName);

    //         // this.loadValueForIP();
    //         this.dropDownOption = ConfigUiUtility.createListWithKeyValue(this.dropDownValue, this.dropDownLabel);
    //         this.dropDownOptionForInvalidServer = ConfigUiUtility.createListWithKeyValue(this.dropDownLabel, this.dropDownValue);
    //         // this.dropDownForIPIncludeExclude = ConfigUiUtility.createDropdown(this.includeExcludeLabel);
    //         // this.dropDownForIPFormat = ConfigUiUtility.createListWithKeyValue(this.formatLabel, this.formatValue);
    //     });
    // }

    //Check the default Value of the Custom Keywords
    checkMinMax(minmax) {
        for (let key in this.custom_keywords) {
          if (key == this.customKeywords.keywordName) {
                if (+this.customKeywords.value == +this.custom_keywords[key]['defaultValue']) {
                minmax.setCustomValidity('Provided value should be different from default value')
              }
              else {
                minmax.setCustomValidity('')
              }
          }
        }
      }

/** Create type list with key value */
  createListWithKeyValueForCopyProf(arrLabel: string[], arrValue: any): SelectItem[] {
    let selectItemList = [];

    for (let index in arrLabel) {
        selectItemList.push({ label: arrLabel[index], value: arrValue[index] });
    }

    return selectItemList;
}

}
