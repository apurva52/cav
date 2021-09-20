import * as moment from 'moment';
import 'moment-timezone';

export class PagePerformanceTableData {
    time: any;
    onload: number;
    ttdl: number;
    ttdi: number;
    dom: number;
    prt: number;
    unload: number;
    redirect: number;
    cache: number;
    dns: number;
    tcp: number;
    ssl: number;
    wait: number;
    download: number
    pageview: number;
    formattedtime: any;
    firstpaint: any;
    firstcontentpaint: any;
    timetointeractive: any;
    firstinputdelay: any;

    constructor(records) {
        {
            //this.time = new Date(moment.utc(records[0]).tz(sessionStorage.getItem('_nvtimezone')).format('YYYY-MM-DD hh:mm:ss')).valueOf();
            this.time = moment.tz(records[0], 'UTC').format('MM/DD/YYYY HH:mm:ss')
            this.onload = (parseFloat(records[1])) < 0 ? 0 : parseFloat((parseFloat(records[1]) / 1000).toFixed(3));
            this.ttdl = (parseFloat(records[2])) < 0 ? 0 : parseFloat((parseFloat(records[2]) / 1000).toFixed(3));
            this.ttdi = (parseFloat(records[3])) < 0 ? 0 : parseFloat((parseFloat(records[3]) / 1000).toFixed(3));
            this.dom = (parseFloat(records[4])) < 0 ? 0 : parseFloat((parseFloat(records[4]) / 1000).toFixed(3));
            this.prt = (parseFloat(records[5])) < 0 ? 0 : parseFloat((parseFloat(records[5]) / 1000).toFixed(3));
            this.unload = (parseFloat(records[6])) < 0 ? 0 : parseFloat((parseFloat(records[6]) / 1000).toFixed(3));
            this.redirect = (parseFloat(records[7])) < 0 ? 0 : parseFloat((parseFloat(records[7]) / 1000).toFixed(3));
            this.cache = (parseFloat(records[8])) < 0 ? 0 : parseFloat((parseFloat(records[8]) / 1000).toFixed(3));
            this.tcp = (parseFloat(records[9])) < 0 ? 0 : parseFloat((parseFloat(records[9]) / 1000).toFixed(3));
            this.dns = (parseFloat(records[10])) < 0 ? 0 : parseFloat((parseFloat(records[10]) / 1000).toFixed(3));
            this.ssl = (parseFloat(records[11])) < 0 ? 0 : parseFloat((parseFloat(records[11]) / 1000).toFixed(3));
            this.wait = (parseFloat(records[12])) < 0 ? 0 : parseFloat((parseFloat(records[12]) / 1000).toFixed(3));
            this.download = (parseFloat(records[13])) < 0 ? 0 : parseFloat((parseFloat(records[13]) / 1000).toFixed(3));
            this.pageview = (parseFloat(records[14])) < 0 ? 0 : parseInt(records[14]);
            this.formattedtime = new Date(records[15]).toDateString() + " " + new Date(records[15]).toTimeString().split(" ")[0];
            this.firstpaint = (parseFloat(records[16])) < 0 ? 0 : parseFloat((parseFloat(records[16]) / 1000).toFixed(3));
            this.firstcontentpaint = (parseFloat(records[17])) < 0 ? 0 : parseFloat((parseFloat(records[17]) / 1000).toFixed(3));
            this.timetointeractive = (parseFloat(records[18])) < 0 ? 0 : parseFloat((parseFloat(records[18]) / 1000).toFixed(3));
            this.firstinputdelay = (parseFloat(records[19])) < 0 ? 0 : parseFloat((parseFloat(records[19]) / 1000).toFixed(3));
        }
    }
}
