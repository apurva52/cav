declare var unescape: any;
import { Util } from 'src/app/pages/home/home-sessions/common/util/util';
import * as moment from 'moment';
import 'moment-timezone';
export class Variation {
    id: number;
    name: string;
    url_or_pagelist: string;
    active: any;
    created: any;
    traffic: any;
    description: any;
    lastedit: any;
    channel: any;
    command: any;
    goalid: any;
    pagearray: any;
    origChannel: any;
    createdTimestamp: any;
    lflag: any;
    channelid: any;
    url_or_pagelistt: any;
    pageid: any;

    constructor(dbrecord: any, metadata: any) {
        console.log("-- ", JSON.stringify(dbrecord));
        try {
            this.id = dbrecord.variationid;
            this.name = unescape(dbrecord.name);
            // need to keep for edit option
            this.pagearray = [];
            this.lflag = "pagelist";
            this.url_or_pagelist = null;
            if (dbrecord.pagelist != null && dbrecord.pagelist != "") {
                this.pageid = (dbrecord.pagelist).split(/\s*,\s*/);
                this.lflag = "pagelist";
                this.pagearray = (dbrecord.pagelist);
                if (this.pageid == "-2")
                    this.url_or_pagelist = "All"
                else {
                    this.url_or_pagelist = Util.getPageNames(this.pageid, metadata);
                }
            }
            if (dbrecord.url != null) {
                this.lflag = "url";
                this.url_or_pagelistt = unescape(dbrecord.url);
            }
            let channelarray = dbrecord.channel.toString().split(",");
            this.origChannel = dbrecord.channel;
            this.channelid = dbrecord.channel;
            this.channel = Util.getChannelNames(channelarray, metadata);
            if (this.channel == "")
                this.channel = "All";
            this.active = dbrecord.active;
            //if(dbrecord.active == 1)
            //this.status = "Active";
            let timedata = parseInt(dbrecord.created);
            this.createdTimestamp = dbrecord.created;
            let d = new Date(timedata);
            this.created = moment.tz(timedata, sessionStorage.getItem("_nvtimezone")).format('HH:mm:ss MM/DD/YYYY');
            this.traffic = dbrecord.traffic;
            this.description = unescape(dbrecord.comment);
            let edittime = parseInt(dbrecord.lastedit);
            let ed = new Date(edittime);
            this.lastedit = moment.tz(edittime, sessionStorage.getItem("_nvtimezone")).format('HH:mm:ss MM/DD/YYYY');
            this.command = unescape(dbrecord.command);
            this.goalid = dbrecord.goalid;
        } catch (e) { console.log("exception : ", e, " for record : ", JSON.stringify(dbrecord)); }
        return this;
    }

}

