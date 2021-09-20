import { UserDataHandler } from './userdatahandler';
export class UserDataRecord {
  
  timestamp:number;
  pageInstance:number;
  recordType:number;
  data:string;
  
  constructor(recordType, node)
  {
     let timestamp = 0;
     let newdate = null;
     if(recordType === UserDataHandler.XHR_DATA) 
     {
       let js = decodeURIComponent(node.data);
       let jsob = {};
       try
       {
         jsob = JSON.parse(js);
       }
       catch(e) {}
       
       if(jsob.hasOwnProperty('timings'))
       {
        if(jsob['timings'] !== null && jsob['timings'] !== 'null' && jsob['timings'] !== '')
          this.timestamp = jsob['timings'].requestStart;
        else
          this.timestamp = node.timestamp * 1000;
       }
       else
       {
        this.timestamp = node.timestamp * 1000;
       }
       
    }
    else if(recordType === UserDataHandler.TRANSACTION_END)
    { 
       // for end transaction.
       this.timestamp = node.timestamp + node.duration;
    }
    else if(recordType === UserDataHandler.JSERRDATA)
     {
        // since time is in dd/mm/yy ,need to be converted in mm/dd/yy
        try{
        newdate = node.timestamp.split("/")[1] + "/" + node.timestamp.split("/")[0] + "/" + node.timestamp.split("/")[2];
        timestamp= new Date(newdate).getTime();
	this.timestamp=((timestamp/1000 -1388534400))*1000; 
        }catch(e){
           this.timestamp= 0;
        }
    }
    else 
    {
       this.timestamp = node.timestamp;
    }
    
    this.pageInstance = node.pageInstance;

    // adding epoch value , since start time is in epoch
    this.timestamp = ((this.timestamp /1000) + 1388534400) *1000; 

    if(recordType === UserDataHandler.JSERRDATA)
      this.pageInstance = node.pageinstance;
    this.recordType = recordType;
    this.data = node;
   }
}
  












