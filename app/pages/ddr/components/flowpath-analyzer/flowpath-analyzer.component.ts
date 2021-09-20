import { Component, OnInit, OnDestroy, ChangeDetectorRef, ElementRef, Renderer2, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
// import { DataTableModule, BlockUIModule, MultiSelectModule } from 'primeng/primeng';
//import 'rxjs/Rx';
// import { Logger } from '../../../../../vendors/angular2-logger/core';
// import { forEach } from '@angular/router/src/utils/collection';
// import { ChartModule } from 'angular2-highcharts';
import { CommonServices } from '../../services/common.services';
import { Router } from '@angular/router';
import { CavConfigService } from '../../../tools/configuration/nd-config/services/cav-config.service';
import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
import { CavTopPanelNavigationService } from '../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { MessageService } from '../../services/ddr-message.service';
import { DDRRequestService } from '../../services/ddr-request.service';
// import { Message } from 'primeng/primeng';
// declare var LZString: any;
// import { LZString } from './../../services/common.services';
import * as Highcharts from 'highcharts';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';

@Component({
  selector: 'app-flowpath-analyzer',
  templateUrl: './flowpath-analyzer.component.html',
  styleUrls: ['./flowpath-analyzer.component.css']
})
export class FlowpathAnalyzerComponent implements OnInit, AfterViewInit {
  highcharts = Highcharts;
  loading = false;
  loading1 = false;
  screenHeight: any;
  patternData: Array<FPAnalyzeInterface>;
  colsForPattern = [];
  urlParam: any;
  topMethodData = [];
  colsForTopMethods = [];
  noOfpattern = 5;
  colsForTimeNCount = [];
  mergeArr = [];
  options: any;
  options1: any;
  showDownLoadReportIcon = false;
  filterCriteria: any;
  donwloadFilterCriteria: any;
  displayPopUp;
  infoHeader;
  strInfoMessage;
  signatureData = [];
  colsForSignature = [];
  timeData = '';
  filterTierName = '';
  filterDCName = '';
  completeTier = '';
  testRun: any;
  host = '';
  port = '';
  protocol = '//';
  dcProtocol = '//';
  ajaxUrl = '';
  defaultfield1 = 'pattern';
  defaultfield2 = 'signature';
  showWarning = false;
  patternHeader: string = "";
  @ViewChild('tableref') tableRef: ElementRef;
  dbCallout: any[];
  numberMethods: any[];
  breadcrumb: BreadcrumbService;

  constructor(public commonService: CommonServices,
    private _router: Router, private _cavConfigService: CavConfigService,
    private _navService: CavTopPanelNavigationService,
    private _cavConfig: CavConfigService,
    private _ddrData: DdrDataModelService,
    private breadcrumbService: DdrBreadcrumbService,
    private _changeDetection: ChangeDetectorRef, private renderer: Renderer2,
    private ddrRequest: DDRRequestService, breadcrumb: BreadcrumbService) { this.breadcrumb = breadcrumb; }

  ngOnInit() {
    this.loading = true;
    this.loading1 = true;
    this.commonService.isToLoadSideBar = false;
    this.screenHeight = Number(this.commonService.screenHeight) - 120;
    // this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.FPANALYZER);
    this.breadcrumb.add({label: 'Flowpaths Analyzer', routerLink: '/ddr/flowpathAnalyzer'});
    this.urlParam = this.commonService.getData();
    this.commonService.removeFromStorage();
    this.commonService.setInStorage = this.urlParam;
    if (this.commonService.fpAnalyzeData) {
      sessionStorage.removeItem("fpAnalyzeData");
      sessionStorage.setItem("fpAnalyzeData", JSON.stringify(this.commonService.fpAnalyzeData));
    } else {
      this.commonService.fpAnalyzeData = JSON.parse(sessionStorage.getItem("fpAnalyzeData"));
    }

    if (this._router.url.indexOf('?') !== -1 && (this._router.url.indexOf('/home/ddrCopyLink/flowpath') !== -1
      || this._router.url.indexOf('/home/ED-ddr/flowpath') !== -1)) {
      let queryParams1 = location.href.substring(location.href.indexOf('?') + 1, location.href.length);
      this.urlParam = JSON.parse('{"' + decodeURI(queryParams1).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"') + '"}');
      this.commonService.removeFromStorage();
      this.commonService.setInStorage = this.urlParam;
    }
    console.log('this.urlParam************', this.urlParam);
    console.log('analyzedata----->', this.commonService.fpAnalyzeData);

    this.createColumns();
    this.getJsonData();
    this.createFilterCriteria(this.timeData);
    this.getSignatureJsonData();
  }


  ngAfterViewInit() {
    let referer: ElementRef = this.tableRef['el'];
    console.log("nativelemeny value", referer.nativeElement.querySelectorAll('th'));
    this.renderer.setStyle(referer.nativeElement.querySelectorAll('th')[0], 'width', '140px');
    this.renderer.setStyle(referer.nativeElement.querySelectorAll('th')[1], 'width', '160px');

  }
  /**
   * Filter Criteria
   */

  createFilterCriteria(timePeriod: any) {
    this.donwloadFilterCriteria = "";
    this.completeTier = "";
    //this.filterTierName = "";
    this.filterCriteria = "";
    this.filterDCName = "";
    let fpAHeader = this.urlParam;
    let dcName = "";

    if (sessionStorage.getItem("isMultiDCMode") == "true") {
      let dcName = this._cavConfig.getActiveDC();
      if (dcName == "ALL")
        dcName = this._ddrData.dcName;

      this.filterDCName = 'DC=' + dcName + ', ';
      this.filterCriteria += this.filterDCName;
      this.donwloadFilterCriteria += this.filterDCName;

    }
    if (this.commonService.isValidParamInObj(fpAHeader, 'tierName')) {
      console.log('tier name filter', fpAHeader);
      //this.donwloadFilterCriteria = 'Tier=' + fpAHeader['tierName'];
      if (fpAHeader['tierName'].length > 32) {
        this.filterCriteria += 'Tier=' + fpAHeader['tierName'].substring(0, 32) + '...';
        this.completeTier = fpAHeader['tierName'];
      } else
        this.filterCriteria += 'Tier=' + fpAHeader['tierName'];
    }

    if (this.commonService.isValidParamInObj(fpAHeader, 'serverName')) {
      this.filterCriteria += ', Server=' + fpAHeader['serverName'];
    }

    if (this.commonService.isValidParamInObj(fpAHeader, 'appName')) {
      this.filterCriteria += ', Instance=' + fpAHeader['appName'];
    }

    if (this.commonService.isValidParamInObj(fpAHeader, 'urlName')) {
      this.filterCriteria += ', BT=' + fpAHeader['urlName'];
    }

    if (timePeriod.length !== 0 && timePeriod.length > 1) {
      console.log('Inside data case');
      this.filterCriteria += ', StartTime=' + timePeriod[0] + ', EndTime =' + timePeriod[1];
    } else {
      console.log('Inside no data case')
      if (this.urlParam.strGraphKey !== 'WholeScenario') {
        if (this.commonService.isValidParamInObj(fpAHeader, 'endTimeInDateFormat')) {
          this.filterCriteria += ', StartTime=' + fpAHeader['startTimeInDateFormat'];
        }
        if (this.commonService.isValidParamInObj(fpAHeader, 'endTimeInDateFormat')) {
          this.filterCriteria += ', EndTime=' + fpAHeader['endTimeInDateFormat'];
        }
      }
    }

    if (this.commonService.isValidParamInObj(fpAHeader, 'btCategory')) {
      if (this.commonService.fpAnalyzeData.btCatagory === 'extbt') {
        this.filterCriteria += ', BT Type= All'
      } else {
        this.filterCriteria += ', BT Type=' + this.getBTCategory(fpAHeader['btCategory']);
      }
    }

    this.donwloadFilterCriteria += this.filterCriteria;
    console.log('this.filterCriteria-----', this.filterCriteria);
  }

  /*
  * Method is used get host url
  */
  getHostUrl(isDownloadCase?): string {
    var hostDcName = this._ddrData.getHostUrl(isDownloadCase);
    if (!isDownloadCase && sessionStorage.getItem('isMultiDCMode') === 'true' && this._cavConfig.getActiveDC() === 'ALL') {
      //hostDcName =  this._ddrData.host + ':' + this._ddrData.port ;
      this.urlParam.testRun = this._ddrData.testRun;
      this.testRun = this._ddrData.testRun;
      console.log('all case url==>', hostDcName, 'all case test run==>', this.urlParam.testRun);
    }
    //  else if (this._navService.getDCNameForScreen('flowpathAnalyzer') === undefined) {
    //   hostDcName = this._cavConfigService.getINSPrefix();
    // } else {
    //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen('flowpathAnalyzer');
    // }

    // if (hostDcName.length > 0) {
    //   sessionStorage.removeItem('hostDcName');
    //   sessionStorage.setItem('hostDcName', hostDcName);
    // } else {
    //   hostDcName = sessionStorage.getItem('hostDcName');
    // }

    // if (this._ddrData.protocol) {
    //   sessionStorage.setItem('protocol', this._ddrData.protocol);
    // } else {
    //     sessionStorage.setItem('protocol', location.protocol.replace(':', ''));
    // }
    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  /**
   * Method to entry only number in text box
   */

  onlyNumberKey(event) {
    return (event.charCode === 8 || event.charCode === 0) ? null : event.charCode >= 48 && event.charCode <= 57;
  }

  /**
   * To apply custom number of pattern
   */
  applyPattern() {
    // console.log('pattern----', this.noOfpattern);
    if (this.noOfpattern >= 11) {
      this.displayPopUp = true;
      this.infoHeader = 'Number of Pattern';
      this.strInfoMessage = 'Number of Pattern should not be greater than 10';
    } else {
      this.loading1 = true;
      this.createColumns();
      this.getJsonData();
    }
  }

  /**
   * creating the table coulmns dynamically
   */
  createColumns() {
    this.colsForSignature = [
      { field: 'signature', header: 'Signature', sortable: 'custom', action: true, align: 'left', width: '100' },
      { field: 'fpCount', header: 'FlowPath Count', sortable: 'custom', action: true, align: 'right', color: 'blue', width: '200' },
      { field: 'avg', header: 'Avg', sortable: 'custom', action: true, align: 'right', width: '100' },
      { field: 'max', header: 'Max', sortable: 'custom', action: true, align: 'right', width: '100' },
      { field: 'min', header: 'Min', sortable: 'custom', action: true, align: 'right', width: '100' }
    ];
    this.colsForPattern = [
      { field: 'pattern', header: 'Pattern', sortable: 'custom', action: true, align: 'left', width: '50' },
      { field: 'avgTime', header: 'FlowPath Avg Time (ms)', sortable: 'custom', action: true, align: 'right', width: '85' },
      { field: 'fpCount', header: 'FlowPath Count', sortable: 'custom', action: true, align: 'right', color: 'blue', width: '70' },
      { field: 'percentageFp', header: 'Percentage FlowPath', sortable: 'custom', action: true, align: 'right', width: '90' },
      { field: 'topContributor', header: 'Top Contributor', sortable: 'custom', action: true, align: 'left', width: '170' },
      { field: 'time', header: 'Time (ms)', sortable: 'custom', action: true, align: 'right', width: '60' },
      { field: 'count', header: 'Count Per Flowpath', sortable: 'custom', action: true, align: 'right', width: '100' }
    ];

    this.colsForTopMethods = [
      { field: 'pattern', header: 'OverAll', sortable: 'custom', action: true, align: 'center', width: '80', colspan: '2' },
    ];
    this.colsForTimeNCount = [
      { field: 'overallCummST', header: 'Time (ms)', sortable: 'custom', action: true, align: 'right', width: '60' },
      { field: 'overallCount', header: 'Count', sortable: 'custom', action: true, align: 'right', width: '60' }
    ];
    for (let i = 0; i < this.noOfpattern; i++) {
      this.colsForTopMethods.push(
        { field: 'pattern' + i, header: 'Pattern' + (i + 1), sortable: 'custom', action: true, align: 'center', width: '80', colspan: '2' });
      this.colsForTimeNCount.push(
        { field: 'C' + i + '_cummST', header: 'Time (ms)', sortable: 'custom', action: true, align: 'right', width: '60' });
      this.colsForTimeNCount.push(
        { field: 'C' + i + '_methodCount', header: 'Count', sortable: 'custom', action: true, align: 'right', width: '60' });
    }
    // console.log('this.colsForTopMethods---', this.colsForTopMethods)
    // console.log('this.colsForTimeNCount', this.colsForTimeNCount)
    let arr = [{ field: 'package', header: 'Package', sortable: 'custom', action: true, align: 'left', width: '120', colspan: '3' },
    { field: 'classWithMethod', header: 'Method Name', sortable: 'custom', action: true, align: 'left', width: '120', colspan: '3' }]
    this.mergeArr = arr.concat(this.colsForTimeNCount);
    // console.log('mergeArr-----', this.mergeArr);
  }

  getSignatureJsonData() {
    console.log('analyze data-------', this.commonService.fpAnalyzeData);
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfig.getActiveDC() == 'ALL') {
      //   this.ajaxUrl = this._ddrData.protocol + "://" + this.getHostUrl();
      // } else {
      this.ajaxUrl = this.getHostUrl();
      // }
      console.log("urllll formeddddd", this.ajaxUrl);
    } else {
      this.dcProtocol = this.commonService.protocol;

      if (this.commonService.protocol && this.commonService.protocol.lastIndexOf("://") != -1) {
        this.ajaxUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      } else if (this.commonService.protocol && this.commonService.protocol.length > 3) {
        this.ajaxUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      } else {
        this.ajaxUrl = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = location.protocol;
      }
    }
    if (this.commonService.enableQueryCaching == 1) {
      this.ajaxUrl += '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/FPSignature?cacheId=' + this.urlParam.testRun + '&testRun=' + this.urlParam.testRun;
    } else {
      this.ajaxUrl += '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/FPSignature?testRun=' + this.urlParam.testRun;
    }
    this.ajaxUrl += '&tierId=' + this.commonService.fpAnalyzeData.tierId +
      '&serverId=' + this.commonService.fpAnalyzeData.serverId +
      '&appId=' + this.commonService.fpAnalyzeData.appId;
    if (this.commonService.fpAnalyzeData.btCatagory !== 'extbt') {
      this.ajaxUrl += '&btcategoryId=' + this.urlParam.btCategory;
    }
    this.ajaxUrl += '&urlIndex=' + this.urlParam.urlIndex;
    this.ajaxUrl += '&strStartTime=' + this.urlParam.startTime + '&strEndTime=' + this.urlParam.endTime;
    this.ajaxUrl += '&tierName=' + this._ddrData.tierName + '&serverName=' + this._ddrData.serverName + '&appName=' + this._ddrData.appName + '&urlName=' + this._ddrData.urlName;
    console.log('final url------>', this.ajaxUrl)
    this.ddrRequest.getDataUsingGet(this.ajaxUrl).subscribe(data => (this.assignFlowpathSignatureJsonData(data)));
  }

  assignFlowpathSignatureJsonData(data: any) {
    console.log('data-----***', data);
    this.converToJSON(data);
  }

  converToJSON(data: any) {
    console.log('objlength---', data.length);
    let arr = [];
    let count = 0;
    Object.keys(data).forEach(function eachKey(key) {
      let obj = {};
      count += 1;
      obj['signature'] = 'Signature' + count;
      obj['fpIds'] = data[key]['fpinstances'];
      obj['fpCount'] = data[key]['count'];
      obj['min'] = (data[key]['min']);
      obj['max'] = (data[key]['max']);
      obj['avg'] = (data[key]['avg']);
      arr.push(obj);
    });
    this.signatureData = arr;
    this.loading = false;
  }


  /**
   * getting JSON data from server
   */
  getJsonData() {
    console.log('analyze data-------', this.commonService.fpAnalyzeData);
    let ajaxUrl = '';
    if (this.commonService.host == undefined || this.commonService.host == '' || this.commonService.host == null) {
      // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfig.getActiveDC() == 'ALL') {
      //   ajaxUrl = this._ddrData.protocol + "://" + this.getHostUrl();
      // } else {
      ajaxUrl = this.getHostUrl();
      //}
      console.log("urllll formeddddd", ajaxUrl);
    } else {
      this.dcProtocol = this.commonService.protocol;

      if (this.commonService.protocol && this.commonService.protocol.lastIndexOf("://") != -1) {
        ajaxUrl = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      } else if (this.commonService.protocol && this.commonService.protocol.length > 3) {
        ajaxUrl = this.commonService.protocol + "://" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = this.commonService.protocol;
      } else {
        ajaxUrl = location.protocol + "//" + this.commonService.host + ':' + this.commonService.port;
        this.dcProtocol = location.protocol;
      }
    }
    if (this.commonService.enableQueryCaching == 1) {
      ajaxUrl += '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/FPAnalyzerEx?cacheId=' + this.urlParam.testRun + '&testRun=' + this.urlParam.testRun;
    }
    else {
      ajaxUrl += '/' + this.urlParam.product + '/v1/cavisson/netdiagnostics/ddr/FPAnalyzerEx?testRun=' + this.urlParam.testRun;
    }
    ajaxUrl += '&tierId=' + this.commonService.fpAnalyzeData.tierId +
      '&serverId=' + this.commonService.fpAnalyzeData.serverId +
      '&appId=' + this.commonService.fpAnalyzeData.appId;
    if (this.commonService.fpAnalyzeData.btCatagory !== 'extbt') {
      ajaxUrl += '&btcategoryId=' + this.urlParam.btCategory;
    }
    ajaxUrl += '&urlIndex=' + this.urlParam.urlIndex;
    ajaxUrl += '&strStartTime=' + this.urlParam.startTime +
      '&strEndTime=' + this.urlParam.endTime +
      '&numOfPatterns=' + this.noOfpattern;
    ajaxUrl += '&tierName=' + this._ddrData.tierName + '&serverName=' + this._ddrData.serverName + '&appName=' + this._ddrData.appName + '&urlName=' + this._ddrData.urlName;
    console.log('final url------>', ajaxUrl)
    this.ddrRequest.getDataUsingGet(ajaxUrl).subscribe(data => (this.assignFlowpathAnalyzerJsonData(data)));
  }

  /**
   * converting the BT category from name to Id
   */
  getBTCategoryId(categoryId: any) {
    if (categoryId === 'Normal') {
      categoryId = 10;
    } else if (categoryId === 'Slow') {
      categoryId = 11;
    } else if (categoryId === 'Very Slow') {
      categoryId = 12;
    } else if (categoryId === 'Error') {
      categoryId = 13;
    }
    return categoryId;
  }

  /**
   * getting BT Type from ID
   */
  getBTCategory(categoryId: any) {
    if (categoryId === '10') {
      categoryId = 'Normal';
    } else if (categoryId === '11') {
      categoryId = 'Slow';
    } else if (categoryId === '12') {
      categoryId = 'Very Slow';
    } else if (categoryId === '13') {
      categoryId = 'Error';
    }
    return categoryId;
  }

  /**
   * assigning the server data to the variables
   */
  assignFlowpathAnalyzerJsonData(resData: any) {
    try {
      if (resData.clusterInfo.length !== 0) {
        this.showDownLoadReportIcon = true;
        console.log('inside this --- ', resData);
        let patternAnalyzeData = [];
        let clusterLen = resData.clusterInfo.length;

        let idxOverallCluster = clusterLen - 1;
        let overallFpCount = resData.clusterInfo[clusterLen - 1]['fpCountOverall'];
        if (overallFpCount >= 10000)
          this.showWarning = true;
        else
          this.showWarning = false;
        let overallObj = {};
        overallObj['pattern'] = 'Overall';
        overallObj['avgTime'] = resData.clusterInfo[clusterLen - 1]['AverageFPTimeOverall'];
        overallObj['fpCount'] = overallFpCount;
        overallObj['percentageFp'] = '100';
        overallObj['topContributor'] = '-';
        overallObj['fpIds'] = resData.clusterInfo[clusterLen - 1]['fpIdsOverall'];

        let totalavg = resData.clusterInfo[clusterLen - 1]['AverageFPTimeOverall'];
        let totalfp = overallFpCount;

        if (totalavg && totalfp) {
          this.patternHeader = "(Flowpath Avg Time=" + this.avgFormatter(totalavg) + "ms" + ", Flowpath Count=" + totalfp + ")";
        }

        //patternAnalyzeData.push(overallObj);
        for (let i = 0; i < clusterLen - 1; i++) {
          let obj = {};
          let fpCount = resData.clusterInfo[i]['fpCountC' + i];

          let fqm = resData.clusterInfo[i]['topContributorC' + i];
          if (fqm && fqm.indexOf('_') != -1) {                     //condition for Integrations Point appear in topContributors
            obj['topContributor'] = decodeURIComponent((fqm + '()').replace(/&#46;/g, "."));
          } else {
            let m = fqm.substring(fqm.lastIndexOf('.') + 1, fqm.length);
            let tmp = m.split('(');
            let pc = fqm.substring(0, fqm.lastIndexOf('.'));
            let cls = pc.substring(pc.lastIndexOf('.') + 1, pc.length);
            if (cls !== '') {
              obj['topContributor'] = decodeURIComponent((cls + '.' + tmp[0] + '()').replace(/&#46;/g, "."));
            } else {
              obj['topContributor'] = decodeURIComponent((tmp[0] + '()').replace(/&#46;/g, "."));
            }
          }

          obj['pattern'] = 'Pattern' + (i + 1);
          obj['avgTime'] = resData.clusterInfo[i]['AverageFPTimeC' + i];
          obj['fpCount'] = fpCount;

          obj['percentageFp'] = (parseFloat(fpCount) / parseFloat(overallFpCount) * 100).toFixed(2);
          obj['fpIds'] = resData.clusterInfo[i]['fpIdsC' + i];
          patternAnalyzeData.push(obj);
        }
        this.patternData = patternAnalyzeData;
        //console.log("this.patternData", this.patternData);
        this.topMethodData = this.topMethodsData(resData);
        this.dbCallout = this.topMethodData.filter(r => r['methodName'].indexOf('DB Callouts') != -1);
        this.numberMethods = this.topMethodData.filter(r => r['methodName'].indexOf('Number of Methods') != -1);
        this.topMethodData = this.topMethodData.filter(r =>
          r['methodName'].indexOf('DB Callouts') == -1 && r['methodName'].indexOf('Number of Methods') == -1)

        this.topMethodData.forEach((val, index) => {
          val['overallCummST'] = this.timeFormatter(val['overallCummST']);
          val['overallCount'] = this.formatter(val['overallCount']);
          for (let k = 0; k < this.noOfpattern; k++) {
            val['C' + k + '_cummST'] = this.timeFormatter(val['C' + k + '_cummST']);
            val['C' + k + '_avgST'] = this.timeFormatter(val['C' + k + '_avgST']);
            val['C' + k + '_methodCount'] = this.formatter(val['C' + k + '_methodCount']);
          }
        })
        //console.log("now this.topMethodDat ",this.topMethodData)
        for (var i = 0; i < this.patternData.length; i++) {
          if (this.dbCallout) {
            console.log("this.dbCallout", this.dbCallout, i);
            this.patternData[i]['dbCallout'] = this.formatter(this.dbCallout[0]['C' + i + '_cummST']);
            if (i == 0) {
              this.colsForPattern.push({ field: 'dbCallout', header: 'DB Callouts', sortable: 'custom', action: true, align: 'right', width: '100' })
            }
          }
          if (this.numberMethods) {
            this.patternData[i]['numberMethods'] = this.timeFormatter(this.numberMethods[0]['C' + i + '_cummST']);
            if (i == 0) {
              this.colsForPattern.push({ field: 'numberMethods', header: 'Number of Methods', sortable: 'custom', action: true, align: 'right', width: '150' })
            }
          }
          if (this.patternData[i]['pattern'] === 'Overall') {
            this.patternData[i]['time'] = '-';
            this.patternData[i]['count'] = '-';
          }
          var topC = this.patternData[i].topContributor;
          for (var j = 0; j < this.topMethodData.length; j++) {
            //console.log("this.topM", this.topMethodData.length);
            if (topC.indexOf("DB Callouts") != -1) {
              this.patternData[i]['time'] = this.dbCallout[0]['C' + (i) + '_cummST'];
              this.patternData[i]['count'] = this.dbCallout[0]['C' + (i) + '_methodCount'];
            }
            else if (topC === this.topMethodData[j]['classWithMethod']) {
              this.patternData[i]['time'] = this.topMethodData[j]['C' + (i) + '_cummST'];
              this.patternData[i]['count'] = this.topMethodData[j]['C' + (i) + '_methodCount'];
              console.log('this.patternData', this.patternData[i]['time'], this.patternData[i]['count']);
            }
          }
        }
        this.timeData = resData.timePeriod;
        this.createChart(this.patternData);
        this.loading1 = false;
        this.loading = false;
      } else {
        this.loading1 = false;
        this.loading = false;
      }
    } catch (error) {
      console.log('Error-->', error);
    }

  }

  /**
   * modifying the second table data from server data
   */

  topMethodsData(data: any) {
    let jsonData = data.data;
    let clusterLen = data.clusterInfo.length;
    let tmpData = [...jsonData];
    tmpData = tmpData.filter(r => r['methodName'] !== '_cavissionMetric_Status');
    tmpData.forEach((value, index) => {
      if (value.methodName) {
        console.log("methodName=", value['methodName']);
        //let fqm = decodeURIComponent((value.methodName).replace(/&#46;/g, "."));
        let fqm = value.methodName;
        if (fqm && fqm.indexOf('_') != -1) {                     //condition for decoding Integration Point methodName in TopMethodData
          value['classWithMethod'] = decodeURIComponent((fqm + '()').replace(/&#46;/g, "."));
          value['package'] = '';
          //console.log("Method Name", value['classWithMethod']);
          //console.log("Package", value['package']);
        } else {
          let m = fqm.substring(fqm.lastIndexOf('.') + 1, fqm.length);
          let tmp = m.split('(');
          let pc = fqm.substring(0, fqm.lastIndexOf('.'));
          let cls = pc.substring(pc.lastIndexOf('.') + 1, pc.length);
          value['package'] = pc.substring(0, pc.lastIndexOf('.'));
          if (cls !== '') {
            value['classWithMethod'] = cls + '.' + tmp[0] + '()';
          } else {
            value['classWithMethod'] = tmp[0] + '()';
          }
          //console.log("Method Name", value['classWithMethod']);
          //console.log("Package", value['package']);
        }
      }
    });
    return tmpData;
  }

  timeFormatter(countData) {
    let numStr = parseFloat(parseFloat(countData).toFixed(0)).toLocaleString();
    return numStr;
  }

  formatter(value) {
    let numStr = parseFloat(parseFloat(value).toFixed(1)).toLocaleString();
    return numStr;
  }

  avgFormatter(value: any) {
    let numStr = parseFloat(parseFloat(value).toFixed()).toLocaleString('en-IN');
    return numStr;
  }

  commaFormatter(data: any) {
    if (Number(data) && Number(data) > 0) {
      return Number(data).toLocaleString();
    } else {
      return data;
    }
  }

  /**
   * creating Pie-Cahrt and Bar-Chart
   */

  createChart(piData: any) {
    let pieArr = [];
    let barArr = [];
    if (piData.length !== 0) {
      for (let i = 0; i < piData.length; i++) {
        if (piData[i].topContributor !== '-') {
          pieArr.push({
            'name': piData[i].topContributor, 'y': Number(piData[i].percentageFp), 'z': piData[i].pattern,
            'time': piData[i].time, 'count': piData[i].count
          });
        }
      }
    }
    console.log('piArr---', pieArr);
    if (piData.length !== 0) {
      for (let i = 0; i < piData.length; i++) {
        if (piData[i].topContributor !== '-') {
          barArr.push({ 'name': piData[i].pattern, 'y': Number(piData[i].fpCount) });
        }
      }
    }
    this.options = {
      chart: {
        type: 'pie',
      },
      credits: {
        enabled: false
      },
      title: { text: 'Top Contributors', style: { 'fontSize': '13px' } },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>, <br/> Pattern: <b>{point.z}<\b>,<br/>Time: <b>{point.time}</b>,<br/>Count: <b>{point.count}</b>'
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          allowPointSelect: true,
          dataLabels: {
            enabled: true,
            format: '<b> {point.name} </b>: {point.percentage:.2f} %',
          },
          borderWidth: 0
        }
      },
      series: [
        {
          name: 'Percentage',
          data: pieArr,
          enableMouseTracking: true
        }
      ]
    };


    this.options1 = {
      chart: {
        type: 'column'
      },
      title: { text: 'Pattern Flowpath Count', style: { 'fontSize': '13px' } },
      credits: {
        enabled: false
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        crosshair: true,
        labels:
        {
          enabled: false
        },
        title: {
          text: ' '
        }
      },
      yAxis: {
        min: 0,
        allowDecimals: false,
        title: {
          text: 'Flowpath Count'
        }
      },
      tooltip: {
        headerFormat: '<table><tr><td style="padding:0">Pattern:</td>' +
          '<td style="padding:0"><b>{point.key}</b></td></tr>',
        pointFormat: '<tr><td style="padding:0">Flowpaths: </td>' +
          '<td style="padding:0"><b>{point.y}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions1: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          name: 'Pattern',
          enableMouseTracking: true,
          data: barArr,
          colorByPoint: true,
          pointWidth: 25
        }],

    }
  }

  clickHandler(event) {

  }
  /**
    * onsort function
    */
  sortEvent(event) {
    this.commonService.sortedField = event.field;
    this.commonService.sortedOrder = event.order;
  }
  // Custom Sorting Function
  sortColumnsOnCustom(event, tempData) {
    // console.log(event)
    if (event["field"] == "pattern" || event["field"] == "topContributor") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          var v1 = a[temp];
          var v2 = b[temp];
          let value;
          let value2;
          v1 = v1.replace(reA, "");
          v2 = v2.replace(reA, "");
          if (v1 === v2) {
            value = parseInt(a[temp].replace(reN, ""), 10);
            value2 = parseInt(b[temp].replace(reN, ""), 10);
            // value =  parseFloat(a[temp].replace(/,/g, ''));
            // value2 = parseFloat(b[temp].replace(/,/g, ''));
            return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
          } else {
            value = a[temp];
            value2 = b[temp];
            return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
          }
        });
      } else {
        var temp = (event["field"]);
        event.order = -1
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          let v1 = a[temp];
          let v2 = b[temp];
          let value;
          let value2;
          v1 = v1.replace(reA, "");
          v2 = v2.replace(reA, "");
          if (v1 === v2) {
            value = parseInt(a[temp].toString().replace(reN, ""), 10);
            value2 = parseInt(b[temp].toString().replace(reN, ""), 10);
            // value =  parseFloat(a[temp].replace(/,/g, ''));
            // value2 = parseFloat(b[temp].replace(/,/g, ''));
            return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
          } else {
            value = a[temp];
            value2 = b[temp];
            return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
          }
        });
      }
    }
    else {
      let fieldValue = event["field"];
      if (event.order == -1) {
        event.order = 1
        tempData = tempData.sort(function (a, b) {
          var value = parseFloat(a[fieldValue].replace('-', 0));
          var value2 = parseFloat(b[fieldValue].replace('-', 0));
          value = parseFloat(a[fieldValue].replace(/,/g, ''));
          value2 = parseFloat(b[fieldValue].replace(/,/g, ''));
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        event.order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          var value = parseFloat(a[fieldValue].replace('-', 0));
          var value2 = parseFloat(b[fieldValue].replace('-', 0));
          value = parseFloat(a[fieldValue].replace(/,/g, ''));
          value2 = parseFloat(b[fieldValue].replace(/,/g, ''));
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }
    this.patternData = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.patternData = this.Immutablepush(this.patternData, rowdata) });
    }
  }

  sortColumnsOnCustomSig(event, tempData) {
    // console.log(event)
    if (event["field"] == "signature") {
      if (event.order == -1) {
        var temp = (event["field"]);
        event.order = 1
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          var v1 = a[temp];
          var v2 = b[temp];
          let value;
          let value2;
          v1 = v1.replace(reA, "");
          v2 = v2.replace(reA, "");
          if (v1 === v2) {
            value = parseInt(a[temp].replace(reN, ""), 10);
            value2 = parseInt(b[temp].replace(reN, ""), 10);
            // value =  parseFloat(a[temp].replace(/,/g, ''));
            // value2 = parseFloat(b[temp].replace(/,/g, ''));
            return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
          } else {
            value = a[temp];
            value2 = b[temp];
            return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
          }
        });
      } else {
        var temp = (event["field"]);
        event.order = -1
        var reA = /[^a-zA-Z]/g;
        var reN = /[^0-9]/g;
        tempData = tempData.sort(function (a, b) {
          let v1 = a[temp];
          let v2 = b[temp];
          let value;
          let value2;
          v1 = v1.replace(reA, "");
          v2 = v2.replace(reA, "");
          if (v1 === v2) {
            value = parseInt(a[temp].toString().replace(reN, ""), 10);
            value2 = parseInt(b[temp].toString().replace(reN, ""), 10);
            // value =  parseFloat(a[temp].replace(/,/g, ''));
            // value2 = parseFloat(b[temp].replace(/,/g, ''));
            return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
          } else {
            value = a[temp];
            value2 = b[temp];
            return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
          }
        });
      }
    }
    else {
      let fieldValue = event["field"];
      if (event.order == -1) {
        event.order = 1
        tempData = tempData.sort(function (a, b) {
          var value = parseFloat(a[fieldValue].replace('-', 0));
          var value2 = parseFloat(b[fieldValue].replace('-', 0));
          value = parseFloat(a[fieldValue].replace(/,/g, ''));
          value2 = parseFloat(b[fieldValue].replace(/,/g, ''));
          return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
        });
      }
      else {
        event.order = -1;
        //asecding order
        tempData = tempData.sort(function (a, b) {
          var value = parseFloat(a[fieldValue].replace('-', 0));
          var value2 = parseFloat(b[fieldValue].replace('-', 0));
          value = parseFloat(a[fieldValue].replace(/,/g, ''));
          value2 = parseFloat(b[fieldValue].replace(/,/g, ''));
          return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
        });
      }
    }

    this.signatureData = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.signatureData = this.Immutablepush(this.signatureData, rowdata) });
    }
  }


  sortColumnsOnCustom2(event, tempData) {
    // console.log(event)
    let fieldValue = event["field"];
    if (event.order == -1) {
      event.order = 1
      tempData = tempData.sort(function (a, b) {
        var value = parseFloat(a[fieldValue].replace('-', 0));
        var value2 = parseFloat(b[fieldValue].replace('-', 0));
        value = parseFloat(a[fieldValue].replace(/,/g, ''));
        value2 = parseFloat(b[fieldValue].replace(/,/g, ''));
        return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
      });
    }
    else {
      event.order = -1;
      //asecding order
      tempData = tempData.sort(function (a, b) {
        var value = parseFloat(a[fieldValue].replace('-', 0));
        var value2 = parseFloat(b[fieldValue].replace('-', 0));
        value = parseFloat(a[fieldValue].replace(/,/g, ''));
        value2 = parseFloat(b[fieldValue].replace(/,/g, ''));
        return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
      });
    }
    this.topMethodData = [];
    //console.log(JSON.stringify(tempData));
    if (tempData) {
      tempData.map((rowdata) => { this.topMethodData = this.Immutablepush(this.topMethodData, rowdata) });
    }
  }


  Immutablepush(arr, newEntry) {
    return [...arr, newEntry]
  }

  openFPSignatureReport(node) {
    console.log('node data---', node);
    let obj = {};
    obj['tierName'] = this.urlParam.tierName;
    obj['tierId'] = this.urlParam.tierId;
    obj['serverName'] = this.urlParam.serverName;
    obj['serverId'] = this.urlParam.serverId;
    obj['appName'] = this.urlParam.appName;
    obj['appId'] = this.urlParam.appId;
    obj['btName'] = this.urlParam.btName;
    obj['urlIndex'] = this.urlParam.urlIndex;
    obj['fpIds'] = node.fpIds;
    obj['fpCount'] = node.fpCount;
    console.log('flowpath object---->', obj);
    let cmdArgs1 = ' --testrun ' + this.urlParam.testRun;

    if (this.urlParam.tierId !== '' && this.urlParam.tierId !== 'NA' && this.urlParam.tierId !== 'undefined'
      && this.urlParam.tierId !== undefined) {
      cmdArgs1 += ' --tierid ' + + this.urlParam.tierId;
    }
    if (this.urlParam.serverId !== '' && this.urlParam.serverId !== 'NA' && this.urlParam.serverId !== 'undefined'
      && this.urlParam.serverId !== undefined) {
      cmdArgs1 += ' --serverid ' + this.urlParam.serverId;
    }
    if (this.urlParam.appId !== '' && this.urlParam.appId !== 'NA' && this.urlParam.appId !== 'undefined'
      && this.urlParam.appId !== undefined) {
      cmdArgs1 += ' --appid ' + this.urlParam.appId;
    }
    if (node.fpIds !== '' && node.fpIds !== 'NA' && node.fpIds !== 'undefined' && node.fpIds !== undefined) {
      cmdArgs1 += ' --fpinstance ' + node.fpIds;
    }
    if (this.urlParam.startTime !== '' && this.urlParam.startTime !== 'NA' && this.urlParam.startTime !== 'undefined'
      && this.urlParam.startTime !== undefined) {
      cmdArgs1 += ' --abs_starttime ' + this.urlParam.startTime;
    }
    if (this.urlParam.endTime !== '' && this.urlParam.endTime !== 'NA' && this.urlParam.endTime !== 'undefined'
      && this.urlParam.endTime !== undefined) {
      cmdArgs1 += ' --abs_endtime ' + this.urlParam.endTime;
    }
    cmdArgs1 += ' --status -2';
    // console.log('commandArgs-------->', cmdArgs1)
    obj['cmdArgs'] = cmdArgs1;
    obj['btName'] = this.urlParam.urlName;
    obj['testRun'] = this.urlParam.testRun;
    obj['startTime'] = this.urlParam.startTime;
    obj['endTime'] = this.urlParam.endTime;
    obj['btCatagory'] = this.commonService.fpAnalyzeData.btCatagory;
    this._ddrData.cmdArgsFlag = true;
    // this.commonService.flowpathCmdArgs = cmdArgs1;
    this.commonService.fpAnalyzeData = obj;
    console.log(' **************', this.commonService.fpAnalyzeData);
    this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FPANALYZER;
    if (this._router.url.indexOf('/home/ddrCopyLink/') !== -1) {
      this._router.navigate(['/home/ddrCopyLink/flowpath']);
    } else {
      this._router.navigate(['/ddr/flowpath']);
    }
  }
  /**
   * open Flowpaths Report
   */

  openFPReport(rowData: any) {
    try {
      // console.log('rowData----->', rowData);
      let obj = rowData;
      obj['tierName'] = this.urlParam.tierName;
      obj['tierId'] = this.urlParam.tierId;
      obj['serverName'] = this.urlParam.serverName;
      obj['serverId'] = this.urlParam.serverId;
      obj['appName'] = this.urlParam.appName;
      obj['appId'] = this.urlParam.appId;
      obj['btName'] = this.urlParam.btName;
      obj['urlIndex'] = this.urlParam.urlIndex;
      obj['fpIds'] = rowData.fpIds;
      // console.log('flowpath object---->', obj);
      let cmdArgs1 = ' --testrun ' + this.urlParam.testRun;

      if (this.urlParam.tierId !== '' && this.urlParam.tierId !== 'NA' && this.urlParam.tierId !== 'undefined'
        && this.urlParam.tierId !== undefined) {
        cmdArgs1 += ' --tierid ' + + this.urlParam.tierId;
      }
      if (this.urlParam.serverId !== '' && this.urlParam.serverId !== 'NA' && this.urlParam.serverId !== 'undefined'
        && this.urlParam.serverId !== undefined) {
        cmdArgs1 += ' --serverid ' + this.urlParam.serverId;
      }
      if (this.urlParam.appId !== '' && this.urlParam.appId !== 'NA' && this.urlParam.appId !== 'undefined'
        && this.urlParam.appId !== undefined) {
        cmdArgs1 += ' --appid ' + this.urlParam.appId;
      }
      if (rowData.fpIds !== '' && rowData.fpIds !== 'NA' && rowData.fpIds !== 'undefined' && rowData.fpIds !== undefined) {
        cmdArgs1 += ' --fpinstance ' + rowData.fpIds;
      }
      if (this.urlParam.startTime !== '' && this.urlParam.startTime !== 'NA' && this.urlParam.startTime !== 'undefined'
        && this.urlParam.startTime !== undefined) {
        cmdArgs1 += ' --abs_starttime ' + this.urlParam.startTime;
      }
      if (this.urlParam.endTime !== '' && this.urlParam.endTime !== 'NA' && this.urlParam.endTime !== 'undefined'
        && this.urlParam.endTime !== undefined) {
        cmdArgs1 += ' --abs_endtime ' + this.urlParam.endTime;
      }
      cmdArgs1 += ' --status -2';
      // console.log('commandArgs-------->', cmdArgs1)
      obj['cmdArgs'] = cmdArgs1;
      obj['btName'] = this.urlParam.urlName;
      obj['testRun'] = this.urlParam.testRun;
      obj['btCatagory'] = this.commonService.fpAnalyzeData.btCatagory;
      obj['startTime'] = this.urlParam.startTime;
      obj['endTime'] = this.urlParam.endTime;
      this._ddrData.cmdArgsFlag = true;
      // this.commonService.flowpathCmdArgs = cmdArgs1;
      this.commonService.fpAnalyzeData = obj;
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.FPANALYZER;
      if (this._router.url.indexOf('/home/ddrCopyLink/') !== -1) {
        this._router.navigate(['/home/ddrCopyLink/flowpath']);
      } else {
        this._router.navigate(['/ddr/flowpath']);
      }
    } catch (error) {
      console.log('Error while opening Flowpath report:-', error);
    }
  }

  /**
   * Download Report
   */

  downloadReports(type: any) {
    try {
      let renameArrayForPattern = {};
      let colOrderForpattern = [];
      let renameArrayForTopMethods = {};
      let colOrderForTopMethods = [];
      let renameArrayForSignature = {};
      let colOrderForSignature = [];

      renameArrayForPattern = {
        'pattern': 'Pattern', 'avgTime': 'Flowpath Avg Time(ms)', 'fpCount': 'Flowpath Count',
        'percentageFp': 'Percentage Flowpath', 'topContributor': 'Top Contributor', 'time': 'Time', 'count': 'Count Per Flowpath'
      };

      colOrderForpattern = ['Pattern', 'Flowpath Avg Time(ms)', 'Flowpath Count', 'Percentage Flowpath', 'Top Contributor', 'Time', 'Count Per Flowpath'];

      if (this.dbCallout) {
        renameArrayForPattern['dbCallout'] = 'DB Callouts';
        colOrderForpattern.push('DB Callouts');
      }

      if (this.numberMethods) {
        renameArrayForPattern['numberMethods'] = 'Number of Methods';
        colOrderForpattern.push('Number of Methods');
      }

      renameArrayForTopMethods = {
        'package': 'Package', 'classWithMethod': 'Method Name', 'overallCummST': 'Overall Cummulative Self Time',
        'overallCount': 'Overall Count'
      };

      colOrderForTopMethods = ['Package', 'Method Name', 'Overall Cummulative Self Time', 'Overall Count'];
      if (this.noOfpattern > 0) {
        for (let i = 0; i < this.noOfpattern; i++) {
          renameArrayForTopMethods['C' + i + '_cummST'] = 'Pattern' + (i + 1) + 'Cumulative Self Time(ms)';
          renameArrayForTopMethods['C' + i + '_avgST'] = 'Pattern' + (i + 1) + 'Average Self Time(ms)';
          renameArrayForTopMethods['C' + i + '_methodCount'] = 'Pattern' + (i + 1) + 'MethodCount';
          colOrderForTopMethods.push('Pattern' + (i + 1) + 'Cumulative Self Time(ms)');
          colOrderForTopMethods.push('Pattern' + (i + 1) + 'Average Self Time(ms)');
          colOrderForTopMethods.push('Pattern' + (i + 1) + 'MethodCount');
        }
        // console.log('param--------->', renameArrayForTopMethods)
        // console.log('param--------->', colOrderForTopMethods)
        // console.log('param--------->', renameArrayForPattern)
        // console.log('param--------->', colOrderForpattern)
        // console.log('table data1----', this.patternData)
        // console.log('table data2----', this.topMethodData)

        renameArrayForSignature = {
          'signature': 'Signature', 'fpCount': 'Flowpath Count', 'avg': 'Avg', 'max': 'Max', 'min': 'Min'
        };

        colOrderForSignature = ['Signature', 'Flowpath Count', 'Avg', 'Max', 'Min'];
        let tempSignatureData = JSON.parse(JSON.stringify(this.signatureData));
        tempSignatureData.forEach((val, index) => {
          delete val['fpIds'];
          delete val['$visited'];

          if (val['avg'])
            val['avg'] = this.avgFormatter(val['avg']);
        })

        let tempPatternData = JSON.parse(JSON.stringify(this.patternData));
        tempPatternData.forEach((val, index) => {
          delete val['fpIds'];
          if (val['avgTime'])
            val['avgTime'] = this.avgFormatter(val['avgTime']);
        })

        this.topMethodData.forEach((val, index) => {
          delete val['methodName'];
        });

        // let jsonData1 = LZString.compressToEncodedURIComponent(JSON.stringify(this.patternData));
        // let jsonData2 = LZString.compressToEncodedURIComponent(JSON.stringify(this.topMethodData));

        let downloadObj: Object = {
          downloadType: type,
          varFilterCriteria: this.donwloadFilterCriteria,
          strSrcFileName: 'Flowpath Analyzer',
          strRptTitle: 'Flowpath Analyzer - Test Run Number: ' + this.urlParam.testRun,
          renameArray1: JSON.stringify(renameArrayForSignature),
          colOrder1: colOrderForSignature.toString(),
          tableData1: JSON.stringify(tempSignatureData),
          renameArray2: JSON.stringify(renameArrayForPattern),
          colOrder2: colOrderForpattern.toString(),
          tableData2: JSON.stringify(tempPatternData),
          renameArray3: JSON.stringify(renameArrayForTopMethods),
          colOrder3: colOrderForTopMethods.toString(),
          tableData3: JSON.stringify(this.topMethodData)

        }
        let downloadFileUrl = '';
        if (this.host !== undefined && this.host !== '' && this.host !== null) {
          downloadFileUrl = this.protocol + this.host + ':' + this.port + '/' + this.urlParam.product;
        } else {
          downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.urlParam.product);
        }
        if (this.commonService.host !== undefined && this.commonService.host !== '' && this.commonService.host != null) {
          downloadFileUrl = this.commonService.protocol + this.commonService.host + ':' +
            this.commonService.port + '/' + this.urlParam.product;
        } else {
          downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.urlParam.product.replace("/", ""));
        }
        downloadFileUrl += '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
        console.log('downloadFileUrl---', downloadFileUrl);
        if (sessionStorage.getItem("isMultiDCMode") == "true" && (downloadFileUrl.includes("/tomcat") || downloadFileUrl.includes("/node"))) {
          this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, (downloadObj)).subscribe(res =>
            (this.openDownloadReports(res)));
        }
        else {
          this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
            (this.openDownloadReports(res)));
        }
      }
    } catch (error) {
      console.log('Exception--', error);
    }
  }

  /**
   *  assigning the download file
   */
  openDownloadReports(res: any) {
    let url = '';
    if (this.commonService.host !== undefined && this.commonService.host !== '' && this.commonService.host != null) {
      url = this.commonService.protocol + this.commonService.host + ':' + this.commonService.port;
    } else {
      url = decodeURIComponent(this.getHostUrl(true));
    }
    url += '/common/' + res;
    window.open(url);
  }

  encodeHTMLStr(str: any) {
    let returnString = '';
    if (str !== null && str !== '') {
      returnString = str.toString().replaceAll('&#044;', ',').replaceAll("&#58;", ":").replaceAll("&#46;", ".").replaceAll("&#010", "\n").replaceAll("&#039;", "\'").replaceAll("&#034;", "\"").replaceAll("&#092;", "\\").replaceAll("&#124;", "|").replaceAll("&#123;", "{").replaceAll("&#125;", "}").replaceAll("&#126;", "~").replaceAll("&#11", "").replaceAll("&#12", "");
    }
    return returnString;
  }


}

export interface FPAnalyzeInterface {
  pattern: string;
  avgTime: string;
  fpCount: string;
  percentageFp: string;
  topContributor: string;
  fpIds: string;
  time: string;
  count: string;
}
