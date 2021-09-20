import { TimeFilter} from './timefilter';

export class PageFilters
{
   timeFilter = new TimeFilter();
   lastTime:boolean;
   // multi-select filters
   devices:string;  // names
   browsers:string;
   locations:string;
   channels:string;
   userSegments:string;
   pages:string;
   conType:string;
   contypeName:string;
   events:string;
   eventData: string;
   os:FilterWithVersion[]; 
   stores:string;
   terminals:string;
   associate:string;
   transactionid : string;
   id:string;
   idtype:string;
    accessType:string;
    accessName:string;



   // data filters
   sid:string;
   host:string;
   referrerUrl:string;
   pageUrl:string;
   clientIp:string;
   // performance metrics
   onload: MetricFilter;
   domContentLoaded: MetricFilter;
   domInteractive: MetricFilter;
   dom: MetricFilter;
   perceivedRender: MetricFilter;
   unload: MetricFilter;
   dns: MetricFilter;
   tcp: MetricFilter;
   ssl: MetricFilter;
   wait: MetricFilter;
   conName:string;
   download: MetricFilter;
   firstpaint : MetricFilter;
   firstcontentpaint : MetricFilter;
   firstinputdelay : MetricFilter;
   timetointeractive : MetricFilter;

  
   offset = 1;
   groupBy:string[];
   limit = 300;
   bucketString = "5 Minutes";
   pageCount = false;
   pagefiltermode = false;
   ddrflag = false;
}




export class MetricFilter
{
   operands: number[];
   operator: string;
}

export class FilterWithVersion
{
  version: string;
  name: string;
}
























