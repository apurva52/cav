export const EXECUTE_TIME_LABEL =  ['--Select Start Event--','Before start of test','At start of test','On start of a phase','At end of test'];
export const  EXECUTE_TIME_VALUE = ['NA','1','2','3','90'];

export const  FREQUENYCY_LABEL = ['Never','Run Periodic'];
export const  FREQUENYCY_VALUE = ['2','1'];

export const END_EVENT_LABEL = ['--Select End Event--','Till test is over','Continue specified number of executions','Till specified phase is complete'];
export const END_EVENT_VALUE = ['NA','1','2','3']

export const RUN_OPTION_LABEL = ['Run Once', 'Run periodically till test is over'];
export const RUN_OPTION_VALUE = ['2','1'];

export const FILE_SELECTION_LABEL = ['Use file name', 'Use command to get the file name', 'Use JournalD'];
export const FILE_SELECTION_VALUE = ['-f','-c','-f __journald'];

export const METRICS_LIST_LABEL = ['Application Metrics', 'System Metrics', 'Custom Metrics'];
export const METRICS_LIST_VALUE = ['Application Metrics','System Metrics','Custom Metrics'];

export const FIELD_TYPE_LABEL = ['Field Number', 'Pattern','Field Number and Pattern'];
export const FIELD_TYPE_VALUE = ['Field Number', 'Pattern','Field Number and Pattern'];

export const DATA_TYPE_LABEL = ['sample','rate','cumulative','times','timesStd'];
export const DATA_TYPE_VALUE = ['sample','rate','cumulative','times','timesStd'];

export const FORMULA_TYPE_LABEL = ['None','Multiply By','Divide By','Bytes To kbps'];
export const FORMULA_TYPE_VALUE = ['None','Multiply By','Divide By','Bytes To kbps'];


export const METRIC_PRIORITY_LABEL = ['All','Medium and High','High'];
export const METRIC_PRIORITY_VALUE = ['L','M','H'];



export const CUSTOM_FORMULAE_LABEL = ['None','Multiply By','Divide By','MSToSec', 'PerSec'];
export const CUSTOM_FORMULAE_VALUE = ['None','MultiplyBy','DivideBy','MSToSec', 'PerSec'];

export const VERSION_LABEL  = ['1', '2c', '3'];
export const VERSION_VALUE = ['1', '2c', '3'];

export const RELATION_LABEL  = ['Yes', 'No'];
export const RELATION_VALUE = ['Yes', 'No'];

// security level (noAuthNoPriv|authNoPriv|authPriv)
export const LEVEL_LABEL  = ['--Select--','No authentication and no privacy', 'Authentication and no privacy', 
                             'Authentication and privacy'];
export const LEVEL_VALUE = ['','noAuthNoPriv', 'authNoPriv', 'authPriv']; 

export const  SUCCESS_CRITERIA_LABEL = ['Use Batch Job Exit Status','Search Pattern in output of Batch  Program','Check Pattern in Log File','Run another Command to check Status'];
export const  SUCCESS_CRITERIA_VALUE = ['1','2','3','4'];