import { PagePerformanceFilter } from './pageperformancefilter';
import { ViewFilter } from './viewfilter';
import { Metadata } from './metadata';
import { Util } from './../util/util';
//import { MsgService } from './../services/msg.service';
import * as moment from 'moment';
import 'moment-timezone';

export class ParsePagePerformanceFilters {

  pagePerformanceFilters = new PagePerformanceFilter();
  filter: PagePerformanceFilter;
  filterCriteriaList = [];
  showFilter : any; 
  bucketset : any;
  getPagePerformanceFilter(pagepFilter, metadata: Metadata,bucketflag)
  {
    this.filter = new PagePerformanceFilter();
    this.filterCriteriaList = [];
    //time filter
    this.setTimeFilter(pagepFilter, metadata,bucketflag);
    // page performance filters
    this.setPagePerformanceFilter(pagepFilter, metadata,bucketflag);
    // set all the filters on the static session filter object.
    this.pagePerformanceFilters = this.filter;
    this.showFilter = pagepFilter;
  }
 
  getNamesFromId(name, metadata)
  {
    let nameList = '';
    if (name.length > 0)
    {
      for (let a = 0; a < name.length; a++)
      {
        if (a > 0)
        {
          nameList += ',';
        }
        nameList += metadata.get(parseInt(name[a])).name;
      }
    }
    return nameList;
  }


  setOSNameAndVersion(os,metadata)
  {
    let osdata = [];
    let tmp = [];
    for(let i = 0;i < os.length;i++)
     {
       let osmap;
       if(os[i].indexOf('(') > -1)
        {
          let osname = os[i].split('(')[0].trim();
          let osversion = os[i].split('(')[1].split(')')[0].trim()
          osmap = {name : osname, version : osversion};
          osdata.push(osmap);
        }
        else
        {
          osmap = {name : os[i],version: null};
          let platform = Array.from( metadata.osMap.keys() );
          for(let j = 0;j < platform.length ; j++)
          {
            if(os[i] === metadata.osMap.get(platform[j]).name  && metadata.osMap.get(platform[j]).version == "null")
            {
              osmap = {name : metadata.osMap.get(platform[j]).name , version: metadata.osMap.get(platform[j]).version};
              osdata.push(osmap);
            }
          }
        }
     }
     let k = osdata;
     tmp.push(k[0]);
     for(let i = 1;i< k.length;i++){ 
        if(k[i].version != k[i-1].version)
          tmp.push(k[i]);
        else if (k[i].version === "null")
        tmp.push(k[i])
       }
    return tmp;
  }
 
  setPagePerformanceFilter(pagepFilter, metadata,bucketflag)
  {
   let filter = this.filter;
   if(pagepFilter.bucket !== null && pagepFilter.bucket !== '' && pagepFilter.bucket !== 'Auto' && pagepFilter.bucket !== 'null' )
   {
    if(pagepFilter.bucket !== 'Auto'){
     filter.bucket = this.setBucketInSec(pagepFilter.bucket);
     this.filterCriteriaList.push(new ViewFilter('Bucket ', pagepFilter.bucket , null));
     }
    else
     {
      filter.bucket = this.setBucketInSec('1 Hour');
      this.filterCriteriaList.push(new ViewFilter('Bucket ', pagepFilter.bucket , null));
     }
   }
   else
   {
       let diffBetweenStartAndEndTime = 0;
       // it will change the bucket value according to time filter only when bucket mode is  selected as auto 
       if(pagepFilter._timefilter == "false") /*when start and end time radio is selected */
       {
          let startdate = (pagepFilter.stime).getTime()/1000;
          let endtime =  (pagepFilter.stimecmp).getTime()/1000;
          diffBetweenStartAndEndTime = (endtime - startdate);
          filter.bucket = this.setBucketInSec(pagepFilter.bucket,diffBetweenStartAndEndTime);
       }
       if(pagepFilter._timefilter == "true") /*when last radio is selected*/
       {
         let spliitedval = pagepFilter.lastval.split(" ");
         if(spliitedval[1] == "Hours")
           diffBetweenStartAndEndTime = (spliitedval[0]*3600);
         else if(spliitedval[1] == "Week")
           diffBetweenStartAndEndTime = (spliitedval[0]*3600*7*24);
         else if(spliitedval[1] == "Day")
           diffBetweenStartAndEndTime = 86400;
         else if(spliitedval[1] == "Month")
           diffBetweenStartAndEndTime = 2628000;
         else if(spliitedval[1] == "Year")
           diffBetweenStartAndEndTime = 31560000;
         filter.bucket = this.setBucketInSec(pagepFilter.bucket,diffBetweenStartAndEndTime);
       }
       if(filter.bucket == 14400) /*when diffBetweenStartAndEndTime greater than week in second  and less than a month */
         this.bucketset = '4 Hour'
       else if(filter.bucket == 86400) /* when diffBetweenStartAndEndTime greater than year and equal to year */
         this.bucketset = '24 Hour';
       else if(filter.bucket == 28800) /* when diffBetweenStartAndEndTime greater than month or equal to month */
         this.bucketset = '8 Hour';
       else if(filter.bucket == 3600) /* when diffBetweenStartAndEndTime is in days in seconds */
       this.bucketset = '1 Hour';
       if(bucketflag)
        this.filterCriteriaList.push(new ViewFilter('Bucket ', this.bucketset , null));
   }
   if (pagepFilter.channel !== null && pagepFilter.channel !== "" && pagepFilter.channel.length > 0)
    { 
      this.filter.channels = pagepFilter.channel.join(','); 
      this.filterCriteriaList.push(new ViewFilter('Channel',  Util.getChannelNames(pagepFilter.channel, metadata), null));
    }
   if (pagepFilter.browser !== null && pagepFilter.browser !== "" &&  pagepFilter.browser !== "null" && pagepFilter.browser.length > 0)
    {
      filter.browsers = pagepFilter.browser.join(',');
      this.filterCriteriaList.push(new ViewFilter('Browser',this.getNamesFromId(pagepFilter.browser, metadata.browserMap), null));
    }
    
   if (pagepFilter.device !== null && pagepFilter.device.length >0 && pagepFilter.device !== "null")
    {
      filter.devices = "'" + pagepFilter.device.join("','") + "'";
      this.filterCriteriaList.push(new ViewFilter('Include Device', pagepFilter.device.join(',') , null));
    }
    if (pagepFilter.metric1 !== null &&  pagepFilter.metric1 !== "null" &&  pagepFilter.metric1 !== "" )
    {
      filter.errorMessage = pagepFilter.metric1;
      this.filterCriteriaList.push(new ViewFilter('Error Message', pagepFilter.metric1, null));
    }
  if (pagepFilter.granular1 !== null &&  pagepFilter.granular1 !== "null"  &&  pagepFilter.granular1 !== "")
    {
      filter.filename = pagepFilter.granular1;
      this.filterCriteriaList.push(new ViewFilter('FileName', pagepFilter.granular1, null));
    }

if (pagepFilter.location !== null &&  pagepFilter.location !== "null" )
    {
      filter.locations = pagepFilter.location;
      this.filterCriteriaList.push(new ViewFilter('Location', '' , null));
    }

  if (pagepFilter.platform !== null && pagepFilter.platform !== "null"  &&  pagepFilter.platform.length > 0)
    {
       filter.os = this.setOSNameAndVersion(pagepFilter.platform,metadata);
       this.filterCriteriaList.push(new ViewFilter('OS',pagepFilter.platform, null));
    }
   if (pagepFilter.entryPage !== null && pagepFilter.entryPage !== "" && pagepFilter.entryPage !== "null" && pagepFilter.entryPage.length > 0)
    { 
      filter.pages = pagepFilter.entryPage.join(',');
      filter.pageName = Util.getPageNames(pagepFilter.entryPage,metadata);
      this.filterCriteriaList.push(new ViewFilter('Page', filter.pageName , null));
    }
   if (pagepFilter.userSegment !== null && pagepFilter.userSegment !== '' && pagepFilter.userSegment.length > 0)
   {
     filter.userSegments = pagepFilter.userSegment.join(',') ;
     //this.filterCriteriaList.push(new ViewFilter('User Segment ', Util.getUserSegmentNames(pagepFilter.userSegment, metadata), null));
   }
 
   if(pagepFilter.connectionType !== null && pagepFilter.connectionType !== '')
   {
     filter.conType = pagepFilter.connectionType;
     this.filterCriteriaList.push(new ViewFilter('ConnectionType', pagepFilter.connectionType, null));
   }
 if (pagepFilter.Includepage !== null && pagepFilter.Includepage !== "" && pagepFilter.Includepage !== "null" && pagepFilter.Includepage.length > 0)
    {
      filter.pages = pagepFilter.Includepage.join(',');
      filter.pageName = Util.getPageNames(pagepFilter.Includepage,metadata);
      this.filterCriteriaList.push(new ViewFilter('Include Page', filter.pageName , null));
    }
  if(pagepFilter.ExcludePage !== null && pagepFilter.ExcludePage !== "" && pagepFilter.ExcludePage !== "null" && pagepFilter.ExcludePage.length > 0)
    {
      filter.excludePage = pagepFilter.ExcludePage.join(',');
      this.filterCriteriaList.push(new ViewFilter('Exclude Page', this.getNamesFromId(pagepFilter.ExcludePage,metadata.pageNameMap), null));
    }
     if(pagepFilter.ExcludeBrowser !== null && pagepFilter.ExcludeBrowser !== "" && pagepFilter.ExcludeBrowser !== "null" && pagepFilter.ExcludeBrowser.length > 0)
    {
      filter.excludeBrowser = pagepFilter.ExcludeBrowser.join(',');
      this.filterCriteriaList.push(new ViewFilter('Exclude Browser',  this.getNamesFromId(pagepFilter.ExcludeBrowser ,metadata.browserMap), null));
    }
  if (pagepFilter.IncludeLocation !== null && pagepFilter.IncludeLocation !== "" && pagepFilter.IncludeLocation !== "null" && pagepFilter.IncludeLocation.length > 0)
    {
      filter.locations = pagepFilter.IncludeLocation.join(',');
      this.filterCriteriaList.push(new ViewFilter('Include Location', this.getLocation(pagepFilter.IncludeLocation,metadata) , null));
    }
  if(pagepFilter.ExcludeLocation !== null && pagepFilter.ExcludeLocation !== "" && pagepFilter.ExcludeLocation !== "null" && pagepFilter.ExcludeLocation.length > 0)
    {
      filter.excludeLocation = pagepFilter.ExcludeLocation.join(',');
      this.filterCriteriaList.push(new ViewFilter('Exclude Location', this.getLocation(pagepFilter.ExcludeLocation,metadata) , null));
    }
  if(pagepFilter.ExcludeOS !== null && pagepFilter.ExcludeOS !== "" && pagepFilter.ExcludeOS !== "null" && pagepFilter.ExcludeOS.length > 0)
    {
      filter.excludeOS = this.setOSNameAndVersion(pagepFilter.ExcludeOS,metadata);
      let f = pagepFilter.ExcludeOS;
      this.filterCriteriaList.push(new ViewFilter('Exclude OS',pagepFilter.ExcludeOS, null));
   }
  if(pagepFilter.IncludeOS !== null && pagepFilter.IncludeOS !== "" && pagepFilter.IncludeOS !== "null" && pagepFilter.IncludeOS.length > 0)
    {
      filter.os = this.setOSNameAndVersion(pagepFilter.IncludeOS,metadata);
      let f = pagepFilter.IncludeOS;
      this.filterCriteriaList.push(new ViewFilter('Include OS',pagepFilter.IncludeOS, null));
   }
  /*if(pagepFilter.formosicon !== null && pagepFilter.formosicon !== "" && pagepFilter.formosicon !== "null" && pagepFilter.formosicon.length > 0)
    { 
      filter.os = this.setOSNameAndVersion(pagepFilter.formosicon,metadata);
      let f = pagepFilter.formosicon;
      this.filterCriteriaList.push(new ViewFilter('Include OS',pagepFilter.formosicon, null));
   }
  */
  if(pagepFilter.IncludeBrowser !== null && pagepFilter.IncludeBrowser !== "" && pagepFilter.IncludeBrowser !== "null" && pagepFilter.IncludeBrowser.length > 0)
    { 
      filter.browsers = pagepFilter.IncludeBrowser.join(',');
      this.filterCriteriaList.push(new ViewFilter('Include Browser',  this.getNamesFromId(pagepFilter.IncludeBrowser ,metadata.browserMap), null));
    }
 /*
  if(pagepFilter.formbrowsericon !== null && pagepFilter.formbrowsericon !== "" && pagepFilter.formbrowsericon !== "null" && pagepFilter.formbrowsericon.length > 0)
    {
      filter.browsers = pagepFilter.formbrowsericon.join(',');
      this.filterCriteriaList.push(new ViewFilter('Include Browser',  this.getNamesFromId(pagepFilter.formbrowsericon ,metadata.browserMap), null));
    }
 */
  if(pagepFilter.granular !== null && pagepFilter.granular !== "" && pagepFilter.granular !== "null")
    {
      filter.granularity = pagepFilter.granular;
      this.filterCriteriaList.push(new ViewFilter('Granularity', pagepFilter.granular , null));
   }
   if(pagepFilter.groups !== undefined && pagepFilter.groups !== null && pagepFilter.groups !== "" && pagepFilter.groups !== "null")
    {
      filter.groups = pagepFilter.groups.join(",");
      var ab = '';
      let  groupArr = pagepFilter.groups;
      for(let i = 0; i<groupArr.length;i++)
         {
         if(i != 0)
         ab = ab + ",";
         if(groupArr[i] == 'browserid')
         ab = ab +"Browsers";
         if(groupArr[i] == 'pageid')
         ab = ab +"Pages";
         if(groupArr[i] == 'platform')
         ab = ab +"Platform";
         if(groupArr[i] == 'platform,mobileosversion')
         ab = ab +"OS and Version";
         if(groupArr[i] == 'browserid,mobileappversion')
         ab = ab +"Browser and Version";

         }
      this.filterCriteriaList.push(new ViewFilter('Group By', ab , null));
   }
  if(pagepFilter.metric !== null && pagepFilter.metric !== "" && pagepFilter.metric !== "null")
    {     
      filter.metricType = pagepFilter.metric;
      this.filterCriteriaList.push(new ViewFilter('Metric', pagepFilter.metric , null));
   } 
  if(pagepFilter.rollingwindow !== null && pagepFilter.rollingwindow !== "" && pagepFilter.rollingwindow !== "null")
    {
      filter.rollingwindow = pagepFilter.rollingwindow;
      let v = pagepFilter.rollingwindow + " Day";
      this.filterCriteriaList.push(new ViewFilter('Rolling Window', v, null));
   }

 }

  

setTimeFilter(pageFilter, metadata, bucketflag)
 {
     console.log(" setTimeFilter parsepagefilter pageFilter=="+JSON.stringify(pageFilter));
     let filter = this.filter;
     let d ;
     let e;
     let dcmp ;
     let ecmp;
     let date1;
     let date2;
     let datecmp1;
     let datecmp2;
     let diffBetweenStartAndEndTime = 0; // It will store duration of first time filter (i.e. starttime and endtime).
      if (pageFilter.timeFilter.last === null || pageFilter.timeFilter.last === "")
      {
        let offset = moment.tz(new Date(pageFilter.stime), sessionStorage.getItem('_nvtimezone')).format("Z");
      offset = offset.replace(":", "");
      //let stdateObj = new Date(pageFilter.stime + " " + offset);
      let stdateObj = new Date(moment(pageFilter.stime).format('MM/DD/YYYY HH:mm:ss') + " " +  offset);
      d = new Date(moment.tz(stdateObj, "UTC").format("MM/DD/YYYY HH:mm:ss"));
      let offsett = moment.tz(new Date(pageFilter.etime), sessionStorage.getItem('_nvtimezone')).format("Z");
      offsett = offsett.replace(":", "");
      let etdateObj = new Date(moment(pageFilter.etime).format('MM/DD/YYYY HH:mm:ss') + " " +  offsett);//new Date(pageFilter.etime + " " + offsett);
      e = new Date(moment.tz(etdateObj, "UTC").format("MM/DD/YYYY HH:mm:ss")); 
        date1 = window["toDateString"](d);
        date2 = window["toDateString"](e);
        if(navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("rv:11.0") > -1 || navigator.userAgent.indexOf("Edge") > -1)
        {
         let tmpDate = (d.getMonth() + 1) + "/" + d.getDate()  + "/" + d.getFullYear();
         date1 = tmpDate;
         let tmpDate1 = (e.getMonth() + 1) + "/" + e.getDate()  + "/"  + e.getFullYear();
         date2 = tmpDate1;
        }
        filter.lastTime = false;
      }
      else
      {
        let time = Util.convertLastToFormatted(pageFilter.timeFilter.last);
        d = new Date(time.startTime);
        e = new Date(time.endTime);
        date1 = window["toDateString"](d);
        date2 = window["toDateString"](e);
        if(navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("rv:11.0") > -1 || navigator.userAgent.indexOf("Edge") > -1)
        {
         let tmpDate = (d.getMonth() + 1) + "/" + d.getDate()  + "/" + d.getFullYear();
         date1 = tmpDate;
         let tmpDate1 = (e.getMonth() + 1) + "/" + e.getDate()  + "/"  + e.getFullYear();
         date2 = tmpDate1;
        }
        filter.lastTime = true;
      }
        //date1 and date2 is stime and endtime
      if (pageFilter.timeFiltercmp.last === null || pageFilter.timeFiltercmp.last === "")
      {
        if(pageFilter.toggle == false){
        //dcmp = new Date(pageFilter.stimecmp);

        //ecmp = new Date(pageFilter.etimecmp);
        
        let offset = moment.tz(new Date(pageFilter.stimecmp), sessionStorage.getItem('_nvtimezone')).format("Z");
        offset = offset.replace(":", "");
        let stdateObj = new Date(pageFilter.stimecmp + " " + offset);
        dcmp = new Date(moment.tz(stdateObj, "UTC").format("MM/DD/YYYY HH:mm:ss"));
        let offsett = moment.tz(new Date(pageFilter.etimecmp), sessionStorage.getItem('_nvtimezone')).format("Z");
        offsett = offsett.replace(":", "");
        let etdateObj = new Date(pageFilter.etimecmp + " " + offsett);
        ecmp = new Date(moment.tz(etdateObj, "UTC").format("MM/DD/YYYY HH:mm:ss"));
     
        datecmp1 = window["toDateString"](dcmp);
        datecmp2 = window["toDateString"](ecmp);
        if(navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("rv:11.0") > -1 || navigator.userAgent.indexOf("Edge") > -1)
        {
         let tmpDate = (dcmp.getMonth() + 1) + "/" + dcmp.getDate()  + "/" + dcmp.getFullYear();
         datecmp1 = tmpDate;
         let tmpDate1 = (ecmp.getMonth() + 1) + "/" + ecmp.getDate()  + "/"  + ecmp.getFullYear();
         datecmp2 = tmpDate1;
        }
        filter.lastTime = false;
       }
      }
      else if(pageFilter.toggle == false)
      {
        let time = Util.convertLastToFormatted(pageFilter.timeFiltercmp.last);
        dcmp = new Date(time.startTime);
        ecmp = new Date(time.endTime);
        datecmp1 = window["toDateString"](dcmp);
        datecmp2 = window["toDateString"](ecmp);
        if(navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("rv:11.0") > -1 || navigator.userAgent.indexOf("Edge") > -1)
        {
         let tmpDate = (dcmp.getMonth() + 1) + "/" + dcmp.getDate()  + "/" + dcmp.getFullYear();
         datecmp1 = tmpDate;
         let tmpDate1 = (ecmp.getMonth() + 1) + "/" + ecmp.getDate()  + "/"  + ecmp.getFullYear();
         datecmp2 = tmpDate1;
        }
        filter.lastTime = true;
      }
         
        // set the bucket duration for calculating bucket duration in auto mode. 
        // TODO: check for comparison mode. 
        let startdate = d.getTime()/1000;
        let endtime = e.getTime()/1000;     
        diffBetweenStartAndEndTime = (endtime - startdate); 
	let stmillis = new Date(date1).getTime();
        let stmilliscmp = new Date(datecmp1).getTime();
        let hours = d.getHours();
        let mins = d.getMinutes();
        let adjust = ((hours * 60 ) + mins) * 60 * 1000;
        if(!bucketflag)
        {
        filter.timeFilter.startTime = date1 + ' ' + d.toTimeString().split(" ")[0];
        filter.timeFilter.endTime = date2 + ' ' + e.toTimeString().split(" ")[0];
        if(pageFilter.toggle == false)
        {
        filter.timeFiltercmp.startTime = datecmp1 + ' ' + dcmp.toTimeString().split(" ")[0];
        filter.timeFiltercmp.endTime = datecmp2 + ' ' + ecmp.toTimeString().split(" ")[0];
        }
        }
        else if(bucketflag)
        {
         var bucketsize = this.setBucketInSec(pageFilter.bucket, diffBetweenStartAndEndTime) * 1000;
         var bucketCount = (Math.floor((e.getTime()-d.getTime())/bucketsize) == 0) ? 1 : Math.floor((e.getTime()-d.getTime())/bucketsize);
         var bucketCountcmp = 0;
         if(pageFilter.toggle == false)
          bucketCountcmp = (Math.floor((ecmp.getTime()-dcmp.getTime())/bucketsize) == 0) ? 1 : Math.floor((ecmp.getTime()-dcmp.getTime())/bucketsize);
         var ad = (adjust % bucketsize == 0);
         if(adjust % bucketsize == 0)
         {
          if(((e.getTime()-d.getTime()) % bucketsize != 0))
            bucketCount++;
         }
         else
         {
          //if((3600000 - (e.getTime()-d.getTime())) === 60000)
          // bucketCount++;
         }
         adjust -= (adjust % bucketsize);
         var st =  stmillis + adjust;
         if(!ad)
          st += bucketsize;
         var et = st + (bucketCount * bucketsize);
         filter.timeFilter.startTime = window["toDateString"](new Date(st)) + ' ' + new Date(st).toTimeString().split(" ")[0];
         filter.timeFilter.endTime = window["toDateString"](new Date(et)) + ' ' + new Date(et).toTimeString().split(" ")[0];
         if(pageFilter.toggle == false)
         {
          let hourscmp = dcmp.getHours();
          let minscmp = dcmp.getMinutes();
          let adjustcmp = ((hourscmp * 60 ) + minscmp) * 60 * 1000;
          var adcmp = (adjustcmp % bucketsize == 0);
          if(adjustcmp % bucketsize == 0)
          {
          if(pageFilter.toggle == false && ((ecmp.getTime()-dcmp.getTime()) % bucketsize != 0))
            bucketCountcmp++;
          }
          adjustcmp -= (adjustcmp % bucketsize);
          var stcmp =  stmilliscmp + adjustcmp;
          if(!adcmp)
           stcmp += bucketsize;
          var etcmp = stcmp + (bucketCountcmp * bucketsize);
          filter.timeFiltercmp.startTime = window["toDateString"](new Date(stcmp)) + ' ' + new Date(stcmp).toTimeString().split(" ")[0];
          filter.timeFiltercmp.endTime = window["toDateString"](new Date(etcmp)) + ' ' + new Date(etcmp).toTimeString().split(" ")[0];
         }
         if(navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("rv:11.0") > -1 || navigator.userAgent.indexOf("Edge") > -1)
         {
           let datesm = new Date(st);
           filter.timeFilter.startTime = (datesm.getMonth() + 1) + "/" + datesm.getDate()  + "/" + datesm.getFullYear() + ' '+ datesm.toTimeString().split(" ")[0];
           let datesm2 = new Date(et);
           filter.timeFilter.endTime  = (datesm2.getMonth() + 1) + "/" + datesm2.getDate()  + "/"  + datesm2.getFullYear()  + ' '+ datesm2.toTimeString().split(" ")[0];
           if(pageFilter.toggle == false)
           {
           let datesmcmp = new Date(stcmp);
           filter.timeFiltercmp.startTime = (datesmcmp.getMonth() + 1) + "/" + datesmcmp.getDate()  + "/" + datesmcmp.getFullYear() + ' '+ datesmcmp.toTimeString().split(" ")[0];
           let datesmcmp2 = new Date(etcmp);
           filter.timeFiltercmp.endTime  = (datesmcmp2.getMonth() + 1) + "/" + datesmcmp2.getDate()  + "/"  + datesmcmp2.getFullYear()  + ' '+ datesmcmp2.toTimeString().split(" ")[0]; 
           }
        }
         filter.timeFilter.last = "";
         if(pageFilter.toggle == true)
         {
         filter.timeFiltercmp.last = "";
         filter.timeFiltercmp.startTime="";
         filter.timeFiltercmp.endTime="";
         }
         //if(pageFilter.toggle == true || pageFilter.toggle == undefined || pageFilter.toggle == "undefined")    
         //MsgService.warn("Time Period Modified from " + filter.timeFilter.startTime + " - " + filter.timeFilter.endTime );
         //if(pageFilter.toggle == false)
         //MsgService.warn("Compare Mode Time Period for duration 1 : " + filter.timeFilter.startTime + " - " + filter.timeFilter.endTime +" And duration 2 : "+ filter.timeFiltercmp.startTime + " - " + filter.timeFiltercmp.endTime);
        }
    return filter;
 }	


 
settime(time)
{
  let mil = 60*1000;
  switch(time)
  {
   case '5 Min':
    return 5*mil;
   case '15 Min':
    return 15*mil;
   case '30 Min':
    return 30*mil;   
  }
}

  static MONTH:number = 86400*30; 
  static YEAR:number = 86400*365;
  static WEEK:number = 86400*7;
  static DAY:number = 86400;

  // It will calculate bucket based upon filter duration and return in second. 
  getBucketFromFilterDuration(diffBetweenStartAndEndTimeMsec: number) 
  {
    let duration =  diffBetweenStartAndEndTimeMsec; 
    
    if((duration >= ParsePagePerformanceFilters.MONTH * 6)) 
      return 86400; /*24 hour*/
    if((duration >= ParsePagePerformanceFilters.MONTH)) 
      return 8*3600 /*8 Hour*/;
    if((duration >= ParsePagePerformanceFilters.WEEK)) 
      return 4*3600 /*4 Hour*/;
    return 3600;
  }

 setBucketInSec(bucket, diffBetweenStartAndEndTime?: number)
  {
   
    if(bucket === "Auto")
    {
     // Check duration. 
     if(diffBetweenStartAndEndTime == undefined)
       return 1*60*60;
     else 
       return this.getBucketFromFilterDuration(diffBetweenStartAndEndTime);
    }
    else {    
    let f = bucket.split(" ");
    if(f[1] === "Min")
     return (f[0]*60);
    else
     return (f[0]*60*60);
    }
  }

  getLocation(name,metadata)
  {
    let nameList = '';
    if (name.length > 0)
    {
      for (let a = 0; a < name.length; a++)
      {
        if (a > 0)
        {
          nameList += ',';
        }
         let state = metadata.locationMap.get(parseInt(name[a])).state ? (metadata.locationMap.get(parseInt(name[a])).state + ',' ) : '';
         nameList += state + metadata.locationMap.get(parseInt(name[a])).country;
      }
    }
    return nameList;
  }

 
  constructor()
  {
    this.filter =  new PagePerformanceFilter();
    let _timefilter = {"startTime":"","endTime":"","last":""};
    let _timefiltercmp = {"startTime":"","endTime":"","last":""};
    this.showFilter = {"lastval":"15 Minutes","_timefilter":"false","timeFilter":_timefilter,"timeFiltercmp":_timefiltercmp,"channel":null,"userSegment":null,"device":null
,"entryPage":null,"browser":null,"platform":null,"platformversion":null,"connectionType":null,"location":null,"IncludeLocation":null
,"ExcludeLocation":null,"IncludeBrowser":null,"ExcludeBrowser":null,"IncludeOS":null,"bucket":'1 Hour',"stime":new Date()
,"etime":new Date(),"formosicon":null,"formbrowsericon":null};
  }
}
