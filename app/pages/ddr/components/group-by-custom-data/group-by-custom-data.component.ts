import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
// import { DataTableModule, BlockUIModule, MultiSelectModule, GrowlModule } from 'primeng/primeng';
import { CommonServices } from '../../services/common.services';
//import 'rxjs/Rx';
// import { ChartModule } from 'angular2-highcharts';
import { SelectItem } from '../../interfaces/selectitem';
import { CavTopPanelNavigationService } from '../../../tools/configuration/nd-config/services/cav-top-panel-navigation.service';
import { Router } from '@angular/router';
import { CavConfigService } from '../../../tools/configuration/nd-config/services/cav-config.service';
import { DdrTxnFlowmapDataService } from './../../services/ddr-txn-flowmap-data.service';
import { DdrDataModelService } from '../../../tools/actions/dumps/service/ddr-data-model.service';
import { DdrBreadcrumbService } from './../../services/ddr-breadcrumb.service';
import * as  CONSTANTS from './../../constants/breadcrumb.constants';
import { Message } from 'primeng/api'
// import { forEach } from '@angular/router/src/utils/collection';
import { DDRRequestService } from '../../services/ddr-request.service';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-group-by-custom-data',
  templateUrl: './group-by-custom-data.component.html',
  styleUrls: ['./group-by-custom-data.component.css']
})
export class GroupByCustomDataComponent implements OnInit {
  highcharts = Highcharts;
  loading = false;
  id: any;
  dataValue: any[] = [];
  dataValue1: any[] = [];
  btCols: any;
  cols: any;
  visibleCols: any[];
  visibleCols1: any[];
  columnOptions: SelectItem[];
  columnOptions1: SelectItem[];
  urlParam: any;
  filterCriteria = '';
  showChart = false;
  showBarChart = false;
  chartData = [];
  options: Object;
  options1: Object;
  btUrl: any;
  CustomUrl: any;
  strTitle: any;
  screenHeight: any;
  countFlag = false;
  commonColumns = [];
  prevColumn;
  prevColumn1;
  CustomTable: any;
  showDownLoadReportIcon = true;
  showDownLoadReportIcon1 = true;
  showAllOption = false;
  paginationFlag = true;
  customTotalCount: any;
  customOffset = 0;
  customLimit = 50;
  msgs: Message[] = [];
  aggData: any;
  tooltipArr = [];
  host: any;
  protocol: any;
  port: any;
  customOptions = [];
  constructor(private _router: Router,
    private _ddrData: DdrDataModelService,
    private commonService: CommonServices,
    private _navService: CavTopPanelNavigationService,
    private _cavConfig: CavConfigService,
    private _cavConfigService: CavConfigService,
    private breadcrumbService: DdrBreadcrumbService,
    private ddrRequest:DDRRequestService) { }

  ngOnInit() {
    this.loading = true;
    this.breadcrumbService.setBreadcrumbs(CONSTANTS.BREADCRUMB_ITEMS.BTSPLITTING);
    this.commonService.isToLoadSideBar = false ;
    this.commonService.isFilterFromSideBar =false;
    this.urlParam = this.commonService.getData();
    console.log('commonService data----->', this.urlParam);
    this.screenHeight = Number(this.commonService.screenHeight) - 120;
    if ( this.urlParam.customOptions.indexOf(',') !== -1 ) {
      console.log('*********true**********');
      this.customOptions = this.urlParam.customOptions.split(',');
    } else {
      this.customOptions = this._ddrData.customOptions;
    }
    console.log('data options*******', this._ddrData.customOptions, this.urlParam.customOptions, this.customOptions);
    this.fillData();
    this.fillDataForCustomData();
    this.createFilterCriteria();
    this.getTableData();
    this.getTableDataCount();
    this.strTitle = 'Custom Data By BT Splitting';
    this.CustomTable = 'Tabular View [Group By = ' + this.customOptions + ']';
  }


  createFilterCriteria() {
    if(sessionStorage.getItem("isMultiDCMode")=="true")
    {
     let dcName = this._cavConfigService.getActiveDC();
     if(dcName == "ALL")
       dcName = this._ddrData.dcName;
       this.filterCriteria = 'DC=' + dcName + ', ';
    }
    if (this.urlParam.tierName !== 'NA' && this.urlParam.tierName !== '' && this.urlParam.tierName !== undefined &&
      this.urlParam.tierName !== null) {
      this.filterCriteria += 'Tier=' + this.urlParam.tierName;
    }

    if (this.urlParam.serverName !== 'NA' && this.urlParam.serverName !== '' && this.urlParam.serverName !== undefined &&
      this.urlParam.serverName !== null) {
      this.filterCriteria += ', Server=' + this.urlParam.serverName;
    }
    if (this.urlParam.appName !== 'NA' && this.urlParam.appName !== '' && this.urlParam.appName !== undefined &&
      this.urlParam.appName !== null) {
      this.filterCriteria += ', Instance=' + this.urlParam.appName;
    }
    if (this.urlParam.startTimeInDateFormat !== 'NA' && this.urlParam.startTimeInDateFormat !== '' &&
      this.urlParam.startTimeInDateFormat !== undefined) {
      this.filterCriteria += ', StartTime=' + this.urlParam.startTimeInDateFormat;
    }
    if (this.urlParam.endTimeInDateFormat !== 'NA' && this.urlParam.endTimeInDateFormat !== '' &&
      this.urlParam.endTimeInDateFormat !== undefined) {
      this.filterCriteria += ', EndTime=' + this.urlParam.endTimeInDateFormat;
    }
    if (this.urlParam.urlName !== 'NA' && this.urlParam.urlName !== '' &&
      this.urlParam.urlName !== undefined) {
      this.filterCriteria += ', BT=' + this.urlParam.urlName;
    }

  }

  fillData() {
    let bt = [
      { field: 'BusinesTransaction', header: 'BusinessTransaction', sortable: true, action: true, tooltip: 'BusinessTransaction'}];
    this.commonColumns = [
      { field: 'TotalOverallCount', header: 'Overall', sortable: 'custom', action: true,  tooltip: 'Total Overall Count' },
      { field: 'TotalOverAllDur', header: 'Sum', sortable: 'custom', action: false, tooltip: 'Total OverAll Duration (ms)' },
      { field: 'MinOverallDur', header: 'Min', sortable: 'custom', action: false, tooltip: 'Min Overall Dur (ms)' },
      { field: 'MaxOverallDur', header: 'Max', sortable: 'custom', action: true, tooltip: 'Max Overall Duration (ms)' },
      { field: 'AvgOverallDur', header: 'Avg', sortable: 'custom', action: true, tooltip: 'Avg Overall Dur (ms)' },
      { field: 'TotalNormalCount', header: 'Normal', sortable: 'custom', action: true, tooltip: 'Total Normal Count' },
      { field: 'TotalNormalCountPct', header: 'Normal %', sortable: 'custom', action: true, tooltip: 'Normal Percentage' },
      { field: 'TotalNormalDur', header: 'Sum', sortable: 'custom', action: false, tooltip: 'Total Normal Duration (ms)' },
      { field: 'MinNormalDur', header: 'Min', sortable: 'custom', action: false, tooltip: 'Min Normal Duration (ms)' },
      { field: 'MaxNormalDur', header: 'Max', sortable: 'custom', action: true, tooltip: 'Max Normal Duration (ms)' },
      { field: 'AvgNormalDur', header: 'Avg', sortable: 'custom', action: true, tooltip: 'Avg Normal Duration (ms)' },
      { field: 'TotalSlowCount', header: 'Slow', sortable: 'custom', action: true, tooltip: 'Total Slow Count' },
      { field: 'TotalSlowCountPct', header: 'Slow %', sortable: 'custom', action: true, tooltip: 'Slow Percentage' },
      { field: 'TotalSlowDur', header: 'Sum', sortable: 'custom', action: false, tooltip:'Total Slow Duration (ms)' },
      { field: 'MinSlowDur', header: 'Min', sortable: 'custom', action: false, tooltip: 'Min Slow Duration (ms)' },
      { field: 'MaxSlowDur', header: 'Max', sortable: 'custom', action: true, tooltip: 'Max Slow Duration (ms)' },
      { field: 'AvgSlowDur', header: 'Avg', sortable: 'custom', action: true, tooltip: 'Avg Slow Duration (ms)' },
      { field: 'TotalVerySlowCount', header: 'VerySlow', sortable: 'custom', action: true, tooltip: 'Total Very Slow Count' },
      { field: 'TotalVerySlowCountPct', header: 'VerySlow %', sortable: 'custom', action: true, tooltip: 'Very Slow Percentage' },
      { field: 'TotalVerySlowDur', header: 'Sum', sortable: 'custom', action: false, tooltip: 'Total Very Slow Duration (ms)' },
      { field: 'MinVerySlowDur', header: 'Min', sortable: 'custom', action: false, tooltip: 'Min VerySlow Duration (ms)' },
      { field: 'MaxVerySlowDur', header: 'Max', sortable: 'custom', action: true, tooltip: 'Max VerySlow Duration (ms)' },
      { field: 'AvgVerySlowDur', header: 'Avg', sortable: 'custom', action: true, tooltip: 'Avg Very Slow Duration (ms)'},
      { field: 'TotalErrorCount', header: 'Error)', sortable: 'custom', action: true, tooltip: 'Total Error Count' },
      { field: 'TotalErrorCountPct', header: 'Error %', sortable: 'custom', action: true, tooltip: 'Error Percentage' },
      { field: 'TotalErrorDur', header: 'Sum', sortable: 'custom', action: false, tooltip: 'Total Error Duration (ms)' },
      { field: 'MinErrorDur', header: 'Min', sortable: 'custom', action: false, tooltip: 'Min Error Duration (ms)' },
      { field: 'MaxErrorDur', header: 'Max', sortable: 'custom', action: true, tooltip: 'Max Error Duration' },
      { field: 'AvgErrorDur', header: 'Avg', sortable: 'custom', action: true, tooltip: 'Avg Error Duration (ms)'  }
    ];
    this.btCols = bt.concat(this.commonColumns);
    console.log('bt columns------>', this.btCols);
    this.visibleCols = [
      'BusinesTransaction', 'TotalOverallCount', 'MaxOverallDur', 'AvgOverallDur', 'TotalNormalCount', 'TotalNormalCountPct',
      'MaxNormalDur', 'AvgNormalDur', 'TotalSlowCount', 'TotalSlowCountPct', 'MaxSlowDur', 'AvgSlowDur', 'TotalVerySlowCount',
      'TotalVerySlowCountPct', 'MaxVerySlowDur', 'AvgVerySlowDur', 'TotalErrorCount', 'TotalErrorCountPct', 'MaxErrorDur',
      'AvgErrorDur'
    ];
    this.columnOptions = [];
    for (let i = 0; i < this.btCols.length; i++) {
      this.columnOptions.push({ label: this.btCols[i].header, value: this.btCols[i].field });
    }
    console.log('column options', this.columnOptions);
  }

  fillDataForCustomData() {
    try {
      let custom = [];
      let bt = [
        { field: 'BusinesTransaction', header: 'BusinessTransaction', sortable: true, action: true }
      ];
      console.log('columnotions----***>', this.customOptions, this.customOptions.length)
      for (let i = 0; i < this.customOptions.length; i++) {
        custom.push(
          { field: this.customOptions[i], header: this.customOptions[i], sortable: true, action: true, tooltip: this.customOptions[i] }
          );
      }
      let mergeArray = bt.concat(custom);
      this.cols = mergeArray.concat(this.commonColumns);
      let btCol = ['BusinesTransaction'];
      let merge = btCol.concat(this.customOptions);
      console.log('mergerss**********', merge, this.customOptions.length);
      this.visibleCols1 = merge.concat([
        'TotalOverallCount', 'MaxOverallDur', 'AvgOverallDur', 'TotalNormalCount', 'TotalNormalCountPct', 'MaxNormalDur',
        'AvgNormalDur', 'TotalSlowCount', 'TotalSlowCountPct', 'MaxSlowDur', 'AvgSlowDur', 'TotalVerySlowCount',
        'TotalVerySlowCountPct', 'MaxVerySlowDur', 'AvgVerySlowDur', 'TotalErrorCount', 'TotalErrorCountPct', 'MaxErrorDur',
        'AvgErrorDur'
      ]);

      this.columnOptions1 = [];
      for (let i = 0; i < this.cols.length; i++) {
        this.columnOptions1.push({ label: this.cols[i].header, value: this.cols[i].field });
      }
      console.log('column options', this.columnOptions1);
    } catch (error) {
      console.log('error in intialization compaonent --> ', error);
    }
  }

  /**
   * @Handling column toggle for aggrgate table
   */
  showHideColumn(data: any) {
    if (this.visibleCols.length === 1) {
      this.prevColumn = this.visibleCols[0];
    }
    if (this.visibleCols.length === 0) {
      this.visibleCols.push(this.prevColumn);
    }
    if (this.visibleCols.length !== 0) {
      for (let i = 0; i < this.btCols.length; i++) {
        for (let j = 0; j < this.visibleCols.length; j++) {
          if (this.btCols[i].field === this.visibleCols[j]) {
            this.btCols[i].action = true;
            break;
          } else {
            this.btCols[i].action = false;
          }
        }
      }
    }
    data.value.sort(function (a, b) {
      return parseFloat(a.index) - parseFloat(b.index);
    });

  }

  /**
   *  Coolumn toggler for Custom Data Table
   */

  showHideColumnForCustomData(data: any) {
    if (this.visibleCols1.length === 1) {
      this.prevColumn = this.visibleCols1[0];
    }
    if (this.visibleCols1.length === 0) {
      this.visibleCols1.push(this.prevColumn);
    }
    if (this.visibleCols1.length !== 0) {
      for (let i = 0; i < this.cols.length; i++) {
        for (let j = 0; j < this.visibleCols1.length; j++) {
          if (this.cols[i].field === this.visibleCols1[j]) {
            this.cols[i].action = true;
            break;
          } else {
            this.cols[i].action = false;
          }
        }
      }
    }
    data.value.sort(function (a, b) {
      return parseFloat(a.index) - parseFloat(b.index);
    });
  }

  /**
   *  Rest call for Aggrgate BT Data
   */

  getTableData() {
    // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
    //   this.btUrl = "//" + this.getHostUrl();
    // }
    // else
      this.btUrl = this.getHostUrl()
    this.btUrl += '/' + this.urlParam.product +
      '/v1/cavisson/netdiagnostics/ddr/GroupByCustomDataForAngular?testRun=' +
      this.urlParam.testRun + '&tierName=' + this.urlParam.tierName +
      '&serverName=' + this.urlParam.serverName +
      '&appName=' + this.urlParam.appName +
      '&urlName=' + this.urlParam.urlName +
      '&abs_startTime=' + this.urlParam.startTime +
      '&abs_endTime=' + this.urlParam.endTime +
      '&customDataOptions=NA' +
      '&limit=' + this.customLimit +
      '&offset=' + this.customOffset;
    let ajaxUrl = this.btUrl + '&showCount=false';
    console.log('BT url----->', ajaxUrl);
    this.ddrRequest.getDataUsingGet(ajaxUrl).subscribe(data => (this.doAssignValueAggregate(data)));
  }

  /**
   * assigning aggregate data
   */

  doAssignValueAggregate(data) {
    if (data.hasOwnProperty('Status')) {
      console.log('status=======', data.Status);
      this.loading = false;
      this.showError(data.Status);
    } else {
      if (data !== '[]') {
        this.dataValue = data['data'];
      }
      if (this.dataValue.length === 0) {
        this.showDownLoadReportIcon = false;
      }
      this.loading = false;
      for (let i = 0; i < this.dataValue.length; i++) {
        if (i === 0) {
          this.getSecondTableData(this.dataValue[i].urlindex);
          this.getSecondTableDataCount();
          this.createPieChart(Number(this.dataValue[0]['TotalNormalDur']), Number(this.dataValue[0]['TotalSlowDur']),
            Number(this.dataValue[0]['TotalVerySlowDur']), Number(this.dataValue[0]['TotalErrorDur']));
          this.createBarChart(Number(this.dataValue[0]['TotalNormalCount']), Number(this.dataValue[0]['TotalSlowCount']),
            Number(this.dataValue[0]['TotalVerySlowCount']), Number(this.dataValue[0]['TotalErrorCount']));
        }
      }
    }
  }

 /**
 * @param error notification
 */
  showError(msg: any) {
    this.msgs = [];
    this.msgs.push({ severity: 'error', summary: 'Error Message', detail: msg });
  }
  /**
   * Count rest call for aggregate bt table
   */
  getTableDataCount() {
    try {
      let countUrl = this.btUrl + '&showCount=true';
      console.log('Custom Data Url Count****', countUrl);
      this.ddrRequest.getDataUsingGet(countUrl).subscribe(data => (this.doAssignValueAggregateCountData(data)));
    } catch (error) {

    }

  }

  /**
   * @assigning count rest data
   */

  doAssignValueAggregateCountData(data: any) {
    try {

    } catch (error) {

    }
  }

  /**
   * @rest call for Custom data Table
   */
  getSecondTableData(urlindex) {
    try {
      console.log('urlidx********', urlindex);
      // if (sessionStorage.getItem("isMultiDCMode") == "true" && this._cavConfigService.getActiveDC() == 'ALL') {
      //   this.CustomUrl = this._ddrData.protocol + "://" + this.getHostUrl();
      // }
      // else
      this.CustomUrl=this.getHostUrl();
      this.CustomUrl += '/' + this.urlParam.product +
        '/v1/cavisson/netdiagnostics/ddr/GroupByCustomDataForAngular?testRun=' +
        this.urlParam.testRun + '&tierName=' + this.urlParam.tierName +
        '&serverName=' + this.urlParam.serverName +
        '&appName=' + this.urlParam.appName +
        '&urlName=' + this.urlParam.urlName +
        '&urlindex=' + urlindex +
        '&abs_startTime=' + this.urlParam.startTime +
        '&abs_endTime=' + this.urlParam.endTime +
        '&customDataOptions=' + this.customOptions +
        '&limit=' + this.customLimit +
        '&offset=' + this.customOffset;
      let ajaxUrl = this.CustomUrl + '&showCount=false';
      console.log('Custom Data Url****', ajaxUrl);
      this.ddrRequest.getDataUsingGet(ajaxUrl).subscribe(data => (this.doAssignValueGroup(data)));
    } catch (error) {
    }
  }
  /**
   * @assigning custom rest data
   */
  doAssignValueGroup(data) {
    try {
      this.loading = false;
      console.log('data1', data);
      this.dataValue1 = data['data'];
      if (this.dataValue1.length === 0) {
        this.showDownLoadReportIcon1 = false;
      }
      let TableData = [];
      let TableDatavalue: any;
      this.dataValue1.forEach((val, index) => {
        if (val === 'null') {
          val = this.formatter(val);
        }
        let obj = val.CustomDataColumns;
        delete val['CustomDataColumns'];
        TableDatavalue = Object.assign(val, obj);
        TableData.push(TableDatavalue);
      });
      console.log('this.datavalue1', this.dataValue1);
    } catch (error) {
    }
  }
  /**
   * custom count rest call
   */
  getSecondTableDataCount() {
    try {
      let CountUrl = this.CustomUrl + '&showCount=true';
      console.log('Custom Data Url Count****', CountUrl);
      this.ddrRequest.getDataUsingGet(CountUrl).subscribe(data => (this.doAssignValueGroupByCustomCount(data)));
    } catch (error) {
    }
  }
  /**
   * @assigning custom count data
   */
  doAssignValueGroupByCustomCount(res: any) {
    try {
      this.customTotalCount = res.totalCount;
      if (this.customLimit > this.customTotalCount) {
        this.customLimit = Number(this.customTotalCount);
      }
    } catch (error) {

    }

  }

/**
   * @Custom Sorting on data for BT Table
 */
 CustomsortOnColumnsforbtTable(event, tempData) {
    //  console.log(event);
    //  console.log(JSON.stringify(tempData));
        let fieldValue = event['field'];
          if (event.order === -1) {
            event.order = 1
            tempData = tempData.sort(function (a, b) {
              var value = parseFloat(a[fieldValue].replace('-', 0));
              var value2 = parseFloat(b[fieldValue].replace('-', 0));
              return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
          } else {
            event.order = -1;
            // asecding order
            tempData = tempData.sort(function (a, b) {
              var value = parseFloat(a[fieldValue].replace('-', 0));
              var value2 = parseFloat(b[fieldValue].replace('-', 0));
              return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
          }
        this.dataValue = [];
        // console.log(JSON.stringify(tempData));
        if (tempData) {
          tempData.map((rowdata) => { this.dataValue = this.Immutablepush(this.dataValue, rowdata) });
      }
    }

    /**
   * @Custom Sorting on data for Custom Table
   */
 CustomsortOnColumnsforCustom(event, tempData) {
     console.log(event);
     console.log(JSON.stringify(tempData));
        let fieldValue = event['field'];
          if (event.order === -1) {
            event.order = 1
            tempData = tempData.sort(function (a, b) {
              var value = parseFloat(a[fieldValue].replace('-', 0));
              var value2 = parseFloat(b[fieldValue].replace('-', 0));
              return (value2 > value) ? 1 : ((value2 < value) ? -1 : 0);
            });
          } else {
            event.order = -1;
            // asecding order
            tempData = tempData.sort(function (a, b) {
              var value = parseFloat(a[fieldValue].replace('-', 0));
              var value2 = parseFloat(b[fieldValue].replace('-', 0));
              return (value > value2) ? 1 : ((value < value2) ? -1 : 0);
            });
          }
        this.dataValue1 = [];
        // console.log(JSON.stringify(tempData));
        if (tempData) {
          tempData.map((rowdata) => { this.dataValue1 = this.Immutablepush(this.dataValue1, rowdata) });
      }
    }


    Immutablepush(arr, newEntry) {
      return [...arr, newEntry]
    }

  /*This Method is used for handle the Column Filter Flag*/
  toggleColumnFilterforbtTable() {
    // if (this.isEnabledColumnFilterForbtTable) {
    //   this.isEnabledColumnFilterForbtTable = false;
    // } else {
    //   this.isEnabledColumnFilterForbtTable = true;
    // }
    // this.changeColumnFilterForbtTable();
  }

  toggleColumnFilterforCustom() {
    // if (this.isEnabledColumnFilterForCustom) {
    //   this.isEnabledColumnFilterForCustom = false;
    // } else {
    //   this.isEnabledColumnFilterForCustom = true;
    // }
    this.changeColumnFilterForCustom();
  }

/*This method is used to Enable/Disabled Column Filter*/
changeColumnFilterForbtTable() {
  // try {
  //   let tableColumns = this.btCols;
  //   if (this.isEnabledColumnFilterForbtTable) {
  //     this.toggleFilterTitleForbtTable = 'Show Column Filters';
  //     for (let i = 0; i < tableColumns.length; i++) {
  //       tableColumns[i].filter = false;
  //     }
  //   } else {
  //     this.toggleFilterTitleForbtTable = 'Hide Column Filters';
  //     for (let i = 0; i < tableColumns.length; i++) {
  //       tableColumns[i].filter = true;
  //     }
  //   }
  // } catch (error) {
  //   console.log('Error while Enable/Disabled column filters', error);
  // }
}

  changeColumnFilterForCustom() {
    // try {
    //   let tableColumns = this.cols;
    //   if (this.isEnabledColumnFilterForCustom) {
    //     this.toggleFilterTitleForCustom = 'Show Column Filters';
    //     for (let i = 0; i < tableColumns.length; i++) {
    //       tableColumns[i].filter = false;
    //     }
    //   } else {
    //     this.toggleFilterTitleForCustom = 'Hide Column Filters';
    //     for (let i = 0; i < tableColumns.length; i++) {
    //       tableColumns[i].filter = true;
    //     }
    //   }
    // } catch (error) {
    //   console.log('Error while Enable/Disabled column filters', error);
    // }
  }

  /**
   * Pagination
   */

  paginate(event: any) {
    // event.first = Index of the first record  (used  as offset in query) 
    // event.rows = Number of rows to display in new page  (used as limit in query)
    // event.page = Index of the new page
    // event.pageCount = Total number of pages
    this.customOffset = parseInt(event.first);
    this.customLimit = parseInt(event.rows);
    console.log('Limit and Offset---', this.customLimit, this.customOffset);
    if (this.customLimit > this.customTotalCount) {
      this.customLimit = Number(this.customTotalCount);
    }
    if ((this.customLimit + this.customOffset) > this.customTotalCount) {
      this.customLimit = Number(this.customTotalCount) - Number(this.customOffset);
    }
  }
  formatter(value) {
    if (value === 'null') {
      return '-';
    }
  }

  /**
   * oenPieChart on click BT
   */
  oenPieChart(node: any) {
    console.log('node**********', node);
    this.createPieChart(Number(node.TotalNormalDur), Number(node.TotalSlowDur),
    Number(node.TotalVerySlowDur), Number(node.TotalErrorDur));
    this.createBarChart(Number(node.TotalNormalCount), Number(node.TotalSlowCount),
    Number(node.TotalVerySlowCount), Number(node.TotalErrorCount));
    this.loading = true;
    this.customLimit = 50;
    this.customOffset = 0;
    this.getSecondTableData(node.urlindex);
    this.getSecondTableDataCount();
  }
  /**
   * Creating pie-Chart oon basis of response time of bt category
   */

  createPieChart(normal, slow, verySlow, error) {
    if (isNaN(normal) === true) {
      normal  = 0;
    }
    if (isNaN(slow) === true) {
      slow  = 0;
    }
    if (isNaN(verySlow) === true) {
      verySlow  = 0;
    }
    if (isNaN(error) === true) {
      error  = 0;
    }
    if (normal !== 0 || slow !== 0 || verySlow !== 0 || error !== 0) {
      this.showChart = true;
    }
    let infoArr = [];
    if (normal !== 0) {
      infoArr.push({ 'name': 'Normal', 'y': Number(normal) });
    }
    if (slow !== 0) {
      infoArr.push({ 'name': 'Slow', 'y': Number(slow) });
    }
    if (verySlow !== 0) {
      infoArr.push({ 'name': 'VerySlow', 'y': Number(verySlow) });
    }
    if (error !== 0) {
      infoArr.push({ 'name': 'Error', 'y': Number(error) });
    }
    console.log('arr', infoArr);
    this.options = {
      chart: {
        type: 'pie',
      },
      credits: {
        enabled: false
      },
      title: { text: 'Response Time', style: { 'fontSize': '13px' } },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          cursor: 'pointer',
          allowPointSelect: true,
          dataLabels: {
            enabled: true,
            format: '<b> {point.name} </b>: {point.percentage:.1f} %',
          },
        }
      },
      series: [
        {
          name: 'Percentage',
          data: infoArr,
          enableMouseTracking: true
        }
      ]
    };
  }

  /**
   * Creating bar chart on basis of count of Aggregate table btcategory total count
   */

  createBarChart(normalCount, slowCount, verySlowCount, errorCount) {
    if (normalCount !== 0 || slowCount !== 0 || verySlowCount !== 0 || errorCount !== 0) {
      this.showBarChart = true;
    } else {
      this.showBarChart = false;
    }
    let infoArr = []
    infoArr.push(normalCount);
    infoArr.push(slowCount);
    infoArr.push(verySlowCount);
    infoArr.push(errorCount);
    this.options1 = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Flowpaths By BT Category',
        style: { 'fontSize': '13px' }
      },
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
          }
      },
      yAxis: {
        min: 0,
        title: {
          text: 'Time (ms)'
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f} ms</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [
        {
          name: 'Counts',
          enableMouseTracking: true,
          data: infoArr
        }]
    }
  }

  /*
  * Method is used get host url
  */
  getHostUrl(isDownloadCase?): string {
    let hostDcName = this._ddrData.getHostUrl(isDownloadCase);
    if(!isDownloadCase && sessionStorage.getItem("isMultiDCMode")=="true" && this._cavConfigService.getActiveDC() == 'ALL')
    { 
      //hostDcName =  this._ddrData.host + ':' +this._ddrData.port ;
      //console.log("this._ddrData.testRun==>",this._ddrData.testRun);
      this.urlParam.testRun= this._ddrData.testRun;
      console.log("all case url==>",hostDcName,"all case test run==>",this.urlParam);
    }
    // else if (this._navService.getDCNameForScreen('CustomDataByBTSplitting') === undefined) {
    //   hostDcName = this._cavConfigService.getINSPrefix();
    // } else {
    //   hostDcName = this._cavConfigService.getINSPrefix() + this._navService.getDCNameForScreen('CustomDataByBTSplitting');
    // }
    // if (hostDcName.length > 0) {
    //   sessionStorage.removeItem('hostDcName');
    //   sessionStorage.setItem('hostDcName', hostDcName);
    // } else {
    //   hostDcName = sessionStorage.getItem('hostDcName');
    // }
    console.log('hostDcName =', hostDcName);
    return hostDcName;
  }

  /**
   * open Flowpath Report
   */
  openFlowpathReport(rowData: any, btCategory: string) {
    console.log('rowdata----------->', rowData, btCategory);
    console.log('****************', rowData.hasOwnProperty('CustomDataColumns'));
    this._ddrData.dbTofpflag = false ;  // for bug 50806
    if (rowData.hasOwnProperty('CustomDataColumns')) {
      console.log('key exiss-----****', 'insid ethis');
      let reqData = {};
      if (rowData !== undefined) {
        reqData['tierName'] = this.urlParam.tierName;
        reqData['serverName'] = this.urlParam.serverName;
        reqData['appName'] = this.urlParam.appName;
        reqData['BusinesTransaction'] = rowData.BusinesTransaction;
        reqData['urlindex'] = rowData.urlindex;
        reqData['startTime'] = this.urlParam.startTime;
        reqData['endTime'] = this.urlParam.endTime;
        reqData['btCategory'] = btCategory;
      }
      this._ddrData.customToFlowpathFlag = true;
      this.commonService.customToFlowpathData = reqData;
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.BTSPLITTING;
      if (this._router.url.indexOf('/home/ED-ddr') !== -1) {
        this._router.navigate(['/home/ED-ddr/flowpath']);
      } else {
        this._router.navigate(['/home/ddr/flowpath']);
      }
    } else {
      let reqData = {};
      if (rowData !== undefined) {
        reqData['tierName'] = this.urlParam.tierName;
        reqData['serverName'] = this.urlParam.serverName;
        reqData['appName'] = this.urlParam.appName;
        reqData['BusinesTransaction'] = rowData.BusinesTransaction;
        reqData['urlindex'] = rowData.urlindex;
        reqData['startTime'] = this.urlParam.startTime;
        reqData['endTime'] = this.urlParam.endTime;
        reqData['btCategory'] = btCategory;
        let customdataFilter = '';
        let http = '';
        for (let i = 0; i < this.customOptions.length; i++) {
          let customheader = this.customOptions[i];
          let valueOfCustomHeader = rowData[customheader];
          console.log('value*********', valueOfCustomHeader);
          if (i === 0) {
            http = customheader + ':-:' + valueOfCustomHeader + ':-';
            customdataFilter = customheader + ': ' + valueOfCustomHeader;
          } else {
            http += ':1:' + customheader + ':-:' + valueOfCustomHeader + ':-';
            customdataFilter += ', ' + customheader + ': ' + valueOfCustomHeader;
          }
        }
        console.log('filter***************', http, '*********', customdataFilter);
        reqData['customData'] = http;
        reqData['customFilter'] = customdataFilter;
      }
      this._ddrData.customToFlowpathFlag = true;
      this.commonService.patternflag = true;
      this.commonService.customToFlowpathData = reqData;
      this.breadcrumbService.parentComponent = CONSTANTS.BREADCRUMB_ITEMS.BTSPLITTING;
      if (this._router.url.indexOf('/home/ED-ddr') !== -1) {
        this._router.navigate(['/home/ED-ddr/flowpath']);
      } else {
        this._router.navigate(['/home/ddr/flowpath']);
       }
    }
  }

  /**
   * Download report
   */

  downloadReports(downloadType: any, Index: any) {
    console.log('Inedx--', Index)
    let renameArray: any;
    let colOrder: any;
    let downloadData: any;
    if (Index === '1') {
    renameArray={"BusinesTransaction":"BusinesTransaction","TotalOverallCount":"Total Overall Count",
    "TotalOverAllDur":"Total OverAll Duration (ms)","MinOverallDur":"Min Overall Dur (ms)",
    "MaxOverallDur":"Max Overall Duration (ms)","AvgOverallDur":"Avg Overall Dur (ms)", "TotalNormalCount":"Total Normal Count",
     "TotalNormalCountPct":"Normal Percentage" , "TotalNormalDur":"Total Normal Duration (ms)","MinNormalDur":"Min Normal Duration (ms)",
     "MaxNormalDur":"Max Normal Duration (ms)","AvgNormalDur":"Avg Normal Duration (ms)","TotalSlowCount":"Total Slow Count",
     "TotalSlowCountPct":"Slow Percentage" , "TotalSlowDur":"Total Slow Duration (ms)","MinSlowDur":"Min Slow Duration (ms)",
     "MaxSlowDur":"Max Slow Duration (ms)","AvgSlowDur":"Avg Slow Duration (ms)","TotalVerySlowCount":"Total Very Slow Count",
     "TotalVerySlowCountPct":"Very Slow Percentage","TotalVerySlowDur":"Total Very Slow Duration (ms)",
     "MinVerySlowDur":"Min VerySlow Duration (ms)","MaxVerySlowDur":"Max Very Slow Duration (ms)",
     "AvgVerySlowDur":"Avg Very Slow Duration (ms)","TotalErrorCount":"Total Error Count","TotalErrorCountPct":"Error Percentage",
     "TotalErrorDur":"Total Error Duration (ms)","MinErrorDur":"Min Error Duration (ms)","MaxErrorDur":"Max Error Duration",
     "AvgErrorDur":"Avg Error Duration (ms)"};

    colOrder = ['BusinesTransaction', 'Total Overall Count', 'Total OverAll Duration (ms)', 'Min Overall Dur (ms)',
    'Max Overall Duration (ms)', 'Avg Overall Dur (ms)', 'Total Normal Count', 'Normal Percentage' , 'Total Normal Duration (ms)',
    'Min Normal Duration (ms)', 'Max Normal Duration (ms)', 'Avg Normal Duration (ms)', 'Total Slow Count', 'Slow Percentage',
    'Total Slow Duration (ms)', 'Min Slow Duration (ms)', 'Max Slow Duration (ms)', 'Avg Slow Duration (ms)', 'Total Very Slow Count',
    'Very Slow Percentage', 'Total Very Slow Duration (ms)', 'Min VerySlow Duration (ms)', 'Max Very Slow Duration (ms)',
    'Avg Very Slow Duration (ms)', 'Total Error Count', 'Error Percentage', 'Total Error Duration (ms)', 'Min Error Duration (ms)',
    'Max Error Duration', 'Avg Error Duration (ms)'];

    console.log('***********', colOrder);
    this.dataValue.forEach((val, index) => {
      delete val['id'];
      delete val['urlindex'];
      delete val['CustomDataColumns'];
      delete val['TotalStalledCount'];
      delete val['TotalStalledCountPct'];
      delete val['TotalStalledDur'];
      delete val['MinStalledDur'];
      delete val['MaxStalledDur'];
      delete val['AvgStalledDur'];
    });
    downloadData = this.dataValue;
  } else if (Index === '2') {
    renameArray={"BusinesTransaction":"BusinesTransaction"};
    for (var i = 0; i < this.customOptions.length; i++) {
      renameArray[this.customOptions[i]] = this.customOptions[i];
    }
    renameArray = Object.assign(renameArray, {"TotalOverallCount":"Total Overall Count", 
    "TotalOverAllDur":"Total OverAll Duration (ms)", "MinOverallDur":"Min Overall Dur (ms)", "MaxOverallDur":"Max Overall Duration (ms)",
    "AvgOverallDur":"Avg Overall Dur (ms)", "TotalNormalCount":"Total Normal Count", "TotalNormalCountPct":"Normal Percentage" ,
    "TotalNormalDur":"Total Normal Duration (ms)", "MinNormalDur":"Min Normal Duration (ms)", "MaxNormalDur":"Max Normal Duration (ms)",
    "AvgNormalDur":"Avg Normal Duration (ms)", "TotalSlowCount":"Total Slow Count", "TotalSlowCountPct":"Slow Percentage" ,
    "TotalSlowDur":"Total Slow Duration (ms)", "MinSlowDur":"Min Slow Duration (ms)", "MaxSlowDur":"Max Slow Duration (ms)",
    "AvgSlowDur":"Avg Slow Duration (ms)", "TotalVerySlowCount":"Total Very Slow Count", "TotalVerySlowCountPct":"Very Slow Percentage",
    "TotalVerySlowDur":"Total Very Slow Duration (ms)", "MinVerySlowDur":"Min VerySlow Duration (ms)",
    "MaxVerySlowDur":"Max Very Slow Duration (ms)", "AvgVerySlowDur":"Avg Very Slow Duration (ms)", "TotalErrorCount":"Total Error Count",
    "TotalErrorCountPct":"Error Percentage", "TotalErrorDur":"Total Error Duration (ms)", "MinErrorDur":"Min Error Duration (ms)",
    "MaxErrorDur":"Max Error Duration", "AvgErrorDur":"Avg Error Duration (ms)"});

    colOrder = ["BusinesTransaction"];
    for (var i = 0; i < this.customOptions.length; i++) {
      colOrder.push(this.customOptions[i]);
    }    
    colOrder = colOrder.concat(["Total Overall Count", "Total OverAll Duration (ms)", "Min Overall Dur (ms)", "Max Overall Duration (ms)",
     "Avg Overall Dur (ms)", "Total Normal Count", "Normal Percentage", "Total Normal Duration (ms)", "Min Normal Duration (ms)",
     "Max Normal Duration (ms)", "Avg Normal Duration (ms)", "Total Slow Count", "Slow Percentage", "Total Slow Duration (ms)",
     "Min Slow Duration (ms)", "Max Slow Duration (ms)", "Avg Slow Duration (ms)", "Total Very Slow Count", "Very Slow Percentage",
     "Total Very Slow Duration (ms)", "Min VerySlow Duration (ms)", "Max Very Slow Duration (ms)", "Avg Very Slow Duration (ms)",
     "Total Error Count", "Error Percentage", "Total Error Duration (ms)", "Min Error Duration (ms)", "Max Error Duration",
     "Avg Error Duration (ms)" ]);

      this.dataValue1.forEach((val, index) => {
        delete val['id'];
        delete val['urlindex'];
        delete val['CustomDataColumns'];
        delete val['TotalStalledCount'];
        delete val['TotalStalledCountPct'];
        delete val['TotalStalledDur'];
        delete val['MinStalledDur'];
        delete val['MaxStalledDur'];
        delete val['AvgStalledDur'];
      });
      downloadData = this.dataValue1;
  }
     let downloadObj: Object = {
      downloadType: downloadType,
      varFilterCriteria: this.filterCriteria,
      strSrcFileName: 'FlowpathReport',
      strRptTitle: this.strTitle,
      renameArray: JSON.stringify(renameArray),
      colOrder: colOrder.toString(),
      jsonData: JSON.stringify(downloadData)
    };
    let downloadFileUrl = '';
    if(this.host !== undefined && this.host !== '' && this.host != null) {
      downloadFileUrl = this.protocol + this.host + ':' + this.port + '/' + this.urlParam.product;
    }else {
      downloadFileUrl = decodeURIComponent(this.getHostUrl(true) + '/' + this.urlParam.product); 
    }
    downloadFileUrl += '/v1/cavisson/netdiagnostics/ddr/downloadAngularReport';
    console.log('download url----------*', downloadFileUrl)
    if (sessionStorage.getItem("isMultiDCMode") == "true"  && (downloadFileUrl.includes("/tomcat")|| downloadFileUrl.includes("/node"))) 
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl,downloadObj).subscribe(res =>
      (this.openDownloadReports(res)));
    else
    this.ddrRequest.getDataInStringUsingPost(downloadFileUrl, JSON.stringify(downloadObj)).subscribe(res =>
      (this.openDownloadReports(res)));

  }

  openDownloadReports (res: any) {
    console.log('file name generate ===', res);
    let downloadFileUrl = '';
    if(this.protocol!== undefined && this.protocol !== ''&&this.host !== undefined && this.host !== '' && this.host != null) {
      downloadFileUrl = this.protocol + this.host + ':' + this.port;
    }else {
      downloadFileUrl = decodeURIComponent(this.getHostUrl(true));
    }
    downloadFileUrl += '/common/' + res;
    console.log('downloadfileurl-----------*', downloadFileUrl)
    window.open(downloadFileUrl);
  }
}
