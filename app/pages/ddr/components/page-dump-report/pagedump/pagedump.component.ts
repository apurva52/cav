import { Component, Input, OnInit, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';
import { DdrDataModelService } from '../../../../../main/services/ddr-data-model.service';
import { Router } from '@angular/router';
import { DdrBreadcrumbService } from '../../../services/ddr-breadcrumb.service';
import { CommonServices } from '../../../services/common.services';
import { CavConfigService } from '../../../../../main/services/cav-config.service';
import { CavTopPanelNavigationService } from '../../../../../main/services/cav-top-panel-navigation.service';
import { TreeNode } from 'primeng/primeng';
import * as moment from 'moment';
import 'moment-timezone';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import { SelectItem } from '../../../interfaces/selectitem';
import * as  CONSTANTS from '../../../constants/breadcrumb.constants';
import { DDRRequestService } from '../../../services/ddr-request.service';
// import { NgForm } from '@angular/forms';


@Component({
    selector: 'app-pagedump',
    templateUrl: './pagedump.component.html',
    styleUrls: ['./pagedump.component.css']
})
export class PageDump implements OnInit {
    @Input() heightVal:any;
    selectedRow: any;
    header: string;
    filterData: string = "";
    @Output() getLowerFrameData: EventEmitter<Object>;
    originalValues = [];
    recordedFrame: SafeResourceUrl;
    flagOfDrillDown: string = "no";
    strTitle: string;
    downloadData = [];
    strEndDate: any;
    strStartDate: any;
    strEndTime: string;
    strStartTime: string;
    time: any;
    duration: any;
    value: string;
    calendar: boolean = false;
    PageArrDropDown = [];
    scriptArrDropDown = [];
    pageArr = [];
    scriptArr = [];
    scriptArrValue: string = "";
    pageArrValue: string = "";
    sessionFailed: any;
    timeDropDown = [];
    timeValue = "";
    totalCount: any;
    parameterName: any;
    failed: any;
    errorData = [];
    errorSessionData = [];
    failedPagesList: any;
    pageList: SelectItem[] = [];
    failedTypeList: SelectItem[] = [];
    sessionList: SelectItem[] = [];
    sessionFailedList: SelectItem[] = [];
    showFailedList = false;
    showSessionFailedList = false;
    failedType: any;
    sessionFailedType: any;
    pageListOption = -2;
    sessionListOption = -2;
    colsForLowerTable: { field: string; header: string; sortable: boolean; action: boolean; width: string; }[];
    lowerTable = [];
    colsForparameter = [];
    display: boolean = false;
    array1 = [];
    cols = [];
    treeData: TreeNode[] = [];
    showData: any[];
    urlparam: any;
    tableData = [];
    snapshotData: SafeResourceUrl;
    isND;
    loading: boolean;
    pageLimit = 50;
    pageOffset = 0;
    url: string;
    @ViewChild('accValue') accValue: ElementRef;
    @ViewChild("paginateRef") paginateRef :any;
    filterParameter: string;
    txtStartDateId: any;
    txtEndDateId: any;
    txtStartTimeHourId: string;
    txtStartTimeMinuteId: string;
    txtStartTimeSecId: string;
    txtEndTimeHourId: string;
    txtEndTimeMinuteId: string;
    txtEndTimeSecId: string;
    testRunDateTime: string;
    recfrm: boolean = false;
    flowPathInstance: string = "";
    flowPathInstanceNo: number  = -1; 
    pageNamefrm: string = "";
    cvMsg: string = "";
   pageTooltipPageListLabel ="";
    pageTooltipSessionLabel = "";
    pageTooltipScriptLabel = "";
    pageTooltipTimeLabel = "";
    pageTooltipPageArrLabel = "";
    cvFail: boolean = false;
    maxValue: string='202px';
    isFirstTime=true;
    filterCollapsed;

    // Enhancement for BUG 13505
    usersessionFilter = false; //flag used for filter popUp toggle.
    // @ViewChild('f') userSessionForm: NgForm;
    childIdxFilter = ""; // will keep the user value in input box.
    virtualUserid = ""; // will keep user idx value to pass value in input box.
    virtualSessionid = ""; // will keep session idx value to pass value in input box.
    param1 = ""; // param value passed in user.
    param2 = ""; // param value passed in useridx.
    param3 = ""; // param value passed in sessionidx.
    val1 = false; // value of virtual user checkbox.
    val2 = false; // value of session checkbox.
    userSessiontitle = "Virtual User, Session Filter ";

    //Enhancement for BUG-69387
    paramsFilter = "Parameter Filter";
    paramFilter = false; //flag used for paramfilter popUp toggle.
    value1: any;
    tempVal=""; //To hold param filter value

    constructor(private _router: Router, private breadcrumbService: DdrBreadcrumbService,
        private commonService: CommonServices, private _cavConfigService: CavConfigService, private _navService: CavTopPanelNavigationService, private ddrData: DdrDataModelService
        , private sanitizer: DomSanitizer, private ddrRequest:DDRRequestService) {
        this.getLowerFrameData = new EventEmitter<Object>();
        if(sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL')
        {
            this.ddrData.dcName = this.ddrData.getMasterDC();
        }
    }
    ngOnChanges(){
        // this.isFirstTime =true;
        if (this.calendar)
            this.maxValue = (this.heightVal - 115 - 24) + 'px';
        else
            this.maxValue = (this.heightVal - 115) + 'px';

        if (this.filterCollapsed) {
            this.setMaxValue(this.filterCollapsed);
        }
    }
    ngOnInit() {
        this.urlparam = this.ddrData.pagedump;
	this.commonService.isToLoadSideBar = false;
        if(this.urlparam){
            // console.log("going to set URL in session")
            this.urlparam['userName'] = (this.ddrData.userName || this.urlparam.userName);
            sessionStorage.removeItem("pageDumpUrl");
            sessionStorage.setItem("pageDumpUrl",JSON.stringify(this.urlparam));
        }
        else{
            // console.log("going to get URL in sessionStorage")
            this.urlparam = JSON.parse(sessionStorage.getItem("pageDumpUrl"));
            // this.ddrData.userName = 
        }
        this.flagOfDrillDown = this.urlparam.flagOfDrillDown;
        this.isFirstTime =true;
        if (this.flagOfDrillDown == 'no') {
            this.header = 'Page Dump Options';
            this.urlparam['strFailedPage'] = "";
            this.urlparam['strFailedSession'] = "";
            this.urlparam['strOtherFailedPage'] = "";
            this.urlparam['strOtherFailedSession'] = "";
            this.urlparam['strPageName'] = "";
            this.urlparam['strScriptName'] = "";
            this.urlparam['timeType'] = "";
            this.urlparam["childindex"] = "";
            this.urlparam["userindex"] = "";
            this.urlparam["sessioninstance"] = "";
            this.testRunDateTime = this.urlparam.startTime;
            this.duration = this.urlparam.duration;
            this.filterData = ' Response Page Snapshots';
            this.createDropdownList();
        }
        else {
            this.header = 'Page Snapshots';
            this.flowPathInstance = this.urlparam['flowPathInstance'];
             this.flowPathInstanceNo = Number(this.flowPathInstance);
            this.pageNamefrm = this.urlparam['pageName'];
            this.makefiltercriteria();
        }
        /* if (this.urlparam && this.urlparam.path) { 
            if(this.urlparam.path.endsWith("/"))
             this.urlparam.path = this.urlparam.path.substring(0, this.urlparam.path.length - 1);
            if(this.urlparam.path.startsWith("//"))
             this.urlparam.path = this.urlparam.path.substring(2, this.urlparam.path.length);
            if(this.urlparam.path.endsWith(":"))
             this.urlparam.path = this.urlparam.path.substring(0, this.urlparam.path.length - 1);
        } */
        if (this.urlparam && this.urlparam.product && this.urlparam.product.startsWith("/")) {
            this.urlparam.product = this.urlparam.product.substring(1, this.urlparam.product.length);
        }
        console.log('this.urlParam',this.urlparam);
	if(window.innerHeight > 630)
		this.maxValue='217px';
	else
        	this.maxValue='202px';
        this.urlparam['limit'] = this.pageLimit;
        this.urlparam['offset'] = this.pageOffset;
  
       if (this.commonService.enableQueryCaching == 1) {
              this.url = this.getHostUrl() + '/' + this.urlparam.product + '/v1/cavisson/netdiagnostics/ddr/pagedump?cacheId=' + this.urlparam.testRun;
        }
 
        else {
              this.url = this.getHostUrl() + '/' + this.urlparam.product + '/v1/cavisson/netdiagnostics/ddr/pagedump';   
        }

          this.makeAjaxCall(this.url, true);
    }

    makefiltercriteria() {
        this.filterData = "";

        if (this.urlparam.pageName.trim() != "NA")
            this.filterData = ", Page : " + this.urlparam.pageName;

        if (this.filterData.startsWith(","))
            this.filterData = this.filterData.substring(1);

    }
    /*Method is used get host url*/
    getHostUrl(): string {
        var hostDcName = this.ddrData.getHostUrl();
        // if (this._navService.getDCNameForScreen("flowpath") === undefined)
        //     hostDcName = this._cavConfigService.getINSPrefix();
        // else
        //     hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen("flowpath");

        // if (hostDcName.length > 0) {
        //     sessionStorage.removeItem("hostDcName");
        //     sessionStorage.setItem("hostDcName", hostDcName);
        // }
        // else
        //     hostDcName = sessionStorage.getItem("hostDcName");

        console.log('hostDcName =', hostDcName);
        return hostDcName;
    }

    createDropdownList() {
        this.pageList.push({ 'label': 'Show all pages', value: -2 });
        this.pageList.push({ 'label': 'Show only failed pages', value: -1 });
        this.pageList.push({ 'label': 'Show only success pages', value: 0 });
        this.pageList.push({ 'label': 'Show failure type pages', value: 3 });

        this.sessionList.push({ 'label': 'Show all sessions', value: -2 });
        this.sessionList.push({ 'label': 'Show only failed sessions', value: -1 });
        this.sessionList.push({ 'label': 'Show only success sessions', value: 0 });
        this.sessionList.push({ 'label': 'Show failure type sessions', value: 3 });

        this.scriptArrDropDown.push({ 'label': '-- Select Script Name --', value: "" });

        this.PageArrDropDown.push({ 'label': '-- Select Page Name --', value: "" });

        this.timeDropDown.push({ 'label': 'Total Time', value: "" });
        this.timeDropDown.push({ 'label': 'Specified Time (Absolute)', value: "Specified Time" });
        this.timeDropDown.push({ 'label': 'Specified Time (Relative)', value: "Relative Time" });


    }

    makeAjaxCall(url, showCount) {
        try {
            this.loading = true;
            this.urlparam['showCount'] = showCount;
            this.urlparam['paramFilter']=this.value1;
            return this.ddrRequest.getDataUsingPost(url, this.urlparam).subscribe(data => (this.pageDumpData(data)), error => {
                this.loading = false;
            });
        } catch (error) {
            this.loading = false;
            return;
        }
    }

    makeTableColumns() {
        this.cols = [];
        if (this.isND === false)
            this.cols.push({ field: 'startTime', header: 'Start Time', sortable: 'custom', action: true, width: '30' });
        else
            this.cols.push({ field: 'absoluteStartTime', header: 'Absolute Start Time', sortable: 'custom', action: true, width: '50' });
        this.cols.push(
            { field: 'pageName', header: 'Page Name', sortable: true, action: true, width: '40' },
            { field: 'pageStatus', header: 'Page Status', sortable: true, action: true, width: '40' },
            { field: 'pageResponseTime', header: 'Page Response Time', sortable: 'custom', action: true, width: '60' },
            { field: 'parameterSubstitution', header: 'Parameter Substitution', sortable: true, action: true, width: '330' },
            { field: 'req', header: 'Req', sortable: 'custom', action: true, width: '30' },
            { field: 'repBody', header: 'RepBody', sortable: 'custom', action: true, width: '40' },
            { field: 'rep', header: 'Rep', sortable: 'custom', action: true, width: '30' }
        );
    }

    pageDumpData(res) {

        if (this.param1)
            this.userSessiontitle = this.selectedUserSession().substring(1);
        else
            this.userSessiontitle = "Virtual User, Session Filter ";

        if (res.hasOwnProperty('totalCount')) {
            this.totalCount = res.totalCount;
            if (this.totalCount == '0') {
                setTimeout(() => {
                    this.loading = false;
                    this.treeData = [];
                    this.downloadData = [];
                    this.getLowerFrameData.emit({ 'snapshot': "", 'recordedFrame': "", 'recfrm': this.recfrm });
                }, 1000)

                return;
                //   alert('No Records Found');
            }
        }
        if (res.hasOwnProperty('finalData')) {
            this.treeData = res.finalData;
            this.downloadData = res.downloadJson;
        }

        this.errorData = res.errorData;
        this.errorSessionData = res.errorSessionData;
        this.isND = res.isNDMode;
        this.makeTableColumns();
        if (this.flagOfDrillDown == 'no') {
            this.scriptArr = res.scriptNames;
            this.pageArr = res.pageName;
            if(this.scriptArrValue !== "")
            this.showScript(this.scriptArrValue,1);
            else
            this.createScriptPageDropDown();
        }
        let snapShot = res.finalData[0].children[0].children[0].key[0];
        this.selectedRow = snapShot;
        this.viewSnapShot(snapShot);
        setTimeout(() => {
            this.loading = false;
        }, 1500);

    }

    createScriptPageDropDown() {
        this.scriptArrDropDown = [];
        this.PageArrDropDown = [];
        this.scriptArrDropDown.push({ 'label': '-- Select Script Name --', value: "" });
        this.PageArrDropDown.push({ 'label': '-- Select Page Name --', value: "" });

        for (let i = 0; i < this.scriptArr.length; i++)
            this.scriptArrDropDown.push({ 'label': this.scriptArr[i].sessionName, value: this.scriptArr[i].sessionName });

        for (let j = 0; j < this.pageArr.length; j++)
            this.PageArrDropDown.push({ 'label': this.pageArr[j].sessionName + ':' + this.pageArr[j].pageName, value: this.pageArr[j].pageName });
    }



    showScript(scriptValue,type) {
        for(let i =0;i<this.scriptArrDropDown.length;i++){
            if(this.scriptArrDropDown[i].value == scriptValue)
            this.pageTooltipScriptLabel = this.scriptArrDropDown[i].label;
        }
        this.PageArrDropDown = [];
        if(type == 0)
        this.pageArrValue = "";
        this.PageArrDropDown.push({ 'label': '-- Select Page Name --', value: "" });
        for (let i = 0; i < this.pageArr.length; i++) {
            if (scriptValue == "")
                this.PageArrDropDown.push({ 'label': this.pageArr[i].sessionName + ':' + this.pageArr[i].pageName, value: this.pageArr[i].pageName });
            else if (scriptValue == this.pageArr[i].sessionName)
                this.PageArrDropDown.push({ 'label': this.pageArr[i].sessionName + ':' + this.pageArr[i].pageName, value: this.pageArr[i].pageName });
    }
   
    }
    showPageArrValue(pageArrValue) {
        for(let i =0;i<this.PageArrDropDown.length;i++){
            if(this.PageArrDropDown[i].value == pageArrValue)
            this.pageTooltipPageArrLabel = this.PageArrDropDown[i].label;
        }
    }
    pageDumpSnapshotData(res) {
        let urlRec = "";
        let data = "";
        if (res.hasOwnProperty('urlRecFile'))
            urlRec = decodeURIComponent(res.urlRecFile);
        if (res.hasOwnProperty('urlFile'))
            data = decodeURIComponent(res.urlFile);

        let url = this.getHostUrl() + '/';

        if(sessionStorage.getItem("isMultiDCMode") == "true" && data.startsWith("..")){
            data = data.substring(3,data.length);
        }

        this.assignData(url + data, url + urlRec);
    }
    assignData(data: any, urlRec: any) {
        this.value = '27vh';
        this.snapshotData = this.sanitizer.bypassSecurityTrustResourceUrl(data);
        this.recordedFrame = this.sanitizer.bypassSecurityTrustResourceUrl(urlRec);

        this.getLowerFrameData.emit({ 'snapshot': this.snapshotData, 'recordedFrame': this.recordedFrame, 'recfrm': this.recfrm });
        // console.log('this.snapshotData ',this.recordedFrame)
    }

    openScriptPage(script,child) {
        let projectName = child[0].key[0].projectName + '/';
        let subProjectName = child[0].key[0].subProjectName + '/';

        let url = this.getHostUrl() + '/' + this.urlparam.product +
            '/recorder/recorder.jsp?openFrom=TR' + this.urlparam.testRun +
            '&scriptName=' + projectName + subProjectName + script + '&sesLoginName=' + this.ddrData.userName;
        window.open(url, "_self");
       // console.log("Open Script name ", script)
    }

    /**Formatter cell data for converting ms to sec field */
    msToTimeFormate(duration) {
        if (!isNaN(duration)) {
            var milliseconds, seconds, minutes, hours, temp, time;

            time = +duration;
            time = Math.round(time);
            milliseconds = time % 1000;
            time = (time - milliseconds) / 1000;
            hours = parseInt(Number(time / 3600) + '');
            time = time % 3600;
            minutes = parseInt(Number(time / 60) + '');
            time = time % 60;
            seconds = parseInt(Number(time) + '');
            return (this.appendStringToTime(hours, minutes, seconds, milliseconds));
        }
        else
            return duration;
    }

    appendStringToTime(hh, mm, ss, msec) {
        if (msec < 10)
            msec = "0" + msec;
        if (msec < 100)
            msec = "0" + msec;
        if (mm < 10)
            mm = "0" + mm;
        if (ss < 10)
            ss = "0" + ss;
        if (hh < 10)
            hh = "0" + hh; // Make hrs 2 digit string

        return (hh + ":" + mm + ":" + ss + "." + msec);
    }

    checkFilePath(req, pageStatus) {
        if (req == 'NA' || pageStatus == 'ConFail')
            return false;
        else
            return true;
    }

    getRespFileData(url):any{
        this.ddrRequest.getDataInStringUsingGet(url).subscribe(data => {
                console.log("data" ,data);
                 return  data;
        	});
	
	}
    openHTTPRequestFile(partition, fileName,title) {
	let url = this.getHostUrl() + '/' + this.urlparam.product + '/v1/cavisson/netdiagnostics/ddr/getFile?filePath=';
	let filePath = "logs/TR" + this.urlparam.testRun + "/" + partition + "/ns_logs/req_rep/" + fileName;
        let fileNameWithPath = url + filePath;
	var windowWidth = (window.screen.availWidth - 10), top = '';
        var windowHeight = window.screen.availHeight * 0.535;
	var sourceWindow = window.open(fileNameWithPath,"_blank","resizable=1,location=0,status=0,scrollbars=1,width =" + windowWidth + ",height =" + windowHeight + ",left=0,top=" + top + "");
	setTimeout(() => {
		sourceWindow.document.title=title;
		},2000);
     /*
	var source= "";
	this.http.get(fileNameWithPath).subscribe(data => {
                 source=  data["_body"];
        var windowWidth = (window.screen.availWidth - 10), top = '';
        var windowHeight = window.screen.availHeight * 0.535;
	setTimeout(() =>{
	let winTitle = title+"- "+filePath;
	var sourceWindow = window.open('',winTitle,"resizable=1,location=0,status=0,scrollbars=1,width =" + windowWidth + ",height =" + windowHeight + ",left=0,top=" + top + "");
         sourceWindow.document.title=title+"- "+filePath;
         sourceWindow.document.write(source);
   	 sourceWindow.document.close(); 
   	// if(window.focus) 
	  sourceWindow.focus();
	},100);
	});*/
//        window.open(fileNameWithPath, "", "resizable=1,location=0,status=0,scrollbars=1,width =" + windowWidth + ",height =" + windowHeight + ",left=0,top=" + top + "");
    }

    viewSnapShot(node) {
        let startTime = "";
        if (node.absoluteStartTime)
            startTime = node.absoluteStartTime;
        if (node.startTime)
            startTime = node.startTime;
        var selectedRowTmp = node.userID.trim() + "_" + node.sessionInstance.trim() + "_" + node.pageName.trim() + encodeURI(startTime);

        this.changePageDumpOrigFile(selectedRowTmp, node);
    }

    changePageDumpOrigFile(selectedRowTmp, node) {
        let queryParam = {};
        queryParam['flagOfDrillDown'] = this.flagOfDrillDown;
        queryParam['loginUser'] = (this.ddrData.userName || this.urlparam.userName);
        queryParam['testRun'] = this.urlparam.testRun;
        queryParam['strPartitionNumber'] = node.partitionNumber;
        queryParam['scriptName'] = node.scriptName;
        queryParam['flowName'] = node.flowNameWithoutExtn;
        queryParam['pageName'] = node.pageName;
        queryParam['pageDumpURL'] = node.pageDumpURL;
        queryParam['selectedRowTmp'] = selectedRowTmp;
        queryParam['recordedPageUrl'] = node.recordedPageUrl;
        queryParam['reqFile'] = node.req;
        queryParam['repFile'] = node.rep;
        queryParam['groupName'] = node.group;
        queryParam['traceLevel'] = node.traceLevel;
        queryParam['projectName'] = node.projectName;
        queryParam['subProjectName'] = node.subProjectName;
        queryParam['showRecFrm'] = this.recfrm;

        /*
        var queryParam1 = "strTestRun=" + this.urlparam.testRun + "&strPartitionNumber=" + node.partitionNumber + 
        "&strScriptName=" + node.scriptName + "&strFlowName=" + node.flowNameWithoutExtn +
         "&strPageName=" + node.pageName + "&strTestRunPageDumpFileName=" + node.pageDumpURL +
          "&strSelectedRow=" + selectedRowTmp + "&recordedFileName=" + node.recordedPageUrl +
           "&reqFileName=" + node.req + "&resFileName=" + node.rep +
        "&groupName=" + node.group + "&traceLevel=" + node.traceLevel + 
        "&projectName=" + node.projectName + "&subProjectName=" + node.subProjectName;
        */

        // window.open("getDataFromPageDump.jsp?" + queryParam, queryParam1, "changePageDumpOrigFile");
        let url  = '';
        if(this.commonService.enableQueryCaching == 1){
             url = this.getHostUrl() + '/' + this.urlparam.product + '/v1/cavisson/netdiagnostics/ddr/pageDumpSnapShot?cacheId='+ this.urlparam.testRun;
        }
        else{
            url = this.getHostUrl() + '/' + this.urlparam.product + '/v1/cavisson/netdiagnostics/ddr/pageDumpSnapShot';      
        }
        // this.makeTableColumns();
        this.ddrRequest.getDataUsingPost(url, queryParam).subscribe(data => (this.pageDumpSnapshotData(data)));

    }

    viewParameterSubstitute(node) {
        this.lowerTable = [];
        let parameter = this.decodeWithImpl(this.ReplaceAll(this.replaceHtmlTags(node.parameterSubstitution),"'","CAV_COMMA"));
        parameter = this.ReplaceAll(parameter, "&", "$Cav$");
        parameter = this.ReplaceAll(parameter, "=", "*Cav*");
        parameter = this.ReplaceAll(parameter, "%", "@*@");
        parameter = this.ReplaceAll(parameter, "\n", "@$@");
        parameter = this.ReplaceAll(parameter, "+", "@Cav@");
        parameter = this.ReplaceAll(parameter, "CAV_COMMA", "'")
        this.filterParameter = 'Virtual User: ' + node.userID + ',' + ' Session: ' + node.sessionInstance + ',' + ' Script: ' + node.scriptName + ',' + ' Start Time: ' + (node.absoluteStartTime || this.msToTimeFormate(node.startTime)) + ',' + ' Page: ' + node.pageName + ',' + ' Page Status: ' + node.pageStatus + ',' + ' Page Response Time: ' + this.msToTimeFormate(node.pageResponseTime);
        let url = this.getHostUrl() + '/' + this.urlparam.product + '/v1/cavisson/netdiagnostics/ddr/pageParameter';
        this.ddrRequest.getDataUsingPost(url, parameter).subscribe(data => (this.pageDumpParameter(data)));
    }

    pageDumpParameter(res) {
        this.colsForparameter = [
            { field: 'name', header: 'Parameter Name', sortable: true, action: true, width: '150' },
            { field: 'value', header: 'Parameter Value', sortable: true, action: true, width: '600' },
        ];
        this.array1 = res;
        this.originalValues = JSON.parse(JSON.stringify(this.array1));
        this.display = true;

    }

    decodeValues(value) {
        if (value) {
            for (let i = 0; i <= this.array1.length; i++) {
                var tempVar = this.ReplaceAll(this.array1[i].encoded, ">", "&gt;");
                tempVar = this.ReplaceAll(tempVar, "<", "&lt;");
                this.array1[i].value = tempVar;
            }
        }
        else {
            this.array1 = [];
            this.array1 = JSON.parse(JSON.stringify(this.originalValues));
        }
    }


    viewlowertable(node) {
        let value = this.decodeURI(node.value);
        this.parameterName = node.name;
        this.colsForLowerTable = [
            { field: 'Key', header: 'Key', sortable: true, action: true, width: '150' },
            { field: 'Value', header: 'Value', sortable: true, action: true, width: '500' },
        ];

        setTimeout(() => {
            this.parseKeyValue(this.escapeHtml(value));
        }, 500);
    }

    parseKeyValue(data) {
        try {
            let lowerTableData = {};
            data = this.ReplaceAll(data, "&quot;", "%Cav%");
            var arrData = data.split("&");
            for (var i = 0; i < arrData.length; i++) {
                var arrSplit = arrData[i].split("=");
                let key;
                let value;
                if (arrSplit.length > 1) {
                    key = arrSplit[0];
                    value = "";
                    for (var j = 1; j < arrSplit.length; j++) {
                        if (j != 1)
                            value = value + "=" + arrSplit[j];
                        else
                            value = value + arrSplit[j];
                    }
                }
                else {
                    key = arrSplit[0];
                    value = "";
                }
                lowerTableData = { 'Key': key, 'Value': value };
                this.lowerTable.push(lowerTableData);
            }
            return this.lowerTable;
        } catch (error) {
            return this.lowerTable = [];
        }
    }

    escapeHtml(text) {
        let entities = [
            ['apos', '\''],
            ['amp', '&'],
            ['lt', '<'],
            ['gt', '>']
        ];

        for (let i = 0, max = entities.length; i < max; ++i)
            text = text.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);

        return text;
    }


    unEscapeHtml(text) {
        let entities = [
            ['\'', '&apos;'],
            ['&', '&amp;'],
            ['<', '&lt;'],
            ['>', '&gt;']
        ];

        for (let i = 0, max = entities.length; i < max; ++i)
            text = text.replace(new RegExp(entities[i][0], 'g'), entities[i][1]);

        return text;
    }

    isKeyValuePairExist(index) {
        index = this.decodeURI(index);
        var temp = this.ReplaceAll(index, ">", "&gt;");
        temp = this.ReplaceAll(temp, "<", "&lt;");
        if (temp.indexOf("&") > -1 && temp.indexOf(("=")) > -1) {
            return true;
        }
        else {
            return false;
        }
    }

    onTabClose(event) {
        let index = event.index;
        if (this.accValue['accordion']['tabs'][index].header == 'Page Dump Table' && !this.accValue['accordion']['tabs'][index].selected) {
            this.value = '80vh';
        }
    }
    onTabOpen(event) {
        let index = event.index;
        if (this.accValue['accordion']['tabs'][index].header == 'Page Dump Table' && this.accValue['accordion']['tabs'][index].selected) {
            this.value = '27vh';
        }
    }

    setPaginateData(event) {
        this.pageLimit = event.limit;
        this.pageOffset = event.offset;
        this.loading = true;
        this.urlparam['limit'] = this.pageLimit;
        this.urlparam['offset'] = this.pageOffset;
        this.makeAjaxCall(this.url, false);
    }

    ReplaceAll(Source, stringToFind, stringToReplace) {
        let temp = Source;
        let index = temp.indexOf(stringToFind);
        while (index != -1) {
            temp = temp.replace(stringToFind, stringToReplace);
            index = temp.indexOf(stringToFind);
        }
        return temp;
    }

    
    replaceStr(value) {
        let replacedVal;
        replacedVal = this.ReplaceAll(this.ReplaceAll(this.decodeWithImpl(value), "$Cav_%3B", ";"), "\\\'", "\'");
        return replacedVal;
    }

    decodeURI(value) {
        value = this.ReplaceAll(value, "\\$Cav\\$", "&");
        value = this.ReplaceAll(value, "@Cav@", "+");
        value = this.ReplaceAll(value, "\\*Cav\\*", "=");
        value = this.ReplaceAll(value, "@\\*@", "%");
        value = this.ReplaceAll(value, "@\\$@", "\\\\n");
        return value;
    }

    decodeWithImpl(html) {
        let input = this.decodeHtml(html);
        return input;
    }


    decodeHtml(html) {
        let txt = document.createElement("textarea");
        txt.innerHTML = html;
        return txt.value;
    }

    replaceAll(varb, replaceThis, replaceBy) {
        let newvarbarray = varb.split(replaceThis);
        let newvarb = newvarbarray.join(replaceBy);
        return newvarb;
    }

    convertDataForTooltip(value, header) {
        var temp = this.ReplaceAll(value, "&", "&apos;");
        temp = this.replaceAll(temp, "%Cav%", "&quot;");
        temp = this.ReplaceAll(temp, ">", "&gt;");
        temp = this.ReplaceAll(temp, "<", "&lt;");
        temp = this.ReplaceAll(temp, "\'", "&apos;");
        temp = this.replaceAll(temp, "\"", "&quot;");
        if (header == 'Key')
            return this.escapeHtml(temp);
        if (header == 'Value')
            return temp;
    }
    convertDataForValue(value, header) {
        let temp = this.replaceAll(value, "%Cav%", "&quot;");
        if (header == 'Key')
            return this.unEscapeHtml(temp);
        if (header == 'Value')
            return temp;
    }

    viewPageStatus(message) {
        this.cvMsg = message;
        this.cvFail = true;
    }

    /**
* @Custom Sorting on data for Custom Table
*/
    customSortOnColumns(event, data, tempData) {
        if (event.order == -1) {
            var temp = (event["field"]);
            event.order = 1
            tempData = tempData.sort(function (a, b) {
                if (temp == 'absoluteStartTime') {
                    var value = Date.parse(a[temp]);
                    var value2 = Date.parse(b[temp]);
                }
                else {
                    var value = Number(a[temp]);
                    var value2 = Number(b[temp]);
                }
                return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
        }
        else {
            var temp = (event["field"]);
            event.order = -1;
            //asecding order
            tempData = tempData.sort(function (a, b) {
                if (temp == 'absoluteStartTime') {
                    var value = Date.parse(a[temp]);
                    var value2 = Date.parse(b[temp]);
                }
                else {
                    var value = Number(a[temp]);
                    var value2 = Number(b[temp]);
                }
                return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
        }

        data.key = [];
        if (tempData) {
            tempData.map((rowdata) => { data.key = this.Immutablepush(data.key, rowdata) });
        }

    }
    Immutablepush(arr, newEntry) {
        return [...arr, newEntry]
    }


    showPages(event) {
        for(let i =0;i<this.pageList.length;i++){
            if(this.pageList[i].value == event.value)
            this.pageTooltipPageListLabel = this.pageList[i].label;
        }
         if (event.value == 3) {
            //this.failedTypeList = JSON.parse(JSON.stringify(this.errorData));
           if(this.failedTypeList.length==0)
           {
            let url = decodeURIComponent(this.getHostUrl() + '/' + this.urlparam.product.replace("/", "")) + '/v1/cavisson/netdiagnostics/ddr/pageDumpErrorCode?testRun='
                + this.urlparam['testRun'] + "&object=1";
            this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.failedTypeList = JSON.parse(JSON.stringify(data['errorData']))));
	    this.errorData=JSON.parse(JSON.stringify(this.failedTypeList));
           }
            this.showFailedList = true;
        }
	 else {
            this.showFailedList = false;
            this.failedType = [];
        }
    }

    showTime(timeType) {
        for(let i =0;i<this.timeDropDown.length;i++){
            if(this.timeDropDown[i].value == timeType)
            this.pageTooltipTimeLabel = this.timeDropDown[i].label;
        }
        this.time = timeType;
        if (this.time != "") {
            if(this.isFirstTime){
                let currHeight = this.maxValue.substring(0,this.maxValue.indexOf("px"));
                this.maxValue = (Number(currHeight) - 24) + 'px';
            }
            this.calendar = true;
            this.fillStartEndDate(timeType);
            this.isFirstTime = false;
        }
        else{
            if(this.calendar){
                let currHeight = this.maxValue.substring(0,this.maxValue.indexOf("px"));
                this.maxValue = (Number(currHeight) + 24) + 'px';
            }
            this.isFirstTime = true;
            this.calendar = false;
        }
        
    }

    
    fillStartEndDate(phaseval) {
        
        var arrDate = new Array();
        var arrTime = new Array();
        var index = this.testRunDateTime.lastIndexOf(" ");
        var testRunDate = this.testRunDateTime.substr(0, index);
        var testRunTime = this.testRunDateTime.substr(index + 1, this.testRunDateTime.length);
        arrDate = testRunDate.split("/");
        arrTime = testRunTime.split(":");
        this.txtStartTimeHourId = arrTime[0];
        this.txtStartTimeMinuteId = arrTime[1];
        this.txtStartTimeSecId = arrTime[2];
        this.txtStartDateId = new Date(testRunDate.trim());
        var date = new Date(new Date().getFullYear(), (arrDate[0] - 1), arrDate[1], arrTime[0], arrTime[1], arrTime[2], +'00');
        var endTime = Number(date.getTime() / 1000) + Number(this.convStrToMilliSec(this.duration) / 1000);
        var endDate = new Date(endTime * 1000);
        var endMonth = endDate.getMonth() + 1 + "";
        var endDateNumber = endDate.getDate() + "";
        this.txtEndTimeHourId = endDate.getHours() + "";
        this.txtEndTimeMinuteId = endDate.getMinutes() + "";
        this.txtEndTimeSecId = endDate.getSeconds() + "";
        
        if (phaseval == "Relative Time") {
            this.txtStartTimeHourId = "00";
            this.txtStartTimeMinuteId = "00";
            this.txtStartTimeSecId = "00";
            var arrEndTimeColon = this.duration.split(":");
            this.txtEndTimeHourId = arrEndTimeColon[0];
            this.txtEndTimeMinuteId = arrEndTimeColon[1];
            this.txtEndTimeSecId = arrEndTimeColon[2];
        }

        if (this.txtEndTimeHourId.length == 1)
        this.txtEndTimeHourId = "0" + this.txtEndTimeHourId;

        if (this.txtEndTimeMinuteId.length == 1)
            this.txtEndTimeMinuteId = "0" + this.txtEndTimeMinuteId;
            
            if (this.txtEndTimeSecId.length == 1)
            this.txtEndTimeSecId = "0" + this.txtEndTimeSecId;
            

            if (endMonth.length == 1)
            endMonth = "0" + endMonth;
            
            if (endDateNumber.length == 1)
            endDateNumber = "0" + endDateNumber;
            
            var endDateInFormat = endMonth + '/' + endDateNumber + '/' + endDate.getFullYear().toString().substring(2);
        this.txtEndDateId = new Date(endDateInFormat.trim());
    }
    
    convStrToMilliSec(timeStr) {
        var milliSecTmp;
        if (timeStr != "") {
            let temp = timeStr.split(":");
            var hourTmp = (Math.abs(temp[0]));
            var minuteTmp = (Math.abs(temp[1]));
            var secTmp = (Math.abs(temp[2]));
            secTmp = hourTmp * 3600 + minuteTmp * 60 + secTmp;
            milliSecTmp = secTmp * 1000;
            
            return milliSecTmp;
        }
        else
            return milliSecTmp;
    }
    
    showSessions(event) {
        for(let i =0;i<this.sessionList.length;i++){
            if(this.sessionList[i].value == event.value)
            this.pageTooltipSessionLabel = this.sessionList[i].label;
        }
	    if(!this.sessionFailedList)
        	console.log("value not found in session failure case");
            if (event.value == 3 ) {
         	if(this.sessionFailedList.length==0)
         	{
            		let url = decodeURIComponent(this.getHostUrl() + '/' + this.urlparam.product.replace("/", "")) + '/v1/cavisson/netdiagnostics/ddr/pageDumpErrorCode?testRun='
                	+ this.urlparam['testRun'] + "&object=3";
            		this.ddrRequest.getDataUsingGet(url).subscribe(data => (this.sessionFailedList = JSON.parse(JSON.stringify(data['errorData']))));
           		 //  this.sessionFailedList = JSON.parse(JSON.stringify(this.errorSessionData));
			this.errorSessionData=JSON.parse(JSON.stringify(this.sessionFailedList));
         	}
            	this.showSessionFailedList = true;
        	}
        else {
           this.showSessionFailedList = false;
            this.sessionFailedType = [];
        }

    }

    getOtherFailedPageValue(data) {
        let tempValue = "";
        for (let i = 0; i < data.length; i++) {
            if (tempValue == "")
            tempValue = data[i];
            else
            tempValue = tempValue + "," + data[i];
        }
        return tempValue;
    }

    compareDates(startDate, endDate) {
        var x = new Date(startDate);
        var y = new Date(endDate);
        if (x < y)
        return false;
        else
        return true;
    }
    
    valEnteredKeyN(event) {
        if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode == 0) || (event.keyCode == 8))
        return true;
        else
        return false;
    }
    validateQty(event){
        if(this.value1.length == 0){
            if((event.charCode >=65 && event.charCode <= 90) || (event.charCode >=97 && event.charCode <= 122))
            {
                return true;
            }
            else{
               return false;
            }
        }else{
            return true;
        }
        }

    Apply() {
        this.filterData = "";
         for(let i=0;i<this.pageList.length;i++)
         {
             if(this.pageListOption == this.pageList[i].value)
              this.filterData += " Pages: " + this.pageList[i].label;
         }
        

        if (this.pageListOption == 3 && this.failedType) {
            this.failed = this.getOtherFailedPageValue(this.failedType);
            this.urlparam['strOtherFailedPage'] = this.failed;
            let split = [];
            let failedpg = "";
            if (this.failed.includes(","))
                split = this.failed.split(",");
            else
                split = this.failed;
            for (let i = 0; i < split.length; i++) {
                if(this.errorData){
                for(let j=0;j<this.errorData.length;j++){
                if (this.errorData[j].value == split[i])
                    failedpg += ',' + this.errorData[j].label;
                }
             }
                if (failedpg.startsWith(',')) {
                    failedpg = failedpg.substring(1);
                  }
            }
            this.filterData += ", Failed type page: " + failedpg;
        }
        this.urlparam['strFailedPage'] = this.pageListOption;


            for(let i=0;i<this.sessionList.length;i++)
            {
                if(this.sessionListOption == this.sessionList[i].value)
                 this.filterData += ", Sessions: " + this.sessionList[i].label;
            }
           
        
        if (this.sessionListOption == 3 && this.sessionFailedType) {
            this.sessionFailed = this.getOtherFailedPageValue(this.sessionFailedType);
            this.urlparam['strOtherFailedSession'] = this.sessionFailed;

            let split = [];
            let failedses = "";
            if (this.sessionFailed.includes(","))
                split = this.sessionFailed.split(",");
            else
                split = this.sessionFailed;
            for (let i = 0; i < split.length; i++) {
                if(this.errorSessionData){
                for(let j=0;j<this.errorSessionData.length;j++){
                if (this.errorSessionData[j].value == split[i])
                failedses += ',' + this.errorSessionData[j].label;
                }
              }
                if (failedses.startsWith(',')) {
                    failedses = failedses.substring(1);
                  }
            }
            this.filterData += ", Failed type session: " + failedses;
        }
        this.urlparam['strFailedSession'] = this.sessionListOption;
        
        this.urlparam['strScriptName'] = this.scriptArrValue;
        if(this.scriptArrValue!="")
        this.filterData += ', Script Name :'+this.scriptArrValue;

        this.urlparam['strPageName'] = this.pageArrValue;
        if(this.pageArrValue!="")
            this.filterData += ', Page Name :' + this.pageArrValue;

        if (this.time == "Specified Time" || this.time == "Relative Time") {
            this.strStartTime = this.txtStartTimeHourId + ":" + this.txtStartTimeMinuteId + ":" + this.txtStartTimeSecId;
            this.strEndTime = this.txtEndTimeHourId + ":" + this.txtEndTimeMinuteId + ":" + this.txtEndTimeSecId;

            
            var startTimeInMs = this.convStrToMilliSec(this.strStartTime);
            var endTimeInMs = this.convStrToMilliSec(this.strEndTime);

            if (this.time != "Relative Time") {
                let strDate = new Date(this.txtStartDateId);
                this.strStartDate = (strDate.getMonth() + 1).toString() + '/' + strDate.getDate().toString() + '/' + strDate.getFullYear().toString();
                
                let endDate = new Date(this.txtEndDateId);
                this.strEndDate = (endDate.getMonth() + 1).toString() + '/' + endDate.getDate().toString() + '/' + endDate.getFullYear().toString();
                
                if (this.compareDates(this.strStartDate, this.strEndDate) && startTimeInMs >= endTimeInMs) {
                    alert("Start time should not be greater than or equals to end time");
                    return;
                }
            }
            else {
                if (startTimeInMs >= endTimeInMs) {
                    alert("Start time should not be greater than or equals to end time");
                    return;
                }
            }
        }

        if (this.filterData.startsWith(',')) {
            this.filterData = this.filterData.substring(1);
          }

        if (this.time == "Specified Time") {
            this.urlparam['timeType'] = "Specified Time";
            this.urlparam['strStartDate'] = this.strStartDate;
            this.urlparam['strEndDate'] = this.strEndDate;
            this.urlparam['strStartTime'] = this.strStartTime;
            this.urlparam['strEndTime'] = this.strEndTime;
        } else if (this.time == "Relative Time") {
            this.urlparam['timeType'] = "Relative Time";
            this.urlparam['strStartTime'] = this.strStartTime;
            this.urlparam['strEndTime'] = this.strEndTime;
        } else {
            this.urlparam['timeType'] = "";
        }

        if (this.pageListOption == 3 && !this.failed)
            alert("Please choose failure type");
        else if (this.sessionListOption == 3 && !this.sessionFailed)
        alert("Please choose session failure type");
        else {
            this.makeAjaxCall(this.url, true);
        }
    }

    refresh() {
        this.makeAjaxCall(this.url, true);
    }
    
    reset() {
        this.pageLimit = 50;
        this.pageOffset = 0;
        this.urlparam['strFailedPage'] = "";
        this.urlparam['strFailedSession'] = "";
        this.urlparam['strOtherFailedPage'] = "";
        this.urlparam['strOtherFailedSession'] = "";
        this.urlparam['strPageName'] = "";
        this.urlparam['strScriptName'] = "";
        this.urlparam['timeType'] = "";
        this.urlparam['limit'] = this.pageLimit;
        this.urlparam['offset'] = this.pageOffset;

        
        this.showFailedList = false;
        this.showSessionFailedList = false;
        this.pageListOption = -2;
        this.sessionListOption = -2;
        this.scriptArrValue = "";
        this.pageArrValue = "";
        this.failedType = [];
        this.sessionFailedType = [];
        this.timeValue = "";
        this.calendar = false;

        this.val1 = false;
        this.val2 = false;
        this.param1 = ""
        this.param2 = "";
        this.param3 = "";
        this.urlparam["childindex"] = this.param1;
        this.urlparam["userindex"] = this.param2;
        this.urlparam["sessioninstance"] = this.param3;
        this.value1 = "";
	this.tempVal="";
        if (this.flagOfDrillDown == 'no') 
            this.filterData = ' Response Page Snapshots';
        else 
            this.makefiltercriteria();
            
        this.makeAjaxCall(this.url, true);

    }
    
    showRecordedFrame() {
        this.recfrm = true;
        this.makeAjaxCall(this.url, false);
        
        
    }

    hideRecordedFrame() {
        this.recfrm = false;
        this.makeAjaxCall(this.url, false);
    }
    
    downloadReports(reports: string) {
        let userSess = "";
	let prmFilter = "";
        if(this.downloadData.length == 0)
         return;
        let renameArray = { "startTime": "Start Time", "absoluteStartTime": "Absolute Start Time", "errorCodesMessage": "Error Codes Message", "flowNameWithoutExtn": "flowNameWithoutExtn", "group": "Group", "pageDumpURL": "pageDumpURL", "pageName": "Page Name", "pageResponseTime": "Page Response Time", "pageStatus": "Page Status", "parameterSubstitution": "Parameter Substitution", "partitionNumber": "Partition Number", "projectName": "projectName", "recordedPageUrl": "recordedPageUrl", "rep": "rep", "repBody": "repBody", "req": "req", "scriptName": "Script Name", "sessionInstance": "Session Instance", "sessionStatus": "Session Status", "subProjectName": "subProjectName", "traceLevel": "traceLevel", "userID": "User ID" };
        let colOrder = [];

        userSess += this.selectedUserSession();
	prmFilter += this.appliedParamFilter();
        
        if (this.isND === true)
        colOrder.push("Absolute Start Time");
        else
        colOrder.push("Start Time");

        colOrder.push('Session Instance', 'User ID', 'Group', 'Script Name', 'Page Name', 'Page Status', 'Session Status', 'Parameter Substitution', 'Partition Number', 'Page Response Time', 'Error Codes Message', 'projectName', 'subProjectName');
        
        this.downloadData.forEach((val, Index) => {
            val['pageResponseTime'] = this.msToTimeFormate(val['pageResponseTime']);
            delete val['flowNameWithoutExtn'];
            delete val['pageDumpURL'];
            delete val['recordedPageUrl'];
            delete val['traceLevel'];
            delete val['repBody'];
            delete val['rep'];
            delete val['req'];
            delete val['absDateTime'];
            delete val["gC"];    
            if (this.isND === false)
            val['startTime'] = this.msToTimeFormate(val['startTime']);
        });

        let downloadObj: Object = {
            downloadType: reports,
            varFilterCriteria: this.filterData + userSess + prmFilter,
            strSrcFileName: 'pageDump',
            strRptTitle: "Response Page Snapshots - Test Run Number : " + this.urlparam.testRun,
            renameArray: JSON.stringify(renameArray),
            colOrder: colOrder.toString(),
            jsonData: JSON.stringify(this.downloadData)
        };
        
        let downloadFileUrl = decodeURIComponent(this.getHostUrl() + '/' + this.urlparam.product) +
        '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
        this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
            (this.openDownloadReports(res)));
    }
    
    openDownloadReports(res) {
        window.open(decodeURIComponent(this.getHostUrl() + '/' + this.urlparam.product).replace('/netstorm', '').replace('/netdiagnostics', '').replace('/netcloud','') +
        '/common/' + res);
    }
    viewSequenceDiagram(){
        this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.PAGE_DUMP;
        this._router.navigate(['/home/ddr/sequencediagram','fromPage']);
    }
    paginate(event) {
        // event.first = Index of the first record  (used  as offset in query) 
        // event.rows = Number of rows to display in new page  (used as limit in query)
        // event.page = Index of the new page
        // event.pageCount = Total number of pages
        console.log('paginate event====>', event);
        // this.commonService.rowspaerpage = event.rows;
        // this.pageLimit = event.limit;
        // this.pageOffset = event.offset;
        this.pageOffset = parseInt(event.first);
        this.pageLimit = parseInt(event.rows);
        if (this.pageLimit > this.totalCount) {
            this.pageLimit = Number(this.totalCount);
        }
        if ((this.pageLimit + this.pageOffset) > this.totalCount) {
            this.pageLimit = Number(this.totalCount) - Number(this.pageOffset);
        }
        
        this.loading = true;
        this.urlparam['limit'] = this.pageLimit;
        this.urlparam['offset'] = this.pageOffset;
        this.makeAjaxCall(this.url, false);
    }

    onFilterToggle(event){
        this.filterCollapsed = event.collapsed;
        this.setMaxValue(event.collapsed);
    }

    setMaxValue(event){
        let currHeight = this.maxValue.substring(0, this.maxValue.indexOf("px"));
        if (event) {
            if (this.calendar)
                this.maxValue = (Number(currHeight) + 56) + 'px';
                else
                this.maxValue = (Number(currHeight) + 32) + 'px';
            }
        else {
            if (this.calendar)
                this.maxValue = (Number(currHeight) - 24 - 32) + 'px';
                else
                this.maxValue = (Number(currHeight) - 32) + 'px';
            }
    }

    toggle(event){
            // console.log("event  ",event);
    }

       replaceHtmlTags(text) {
        return text
            .replace(/&amp;/g,"&")
            .replace(/&lt;/g,"<")
            .replace(/&gt;/g,">")
            .replace(/&quot;/g,'"')
            .replace(/&#039;/g,"'" );
      }

    openuserFilter() {
        this.childIdxFilter = this.param1;
        this.virtualUserid = this.param2;
        this.virtualSessionid = this.param3;
        if (!this.param1) {
            this.val1 = false;
            this.val2 = false;
        }
        else {
            if (!this.param2) {
                this.val1 = false;
            }
            if (!this.param3) {
                this.val2 = false;
            }
        }
        this.usersessionFilter = true;
    }

    userFilter() {
        this.pageLimit = 50;
        this.pageOffset = 0;
        this.urlparam['limit'] = this.pageLimit;
        this.urlparam['offset'] = this.pageOffset;
        this.paginatorReset();
        this.param1 = (this.val1 || this.val2) ? this.childIdxFilter : "";
        this.param2 = (this.val1 == true && this.childIdxFilter) ? this.virtualUserid : "";
        this.param3 = (this.val2 == true && this.childIdxFilter) ? this.virtualSessionid : "";
        this.urlparam["childindex"] = this.param1;
        this.urlparam["userindex"] = this.param2;
        this.urlparam["sessioninstance"] = this.param3;
        this.usersessionFilter = false;
        this.makeAjaxCall(this.url, true);
    }

    closeuserFilter() {
        this.usersessionFilter = false;
    }

    applyButton() {
        if (!this.val1 && !this.val2) {
            return true;
        }
        if (!this.childIdxFilter) {
            return true;
        }
        if (this.childIdxFilter && this.val1 && !this.virtualUserid) {
            return true;
        }
        if (this.childIdxFilter && this.val2 && !this.virtualSessionid) {
            return true;
        }
        else {
            return false;
        }
    }

    selectedUserSession(){
        let toAppend = "";
        if(this.param1){
            if(this.param2){
                toAppend += ', Virtual User - ' + this.param1 + ":" + this.param2; 
            }
            if(this.param3){
                toAppend += ', Session - ' + this.param1 + ":" + this.param3;
            }
        }
        return toAppend;
    }
    appliedParamFilter(){
	let toAppend="";
	if(this.tempVal){
		toAppend += ', Parameter Filter - ' + this.tempVal;
	}
    return toAppend;
    }

    selectParamFilter(){
		this.paramFilter = true;
        this.value1 = this.tempVal;
    }

    openParamFilter() {
        this.pageLimit = 50;
        this.pageOffset = 0;
        this.urlparam['limit'] = this.pageLimit;
        this.urlparam['offset'] = this.pageOffset;
        this.paginatorReset();
        this.makeAjaxCall(this.url,true);
	this.tempVal=this.value1;
	if(this.tempVal){
		//this.paramsFilter=this.appliedParamFilter().substring(1);
	}
        // this.filterParam();
        this.paramFilter = false;
    }

    paginatorReset() {
        console.log("this.paginateRef before===>", this.paginateRef);
        let length = this.paginateRef['pageLinkSize'];
        let arry = [];
        for (let i = 1; i <= length; i++)
            arry.push(i);
        //this.paginateRef['pageLinks'] = [];
        //this.paginateRef['pageLinks'] = arry;
        this.paginateRef['_rows'] = 50;
        this.paginateRef['_first'] = 0;
        console.log("this.paginateRef after===>", this.paginateRef);
    }
}
