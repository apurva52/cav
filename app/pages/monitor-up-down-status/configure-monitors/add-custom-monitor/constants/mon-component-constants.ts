export const TYPE = "type";
export const LABEL = "label";
export const VALUE = "value";
export const OLD_VALUE = "oldValue";
export const DEFAULT_VALUE = "defVal";
export const ARGUMENT = "arg";
export const OLD_ARGUMENT = "oldArg";
export const LIST_COMP = "list";
export const RADIO_ITEM = "items";
export const TABLE_COLUMN_DATA = "columnData";
export const DEPENDENT_COMP = "dependentComp";
export const VAL_FORMAT = "valFormat";

export const VIEW_SEPARATOR = "=";
export const SPACE_SEPARATOR = " ";

export const OPTION_KEY = "options";
export const OLD_OPTION_KEY = "oldOptions";
export const ARGDATA_KEY = "argumentData";

export const FIELDSET_TYPE = "FieldSet";
export const CHECKBOX_TYPE = "Checkbox";
export const DROPDOWN_TYPE = "Dropdown";
export const DROPDOWN_LIST = "dropDownList";
export const ACCORDION_TYPE = "Accordion";


export const URL_ENCODE = "uRLEncode";
export const VALIDATION_OBJ = "validationObj";
export const INPUT_TYPE = "inputType";
export const CHECK_MONITOR = "check-monitor";
export const REQUIRED = "required";

export const CHECK_MON = "Check Monitor"

export const STD_MON_TYPE = 0;
export const CHECK_MON_TYPE = 1;
export const SERVER_SIGNATURE_TYPE = 2;
export const LOG_PATTERN_MONITOR = "Log Pattern Monitor"
export const LOG_PATTERN_TYPE = 3;
export const GET_LOG_FILE = "Get Log File";
export const GET_LOG_FILE_TYPE = 4;
export const LOG_DATA_MON = "Log Data Monitor";
export const LOG_DATA_MON_TYPE = 5;

/***CHECK MON fields ****/
export const NAME = "name";
export const FROM_EVENT = "fromEvent";
export const PHASE_NAME = "phaseName";
export const FREQUENCY = "frequency";
export const PERIODICITY = "periodicity";
export const END_EVENT = "endEvent";
export const COUNT = "count";
export const END_PHASE_NAME = "endPhaseName";

export const FROM_EVENT_UI = "fromEvent_ui";
export const FREQUENCY_UI = "frequency_ui";
export const END_EVENT_UI = "endEvent_ui";

export const SIGN_TYPE = "signType";
export const CMDFILE_NAME = "commandFileName";
export const SERVER_SIGNATURE = "Server Signature";
export const CHECK_MON_PROG_NAME = "checkMonProgName";


export const MONITOR_STATE = "_ms";
export const MONITOR_NAME = "_mon";
//export const PASSWORD_SEPERATOR = "#";
export const PASSWORD_SEPERATOR = "cav_e";

/***Constants for confirmation messages**/
export const DELETE_MON_GROUP_MSG = "Are you sure to delete the selected monitor group(s)?";
export const START_TEST_MSG = "Are you sure to run test for ";
export const DELETE_ALL_CONFIGURATIONS = "Are you sure to delete all configurations?";
export const DELETE_SPECIFIC_CONFIGURATION = "Are you sure to delete the selected configuration(s)?"
export const DELETE_MON_MSG = "Are you sure to delete the selected monitor(s)?";
export const PERMANENT_DELETE_MON_MSG = "This monitor is already is in use,do you stil want to delete the selected monitor(s)?";

export const APP_NAME = "appName";
export const EXCLUDE_APP_NAME = "excludeAppName";
export const JAVA_HOME = "javaHome";
export const CLASS_PATH = "classPath";
export const INSTANCE_NAME = "instanceName";
export const GDF_NAME = "gdfName";
export const RUN_OPTIONS = "runOptions";
export const RUN_OPTIONS_UI = "runOptions_ui";
export const METRIC = "metric";
export const LOG_FILE_NAME = "fileName";
export const SEARCH_PATTERN = "searchPattern";
export const INSTANCE = "instance";
export const JOURNALD_FILE_NAME = "specificJournalType";


export const HC_FILEPATH = "";
export const HC_MONNAME = "ServerHealthExtendedStats";
export const HEALTH_CHECK_FILE_EXT = ".healthcheck";

export const EXCLUDE_TIER = "excludeTier";
export const ALL_TIER = "All Tiers";

export const EX_TIER_PREFIX = '$P:';

export const PWD_ENCRYPT_VAL = "pwdEncrypt";
export const ADVANCE_TABLE = "TableSingleArg";

export const IS_QUOTE_REQUIRED = "isQuoteRequired";
export const ARG_UI = "arg-";

export const TRAILING_CHARACTERS = "trailingChar";
export const ACTUAL_SERVER_NAME = "actualServerName";

export const FIELDSET_SEPERATOR = ":";
export const ALL_SERVERS = "All Servers";
export const AGENT_TYPE = "agentType";
export const AGENT = "agent";
export const ANY = "Any";       //for bug 73517

export const META_DATA = "metaData";
export const SNMP_MON = "SNMP Monitor";
export const CUSTOM_MON_TYPE = 6;
export const CUSTOM_INPUT_FILE = "cm_cav_snmp_";
export const CUSTOM_INPUT_FILE_EXT = ".inp";
export const SNMP_FILE_PATH = "/snmp/inp/";

export const DRIVEN_JSON_NAME = "_djn";
export const MON_INFO = "_monInfo";
export const DESCRIPTION = "_desc";


export const LOG_LINE_PATTERN = "logLinePattern";

//Added NF Constants
export const LOG_METRIC_MON = "Log Metric Monitor";
export const LOG_METRIC_MON_ID = 1;
export const NF_MON = "nfMonitor";
export const NF_MON_TYPE = 8;
export const NF_TYPE = "nf";

export const DVM_NAME = "dvm";
export const CONFIG_FILE_NAME = "configPath";
export const PROG_NAME = "progName";
export const USE_AGENT_NAME = "useAgent";
export const EXCLUDE_SERVER = "excludeServer"; // for bug 59104 - support of exclude server option

export const IS_HIDE = "isHide";        //added for bug-80674
//added for bug 
export const COMMA_SEPARATOR = ",";
//Added constants for command UI
export const CMD_TYPE = "cmd";
export const CMD_MON_TYPE = 9;

//for any tier/tiergroup	
export const TIER_NAME_TYPE = "tierName";
export const TIER_GROUP_TYPE = "tierGroup";
export const CAV_TIER_ANY_SERVER = "%cav_tier_any_server%";
export const CAV_TIER_GROUP_ANY_SERVER = "%cav_tiergroup_any_server%";
export const TIER_FOR_ANY_SERVER = "tierForAnyServer"
export const TIER_GROUP_FOR_ANY_SERVER = "tierGroupForAnyServer"

//  added for Batch Jobs
export const BATCH_JOBS = "Batch Jobs"
export const BATCH_JOBS_TYPE = 10;
export const BATCH_SEARCH_PATTERN = "batchSearchPattern";
export const BATCH_LOG_FILE_NAME = "logFile";
export const COMMAND_NAME = "cmdName";
export const SUCCESS_CRITERIA = "successCriteria";
//these fields are added for future purpose.
export const F1 = "future1";
export const F2 = "future2";
export const F3 = "future3";
export const F4 = "future4";
export const F5 = "future5";
export const F6 = "future6";
export const SYSTEM_REST_TYPE = 12;
export const USE_SINGLE_VAL_TYPE = "useMultipleAsSingleValue";
export const HEALTH_CHECK_TYPE = 30;
export const SERVER_HEALTH_EXTENDED_V2 = "ServerHealth";
export const SERVER_HEALTH_EXTENDED_V2_GDF = "cm_server_health_status_v2.gdf";
export const PROGRAM_NAME_FOR_SERVER_HEALTH_EXTENDEDV2 = "cm_server_health_stats_v2";
export const FIXED_SERVER_HEALTH_EXTENDEDV2_ARG = "-s server -v";
export const JAVA = "java";
export const CUSTOM_DEPLOYMENT_DIR = ".deployment/";
export const DVM_VALUE_1 = "1";
export const AGENT_TYPE_CMON = "CMON";
export const PROGRAM_TYPE = "pgm";
export const SYSTEM_DEFINED_TYPE = "sysDef";  //for bug 58611

//Added constants for statsd UI
export const STATSD_TYPE = "statsd";
export const STATSD_MON_TYPE = 13;

export const MESSAGE_TYPE = "_msgT";
export const MESSAGE = "_msg";

export const  IS_PROCESS = "isProcess"; // for bug - 94588
export const  RUN_AS_PROCESS = "runProc"; // for bug -94588 

//Constants for generic DB UI
export const DB_TYPE = "db";
export const DB_MON_TYPE = 14;
export const DB_OUTPUT_SEPERATOR = "%SEP%";

export const LOG_NAME = "logName";
export const USE_AS_OPTION = "useAsOption";
export const USE_AS_OLD_OPTION = "useAsOldOption";
export const REMOTE_HIERARCHY_TIER = "${Tier}";
export const REMOTE_HIERARCHY_SERVER = "${Server}";

//constant for Product Type
export const SERVERNAME_ND = "NDAppliance";
export const SERVERNAME_NS = "NSAppliance";
export const PRODUCTMODE_ND = "netdiagnostics";

//Constants for JMX UI
export const JMX_TYPE = "jmx";
export const JMX_MON_TYPE = 15;
export const CUSTOM_MON_GDF_PREFIX = "cm_cav_"

export const SNMP_TYPE = "snmp";
export const OTHERS_KEY = "Others";
export const ALL_SERVERS_KEY = "All Servers";
export const DEFAULT_TOPO = "default";