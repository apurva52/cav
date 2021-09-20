import { TimeFilter } from './timefilter';

export class Filter {
  // TODO : change property cases and types once done in server side.
  // TODO : bp filter
  limit = 15;
  offset = 0;
  sessionCount = false;
  orderBy: string[] = ['sessionstarttime']; // fix in java side
  output: string[] = [];
  timeFilter: TimeFilter;
  
  constructor()
  {
    this.timeFilter = new TimeFilter();
  }
}


/*
var jsonStr = {
               "limit":100,
               "offset":0,
               "order by":"sessionstarttime",            
               "output":[
                         "entrypage","exitpage","location","browser","channel"
                        ],
               "timeFilter":  {
                          "startTime": "114719400",
                          "endTime": "115064999"
                        },
               "entrypage":"1",
               "exitpage":"1",
               "location":"0",
               "browser":"0",
               //"channel":"0", 
               "platform": "WINDOWS",
               "deviceType": "PC",

              "bpAttributeFilter":{
                      //"completeBP":true,
                      //"abandonedBP":true,
                      //"bpExitPage":"index"
                    },
               "pageAttributeFilter":{
  "page": "1", 
                              "url":"google.com"                     
 
                               },

               "customAttributeFilter": {
                              "count": 2,
                              "filters": [
                                   {
                                     "opr": "=",
                                     "val": "amhnaA==",
                                     "filterName": "football",
                                     "type": "0",
                                     "clientdataid": "1",
                                     "dvalue": "hghj"
                                   }, 
                                   {
                                     "opr": "=",
                                     "val": "Z2poZ2hq",
                                     "filterName": "hockey",
                                     "type": "0",
                                     "clientdataid": "3",
                                     "dvalue": "jhghjg"
                                   }
                               ],
                              "operator": "AND",
   "url": ""
                       }
              };*/
