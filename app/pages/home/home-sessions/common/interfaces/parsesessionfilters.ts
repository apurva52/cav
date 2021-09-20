import { Metadata } from './metadata';
import { SessionFilter } from './sessionfilter';
import { ViewFilter } from './viewfilter';
import { Util } from './../util/util'
import { CustomAttributeFilter } from './customattributefilter';
import { CustomData } from './customdata';
import { BPData } from './bpdata';
import { StoreAttribute } from './storeattribute';
//import { MsgService } from './../services/msg.service';
import { nvEncoder } from './nvencode';
//import { SessionfiltercriteriaComponent } from './../components/sessions/sessionfiltercriteria/sessionfiltercriteria.component';
export class ParseSessionFilters {

  static sessionFilters = new SessionFilter();
  filter: SessionFilter;
  filterCriteriaList = [];
  customFilter: CustomAttributeFilter;
  getSessionFilter(sessionFilter, metadata: Metadata) {

    this.filterCriteriaList = [];
    this.filter = new SessionFilter();
    this.filter.bpAttributeFilter = new BPData();
    this.filter.customAttributeFilter = {} as CustomAttributeFilter;
    this.filter.sequence = undefined;
    this.filter.scanoffset = 0;
    this.filter.dataFlag = false;
    this.filter.uUID = 0;
    this.filter.filtermode = null;
    console.log('sessionFilter ', sessionFilter);
    // parsing metadata filters
    // channel


    // TODO: session type filters

    // time filter
    this.setTimeFilter(sessionFilter, metadata);



    if (sessionFilter.channel !== null && sessionFilter.channel !== "" && sessionFilter.channel !== "null") {
      this.filter.channel = sessionFilter.channel;
      this.filterCriteriaList.push(new ViewFilter('Channel', metadata.channelMap.get(parseInt(sessionFilter.channel)).name, null));
    }
    if (sessionFilter.sequence) {
      this.setSequenceFilter(sessionFilter);
      this.filter.scanoffset = sessionFilter.scanoffset;
      this.filter.dataFlag = sessionFilter.dataFlag;
      this.filter.uUID = sessionFilter.uUID;
      this.filter.filtermode = sessionFilter.filtermode;
      this.filter.strictSequence = sessionFilter.strictSequence;
    }

    // session attribute filters
    this.setSessionAttributeFilter(sessionFilter, metadata);
    if (sessionFilter.customValue && sessionFilter.customValue.length > 0) {
      this.setCustomAttributeFilter(sessionFilter, metadata);
    }


    if (sessionFilter.bpName && sessionFilter.bpName !== "") {
      this.setBPAttributeFilter(sessionFilter, metadata);
    }

    if (sessionFilter.storeId !== null || sessionFilter.terminalId !== null || sessionFilter.associateId !== null || sessionFilter.transactionId !== null) {
      this.setStoreFilter(sessionFilter, metadata);
    }


    // set all the filters on the static session filter object.
    ParseSessionFilters.sessionFilters = this.filter;
    // return this.filter;
    // for Event Data filter ..

    if (sessionFilter.eventDataControl !== null && sessionFilter.eventDataControl !== "") {
      this.filter.eventData = sessionFilter.eventDataControl;
      this.filterCriteriaList.push(new ViewFilter('Event Data', sessionFilter.eventDataControl, null));
    }
  }

  setCustomAttributeFilter(customFil, metadata) {
    let filter = this.filter;
    let custfilter = new CustomAttributeFilter();
    custfilter.count = customFil.customValue.length;
    custfilter.operator = customFil._customCondition;
    let g = '';
    for (let i = 0; i < customFil.customValue.length; i++) {
      let cd = new CustomData();
      cd.opr = customFil.customValue[i].operator;
      //TODO: in case if value is encrypted then we have to encrypt the value.
      //check for encryptionFlag.
      let cm = metadata.getCustomMetric(customFil.customValue[i].clientid);
      if (cm.encryptFlag == true)
        cd.val = nvEncoder.encode(customFil.customValue[i].value);
      else
        cd.val = customFil.customValue[i].value;
      cd.filterName = customFil.customValue[i].name;
      cd.type = customFil.customValue[i].type;
      cd.clientdataid = customFil.customValue[i].clientid;
      cd.dvalue = customFil.customValue[i].value;
      custfilter.filters.push(cd);
    }
    this.customFilter = custfilter;
    filter.customAttributeFilter = this.customFilter;
    for (let k = 0; k < custfilter.filters.length; k++) {
      if (k > 0) {
        g += ' ' + custfilter.operator + ' ';
      }
      g += custfilter.filters[k].filterName + ' ' + custfilter.filters[k].opr + '' + custfilter.filters[k].dvalue;
    }
    this.filterCriteriaList.push(new ViewFilter('Custom', g, null));

  }

  setSequenceFilter(sessionFilter) {
    this.filter.sequence = sessionFilter.sequence;
    this.filterCriteriaList.push(new ViewFilter('Sequence', 'makeitlink', null));
  }


  setTimeFilter(sessionFilter, metadata) {
    let filter = this.filter;

    if (sessionFilter.NVSessionID !== null) {
      filter.nvSessionId = sessionFilter.NVSessionID;
    }
    if (!sessionFilter.NVSessionID) {
      if (sessionFilter.timeFilter !== undefined && !sessionFilter.timeFilter.last) {
        filter.lastTime = false;
        let d = new Date(sessionFilter.stime);
        let e = new Date(sessionFilter.etime);
        let date1 = window["toDateString"](d);
        let date2 = window["toDateString"](e);
        if (navigator.userAgent.indexOf("MSIE") > -1 || navigator.userAgent.indexOf("rv:11.0") > -1 || navigator.userAgent.indexOf("Edge") > -1) {
          let tmpDate = (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
          date1 = tmpDate;
          let tmpDate1 = (e.getMonth() + 1) + "/" + e.getDate() + "/" + e.getFullYear();
          date2 = tmpDate1;
        }
        filter.timeFilter.startTime = date1 + ' ' + d.toTimeString().split(" ")[0];
        filter.timeFilter.endTime = date2 + ' ' + e.toTimeString().split(" ")[0];
        this.filterCriteriaList.push(new ViewFilter('From', filter.timeFilter.startTime, null));
        this.filterCriteriaList.push(new ViewFilter('To', filter.timeFilter.endTime, null));
        //SessionfiltercriteriaComponent.setTimeHtml(window["toDateString"](d) + ' ' + d.toTimeString().split(" ")[0] + " - " + window["toDateString"](e) + ' ' + e.toTimeString().split(" ")[0]);
      }
      else if (sessionFilter.timeFilter !== undefined) {
        filter.lastTime = true;
        filter.timeFilter.last = sessionFilter.timeFilter.last;

        this.filterCriteriaList.push(new ViewFilter('Last', sessionFilter.timeFilter.last, null));
        //SessionfiltercriteriaComponent.setTimeHtml('Last ' + sessionFilter.timeFilter.last);
        // this.filterCriteriaList.push(new ViewFilter('Last', sessionFilter.timeFilter.last, null));
      }
    }
    else {
      this.filterCriteriaList.push(new ViewFilter('Session Id', sessionFilter.NVSessionID, null));
    }
  }

  setSessionAttributeFilter(sessionFilter, metadata) {
    let filter = this.filter;
    if (sessionFilter.entryPage !== null && sessionFilter.entryPage !== "" && sessionFilter.entryPage !== "null") {
      filter.entrypage = sessionFilter.entryPage;
      this.filterCriteriaList.push(new ViewFilter('Entry Page', metadata.pageNameMap.get(parseInt(sessionFilter.entryPage)).name, null));
    }

    if (sessionFilter.exitPage !== null && sessionFilter.exitPage !== "" && sessionFilter.exitPage !== "null") {
      filter.exitpage = sessionFilter.exitPage;
      this.filterCriteriaList.push(new ViewFilter('Exit Page', metadata.pageNameMap.get(parseInt(sessionFilter.exitPage)).name, null));
    }

    if (sessionFilter.loginId !== null && sessionFilter.loginId !== "" && sessionFilter.loginId !== "null") {
      filter.loginid = nvEncoder.encode(sessionFilter.loginId);
      if (sessionFilter.loginId.indexOf("@") > -1) {
        let encryptedloginid = sessionFilter.loginId.split("@")[0] + "*******";
        filter.encryptedloginId = nvEncoder.encode(encryptedloginid);
      }
      this.filterCriteriaList.push(new ViewFilter('Login Id', sessionFilter.loginId, null));
    }

    if (sessionFilter.browser !== null && sessionFilter.browser !== "" && sessionFilter.browser !== "null") {
      /* filter.browser = sessionFilter.browser;
      this.filterCriteriaList.push(new ViewFilter('Browser', metadata.browserMap.get(parseInt(sessionFilter.browser)).name, null)); */
      filter.browser = sessionFilter.browser;
      let browser = sessionFilter.browser + '';
      let id = browser.split(",");
      let browserId = "";
      for (let i = 0; i < id.length; i++) {
        if (browserId != "")
          browserId += ",";
        browserId += metadata.browserMap.get(parseInt(id[i])).name;
      }
      this.filterCriteriaList.push(new ViewFilter('Browser(s)', browserId, null));

    }

    if (sessionFilter.device !== null && sessionFilter.device.length > 0 && sessionFilter.device !== "null") {
      filter.device = "'" + sessionFilter.device.join("','") + "'";
      this.filterCriteriaList.push(new ViewFilter('Device', sessionFilter.device.join(','), null));
    }


    if (sessionFilter.location !== null && sessionFilter.location !== "null") {
      filter.location = sessionFilter.location;
      const id = sessionFilter.location;
      const location = metadata.locationMap.get(Number(id));
      const state = location.state ? location.state + ',' : '';
      this.filterCriteriaList.push(new ViewFilter('Location(s)', state + location.country, null));
    }
    if (sessionFilter.platform !== null && sessionFilter.platform !== "null") {
      /* filter.platform = sessionFilter.platform;
      if (sessionFilter.platformversion === null || sessionFilter.platformversion === "null" )
        this.filterCriteriaList.push(new ViewFilter('OS', sessionFilter.platform, null));
      else
       {
        filter.platformVersion = sessionFilter.platformversion;
        this.filterCriteriaList.push(new ViewFilter('OS', sessionFilter.platform + '(' + sessionFilter.platformversion + ')' ,null));
       } */
      filter.platform = sessionFilter.platform;
      if (sessionFilter.platformversion === null || sessionFilter.platformversion === "null") {
        console.log("wwewe", sessionFilter.platform);
        let osStr = "";
        if (typeof sessionFilter.platform != "string") {
          for (let i = 0; i < sessionFilter.platform.length; i++) {
            if (osStr != "")
              osStr += ",";
            osStr += sessionFilter.platform;
          }
        }
        else
          osStr = sessionFilter.platform;
        console.log("wwewe", osStr);
        this.filterCriteriaList.push(new ViewFilter('OS(s)', osStr, null));
      }
      else {
        console.log("dfdffdhikak")
        filter.platformVersion = sessionFilter.platformversion;
        this.filterCriteriaList.push(new ViewFilter('OS', sessionFilter.platform + '(' + sessionFilter.platformversion + ')', null));
      }

    }
    if (sessionFilter.screen !== null && sessionFilter.screen !== "null") {
      filter.screenresolution = sessionFilter.screen;
      this.filterCriteriaList.push(new ViewFilter('Screen Resolution', metadata.screenMap.get(parseInt(sessionFilter.screen)).dim, null));
    }

    if (sessionFilter._duration !== null && sessionFilter._duration === 'count' && sessionFilter._pageCountInfo !== null && sessionFilter._pageCountInfo !== "" && sessionFilter._pageCountInfo !== "null") {
      filter.pagecount = sessionFilter.pageCount;
      this.filterCriteriaList.push(new ViewFilter('Page Count', sessionFilter.pageCount, null));
    }

    if (sessionFilter.pageUrl !== null && sessionFilter.pageUrl !== "") {
      filter.pageUrl = sessionFilter.pageUrl;
      this.filterCriteriaList.push(new ViewFilter('Page Url', sessionFilter.pageUrl, null));
    }

    if (sessionFilter.referrerUrl !== null && sessionFilter.referrerUrl !== "" && sessionFilter.referrerUrl !== "null") {
      filter.referrerUrl = sessionFilter.referrerUrl;
      this.filterCriteriaList.push(new ViewFilter('Referrer Url', sessionFilter.referrerUrl, null));
    }

    if (sessionFilter.clientIp !== null && sessionFilter.clientIp !== "" && sessionFilter.clientIp !== "null") {
      filter.clientip = sessionFilter.clientIp;
      this.filterCriteriaList.push(new ViewFilter('Client IP', sessionFilter.clientIp, null));
    }

    if (sessionFilter._ototal !== null && sessionFilter._ototal !== "" && sessionFilter._ototal !== "null") {
      filter.ordertotal = sessionFilter.orderTotal;
      this.filterCriteriaList.push(new ViewFilter('Order Total', sessionFilter.orderTotal, null));
    }

    if (sessionFilter._ocount !== null && sessionFilter._ocount !== "" && sessionFilter._ocount !== "null") {
      filter.ordercount = sessionFilter.orderCount;
      this.filterCriteriaList.push(new ViewFilter('Order Count', sessionFilter.orderCount, null));
    }

    if (sessionFilter.svcUrl !== null && sessionFilter.svcUrl !== "" && sessionFilter.svcUrl !== "null") {
      filter.svcUrl = sessionFilter.svcUrl;
      this.filterCriteriaList.push(new ViewFilter('SVC Url', sessionFilter.svcUrl, null));
    }

    if (sessionFilter._completedomtime !== null && sessionFilter._completedomtime !== "" && sessionFilter._completedomtime !== "null") {
      filter.domCompleteTime = sessionFilter.domCompleteTime;
      this.filterCriteriaList.push(new ViewFilter('DOM CompleteTime', sessionFilter.domCompleteTime, null));
    }

    if (sessionFilter._loadTime !== null && sessionFilter._loadTime !== "" && sessionFilter._loadTime !== "null") {
      filter.pageLoadTime = sessionFilter.pageLoadTime;
      this.filterCriteriaList.push(new ViewFilter('Page Load Time', sessionFilter.pageLoadTime, null));
    }

    if (sessionFilter.connectionType !== null && sessionFilter.connectionType !== "null") {
      filter.conType = sessionFilter.connectionType;
      //this.filterCriteriaList.push(new ViewFilter('ConnectionType', sessionFilter.connectionType, null));
      this.filterCriteriaList.push(new ViewFilter('ConnectionType', metadata.connectionMap.get(parseInt(sessionFilter.connectionType)).name, null));
    }

    if (sessionFilter.containingPage !== null) {
      if (sessionFilter.containingPage.length > 0) {
        filter.containingPage = sessionFilter.containingPage.join(',');
        this.filterCriteriaList.push(new ViewFilter('Containing Page(s)', Util.getPageNames(sessionFilter.containingPage, metadata), null));
      }
    }

    if (sessionFilter.notContainingPage !== null) {
      if (sessionFilter.notContainingPage.length > 0) {
        filter.nonContainingPage = sessionFilter.notContainingPage.join(',');
        this.filterCriteriaList.push(new ViewFilter('Not Containing Page(s)', Util.getPageNames(sessionFilter.notContainingPage, metadata), null));
      }
    }
    if (sessionFilter.sessInfo !== null) {
      if (sessionFilter.sessInfo === 'strugglingsession') {
        filter.strugglingUserSessions = true;
        this.filterCriteriaList.push(new ViewFilter('StrugglingSessions', 'true', null));
      }
      // TODO
      //this.filterCriteriaList.push(new ViewFilter('Containing Page(s)',Util.getPageNames(sessionFilter.containingPage,metadata),null));
    }
    if (sessionFilter.replaysession && sessionFilter.replaysession !== false && sessionFilter.replaysession.length > 0) {
      filter.sessionsWithReplay = true;
      this.filterCriteriaList.push(new ViewFilter('SessionWithReplay', 'true', null));
    }
    if (sessionFilter.sessionWithNd && sessionFilter.sessionWithNd !== false && sessionFilter.sessionWithNd.length > 0) {
      filter.sessionWithND = true;
      this.filterCriteriaList.push(new ViewFilter('SessionWithND', 'true', null));
    }
    if (sessionFilter.selectedEvent !== null && sessionFilter.selectedEvent !== '' && sessionFilter.selectedEvent.length > 0) {
      filter.sessionsWithSpecificEvents = sessionFilter.selectedEvent.join(',');
      this.filterCriteriaList.push(new ViewFilter('Events ', Util.getEventNames(sessionFilter.selectedEvent, metadata), null));
    }
    if (sessionFilter.sessInfo === 'SessionwithEvents' && sessionFilter.selectedEvent === null) {
      filter.sessionsWithEvent = true;
      this.filterCriteriaList.push(new ViewFilter('Session With Events ', 'true', null));
    }
    if (sessionFilter.userSegment !== null && sessionFilter.userSegment !== '' && sessionFilter.userSegment.length > 0) {
      filter.userSegment = sessionFilter.userSegment.join(',');
      this.filterCriteriaList.push(new ViewFilter('User Segment ', Util.getUserSegmentNames(sessionFilter.userSegment, metadata), null));
    }
    if (sessionFilter._duration !== null && sessionFilter._duration === 'time') {
      let ss, mm, hh;
      if (sessionFilter.ss === null)
        ss = 0;
      else
        ss = sessionFilter.ss;
      if (sessionFilter.hh === null)
        hh = 0;
      else
        hh = sessionFilter.hh;
      if (sessionFilter.mm === null)
        mm = 0;
      else
        mm = sessionFilter.mm;
      let dur = hh + ':' + mm + ':' + ss;
      filter.duration = sessionFilter._sessoptr + Util.FormattedDurationToSec(dur);
      this.filterCriteriaList.push(new ViewFilter('Session Duration', sessionFilter._sessoptr + dur, null));
    }
    if (sessionFilter.botSessions && sessionFilter.botSessions !== false && sessionFilter.botSessions.length > 0) {
      filter.botSessions = true;
      this.filterCriteriaList.push(new ViewFilter('BotSessions', 'true', null));
    }
    if (sessionFilter.authFailed && sessionFilter.authFailed !== false && sessionFilter.authFailed.length > 0) {
      filter.authFailed = true;
      this.filterCriteriaList.push(new ViewFilter('Authentication Failed', 'true', null));
    }
    if (sessionFilter.notAuth && sessionFilter.notAuth !== false && sessionFilter.notAuth.length > 0) {
      filter.notAuth = true;
      this.filterCriteriaList.push(new ViewFilter('Not Authenticated', 'true', null));
    }
    if (sessionFilter.crashSessions) {
      filter.crashSessions = true;
      this.filterCriteriaList.push(new ViewFilter('Session(s) With App Crash', 'true', null));
    }


  }



  setBPAttributeFilter(sessionFilter, metadata) {

    let bpdata = new BPData();
    if (sessionFilter.bpName !== null) {
      bpdata.bpName = sessionFilter.bpName;
      this.filterCriteriaList.push(new ViewFilter('BP Name', sessionFilter.bpName, null));
    }
    // only one of two, completeBp and abondnedBp can be selected.
    /*if (sessionFilter.completeBp !== false)
     {
      if(sessionFilter.completeBp.length > 0){ 
       bpdata.completedBP = true;
       this.filterCriteriaList.push(new ViewFilter('Completed BP', "true" , null));
      }
     }
     if (sessionFilter.abondnedBp !== false)
     {
       if(sessionFilter.abondnedBp.length > 0){
        bpdata.abandonedBP = true;
        this.filterCriteriaList.push(new ViewFilter('Abandoned BP', "true" , null));
       }
     }*/
    // this is the case when no completed or abondened bp is selected and only bp name is selected 
    // in such case _bptype will be ""
    if (sessionFilter._bptype == true || sessionFilter._bptype == "true" || (sessionFilter._bptype == "" && sessionFilter.bpName !== null)) {
      // abondnedBp is selected
      bpdata.abandonedBP = true;
      this.filterCriteriaList.push(new ViewFilter('Abandoned BP', "true", null));
    }
    else {
      bpdata.completedBP = true;
      this.filterCriteriaList.push(new ViewFilter('Completed BP', "true", null));
    }
    if (sessionFilter.bpExitPage !== null) {
      if (sessionFilter.bpExitPage.length > 0) {
        bpdata.bpExitPage = sessionFilter.bpExitPage.join(',');
        // this.filterCriteriaList.push(new ViewFilter('BP Exit Page',Util.getPageNames(sessionFilter.bpExitPage, metadata) , null));
      }
      else
        bpdata.bpExitPage = null;
    }
    if (sessionFilter.sessionExitPage !== null) {
      if (sessionFilter.sessionExitPage.length > 0) {
        bpdata.sessionExitPage = sessionFilter.sessionExitPage.join(',');
        //this.filterCriteriaList.push(new ViewFilter('Session Exit Page', Util.getPageNames(sessionFilter.sessionExitPage, metadata), null));
      }
      else
        bpdata.sessionExitPage = null;
    }
    if (sessionFilter.sessionExitPageEvent !== null) {
      if (sessionFilter.sessionExitPageEvent.length > 0) {
        bpdata.sessionExitPageEvent = sessionFilter.sessionExitPageEvent.join(',');
        //this.filterCriteriaList.push(new ViewFilter('Session Exit Page Events', Util.getEventNames(sessionFilter.sessionExitPageEvent, metadata), null));
      }
      else
        bpdata.sessionExitPageEvent = null;
    }
    if (sessionFilter.bpExitPageEvents !== null) {
      if (sessionFilter.bpExitPageEvents.length > 0) {
        bpdata.bpExitPageEvent = sessionFilter.bpExitPageEvents.join(',');
        //this.filterCriteriaList.push(new ViewFilter('BP Exit Page Events', Util.getEventNames(sessionFilter.bpExitPageEvents, metadata), null));
      }
      else
        bpdata.bpExitPageEvent = null;
    }
    if (sessionFilter.transit !== null) {
      if (sessionFilter.transit.length > 0) {
        bpdata.transitPageEvent = sessionFilter.transit.join(',');
        //this.filterCriteriaList.push(new ViewFilter('Transit  Events', Util.getEventNames(sessionFilter.transit, metadata), null));
      }
      else
        bpdata.transitPageEvent = null;
    }
    this.filter.bpAttributeFilter = bpdata;
    console.log(" this.filter.bpAttributeFilter", this.filter.bpAttributeFilter);
  }

  setStoreFilter(sessionFilter, metadata) {
    let storeData = new StoreAttribute()
    if (sessionFilter.storeId !== null && sessionFilter.storeId !== -1 && sessionFilter.storeId !== '' && sessionFilter.storeId !== "null") {
      storeData.storeId = sessionFilter.storeId;
      this.filterCriteriaList.push(new ViewFilter('Store ID', sessionFilter.storeId, null));
    }
    if (sessionFilter.associateId !== null && sessionFilter.associateId !== -1 && sessionFilter.associateId !== '' && sessionFilter.associateId !== "null") {
      storeData.associateId = sessionFilter.associateId;
      this.filterCriteriaList.push(new ViewFilter('Associate ID', sessionFilter.associateId, null));

    }
    if (sessionFilter.terminalId !== null && sessionFilter.terminalId !== -1 && sessionFilter.terminalId !== '' && sessionFilter.terminalId !== "null") {
      storeData.terminalId = sessionFilter.terminalId;
      this.filterCriteriaList.push(new ViewFilter('Terminal ID', sessionFilter.terminalId, null));

    }
    if (sessionFilter.transactionId !== null && sessionFilter.transactionId !== -1 && sessionFilter.transactionId !== '') {
      storeData.transactionId = sessionFilter.transactionId;
      this.filterCriteriaList.push(new ViewFilter('Transaction ID', sessionFilter.transactionId, null));

    }
    this.filter.storeFilter = storeData;
  }


  constructor() {
    this.filter = new SessionFilter();
    this.customFilter = new CustomAttributeFilter();
    this.filterCriteriaList = [];
  }
}
