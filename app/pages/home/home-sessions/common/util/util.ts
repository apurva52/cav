//import { AppComponent } from '../app.component';
import * as moment from 'moment';
import 'moment-timezone';
export class Util {

  static SecToFormattedDuration(seconds: number) {
    let hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;

    return ((hours < 10) ? ('0' + hours) : hours) + ':' +
      ((minutes < 10) ? ('0' + minutes) : minutes) + ':' +
      ((seconds < 10) ? ('0' + seconds) : seconds);
  }

  static FormattedDurationToSec(duration: string) {
    let hour = parseInt(duration.split(':')[0]) * 60 * 60;
    let min = parseInt(duration.split(':')[1]) * 60;
    let sec = parseInt(duration.split(':')[2]);

    return parseInt(hour + "") + parseInt(min + "") + parseInt(sec + "");
  }

  static getShortURL(url) {
    if (url == null || url === "null") {
      return "-";
    }
    try {
      let long_url = new URL(url);
      let short_url = long_url.protocol + "//" + long_url.host + "/..";
      short_url += long_url.pathname.substring(long_url.pathname.lastIndexOf("/"));
      return short_url;
    }
    catch (e) {
      return url;
    }
  }

  static getCustomMetricValueField(valueType) {
    switch (valueType) {
      case "0":
        return "value3";
      case "1":
        return "value1";
      case "2":
        return "value2";
      case "3":
        return "value4";
    }
  }

  static twoDigit(d) {
    if (d < 10) {
      return '0' + d;
    }
    return d;
  }

  static msToOffset(ms) {
    let d = new Date(ms);
    return Util.twoDigit(d.getUTCHours()) + ":" +
      Util.twoDigit(d.getUTCMinutes()) + ":" +
      Util.twoDigit(d.getUTCSeconds()) + "." +
      Util.twoDigit(d.getUTCMilliseconds());
  }

  static formattedDuration(value) {
    if (value > 1000) {
      return (value / 1000).toFixed(2) + "s";
    }
    return value = parseInt(value) + "ms";
  }


  static convertLastToFormatted(last) {
    let endTime = new Date().getTime();
    let lasttime;
    let starttime;
    if (last == "15 Minutes")
      lasttime = 15 * 60 * 1000;
    else if (last == "1 Hour")
      lasttime = 1 * 60 * 60 * 1000;
    else if (last == "4 Hours")
      lasttime = 4 * 60 * 60 * 1000;
    else if (last == "8 Hours")
      lasttime = 8 * 60 * 60 * 1000;
    else if (last == "12 Hours")
      lasttime = 12 * 60 * 60 * 1000;
    else if (last == "16 Hours")
      lasttime = 16 * 60 * 60 * 1000;
    else if (last == "20 Hours")
      lasttime = 20 * 60 * 60 * 1000;
    else if (last == "1 Day")
      lasttime = 1 * 24 * 60 * 60 * 1000;
    else if (last == "2 Day")
      lasttime = 2 * 24 * 60 * 60 * 1000;
    else if (last == "4 Day")
      lasttime = 4 * 24 * 60 * 60 * 1000;
    else if (last == "1 Week")
      lasttime = 7 * 24 * 60 * 60 * 1000;
    else if (last == "1 Month")
      lasttime = 30 * 24 * 60 * 60 * 1000;
    else
      lasttime = 365 * 24 * 60 * 60 * 1000;
    starttime = endTime - lasttime;

    let a = moment.tz(new Date(parseInt("" + starttime)), sessionStorage.getItem('_nvtimezone')).format("MM/DD/YYYY HH:mm:ss");
    let offset = moment.tz(new Date(parseInt("" + starttime)), sessionStorage.getItem('_nvtimezone')).format("Z");
    offset = offset.replace(":", "");
    let dateObj = new Date(a + " " + offset);
    starttime = moment.tz(dateObj, "UTC").format("MM/DD/YYYY HH:mm:ss");
    let offsett = moment.tz(new Date(parseInt("" + endTime)), sessionStorage.getItem('_nvtimezone')).format("Z");
    let b = moment.tz(new Date(parseInt("" + endTime)), sessionStorage.getItem('_nvtimezone')).format("MM/DD/YYYY HH:mm:ss");
    offsett = offsett.replace(":", "");
    let dateObjj = new Date(b + " " + offsett);
    let endtime = moment.tz(dateObjj, "UTC").format("MM/DD/YYYY HH:mm:ss");
    console.log('time', starttime, endtime, lasttime);
    return { "startTime": starttime, "endTime": endtime };
  }

  static convertLastToFormattedInSelectedTimeZone(last): { startTime: string, endTime: string } {
    let endTime: any = new Date().getTime();
    let lasttime;
    let starttime;
    if (last == "15 Minutes")
      lasttime = 15 * 60 * 1000;
    else if (last == "1 Hour")
      lasttime = 1 * 60 * 60 * 1000;
    else if (last == "4 Hours")
      lasttime = 4 * 60 * 60 * 1000;
    else if (last == "8 Hours")
      lasttime = 8 * 60 * 60 * 1000;
    else if (last == "12 Hours")
      lasttime = 12 * 60 * 60 * 1000;
    else if (last == "16 Hours")
      lasttime = 16 * 60 * 60 * 1000;
    else if (last == "20 Hours")
      lasttime = 20 * 60 * 60 * 1000;
    else if (last == "1 Day")
      lasttime = 1 * 24 * 60 * 60 * 1000;
    else if (last == "2 Day")
      lasttime = 2 * 24 * 60 * 60 * 1000;
    else if (last == "4 Day")
      lasttime = 4 * 24 * 60 * 60 * 1000;
    else if (last == "1 Week")
      lasttime = 7 * 24 * 60 * 60 * 1000;
    else if (last == "1 Month")
      lasttime = 30 * 24 * 60 * 60 * 1000;
    else
      lasttime = 365 * 24 * 60 * 60 * 1000;
    starttime = endTime - lasttime;

    const startTime = moment.tz(new Date(parseInt("" + starttime)), sessionStorage.getItem('_nvtimezone')).format("MM/DD/YYYY HH:mm:ss");
    endTime = moment.tz(new Date(parseInt("" + endTime)), sessionStorage.getItem('_nvtimezone')).format("MM/DD/YYYY HH:mm:ss");
    return { startTime, endTime };
  }

  static compareObjects(object1, object2) {
    if (object1 == undefined || object2 == undefined) return false;
    let obj1: any;
    let obj2: any;

    obj1 = (object1 instanceof Object) ? object1 : JSON.parse(object1);
    obj2 = (object2 instanceof Object) ? object2 : JSON.parse(object2);
    for (var key in obj1) {
      console.log(key);
      if (obj2[key] == null || obj2[key] == undefined)
        return false;
      if (obj1[key] != undefined && obj2[key] != undefined) {
        if (obj1[key] instanceof Object) {
          if (!(this.compareObjects(obj1[key], obj2[key]) && this.compareObjects(obj2[key], obj1[key])))
            return false;
        }
        else if (obj1[key] !== obj2[key])
          return false;
      }

    }
    return true;
  }

  static setOSNameAndVersion(os, metadata, operator) {
    console.log('check for os', os, os.length);
    let osdata = [];
    let tmp = [];
    for (let i = 0; i < os.length; i++) {
      let osmap;
      if (os[i].indexOf(operator) > -1) {
        let osname = os[i].split(operator)[0].trim();
        let osversion = null;
        if (operator === '()')
          osversion = os[i].split('(')[1].split(')')[0].trim();
        else
          osversion = os[i].split(operator)[1].trim();
        osmap = { name: osname, version: osversion };
        osdata.push(osmap);
      }
      else {
        osmap = { name: os[i], version: null };
        let platform = Array.from(metadata.osMap.keys());
        for (let j = 0; j < platform.length; j++) {
          if (os[i] === metadata.osMap.get(j).name) {
            osmap = { name: metadata.osMap.get(j).name, version: metadata.osMap.get(j).version };
            osdata.push(osmap);
          }
        }
      }
    }
    let k = osdata;
    tmp.push(k[0]);
    for (let i = 1; i < k.length; i++) {
      if (k[i].version != k[i - 1].version)
        tmp.push(k[i])
    }
    return tmp;
  }

  // helping methods for filters
  static getPageNamesFromId(pages, metadata) {
    let pageIdList = '';
    if (pages.length > 0) {
      for (let a = 0; a < pages.length; a++) {
        if (a > 0) {
          pageIdList += ',';
        }
        let keys = Array.from(metadata.pageNameMap.keys());
        for (let i = 0; i < keys.length; i++) {
          if (pages[a] === metadata.pageNameMap.get(keys[i]).name) {
            pageIdList += keys[i];
          }
        }
      }
    }
    return pageIdList;
  }

  static getUserSegmentNames(segment, metadata) {
    let segmentList = '';
    if (segment.length > 0) {
      for (let a = 0; a < segment.length; a++) {
        if (a > 0) {
          segmentList += ',';
        }
        segmentList += metadata.userSegmentMap.get(parseInt(segment[a])).name;
      }
    }
    return segmentList;
  }

  static getChannelNames(channel, metadata) {
    let channelList = '';
    if (channel.length > 0) {
      for (let a = 0; a < channel.length; a++) {
        if (a > 0) {
          channelList += ',';
        }
        let temp = metadata.channelMap.get(parseInt(channel[a]));
        if (temp)
          channelList += temp.name;
      }
    }
    return channelList;
  }




  static getPageNames(pages, metadata) {
    let pageNameList = '';
    if (pages.length > 0) {
      for (let a = 0; a < pages.length; a++) {
        if (a > 0) {
          pageNameList += ',';
        }
        let temp = metadata.pageNameMap.get(parseInt(pages[a]));
        if (temp)
          pageNameList += temp.name;
      }
    }
    return pageNameList;
  }

  static getEventNames(events, metadata) {
    let eventNameList = '';
    if (events.length > 0) {
      if (Array.isArray(events)) {
        for (let a = 0; a < events.length; a++) {
          if (a > 0) {
            eventNameList += ',';
          }
          eventNameList += metadata.eventMap.get(parseInt(events[a])).name;
        }
      }
      else {
        var eventArr = events.split(",");
        for (let a = 0; a < eventArr.length; a++) {
          if (a > 0) {
            eventNameList += ',';
          }
          eventNameList += metadata.eventMap.get(parseInt(eventArr[a])).name;
        }

      }
    }
    return eventNameList;
  }
  static convertLastToFormattedWithoutZone(last, nvconfigurations) {
    let endTime = new Date().getTime();
    let lasttime;
    let starttime;
    if (last == "15 Minutes")
      lasttime = 15 * 60 * 1000;
    else if (last == "1 Hour")
      lasttime = 1 * 60 * 60 * 1000;
    else if (last == "4 Hours")
      lasttime = 4 * 60 * 60 * 1000;
    else if (last == "8 Hours")
      lasttime = 8 * 60 * 60 * 1000;
    else if (last == "12 Hours")
      lasttime = 12 * 60 * 60 * 1000;
    else if (last == "16 Hours")
      lasttime = 16 * 60 * 60 * 1000;
    else if (last == "20 Hours")
      lasttime = 20 * 60 * 60 * 1000;
    else if (last == "1 Day")
      lasttime = 1 * 24 * 60 * 60 * 1000;
    else if (last == "2 Day")
      lasttime = 2 * 24 * 60 * 60 * 1000;
    else if (last == "4 Day")
      lasttime = 4 * 24 * 60 * 60 * 1000;
    else if (last == "1 Week")
      lasttime = 7 * 24 * 60 * 60 * 1000;
    else if (last == "1 Month")
      lasttime = 30 * 24 * 60 * 60 * 1000;
    else
      lasttime = 365 * 24 * 60 * 60 * 1000;
    starttime = endTime - lasttime;
    starttime = moment.tz(starttime, nvconfigurations.timeZone).format('MM/DD/YYYY HH:mm:ss');
    let endtime = moment.tz(endTime, nvconfigurations.timeZone).format('MM/DD/YYYY HH:mm:ss');
    console.log('time', starttime, endtime, lasttime);
    return { "startTime": starttime, "endTime": endtime };
  }

  // TODO: Handling for multiple time format.  
  static convertLocalTimeZoeToUTC(timeStr: string): string {
    let timezone = sessionStorage.getItem('_nvtimezone') || moment.tz.guess();
    let offset = moment.tz(new Date(timeStr), timezone).format("Z");
    offset = offset.replace(":", "");
    let dateObj = new Date(timeStr + " " + offset);
    timeStr = moment.tz(dateObj, "UTC").format("MM/DD/YYYY HH:mm:ss");
    return timeStr;
  }
}



