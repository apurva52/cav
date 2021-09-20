import { PageFilters } from './../../../../common/interfaces/pagefilter';
import { ViewFilter } from './../../../../common/interfaces/viewfilter';
import { Metadata } from './../../../../common/interfaces/metadata';
//import { PagefiltercriteriaComponent} from './pagefiltercriteria/pagefiltercriteria.component';
import { Util } from './../../../../common/util/util';

export class ParsePageFilter
{
  static pageFilters = new PageFilters();
  filterCriteriaList = [];
  static duration = 24 * 3600; // 1 Day
  static totalBuckets = 24 * 12;  
  setPageFilterCriteria(metadata: Metadata)
  {
    // set Time Filter
    this.setTimeFilter();      
    this.setFilterCriteria(metadata);    
  }

  setTimeFilter()
  {
      if (ParsePageFilter.pageFilters.timeFilter.last === null || ParsePageFilter.pageFilters.timeFilter.last == "")
      {
        let d = new Date(ParsePageFilter.pageFilters.timeFilter.startTime);
        let e  = new Date(ParsePageFilter.pageFilters.timeFilter.endTime);
        //PagefiltercriteriaComponent.setTimeHtml(window["toDateString"](d) + ' ' + d.toTimeString().split(" ")[0] + " - " + window["toDateString"](e) + ' ' + e.toTimeString().split(" ")[0]);
      }
      else
      {
        //PagefiltercriteriaComponent.setTimeHtml('Last ' + ParsePageFilter.pageFilters.timeFilter.last);
      }
  }

  
  static resetSmartFilters()
  {
    let pageFilter = ParsePageFilter.pageFilters;
    
    pageFilter.devices = null;
    pageFilter.browsers = null;
    pageFilter.locations = null;
    pageFilter.channels = null;
    pageFilter.userSegments = null;
    pageFilter.pages = null;
    pageFilter.events = null;
    pageFilter.os = null;
    pageFilter.stores = null;
    pageFilter.terminals = null;
    pageFilter.associate = null;
    pageFilter.transactionid = null;
    pageFilter.sid = null;
    pageFilter.host = null;
    pageFilter.referrerUrl = null;
    pageFilter.pageUrl = null;
    pageFilter.clientIp = null;
    pageFilter.id =null;
    pageFilter.idtype=null;  
  }

  setFilterCriteria(metadata:Metadata)
  {
     let filter = [];
         //new ViewFilter('SVC Url', sessionFilter.svcUrl, null) 
     let pageFilter = ParsePageFilter.pageFilters;
     if(pageFilter.devices != null && pageFilter.devices != undefined)
     {
       filter.push(new ViewFilter('Device(s)', pageFilter.devices.split("'").join(""), null));
     }

     if(pageFilter.locations != null && pageFilter.locations != undefined)
     {
       let id = pageFilter.locations.split(",");
       let locationStr = "";
       for(let i = 0 ; i < id.length ; i++)
       {
          if(locationStr != "")
            locationStr += ",";
          let location = metadata.locationMap.get(parseInt(id[i]));
          let state = location.state ? location.state + ','  : '';
          locationStr += (state + location.country);
       }
       filter.push(new ViewFilter('Location(s)', locationStr, null));

     }

     if(pageFilter.browsers != null && pageFilter.browsers != undefined)
     {
       let id = pageFilter.browsers.split(",");
       let browserId = "";
       for(let i = 0 ; i < id.length ; i++)
       {
         if(browserId != "")
            browserId += ",";
          browserId += metadata.browserMap.get(parseInt(id[i])).name;
        }
       filter.push(new ViewFilter('Browser(s)', browserId , null));
     }

     if(pageFilter.channels != null && pageFilter.channels != undefined)
     {
       filter.push(new ViewFilter('Channel(s)', metadata.channelMap.get(parseInt(pageFilter.channels)).name, null));
     }

     if(pageFilter.userSegments != null && pageFilter.userSegments != undefined)
     {
       filter.push(new ViewFilter('User Segment(s)', Util.getUserSegmentNames(pageFilter.userSegments, metadata), null));
     }

      if(pageFilter.pages != null && pageFilter.pages != undefined)
     {
       console.log(pageFilter.pages);
       let pageids = pageFilter.pages.split(",");
       let pageStr = "";
       for(let i = 0; i < pageids.length; i++)
       {
         if(pageStr != "")
           pageStr += ","
         pageStr += metadata.getPageName(parseInt(pageids[i])).name; 
       }
       filter.push(new ViewFilter('Page(s)', pageStr, null));
     }

      if(pageFilter.events != null && pageFilter.events != undefined && metadata != null)
     {
       let eventStr = "";
       let event = (pageFilter.events).split(",");
       for(let i = 0 ; i < event.length ; i++)  {
         if(eventStr != "")
            eventStr += ",";
         eventStr += metadata.eventMap.get(parseInt(event[i])).name;
       }
       filter.push(new ViewFilter('Events(s)', eventStr, null));
       //filter.push(new ViewFilter('Events(s)', metadata.eventMap.get(parseInt(pageFilter.events)).name, null));
     }

     if(pageFilter.eventData != undefined && pageFilter.eventData != null)
       filter.push(new ViewFilter('Event Data' , pageFilter.eventData , null));

      if(pageFilter.os != null && pageFilter.os != undefined)
     {
       let osStr = "";
       for(let i = 0 ; i < pageFilter.os.length; i++)
       {
        if(osStr !== pageFilter.os[i].name)
         {
            if(osStr != "")
              osStr += ",";
            osStr += pageFilter.os[i].name;
         }
       }
       filter.push(new ViewFilter('OS(s)', osStr, null));
     }

      if(pageFilter.stores != null && pageFilter.stores != undefined)
     {
       filter.push(new ViewFilter('Store(s)', pageFilter.stores, null));
     }

      if(pageFilter.terminals != null && pageFilter.terminals != undefined)
     {
       filter.push(new ViewFilter('Terminal(s)', pageFilter.terminals, null));
     }

     if(pageFilter.transactionid != null && pageFilter.transactionid != undefined)
     {
       filter.push(new ViewFilter('TransactionID(s)', pageFilter.transactionid, null));
     }

      if(pageFilter.associate != null && pageFilter.associate != undefined)
     {
       filter.push(new ViewFilter('Associate(s)', pageFilter.associate, null));
     }

      if(pageFilter.sid != null && pageFilter.sid != undefined)
     {
       filter.push(new ViewFilter('NVSessionID(s)', pageFilter.sid, null));
     }

      if(pageFilter.host != null && pageFilter.host != undefined)
     {
       filter.push(new ViewFilter('Host(s)', pageFilter.host, null));
     }

      if(pageFilter.referrerUrl != null && pageFilter.referrerUrl != undefined)
     {
       filter.push(new ViewFilter('Referrer URL(s)', pageFilter.referrerUrl, null));
     }

      if(pageFilter.pageUrl != null && pageFilter.pageUrl != undefined)
     {
       filter.push(new ViewFilter('URL(s)', pageFilter.pageUrl, null));
     }

     if(pageFilter.clientIp != null && pageFilter.clientIp != undefined)
     {
       filter.push(new ViewFilter('Client IP', pageFilter.clientIp, null));
     }

     if(pageFilter.id != null && pageFilter.id != undefined)
     {
       filter.push(new ViewFilter('Element Id ', pageFilter.id, null));
     }
     
     if(pageFilter.accessType != null && pageFilter.accessType != undefined)
     {
       if(pageFilter.accessName != null && pageFilter.accessName != undefined)
       filter.push(new ViewFilter('Access Type ', pageFilter.accessName, null));
     }
    
     if(pageFilter.conType != null && pageFilter.conType != undefined)
     {
       if(pageFilter.contypeName != null && pageFilter.contypeName != undefined)
       filter.push(new ViewFilter('Connection Type ', pageFilter.contypeName, null));
     }
 
     /*PagefiltercriteriaComponent.filterhtml = "";
     for(let i = 0; i < filter.length; i++)
     {
       PagefiltercriteriaComponent.filterhtml += (i > 0) ? " , " : "";
       PagefiltercriteriaComponent.filterhtml += filter[i].name + " : " + filter[i].value;
     }*/
  } 
 
}
