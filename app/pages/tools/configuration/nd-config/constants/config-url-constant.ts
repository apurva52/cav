//export const  SERVICE_URL = 'https://10.10.50.16:17003/configUI';
//  const  SERVICE_URL = 'https://10.10.40.14/configUI';
// const  SERVICE_URL = 'http://localhost:8090';


//For Production use this SERVICE_URL
  export const SERVICE_URL = '/configUI';

//for running configUI as a standAlone
//export const ROUTING_PATH: string = "";

/* for running configUI with ProductUI*/
 export const ROUTING_PATH: string = "/nd-agent-config";

/* Url for Home Screen */
export const HOME_SCREEN_URL = `${SERVICE_URL}/home`;
export const UPDATE_TOPOLOGY = `${SERVICE_URL}/uploadtopology`;
export const GET_TOPO_LIST = `${SERVICE_URL}/gettopologylist`;
export const GET_TEST_RUN_STATUS = `${SERVICE_URL}/runningtestrunstatus`;
export const GET_RUNNING_APP = `${SERVICE_URL}/getrunningapp`;

/* Url for Application Table */
export const FETCH_APP_TABLE_DATA = `${SERVICE_URL}/custom/application/getAllApplication`;
export const APP_TREE_URL = `${SERVICE_URL}/custom/tree/application`;
export const ADD_ROW_APP_URL = `${SERVICE_URL}/custom/application`;
export const DEL_ROW_APP_URL = `${SERVICE_URL}/custom/application/delete`;
export const GET_APP_NAME = `${SERVICE_URL}/custom/application/getappname`;
export const ADD_TOPO_DETAILS = `${SERVICE_URL}/custom/application/addtopodetails`;

/* Url for DCDetail */
export const DC_TABLE_DATA_URL = `${SERVICE_URL}/application`;
export const ADD_ROW_DC_URL = `${SERVICE_URL}/custom/dcdetail`;
export const DEL_ROW_DC_URL = `${SERVICE_URL}/dcdetail`;

/* Url for Topology */
export const FETCH_TOPO_TABLE_URL = `${SERVICE_URL}/custom/topology`;
export const FETCH_TOPO_TREE_URL = `${SERVICE_URL}/custom/tree/ng/topology`;
export const DEL_TOPO_ROW_URL = `${SERVICE_URL}/dctopoassociation`;
export const ATTACH_PROFTO_TOPO = `${SERVICE_URL}/custom/topology`;
export const ATTACH_PROFTO_TOPO_BY_TOPOID = `${SERVICE_URL}/custom/topology/editprofile`;
export const ADD_ROW_TOPOLOGY_URL = `${SERVICE_URL}/custom/topology`;
export const TOGGLE_STATE_TOPOLOGY = `${SERVICE_URL}/custom/topology`;
export const DELETE_TOPOLOGY = `${SERVICE_URL}/custom/topology/deletetopology`;
export const CHECK_CHILD_PROFILE = `${SERVICE_URL}/custom/topology/checkchildprofile`;

/* Url for Profiles */
//export const FETCH_PROFILE_TABLEDATA = `${SERVICE_URL}/profiles`
export const FETCH_PROFILE_TABLEDATA = `${SERVICE_URL}/custom/profile/profilelist` 
//export const UPDATE_PROFILE_TABLE = `${SERVICE_URL}/profiles`
export const UPDATE_PROFILE_TABLE = `${SERVICE_URL}/custom/profile`
export const GET_PROFILE_NAME = `${SERVICE_URL}/custom/profile`;
export const DEL_PROFILE = `${SERVICE_URL}/custom/profile/delete`;
export const GET_PROFILE_AGENT = `${SERVICE_URL}/custom/profile/getprofileagent`;
export const FETCH_JAVA_PROFILE_TABLEDATA = `${SERVICE_URL}/custom/profile/javaprofilelist`
export const FETCH_DOTNET_PROFILE_TABLEDATA = `${SERVICE_URL}/custom/profile/dotnetprofilelist`
export const FETCH_NODEJS_PROFILE_TABLEDATA = `${SERVICE_URL}/custom/profile/nodejsprofilelist`
export const GET_APPLIED_PROFILE = `${SERVICE_URL}/custom/profile/getappliedprofile`
export const GET_APPLIED_PROFILE_DETAILS = `${SERVICE_URL}/custom/profile/getappliedprofiledetails`

/* URL for TierGroup */
export const FETCH_TIER_GROUP_TREE_URL = `${SERVICE_URL}/custom/tree/ng/tiergroup`;
export const FETCH_TIER_GROUP_TABLE_URL = `${SERVICE_URL}/custom/tiergroup`;
export const ATTACH_PROFTO_TIER_GROUP = `${SERVICE_URL}/custom/tiergroup`;

/* Url for Tier */
//export const FETCH_TIER_TREE_URL = `${SERVICE_URL}/custom/tree/tier`;
export const FETCH_TIER_TREE_URL = `${SERVICE_URL}/custom/tree/ng/tier`;

//export const FETCH_TIER_TABLE_URL = `${SERVICE_URL}/topology`;
export const FETCH_TIER_TABLE_URL = `${SERVICE_URL}/custom/tier`;
//export const FETCH_TIER_TABLE_URL = `${SERVICE_URL}/custom/tier/ng`;
export const ATTACH_PROFTO_TIER = `${SERVICE_URL}/custom/tier`;


/* Url for Server */
//export const FETCH_SERVER_TREE_URL = `${SERVICE_URL}/custom/tree/server`;
export const FETCH_SERVER_TREE_URL = `${SERVICE_URL}/custom/tree/ng/server`;
export const FETCH_SERVER_TABLE_URL = `${SERVICE_URL}/custom/server`;
export const ATTACH_PROFTO_SERVER = `${SERVICE_URL}/custom/server`;

/* Url for Instance */
export const FETCH_INSTANCE_TREE_URL = `${SERVICE_URL}/custom/tree/instance`;
export const FETCH_INSTANCE_TABLE_URL = `${SERVICE_URL}/custom/instance`;
export const ATTACH_PROFTO_INSTANCE = `${SERVICE_URL}/custom/instance`;
export const TOGGLED_INSTANCE_STATE = `${SERVICE_URL}/custom/instance`;
export const GET_SERVER_DIS_NAME = `${SERVICE_URL}/custom/instance/serverdisplayname`;
export const GET_INST_DESC = `${SERVICE_URL}/custom/instance/getdesc`;

/* Url for ServiceEntryPoint */
export const FETCH_SERVICE_POINTS_TABLEDATA = `${SERVICE_URL}/custom/profileserviceentryasso`;


export const FETCHING_SERVICE_ENTRYPOINTS_FORM = `${SERVICE_URL}/custom/profileserviceentryasso/getentrytypes`;
export const ADD_NEW_SERVICE_ENTRY_POINTS = `${SERVICE_URL}/custom/profileserviceentryasso`;
export const ENABLE_SERVICE_ENTRY_POINTS = `${SERVICE_URL}/custom/profileserviceentryasso`;
export const DEL_SERVICE_ENTRY_POINTS = `${SERVICE_URL}/custom/profileserviceentryasso/delete`;
export const EDIT_SERVICE_ENTRY_POINTS = `${SERVICE_URL}/custom/profileserviceentryasso/updateServiceEntry`;
export const SAVE_SERVICE_ENTRY_POINTS = `${SERVICE_URL}/custom/profileserviceentryasso/save`;

/*Url for Toggle */
export const UPDATE_TOGGLE_PROFSEPASSOC = `${SERVICE_URL}/custom/profileserviceentryasso`;


/* Url fot BussinessTransaction */
export const ADD_BT = `${SERVICE_URL}/custom/btGlobal`;
export const GET_BT = `${SERVICE_URL}/profiles`;
export const FETCH_LIST_GROUP_NAMES_FORM = `${SERVICE_URL}/btgroup`;
export const FETCH_BT_PATTERN_TABLEDATA = `${SERVICE_URL}/custom/btpattern`;
export const ADD_NEW_BT_PATTERN_DETAILS = `${SERVICE_URL}/custom/btpattern`;
export const ADD_NEW_BT_GROUP_DETAILS = `${SERVICE_URL}/custom/btpattern/addGroup`;
export const DEL_BT_PATTERN_DETAILS = `${SERVICE_URL}/custom/btpattern/delete`;
export const UPLOAD_FILE = `${SERVICE_URL}/custom/btpattern/uploadfile`;
export const FETCH_BT_NAMES = `${SERVICE_URL}/custom/btpattern/fetchbtnames`;
export const READ_GLOBAL_THRESHOLD_FILE = `${SERVICE_URL}/custom/btpattern/readglobalthresholdfile`;
export const SAVE_GLOBAL_THRESHOLD_FILE = `${SERVICE_URL}/custom/btpattern/saveglobalthresholdfile`;
export const UPDATE_BT_WITH_GLOBAL_THRESHOLD = `${SERVICE_URL}/custom/btpattern/updatebtwithglobalthreshold`;


/* Url fot BussinessTransactionGlobal */
export const FETCH_BT_GLOBAL_DATA = `${SERVICE_URL}/profiles`;


/* Url for Backend Detection */
export const FETCH_BACKEND_TABLEDATA = `${SERVICE_URL}/custom/backenddetection`;
// export const FETCH_BACKEND_TYPES = `${SERVICE_URL}/backendTypes`;
export const FETCH_BACKEND_TYPES = `${SERVICE_URL}/custom/backenddetection/getbackendtype`;
export const ADD_NEW_BACKEND_POINT = `${SERVICE_URL}/custom/backenddetection`;
export const UPDATE_BACKEND_POINT = `${SERVICE_URL}/custom/backenddetection/updatebackend`;
export const DEL_INTEGRATION_POINTS = `${SERVICE_URL}/custom/backenddetection/delete`;
export const SAVE_NEW_BACKEND_POINT = `${SERVICE_URL}/custom/backenddetection/save`;


//export const FETCH_ALL_TOPODATA = `${SERVICE_URL}/topology`;
export const FETCH_ALL_TOPODATA = `${SERVICE_URL}/custom/topology/getalltopologylist`;

/* URL for generating nd.conf file  */
export const GENERATE_ND_CONF = `${SERVICE_URL}/custom/application/ndconf`;

/* Url for General Keywords Screen*/
export const GET_KEYWORDS_DATA = `${SERVICE_URL}/custom/profilekeywords`;
export const UPDATE_KEYWORDS_DATA = `${SERVICE_URL}/custom/profilekeywords`;
export const GET_FILE_PATH = `${SERVICE_URL}/custom/profilekeywords/getfilepath`;
//export const UPDATE_KEYWORDS_DATA = `${SERVICE_URL}/custom/profilekeywords/updatekeywords`;
export const UPDATE_CUSTOM_KEYWORDS_DATA = `${SERVICE_URL}/custom/profilekeywords/profilecustomkeywords`;

/*Instrumentation Profile List*/
export const GET_INSTR_PROFILE_LIST = `${SERVICE_URL}/custom/profilekeywords/xmlfiles`;
export const COPY_XML_FILES = `${SERVICE_URL}/custom/profilekeywords/copyxmlfiles`;

/* URL for monitors  */
export const FETCH_METHOD_MON_TABLEDATA = `${SERVICE_URL}/custom/methodmonitor`;
export const ADD_METHOD_MONITOR = `${SERVICE_URL}/custom/methodmonitor`;
export const DEL_METHOD_MONITOR = `${SERVICE_URL}/custom/methodmonitor/delete`;
export const EDIT_ROW_METHOD_MONITOR_URL = `${SERVICE_URL}/custom/methodmonitor/updateMethodMonitor`;
export const UPLOAD_METHOD_MONITOR_FILE = `${SERVICE_URL}/custom/methodmonitor/uploadfile`;

export const SAVE_METHOD_MONITOR_FILE = `${SERVICE_URL}/custom/methodmonitor/save`;

/* URL for creating Method Monitor from AD and AI */
export const CREATE_METHOD_MONITOR_AND_VALIDATE_FQM_FROM_AD = `${SERVICE_URL}/custom/methodmonitor/createFqmFromAd`;
export const ADD_METHOD_MONITOR_FROM_AD = `${SERVICE_URL}/custom/methodmonitor/addMethodMonitorFromAIAD`;
export const CREATE_METHOD_MONITOR_AND_VALIDATE_FQM_FROM_AI = `${SERVICE_URL}/custom/methodmonitor/createFqmFromAi`;
export const ADD_METHOD_MONITOR_FROM_AI = `${SERVICE_URL}/custom/methodmonitor/addMethodMonitorFromAIAD`;


/* URL for exception monitors  */
export const FETCH_EXCEPTION_MON_TABLEDATA = `${SERVICE_URL}/custom/exceptionmonitor`;
export const ADD_EXCEPTION_MONITOR = `${SERVICE_URL}/custom/exceptionmonitor`;
export const DEL_EXCEPTION_MONITOR = `${SERVICE_URL}/custom/exceptionmonitor/delete`;
export const EDIT_ROW_EXCEPTION_MONITOR_URL = `${SERVICE_URL}/custom/exceptionmonitor/updateExceptionMonitor`;
export const UPLOAD_EXCEPTION_MONITOR_FILE = `${SERVICE_URL}/custom/exceptionmonitor/uploadfile`;

export const SAVE_EXCEPTION_MONITOR = `${SERVICE_URL}/custom/exceptionmonitor/save`;

/* URL for Error Detection  */
export const FETCH_ERROR_DETECTION_TABLEDATA = `${SERVICE_URL}/custom/errordetection`;
export const ADD_NEW_ERROR_DETECTION = `${SERVICE_URL}/custom/errordetection`;
export const DEL_ERROR_DETECTION = `${SERVICE_URL}/custom/errordetection/delete`;
export const EDIT_ERROR_DETECTION = `${SERVICE_URL}/custom/errordetection/updateErrorDetection`;
export const SAVE_ERROR_DETECTION = `${SERVICE_URL}/custom/errordetection/save`;


/*URL for Http Stats Condition*/
export const FETCH_HTTP_STATS_COND_TABLEDATA = `${SERVICE_URL}/custom/httpstatscondition`;
export const EDIT_ROW_HTTP_STATS_MONITOR_URL = `${SERVICE_URL}/custom/httpstatscondition/updateHTTPCond`;
export const GET_HTTP_HEADERS_lIST = `${SERVICE_URL}/custom/httpstatscondition/listofheaders`;
export const GET_TYPE_HTTP_STATS = `${SERVICE_URL}/custom/httpstatscondition/listoftypes`;
export const GET_LIST_OF_VALUETYPE = `${SERVICE_URL}/custom/httpstatscondition/listofvaluetypes`;
export const GET_LIST_OF_OPERATORS = `${SERVICE_URL}/custom/httpstatscondition/listofoperators`;
export const ADD_NEW_HTTP_STATS_COND = `${SERVICE_URL}/custom/httpstatscondition`;
export const DEL_HTTP_STATS_COND = `${SERVICE_URL}/custom/httpstatscondition/delete`;

export const SAVE_HTTP_STATS_COND = `${SERVICE_URL}/custom/httpstatscondition/save`;

export const UPLOAD_HTTPSTATS_MONITOR_FILE = `${SERVICE_URL}/custom/httpstatscondition/importfile`;

/*URL for RUNTIME changes*/
export const RUNTIME_CHANGE_TOPOLOGY = `${SERVICE_URL}/custom/runtimechange/topology`;
export const RUNTIME_CHANGE_TIER_GROUP = `${SERVICE_URL}/custom/runtimechange/tiergroup`;
export const RUNTIME_CHANGE_TIER = `${SERVICE_URL}/custom/runtimechange/tier`;
export const RUNTIME_CHANGE_SERVER = `${SERVICE_URL}/custom/runtimechange/server`;
export const RUNTIME_CHANGE_INSTANCE = `${SERVICE_URL}/custom/runtimechange/instance`;
export const RUNTIME_CHANGE_AUTO_INSTR = `${SERVICE_URL}/custom/runtimechange/autoinstrumentation`;
export const RUNTIME_CHANGE_INSTR_PROFILE = `${SERVICE_URL}/custom/runtimechange/editinstrumentationprofile`;
export const RUNTIME_CHANGE_PROFILE_LEVEL= `${SERVICE_URL}/custom/runtimechange/profilelevelrtc`;


/* URL for ND Agent Status */
export const FETCH_ND_AGENT_TABLEDATA = `${SERVICE_URL}/ndagent`;
export const FETCH_CMON_TABLEDATA = `${SERVICE_URL}/getcmondata`;
export const FETCH_CMON_ENV_KEYVALUE_EDIT = `${SERVICE_URL}/downloadcmonagentinfoforedit`;
export const FETCH_CMON_ENV_KEYVALUE_VIEW = `${SERVICE_URL}/downloadcmonagentinfoforview`;
export const UPDATE_CMON_ENV_KEYVALUE = `${SERVICE_URL}/updatecmonagentinfo`;
export const RESTART_CMON_ENV_AGENT = `${SERVICE_URL}/restartcmonagent`;

/* URL for SessionAtrributeMonitor */
export const FETCH_SESSION_ATTR_TABLEDATA = `${SERVICE_URL}/custom/sessionattrmonitor/getallsessionattrdata`;
export const ADD_SPECIFIC_ATTR = `${SERVICE_URL}/custom/sessionattrmonitor/addspecificattr`;
export const UPDATE_SESSION_TYPE = `${SERVICE_URL}/custom/sessionattrmonitor/updateSessionType`;
export const UPDATE_ATTR_VALUES = `${SERVICE_URL}/custom/sessionattrmonitor/updateAttrValues`;
export const ADD_ATTR_VALUES = `${SERVICE_URL}/custom/sessionattrmonitor/addAttrValues`;

export const DEL_ATTR_VALUES = `${SERVICE_URL}/custom/sessionattrmonitor/delattrvalues`;
export const UPDATE_SESSION_ATTR = `${SERVICE_URL}/custom/sessionattrmonitor/editsessionattr`;
export const DELETE_SESSION_ATTR = `${SERVICE_URL}/custom/sessionattrmonitor/delete`;
export const DELETE_ATTR_RULES  = `${SERVICE_URL}/custom/sessionattrmonitor/delattrrules`;

//export const DEL_ROW_SESSION_ATTR = `${SERVICE_URL}/custom/sessionattrmonitor/delSessionAttr`;

/*URL for btMethod */
export const ADD_BT_METHOD = `${SERVICE_URL}/custom/btmethod/addbtmethod`;
export const FETCH_BTMETHOD_URL = `${SERVICE_URL}/custom/btmethod/getallbtmethoddata`;
export const EDIT_BT_PATTERN_TABLEDATA = `${SERVICE_URL}/custom/btpattern/updateBTPattern`;
export const ADD_BTMETHOD_RULE = `${SERVICE_URL}/custom/btmethod/addbtmethodrule`;
export const EDIT_BTMETHOD = `${SERVICE_URL}/custom/btmethod/editbtmethod`;
export const UPDATE_BTMETHOD = `${SERVICE_URL}/custom/btmethod/updatebtmethod`;
export const DEL_METHOD_RULES = `${SERVICE_URL}/custom/btmethod/deleteRules`;
export const DEL_METHOD_BT = `${SERVICE_URL}/custom/btmethod/delete`;
export const DEL_METHOD_RULES_BT = `${SERVICE_URL}/custom/btmethod/deleteBtMethodrules`;
export const UPLOAD_BT_METHOD_FILE = `${SERVICE_URL}/custom/btmethod/uploadfile`;

export const UPDATE_BT_METHOD_PARENT_ID = `${SERVICE_URL}/custom/btmethod/updateparentid`; //Added for BT New Design
export const GET_BTMETHOD_ON_EDIT = `${SERVICE_URL}/custom/btmethod/getassocbtmethod`;//Added for BT New Design
export const UPDATE_RES_PARENT_ID = `${SERVICE_URL}/custom/btresponseheader/updateparentid`;//Added for BT New Design

export const GET_ASSOC_REQ_HDR = `${SERVICE_URL}/custom/bthttpheader/getassocreqhdr`;//Added for BT New Design
export const GET_ASSOC_RES_HDR = `${SERVICE_URL}/custom/btresponseheader/getassocreshdr`;//Added for BT New Design
export const GET_ASSOC_HTTP_BODY = `${SERVICE_URL}/custom/bthttpbody/getassochttpbody`;//Added for BT New Design
export const UPDATE_BODY_PARENT_ID = `${SERVICE_URL}/custom/bthttpbody/updateparentid`;//Added for BT New Design

/*URL for Main Save button of BT Transaction */
export const SAVE_BT_TRANSACTION = `${SERVICE_URL}/custom/bttransaction/save`;

/* URL for methodBasedCapturingData */
export const ADD_METHOD_BASED_CAPTURING = `${SERVICE_URL}/custom/methodbasedcapturing/addcustomdata`;
export const FETCH_METHOD_BASED_CUSTOMDATA = `${SERVICE_URL}/custom/methodbasedcapturing/getmethodbasedcapturedata`;
export const ADD_RETURN_TYPE = `${SERVICE_URL}/custom/methodbasedcapturing/addreturntype`;
export const ADD_ARGUMENT_TYPE = `${SERVICE_URL}/custom/methodbasedcapturing/argtype`;
export const DEL_METHOD_BASED_CAPTURING = `${SERVICE_URL}/custom/methodbasedcapturing/delete`;
export const UPDATE_METHODBASED_CUSTOMDATA = `${SERVICE_URL}/custom/methodbasedcapturing/updatemethodbasedcapture`;
export const DEL_CUSTOM_METHOD_RETURN_VALUE = `${SERVICE_URL}/custom/methodbasedcapturing/deletereturnvalue`;
export const DEL_CUSTOM_METHOD_ARG_VALUE = `${SERVICE_URL}/custom/methodbasedcapturing/deleteargvalue`;
export const EDIT_METHODBASED_CUSTOMDATA = `${SERVICE_URL}/custom/methodbasedcapturing/editmethodbasedcapture`;


export const UPDATE_CUSTOM_CAPTURE_DATA_FILE = `${SERVICE_URL}/custom/methodbasedcapturing/updatecustomcapturefile`;

export const DEL_HTTP_REQ_HDR = `${SERVICE_URL}/custom/httpreqbasedcapturing/delete`;
export const ADD_HTTP_REQ_HDR = `${SERVICE_URL}/custom/httpreqbasedcapturing/addhttpreqhdr`;
export const FETCH_HTTPREQ_HDR = `${SERVICE_URL}/custom/httpreqbasedcapturing/gethttpreqhdr`;
export const ADD_RULES_HTTPREQHDR = `${SERVICE_URL}/custom/httpreqbasedcapturing/addhttpreqhdrrules`;
export const UPDATE_HTTP_REQ_TYPE = `${SERVICE_URL}/custom/httpreqbasedcapturing/updatehttpreqtype`;

// export const UPDATE_HTTPREQHDR = `${SERVICE_URL}/custom/httpreqbasedcapturing/updatehttpreqbasedcustomdata`;
 export const UPDATE_HTTPREQHDR = `${SERVICE_URL}/custom/httpreqbasedcapturing/edithttpreqhdr`;
// export const DEL_HTTP_CUSTOM_DATA = `${SERVICE_URL}/custom/httpreqbasedcapturing/httpCustomData/delete`;
export const DELETE_HTTPREQHDR_RULES =  `${SERVICE_URL}/custom/httpreqbasedcapturing/deletehttpreqrules`;

/**** URL for independent topology structure *******/
export const TOPOLOGY_TREE_STRUCTURE = `${SERVICE_URL}/custom/tree/ng/topostruct`;
export const TOPOLOGY_STRUCT_TABLEDATA = `${SERVICE_URL}/custom/topology/topostruct`;



/**** URL for exception filters *******/

export const ADD_ADVANCE_EXCEPTION_FILTER=`${SERVICE_URL}/custom/exceptionfilters`;

export const FETCH_EXCETION_FILTERS_MON_TABLEDATA=`${SERVICE_URL}/custom/exceptionfilters`;

export const EDIT_ROW_EXCEPTION_FILTER_URL = `${SERVICE_URL}/custom/exceptionfilters/updateExceptionFilter`;

export const DEL_EXCEPTION_FILTER = `${SERVICE_URL}/custom/exceptionfilters/delete`;

export const UPLOAD_EXCEPTION_FILTER_FILE = `${SERVICE_URL}/custom/exceptionfilters/uploadfile`;
export const SAVE_ADVANCE_EXCEPTION_FILTER = `${SERVICE_URL}/custom/exceptionfilters/writefile`;

/**** URL for BT HTTP Headers */
export const BT_HTTP_HDR_URL = `${SERVICE_URL}/custom/bthttpheader`;
export const ADD_BT_HTTP_HDR_URL = `${SERVICE_URL}/custom/bthttpheader/addbthttpheader`;
export const FETCH_BTHTTP_HDR_URL = `${SERVICE_URL}/custom/bthttpheader/getallbthttphdrdata`;
export const DELETE_BT_HDR = `${SERVICE_URL}/custom/bthttpheader/delete`;
export const DEL_HTTP_HDR_COND = `${SERVICE_URL}/custom/bthttpheader/deletebthttpconditions`;
export const EDIT_BTHTTP_HEADER = `${SERVICE_URL}/custom/bthttpheader/editbthttpheader`;
export const UPLOAD_BT_HTTP_HDR_FILE = `${SERVICE_URL}/custom/bthttpheader/uploadfile`;

/**** URL for BT Response Headers */
export const UPDATE_REQ_PARENT_ID = `${SERVICE_URL}/custom/bthttpheader/updateparentid`;  //Added as per new design

export const BT_RESPONSE_HDR_URL = `${SERVICE_URL}/custom/btresponseheader`;
export const ADD_BT_RESPONSE_HDR_URL = `${SERVICE_URL}/custom/btresponseheader/addbtresponseheader`;
export const FETCH_BTRESPONSE_HDR_URL = `${SERVICE_URL}/custom/btresponseheader/getallbtresponsehdrdata`;
export const DELETE_BT_RESPONSE_HDR = `${SERVICE_URL}/custom/btresponseheader/delete`;
export const DEL_RESPONSE_HDR_COND = `${SERVICE_URL}/custom/btresponseheader/deletebtresponseconditions`;
export const EDIT_BTRESPONSE_HEADER = `${SERVICE_URL}/custom/btresponseheader/editbtresponseheader`;

/*Import Instrumentation Profile*/
export const GET_IMPORT_INSTRUMENT_PROFILE_XML = `${SERVICE_URL}/custom/instrumentation/xmlprofilemaker`;
export const GET_XML_INSTRUMENT_PROFILE = `${SERVICE_URL}/custom/instrumentation/xmlfiles`;
export const GET_XML_DATA_FROM_SELECTED_XML_FILE = `${SERVICE_URL}/custom/instrumentation/xmldatafromselectedxmlfile`;
export const GET_INSTR_PROFILE_DETAILS = `${SERVICE_URL}/custom/instrumentation/getinstrprofiledetails`;
export const GET_TOPO_NAME = `${SERVICE_URL}/custom/instrumentation/gettoponame`;

/*Edit Instrumentation Profile */
export const EDIT_XML_DATA_FROM_SELECTED_XML_FILE = `${SERVICE_URL}/custom/xmlInstrumentation/generatetreenodefromxml`;
export const SAVE_EDITED_XML_DATA_FROM_SELECTED_XML_FILE = `${SERVICE_URL}/custom/xmlInstrumentation/saveinstrumenteddatainxmlfile`;
export const DELETE_FILE = `${SERVICE_URL}/custom/xmlInstrumentation/deletefile`;

//Save and Edit Instrumentation Profile for JSON Profile
export const SAVE_EDITED_JSON_DATA_FROM_SELECTED_XML_FILE = `${SERVICE_URL}/custom/xmlInstrumentation/saveinstrumenteddatainJSONfile`;
export const EDIT_JSON_DATA_FROM_SELECTED_JSON_FILE = `${SERVICE_URL}/custom/xmlInstrumentation/editjsondatafromselectedjsonfile`;

/**Auto discover */
export const FETCH_AUTO_DISCOVERED_INSTANCE = `${SERVICE_URL}/custom/autodiscover/getadrfiles`;
export const DISCOVER_DATA = `${SERVICE_URL}/custom/autodiscover/getautodiscoverdata`;

export const GET_AUTO_DISCOVER_TREE_DATA = `${SERVICE_URL}/custom/autodiscover/getallAutoDiscoverData`;
export const GET_CLASS_DISCOVER_TREE_DATA = `${SERVICE_URL}/custom/autodiscover/getAutoDiscoverClassData`;
export const GET_AUTO_DISCOVER_SELECTED_TREE_DATA = `${SERVICE_URL}/custom/autodiscover/getSelectedAutoDiscoverData`;
export const GET_SELECTED_NODE_TREE_DATA = `${SERVICE_URL}/custom/autodiscover/getSelectedNodeTreeData`;
export const GET_UNINSTRUMENTATION_NODE_TREE_DATA = `${SERVICE_URL}/custom/autodiscover/uninstrumentationfqmdata`;

export const SAVE_INSTRUEMENTATION_DATA_XML = `${SERVICE_URL}/custom/autodiscover/saveinstrumentationdatainxmlformat`;

/* Activity Log data */
export const GET_ACTIVITY_LOG_DATA = `${SERVICE_URL}/custom/userActivityLog/getauditactivitylogdata`;

/* NDC Keyword URL */
export const GET_NDC_KEYWORDS = `${SERVICE_URL}/custom/ndckeywordsetting/getncdkeyworddata`;
export const SAVE_NDC_KEYWORDS = `${SERVICE_URL}/custom/ndckeywordsetting/savendckeyworddata`;
export const DELETE_NDC_KEYWORDS = `${SERVICE_URL}/custom/ndckeywordsetting/deletendckeyworddata`;
export const SAVE_NDC_KEYWORDS_ON_FILE = `${SERVICE_URL}/custom/ndckeywordsetting/savendckeyworddataonfile`;
export const GET_TIER_LIST = `${SERVICE_URL}/custom/ndckeywordsetting/getTierList`;

/* URL for auto-instrumentation */
export const APPLY_AUTO_INSTR = `${SERVICE_URL}/custom/autoinstrumentation/applyautoinstrumentation`;
export const GET_AUTO_INSTR_DATA = `${SERVICE_URL}/custom/autoinstrumentation/getaisettings`;
export const GET_AUTO_INSTR_TABLE_DATA = `${SERVICE_URL}/custom/autoinstrumentation/getaidetails`;
export const STOP_AUTO_INSTR = `${SERVICE_URL}/custom/autoinstrumentation/stopautoinstrumentation`;
export const UPDATE_AI_DETAILS = `${SERVICE_URL}/custom/autoinstrumentation/updateaidetails`;
export const FILE_EXIST_OR_NOT = `${SERVICE_URL}/custom/autoinstrumentation/fileexistornot`;

export const GET_REMOVED_PACKAGE_DATA = `${SERVICE_URL}/custom/autoinstrumentation/getremovedpackageList`;
export const GET_INSTRUEMENTATED_PACKAGE_DATA =`${SERVICE_URL}/custom/autoinstrumentation/getinstrumentatedlist`;
export const GET_CLASS_METHOD_RAW_DATA = `${SERVICE_URL}/custom/autoinstrumentation/getclsmethodrawlist`;
export const GET_SELECTED_REMOVED_INSTRUMENTED_DATA = `${SERVICE_URL}/custom/autoinstrumentation/getselectedremoveddatainstrumented`;
export const GET_UNINSTRUMENTATION_TREE_DATA = `${SERVICE_URL}/custom/autoinstrumentation/uninstrumentationfqmdata`;
export const SAVE_INSTRUEMENTATION_DATA_FILE = `${SERVICE_URL}/custom/autoinstrumentation/saveinstrumentationdatainxmlformat`;
export const GET_AI_STATUS = `${SERVICE_URL}/custom/autoinstrumentation/getstatus`;
export const DOWNLOAD_FILE = `${SERVICE_URL}/custom/autoinstrumentation/downloadfile`;
export const UPDATE_AI_ENABLE = `${SERVICE_URL}/custom/autoinstrumentation/updateaienable`;
export const DURATION_OVER_UPDATION = `${SERVICE_URL}/custom/autoinstrumentation/updatewhencompleted`;
export const DELETE_AI = `${SERVICE_URL}/custom/autoinstrumentation/delete`;
export const CHECK_INSTRUEMENTATION_XML_FILE_EXIST = `${SERVICE_URL}/custom/autoinstrumentation/checkinstrumentationxmlfileexist`;
export const GET_TOPOLOGY_DC_ID = `${SERVICE_URL}/custom/autoinstrumentation/gettopodcid`;
export const GET_AUTO_INSTR_DATA_SUMMARY = `${SERVICE_URL}/custom/autoinstrumentation/getaisummarydata`;

export const DEL_HTTP_REP_HDR = `${SERVICE_URL}/custom/httprepbasedcapturing/delete`;
export const ADD_HTTP_REP_HDR = `${SERVICE_URL}/custom/httprepbasedcapturing/addhttprephdr`;
export const FETCH_HTTPREP_HDR = `${SERVICE_URL}/custom/httprepbasedcapturing/gethttprephdr`;
export const ADD_RULES_HTTPREPHDR = `${SERVICE_URL}/custom/httprepbasedcapturing/addhttprephdrrules`;
export const UPDATE_HTTP_REP_TYPE = `${SERVICE_URL}/custom/httprepbasedcapturing/updatehttpreptype`;
export const UPDATE_HTTPREPHDR = `${SERVICE_URL}/custom/httprepbasedcapturing/edithttprephdr`;
export const DELETE_HTTPREPHDR_RULES =  `${SERVICE_URL}/custom/httprepbasedcapturing/deletehttpreprules`;

/**URL for import/export profile */
export const IMPORT_PROFILE = `${SERVICE_URL}/custom/importexport/importprofile`
export const EXPORT_PROFILE = `${SERVICE_URL}/custom/importexport/exportprofile`

/**URL for DDAI */
export const START_DD_AI = `${SERVICE_URL}/custom/DynamicDiagnostics/ddaitrigger`;

/* URL for Asynchronous Rule  */
export const FETCH_ASYNCHRONOUS_RULE_TABLEDATA = `${SERVICE_URL}/custom/ndasynchronousrule/getasynchronousrule`;
export const SAVE_ASYNCHRONOUS_RULE= `${SERVICE_URL}/custom/ndasynchronousrule/save`;
export const ENABLE_ASYNCHRONOUS_RULE_TYPE = `${SERVICE_URL}/custom/ndasynchronousrule`;

/* URL for get user Name */
export const LOGGED_USER_NAME = `${SERVICE_URL}/home/getusername`;

 /* URL to download file in doc/pdf/csv file format */
 export const DOWNLOAD_REPORTS = `${SERVICE_URL}/custom/download/downloadreports`;

/** URL for BT HTTP Body */
 export const ADD_BT_HTTP_BODY_URL = `${SERVICE_URL}/custom/bthttpbody/addbthttpbody`;
 export const FETCH_BTHTTP_BODY_URL = `${SERVICE_URL}/custom/bthttpbody/getallbthttpbodydata`;
 export const EDIT_BTHTTP_BODY = `${SERVICE_URL}/custom/bthttpbody/editbthttpbody`;
 export const DEL_HTTP_BODY_COND = `${SERVICE_URL}/custom/bthttpbody/deletebthttpbodycond`;
 export const DELETE_BT_BODY = `${SERVICE_URL}/custom/bthttpbody/delete`;

 /** URL for NDE Cluster Configuration */
 export const ADD_NDE_URL = `${SERVICE_URL}/custom/ndeclusterconfig/savende`;
 export const GET_NDE_DATA_URL = `${SERVICE_URL}/custom/ndeclusterconfig/getndedata`;
 export const DELETE_NDE_DATA_URL = `${SERVICE_URL}/custom/ndeclusterconfig/deletendedata`;
 export const EDIT_NDE_DATA_URL = `${SERVICE_URL}/custom/ndeclusterconfig/editndedata`;
 export const LOAD_TIER_GROUP_NAME_URL = `${SERVICE_URL}/custom/ndeclusterconfig/loadtiergrpnames`;

  /** URL for NDE Routing Rules */
  export const ADD_NDE_ROUTING_ROUTES_URL = `${SERVICE_URL}/custom/ndeclusterconfig/savenderoutingrules`;
  export const GET_NDE_SERVER_OBJ_URL = `${SERVICE_URL}/custom/ndeclusterconfig/getndeserver`;
  export const GET_ND_ROUTING_RULES_DATA_URL = `${SERVICE_URL}/custom/ndeclusterconfig/getnderoutingrules`;
  export const DELETE_NDE_ROUTING_RULES_URL = `${SERVICE_URL}/custom/ndeclusterconfig/deletenderoutingrules`;
  export const EDIT_NDE_ROUTING_RULES_URL = `${SERVICE_URL}/custom/ndeclusterconfig/editnderoutingrules`;

  /** URL for User configured Custom keywords */
  export const SAVE_USER_CONFIGURED_KEYWORDS = `${SERVICE_URL}/custom/customkeywords/saveuserconfiguredkeywords`;
  export const GET_USER_CONFIGURED_KEYWORDS = `${SERVICE_URL}/custom/customkeywords/getuserconfiguredkeywords`;
  export const DELETE_USER_CONFIGURED_KEYWORDS = `${SERVICE_URL}/custom/customkeywords/deleteuserconfiguredkeywords`;
  export const GET_CUSTOM_KEYWORDS_LIST = `${SERVICE_URL}/custom/customkeywords/getcustomkeywordslist`;
  export const CHECK_KEYWORD_ASSOCIATION = `${SERVICE_URL}/custom/customkeywords/checkkeywordassoc`;

 /** URL for User configured Custom NDC keywords */
 export const SAVE_USER_CONFIGURED_NDC_KEYWORDS = `${SERVICE_URL}/custom/customkeywords/saveuserconfiguredNDCkeywords`;
 export const GET_USER_CONFIGURED_NDC_KEYWORDS = `${SERVICE_URL}/custom/customkeywords/getuserconfiguredNDCkeywords`;
 export const DELETE_USER_CONFIGURED_NDC_KEYWORDS = `${SERVICE_URL}/custom/customkeywords/deleteuserconfiguredNDCkeywords`;
 export const GET_CUSTOM_NDC_KEYWORDS_LIST = `${SERVICE_URL}/custom/customkeywords/getcustomNDCkeywordslist`;
 export const CHECK_NDC_KEYWORD_ASSOCIATION = `${SERVICE_URL}/custom/customkeywords/checkndckeywordassoc`;
 export const EDIT_AGENT_KEYWORDS = `${SERVICE_URL}/custom/customkeywords/editagentkeyword`;
 export const EDIT_NDC_KEYWORDS = `${SERVICE_URL}/custom/customkeywords/editNDCkeyword`;

 /* Url for Backend Detection Interface */
 export const FETCH_BACKEND_INTERFACE_TABLEDATA = `${SERVICE_URL}/custom/backenddetectioninterface`;
 export const UPDATE_BACKEND_POINT_INTERFACE = `${SERVICE_URL}/custom/backenddetectioninterface/updatebackendinterface`;
 export const SAVE_INTERFACE_END_POINT = `${SERVICE_URL}/custom/backenddetectioninterface/save`;

 /* Url for Auto Injection Policy Rule */
 export const ADD_AUTO_INJECTION_POLICY_DATA = `${SERVICE_URL}/custom/autoinjection/addpolicyrule`;
 export const GET_AUTO_INJECTION_POLICY_DATA = `${SERVICE_URL}/custom/autoinjection/getpolicyrule`;
 export const EDIT_AUTO_INJECTION_POLICY_DATA = `${SERVICE_URL}/custom/autoinjection/editpolicyrule`;
 export const DELETE_AUTO_INJECTION_POLICY_DATA = `${SERVICE_URL}/custom/autoinjection/deletepolicyrule`;

 /* Url for Tag Injection Tag Rule */
 export const ADD_AUTO_INJECTION_TAG_DATA = `${SERVICE_URL}/custom/autoinjection/addtagconfigrule`;
 export const GET_AUTO_INJECTION_TAG_DATA = `${SERVICE_URL}/custom/autoinjection/gettagconfigrule`;
 export const EDIT_AUTO_INJECTION_TAG_DATA = `${SERVICE_URL}/custom/autoinjection/edittagconfigrule`;
 export const DELETE_AUTO_INJECTION_TAG_DATA = `${SERVICE_URL}/custom/autoinjection/deletetagconfigrule`;
 
 /* Url for Auto Injection Data On File */
 export const SAVE_AUTO_INJECTION_DATA_ON_FILE = `${SERVICE_URL}/custom/autoinjection/saveonfile`;

 /* Url for Uploading Auto Injection File */
 export const UPLOAD_AUTO_INJECTION_FILE = `${SERVICE_URL}/custom/autoinjection/uploadfile`;

 /** URL for BCI Logs */
 export const LIST_BCI_FILES = `${SERVICE_URL}/custom/bcilogs/listFiles`;
 export const DOWNLOAD_BCI_FILE = `${SERVICE_URL}/custom/bcilogs/downloadagentfile`;

/** URL for Global Settings*/
 export const GET_GLOBAL_SETTINGS = `${SERVICE_URL}/custom/customkeywords/getGlobalSettings`;
 export const SAVE_GLOBAL_SETTINGS = `${SERVICE_URL}/custom/customkeywords/saveGlobalSettings`;

/** URL to write json for try catch instrumentation exception */
export const SAVE_TRY_CATCH_INSTRUMENTATION = `${SERVICE_URL}/custom/exceptionfilters/writetrycatchinstrfile`;

export const FETCH_DL_APPLIED_PROF = `${SERVICE_URL}/custom/dl/getDLAppliedProfile`;

export const GET_DL_FQC_LIST = `${SERVICE_URL}/custom/dl/getFqcListUsingProfileId`;

export const GET_DL_FQM_LIST = `${SERVICE_URL}/custom/dl/getFqmListUsingFqcAndProfId`;

export const GET_TOPO_DETAILS = `${SERVICE_URL}/custom/dl/getTierServerInstanceName`;

export const GET_TR_NO_FROM_FILE = `${SERVICE_URL}/custom/dl/getTrNoFromFile`;

export const SAVE_MEM_PROF_DATA = `${SERVICE_URL}/custom/memoryprof/saveconfiguration`;

export const NDC_CONN_FOR_MEM_PROF = `${SERVICE_URL}/custom/memoryprof/ndcConnection`;

export const UPDATE_MEM_PROF_TXN_ID = `${SERVICE_URL}/custom/memoryprof/updatetxnid`;

export const DELETE_MEM_PROF_SESSION = `${SERVICE_URL}/custom/memoryprof/deletesession`;

export const GET_MEMORY_PROFILE_SESSIONS = `${SERVICE_URL}/custom/memoryprof/getmemoryprofsessions`;

export const GET_SESSION_RESPONSE_DATA = `${SERVICE_URL}/custom/memoryprof/readsessionresponse`;

export const SAVE_ADV_EXCEP_DATA = `${SERVICE_URL}/custom/exceptionfilters/advanceException`;