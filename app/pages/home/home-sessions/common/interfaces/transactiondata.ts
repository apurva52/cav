import { Metadata } from './metadata';
import { PageName } from './page';
import { Util } from './../util/util';
import {Browser} from './browser';
import {Event} from './event';
import {Location} from './location';
import {OS} from './operatingsystem';
import {Channel} from './channel';
import {Store} from './store';
import { BusinessProcess } from './businessprocess';
import { CustomMetricMetadata } from './custommetricmetadata';
import { Terminal } from './terminal';
import {UserSegment} from './usersegment';
import { ConnectionType } from './connectiontype';
import { Device } from './device';
import * as moment from 'moment';
import 'moment-timezone';

export class Transaction {
   
   pageName:PageName;
   sid:string;
   pageInstance:number;
   startTime:string;
   name:string;
   duration:number;
   serverTime:number;
   networkTime:number;
   formattedStartTime:string;
   formattedDuration:string;
   failedTransaction:boolean;
   _sid:string;
   actionData:any = null;
   browser:Browser;
   browserVersion:string;
   channel:Channel;
   location:Location;
   os:string;
   osVersion:string;
   store:Store;
   terminal:number;
   device:any;   
   clientIp:any;

   constructor(dbrecord : any, metadata: Metadata)
   {
      //console.log("dbrecord" , dbrecord);
     try
     {
      // setting all the properties.
      this.pageName = metadata.getPageFromName(dbrecord.pageName);
      this.sid = dbrecord._sid;
      this.pageInstance = dbrecord.pageInstance;
      this.startTime = dbrecord.startTime;
      this.name = dbrecord.name;
      this.duration = dbrecord.duration;
      this.serverTime = dbrecord.serverTime;
      this.networkTime = dbrecord.networkTime;
      let timesid = moment.utc(dbrecord._startTime,"MM/DD/YY HH:mm:ss").valueOf();
      this.formattedStartTime = moment.tz(new Date(timesid),sessionStorage.getItem("_nvtimezone")).format('HH:mm:ss MM/DD/YY');
      this.failedTransaction = dbrecord.failedTransaction;
      this._sid = dbrecord._sid;  //TODO : requirement not clear

      this.browser = metadata.getBrowser(dbrecord.browserid);
      this.browserVersion = dbrecord.browserVersion;
      this.channel = metadata.getChannel(dbrecord.channelid);
      this.location = metadata.getLocation(dbrecord.locationid);
      this.os = dbrecord.os;
      this.osVersion = dbrecord.mobileosversion;
      this.store = metadata.getStore(dbrecord.storeid);
      this.terminal = dbrecord.terminalid;
      this.device = Device.devices[dbrecord.device];;
      if(dbrecord.clientIp === "null")
        this.clientIp = "-";
      else
        this.clientIp = dbrecord.clientIp;

      this.formattedDuration = Util.SecToFormattedDuration(this.duration/1000); 
      if(dbrecord.data){
        this.actionData = decodeURIComponent(dbrecord.data);
        try
        {
          // converting into json then beautifying
          this.actionData = JSON.stringify(JSON.parse(this.actionData),null,2);
        }
        catch(e)
        {
          console.log("Failed to parse transaction action data",e);
        }
      }
     }
     catch(e)
     {
       console.log("Failed to parse transaction",e);
     }
   }
}
