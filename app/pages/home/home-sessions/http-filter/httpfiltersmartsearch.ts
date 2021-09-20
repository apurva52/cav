import { CustomAttributeFilter } from "../common/interfaces/customattributefilter";
import { CustomData } from "../common/interfaces/customdata";
import { Metadata } from "../common/interfaces/metadata";
import { nvEncoder } from "../common/interfaces/nvencode";
import { ParseHttpFilters } from "../common/interfaces/parsehttpfilters";
import { HttpFilter } from "../common/interfaces/httpfilters";
import { StoreAttribute } from "../common/interfaces/storeattribute";
import { Suggestion } from "../common/interfaces/suggestion";
import { ViewFilter } from "../common/interfaces/viewfilter";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

export class HttpFilterSmartSearch {

  static parsehttpfilter: ParseHttpFilters;
  suggestions = [];
  browsers = [];
  domains = [];
  resources = [];
  locations = [];
  os = [];
  stores = [];
  pages = [];
  events = [];
  filters = [];
  mobileCarrier = [];
  devices = [];
  method = [];
  failureCode =[];
  statuscode = [];
  customMetrics = [];
  history = false;
 recentSearches = [];
  domainlength : number;
  //timeFilter : any;
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
   
    this.mobileCarrier = Array.from(this.metadata.mobileCarrierMap.keys());
    for(let i = 0 ; i < this.mobileCarrier.length; i++)
    {
      this.mobileCarrier[i] += ":" + this.metadata.mobileCarrierMap.get(this.mobileCarrier[i]).name;
    } 
    this.domains = Array.from(this.metadata.domainNameMap.keys());
    for(let i = 0 ; i < this.domains.length; i++)
    {
      this.domains[i] += ":" + this.metadata.domainNameMap.get(this.domains[i]).name;
    }
    
    this.os = Array.from(this.metadata.osMap.keys());
    for(let i = 0 ; i < this.os.length; i++)
    {
      this.os[i] += ":" + this.metadata.osMap.get(this.os[i]).name + " " +(this.metadata.osMap.get(this.os[i]).version !== 'null' ? this.metadata.osMap.get(this.os[i]).version : "") ;
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
 
    this.method = ['GET','POST','HEAD','PUT','DELETE','CONNECT','OPTIONS','TRACE'];   
    this.failureCode = ['-101:XHR Timeout','-102:XHR Failure','-103:XHR Aborted','-104:NV Library Issue'];
    //this.statuscode  = ['1xx:1xx','2xx:2xx','3xx:3xx','4xx:4xx','5xx:5xx','404:404','200:200']; 
    this.statuscode  = ['2xx:2xx','4xx:4xx','5xx:5xx','404:404','200:200'];  
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
      // 3. Login Id (email)
      // if matches any of the three no need to process further for suggestion.
    // for sid
     /* if(this.searchInput.length > 14 && isNumber)
      {
        this.suggestions.push(new Suggestion('NVSessionID',this.searchInput,0,null));
        //return;
      }*/
      // for client ip
      // ipv6 support
      let ipPattern = new RegExp(/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/);
       let ipPattern2 = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
    //  if(ipPattern.test(this.searchInput) || ipPattern2.test(this.searchInput)) 
    //  {
     //   this.suggestions.push(new Suggestion('Client IP',this.searchInput,0,null));
        //return;
     // } 
  
      //let ipPattern1  =  new RegExp('^((https?|ftp)://)?([a-z]+[.])?[a-z0-9-]+([.][a-z]{1,4}){1,2}(/.*[?].*)?$', 'i'); 
      //let ipPattern1 = new RegExp('^((https?|ftp)://)?([a-z0-9-]+[.])?[a-z0-9-]+([.][a-z]{1,4}){1,2}(/.*[?].*)?$', 'i');
     //let ipPattern1 = new RegExp('/^(http[s]?:\/\/){0,1}(www\.){0,1}[a-zA-Z0-9\.\-]+\.[a-zA-Z]{2,5}[\.]{0,1}/'); 
       let ipPattern1 = new RegExp('/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/');
      if(ipPattern1.test(this.searchInput))
      {
        this.suggestions.push(new Suggestion('URL',this.searchInput,0,null));
        //return;
      }  
      // for login id
      let loginPattern = new RegExp(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
     // if(loginPattern.test(this.searchInput)) 
      //if(this.searchInput.length >= 4)
     // {
      //  this.suggestions.push(new Suggestion('Login ID',this.searchInput,0,null));
      // return;
     // } 
     
      // else 
      // look into following
      // 1. browsers
      // 2. os
      // 3. location
      // 4. store id
      
      if(isNumber)
      {
        //return;
      }
  
      if(this.searchInput.toLowerCase().indexOf('page') === 0 && this.ctx.className == "http-detail")
      {
        for(let i = 0; i < this.pages.length; i++)
        {
          this.suggestions.push(new Suggestion('Page(s)',this.pages[i].split(":")[1],0,this.pages[i].split(":")[0]));
        }
      }
      
      // all browsers
      if(this.searchInput.toLowerCase().indexOf('browser') === 0 && this.ctx.className == "http-detail")
      {
        for(let i = 0; i < this.browsers.length; i++)
        {
           this.suggestions.push(new Suggestion('Browsers',this.browsers[i].split(":")[1],1,this.browsers[i].split(":")[0]));
        }
        return;
      }
      
     
      // all os
      if(this.searchInput.toLowerCase().indexOf('os') === 0 && this.ctx.className == "http-detail")
      {
        for(let i = 0; i < this.os.length; i++)
        {
           this.suggestions.push(new Suggestion('OS',this.os[i].split(":")[1],1,this.os[i].split(":")[0]));
        }
        return;
      }
     // all os
      if(this.searchInput.toLowerCase().indexOf('mobilecarrier') === 0  && this.ctx.className == "http-detail")
      {
        for(let i = 0; i < this.mobileCarrier.length; i++)
        {
           this.suggestions.push(new Suggestion('MobileCarrier',this.mobileCarrier[i].split(":")[1],1,this.mobileCarrier[i].split(":")[0]));
        }
        return;
      }
      
      if(this.ctx.className == "http-detail"){
       for(let i = 0; i < this.mobileCarrier.length; i++)
       {
          if(this.mobileCarrier[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
          {
            this.suggestions.push(new Suggestion('MobileCarrier',this.mobileCarrier[i].split(":")[1],1,this.mobileCarrier[i].split(":")[0]));
          } 
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
        if(isNumber && (parseInt(this.searchInput) > 99)){
          for(let i = 0; i < this.stores.length; i++)
          {
            if((this.stores[i].toString()).indexOf(this.searchInput) === 0)
            {
              this.suggestions.push(new Suggestion('Stores',this.stores[i].split(":")[1] +
              "(" + this.stores[i].split(":")[0]+ ")",1,this.stores[i].split(":")[0]));
            }
          }
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
      }
  
      if(this.searchInput.toLowerCase().indexOf('method') === 0)
      {
        for(let i = 0; i < this.method.length; i++)
        {
          // this.suggestions.push(new Suggestion('Method',this.method[i].split(":")[1],1,this.method[i].split(":")[0]));
           this.suggestions.push(new Suggestion('Method',this.method[i],1,this.method[i]));
        }
        return;
      }
      
      
      for(let i = 0; i < this.method.length; i++)
      {
        if(this.method[i].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
        {
          this.suggestions.push(new Suggestion('Method',this.method[i],1,this.method[i]));
         // this.suggestions.push(new Suggestion('Method',this.method[i].split(":")[1],1,this.method[i].split(":")[0]));
        }
      }
     if(this.searchInput.toLowerCase().indexOf('domainname') === 0)
      { 
        for(let i = 0; i < 10; i++)
        {  
           this.suggestions.push(new Suggestion('DomainName',this.domains[i].split(":")[1],1,this.domains[i].split(":")[0]));
        }
        return;
      }
  
  
         if(this.domains.length <= 10)
          this.domainlength  = this.domains.length;
         else
          this.domainlength = 10;
          for(let i = 0; i < this.domainlength; i++)
      {
        if(this.domains[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
        {
          this.suggestions.push(new Suggestion('DomainName',this.domains[i].split(":")[1],1,this.domains[i].split(":")[0]));
        }
      }  
     if(this.searchInput.toLowerCase().indexOf('failurecode') === 0)
      {
        for(let i = 0; i < this.failureCode.length; i++)
        {
           this.suggestions.push(new Suggestion('FailureCode',this.failureCode[i].split(":")[1],1,this.failureCode[i].split(":")[0]));
        }
        return;
      }
      
      
      for(let i = 0; i < this.failureCode.length; i++)
      {
        if(this.failureCode[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
        {
          this.suggestions.push(new Suggestion('FailureCode',this.failureCode[i].split(":")[1],1,this.failureCode[i].split(":")[0]));
        }
      }
     if(this.searchInput.toLowerCase().indexOf('statuscode') === 0)
      {
        for(let i = 0; i < this.statuscode.length; i++)
        {
           this.suggestions.push(new Suggestion('StatusCode',this.statuscode[i].split(":")[1],1,this.statuscode[i].split(":")[0]));
        }
        return;
      }
      
      
      for(let i = 0; i < this.statuscode.length; i++)
      {
        if(this.statuscode[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0)
        {
          this.suggestions.push(new Suggestion('StatusCode',this.statuscode[i].split(":")[1],1,this.statuscode[i].split(":")[0]));
        }
      }
     
   
         // Domain
        //this.suggestions.push(new Suggestion('DomainName',this.searchInput,0,null));	  
        // correlationId
        if(this.ctx.className == "http-detail")
          this.suggestions.push(new Suggestion('CORRELATIONID',this.searchInput,0,null));
        //return;
        // Url
        this.suggestions.push(new Suggestion('URL',this.searchInput,0,null));
        //return; 
    }  

    addFilter(filter) {
        if (this.filters.length === 3) {
            // MsgService.warn("Maximum 3 filters allowed");
            // TODO: 
            this.suggestions = [];
            return;
          }
          for (let i = 0; i < this.filters.length; i++) {
            if (this.filters[i].type >= 4 && filter.type >= 4) {
              // TODO: 
              //MsgService.warn("only one custom filter allowed");
              this.suggestions = [];
              return;
            }
          }
          let found = false;
          for (let i = 0; i < this.filters.length; i++) {
          if(this.filters[i].filterName === filter.filterName &&
            filter.filterName.toLowerCase() !== "containing page(s)" &&
            filter.filterName.toLowerCase() !== "not containing page(s)" &&
            filter.filterName.toLowerCase() !== "events" &&
        filter.filterName.toLowerCase() !== "page(s)" &&
            filter.filterName.toLowerCase() !== "device(s)"
         ) 
         { 
           return;
         }
       }
     
       if(filter.filterName === 'MobileCarrier')
       {
        for(let i = 0; i < this.filters.length; i++)
       {
         if(this.filters[i].filterName === 'Browsers')
         {
           return;
         }
   
       }
      }
       if(filter.filerName === 'Browsers')
       {
         for(let i = 0; i < this.filters.length; i++)
       {
       if(this.filters[i].filterName === 'MobileCarrier') 
         {
           return;
         }
    
       }
      } 
       for(let i = 0; i < this.filters.length; i++)
       {
         if(this.filters[i].filterName === filter.filterName && this.filters[i].value === filter.value)
         {
           found = true;
         }  
       }
       if (!found) {
        this.filters.push(filter);
        let init = null;
        if (localStorage.getItem("suggestions") === null) {
          init = [];
        }
        else {
          init = JSON.parse(localStorage.getItem("suggestions"));
        }
        if (init.length === 5) {
          init.shift();
        }
        let historyFound = false;
        for (let i = 0; i < init.length; i++) {
          if (filter.filterName === init[i].filterName && filter.value === init[i].value) {
            historyFound = true;
          }
        }
        if (!historyFound) {
          init.push(filter);
        }
        localStorage.setItem("suggestions", JSON.stringify(init));
      }
      this.suggestions = [];
      //let element: any = this.el.nativeElement.querySelector('#searchBox');
      //element.value("");
      this.searchInput = "";
    }

    parseFilter() {
        
        this.filters = this.smartSearchInput;

        let storeData = new StoreAttribute();
        let timeFilter = ParseHttpFilters.httpFilters.timeFilter;
         //ParseSessionFilters.sessionFilters = new SessionFilter();
        ParseHttpFilters.httpFilters= new HttpFilter();
        ParseHttpFilters.httpFilters.timeFilter = timeFilter;
    
        let filterCriteria = [];
         // if session id is applied then ignore all other applied filters.
       for(let i = 0; i < this.filters.length; i++)
       { 
       if(this.filters[i].filterName.toLowerCase() === "nvsessionid")
       {
        ParseHttpFilters.httpFilters.nvSessionId = this.filters[i].value;
         filterCriteria.push(new ViewFilter("NVSessionId",this.filters[i].value,null));
         //HttpAggfiltercriteriaComponent.setFilterCriteria([]);
         //HttpAggfiltercriteriaComponent.setFilterCriteria(filterCriteria);
         //this.filters = [];
         //this.router.navigate(['/home/netvision/xhrAggRequest'],{ queryParams: { filterCriteria: JSON.stringify(ParseHttpFilters.httpFilters),filterCriteriaList:JSON.stringify(filterCriteria)}});
         return;
         //this.search.emit("");
         //return;
       }
     }
     let containingPagesId = [];
     let notContainingPagesId = [];
     let containingPages = [];
     let notContainingPages = [];
     let events = [];
     let eventIds = [];
     let devices = [];     
     let clientIp = [];
     let loginId  = [];
     let browserId = [];
     let locationId = [];
     let methodName = [];
     let domainId = [];
     let resourceId = [];
     let failureCode =[];
     let statusCode = []; 
     let sid = [];

     for(let i = 0; i < this.filters.length; i++)
     {
     
       
       switch(this.filters[i].filterName.toLowerCase())
       {
         case "browsers" :
           ParseHttpFilters.httpFilters.browsers = "'" + this.filters[i].id + "'"; 
           browserId.push(this.filters[i].id);
           filterCriteria.push(new ViewFilter('Browser', this.filters[i].value, null));
           break;
         case "mobilecarrier" :
           ParseHttpFilters.httpFilters.mobilecarrier = "'" + this.filters[i].id + "'";
           //browserId.push(this.filters[i].id);
           filterCriteria.push(new ViewFilter('MobileCarrier', this.filters[i].value, null));
           break;
         case "url" :
           ParseHttpFilters.httpFilters.url =  encodeURIComponent(this.filters[i].value.trim()) ;
           //browserId.push(this.filters[i].id);
           filterCriteria.push(new ViewFilter('URL', this.filters[i].value, null));
           break;
          case "correlationid" :
           ParseHttpFilters.httpFilters.correlationid = this.filters[i].value;
           filterCriteria.push(new ViewFilter('CORRELATIONID', this.filters[i].value, null));
           break; 
         case "locations" :
           ParseHttpFilters.httpFilters.locations = "'" + this.filters[i].id + "'";
           //locationId.push(this.filters[i].id);
           filterCriteria.push(new ViewFilter('Location', this.filters[i].value, null)); 
           break;
         case "os" : 
           ParseHttpFilters.httpFilters.platform = this.filters[i].value;
           filterCriteria.push(new ViewFilter('OS', this.filters[i].value, null));
           break;
         case "stores" : 
           ParseHttpFilters.httpFilters.stores = this.filters[i].id;
           filterCriteria.push(new ViewFilter('Store', this.filters[i].value , null));
           break;
         case "entry page" :
           ParseHttpFilters.httpFilters.entrypage = this.filters[i].id; 
           filterCriteria.push(new ViewFilter('Entry Page', this.filters[i].value, null));
           break;
         case "exit page" :   
           ParseHttpFilters.httpFilters.exitpage = this.filters[i].id;
           filterCriteria.push(new ViewFilter('Exit Page', this.filters[i].value, null));
           break;
         case "statuscode" :
           ParseHttpFilters.httpFilters.statuscode = "'" + this.filters[i].id + "'";
           statusCode.push(this.filters[i].id);
           filterCriteria.push(new ViewFilter('StatusCode', this.filters[i].value, null));
           break;
          case "failurecode" :
           ParseHttpFilters.httpFilters.failureCode = "'" +this.filters[i].id + "'";
           failureCode.push(this.filters[i].id);
           filterCriteria.push(new ViewFilter('FailureCode', this.filters[i].value, null));
           break;
           case "resourcename" :
           ParseHttpFilters.httpFilters.resourcename = "'" + this.filters[i].id + "'";
           resourceId.push(this.filters[i].id);
           filterCriteria.push(new ViewFilter('ResourceName', this.filters[i].value, null));
           break;
           case "domainname" :
            let val  = "";
            for(let j = 0; j < this.domainlength; j++)
            {
            if(this.domains[j].split(":")[1].toLowerCase() === this.filters[i].value.toLowerCase())
            {
            val  = this.domains[j].split(":")[0];
            break;
            }
           }
          if(val === ""){
            val = this.filters[i].value ;

          }
           
 
            ParseHttpFilters.httpFilters.domainname = "'" + val + "'";
           //domainId.push(this.filters[i].id);
           filterCriteria.push(new ViewFilter('DomainName', this.filters[i].value, null));
           break;
           case "method" :
           ParseHttpFilters.httpFilters.method = "'" + this.filters[i].id + "'";
           methodName.push(this.filters[i].id);
           filterCriteria.push(new ViewFilter('Method', this.filters[i].value, null));
           break;
         case "containing page(s)" :
           containingPagesId.push(this.filters[i].id); 
           containingPages.push(this.filters[i].value);
           break;
         case "not containing page(s)" :
           notContainingPagesId.push(this.filters[i].id); 
           notContainingPages.push(this.filters[i].value);
           break;
         case "login id" :
           ParseHttpFilters.httpFilters.loginid = nvEncoder.encode(this.filters[i].value);
          // if(this.filters[i].value.indexOf("@") > -1)
            //   HttpsmartsearchComponent.parsehttpfilter.httpFilters.encryptedloginId = nvEncoder.encode(encryptedloginid); 
            
           filterCriteria.push(new ViewFilter('Login ID', this.filters[i].value, null));
           break;
         case "client ip" :
           clientIp.push(this.filters[i].value);
           filterCriteria.push(new ViewFilter('Client IP', clientIp.join(","), null));
           break;
         case "events" :
           eventIds.push(this.filters[i].id);
           events.push(this.filters[i].value);
           break;
         case "device(s)" :
           devices.push(this.filters[i].id);
           break;
         case "page count" : 
          ParseHttpFilters.httpFilters.pagecount = "= " + this.filters[i].value;
           filterCriteria.push(new ViewFilter('Page Count', "= " + this.filters[i].value, null));
           break;
     case "page(s)" :
           ParseHttpFilters.httpFilters.pages = this.filters[i].id;
           filterCriteria.push(new ViewFilter('page(s)', this.filters[i].value , null));
           break;
        }
       } 
       if(events.length > 0)
       {
         ParseHttpFilters.httpFilters.sessionsWithSpecificEvents = eventIds.join(',');
         filterCriteria.push(new ViewFilter('Event(s)', events.join(","), null));
       }
       
       if(containingPagesId.length > 0)
       {
         ParseHttpFilters.httpFilters.containingPage = containingPagesId.join(",");
         filterCriteria.push(new ViewFilter('Containing Page(s)', containingPages.join(","), null));
       }
       
       if(notContainingPagesId.length > 0)
       {
         ParseHttpFilters.httpFilters.nonContainingPage = notContainingPagesId.join(",");
         filterCriteria.push(new ViewFilter('Not Containing Page(s)', notContainingPages.join(","), null));
       }
       
       if(devices.length > 0)
       {
        ParseHttpFilters.httpFilters.devices = "'" + devices.join("','") + "'";
         filterCriteria.push(new ViewFilter('Device(s)', devices.join(","), null));
       }
  
      if(browserId.length > 0)
       {
        ParseHttpFilters.httpFilters.browsers = "'" + browserId.join("','") + "'";
       }
      
      if(locationId.length > 0)
       {
        ParseHttpFilters.httpFilters.locations = "'" + locationId.join("','") + "'";
       }
   
      if(statusCode.length > 0)
       {
        ParseHttpFilters.httpFilters.statuscode = "'" + statusCode.join("','") + "'";
       }
 
      if(failureCode.length > 0)
       {
        ParseHttpFilters.httpFilters.failureCode = "'" + failureCode.join("','") + "'";
       }
  
      if(resourceId.length > 0)
       {
        ParseHttpFilters.httpFilters.resourcename = "'" + resourceId.join("','") + "'";
       }
 
       if(domainId.length > 0)
       {
        ParseHttpFilters.httpFilters.domainname = "'" + domainId.join("','") + "'";
       }
 
       if(clientIp.length > 0)
       {
        ParseHttpFilters.httpFilters.clientip = "'" + clientIp.join("','") + "'";
       }
      
      if(methodName.length > 0)
       {
        ParseHttpFilters.httpFilters.method = "'" + methodName.join("','") + "'";
       }
  
    // HttpAggfiltercriteriaComponent.setFilterCriteria([]);
     //HttpAggfiltercriteriaComponent.setFilterCriteria(filterCriteria);
     //this.filters = [];
     this.searchInput = "";
    
     //this.router.navigate(['/home/netvision/xhrAggRequest'],{ queryParams: { filterCriteria:  JSON.stringify(ParseHttpFilters.httpFilters),filterCriteriaList:JSON.stringify(filterCriteria) }, replaceUrl : true} );
     
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

 