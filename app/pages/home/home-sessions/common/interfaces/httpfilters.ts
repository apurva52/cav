import { Filter } from './filter';
import { TimeFilter } from './timefilter';

export class HttpFilter extends Filter {
  
  ddrscatterflag = false;
  bucketString = "5 Minutes";
  duration : number = 24 * 3600; // 1 Day
  totalBuckets : number = 24 * 12;
  locations: string;
  browsers: string;
  channel: string;
  platform: string; // pass id instead of value
  devices: string;
  clientip: string;
  screenresolution: string;
  pagecount: string;
  //duration: string;
  ordertotal: number;
  ordercount: number;
  conType: string;
  svcUrl: string;
  pageUrl: string;
  containingPage: string;
  nonContainingPage: string;
  pageLoadTime: number;
  domCompleteTime: number;
  nvSessionId: string;
  loginid: string;
  strugglingUserSessions: boolean;
  sessionsWithEvent: boolean;
  sessionWithND: boolean;
  sessionsWithReplay: boolean;
  sessionsWithSpecificEvents: string;
  platformVersion: string;
  referrerUrl: string;
  userSegment: string;
  encryptedloginId: string;
  lastTime: boolean;
  customAttributeFilter: {};
  bpAttributeFilter: {};
  storeFilter: {};
  pageCount = false;
  entrypage: string;
  exitpage: string;
  statuscode :string;
  failureCode :string;
  method :string;
  resourcename:string;
  domainname :string;
  correlationid : string;
  stores:string;
  url :string;
  mobilecarrier : string;
  responsetime : string;
  errorCode: boolean = false;
  resourceId :string;
  accessId : string;
  xhrGroup : string; 
  pages : number;

  constructor()
  {
    super();
  }
}





