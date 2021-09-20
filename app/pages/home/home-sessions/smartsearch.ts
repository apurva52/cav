import { CustomAttributeFilter } from "./common/interfaces/customattributefilter";
import { CustomData } from "./common/interfaces/customdata";
import { Metadata } from "./common/interfaces/metadata";
import { nvEncoder } from "./common/interfaces/nvencode";
import { ParseSessionFilters } from "./common/interfaces/parsesessionfilters";
import { SessionFilter } from "./common/interfaces/sessionfilter";
import { StoreAttribute } from "./common/interfaces/storeattribute";
import { Suggestion } from "./common/interfaces/suggestion";
import { ViewFilter } from "./common/interfaces/viewfilter";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
export class SmartSearch {
  suggestions = [];
  browsers = [];
  locations = [];
  os = [];
  stores = [];
  pages = [];
  events = [];
  filters = [];
  devices = [];
  customMetrics = [];
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

    this.events = Array.from(this.metadata.eventMap.keys());
    for (let i = 0; i < this.events.length; i++) {
      this.events[i] += ":" + this.metadata.eventMap.get(this.events[i]).name;
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
    // for page count

    let storeApplied = false;

    // for terminal if store filter is added already.
    if (this.searchInput != "" && (this.selectedKeyword == "Stores" || this.selectedKeyword == "Auto")) {
      let found = false;
      for (let i = 0; i < this.filters.length; i++) {
        if (this.filters[i].filterName === "Stores") {
          storeApplied = true;
          
          let service: string = `/netvision/reports/nvAjaxController.jsp?strOperName=getTerminal&storeId=` + this.filters[i].id;
          this.http.get(service, { responseType: 'text' }).subscribe((response: any) => {
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
          
        }
      }
    }


    if (this.searchInput.indexOf('page') > -1 && this.searchInput.indexOf('count') > -1) {
      if (!isNaN(parseInt(this.searchInput.split('page').join('').split('count').join('').trim()))) {
        this.suggestions.push(new Suggestion('Page Count', parseInt(this.searchInput.split('page').join('').split('count').join('').trim()), 0, null));
      }
      //return;
    }

    // for sid
    if (this.searchInput.length > 14 && isNumber) {
      this.suggestions.push(new Suggestion('NVSessionID', this.searchInput, 0, null));
      //return;
    }

    // for client ip
    // ipv6 support
    let ipPattern = new RegExp(/^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/);
    let ipPattern2 = new RegExp(/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/);
    if (ipPattern.test(this.searchInput) || ipPattern2.test(this.searchInput)) {
      this.suggestions.push(new Suggestion('Client IP', this.searchInput, 0, null));
      //return;
    }

    // for login id
    let loginPattern = new RegExp(/^[a-zA-Z0-9.!#$%&�*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/);
    // if(loginPattern.test(this.searchInput))
    if (this.searchInput.length >= 4) {
      this.suggestions.push(new Suggestion('Login ID', this.searchInput, 0, null));
      // return;
    }

    // else
    // look into following
    // 1. browsers
    // 2. os
    // 3. location
    // 4. store id

    if (isNumber) {
      //return;
    }
    // for transaction id
    if (isNumber && (this.selectedKeyword == "Transaction ID" || this.selectedKeyword == "Auto")) {
      this.suggestions.push(new Suggestion('TransactionID', this.searchInput, 0, null));
    }


    // all browsers
    if (this.searchInput.toLowerCase().indexOf('browser') === 0 && (this.selectedKeyword == "Browsers" || this.selectedKeyword == "Auto")) {
      for (let i = 0; i < this.browsers.length; i++) {
        this.suggestions.push(new Suggestion('Browsers', this.browsers[i].split(":")[1], 1, this.browsers[i].split(":")[0]));
      }
      return;
    }

    // all pages
    if ((this.searchInput.trim().toLowerCase() === 'page' || this.searchInput.trim().toLowerCase() === 'pages') && (this.selectedKeyword == "Pages" || this.selectedKeyword == "Auto")) {
      for (let i = 0; i < this.pages.length; i++) {
        this.suggestions.push(new Suggestion('Entry Page', this.pages[i].split(":")[1], 0, this.pages[i].split(":")[0]));
        this.suggestions.push(new Suggestion('Exit Page', this.pages[i].split(":")[1], 0, this.pages[i].split(":")[0]));
        this.suggestions.push(new Suggestion('Containing Page(s)', this.pages[i].split(":")[1], 1, this.pages[i].split(":")[0]));
        this.suggestions.push(new Suggestion('Not Containing Page(s)', this.pages[i].split(":")[1], 1, this.pages[i].split(":")[0]));
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

    // all events
    if (this.searchInput.toLowerCase().indexOf('event') === 0 && (this.selectedKeyword == "Events" || this.selectedKeyword == "Auto")) {
      for (let i = 0; i < this.events.length; i++) {
        this.suggestions.push(new Suggestion('Events', this.events[i].split(":")[1], 1, this.events[i].split(":")[0]));
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
          this.suggestions.push(new Suggestion('Entry Page', this.pages[i].split(":")[1], 0, this.pages[i].split(":")[0]));
          this.suggestions.push(new Suggestion('Exit Page', this.pages[i].split(":")[1], 0, this.pages[i].split(":")[0]));
          this.suggestions.push(new Suggestion('Containing Page(s)', this.pages[i].split(":")[1], 1, this.pages[i].split(":")[0]));
          this.suggestions.push(new Suggestion('Not Containing Page(s)', this.pages[i].split(":")[1], 1, this.pages[i].split(":")[0]));
        }
      }
    }

    if (this.selectedKeyword == "Events" || this.selectedKeyword == "Auto") {
      for (let i = 0; i < this.events.length; i++) {
        if (this.events[i].split(":")[1].toLowerCase().indexOf(this.searchInput.toLowerCase()) === 0) {
          this.suggestions.push(new Suggestion('Events', this.events[i].split(":")[1], 1, this.events[i].split(":")[0]));
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

    if (this.selectedKeyword == "Custom Metrics" || this.selectedKeyword == "Auto") {
      // for custom metrics text type
      this.customMetrics = Array.from(this.metadata.customMetricMap.keys());
      for (let i = 0; i < this.customMetrics.length; i++) {
        let cm = this.metadata.customMetricMap.get(this.customMetrics[i]);
        if (cm.valueType === 0/* || cm.valueType === 3*/) {
          this.suggestions.push(new Suggestion(cm.name, this.searchInput, (cm.valueType + 4), cm.id));
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
        filter.filterName.toLowerCase() !== "containing page(s)" &&
        filter.filterName.toLowerCase() !== "not containing page(s)" &&
        filter.filterName.toLowerCase() !== "events" &&
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

  parseFilter(activeSession: boolean) {
    this.filters = this.smartSearchInput;

    let storeData = new StoreAttribute();
    let timeFilter = ParseSessionFilters.sessionFilters.timeFilter;

    ParseSessionFilters.sessionFilters = new SessionFilter();
    ParseSessionFilters.sessionFilters.timeFilter = timeFilter;

    this.filterCriteria = [];
    // if session id is applied then ignore all other applied filters.
    for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i].filterName.toLowerCase() === "nvsessionid") {
        ParseSessionFilters.sessionFilters.nvSessionId = this.filters[i].value;
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

    let containingPagesId = [];
    let notContainingPagesId = [];
    let containingPages = [];
    let notContainingPages = [];
    let events = [];
    let eventIds = [];
    let devices = [];
    let oss = [];
    let browsers = [];
    let browsersValue = [];
    let locations = [];
    let locationsValue = [];
    for (let i = 0; i < this.filters.length; i++) {
      if (this.filters[i].type >= 4)  // case of custom metrics
      {
        let custfilter = new CustomAttributeFilter();
        custfilter.count = 1;
        custfilter.operator = "And";
        let cd = new CustomData();
        cd.opr = '=';
        //check for encryptionFlag.
        let cm = this.metadata.getCustomMetric(this.filters[i].id);
        if (cm.encryptFlag == true)
          cd.val = nvEncoder.encode(this.filters[i].value);
        else
          cd.val = this.filters[i].value;
        cd.filterName = this.filters[i].filterName;
        cd.type = this.filters[i].customType;
        cd.clientdataid = this.filters[i].id;
        cd.dvalue = this.filters[i].value;
        custfilter.filters.push(cd);
        ParseSessionFilters.sessionFilters.customAttributeFilter = custfilter;
        this.filterCriteria.push(new ViewFilter(this.filters[i].filterName, this.filters[i].value, null));
        continue;
      }

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
          ParseSessionFilters.sessionFilters.storeFilter = storeData;
          this.filterCriteria.push(new ViewFilter('Store', this.filters[i].value, null));
          break;

        case "transactionid":
          storeData.transactionId = this.filters[i].value;
          ParseSessionFilters.sessionFilters.storeFilter = storeData;
          this.filterCriteria.push(new ViewFilter('TransactionId', this.filters[i].value, null));
          break;

        case "entry page":
          ParseSessionFilters.sessionFilters.entrypage = this.filters[i].id;
          this.filterCriteria.push(new ViewFilter('Entry Page', this.filters[i].value, null));
          break;
        case "exit page":
          ParseSessionFilters.sessionFilters.exitpage = this.filters[i].id;
          this.filterCriteria.push(new ViewFilter('Exit Page', this.filters[i].value, null));
          break;
        case "containing page(s)":
          containingPagesId.push(this.filters[i].id);
          containingPages.push(this.filters[i].value);
          break;
        case "not containing page(s)":
          notContainingPagesId.push(this.filters[i].id);
          notContainingPages.push(this.filters[i].value);
          break;
        case "login id":
          ParseSessionFilters.sessionFilters.loginid = nvEncoder.encode(this.filters[i].value);
          if (this.filters[i].value.indexOf("@") > -1) {
            let encryptedloginid = this.filters[i].value.split("@")[0] + "*******";
            if (activeSession === false)
              ParseSessionFilters.sessionFilters.encryptedloginId = nvEncoder.encode(encryptedloginid);
            else
              ParseSessionFilters.sessionFilters.loginid = nvEncoder.encode(encryptedloginid);
          }
          this.filterCriteria.push(new ViewFilter('Login ID', this.filters[i].value, null));
          break;
        case "client ip":
          ParseSessionFilters.sessionFilters.clientip = this.filters[i].value;
          this.filterCriteria.push(new ViewFilter('Client IP', this.filters[i].value, null));
          break;
        case "events":
          eventIds.push(this.filters[i].id);
          events.push(this.filters[i].value);
          break;
        case "device(s)":
          devices.push(this.filters[i].id);
          break;
        case "page count":
          ParseSessionFilters.sessionFilters.pagecount = "= " + this.filters[i].value;
          this.filterCriteria.push(new ViewFilter('Page Count', "= " + this.filters[i].value, null));
          break;
      }
    }
    if (browsers.length > 0) {
      ParseSessionFilters.sessionFilters.browser = browsers.join(" , ");
      this.filterCriteria.push(new ViewFilter('Browser', browsersValue.join(" , "), null));
    }

    if (locations.length > 0) {
      ParseSessionFilters.sessionFilters.location = locations.join(" , ");
      this.filterCriteria.push(new ViewFilter('Location', locationsValue.join(" , "), null));
    }

    if (oss.length > 0) {
      ParseSessionFilters.sessionFilters.platform = oss.join(" , ");
      this.filterCriteria.push(new ViewFilter('OS', oss.join(" , "), null));
    }

    if (events.length > 0) {
      ParseSessionFilters.sessionFilters.sessionsWithSpecificEvents = eventIds.join(',');
      this.filterCriteria.push(new ViewFilter('Event(s)', events.join(","), null));
      // console.log("filtercriteria",this.filterCriteria);
    }

    if (containingPagesId.length > 0) {
      ParseSessionFilters.sessionFilters.containingPage = containingPagesId.join(",");
      this.filterCriteria.push(new ViewFilter('Containing Page(s)', containingPages.join(","), null));
    }


    if (notContainingPagesId.length > 0) {
      ParseSessionFilters.sessionFilters.nonContainingPage = notContainingPagesId.join(",");
      this.filterCriteria.push(new ViewFilter('Not Containing Page(s)', notContainingPages.join(","), null));
    }

    if (devices.length > 0) {
      ParseSessionFilters.sessionFilters.device = "'" + devices.join("','") + "'";
      this.filterCriteria.push(new ViewFilter('Device(s)', devices.join(","), null));
    }
    // TODO: Show filter criteria in component.
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
