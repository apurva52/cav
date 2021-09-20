import { TimeFilter } from './timefilter';

export class PagePerformanceFilter {
  lastTime: boolean = false;
  pages: string;
  locations: string;
  browsers: string;
  channels: string;
  devices: string;
  conType: string;
  userSegments: string;
  bucket : number;
  excludePage: string;
  excludeBrowser: string;
  excludeLocation: string;
  excludeOS: FilterWithVersion[];
  timeFilter: TimeFilter;
  timeFiltercmp: TimeFilter;
  os:FilterWithVersion[];
  excludeDevice: string; 
  pageName: string;
  Type:string;
  granularity: any;
  metricType : any;
  dimType: any;
  rollingwindow : any;
  platform:any;
  dimName: any;
  threshold: number;
  limit : number;
  offset : number;
  groups : any;
  count  = false;
  line : any;
  errorMessage : any;
  column :any;
  filename : any;
  jserrorStr : any;
  jsFileData : any;
  type : any;
  browserVersion : any;
  page : string;
  sid : string;
  constructor()
  {
   this.timeFilter = new TimeFilter();
   this.timeFiltercmp = {"startTime":"","endTime":"","last":""};

  }
}
  export class FilterWithVersion
  {
   version: string;
   name: string;
  }






