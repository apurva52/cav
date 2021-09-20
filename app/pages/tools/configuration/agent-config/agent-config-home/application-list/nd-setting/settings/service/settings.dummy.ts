import { settingData } from "./settings.model";

export const PANEL_DUMMY: any = {
    panels: [
        { label: '', collapsed: false },
        { label: '', collapsed: false },
    ],
};



export const SETTING_DATA: settingData = {
    settingLabelData: [

        { label: 'Duration (secs) for which ND Collector continues to receive data from machine agent after test is over', value: '' },

        { label: 'Duration (secs) for which ND Collector waits for events from machine agents on control connection', value: '' },

        { label: 'Duration (secs) between two heartbeat messages to application agent', value: '' },

        { label: 'Accept or reject new connection from application agent when connection already exists from that agent', value: '' },

        { label: 'Retry Count for sending signal', value: '' },

        { label: 'Duration (secs) after which ND Collector forcefully stops the ND Processor process after test is over', value: '' },

        { label: 'Enable dumping of aggregate data in raw_data directory', value: '' },

        { label: 'Enable Monitor log', value: '' },

        { label: 'NDC BCI response time for metadata (in seconds)', value: '' },

        { label: 'Send active instance response', value: '' },

        { label: 'Modify entry in the topology in case of auto scaling', value: ''},

    ],

    settingLabelData2: [

        { label: 'ND Collector wait time (secs) to send response to Netstorm/GUI', value: '' },

        { label: 'ND Collector behaviour on error conditions', value: '' },

        { label: 'Duration (secs) after which instrumentation start request to application agent times out', value: '' },

        { label: 'Maximum depth of method call stack', value: '' },

        { label: 'ND Collector wait time for thread to exit after sending signal for exit', value: '' },

        { label: 'Control size (bytes) of stacktrace file', value: '' },

        { label: 'Threshold (ms) of difference between ND Collector timestamp and Application agent timestamp', value: '' },

        { label: 'Enable Monitor log', value: '' },

        { label: 'NDC BCI response time for metadata (in seconds)', value: '' },

        { label: 'Send active instance response', value: '' },

        { label: 'Modify entry in the topology in case of auto scaling', value: '' },



    ],

    settingLabelData3: [
        { label: 'Time (in ms) to poll if the test run is currently running', value: '' },
        { label: 'Se maximum number of entry and exit records in a Flowpath', value: '' },
        { label: 'Filter Flowpath which are not the part of NS initiated transaction', value: '' },
        { label: 'Filter Flowpath which are not the part of current test run', value: '' },
        { label: 'NDP trace log level', value: '' },
        { label: 'Flag to enable dumping of BCI arguments data in CSV', value: '' },
        { label: 'Initial max concurrent flowpaths processed per JVM', value: '' },
        { label: 'Incremental number of concurrent flowpath', value: '' },
        { label: 'Maximum size (in kilobytes) of buffer of meta data tableentries', value: '' },
        { label: 'Maximum size (in kilobytes) of buffer of BCI arguments (JSP pagenames)', value: 'Maximum size (in kilobytes) of buffer of BCI arguments (JSP page names)' },
        { label: 'Maximum size (in kilobytes) of buffer of HTTP header metadata buffer size', value: 'Maximum size (in kilobytes) of buffer of HTTP header metadata buffe size' },
        { label: 'Maximum size (in kilobytes) of buffer of NDSQL Record table entries', value: '' },
        { label: 'Size (in MB) of the ND debug log', value: '' },
        { label: 'Maximum SQL index', value: '' },
    ],

    settingLabelData4: [
        { label: 'Interval (in seconds) between two consecutive hunts for any in-memory dead flowpaths', value: '' },
        { label: 'Time (in ms) before polling the raw_data file for new incoming raw_data', value: '' },
        { label: 'Start to force smallest ID in SQL (meta data) table', value: '' },
        { label: 'Flag to enable dumping of SQL timing in CSV', value: '' },
        { label: 'Flag to enable dumping of SQL record in CSV', value: '' },
        { label: 'Generate URL record if mapping record is not received from BCI', value: '' },
        { label: 'Free flowpath minimum sequence blob size (in bytes)', value: '' },
        { label: 'Size (in bytes) of raw data to be processed at a time in NDP per instance', value: '' },
        { label: 'Flag to enable generation of FP signatures in NDP', value: '' },
        { label: 'Minimum response time to filter level 1 flowpath', value: '' },
        { label: 'Meta data recovery', value: '' },
        { label: 'Enable/Disable the memory dump method to store HTTP header records', value: '' },
        { label: 'Maximum number of concurrent flowpath instances', value: '' },
        { label: 'Maximum number of concurrent flowpath instances', value: '' },
    ],
    settingLabelData5: [
        {
            title: 'Enable DB call by NoSQL',
            otherData: [
                { label: 'Redix', value: '' },
                { label: 'Cassandra', value: '' },
                { label: 'MongoDB', value: '' },
                { label: 'Neo4j', value: '' },
                { label: 'Cloudant', value: '' },
                { label: 'Bigtable', value: '' },
                { label: 'FTP', value: '' },
                { label: 'DynamoDB', value: '' },
            ],
        }
    ],
    settingLabelData6: [
        { label: 'JDBC', value: '' },
        { label: 'BigQuery', value: '' },

    ],

};


