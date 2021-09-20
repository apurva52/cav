import { Filter } from './filter';
import { TimeFilter } from './timefilter';
import { AutoCommand } from './autocommand';
import { StoreAttribute } from './storeattribute';
import { BPData } from './bpdata';
import { CustomAttributeFilter } from './customattributefilter';

export class SessionFilter extends Filter {

  entrypage: string;
  exitpage: string;
  location: string;
  browser: string;
  channel: string;
  platform: string; // pass id instead of value
  device: string;
  clientip: string;
  screenresolution: string;
  pagecount: string;
  duration: string;
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
  currSessionId: string;
  currSessionId1: string;
  previousSessFlag: boolean = false;
  loginid: string;
  strugglingUserSessions: boolean;
  healthyUserSessions: boolean;
  sessionsWithEvent: boolean;
  sessionWithND: boolean;
  crashSessions: boolean;
  sessionsWithReplay: boolean;
  particularPage: boolean = false;
  sessionsWithSpecificEvents: string;
  platformVersion: string;
  referrerUrl: string;
  userSegment: string;
  encryptedloginId: string;
  lastTime: boolean;
  customAttributeFilter: CustomAttributeFilter;
  bpAttributeFilter: BPData;
  storeFilter: StoreAttribute;
  pageinstance: string;
  sequence: any; // json array
  dataFlag: any; // boolean
  scanoffset: any; //number
  uUID: any;
  filtermode: any; // filter sessions on basis  of normal filter or similar sessions filter
  autoCommand: AutoCommand;
  pageWithEvent: any;
  sid: any;
  botSessions: boolean;
  notAuth: boolean;
  authFailed: boolean;
  countBucket: number;
  sessionEventFlag: any;
  strictSequence: boolean; // boolean
  deeplinkflag: any;
  eventData: string;
  constructor() {
    super();
    this.autoCommand = new AutoCommand();
  }
}





