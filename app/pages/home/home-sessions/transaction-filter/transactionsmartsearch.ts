import { CustomAttributeFilter } from "../common/interfaces/customattributefilter";
import { CustomData } from "../common/interfaces/customdata";
import { Metadata } from "../common/interfaces/metadata";
import { nvEncoder } from "../common/interfaces/nvencode";
import { TimeFilter } from '../common/interfaces/timefilter';
import { Transaction } from '../common/interfaces/transactiondata';
import { TransactionFilter } from './../common/interfaces/transactionfilter';
import { StoreFilter } from './transactionattribute/storefilter';
import { Suggestion } from "../common/interfaces/suggestion";
import { ViewFilter } from "../common/interfaces/viewfilter";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {FilterWithVersion} from '../common/interfaces/pagefilter';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export class TranasactionSmartSearch {
    transactionFilter: TransactionFilter;

    suggestions = [];
    channel =[];
    browsers = [];
    locations = [];
    os = [];
    stores = [];
    pages = [];
    events = [];
    filters = [];
    devices = [];
    transactions = [];
    history = false;
    recentSearches = [];
    searchInput: any;
    selectedKeyword: any;
    metadata: Metadata;
    filterCriteria: any;
    smartSearchInput: any;
    private searchTimer: any = -1;
    private searchFn: Function = null;
    private ctx: any;
  
    private MAX_ITEMS_IN_HISTORY = 5;
  
    private LOCALSTROAGE_KEY = "_sessionSuggestions";
    http: HttpClient;
    constructor(http: HttpClient) {
        this.selectedKeyword = 'Auto';
        this.http = http;
    }
	
	init(metadata: Metadata, searchFn: Function, ctx: any) {
        this.metadata = metadata;
        this.searchFn = searchFn;
        this.ctx = ctx;
		
	this.browsers = Array.from(this.metadata.browserMap.keys());
    for(let i = 0 ; i < this.browsers.length; i++)
    {
      this.browsers[i] += ":" + this.metadata.browserMap.get(this.browsers[i]).name;
    }

    this.channel = Array.from(this.metadata.channelMap.keys());
    for(let i = 0 ; i < this.channel.length; i++)
    {
      this.channel[i] += ":" + this.metadata.channelMap.get(this.channel[i]).name;
    } 

    this.os = Array.from(this.metadata.osMap.keys());
    for(let i = 0 ; i < this.os.length; i++)
    {
      this.os[i] += ":" + this.metadata.osMap.get(this.os[i]).name;
    } 

    let tmpOs = [];
    // remove duplicate os entries due to versions of the os
    for(let i = 0; i < this.os.length; i++)
    {

      let found = false;
      for(let j = 0; j < tmpOs.length; j++)
      {
        if(tmpOs[j].indexOf(this.os[i].split(":")[1]) > -1)
        {
          found = true;
          break;
        }
      }
      if(!found)
        tmpOs.push(this.os[i]);
    }
    this.os = tmpOs; 


    this.locations = Array.from(this.metadata.locationMap.keys());
    for(let i = 0 ; i < this.locations.length; i++)
    {
      let location = this.locations[i] + ":";
      if(this.metadata.locationMap.get(this.locations[i]).state !== undefined
         && this.metadata.locationMap.get(this.locations[i]).state !== "")
      {
        location += this.metadata.locationMap.get(this.locations[i]).state + ",";
      }
      location += this.metadata.locationMap.get(this.locations[i]).country;
      this.locations[i] = location;
    }

    this.stores = Array.from(this.metadata.storeMap.keys());
    for(let i = 0 ; i < this.stores.length; i++)
    {
      let store = this.stores[i] + ":";
      store += this.metadata.storeMap.get(this.stores[i]).name + ",";
      store += this.metadata.storeMap.get(this.stores[i]).city;
      this.stores[i] = store;
    }
 
    this.pages = Array.from(this.metadata.pageNameMap.keys());
    for(let i = 0 ; i < this.pages.length; i++)
    {
      this.pages[i] += ":" + this.metadata.pageNameMap.get(this.pages[i]).name;
    }

    this.devices = ['PC','Tablet','Mobile'];
   
    this.transactions = this.metadata.transactions;
    console.log("transactions",this.transactions); 
	}
	
	 findSuggestions($event) {
        this.searchInput = $event.query.trim();
    
        console.log("--this.selectedKeyword", this.selectedKeyword);
    
        if (this.metadata === null) {
          return;
        }
        this.suggestions = [];
        this.recentSearches = [];
    
        // check in local storage for previous search
        // max size 5 currently.
    
        // if blank then do nothing
        if (this.searchInput === "") {
          return;
        }

        if (localStorage.getItem(this.LOCALSTROAGE_KEY) !== null) {
          let history = JSON.parse(localStorage.getItem(this.LOCALSTROAGE_KEY));
          if (history !== null && history.length > 0) {
            for (let i = (history.length - 1); i >= 0; i--) {
              this.recentSearches.push(history[i]);
            }
          }
        }
		
		 let isNumber = !isNaN(this.searchInput);
        
    // look into following
    // 1. browsers
    // 2. location
    // 3. store id

    let storeApplied  = false;

    // for terminal if store filter is added already.
    if(this.searchInput != "" && (this.selectedKeyword == "Stores" || this.selectedKeyword == "Auto"))
    {
       let found = false;
       for(let i = 0; i < this.filters.length; i++)
       {
         if(this.filters[i].filterName === "Stores")
         {
             storeApplied = true;
             let service: string = `/netvision/reports/nvAjaxController.jsp?strOperName=getTerminal&storeId=` + this.filters[i].id;
             this.http.get(service,{responseType:'text'}).pipe(map((response: any) => response))
                  .subscribe((response) => {let a: any = response ;
                  let tmp = [];
                  if(a.trim() != "")
                  {
                  let f = a.trim().split(',');
                  for ( let i = 0; i < f.length ; i++)
                   {
                     this.suggestions.push(new Suggestion('Terminal ID',f[i],1,f[i]));
                   }}

      } );


         }
       }
    } 

 
    // for page count
    if(this.searchInput.indexOf('page') > -1 && this.searchInput.indexOf('count') > -1)
    {
      if(!isNaN(parseInt(this.searchInput.split('page').join('').split('count').join('').trim())))
      {
        this.suggestions.push(new Suggestion('Page Count',parseInt(this.searchInput.split('page').join('').split('count').join('').trim()),0,null));
      }
      //return;
    }

    // for sid
    if(this.searchInput.length > 14 && isNumber)
    {
      this.suggestions.push(new Suggestion('NVSessionID',this.searchInput,0,null));
      //return;
    }

    // for client ip
    // ipv6 support
    let ipPattern = new RegExp(/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/);
     let ipPattern2 = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
    if(ipPattern.test(this.searchInput) || ipPattern2.test(this.searchInput) && (this.selectedKeyword == "Client IP" || this.selectedKeyword == "Auto"))
    {
      this.suggestions.push(new Suggestion('Client IP',this.searchInput,0,null));
      //return;
    }



/*    if(isNumber && (parseInt(this.searchInput) > 99)){
    for(let i = 0; i < this.stores.length; i++)
    {
      if((this.stores[i].toString()).indexOf(this.searchInput) === 0)
      {
        this.suggestions.push(new Suggestion('Stores',this.stores[i].split(":")[1] +
        "(" + this.stores[i].split(":")[0]+ ")",1,this.stores[i].split(":")[0]));
      }
    } 
    } */

    if(isNumber)
    {
      //return;
    }

    //failed transaction
    if(this.selectedKeyword == "Auto")
    {
      this.suggestions.push(new Suggestion("FailedTransaction" ,"Failed Transaction(s)",0,null));
    } 

    //transaction name
    if(this.selectedKeyword == "Transaction" || this.selectedKeyword == "Auto")
    {
    if (this.transactions != undefined && this.transactions != null)  {
      for(let i = 0; i < this.transactions.length; i++)
      {
        if(this.transactions[i].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
        {
          this.suggestions.push(new Suggestion('Transaction',this.transactions[i],1,this.transactions[i]));
        }
      } 
    }
    }

    // all transactions

    // if(this.searchInput.toLowerCase().indexOf('transaction') === 0 && (this.selectedKeyword == "Transaction" || this.selectedKeyword == "Auto"))
    // {
    //   for(let i = 0; i < this.transactions.length; i++)
    //   {
    //      this.suggestions.push(new Suggestion('Transaction',this.transactions[i],1,this.transactions[i]));
    //   }
    //   return;
    // }
    // duration
    /* if(this.selectedKeyword == "Auto")
    {
      this.suggestions.push(new Suggestion('Duration' , this.searchInput,0,null));
    } */

    // all browsers  
    if(this.searchInput.toLowerCase().indexOf('browser') === 0 && (this.selectedKeyword == "Browsers" || this.selectedKeyword == "Auto"))
    {
      for(let i = 0; i < this.browsers.length; i++)
      {
         this.suggestions.push(new Suggestion('Browsers',this.browsers[i].split(":")[1],1,this.browsers[i].split(":")[0]));
      }
      return;
    }

    // all pages
    // if((this.searchInput.trim().toLowerCase() === 'page' || this.searchInput.trim().toLowerCase() === 'pages') && (this.selectedKeyword == "Pages" || this.selectedKeyword == "Auto"))
    // {
    //   for(let i = 0; i < this.pages.length; i++)
    //   {
    //     this.suggestions.push(new Suggestion('Entry Page',this.pages[i].split(":")[1],0,this.pages[i].split(":")[0]));
    //     this.suggestions.push(new Suggestion('Exit Page',this.pages[i].split(":")[1],0,this.pages[i].split(":")[0]));
    //     this.suggestions.push(new Suggestion('Containing Page(s)',this.pages[i].split(":")[1],1,this.pages[i].split(":")[0]));
    //     this.suggestions.push(new Suggestion('Not Containing Page(s)',this.pages[i].split(":")[1],1,this.pages[i].split(":")[0]));
    //   }
    //   return;
    // }

    // all os
 
    if(this.searchInput.toLowerCase().indexOf('os') === 0 && (this.selectedKeyword == "OS" || this.selectedKeyword == "Auto"))
    {
      for(let i = 0; i < this.os.length; i++)
      {
         this.suggestions.push(new Suggestion('OS',this.os[i].split(":")[1],1,this.os[i].split(":")[0]));
      }
      return;
    }


 // all devices
    if(this.searchInput.toLowerCase().indexOf('device') === 0 && (this.selectedKeyword == "Devices" || this.selectedKeyword == "Auto"))
    {
      for(let i = 0; i < this.devices.length; i++)
      {
           this.suggestions.push(new Suggestion('Device(s)',this.devices[i],1,this.devices[i]));
      }
    }

    if(this.selectedKeyword == "Browsers" || this.selectedKeyword == "Auto")
    {
    for(let i = 0; i < this.browsers.length; i++)
    {
      if(this.browsers[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
      {
        this.suggestions.push(new Suggestion('Browsers',this.browsers[i].split(":")[1],1,this.browsers[i].split(":")[0]));
      }
    }
    }

    if(this.selectedKeyword == "OS" || this.selectedKeyword == "Auto")
    {
    for(let i = 0; i < this.os.length; i++)
    {
      if(this.os[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
      {
        this.suggestions.push(new Suggestion('OS',this.os[i].split(":")[1],1,this.os[i].split(":")[0]));
      }
    }
    }
    
    if(this.selectedKeyword == "Locations" || this.selectedKeyword == "Auto")
    {
    for(let i = 0; i < this.locations.length; i++)
    {
      if(this.locations[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
      {
        this.suggestions.push(new Suggestion('Locations',this.locations[i].split(":")[1],1,this.locations[i].split(":")[0]));
      }
    }
    }

    if(this.selectedKeyword == "Pages" || this.selectedKeyword == "Auto")
    {
    for(let i = 0; i < this.pages.length; i++)
    {       if(this.pages[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)  
      {         
	this.suggestions.push(new Suggestion('Page',this.pages[i].split(":")[1],0,this.pages[i].split(":")[0]));        
      }
    }
    }


    if(this.selectedKeyword == "Devices" || this.selectedKeyword == "Auto")
    {
      for(let i = 0; i < this.devices.length; i++)
      {
         if(this.devices[i].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
         {
           this.suggestions.push(new Suggestion('Device(s)',this.devices[i],1,this.devices[i]));
         }
      }
    }

    if(this.selectedKeyword == "Channel" || this.selectedKeyword == "Auto")
    {
      for(let i = 0; i < this.channel.length; i++)
      {
	      if(this.channel[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
        {
	        this.suggestions.push(new Suggestion('Channel', this.channel[i].split(":")[1],0,this.channel[i].split(":")[0]));
	      }
      }
     } 

     for(let i = 0; i < this.stores.length; i++)
     {
      if((this.stores[i].toString()).indexOf(this.searchInput) > -1)
      {
        this.suggestions.push(new Suggestion('Stores',this.stores[i].split(":")[1] +
        "(" + this.stores[i].split(":")[0]+ ")",1,this.stores[i].split(":")[0]));
      }
     }


    }
	
	
 parseFilter() {
    console.log('parsefilter is called ...', this.smartSearchInput);
    this.filters = this.smartSearchInput;
 // reset all the available filters in the smart search to clear any previous applied filters applied from smart search.
   
 let prevTimeFilter  = this.transactionFilter.timeFilter;
 TransactionFilter.resetSmartFilters();
 let tFilter = new TransactionFilter(); 
 tFilter.timeFilter = prevTimeFilter;
 let filterCriteria = [];

 let containingPagesId = [];
 let notContainingPagesId = [];
 let containingPages = [];
 let notContainingPages = [];
 let devices = [];

 for(let i = 0; i < this.filters.length; i++)
 {
   if(this.filters[i].filterName.toLowerCase() === "nvsessionid")
   {
      tFilter.sessionattribute.nvSessionId = this.filters[i].value;
      filterCriteria.push(new ViewFilter("NVSessionId",this.filters[i].value,null));
      //TransactionFilterComponent.setFilterCriteria([]);
      //TransactionFilterComponent.setFilterCriteria(filterCriteria);
      this.searchInput = "";
      //this.router.navigate(['/home/netvision/transactions'],{ queryParams: { filterCriteria:  JSON.stringify(tFilter) }} );

   }
 } 


 for(let i = 0; i < this.filters.length; i++)
 {

   switch(this.filters[i].filterName.toLowerCase())
   {
     case "browsers" :
   tFilter.sessionattribute.browser = "" + this.filters[i].id;
   //filterCriteria.push(new ViewFilter('Browser', this.filters[i].value, null));
       break;
 case "os" : 
   let os = new FilterWithVersion();
       os.name = this.filters[i].value;
       os.version = null
   tFilter.sessionattribute.os = [];
   tFilter.sessionattribute.os.push(os); 
   break;
     case "locations" :
       tFilter.sessionattribute.location = "" +this.filters[i].id;
   break;
     case "device(s)" :
   tFilter.sessionattribute.device = "" + this.filters[i].id;
       break;
 case "stores" :
   let storeData = new StoreFilter();
       storeData.storeId = this.filters[i].id;
       tFilter.storefilter = storeData;
       //filterCriteria.push(new ViewFilter('Store', this.filters[i].value , null));
       break;
     case "page" :
       tFilter.sessionattribute.page = this.filters[i].value;
       break;
      case "client ip" :
       tFilter.sessionattribute.clientip = this.filters[i].value;
       break; 
     case "transaction" :
      tFilter.transactionattribute.transactionName = "" + this.filters[i].value; 
      break;
     case "failedtransaction" : 
       tFilter.transactionattribute.failedTransaction= true;
    }
  }
  this.filters = [];
  /* if(devices.length > 0)
   {
      tFilter.device = "'" + device.join("','") + "'";
   } */

   if(containingPagesId.length > 0)
   {
     tFilter.sessionattribute.containingPage = containingPagesId.join(",");
   }

   if(notContainingPagesId.length > 0)
   {
     tFilter.sessionattribute.nonContainingPage = notContainingPagesId.join(",");
   }


   this.searchInput = "";
   
      //console.log("transactionFilter",tFilter);
      
      //this.router.navigate(['/home/netvision/transactions'],{ queryParams: { filterCriteria:  JSON.stringify(tFilter) }} );
      this.transactionFilter = {...tFilter};
	
  }
      startSearchTimer() {
    // if already running then stop. 
    this.stopSearchTimer();

    this.searchTimer = setTimeout(() => {
      this.searchFn.call(this.ctx, true);
    }, 1000);
  }

  stopSearchTimer() {
    if (this.searchTimer != -1) { 
      clearTimeout(this.searchTimer);
      this.searchTimer = -1;
    }
  }

  addItemInHistory(item: Suggestion) {
    let savedInHistory: any = localStorage.getItem(this.LOCALSTROAGE_KEY);

    if (savedInHistory == null)
      savedInHistory = [];
    else 
    {
      try {
        savedInHistory = JSON.parse(savedInHistory);
      } catch(e) {
        savedInHistory = [];
      }
    }


    // check if already exists. 
    let found = savedInHistory.some((oldItem: Suggestion) => {
      return oldItem.filterName == item.filterName && oldItem.value == item.value;
    });

    if (!found) {
      // If reached to max then remove last one.
      if (savedInHistory.length > this.MAX_ITEMS_IN_HISTORY) {
        savedInHistory.shift();
      }

      savedInHistory.push(item);

      localStorage.setItem(this.LOCALSTROAGE_KEY, JSON.stringify(savedInHistory));
    }
  }

  smartSearchItemAdded($event): boolean {
    let item: Suggestion = $event;

    if (item.filterName == 'Header') {
      // TODO: Need to remove if already added. 
      console.log('Invalid suggestion selected. Current smartSearchInput - ', this.smartSearchInput );
      return false;
    }

    // setup a timer to seach item.
    this.startSearchTimer();

    // add item in history. 
    this.addItemInHistory(item);

    return true;
  }

  smartSearchItemRemoved($event): boolean {
    let item: Suggestion = $event;

    this.startSearchTimer();

    return true;
  }

  handleKeyUpInSmartSearch($event) {
    this.stopSearchTimer();
    
    let curValue = $event.target.value;

    // Check if char Code is enter and value is empty then start search. 
    if (curValue.trim() === '' && $event.keyCode === 13) {
      console.log('Enter Key pressed and there is no pending seach keyword. ');
      // FIXME: It should keep track of previous search parameter and if there is no change from prev
      // - then don't send rest call. 
      this.searchFn.call(this.ctx, true);
    }
  }
}
  

  
	
	