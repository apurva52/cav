export const OUTPUT_TYPE_LABEL =  ['String','Key'];
export const OUTPUT_TYPE_VALUE = ['1','2'];
export const DB_TYPE = "db";
export const SKIPLINE_LABEL =  ['First','Last'];
export const SKIPLINE_VALUE = ['first','last'];

export const DELIMETER_LABEL =  ['Space','Comma','Tab','Pipe','Custom'];
export const DELIMETER_VALUE = [' ',',','\t','|','custom'];

export const INP_TYPE_CMD= "cmd"; // input type is command

export const INP_TYPE_SCRIPT= "script"; //input type is script

export const SKIPLINE_TOP_LABEL =  ['--Select--','Skip line from top', 'Skip before line containing' ];
export const SKIPLINE_TOP_VALUE = ['','top', 'topActionStr'];

export const SKIPLINE_BOTTOM_LABEL =  ['--Select--','Skip line from bottom', 'Skip after line containing'];
export const SKIPLINE_BOTTOM_VALUE = ['','bottom', 'bottomActionStr'];

// Messages- error/success
export const ERROR_MSG_FOR_RUN_CMD_ON_TIER = "Select tier and server for execution";
export const ERROR_MSG_FOR_RUN_CMD_ON_SERVER = "Select server";
export const SUCCESS_MSG_ON_RUN_CMD = "Command/Script executed successfully";
export const ERROR_MSG_ON_RUN_CMD = "Command not found";
export const ERROR_MSG_FOR_EMPTY_CMD ="Enter command/script to run";
export const CONFIRMATION_MSG_ON_CHANGE_IN_OUTPUT_TYPE="Metric Hierarachy and Metric Configuration will be reset to default on change in output type. Are you sure to continue?";
export const ERROR_MSG_FOR_SAME_INDEXES = "You are having same indexes in metric hierarchy and metric configuration.Change index and save again";
export const ERROR_MSG_FOR_EMPTY_COMMAND_AT_SAVE = "Enter command";
export const ERROR_MSG_FOR_EMPTY_SCRIPT_AT_SAVE = "Enter script";
export const ERROR_MSG_FOR_METRIC_GRP_NAME = "Metric Group Name should be less than 64 characters"
export const ERROR_MSG_FOR_NO_METRIC_CONF = "Provide atleast one metric configuration."
export const ERROR_MSG_FOR_NO_METRIC_HIERARCHY = "Provide metric hierarchy."
export const ERR_MSG_FOR_EMPTY_METADATA = "Enter metric hierarchy component."
export const ERR_MSG_FOR_EMPTY_METRIC_NAME = "Enter metric name."
// dropdown list for authentication 
export const AUTH_LABEL =  ['Password', 'Public Key'];
export const AUTH_VALUE = ['1', '2'];

// constants used in DB UI
export const DRIVER_CLASS_LABEL =  ['--Select Driver Class--','MySQL','Oracle','IBM DB2 APP',
                                    'Microsoft SQL Server','Postgres','Others'];
export const DRIVER_CLASS_VALUE = ['', 'com.mysql.jdbc.Driver', 'oracle.jdbc.driver.OracleDriver','com.ibm.db2.jdbc.app.DB2Driver',
                                   'com.microsoft.sqlserver.jdbc.SQLServerDriver','org.postgresql.Driver',
                                   'Others'];

//used for db sslliLst
export const SSL_LABEL =  ['--Select SSL Type--','Jks','Pem','Cer','Others'];
export const SSL_VALUE = ['','Jks','Pem','Cer','Others'];     

//used for db MSSQL Authentication Mode
export const DB_AUTH_LABEL =  ['Windows Authentication','SQL Authentication'];
export const DB_AUTH_VALUE = ['0','1'];  

export const JMX_FILTER_LIST_LABEL = ['--Select filter--','Equals','Not Equals' , 'Less Than', 'Greater Than', 'Less Than Equal to', 'Greater Than Equal to'];
export const JMX_FILTER_LIST_VALUE = ['','equals','notEquals' , 'lessThan', 'greaterThan', 'lessThanEqualto', 'greaterThanEqualto'];

//Added constants for command UI
export const CMD_TYPE = "cmd";
export const CMD_MON_TYPE = 9;