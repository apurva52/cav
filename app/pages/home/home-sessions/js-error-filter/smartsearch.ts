import { CustomAttributeFilter } from "../common/interfaces/customattributefilter";
import { CustomData } from "../common/interfaces/customdata";
//import { Metadata } from "../common/interfaces/metadata";
import { nvEncoder } from "../common/interfaces/nvencode";
import { Metadata } from "../common/interfaces/metadata";
import { ParsePagePerformanceFilters } from "../common/interfaces/parsepageperformancefilter";
import { PagePerformanceFilter } from "../common/interfaces/pageperformancefilter";
import { StoreAttribute } from "../common/interfaces/storeattribute";
import { Suggestion } from "../common/interfaces/suggestion";
import { ViewFilter } from "../common/interfaces/viewfilter";
export class SmartSearch {
  suggestions = [];
  locations = [];
  browsers = [];
  os = [];
  stores = [];
  filters = [];
  devices = [];
  pages = [];
  history = false;
  recentSearches = [];
  searchInput: any;
  //TODO: handling of search categories.
  selectedKeyword: any;
  metadata: Metadata;
  filterCriteria: any;
  smartSearchInput: any;
  parsepagefilter: ParsePagePerformanceFilters;
  private searchTimer: any = -1;
  private searchFn: Function = null;
  private ctx: any;

  private MAX_ITEMS_IN_HISTORY = 5;

  private LOCALSTROAGE_KEY = "_sessionSuggestions";

  constructor() {
    this.selectedKeyword = 'Auto';
  }

  init(metadata: Metadata, searchFn: Function, ctx: any) {
    this.metadata = metadata;
    this.searchFn = searchFn;
    this.ctx = ctx;

    this.browsers = Array.from(this.metadata.browserMap.keys());
    for (let i = 0; i < this.browsers.length; i++) {
      this.browsers[i] += ":" + this.metadata.browserMap.get(this.browsers[i]).name;
    }

    this.os = Array.from(this.metadata.osMap.keys());
    for (let i = 0; i < this.os.length; i++) {
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
    for (let i = 0; i < this.locations.length; i++) {
      let location = this.locations[i] + ":";
      if (this.metadata.locationMap.get(this.locations[i]).state !== undefined
        && this.metadata.locationMap.get(this.locations[i]).state !== "") {
        location += this.metadata.locationMap.get(this.locations[i]).state + ",";
      }
      location += this.metadata.locationMap.get(this.locations[i]).country;
      this.locations[i] = location;
    }

    this.stores = Array.from(this.metadata.storeMap.keys());
    for (let i = 0; i < this.stores.length; i++) {
      let store = this.stores[i] + ":";
      store += this.metadata.storeMap.get(this.stores[i]).name + ",";
      store += this.metadata.storeMap.get(this.stores[i]).city;
      this.stores[i] = store;
    }

    this.pages = Array.from(this.metadata.pageNameMap.keys());
    for (let i = 0; i < this.pages.length; i++) {
      this.pages[i] += ":" + this.metadata.pageNameMap.get(this.pages[i]).name;
    }
    this.devices = ['PC', 'Tablet', 'Mobile'];
  }


    findSuggestions($event) {
      this.searchInput = $event.query.trim();
     console.log("--this.selectedKeyword", this.selectedKeyword);

     if (this.metadata === null) {
        return;
      }

     this.suggestions = [];
     this.recentSearches = [];// check in local storage for previous search
     // max size 5 currently.

     // if blank then do nothing
     if (this.searchInput === "") {
        return;
      }
      //created localStorage and itterating data if not eqls to null
      if (localStorage.getItem(this.LOCALSTROAGE_KEY) !== null) {
        let history = JSON.parse(localStorage.getItem(this.LOCALSTROAGE_KEY));
        if (history !== null && history.length > 0) {
          for (let i = (history.length - 1); i >= 0; i--) {
            this.recentSearches.push(history[i]);
          }
        }
      }
  
      let isNumber = !isNaN(this.searchInput);//checking input not-is not a number input=14; true and input='hello'; false

      let storeApplied = false;

      // for terminal if store filter is added already.
      if (this.searchInput != "" && (this.selectedKeyword == "Stores" || this.selectedKeyword == "Auto")) {
        let found = false;
        for (let i = 0; i < this.filters.length; i++) {
          if (this.filters[i].filterName === "Stores") {
            storeApplied = true;
            /*
            let service: string = `/netvision/reports/nvAjaxController.jsp?strOperName=getTerminal&storeId=` + this.filters[i].id;
            this.http.get(service, { responseType: 'text' }).map((response: any) => response)
              .subscribe((response: any) => {
                let a: any = response;
                let tmp = [];
                if (a.trim() != "") {
                  let f = a.trim().split(',');
                  for (let i = 0; i < f.length; i++) {
                    this.suggestions.push(new Suggestion('Terminal ID', f[i], 0, null));
                  }
                }
  
              });
            if (this.suggestions.length == 0)
              this.suggestions.push(new Suggestion('Terminal ID', this.searchInput, 0, null));
            */
          }
        }
      }

       // for sid
      if (this.searchInput.length > 14 && isNumber) {
        this.suggestions.push(new Suggestion('SessionId', this.searchInput, 0, null));
        //return;
      }

      if (isNumber) { //isNumber is true here if it is number or false in case of string
        //return;
      }

      // for transaction id
      if (isNumber && (this.selectedKeyword == "Transaction ID" || this.selectedKeyword == "Auto")) {
        this.suggestions.push(new Suggestion('TransactionID', this.searchInput, 0, null));
      }
      //for File Name
      let ipPattern = new RegExp(/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/);
    let ipPattern2 = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
    if (ipPattern.test(this.searchInput) || ipPattern2.test(this.searchInput)) {
      this.suggestions.push(new Suggestion('File Name', this.searchInput, 0, null));
      return;
    }

      //for error message
      let loginPattern = new RegExp(/^[a-zA-Z0-9.!#$%&�*+/=?^_`{|}~-]+:[a-zA-Z0-9-]*$/);
     // if(loginPattern.test(this.searchInput))
     if (this.searchInput.length >= 4) {
       this.suggestions.push(new Suggestion('error message', this.searchInput, 0, null));
        return;
     }

      //for count
       if (isNumber && (this.selectedKeyword == "Count" || this.selectedKeyword == "Auto")) {
        this.suggestions.push(new Suggestion('Count', this.searchInput, 0, null));
      }
      //for Line
        if (isNumber && (this.selectedKeyword == "Line" || this.selectedKeyword == "Auto")) {
        this.suggestions.push(new Suggestion('Line', this.searchInput, 0, null));
      }

      //column
      if (isNumber && (this.selectedKeyword == "Column" || this.selectedKeyword == "Auto")) {
        this.suggestions.push(new Suggestion('Columns', this.searchInput, 0, null));
      }
       // all browsers
      if (this.searchInput.toLowerCase().indexOf('browser') === 0 && (this.selectedKeyword == "Browsers" || this.selectedKeyword == "Auto")) {
        for (let i = 0; i < this.browsers.length; i++) {
          this.suggestions.push(new Suggestion('Browsers', this.browsers[i].split(":")[1], 1, this.browsers[i].split(":")[0]));
        }
        return;
      }

      // all pages
      if ((this.searchInput.trim().toLowerCase() === 'pages' || this.searchInput.trim().toLowerCase() === 'pages') && (this.selectedKeyword == "Pages" || this.selectedKeyword == "Auto")) {
        for (let i = 0; i < this.browsers.length; i++) { 
        this.suggestions.push(new Suggestion('Page ', this.pages[i].split(":")[1], 0, this.pages[i].split(":")[0]));
       }
        return;
      }

      // all os
      if (this.searchInput.toLowerCase().indexOf('os') === 0 && (this.selectedKeyword == "OS" || this.selectedKeyword == "Auto")) {
        for (let i = 0; i < this.os.length; i++) {
          this.suggestions.push(new Suggestion('OS', this.os[i].split(":")[1], 1, this.os[i].split(":")[0]));
        }
        return;
      }

      // all devices
      if (this.searchInput.toLowerCase().indexOf('device') === 0 && (this.selectedKeyword == "Devices" || this.selectedKeyword == "Auto")) {
        for (let i = 0; i < this.devices.length; i++) {
          this.suggestions.push(new Suggestion('Device(s)', this.devices[i], 1, this.devices[i]));
        }
      }

      if (this.selectedKeyword == "Browsers" || this.selectedKeyword == "Auto") {
        for (let i = 0; i < this.browsers.length; i++) {
          if (this.browsers[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0) {
            this.suggestions.push(new Suggestion('Browsers', this.browsers[i].split(":")[1], 1, this.browsers[i].split(":")[0]));
          }
        }
      }
  
      if (this.selectedKeyword == "OS" || this.selectedKeyword == "Auto") {
        for (let i = 0; i < this.os.length; i++) {
          if (this.os[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0) {
            this.suggestions.push(new Suggestion('OS', this.os[i].split(":")[1], 1, this.os[i].split(":")[0]));
          }
        }
      }

      if (this.selectedKeyword == "Locations" || this.selectedKeyword == "Auto") {
        for (let i = 0; i < this.locations.length; i++) {
          if (this.locations[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0) {
            this.suggestions.push(new Suggestion('Locations', this.locations[i].split(":")[1], 1, this.locations[i].split(":")[0]));
          }
        }
      }

      if (this.selectedKeyword == "Pages" || this.selectedKeyword == "Auto") {
        for (let i = 0; i < this.pages.length; i++) {
          if (this.pages[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0) {
            this.suggestions.push(new Suggestion('Page', this.pages[i].split(":")[1], 0, this.pages[i].split(":")[0]));
            
          }
        }
      }

      if (this.selectedKeyword == "Devices" || this.selectedKeyword == "Auto") {
        for (let i = 0; i < this.devices.length; i++) {
          if (this.devices[i].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0) {
            this.suggestions.push(new Suggestion('Device(s)', this.devices[i], 1, this.devices[i]));
          }
        }
      }

      if (this.selectedKeyword == "Stores" || this.selectedKeyword == "Auto") {
        if (storeApplied != true) {
          for (let i = 0; i < this.stores.length; i++) {
            if ((this.stores[i].toString()).indexOf(this.searchInput) === 0) {
              this.suggestions.push(new Suggestion('Stores', this.stores[i].split(":")[1] +
                "(" + this.stores[i].split(":")[0] + ")", 1, this.stores[i].split(":")[0]));
            }
          }
        }
      }

      if (this.selectedKeyword == "Stores" || this.selectedKeyword == "Auto") {
        if (isNumber)
          this.suggestions.push(new Suggestion('Stores', this.searchInput, 0, this.searchInput));
      }

       // combined both recent search and suggestions.
      if (this.recentSearches && this.recentSearches.length) {
        // add a placeholder for Recently Searched.
        this.suggestions.push(new Suggestion('Header', 'Recently Searched', 0, 'Recently Searched'));
  
        //concat recently searches.
        this.suggestions = this.suggestions.concat(this.recentSearches);
      }
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
          if (this.filters[i].filterName === filter.filterName &&
            filter.filterName.toLowerCase() !== "device(s)" &&
            filter.filterName.toLowerCase() !== "os" &&
            filter.filterName.toLowerCase() !== "locations" &&
            filter.filterName.toLowerCase() !== "browsers"
          ) {
            return;
          }
        }
    
        for (let i = 0; i < this.filters.length; i++) {
          if (this.filters[i].filterName === filter.filterName && this.filters[i].value === filter.value) {
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
        let timeFilter = this.parsepagefilter.pagePerformanceFilters.timeFilter;

        this.parsepagefilter.pagePerformanceFilters = new PagePerformanceFilter();
        this.parsepagefilter.pagePerformanceFilters.timeFilter = timeFilter;

        this.filterCriteria = [];
           // if session id is applied then ignore all other applied filters.
        for (let i = 0; i < this.filters.length; i++) {
        if (this.filters[i].filterName.toLowerCase() === "sessionid") {
            this.parsepagefilter.pagePerformanceFilters.sid = this.filters[i].value;
          this.filterCriteria.push(new ViewFilter("sessionid", this.filters[i].value, null));
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
       let oss = [];
       let browsers = [];
       let browsersValue = [];
       let locations = [];
       let locationsValue = [];
       console.log('this.filters : ',this.filters);
       for (let i = 0; i < this.filters.length; i++) {
        console.log('switch case called', this.filters[i].filterName.toLowerCase());
        switch (this.filters[i].filterName.toLowerCase()) {
          
         case "browsers":
            //ParseSessionFilters.sessionFilters.browser = this.filters[i].id;
            browsers.push(this.filters[i].id);
            browsersValue.push(this.filters[i].value);
            //this.filterCriteria.push(new ViewFilter('Browser', this.filters[i].value, null));
          break;
         case "locations":
           locations.push(this.filters[i].id);
           locationsValue.push(this.filters[i].value);
           //ParseSessionFilters.sessionFilters.location = this.filters[i].id;
           //this.filterCriteria.push(new ViewFilter('Location', this.filters[i].value, null));
          break;
          case "os":
            oss.push(this.filters[i].value);
            //ParseSessionFilters.sessionFilters.platform = this.filters[i].value;
            //this.filterCriteria.push(new ViewFilter('OS', this.filters[i].value, null));
            break;
          case "stores":
            //let storeData = new StoreAttribute()
            storeData.storeId = this.filters[i].id;
            for (let j = 0; j < this.filters.length; j++) {
              if (this.filters[j].filterName.toLowerCase() == "terminal id") {
                storeData.terminalId = this.filters[j].value;
                this.filterCriteria.push(new ViewFilter('Terminal ID', this.filters[j].value, null));
              }
            }
           // this.parsepagefilter.pagePerformanceFilters.storeFilter = storeData;
            this.filterCriteria.push(new ViewFilter('Store', this.filters[i].value, null));
            break;
          case "transactionid":
                storeData.transactionId = this.filters[i].value;
               // this.parsepagefilter.pagePerformanceFilters.storeFilter = storeData;
                this.filterCriteria.push(new ViewFilter('TransactionId', this.filters[i].value, null));
            break;
          case "page":
                this.parsepagefilter.pagePerformanceFilters.pages = this.filters[i].id;
                this.filterCriteria.push(new ViewFilter('Page', this.filters[i].value, null));
                break;
          case "filename":
                 this.parsepagefilter.pagePerformanceFilters.filename = this.filters[i].id;
                 this.filterCriteria.push(new ViewFilter('File Name', this.filters[i].value, null));
                 break;
          case "errorMessage":
                 this.parsepagefilter.pagePerformanceFilters.errorMessage = this.filters[i].id;
                 this.filterCriteria.push(new ViewFilter('Error Message', this.filters[i].value, null));
                break;
          case "device(s)":
                 devices.push(this.filters[i].id);
                 break;

            }
         }
          if (browsers.length > 0) {
            this.parsepagefilter.pagePerformanceFilters.browsers = browsers.join(" , ");
            this.filterCriteria.push(new ViewFilter('Browser', browsersValue.join(" , "), null));
          }
      
          if (locations.length > 0) {
            this.parsepagefilter.pagePerformanceFilters.locations = locations.join(" , ");
            this.filterCriteria.push(new ViewFilter('Location', locationsValue.join(" , "), null));
          }
      
          if (oss.length > 0) {
            this.parsepagefilter.pagePerformanceFilters.platform = oss.join(" , ");
            this.filterCriteria.push(new ViewFilter('OS', oss.join(" , "), null));
          }
          if (devices.length > 0) {
            this.parsepagefilter.pagePerformanceFilters.devices = "'" + devices.join("','") + "'";
            this.filterCriteria.push(new ViewFilter('Device(s)', devices.join(","), null));
          }
          // TODO: Show filter criteria in component.
          console.log('this.parsepagefilter : ',this.parsepagefilter);
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

  
        