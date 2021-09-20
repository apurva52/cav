import { Resource } from './resource';

export class Domainactivity {
    rdata: any;
    domains: any;
    colors: any;
    constructor(data) {
        this.rdata = data;
        this.domains = null;
        this.colors = ['#ff4000', '#ff8000', '#ffbf00', '#ffff00', '#bfff00', '#00ff80', '#00ffff', '#0080ff', '#0000ff', '#8000ff', '#ff00ff', '#ff0040'];
    }
    getDomainActData() {
        let ddata = [];
        const rentry = {};
        // this.domains = ['Base Url'];
        for (let i = 0; i < this.rdata.entries.length; i++) {
            const r = this.rdata.entries[i];

            if (!rentry.hasOwnProperty(r.host)) {
                console.log('New entry with host, ', r.host);
                // this.domains.push(r.host);    
                rentry[r.host] = {};
                rentry[r.host]['transferSize_count'] = 0;
                if (!r.rawtransfersize) {
                    r.rawtransfersize = 0;
                }
                else if (r.rawtransfersize && r.rawtransfersize == '-' || r.rawtransfersize == 'null' || r.rawtransfersize == '') {
                    r.rawtransfersize = 0;
                }
                else
                    rentry[r.host]['transferSize_count']++;
                rentry[r.host]['transferSize'] = r.rawtransfersize || 0;
                rentry[r.host]['domainName'] = r.host;
                rentry[r.host]['duration_total'] = r.duration;
                rentry[r.host]['startTime'] = r.startTime;
                rentry[r.host]['duration_avg'] = parseFloat(r.duration.toFixed(2));
                rentry[r.host]['duration_count'] = 0;
                if (r['duration'] > 0)
                    rentry[r.host]['duration_count'] = 1;
                rentry[r.host]['wait_avg'] = r.timing.request || 0;
                rentry[r.host]['wait_count'] = 0;
                if (r['timing']['request'] > 0)
                    rentry[r.host]['wait_count'] = 1;

                rentry[r.host]['download_avg'] = r.timing.response || 0;
                rentry[r.host]['download_count'] = 0;
                if (r['timing']['response'] > 0)
                    rentry[r.host]['download_count'] = 1;
                rentry[r.host]['dns_avg'] = r.timing.dns || 0;
                rentry[r.host]['dns_count'] = 0;
                if (r['timing']['dns'] > 0)
                    rentry[r.host]['dns_count'] = 1;
                rentry[r.host]['tcp_avg'] = r.timing.tcp || 0;
                rentry[r.host]['tcp_count'] = 0;
                if (r['timing']['tcp'] > 0)
                    rentry[r.host]['tcp_count'] = 1;
                rentry[r.host]['redirection_avg'] = r.timing.redirect || 0;
                rentry[r.host]['redirection_count'] = 0;
                if (r['timing']['redirect'] > 0)
                    rentry[r.host]['redirection_count'] = 1;
                rentry[r.host]['appCache_avg'] = r.timing.cache || 0;
                rentry[r.host]['appCache_count'] = 0;
                if (r['timing']['cache'] > 0)
                    rentry[r.host]['appCache_count'] = 1;
                rentry[r.host]['resources'] = [];
                rentry[r.host]['resources'].push(r);
                rentry[r.host]['res'] = rentry[r.host]['resources'].length;
                // console.log("resource  ", res);
            }
            else {
                console.log('old entry with host, ', r.host);
                // rentry["domainName"] = r.host; 
                if (!isNaN(r['rawtransfersize'])) {
                    rentry[r.host]['transferSize'] += r.rawtransfersize || 0;
                    rentry[r.host]['transferSize_count']++;
                }
                rentry[r.host]['domainName'] = r.host;
                rentry[r.host]['duration_total'] = parseFloat((parseFloat(rentry[r.host]['duration_total']) + parseFloat(r.duration)).toFixed(2));
                rentry[r.host]['startTime'] = this.getMin(r.startTime, rentry[r.host]['startTime']); // minimum
                if (r['duration'] > 0)
                    rentry[r.host]['duration_count']++;
                if (rentry[r.host]['duration_avg'])
                    rentry[r.host]['duration_avg'] = parseFloat((parseFloat(rentry[r.host]['duration_total']) / parseFloat(rentry[r.host]['duration_count'])).toFixed(2));
                if (!isNaN(r['timing']['request']) && r['timing']['request'] > 0)
                    rentry[r.host]['wait_count']++;
                if (rentry[r.host]['wait_avg'] && !isNaN(r['timing']['request']))
                    rentry[r.host]['wait_avg'] = (isNaN(rentry[r.host]['wait_avg']) ? r.timing.request : (parseFloat(rentry[r.host]['wait_avg']) + parseFloat(r.timing.request)));
                if (!isNaN(r['timing']['response']) && r['timing']['response'] > 0)
                    rentry[r.host]['download_count']++;
                if (rentry[r.host]['download_avg'] && !isNaN(r['timing']['response']))
                    rentry[r.host]['download_avg'] = (isNaN(rentry[r.host]['download_avg']) ? r.timing.response : (parseFloat(rentry[r.host]['download_avg']) + parseFloat(r.timing.response)));
                if (rentry[r.host]['dns_avg'] && !isNaN(r['timing']['dns']))
                    rentry[r.host]['dns_avg'] = (isNaN(rentry[r.host]['dns_avg']) ? r.timing.dns : (parseFloat(rentry[r.host]['dns_avg']) + parseFloat(r.timing.dns)));
                if (!isNaN(r['timing']['dns']) && r['timing']['dns'] > 0)
                    rentry[r.host]['dns_count']++;
                if (rentry[r.host]['tcp_avg'] && !isNaN(r['timing']['tcp']))
                    rentry[r.host]['tcp_avg'] = (isNaN(rentry[r.host]['tcp_avg']) ? r.timing.tcp : (parseFloat(rentry[r.host]['tcp_avg']) + parseFloat(r.timing.tcp)));
                if (!isNaN(r['timing']['tcp']) && r['timing']['tcp'] > 0)
                    rentry[r.host]['tcp_count']++;
                if (rentry[r.host]['redirection_avg'] && !isNaN(r['timing']['redirect']))
                    rentry[r.host]['redirection_avg'] = (isNaN(rentry[r.host]['redirection_avg']) ? r.timing.redirect : (parseFloat(rentry[r.host]['redirection_avg']) + parseFloat(r.timing.redirect)));
                if (!isNaN(r['timing']['redirect']) && r['timing']['redirect'] > 0)
                    rentry[r.host]['redirection_count']++;
                if (rentry[r.host]['appCache_avg'] && !isNaN(r['timing']['cache']))
                    rentry[r.host]['appCache_avg'] = (isNaN(rentry[r.host]['appCache_avg']) ? r.timing.cache : (parseFloat(rentry[r.host]['appCache_avg']) + parseFloat(r.timing.cache)));
                if (!isNaN(r['timing']['cache']) && r['timing']['cache'] > 0)
                    rentry[r.host]['appCache_count']++;
                rentry[r.host]['resources'].push(r);
                rentry[r.host]['res'] = rentry[r.host]['resources'].length;
                // console.log("resource1  ", res);     
            }
            console.log('rentry, ', rentry);
            // actdata = getAvgField(ddata);



        }
        // ddata = Object.values(rentry);
        ddata = Object.keys(rentry).map(key => rentry[key]);
        const d = this.getAvgField(ddata);
        return d;
    }

    avgField(data) {
        for (let i = 0; i < data.length; i++) {
            const rentry = data[i];
            if (rentry['wait_count'] > 0)
                rentry['wait_avg'] = parseFloat((rentry['wait_avg'] / rentry['wait_count']).toFixed(2));
            if (rentry['download_count'] > 0)
                rentry['download_avg'] = parseFloat((rentry['download_avg'] / rentry['download_count']).toFixed(2));
            if (rentry['dns_count'] > 0)
                rentry['dns_avg'] = parseFloat((rentry['dns_avg'] / rentry['dns_count']).toFixed(2));
            if (rentry['tcp_count'] > 0)
                rentry['tcp_avg'] = parseFloat((rentry['tcp_avg'] / rentry['tcp_count']).toFixed(2));
            if (rentry['redirection_count'] > 0)
                rentry['redirection_avg'] = parseFloat((rentry['redirection_avg'] / rentry['redirection_count']).toFixed(2));
            if (rentry['appCache_count'] > 0)
                rentry['appCache_avg'] = parseFloat((rentry['appCache_avg'] / rentry['appCache_count']).toFixed(2));
            rentry['tSize'] = rentry['transferSize'];
            rentry['transferSize'] = this.getShowbytesIn(rentry['transferSize']);
        }
        return data;
    }

    /*getShowbytesIn(val)
    {
      let temp = '';
     if(val === null || val === '')
      return '-';
     else if(val <= 0 )
     {
        return '0 KB';
     }
     else
      {
        if(val/1024 > 1024)
         temp = (val/(1024*1024)).toFixed(2) + ' MB';
        else if( val/1024 > 0)
         temp = (val/1024).toFixed(2) + ' KB';
        else
         temp = val + ' B';
       return temp;
      }
    }*/

    getShowbytesIn(val) {
        let temp = '';
        if (val === null || val === '')
            return '-';
        else if (val <= 0)
            return '0 KB';
        else {
            temp = (val / 1024).toFixed(2) + ' KB';
            return temp;
        }
    }

    getAvgField(data) {
        // Sort these domains (DomainEntry) by startTime.
        const sortedObjArr = this.sortObj(data, 'startTime');
        console.log('  getAvgField1 : sortedObjArr ', sortedObjArr);
        // sort resources entry of domainEntry by startTime. 
        for (let j = 0; j < sortedObjArr.length; j++) {
            const resourceArray = sortedObjArr[j].resources;
            const reSorted = this.sortObj(resourceArray, 'startTime');
            // console.log("getAvgField2 : reSorted ", reSorted); 
            sortedObjArr[j].resources = reSorted;
            // iterate resources of that domain.
            sortedObjArr[j]['tbucket'] = [];
            let prevTbucket = null;
            let bcket = null;
            for (let k = 0; k < sortedObjArr[j].resources.length; k++) {
                console.log(sortedObjArr[j].resources.length, '  -----  ', k);
                const r = sortedObjArr[j].resources;
                let t1 = null, t2 = null;
                if (!prevTbucket) {
                    t1 = r[k].startTime;
                    t2 = r[k].startTime + r[k].duration;
                }
                else {
                    t1 = prevTbucket.startTime;
                    t2 = prevTbucket.endTime;
                }
                let t3 = null, t4 = null;

                if ((k + 1) == sortedObjArr[j].resources.length) {
                    t3 = r[k].startTime;
                    t4 = r[k].startTime + r[k].duration;
                }
                else if ((k + 1) > sortedObjArr[j].resources.length)
                    continue;
                else {
                    t3 = r[k + 1].startTime;
                    t4 = r[k + 1].startTime + r[k + 1].duration;
                }

                // prevTbucket  = new Resource(t1,t2);

                if ((t1 > t3 || t3 > t2) && (t1 > t4 || t4 > t2)) {
                    // sortedObjArr[j]["tbucket"].push(prevTbucket);
                    // make a new bucket
                    if (prevTbucket)
                        prevTbucket = new Resource(t3, t4);
                    else
                        prevTbucket = new Resource(t1, t2);
                    console.log('getAvgField3 : prevTbucket ', prevTbucket);
                    sortedObjArr[j]['tbucket'].push(prevTbucket);
                    bcket = prevTbucket;
                }
                else {
                    // For each entry check if that is lying in previousBucket then update the previous tbucket.
                    if (prevTbucket)
                        prevTbucket = new Resource(this.getMin(this.getMin(t1, t3), prevTbucket.startTime), this.getMax(this.getMax(t2, t4), prevTbucket.endTime));
                    else
                        prevTbucket = new Resource(this.getMin(t1, t3), this.getMax(t2, t4));
                    console.log('getAvgField4 : prevTbucket ', prevTbucket);
                }

                // sortedObjArr[j]["tbucket"].push(prevTbucket);
            }
            console.log(sortedObjArr.length, ' --- ', j);
            if (prevTbucket && bcket && bcket.startTime != prevTbucket.startTime && bcket.endTime != prevTbucket.endTime)
                sortedObjArr[j]['tbucket'].push(prevTbucket);
            else if (prevTbucket && bcket == null)
                sortedObjArr[j]['tbucket'].push(prevTbucket);
        }
        console.log('getAvgField5 : ', sortedObjArr);
        return sortedObjArr;
    }

    getSeriesData(activitydata, page, entry) {
        console.log('getSeriesData called ', page);
        const data = [];
        let k = 0;
        this.domains = ['Base Url'];
        for (let i = 0; i < activitydata.length; i++) {
            this.domains.push(activitydata[i].domainName);
            // repeat colors array again
            if (k > this.colors.length - 1) {
                k = 0;
            }

            for (let j = 0; j < activitydata[i].tbucket.length; j++) {
                let cnt = 0;
                if (!activitydata[i].tbucket[j])
                    continue;
                const obj = {};
                obj['x'] = i + 1;
                obj['low'] = parseFloat((activitydata[i].tbucket[j].startTime / 1000).toFixed(2));
                obj['high'] = parseFloat((activitydata[i].tbucket[j].endTime / 1000).toFixed(2));
                obj['color'] = this.colors[k];

                for (let l = 0; l < activitydata[i].resources.length; l++) {
                    if (activitydata[i].resources[l].startTime >= activitydata[i].tbucket[j].startTime && (activitydata[i].resources[l].startTime + activitydata[i].resources[l].duration) <= activitydata[i].tbucket[j].endTime) {
                        if (!obj.hasOwnProperty('name')) {
                            cnt++;
                            obj['name'] = '<b>' + activitydata[i].domainName + '</b>' + ' <br> ' + activitydata[i].resources[l].filename + ' : ' + (activitydata[i].resources[l].duration / 1000).toFixed(2) + 's (' + (activitydata[i].resources[l].startTime / 1000).toFixed(2) + 's - ' + (activitydata[i].resources[l].startTime / 1000 + activitydata[i].resources[l].duration / 1000).toFixed(2) + 's )';
                        }
                        else if (cnt < 5) {
                            cnt++;
                            obj['name'] += ' <br>' + activitydata[i].resources[l].filename + ' : ' + (activitydata[i].resources[l].duration / 1000).toFixed(2) + 's (' + (activitydata[i].resources[l].startTime / 1000).toFixed(2) + 's - ' + (activitydata[i].resources[l].startTime / 1000 + activitydata[i].resources[l].duration / 1000).toFixed(2) + 's )';
                        }
                    }
                }
                data.push(obj);
            }
            k += 1;

        }

        const base = [
            {
                'x': 0,
                'color': '#337ab7',
                'name': '<b>Base Url</b>',
                'low': entry.startTime / 1000,
                'high': parseFloat(((entry.startTime + entry.duration) / 1000).toFixed(2))
            },
        ];

        const s = [
            {
                'name': entry.filename,
                'pointWidth': 15,
                'stack': 'Tasks',
                'showInLegend': false,
                'data': base
            },
            {
                'name': 'Total',
                'pointWidth': 15,
                'stack': 'Tasks',
                'showInLegend': false,
                'data': data
            },
            {
                'name': 'Onload',
                'stack': 'Tasks',
                'type': 'line',
                'marker': { 'enabled': false },
                'tooltip': { 'pointFormat': '<span>Onload : <b> {point.y}s</b></span>' },
                'data': this.fillArray(page.timeToLoad)
            },
            {
                'name': 'Dom Content Loaded',
                'stack': 'Tasks',
                'type': 'line',
                'marker': { 'enabled': false },
                'tooltip': { 'pointFormat': '<span>Dom Content Loaded : <b> {point.y}s</b></span>' },
                'data': this.fillArray(page.timeToDOMComplete)
            },
            {
                'name': 'Dom Interactive',
                'stack': 'Tasks',
                'type': 'line',
                'marker': { 'enabled': false },
                'tooltip': { 'pointFormat': '<span>Dom Interactive : <b> {point.y}s</b></span>' },
                'data': this.fillArray(page.domInteractiveTime)
            },
            // {
            //     'name': 'TCP',
            //     'stack': 'Tasks',
            //     'type': 'line',
            //     'marker': { 'enabled': false },
            //     'tooltip': { 'pointFormat': '<span>TCP : <b> {point.y}s</b></span>' },
            //     'data': this.fillArray(page.connectionTime)
            // },
            // {
            //     'name': 'DNS',
            //     'stack': 'Tasks',
            //     'type': 'line',
            //     'marker': { 'enabled': false },
            //     'tooltip': { 'pointFormat': '<span>DNS : <b> {point.y}s</b></span>' },
            //     'data': this.fillArray(page.dnsTime)
            // },
            // {
            //     'name': 'Cache',
            //     'stack': 'Tasks',
            //     'type': 'line',
            //     'marker': { 'enabled': false },
            //     'tooltip': { 'pointFormat': '<span>Cache : <b> {point.y}s</b></span>' },
            //     'data': this.fillArray(page.cacheLookupTime)
            // },
            // {
            //     'name': 'Redirect',
            //     'stack': 'Tasks',
            //     'type': 'line',
            //     'marker': { 'enabled': false },
            //     'tooltip': { 'pointFormat': '<span>Redirect : <b> {point.y}s</b></span>' },
            //     'data': this.fillArray(page.redirectionDuration)
            // },
            // {
            //     'name': 'Response',
            //     'stack': 'Tasks',
            //     'type': 'line',
            //     'marker': { 'enabled': false },
            //     'tooltip': { 'pointFormat': '<span>Response : <b> {point.y}s</b></span>' },
            //     'data': this.fillArray(page.responseTime)
            // },
            // {
            //     'name': 'Wait',
            //     'stack': 'Tasks',
            //     'type': 'line',
            //     'marker': { 'enabled': false },
            //     'tooltip': { 'pointFormat': '<span> Wait : <b> {point.y}s</b></span>' },
            //     'data': this.fillArray(page.serverresponsetime)
            // }
        ];
        console.log('s: ', s);
        return s;
    }

    fillArray(value) {
        const ret = [];
        for (let i = 0; i < this.domains.length; i++) {
            ret.push(value);
        }
        return ret;
    }

    sortObj(grp, prop) {
        let keysSorted = [];
        keysSorted = grp.sort(function (a, b) { if (a[prop] < b[prop]) return -1; else return 1; });
        console.log('keysSorted : ', keysSorted);
        return keysSorted;
    }

    getMin(a, b) {
        if (a < b)
            return a;
        else
            return b;
    }
    getMax(a, b) {
        if (a > b)
            return a;
        else
            return b;
    }

}
