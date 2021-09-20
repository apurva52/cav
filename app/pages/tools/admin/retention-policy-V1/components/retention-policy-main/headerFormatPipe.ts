import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "headerFormatPipe" })
export class headerFormatPipe implements PipeTransform {
    transform(value: string): string {
        let getValue = value;
        // For each argument
        if (value == 'raw_data') {
            getValue = "Raw Data";
        }
        else if (value == 'csv') {
            getValue = "Processed Data";
        }
        else if (value == 'logs') {
            getValue = "Logs";
        }
        else if (value == 'db') {
            getValue = "DB";
        }
        else if (value == 'tr') {
            getValue = "Testrun"
        }
        else if (value == 'dbg_tr') {
            getValue = "Drill Down Data Testrun"
        }
        else if (value == 'arch_tr') {
            getValue = "Archive Testrun"
        }
        else if (value == 'gen_tr') {
            getValue = "Generator Testrun"
        }
        else if (value == 'graph_data') {
            getValue = "Metric Data"
        }
        else if (value == 'har_file') {
            getValue = "Resource Timing"
        }
        else if (value == 'pagedump') {
            getValue = "Page Dumps"
        }
        else if (value == 'test_data') {
            getValue = "Diagnostics Data"
        }
        else if (value == 'db_agg') {
            getValue = "Aggregated Drill Down Data"
        }
        else if (value == 'ocx') {
            getValue = "User Session Replay Data"
        }
        else if (value == 'na_traces') {
            getValue = "Drill Down Data"
        }
        else if (value == 'access_log') {
            getValue = "Cavisson Product Logs"
        }
        else if (value == 'reports') {
            getValue = "Reports"
        }
        else if (value.substr(value.length - 1) == 'w' && !(value.includes('cavisson'))) {
            getValue = value.substring(0, value.length - 1) + " Week"
        }
        else if (value.substr(value.length - 1) == 'd' && !(value.includes('cavisson'))) {
            getValue = value.substring(0, value.length - 1) + " Day"
        }
        else if (value.substr(value.length - 1) == 'm' && !(value.includes('cavisson'))) {
            getValue = value.substring(0, value.length - 1) + " Month"
        }
        else if (value.substr(value.length - 1) == 'y' && !(value.includes('cavisson'))) {
            getValue = value.substring(0, value.length - 1) + " Year"
        }
        else if (value.length > 120) {
            getValue = value.substring(0, 120) + "...";
        }
        // console.log("the value of headerformat is",getValue);
        return getValue;
    }
}