export const METRIC_TYPE_LABEL =  ['Scalar','Vector'];
export const METRIC_TYPE_VALUE = ['scalar','vector'];

// export const DATA_TYPE_LABEL =  ['sample','rate', 'cumulative', 'times', 'timesStd', 'sum', 'rate_4B_1000','times_4B_1000',
//                                  'sample_2B_100','sample_4B_1000', 'sample_2B_100_count_4B', 'Sum_4B', 'Timesstd_4B_1000',
//                                  'sample_4B', 'sample_1B','times_4B_10', 'tdigest','tdigest_4B','tdigest_2B'];
                                 
// export const DATA_TYPE_VALUE = ['sample','rate', 'cumulative', 'times', 'timesStd', 'sum', 'rate_4B_1000','times_4B_1000',
//                                 'sample_2B_100','sample_4B_1000', 'sample_2B_100_count_4B', 'Sum_4B', 'Timesstd_4B_1000',
//                                 'sample_4B', 'sample_1B','times_4B_10','tdigest','tdigest_4B', 'tdigest_2B' ];

export const DATA_TYPE_LABEL =  ['Sample','Rate', 'Cumulative', 'Sum'];
                                 
export const DATA_TYPE_VALUE = ['sample','rate', 'cumulative', 'sum'];

// export const METRIC_FORMULA_LABEL =  ['--Select--','SEC','PM', 'PS', 'KBPS', 'DBH', 'CumToPM', 'CumToPS'];
// export const METRIC_FORMULA_VALUE = ['None','SEC','PM', 'PS', 'KBPS', 'DBH', 'CumToPM', 'CumToPS'];


export const METRIC_FORMULA_LABEL =  ['--Select--','Convert from milliseconds to seconds','Convert from milliseconds to per minute', 
                                      'Convert from milliseconds to per second', 'Convert from bytes to kilo byte per second', 
                                      'Divide by hundred', 'Convert cumulative values to per minute', 'Convert cumulative values to per second'];
export const METRIC_FORMULA_VALUE = ['None','SEC','PM', 'PS', 'KBPS', 'DBH', 'CumToPM', 'CumToPS'];

export const HR_LABEL = ['--Select--','Multiple(_)', 'Multilevel(>)'];
export const HR_VALUE = [' ','1', '2'];

export const FILTER_LABEL= ['None', 'Include', 'Exclude'];
export const FILTER_VALUE= ['', '+', '-'];

export const METRIC_LIST_LABEL = ['Application Metrics', 'System Metrics', 'Custom Metrics'];
export const METRIC_LIST_VALUE = ['Application Metrics', 'System Metrics', 'Custom Metrics'];

export const STATS_DATA_TYPE_LABEL =  ['Timers','Count', 'Gauge'];
                                 
export const STATS_DATA_TYPE_VALUE = ['Timers','Count', 'Gauge'];

export const METRIC_DB_LIST_LABEL = ['Application Metrics', 'System Metrics','Postgres Metrics','Oracle Metrics','MySQL Metrics','Microsoft SQL Metrics','IBM DB2 Metrics','Custom Metrics'];
export const METRIC_DB_LIST_VALUE = ['Application Metrics', 'System Metrics','Postgres Metrics','Oracle Metrics','MySQL Metrics','Microsoft SQL Metrics','IBM DB2 Metrics','Custom Metrics'];

export const METRIC_DB_FORMULA_LABEL =  ['--Select--', 'Convert cumulative values to per minute', 'Convert cumulative values to per second'];
export const METRIC_DB_FORMULA_VALUE = ['None','CumToPM', 'CumToPS'];

export const JMX_DATA_TYPE_LABEL = ['long','Double', 'int', 'java.lang.Object', 'javax.management.openmbean.CompositeData','boolean'];
export const JMX_DATA_TYPE_VALUE = ['long','Double', 'int', 'java.lang.Object', 'javax.management.openmbean.CompositeData','boolean'];