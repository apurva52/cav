import { PagePerformanceFilter } from './../../common/interfaces/pageperformancefilter';
import { ViewFilter } from './../../common/interfaces/viewfilter';
import { Metadata } from './../../common/interfaces/metadata';
import { Util } from '../../common/util/util';
//import { Util } from './../../common/utils/util';
//import { MsgService } from './../../common/services/msg.service';

export class PathAnalysisFilters {

  filter: PagePerformanceFilter;
  filterCriteriaList = [];
  showFilter : any;
  
  getPathFilter(pagepFilter, metadata: Metadata)
  { 
    this.filter = new PagePerformanceFilter();
    this.filterCriteriaList = [];
    //time filter
    this.setTimeFilter(pagepFilter, metadata);
    // page performance filters
    this.setPagePerformanceFilter(pagepFilter, metadata);
    // set all the filters on the static session filter object.
    this.showFilter = pagepFilter;
  }
  
  setTimeFilter(pageFilter, metadata)
 {
   console.log("pagefilter==>",pageFilter);
     let filter = this.filter;
     let d ;
     let e;
     let date1;
     let date2;
      if (pageFilter.timeFilter.last === null || pageFilter.timeFilter.last === "")
      {
        d = new Date(pageFilter.stime);
        e  = new Date(pageFilter.etime);
        date1 = window["toDateString"](d);
        date2 = window["toDateString"](e);
        filter.lastTime = false;
      }
      else
      {
        let time = Util.convertLastToFormatted(pageFilter.lastval);
        d = new Date(time.startTime);
        e  = new Date(time.endTime);
        date1 = window["toDateString"](d);
        date2 = window["toDateString"](e);
        filter.lastTime = true;
      }
        if(navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("rv:11.0") > -1 || navigator.userAgent.indexOf("Edge") > -1)
		 {
         let tmpDate = (d.getMonth() + 1) + "/" + d.getDate()  + "/" + d.getFullYear();
         date1 = tmpDate;
         let tmpDate1 = (e.getMonth() + 1) + "/" + e.getDate()  + "/"  + e.getFullYear();
         date2 = tmpDate1;
        }
         filter.timeFilter.startTime = date1 + ' ' + d.toTimeString().split(" ")[0];
         filter.timeFilter.endTime = date2 + ' ' + e.toTimeString().split(" ")[0];
	 return filter;	
    }    
	
   constructor()
   {
    let _timefilter = {"startTime":"","endTime":"","last":""};
    this.showFilter = {"lastval":"15 Minutes","_timefilter":"false","timeFilter":_timefilter,"channel":null,"userSegment":null,"device":null
,"entryPage":null,"browser":null,"platform":null,"IncludeLocation":null
,"IncludeBrowser":null,"IncludeOS":null,"stime":new Date()
,"etime":new Date()};
  }
  
  setPagePerformanceFilter(pagepFilter, metadata)
  {
   let filter = this.filter;
   if (pagepFilter.channel !== null && pagepFilter.channel !== "" && pagepFilter.channel.length > 0)
    {
      this.filter.channels = pagepFilter.channel.join(",");
      this.filterCriteriaList.push(new ViewFilter('Channel',  Util.getChannelNames(pagepFilter.channel, metadata), null));
    }
   if (pagepFilter.browser !== null && pagepFilter.browser !== "" &&  pagepFilter.browser !== "null")
    {
      filter.browsers = pagepFilter.browser;
      this.filterCriteriaList.push(new ViewFilter('Browser',metadata.browserMap.get(pagepFilter.browser).name, null));
    }
	 if (pagepFilter.device !== null && pagepFilter.device.length >0 && pagepFilter.device !== "null")
    {
      filter.devices = "'" + pagepFilter.device + "'";
      this.filterCriteriaList.push(new ViewFilter('Include Device', pagepFilter.device, null));
    }
    if (pagepFilter.location !== null &&  pagepFilter.location !== "null" )
    {
      filter.locations = pagepFilter.location;
      let state = metadata.locationMap.get(pagepFilter.location).state ? (metadata.locationMap.get(pagepFilter.location).state + ',' ) : '';
      let nameList = state + metadata.locationMap.get(pagepFilter.location).country;
      this.filterCriteriaList.push(new ViewFilter('Location', nameList , null));
    }
    if (pagepFilter.platform !== null && pagepFilter.platform !== "null")
    {
       filter.platform = "'" +  pagepFilter.platform + "'";
       this.filterCriteriaList.push(new ViewFilter('OS',pagepFilter.platform, null));
    }
   if (pagepFilter.userSegment !== null && pagepFilter.userSegment !== '' && pagepFilter.userSegment.length > 0)
   {
     filter.userSegments = pagepFilter.userSegment.join(",");
     this.filterCriteriaList.push(new ViewFilter('User Segment ', Util.getUserSegmentNames(pagepFilter.userSegment, metadata), null));
   }
   if (pagepFilter.page !== null && pagepFilter.page !== "" && pagepFilter.page !== "null" )
    {
      filter.pages = pagepFilter.page
      filter.pageName = metadata.pageNameMap.get(pagepFilter.page).name;
      this.filterCriteriaList.push(new ViewFilter('Page', filter.pageName , null));
    }
   if(pagepFilter.dimType !== null && pagepFilter.dimType !== '')
   {
     console.log('filter.dimType',pagepFilter.dimType);
     filter.dimType = this.getDimType(pagepFilter.dimType);
     filter.dimName = pagepFilter.dimType;
     this.filterCriteriaList.push(new ViewFilter('Dimension Type', pagepFilter.dimType , null));
   }
   else
     filter.dimType = 0;
   if(pagepFilter.threshold !== undefined && pagepFilter.threshold !== null && pagepFilter.threshold !== '')
   {
     filter.threshold = pagepFilter.threshold;
   }
   else
   {
     filter.threshold = 25;
   }
   console.log('filter',filter);
 }

 getDimType(dimval)
 {
  if(dimval === 'Browser')
    return 0;
  else if(dimval === 'OS')
    return 3
  else if(dimval === 'Location')
    return 1
  else if(dimval === 'Device')
   return 2;
  else if(dimval === 'Referrer')
   return 4;
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

  
 }
