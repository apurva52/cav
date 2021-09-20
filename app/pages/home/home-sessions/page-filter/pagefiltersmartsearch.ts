import { CustomAttributeFilter } from "../common/interfaces/customattributefilter";
import { CustomData } from "../common/interfaces/customdata";
import { Metadata } from "../common/interfaces/metadata";
import { nvEncoder } from "../common/interfaces/nvencode";
import { ParsePageFilter } from './sidebar/page-filter-sidebar/service/ParsePageFilter';
import { PageFilters } from "../common/interfaces/pagefilter";
import { StoreAttribute } from "../common/interfaces/storeattribute";
import { Suggestion } from "../common/interfaces/suggestion";
import { ViewFilter } from "../common/interfaces/viewfilter";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import {FilterWithVersion} from '../common/interfaces/pagefilter';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


export class PageFilterSmartSearch {
    suggestions = [];
    browsers = [];
    locations = [];
    os = [];
    stores = [];
    pages = [];
    events = [];
    filters = [];
    devices = [];
   // customMetrics = [];
    history = false;
    recentSearches = [];
    searchInput: any;
    //TODO: handling of search categories.
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
    
        this.os = Array.from(this.metadata.osMap.keys());
        for(let i = 0 ; i < this.os.length; i++)
        {
          this.os[i] += ":" + this.metadata.osMap.get(this.os[i]).name;
        }

        
    let tmpOs = [];
    // remove duplicate os entries due to versions of the os
    for (let i = 0; i < this.os.length; i++) {

      let found = false;
      for (let j = 0; j < tmpOs.length; j++) {
        if (tmpOs[j].indexOf(this.os[i].split(":")[1]) > -1) {
          found = true;
          break;
        }
      }
      if (!found)
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
    
        this.events = Array.from(this.metadata.eventMap.keys());
        for(let i = 0; i < this.events.length; i++)
        {
          this.events[i] += ":" + this.metadata.eventMap.get(this.events[i]).name;
        }
        this.devices = ['PC','Tablet','Mobile'];

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
        // first check for following
        // 1. SID (492906711946887169) i.e. 18 digits
        // 2. Client IP (10.10.60.84) i.e. IP pattern
        // 3. url & referrer url
        // if matches any of the three no need to process further for suggestion.
    
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
        if(ipPattern.test(this.searchInput) || ipPattern2.test(this.searchInput))
        {
          this.suggestions.push(new Suggestion('Client IP',this.searchInput,0,null));
          //return;
        }
    
           this.suggestions.push(new Suggestion('URL',this.searchInput,0,null));
           this.suggestions.push(new Suggestion('Referrer URL',this.searchInput,0,null));
      
        // else
        // look into following
        // 1. browsers
        // 2. os
        // 3. location
        // 4. store id
    
        let storeApplied  = false;
        if(this.searchInput != "")  {
         //for terminal if store filter is added already.
         let found = false;
         for(let i = 0; i < this.filters.length; i++)
         {
           if(this.filters[i].filterName === "Stores")
           {
               storeApplied = true;
         let f;
               let service: string = `/netvision/reports/nvAjaxController.jsp?strOperName=getTerminal&storeId=` + this.filters[i].id;
               this.http.get(service,{responseType:'text'}).pipe(map((response: any) => response)).subscribe((response:any) => {
                  //this.http.get(service, { responseType: 'text' }).pipe(map((response: any) =>{
        let a: any = response ;
                    let tmp = [];
                    if(a.trim() != "")
                    {
                    f = a.trim().split(',');
                    for ( let i = 0; i < f.length ; i++)
                    {
                       this.suggestions.push(new Suggestion('Terminal ID',f[i],0,null));
                    }}
               });
               

               if(f == undefined && f == null)
                    this.suggestions.push(new Suggestion('Terminal ID',this.searchInput,0,null));
           }
         }
        }
    
        if(isNumber){
         for(let i = 0; i < this.stores.length; i++)
         {
           if((this.stores[i].toString()).indexOf(this.searchInput) === 0)
           {
             this.suggestions.push(new Suggestion('Stores',this.stores[i].split(":")[1] +"(" + this.stores[i].split(":")[0]+ ")",1,this.stores[i].split(":")[0]));
           }
         }
         // Stores
         if(isNumber)
          this.suggestions.push(new Suggestion('Stores',this.searchInput,0,this.searchInput));
        }
        if(this.searchInput.toLowerCase().indexOf('store') === 0)
        {
          for(let i = 0; i < this.stores.length; i++)
          {
            this.suggestions.push(new Suggestion('Stores',this.stores[i].split(":")[1] +
            "(" + this.stores[i].split(":")[0]+ ")",1,this.stores[i].split(":")[0]));
          }
          return;
        }
    
        if(isNumber)
        { 
          this.suggestions.push(new Suggestion('TransactionID',this.searchInput,0,null));
        }
    
        if(isNumber)
        {
          return;
        }
    
    
      if(this.searchInput.toLowerCase().indexOf('page') === 0)
      { 
      for(let i = 0; i < this.pages.length; i++)
        {
            this.suggestions.push(new Suggestion('Page(s)',this.pages[i].split(":")[1],0,this.pages[i].split(":")[0]));
        }
      }
    
    
       // all browsers
        if(this.searchInput.toLowerCase().indexOf('browser') === 0)
        {
          for(let i = 0; i < this.browsers.length; i++)
          {
             this.suggestions.push(new Suggestion('Browsers',this.browsers[i].split(":")[1],1,this.browsers[i].split(":")[0]));
          }
          return;
        }
    
       // all os
        if(this.searchInput.toLowerCase().indexOf('os') === 0)
        {
          for(let i = 0; i < this.os.length; i++)
          {
             this.suggestions.push(new Suggestion('OS',this.os[i].split(":")[1],1,this.os[i].split(":")[0]));
          }
          return;
        }
    
        // all events
        if(this.searchInput.toLowerCase().indexOf('event') === 0)
        {
          for(let i = 0; i < this.events.length; i++)
          {
             this.suggestions.push(new Suggestion('Events',this.events[i].split(":")[1],1,this.events[i].split(":")[0]));
          }
          return;
        }
    
        // all devices
        if(this.searchInput.toLowerCase().indexOf('device') === 0)
        {
          for(let i = 0; i < this.devices.length; i++)
          {
               this.suggestions.push(new Suggestion('Device(s)',this.devices[i],1,this.devices[i]));
          }
        }
    
        for(let i = 0; i < this.browsers.length; i++)
        {
          if(this.browsers[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
          {
            this.suggestions.push(new Suggestion('Browsers',this.browsers[i].split(":")[1],1,this.browsers[i].split(":")[0]));
          }
        }
    
        for(let i = 0; i < this.os.length; i++)
        {
          if(this.os[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
          {
            this.suggestions.push(new Suggestion('OS',this.os[i].split(":")[1],1,this.os[i].split(":")[0]));
          }
        }
    
        for(let i = 0; i < this.locations.length; i++)
        {
          if(this.locations[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
          {
            this.suggestions.push(new Suggestion('Locations',this.locations[i].split(":")[1],1,this.locations[i].split(":")[0]));
          }
        }
         for(let i = 0; i < this.events.length; i++)
          {
             if(this.events[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
             {
               this.suggestions.push(new Suggestion('Events',this.events[i].split(":")[1],1,this.events[i].split(":")[0]));
             }
          }
    
          for(let i = 0; i < this.devices.length; i++)
          {
             if(this.devices[i].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
             {
               this.suggestions.push(new Suggestion('Device(s)',this.devices[i],1,this.devices[i]));
             }
          }
    
        
        for(let i = 0; i < this.pages.length; i++)
        {
          if(this.pages[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
          {
            this.suggestions.push(new Suggestion('Page(s)',this.pages[i].split(":")[1],0,this.pages[i].split(":")[0]));
          }
        }
        
         if(isNumber)
        this.suggestions.push(new Suggestion('TransactionId',this.searchInput,0,this.searchInput));
      }    

      addFilter(filter) {
        if (this.filters.length === 3) {
          // MsgService.warn("Maximum 3 filters allowed");
          // TODO: 
          this.suggestions = [];
          return;
        }
        let found = false;
    for(let i = 0; i < this.filters.length; i++)
    {
      if(this.filters[i].filterName === filter.filterName &&
         filter.filterName.toLowerCase() !== "page(s)"&&
         filter.filterName.toLowerCase() !== "events" &&
         filter.filterName.toLowerCase() !== "device(s)" &&
         filter.filterName.toLowerCase() !== "os" &&
         filter.filterName.toLowerCase() !== "locations" &&
         filter.filterName.toLowerCase() !== "browsers"
      )
      {
 return;
      }
    }

    for(let i = 0; i < this.filters.length; i++)
    {
      if(this.filters[i].filterName === filter.filterName && this.filters[i].value === filter.value)
      {
        found = true;
      }
    }
    if(!found)
    {
      this.filters.push(filter);
      let init = null;
      if(localStorage.getItem("pagesuggestions") === null)
      {
        init = [];
      }
  else
      {
        init = JSON.parse(localStorage.getItem("pagesuggestions"));
      }
      if(init.length === 5)
      {
        init.shift();
      }
      let historyFound = false;
      for(let i = 0; i < init.length; i++)
      {
        if(filter.filterName === init[i].filterName && filter.value === init[i].value )
        {
          historyFound = true;
        }
      }
      if(!historyFound)
      {
        init.push(filter);
      }
      localStorage.setItem("pagesuggestions",JSON.stringify(init));
    }
    this.suggestions = [];
    //let element: any = this.el.nativeElement.querySelector('#searchBox');
    //element.value("");
    this.searchInput = "";
  }

  parseFilter() {
    this.filters = this.smartSearchInput;

    let storeData = new StoreAttribute();
    let timeFilter = ParsePageFilter.pageFilters.timeFilter;

    ParsePageFilter.pageFilters = new PageFilters();
    ParsePageFilter.pageFilters.timeFilter = timeFilter;

    this.filterCriteria = [];
     // if session id is applied then ignore all other applied filters.
     for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i].filterName.toLowerCase() === "nvsessionid") {
        ParsePageFilter.pageFilters.sid = this.filters[i].value;
        this.filterCriteria.push(new ViewFilter("NVSessionId", this.filters[i].value, null));
        // console.log("check filterciteria",this.filterCriteria);
        // show filter cirteria. 
        // SessionfiltercriteriaComponent.setFilterCriteria([]);
        // SessionfiltercriteriaComponent.setFilterCriteria(this.filterCriteria);
        //this.filters = [];

        return;
        //this.search.emit("");
        //return;
      }
      
    }
    let devices = [];
    let events = [];
    let eventIds = [];
    let cpages = [];
    let oss = [];
    let browsers = [];
    let locations = [];
    for(let i = 0; i < this.filters.length; i++)
    {

    switch(this.filters[i].filterName.toLowerCase())
      {
        case "browsers" :
 	        browsers.push(this.filters[i].id);
          break;
        case "locations" :
       	  locations.push(this.filters[i].id);
          break;
        case "os" :
       	  oss.push(this.filters[i].value);
          break;
        case "stores" :
          ParsePageFilter.pageFilters.stores = this.filters[i].id;
          for(let j = 0; j < this.filters.length; j++)
          {
             if(this.filters[j].filterName.toLowerCase() == "terminal id")
             {
              ParsePageFilter.pageFilters.terminals = this.filters[j].value;
             }
          }
          break;
        case "client ip" :
          ParsePageFilter.pageFilters.clientIp = this.filters[i].value;
          break;
        case "events" :
          eventIds.push(this.filters[i].id);
          events.push(this.filters[i].value);
          break;
        case "device(s)" :
          devices.push(this.filters[i].id);
          break;
        case "url" : 
         ParsePageFilter.pageFilters.pageUrl = encodeURIComponent(this.filters[i].value);
          break;
        case "transactionid":
          ParsePageFilter.pageFilters.transactionid = this.filters[i].value;
          break;
        case "referrer url" :  
        ParsePageFilter.pageFilters.referrerUrl = this.filters[i].value;
          break;
        case "host" :
          ParsePageFilter.pageFilters.host = this.filters[i].value;
          break;
        case "page(s)" : 
          cpages.push(this.filters[i].id);
          break;
       }  
    }
      //this.filters = [];
      if(events.length > 0)
      {
        ParsePageFilter.pageFilters.events = eventIds.join(',');
      }
      
      if(devices.length > 0)
      {
        ParsePageFilter.pageFilters.devices = "'" + devices.join("','") + "'";
      }  

      if(cpages.length > 0)
      {
        ParsePageFilter.pageFilters.pages = cpages.join(",");
      }
   
      if(browsers.length > 0)
      {
        ParsePageFilter.pageFilters.browsers = browsers.join(",");
      }

      if(locations.length > 0)
      {
        ParsePageFilter.pageFilters.locations = locations.join(" , ");
      }

      if(oss.length > 0 )
      {
	//console.log("OS " + oss);
  ParsePageFilter.pageFilters.os = [];
        for(let o = 0; o < oss.length; o++)
        {
           let os = new FilterWithVersion();
           os.name = oss[o];
           os.version = null;
           ParsePageFilter.pageFilters.os.push(os);
        }
      }

      this.searchInput = "";
      //console.log("this.filters " , this.filters);
      //console.log("pageFilter",pageFilter);
     // this.router.navigate(['/home/netvision/pages'],{ queryParams: { filterCriteria:  JSON.stringify(pageFilter) },replaceUrl : true} );
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


