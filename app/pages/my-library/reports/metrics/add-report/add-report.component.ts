import {
  Component, Input, OnInit, ViewEncapsulation, ViewChild, ChangeDetectorRef, AfterViewInit
  , OnDestroy
} from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { Moment } from 'moment-timezone';
import { FileUpload, MenuItem, SelectItem, ConfirmationService } from 'primeng';
import { Observable, Subject, Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { CompareDataService } from 'src/app/shared/compare-data/service/compare-data.service';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { ObjectUtility } from 'src/app/shared/utility/object';
import {
  ADD_REPORT_DATA, Report_Date_Format, Report_Preset,
  Report_Option_Field
} from './service/add-report.dummy';
import { AddReportData, TimebarTimeConfig } from './service/add-report.model';
import { ReportConstant } from './service/add-report-enum'
import { ReportsService } from '../../service/reports.service';
import {Message,MessageService} from 'primeng/api';
import { SETTINGS_TABLE } from '../../metrics/service/metrics.dummy';
import {
  ReportTimebarLoadedState,
  ReportTimebarLoadingErrorState,
  ReportTimebarLoadingState,
  ReportTemplateListLoadedState,
  ReportTemplateListLoadingErrorState,
  ReportTemplateListLoadingState,
  GenerateReportLoadingErrorState,
  GenerateReportLoadedState,
  GenerateReportLoadingState,
  TransactionErrorCodeLoadingState,
  TransactionErrorCodeLoadedState,
  TransactionErrorCodeLoadingErrorState,
  AddReportGroupLoadingErrorState,
  AddReportGroupLoadedState,
  AddReportGroupLoadingState,
  getMetricServiceLoading,
  getMetricServiceLoaded,
  getMetricServiceLoadingError,
  createChartAndReportLoading,
  createChartAndReportLoaded,
  createChartAndReportError,
  getChartAndReportDataLoaded,
  getChartAndReportDataError,
  getChartAndReportDataLoading,
  ReportTimebarTimeLoadedState,
  ThresholdTemplateListLoadingState,
  ThresholdTemplateListLoadedState,
  ThresholdTemplateListLoadingErrorState
} from './service/add-report.state';
import * as moment from 'moment-timezone';
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
} from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from 'src/app/shared/date-time-picker-moment/moment-date-time-adapter';
import { Store } from 'src/app/core/store/store';
import { SessionService } from 'src/app/core/session/session.service';
import { AddReportService } from './service/add-report.service';
import { MetricsService } from '../service/metrics.service';
import { environment } from 'src/environments/environment';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { AddReportSettingsService } from '../add-report-settings/service/add-report-settings.service';
import { CctxInfo, TemplateDataDTO, TemplateObject, TInfo } from '../../template/add-template/service/add-template.model';
import { SaveTemplateLoadedState, SaveTemplateLoadingErrorState, SaveTemplateLoadingState } from '../../template/add-template/service/add-template.state';
import { AddTemplateService } from '../../template/add-template/service/add-template.service';
import { TemplateService } from '../../template/service/template.service';
import {DeleteTemplateLoadingState, DeleteTemplateLoadedState, DeleteTemplateLoadingErrorState} from '../../template/service/template.state';
declare var $:any;
@Component({
  selector: 'app-add-report',
  templateUrl: './add-report.component.html',
  styleUrls: ['./add-report.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: DateTimeAdapter,
      useClass: MomentDateTimeAdapter,
      deps: [OWL_DATE_TIME_LOCALE],
    },
    {
      provide: OWL_DATE_TIME_FORMATS,
      useValue: Report_Date_Format.formats.OWL_DATE_TIME_FORMATS,
    },
    ConfirmationService,
    MessageService
  ]
})

export class AddReportComponent implements OnInit, OnDestroy {
  @ViewChild('timePeriodMenu') timePeriodMenu;
  @ViewChild('fileUploadExcel') fileUploadExcel: FileUpload;
  @ViewChild('fileUploadThreshold') fileUploadThreshold: FileUpload;
  @ViewChild('tempFavDropdownReference') tempFavDropdownReferenceObj;
  breadcrumb: MenuItem[];
  data: AddReportData;
  dateTimeFrame: Moment[] = null;
  dateTimeFrameMax: Moment = null;
  invalidDate: boolean = false;
  optionArr:any;

  aggregateTimeOption: SelectItem[];
  selectedAggregateTime: any= { label: 'Minute', value: 'Minute' };

  showReportOptions: SelectItem[];
  selectedShowReportOptions: any;

  reportOptions: SelectItem[];
  reportType: any = { label: 'Performance Stats', value: 'Stats' };

  tmpValue: any = null;

  //tableData: TableHeaderColumn;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  downloadOptions: MenuItem[];
  selectedRow: any = [];
  isShowColumnFilter: boolean = false;
  //time period Preset

  blockedDocument: boolean = false;

  value: any;
  timeFrame: number[] = [];
  subscribe: any;

  preset: boolean = true;
  timeBack: any;
  timeBackToggle: boolean = false;
  timeBckCall: boolean = false;
  isApply:boolean = false;

  selectedMetricOption: number = ReportConstant.TEMPLATE_GRAPH_REPORT;
  reportVisualizeType: String = 'TABULAR';

  selectedTempFav: any;
  reportTempFavOptions: SelectItem[];

  selectedExcelTemp: any;
  reportExcelTempOptions: SelectItem[];

  selectThresholdTemp: any={label: "PerformanceDefaultThresholds", value: "PerformanceDefaultThresholds"};;
  reportThresholdOptions: SelectItem[];

  displayReportSetting: boolean = false;

  checkAnalysisSummary = true;
  checkPerformanceSummary = true;
  checkOverview = true;
  checkSessions = true;
  checkTransactions = true;
  checkPages = true;
  checkNetwork = true;
  checkErrors = true;
  checkMetricsSummary = true;
  checkMetricsCharts = true;
  objReportSetting = {};

  conclusionSummary = '';
  executiveSummary = '';

  fileURL = '';
  csvFiles: any[];
  reportName = null;

  checkIncludeChart = true;
  checkOverrideChart = false;
  checkShowAllSample = false;

  selectedOverrideChartType: any;
  overrideChartOption: SelectItem[];

  selectedAggregateOverEntireReport = true;
  isDropdownDisabled: boolean = true;

  aggregatebyDropdownOption: SelectItem[];
  selectedAggregateBy: any;

  checkExcelOverridePreset = false;
  checklastWeek = false;
  dialogVisible = false;

  summeryPercentileOption: SelectItem[];
  selectedSummaryPerModel: string[] = [];

  transactionColOption: SelectItem[];
  selectedTransactionCol: any;

  showUnusedTransactions: false;
  showTransactionError: false;

  transactionErrorCodeOptions: SelectItem[];
  selectedTransactionErrorCode: string[] = [];
  isTransactionErrorCodeOptionsEnabled: boolean = false;
  isPreviousTransactionErrorCodeOptions: boolean = false;
  showTransactionErrorPerChange = false;
  msrName = null;

  cmpDataValue: SelectItem[];
  selectedCmpDataValue: any;
  checkTrendCompare = false;

  groupDataList = [];
  maxValue = 0;
  selectedHierarchichyNgModel = [];
  hirerchichyDropdownOptionArr = [];
  isDropdownDisabledArr = [];

  isEnableFilter: boolean = false;
  selectedCategory = 'All';
  selectedOperator = { label: '=', value: 0 };
  selectedfilterInclude = 'Include';
  selectedfilterValue =  0 ;
 
  skipVectorMapping = true;

  reportNameWithTypeArr = [];

  isProductTypeNVSM = false;
  filterFirstValue: any;
  filterSecondValue: any;

  checkDisableDropDown = false;

  previousMSRName: any;

  finalName : any;
  reportTypwWithoutType : any;
  reportTypeFromList : any;

  tooltipPercentile:any=["90"];
  tooltipTranError:any=["T.O"];
  tooltipTransection:any=["Min","Avg","Max","Complete","Success","Failure(%)","TPS","TPS(%)"];
  dialogVisibleSuccess: boolean = false;
  checkFirstTimePreset: boolean = false;

  selectedItemsLabel = '{0} items selected';

  private progress: Subscription;
  display: boolean = false;
  modal: boolean = true;
  progressValue: number = 10;
  firstTimeCustom: boolean = false;
  toolTip: any;
  toolTipTest: any;
  srt: any;


  constructor(
    private router: Router,
    public sessionService: SessionService,
    private cd: ChangeDetectorRef,
    private addReportService: AddReportService,
    private metricsService: MetricsService,
    private confirmationService: ConfirmationService,
    private addReportSettingsService: AddReportSettingsService,
    private reportsService: ReportsService,
    public timebarService: TimebarService,
    private messageService: MessageService,
    private addTemplateService: AddTemplateService,
    private templateService: TemplateService

  ) {
    this.progress = this.addReportService.getTimerSubscription().subscribe(
      value => {
        this.calculateProgress(value);
      }
    );
   }

  ngOnInit(): void {

    // this code for when page scroll close dropdown, menu, calender etc  
    $(document).ready(function() {
      $('div').scroll(function(){
          if ($(this).scrollTop() > 50) {
             $('.ng-trigger-overlayAnimation').fadeOut();
             $('body').click();
          } else  {
          }
      });
    });


    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      // { label: 'System', routerLink: '/home/system' }, for bug id - 110253
      { label: 'My Library', routerLink: '/my-library/dashboards' },
      { label: 'Reports', routerLink: '/reports/metrics' },
      { label: 'Add Report', routerLink: 'add-report' },
    ];

    me.summeryPercentileOption = Report_Option_Field.summeryPerOption;
    me.selectedSummaryPerModel = ['90'];

    me.transactionColOption = Report_Option_Field.TransectionOption;
    me.selectedTransactionCol = ['Min', 'Avg', 'Max', 'Completed', 'Success', 'Failure(%)', 'TPS', 'TPS(%)'];

    me.showReportOptions = Report_Option_Field.reportExcelView;
    me.selectedShowReportOptions = me.showReportOptions[0];

    me.cmpDataValue = Report_Option_Field.CmpDataValueOption;
    me.selectedCmpDataValue = me.cmpDataValue[0];
    this.checkTrendCompare = false;

    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ]

    me.fillAggregateTimeOption();
    me.fillOverrideChartOption();

    me.data = ADD_REPORT_DATA;
    me.reportOptions = ADD_REPORT_DATA.reportType;
    me.tmpValue = Report_Preset;
    
    me.reportType = { label: me.metricsService.reportType, value: me.metricsService.reportType }
    if (me.metricsService.reportType == undefined || me.metricsService.reportType == null ||
      me.metricsService.reportType == "Stats" || me.metricsService.reportType == "All Reports")
      me.reportType = { label: 'Performance Stats', value: 'Stats' };

      this.dateTimeFrame = [
      me.tmpValue.time.frameStart.value,
      me.tmpValue.time.frameEnd.value
    ];
    
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    me.checkDisableDropDown = false;
    this.checkFirstTimePreset =true;
    me.presetTimeCall();

    me.listReportTypeTemplate();
    me.showTransactionErrorEvent();
    if (this.reportType.value === 'Hierarchical') {
      this.reportGroupDataList();
    }
    if (me.metricsService.isEditCompare) {
      me.metricsService.isEditCompare=false;
      me.fillValuesAfterEditInCompare();
    }
    me.addReportService.isMultiLayot = false;
    me.addReportService.isHeirarchical = false;
    me.addReportService.isCompareReport = false;
    me.addReportService.checkIncludeChart = true;
    me.addReportService.ischeckTrendCompare = false;
    me.addReportService.templateListData = "";
    const output = new Subject<TimebarValue>();
    this.addReportService.loadTime("LIVE10").subscribe(
      (state: Store.State) => {
        if (state instanceof ReportTimebarTimeLoadedState) {
          this.srt = state.data[1];
        }
      }
    );
  }

  calculateProgress(tick: number) {
    try {
    
    /*If progress bar is not active then no need to increase the progress value. */
    if (! this.display) {
    this.progressValue = 40;
    return;
    }
    
    if (this.progressValue < 50) {
    this.progressValue += 5;
    } else if (this.progressValue < 70) {
    this.progressValue += 3;
    } else if ( this.progressValue < 80 ) {
    this.progressValue += 2;
    } else if (this.progressValue < 90) {
    this.progressValue += 1;
    } else if (this.progressValue < 99) {
    this.progressValue += 0.1;
    }
    this.progressValue = Math.floor( this.progressValue );
    
    } catch (e) {
    console.error('Error while calculating progress of progress bar.', e);
    }
    }

  fillValuesAfterEditInCompare(){
    try {
      const me = this;
      let editCompareData = me.metricsService;
      //me.reportName = editCompareData.rowData.rN;
      for (let i=0;i<this.reportOptions.length;i++){
        let reportTypeName=editCompareData.rowData.rT;
        reportTypeName=reportTypeName.split(' (');
        if(reportTypeName[0] === this.reportOptions[i].value){
          me.reportType = this.reportOptions[i];
        }
      }
      this.checkTrendCompare = editCompareData.dataTobeEdit.data.resuse.isTrend;
      let dataOfEdit= editCompareData.dataTobeEdit.data.resuse.msrInfo;
      let arrayOfJSON =[];
      for(let i=0;i<dataOfEdit.length;i++){
        let json={};
        json['measurementName'] = dataOfEdit[i].msrName;
        json['preset'] = dataOfEdit[i].duration.preset;
        json['label'] = this.selectPreset(dataOfEdit[i].duration.preset);
        json['sTime'] = moment(dataOfEdit[i].duration.st).zone(
          this.sessionService.selectedTimeZone.offset
        ).format('MM/DD/YYYY HH:mm:ss') ;
        json['eTime'] = moment(dataOfEdit[i].duration.et).zone(
          this.sessionService.selectedTimeZone.offset
        ).format('MM/DD/YYYY HH:mm:ss'); 
        arrayOfJSON.push(json);
      }
      this.data.data=arrayOfJSON;
      this.selectedRow = this.data.data;
      this.metricsService.takeDataOfEdit=arrayOfJSON;
    } 
    catch (error) {
      console.error(error)
    }
  }
  selectPreset(dataOfEdit){
    switch(dataOfEdit){
      case 'LIVE0':
        return 'Last 5 Minutes';
      case 'LIVE1':
        return 'Last 10 Minutes';
      case 'LIVE2':
        return 'Last 30 Minutes';
      case 'LIVE3':
        return 'Last 1 Hour';
      case 'LIVE4':
        return 'Last 2 Hours';
      case 'LIVE5':
        return 'Last 4 Hours';
      case 'LIVE6':
        return 'Last 6 Hours';
      case 'LIVE7':
        return 'Last 8 Hours';
      case 'LIVE8':
        return 'Last 12 Hours';
      case 'LIVE9':
        return 'Last 24 Hours';
      case 'LIVE10':
        return 'Today';
      case 'LIVE11':
        return 'Last 7 Days';
      case 'LIVE12':
        return 'Last 30 Days';
      case 'LIVE13':
        return 'Last 90 Days';
      case 'LIVE14':
        return 'This Week';
      case 'LIVE15':
        return 'This Month';
      case 'LIVE16':
        return 'This Year';
      case 'PAST1':
        return 'Yesterday';
      case 'PAST2':
        return 'Last Week';
      case 'PAST3':
        return 'Last 2 Weeks';
      case 'PAST4':
        return 'Last 3 Weeks';
      case 'PAST5':
        return 'Last 4 Weeks';
      case 'PAST6':
        return 'Last Month';
      case 'PAST7':
        return 'Last 2 Months';
      case 'PAST8':
        return 'Last 3 Months';
      case 'PAST9':
        return 'Last 6 Months';
      case 'PAST10':
        return 'Last Year';
      case 'TB0':
        return 'Hour Back';
      case 'TB1':
        return 'Day Back';
      case 'TB2':
        return 'Week Back';
      case 'TB3':
        return 'Month Back';
      default:
        if(dataOfEdit.startsWith("EV1"))
          return "Black Friday" + " " + dataOfEdit.substring(4);
        else if (dataOfEdit.startsWith("EV2"))
          return "Christmas Day" + " " + dataOfEdit.substring(4);
        else if (dataOfEdit.startsWith("EV3"))
          return "Cyber Monday" + " " + dataOfEdit.substring(4);
        else if (dataOfEdit.startsWith("EV4"))
          return "Good Friday" + " " + dataOfEdit.substring(4);
        else if (dataOfEdit.startsWith("EV5"))
          return "New Years Day" + " " + dataOfEdit.substring(4);
        else if (dataOfEdit.startsWith("EV6"))
          return "President's Day" + " " + dataOfEdit.substring(4);
        else if (dataOfEdit.startsWith("EV7"))
          return "Thanks Giving Day" + " " + dataOfEdit.substring(4);
        else if (dataOfEdit.startsWith("EV8"))
          return "Valentines Day" + " " + dataOfEdit.substring(4);
        else
          return "Custom Time";
    }
    
  }

  listReportTypeTemplate() {
    const me = this;
    let reportTypeObj = {};
    reportTypeObj["rT"] = this.getReportTypeValue(this.reportType.value, this.reportVisualizeType);
    reportTypeObj["mO"] = this.selectedMetricOption;
    me.addReportService.listAllTemplate(reportTypeObj).subscribe(
      (state: Store.State) => {
        if (state instanceof ReportTemplateListLoadingState) {
          me.templateLoading(state);
          return;
        }

        if (state instanceof ReportTemplateListLoadedState) {

          me.templateLoaded(state);
          return;
        }
      },
      (state: ReportTemplateListLoadingErrorState) => {
        me.templateLoadingError(state);
      }
    );
  }

  templateLoading(state) { }
  templateLoaded(state) { 

    let listObj = state.data.temFavList;

    if (listObj.json) {
      this.reportTempFavOptions = listObj.json;
      this.addReportService.templateListData = this.reportTempFavOptions;
      this.selectedTempFav = listObj.json[0];
    }
    else if (listObj.excel) {
      this.reportExcelTempOptions = listObj.excel;
      this.selectedExcelTemp = listObj.excel[0];
    }
    else if (listObj.fav) {
      this.reportTempFavOptions = listObj.fav;
      this.selectedTempFav = listObj.fav[0];
    }

    if (listObj.csv) {
      this.reportThresholdOptions = listObj.csv;
      this.selectThresholdTemp = listObj.csv[0];
      if(this.selectThresholdTemp.label == 'PerformanceDefaultThresholds'){
        this.toolTipTest = 'Default Template cannot be delated';
      }
      else{
        this.toolTipTest = 'Delete';
      }
    }

  }
  templateLoadingError(state) { }

  selectThreshold(){
    if(this.selectThresholdTemp.label == 'PerformanceDefaultThresholds'){
      this.toolTipTest = "Default Template cannot be deleted";
    }
    else{
      this.toolTipTest = "Delete";
    }
  }

  selectFormat(){
    this.checkIncludeChart = true;
    this.checkMetricsCharts = true;
    this.checkMetricsSummary = true;
    this.checkOverrideChart = false;
  }
  // This method for get preset, ViewBy and Time Period Value
  presetTimeCall() {
    const me = this;

    me.subscribe = me.addReportService.pre().subscribe(
      (state: Store.State) => {
        if (state instanceof ReportTimebarLoadingState) {
          me.presetLoading(state);
          return;
        }

        if (state instanceof ReportTimebarLoadedState) {

          me.presetLoaded(state);
          return;
        }
      },
      (state: ReportTimebarLoadingErrorState) => {
        me.presetLoadingError(state);
      }
    );
  }

  presetLoading(state) { }
  presetLoaded(state) {
    if(state.data.timePeriod.options.length == 4){
    state.data.timePeriod.options.pop();
    }
    if(this.sessionService.session.cctx.prodType === "NetDiagnostics"){
    if(state.data.viewBy.options[0].label === "Auto"){
      state.data.viewBy.options.splice(0,1);
    }
  }
    this.preparedPreset(state.data, true);
  }
  presetLoadingError(state) { }

  addSettings() {
    this.router.navigate(['/add-report-setting']);
  }
  
  onTimeFilterCustomTimeChange() {
    const me = this;
    let refDateTimeFrame = [...me.dateTimeFrame];
    setTimeout(() => {
      if (me.dateTimeFrame && me.dateTimeFrame.length === 2) {
        if (
          me.dateTimeFrame[0] !== null && me.dateTimeFrame[1] !== null && me.dateTimeFrame[0].valueOf() == me.dateTimeFrame[1].valueOf()
        ) {
          const me = this;
          me.invalidDate = true;
          if(me.invalidDate){
            this.messageService.add({severity:"error", summary:"Custom Date/Time", detail:"Start Date and End Date cannot be same." });
          }
          me.dateTimeFrame = [
            refDateTimeFrame[0],
            refDateTimeFrame[1]
          ];
        } else if(me.dateTimeFrame[0] === null){
          me.invalidDate = true;
          if(me.invalidDate){
            this.messageService.add({severity:"error", summary:"Custom Date/Time", detail:"End Date should be greater than start Date." });
          }
          me.dateTimeFrame = [
            refDateTimeFrame[0],
            refDateTimeFrame[1]
          ];
        }
        else if(me.dateTimeFrame[1] === null){
          me.invalidDate = true;
          if(me.invalidDate){
            this.messageService.add({severity:"error", summary:"Custom Date/Time", detail:"Start Date should not greater than End Date." });
          }
          me.dateTimeFrame = [
            refDateTimeFrame[0],
            refDateTimeFrame[1]
          ];
        }else {
          me.invalidDate = false;
          const timePeriod = me.addReportService.getCustomTime(
            me.dateTimeFrame[0].valueOf(),
            me.dateTimeFrame[1].valueOf()
          );

          me.setTmpValue({
            timePeriod: timePeriod,
          });
        }
      }
    });
  }

  validateOnTimeFilterCustomTimeChange() {
    const me = this;
    let refDateTimeFrame = [...me.dateTimeFrame];
    
      if (me.dateTimeFrame && me.dateTimeFrame.length === 2) {
        if (
          me.dateTimeFrame[0] !== null && me.dateTimeFrame[1] !== null
        ) {
          
          const me = this;
          me.invalidDate = true;
          if(me.dateTimeFrame[0].valueOf() === me.dateTimeFrame[1].valueOf()){
            console.log('start date ', me.dateTimeFrame[0].valueOf());
            console.log('end date ', me.dateTimeFrame[1].valueOf());
          if(me.invalidDate){
            this.messageService.add({severity:"error", summary:"Custom Date/Time", detail:"Start Date and End Date cannot be same." });
            
          }
          return false;
        }
        else if(me.dateTimeFrame[0].valueOf() > me.dateTimeFrame[1].valueOf()){
          if(me.invalidDate){
            this.messageService.add({severity:"error", summary:"Custom Date/Time", detail:"Start Date should not be greater than End Date" });
            
          }
          return false;
        }
          me.dateTimeFrame = [
            refDateTimeFrame[0],
            refDateTimeFrame[1]
          ];
        }
        else if(me.dateTimeFrame[0] == null && me.dateTimeFrame[1] == null){
          me.invalidDate = true;
          if(me.invalidDate){
            this.messageService.add({severity:"error", summary:"Custom Date/Time", detail:"Please enter start Date and End Date." });
            
          }
          me.dateTimeFrame = [
            refDateTimeFrame[0],
            refDateTimeFrame[1]
          ];
          return false;
        } else if(me.dateTimeFrame[0] === null){
          me.invalidDate = true;
          if(me.invalidDate){
            this.messageService.add({severity:"error", summary:"Custom Date/Time", detail:"Please enter start Date." });
            
          }
          me.dateTimeFrame = [
            refDateTimeFrame[0],
            refDateTimeFrame[1]
          ];
          return false;
        }
        else if(me.dateTimeFrame[1] === null){
          me.invalidDate = true;
          if(me.invalidDate){
            this.messageService.add({severity:"error", summary:"Custom Date/Time", detail:"Please enter End Date." });
            
          }
          me.dateTimeFrame = [
            refDateTimeFrame[0],
            refDateTimeFrame[1]
          ];
          return false;
        }
      }
    
    return true;
  }
  
  private setTmpValue(input: TimebarValueInput): Observable<TimebarValue> {
    const me = this;
    const output = new Subject<TimebarValue>();
    me.addReportService
      .prepareValue(input, me.tmpValue)
      .subscribe((value: TimebarValue) => {
        const timeValuePresent = _.has(value, 'time.frameStart.value');
        if (value && timeValuePresent) {
          me.tmpValue = me.prepareValue(value);
          let timeBack = me.tmpValue.timePeriod.selected.id;
          if (timeBack !== "TB0" && timeBack !== "TB1" && timeBack !== "TB2" && timeBack !== "TB3") {
            if(this.firstTimeCustom){
              let date1 = new Date();
              date1.setHours(0);
              date1.setMinutes(0);
              date1.setSeconds(0);
              me.dateTimeFrame = [
                moment(this.srt).zone(
                  this.sessionService.selectedTimeZone.offset
                  ),
              moment(me.tmpValue.time.frameEnd.value).zone(
              this.sessionService.selectedTimeZone.offset
              ),
              ];
              this.firstTimeCustom=false;
              }else{
            me.dateTimeFrame = [
              moment(me.tmpValue.time.frameStart.value).zone(
                this.sessionService.selectedTimeZone.offset
                ),
              moment(me.tmpValue.time.frameEnd.value).zone(
                this.sessionService.selectedTimeZone.offset
                ),
            ];
          }
          }
          output.next(me.tmpValue);
          output.complete();
        } else {
          me.tmpValue = null;
          output.next(me.tmpValue);
          output.complete();
        }
      });

    return output;
  }

  prepareValue(value: TimebarValue): TimebarValue {
    const me = this;

    MenuItemUtility.map((item: MenuItem) => {
    //  item.url = '';
      item.command = () => {
        if (!item.items) {
          me.tmpValue.timePeriod.selected = item;
          me.validateTimeFilter(true);
        }
      };
    }, value.timePeriod.options);

    MenuItemUtility.map((item: MenuItem) => {
    //  item.url = '';
      item.command = () => {
        if (!item.items) {
          me.tmpValue.viewBy.selected = item;
          me.validateTimeFilter(false);
        }
      };
    }, value.viewBy.options);

    return value;
  }

  private validateTimeFilter(clearViewBy?: boolean) {
    const me = this;

    const input: TimebarValueInput = {
      timePeriod: me.tmpValue.timePeriod.selected.id,
      viewBy: me.tmpValue.viewBy.selected.id,
      running: me.tmpValue.running,
      discontinued: me.tmpValue.discontinued,
      includeCurrent: me.tmpValue.includeCurrent,
    };
    if (clearViewBy) {
      input.viewBy = null;
      me.setTmpValue(input);
    }
    
  }

  changeReportType(event: any) {
    //update the ui
    this.addReportService.isHeirarchical = false;
    this.reportName = null;
    this.msrName = null;
    this.preset= true;
    this.checkIncludeChart = true;
    this.addReportService.checkIncludeChart = this.checkIncludeChart;
    this.isEnableFilter=false;
    this.checkShowAllSample = false;
    this.checkTrendCompare = false;
    this.skipVectorMapping = true;
    this.checkExcelOverridePreset = false;
    this.selectedAggregateOverEntireReport = true;
    this.showUnusedTransactions= false;
    this.showTransactionError= false;
    this.checkOverrideChart = false;
    this.isApply=false;
    this.selectedAggregateTime = { label: 'Minute', value: 'Minute' };
    this.onTimeFilterTypeChange();
    this.data.data = [];
    this.reportVisualizeType = 'TABULAR';
    this.reportType = event.value;
    this.selectedMetricOption = ReportConstant.TEMPLATE_GRAPH_REPORT;
    this.checkDisableDropDown = false;

    this.checkAnalysisSummary = true;
    this.checkPerformanceSummary = true;
    this.checkOverview = true;
    this.checkSessions = true;
    this.checkTransactions = true;
    this.checkPages = true;
    this.checkNetwork = true;
    this.checkErrors = true;
    this.checkMetricsSummary = true;
    this.checkMetricsCharts = true;

      let objectReportSetting = {
        'isAnalysisSummaryEnabled': this.checkAnalysisSummary,
        'isPerformanceSummaryEnable': this.checkPerformanceSummary,
        'isOverviewEnabled': this.checkOverview,
        'isSessionsEnabled': this.checkSessions,
        'isTransactionsEnabled': this.checkTransactions,
        'isPagesEnabled': this.checkPages,
        'isNetworkEnabled': this.checkNetwork,
        'isErrorsEnabled': this.checkErrors,
        'isMetricsSummaryEnabled': this.checkMetricsSummary,
        'isMetricsChartsEnabled': this.checkMetricsCharts,
      };
      this.objReportSetting = objectReportSetting;

    if (this.reportType.value != "Summay") {
      this.listReportTypeTemplate();
    }
   
    if(this.reportType.value === 'Summary'){
      this.showTransactionErrorEvent();
    }

    this.fillOverrideChartOption();
    if (this.reportType.value === 'Hierarchical') {
      this.addReportService.isHeirarchical = true;
      this.reportGroupDataList();
    }
  }

  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  private preparedPreset(value: TimebarValue, silent?: boolean) {
    const me = this;
    const preparedValue = ObjectUtility.duplicate(value);
    me.tmpValue = me.prepareValue(value);
    this.checkFirstTimePreset =true;
    if(this.checkFirstTimePreset){
      for(let i=0;i<value.timePeriod.options[0].items.length;i++){
        if(value.timePeriod.options[0].items[i].label == 'Today'){
          let objFor = value.timePeriod.options[0].items[i];
          value.timePeriod.selected=objFor;
        }
      }
      for (let i = 0; i < value.viewBy.options[2].items.length; i++) {
        if (value.viewBy.options[2].items[i].label === "1 Hour") {
          let objViewBy = value.viewBy.options[2].items[i];
          value.viewBy.selected= objViewBy;
        }
      }
    }
    if(this.checkFirstTimePreset){
      let date= new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
    me.dateTimeFrame = [
      moment(date.getTime()),
      moment(me.tmpValue.time.frameEnd.value).zone(
     this.sessionService.selectedTimeZone.offset
        ),
    ];
    this.checkFirstTimePreset=false;
    }
    else{
      me.dateTimeFrame = [
        moment(me.tmpValue.time.frameStart.value),
        moment(me.tmpValue.time.frameEnd.value),
      ];
    }
    if (!silent) {
      me.addReportService.setValue(me.tmpValue);
    }

    me.addReportService.setGlobalTimeBar(me.tmpValue);
    me.cd.detectChanges();
  }

  // this method used for Custom Time period on Preset disable
  onTimeFilterTypeChange() {
    const me = this;
    if (!me.preset) {
      this.firstTimeCustom = true;
      const customTime: TimebarTimeConfig = me.addReportService.getTimeConfig(
        _.get(me.tmpValue, 'timePeriod.selected.id', '')
      );
      const serverTime = moment(me.sessionService.time);
      if (customTime) {
        me.dateTimeFrame = [
          moment(customTime.frameStart.value),
          moment(customTime.frameEnd.value),
        ];
      }

      if (!me.dateTimeFrame || !me.dateTimeFrame.length) {
        me.dateTimeFrame = [
          serverTime.clone().subtract(1, 'hour'),
          serverTime.clone(),
        ];
      }

      me.dateTimeFrameMax = serverTime.clone();

      setTimeout(() => {
        me.onTimeFilterCustomTimeChange();
      });
    } else {
      this.checkFirstTimePreset =true;
      this.firstTimeCustom = false;
      me.presetTimeCall();
    }
  }

  timeBackCall() {
    const me = this;
    me.timeBckCall = true;
    me.addReportService.setTimeBck(me.timeBack);
  }

  changeMetricOption() {
    this.checkDisableDropDown = false;
    this.checkOverrideChart = false;
    this.checkIncludeChart = true;
    this.addReportService.checkIncludeChart = this.checkIncludeChart;
    this.skipVectorMapping = true;
    this.isEnableFilter = false;
    this.onChangeFilterOption()
    let id = this.getReportTypeValue(this.reportType.value, this.reportVisualizeType);
    if (this.selectedMetricOption == ReportConstant.TEMPLATE_GRAPH_REPORT) {
      this.reportVisualizeType = 'TABULAR';
      this.listReportTypeTemplate();
      this.checkDisableDropDown = false;
    }
    else if (this.selectedMetricOption == ReportConstant.Favorite_GRAPH_REPORT) {
      this.checkDisableDropDown = false;
      if(this.reportType.value === 'Performance Stats' || this.reportType.value === 'Stats'){
        this.reportVisualizeType = 'PDF';
      }else{
      this.reportVisualizeType = 'TABULAR';
      }
      this.listReportTypeTemplate();
    }
    else if (this.selectedMetricOption == ReportConstant.SELECT_GRAPH_REPORT) {
      this.addReportService.presetTime = this.tmpValue;
      this.reportVisualizeType = 'TABULAR';
      this.checkDisableDropDown = true;
    }
    this.getClearFilterforDropDownTempFav();
    // this.cancelReportSetting();
  }

  changeVisualizationType(event) {
    this.reportVisualizeType = event;
    this.checkOverrideChart = false;
    this.skipVectorMapping = true;
    this.checkShowAllSample = false;
    this.checkIncludeChart = true;
    this.checkMetricsCharts = true;
    this.checkMetricsSummary = true;
    this.checkOverrideChart = false;
    this.addReportService.checkIncludeChart = this.checkIncludeChart;
    this.addReportService.isMultiLayot = false;
    let id = this.getReportTypeValue(this.reportType.value, this.reportVisualizeType);
    if (id == ReportConstant.Cmp_HTML_Report || id == ReportConstant.Cmp_WORD_Report) {
      this.checkTrendCompare = false;
    }

    if (id == ReportConstant.HTML_REPORT) {
      // this.listReportTypeTemplate();
      this.getThresholdTemplateList();

      this.checkAnalysisSummary = true;
      this.checkPerformanceSummary = true;
      this.checkOverview = true;
      this.checkSessions = true;
      this.checkTransactions = true;
      this.checkPages = true;
      this.checkNetwork = true;
      this.checkErrors = true;
      this.checkMetricsSummary = true;
      this.checkMetricsCharts = true;

      this.checkIncludeChart = true;
      this.addReportService.checkIncludeChart = this.checkIncludeChart;
      this.checkOverrideChart = false;

      let objectReportSetting = {
        'isAnalysisSummaryEnabled': this.checkAnalysisSummary,
        'isPerformanceSummaryEnable': this.checkPerformanceSummary,
        'isOverviewEnabled': this.checkOverview,
        'isSessionsEnabled': this.checkSessions,
        'isTransactionsEnabled': this.checkTransactions,
        'isPagesEnabled': this.checkPages,
        'isNetworkEnabled': this.checkNetwork,
        'isErrorsEnabled': this.checkErrors,
        'isMetricsSummaryEnabled': this.checkMetricsSummary,
        'isMetricsChartsEnabled': this.checkMetricsCharts,
      };
      this.objReportSetting = objectReportSetting;
    }

  }

  getThresholdTemplateList(){
    const me = this;
    let reportTypeObj = {};
    reportTypeObj["rT"] = ReportConstant.HTML_REPORT;
    reportTypeObj["mO"] = 1;
    me.addReportService.listThresholdTemplate(reportTypeObj).subscribe(
      (state: Store.State) => {
        if (state instanceof ThresholdTemplateListLoadingState) {
          me.ThresholdtemplateLoading(state);
          return;
        }

        if (state instanceof ThresholdTemplateListLoadedState) {
          me.ThresholdtemplateLoaded(state);
          return;
        }
      },
      (state: ThresholdTemplateListLoadingErrorState) => {
        me.ThresholdtemplateLoadingError(state);
      }
    );
  }

  ThresholdtemplateLoading(state){}
  ThresholdtemplateLoaded(state){
    let listObj = state.data.temFavList;

    if (listObj.csv) {
      this.reportThresholdOptions = listObj.csv;
      this.selectThresholdTemp = listObj.csv[0];
      if(this.selectThresholdTemp.label == 'PerformanceDefaultThresholds'){
        this.toolTipTest = 'Default Template cannot be delated';
      }
      else{
        this.toolTipTest = 'Delete';
      }
    }

  }
  ThresholdtemplateLoadingError(state){}

  changeTempFavType(event) {
    console.log("changeTempFavType event : ", event);
    console.log("this.selectedTempFav : ", this.selectedTempFav);
  }

  getReportTypeValue(reportType, reportVisualizeType) {
    let reportId = ReportConstant.STATS_REPORT;
    this.addReportService.isCompareReport = false;
    if (reportType == "Stats") {

      if (reportVisualizeType == "TABULAR") {
        reportId = ReportConstant.STATS_REPORT;;
      }
      else if (reportVisualizeType == "WORD") {
        this.addReportService.isMultiLayot = true;
        reportId = ReportConstant.WORD_REPORT;
      }
      else if (reportVisualizeType == "HTML") {
        reportId = ReportConstant.HTML_REPORT;
      }
      else if (reportVisualizeType == "PDF") {
        reportId = ReportConstant.CUSTOM_PDF_REPORT;
      }

    }
    else if (reportType == "Compare") {
      this.addReportService.isCompareReport = true;
      if (reportVisualizeType == "TABULAR") {
        reportId = ReportConstant.COMPARE_REPORT;
      }
      else if (reportVisualizeType == "WORD") {
        reportId = ReportConstant.Cmp_WORD_Report;
      }
      else if (reportVisualizeType == "HTML") {
        reportId = ReportConstant.Cmp_HTML_Report;
      }
    }
    else if (reportType == "Excel") {
      reportId = ReportConstant.EXCEL_REPORT;
    }
    else if (reportType == "Hierarchical") {
      reportId = ReportConstant.HIERARCHICAL_REPORT;
    }
    else if (reportType == "Summary") {
      reportId = ReportConstant.SUMMARY_REPORT;
    }
    return reportId;
  }

  reportSetting() {
    this.displayReportSetting = true;
  }

  updateReportSetting() {
    try {

      if (this.checkPerformanceSummary == false) {
        this.checkOverview = false;
        this.checkPages = false;
        this.checkSessions = false;
        this.checkTransactions = false;
        this.checkNetwork = false;
        this.checkErrors = false;
      }
      else {
        this.checkOverview = true;
        this.checkPages = true;
        this.checkSessions = true;
        this.checkTransactions = true;
        this.checkNetwork = true;
        this.checkErrors = true;
      }

    }
    catch (error) {
      console.error("error :", error);
    }
  }

  updateSubReportSetting() {
    try {

      if (this.checkOverview == true || this.checkSessions == true || this.checkTransactions == true || this.checkPages == true || this.checkNetwork == true || this.checkErrors == true) {
        this.checkPerformanceSummary = true;
      }
      else {
        this.checkPerformanceSummary = false;
      }

    }
    catch (error) {
      console.error("error : ", error);
    }
  }

  applyReportSetting() {
    try {
      let objectReportSetting = {};

      if (this.checkAnalysisSummary == false && this.checkPerformanceSummary == false && this.checkOverview == false && this.checkSessions == false && this.checkTransactions == false && this.checkPages == false && this.checkNetwork == false && this.checkErrors == false && this.checkMetricsSummary == false && this.checkMetricsCharts == false && this.checkMetricsSummary == false && this.checkMetricsCharts == false) {
        this.confirmationDialog("Error", "Please select at least one option.");
        return;
      }
      else {
        this.displayReportSetting = false;
      }
      this.addReportService.checkIncludeChart = this.checkMetricsCharts;
      this.checkIncludeChart = this.checkMetricsCharts;
      objectReportSetting = {
        'isAnalysisSummaryEnabled': this.checkAnalysisSummary,
        'isPerformanceSummaryEnable': this.checkPerformanceSummary,
        'isOverviewEnabled': this.checkOverview,
        'isSessionsEnabled': this.checkSessions,
        'isTransactionsEnabled': this.checkTransactions,
        'isPagesEnabled': this.checkPages,
        'isNetworkEnabled': this.checkNetwork,
        'isErrorsEnabled': this.checkErrors,
        'isMetricsSummaryEnabled': this.checkMetricsSummary,
        'isMetricsChartsEnabled': this.checkMetricsCharts,
      };

      this.objReportSetting = objectReportSetting;
      this.isApply=true;
    }
    catch (error) {
      console.error("error : " , error);
    }
  }

  cancelReportSetting() {
    try {
      this.displayReportSetting = false;
      if(!this.isApply){
      this.checkAnalysisSummary = true;
      this.checkPerformanceSummary = true;
      this.checkOverview = true;
      this.checkSessions = true;
      this.checkTransactions = true;
      this.checkPages = true;
      this.checkNetwork = true;
      this.checkErrors = true;
      this.checkMetricsSummary = true;
      this.checkMetricsCharts = true;
      }else{
      let objectReportSetting = {
        'isAnalysisSummaryEnabled': this.checkAnalysisSummary,
        'isPerformanceSummaryEnable': this.checkPerformanceSummary,
        'isOverviewEnabled': this.checkOverview,
        'isSessionsEnabled': this.checkSessions,
        'isTransactionsEnabled': this.checkTransactions,
        'isPagesEnabled': this.checkPages,
        'isNetworkEnabled': this.checkNetwork,
        'isErrorsEnabled': this.checkErrors,
        'isMetricsSummaryEnabled': this.checkMetricsSummary,
        'isMetricsChartsEnabled': this.checkMetricsCharts,
      };
      this.objReportSetting = objectReportSetting;

      }
    }
    catch (error) {
      console.error("error :", error);
    }
  }

  downloadViewFile(event) {
    let url = window.location.protocol + '//' + window.location.host;
    if (event == "Threshold" && this.selectThresholdTemp && this.selectThresholdTemp.value && (this.selectThresholdTemp.value === '' ||
      this.selectThresholdTemp.value === '.undefined')) {
      this.confirmationDialog("Error", "No File selected.");
      return;
    }

    if (event == "Excel" && this.selectedExcelTemp.value && (this.selectedExcelTemp.value === ''
      || this.selectedExcelTemp.value === '.undefined')) {
      this.confirmationDialog("Error", "No File selected.");
      return;
    }

    if (event === "Threshold") {
      url = url + '/templates/thresholdTemplates/' + encodeURIComponent(this.selectThresholdTemp.value) + ".csv";
      this.messageService.add({severity:"success", summary:"Threshold Download", detail:"Threshold" + " " +this.selectThresholdTemp.value+ " "
      + "downloaded successfully." });
    }
    else if (event === "Excel") {
      url = url + '/templates/excel_templates/' + encodeURIComponent(this.selectedExcelTemp.value);
      this.messageService.add({severity:"success", summary:"Template Download", detail:"Template" + " " +this.selectedExcelTemp.label+ " " +"downloaded successfully" });
    }

    window.open(url);
    return;
  }

  getCsvFileFromServer(isAfterUpload, name) {
    this.listReportTypeTemplate();
  }

  afterTemplateUpload(event, typeTemplate) {
    try {
          let varr = " ";
          if (typeTemplate === "Excel") {
            varr = "Template";
            this.reportExcelTempOptions.push({ label: event.files[0].name.split(".")[0], value: event.files[0].name });
            this.fileUploadExcel.clear();
            this.listReportTypeTemplate();
          }
          else if (typeTemplate === "Threshold") {
            varr = "Threshold";
            this.reportThresholdOptions.push({ label: event.files[0].name.split(".")[0], value: event.files[0].name.split(".")[0] });
            this.fileUploadThreshold.clear();
            this.listReportTypeTemplate();
          }
          this.messageService.add({severity:"success", summary:"Upload", detail:varr+" "+ event.files[0].name.split(".")[0]+" Uploaded successfully." });
          this.toolTip="";
        } catch (error) {
      console.error(error);
    }
  }

  onSelectTemplateToUpload(event, typeTemplate) {
    try {

      let url = window.location.protocol + '//' + window.location.host;
      if(this.sessionService.preSession.multiDc){
        let master = this.sessionService.preSession.dcData.find((info) => {if(info.master){return info}});
        let lastindex =  master['tomcatURL'].lastIndexOf("/");
        url =  master['tomcatURL'].substring(0,lastindex);
      }
      let productKey = this.sessionService.session.cctx.pk;
      let userName = this.sessionService.session.cctx.u;
      let path = environment.api.report.uploadTemplate.endpoint;
      let uploadFile = event.files[0].name;
      this.toolTip = uploadFile;

      // let isDuplicateAllow = false;
      if(typeTemplate === "Excel"){
        this.optionArr=this.reportExcelTempOptions;
      }
      else{
        this.optionArr= this.reportThresholdOptions;
      }
      if (typeTemplate === "Excel") {
        if (uploadFile.substring(uploadFile.lastIndexOf(".")) != '.xls' && uploadFile.substring(uploadFile.lastIndexOf(".")) != '.xlsx') {
          this.dialogVisible = true;
          this.confirmationService.confirm({
            key: 'addReportDialogue',
            message: "Please select correct Excel Template file",
            header: "Error",
            accept: () => { this.dialogVisible = false;this.toolTip=""; this.fileUploadExcel.clear(); return; },
            rejectVisible: false
          });
          return;
        }
        this.fileURL = url + environment.api.core.defaultBase + path +
          '?fileName=' + uploadFile + "&productKey=" + productKey +
          "&userName=" + userName + "&rT=" + ReportConstant.EXCEL_REPORT;
      }
      else if (typeTemplate === "Threshold") {
        let thresholdNameWithoutExtension=uploadFile.split(".csv");
        if(thresholdNameWithoutExtension[0].length >128){
          this.confirmationDialog("Error","Length of file name should be less than 128 characters.");
          this.fileUploadThreshold.clear();
          this.toolTip="";
          return;
        }
        if(uploadFile.substring(uploadFile.lastIndexOf(".")) != '.csv'){
            this.dialogVisible = true;
            this.confirmationService.confirm({
              key: 'addReportDialogue',
              message: "Please select correct csv file",
              header: "Error",
              accept: () => { this.dialogVisible = false;this.toolTip=""; this.fileUploadThreshold.clear(); return; },
              rejectVisible: false
            });
            return;
          }
        this.fileURL = this.fileURL = url + environment.api.core.defaultBase + path +
          '?fileName=' + uploadFile + "&productKey=" + productKey +
          "&userName=" + userName + "&rT=" + ReportConstant.HTML_REPORT;

      }
      for (let i = 0; i < this.optionArr.length; i++) {
        if (uploadFile === this.optionArr[i].value) {
          // isDuplicateAllow = true;
          this.confirmationService.confirm({
            message: 'Template ' +uploadFile+ ' already present. Do you want to overwrite ?',
            header: 'Confirmation',
            // icon: 'fa fa-question-circle',
            key: 'addReportDialogue',
            accept: () => {
              this.dialogVisible = false;
              this.toolTip=uploadFile;
            },
            reject: () => {
              this.dialogVisible = false;
              this.toolTip="";
              this.fileUploadExcel.clear();
              return;
            }
          });
          return;
        }
        else{
          if(typeTemplate === "Threshold"){
            let loadFile = uploadFile.split(".");
            if (loadFile[0] === this.optionArr[i].value) {
              this.confirmationService.confirm({
                message: 'Threshold ' +loadFile+ ' already present. Do you want to overwrite ?',
                header: 'Confirmation',
                // icon: 'fa fa-question-circle',
                key: 'addReportDialogue',
                accept: () => {
                  this.dialogVisible = false;
                  this.toolTip=loadFile;
                },
                reject: () => {
                  this.dialogVisible = false;
                  this.toolTip="";
                  this.fileUploadThreshold.clear();
                  return;
                }
              });
              return;
            }
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
    let nameWithoutExtension = event.files[0].name.split(".xls");
    let nameWithoutExtensionThreshold = event.files[0].name.split(".csv");
    if(typeTemplate === "Excel" && (nameWithoutExtension[0].includes(".") || nameWithoutExtension[0].includes("/") || nameWithoutExtension[0].includes("#") || nameWithoutExtension[0].includes('"'))){
      this.confirmationDialog("Error","Excel Template with following special symbols(#./) and double quotation symbols are not allowed.");
      this.fileUploadExcel.clear();
      this.toolTip="";
      return;
    }
    if(typeTemplate === "Threshold" && (nameWithoutExtensionThreshold[0].includes(".") || nameWithoutExtensionThreshold[0].includes("/") || nameWithoutExtensionThreshold[0].includes("#") || nameWithoutExtension[0].includes('"'))){
      this.confirmationDialog("Error","Threshold with following  special symbols (#./) and double quotation symbols are not allowed.");
      this.fileUploadThreshold.clear();
      this.toolTip="";
      return;
    } 
  }

  conclusionSummaryEvent() {
    // this.conclusionSummary;
  }

  executiveSummaryEvent() {
    // this.executiveSummary;
  }

  styleForDialog(event) {
    return { width: '350px', minWidth: '200px' };
  }

  getMetaDataStr() {
    let jsonHierarchicalArr = this.selectedHierarchichyNgModel;

    let dataStr = '';
    for (let i = 0; i < jsonHierarchicalArr.length; i++) {
      if (i == 0 && jsonHierarchicalArr[i] === '--Select--') {
        return dataStr = null;
      }

      if (jsonHierarchicalArr[i] !== '--Select--') {
        if (i == 0) {
          dataStr = dataStr + jsonHierarchicalArr[i];

        }
        else {
          dataStr = dataStr + '>' + jsonHierarchicalArr[i];
        }
      }
    }
    return dataStr;
  }
  getMetricsSource(genRptPayload){
    const me=this;
    if(me.sessionService.preSession.multiDc && genRptPayload.basic.rType != ReportConstant.SUMMARY_REPORT){
      console.log("going to generate report for multi cluster = ",genRptPayload); 
        
      me.addReportService.getMetricService(genRptPayload).subscribe(
        (state: Store.State) => {
          if (state instanceof getMetricServiceLoading) {
            me.getMetricServiceLoadingState(state);
            return;
          }
  
          if (state instanceof getMetricServiceLoaded) {
            me.getMetricServiceLoadedState(state,genRptPayload);
            return;
          }
        },
        (state: getMetricServiceLoadingError) => {
          me.getMetricServiceLoadingErrorState(state);
        }
      );
   // me.getChartAndReportData(genRptPayload);
    }
 else{
      console.log("going to generate report for single cluster = ",genRptPayload); 
      me.getGeneratedReport(genRptPayload);
  }
}
  generateReport() {
    const me = this;
    SETTINGS_TABLE.paginator.first = 0;
    SETTINGS_TABLE.paginator.rows = 10;
    if (this.reportName === '' || this.reportName == null) {
      this.confirmationDialog("Error", "Please Enter Report Name");
      return;
    }
    if(me.validateOnTimeFilterCustomTimeChange()){
    let regex_filter_validation = new RegExp('^[0-9]*$');
    let selectedFilterBy: any = me.filterFirstValue;
    if ((me.selectedOperator.label === "Top" || me.selectedOperator.label === "Bottom")
    && selectedFilterBy <= 0) {
      this.confirmationDialog("Error", "Invalid input type given, Please enter a Numeric value greater than Zero for advance filter.");
      return;
    }
    if ((me.selectedOperator.label === "Top" || me.selectedOperator.label === "Bottom")
      && !regex_filter_validation.test(selectedFilterBy)) {
      this.confirmationDialog("Error", "Invalid input type given, Please enter a Numeric value for advance filter(Without decimal).");
      return;
    }
    let regex_report_name = new RegExp('^[a-zA-Z][a-zA-Z0-9_().{}\:\]*$');
    let rpt = this.reportName;
    if (!regex_report_name.test(rpt)) {
      this.confirmationDialog("Error", "Please enter valid Report Name.\r\nReport "
        + "name must start with alphabet. \r\n Maximum length is 128. \r\nAllowed "
        + "characters are alphanumeric and  following special characters: ( ) { } _  . \ :")
      return;
    }
    if (this.reportName.length > 128) {
      this.confirmationDialog("Error", "Enter Report Name <= 128 characters.");
      return;
    }

    for (let i = 0; i < this.metricsService.reportListArray.listGenRptInfo.length; i++) {
      this.reportTypeFromList = this.metricsService.reportListArray.listGenRptInfo[i].rT;
      if(this.reportTypeFromList == 'Performance Stats (Tabular)'){
        this.reportTypwWithoutType=this.reportTypeFromList.split(' ');
        this.finalName=this.reportTypwWithoutType[1];
      }else{
        this.reportTypwWithoutType=this.reportTypeFromList.split(' ');
        this.finalName=this.reportTypwWithoutType[0];
      }
      if (this.reportName == this.metricsService.reportListArray.listGenRptInfo[i].rN && this.reportType.value == this.finalName) {
        this.confirmationDialog("Error", "Duplicate report name.Please enter unique name.");
        return;
      }
    }
    let ft = null;
      if (this.isEnableFilter) {
        if (this.selectedCategory == 'All') {
          ft = {"in": true,
          "opt": ">",
          "typ": [0, 7],
          "val1": 0,
          "val2": -1
        }
        }
        else if (this.selectedCategory == 'Zero') {
          ft = {
            "in": true,
            "opt": "=",
            "typ": [0, 7],
            "val1": 0,
            "val2": -1
          }
        }
        else if (this.selectedCategory == 'Advance') {
          if (this.selectedOperator.value == ReportConstant.IN_BETWEEN) {
            let firstcheck = this.numericCheckUptoThreeDec(this.filterFirstValue);
            if (!firstcheck) {
              this.confirmationDialog("Error", "Invalid input type given, Please enter a Numeric value for advance filter( decimal upto 3 digits)");
              return;
            }
            let secondcheck = this.numericCheckUptoThreeDec(this.filterSecondValue);
            if (!secondcheck) {
              this.confirmationDialog("Error", "Invalid input type given, Please enter a Numeric value for advance filter( decimal upto 3 digits)");
              return;
            }
          }
          else {
            let firstcheck = this.numericCheckUptoThreeDec(this.filterFirstValue);
            if (!firstcheck) {
              this.confirmationDialog("Error", "Invalid input type given, Please enter a Numeric value for advance filter( decimal upto 3 digits)");
              return;
            }
          }
          let typ =  [this.selectedfilterValue];
          let inc = false;
          let val1 = -1;
          let val2 = -1;
          if(this.selectedfilterInclude === "Include"){
            inc = true;
            typ.push(7);
          }
          if(this.filterFirstValue){
            val1 = this.filterFirstValue;
          }
          if(this.filterSecondValue){
            val2 = this.filterSecondValue;
          }
          ft = {
            opt: this.selectedOperator.label,
            in: inc,
            typ: typ,
            val1: val1,
            val2: val2
          }
        }
      }

      let startDate;
      if(this.tmpValue.timePeriod.selected.id === "LIVE10"){
        if(this.srt){
        startDate = this.srt;
        } 
      }else{
        startDate = this.dateTimeFrame[0].valueOf();
      }
    let endDate = this.dateTimeFrame[1].valueOf();
    let payload = {
      cctx: this.sessionService.session.cctx,
      basic: {
        tr: parseInt(this.sessionService.session.testRun.id),
        rType: this.getReportTypeValue(this.reportType.value, this.reportVisualizeType),
        rName: this.reportName,
        rptSource: 0,
        ft: ft,
      },
      preset: {
        duration: {
          st: startDate, // Start Date Time In mili
          et: endDate, //End Data Time In mili
          preset: this.tmpValue.timePeriod.selected.id, // Preset
          viewBy: parseInt(this.tmpValue.viewBy.selected.id) //View By
        },
        cMode: this.sessionService.testRun.running, // Continuous mode
        online: this.sessionService.testRun.running //Test is running
      },
      metric: {
      }

    };

    if (this.reportType.value === "Stats") {
      if (this.selectedMetricOption != ReportConstant.SELECT_GRAPH_REPORT) {
        payload.metric = {
          mOpt: this.selectedMetricOption, //(2 forUsing template),(1 for Select Metrics),(4 for Using Fav)
          tName: this.selectedTempFav.value, //Template or Fav name
          inChart: this.checkIncludeChart //Include chart
        }
        if(this.checkIncludeChart && this.checkOverrideChart){          
          payload.metric['glbCT'] = this.selectedOverrideChartType;
        }
      }

      if (this.selectedMetricOption == ReportConstant.SELECT_GRAPH_REPORT) {
        let reportSetData = this.addReportSettingsService.reportSetData;
        if (reportSetData == undefined || reportSetData.length == 0) {
          me.confirmationDialog("Error", "Please Add atleast one Report Set.");
          return;
        }
        payload.metric['mOpt'] = this.selectedMetricOption;
        payload.metric['selMtrData'] = reportSetData; //Used in case of select Metrics
      }


      payload['stats'] = {
        shwAllDataSam: this.checkShowAllSample //Show All Data Samples
      }
    }
    else if (this.reportType.value === "Excel") {

      let aggUnitTime = "";
      let aggValue = -1;
      let lastWeekDayWise = false;
      let rptViewTabCol = 0;
      if (!this.selectedAggregateOverEntireReport) {
        aggUnitTime = this.selectedAggregateTime.value;
        aggValue = this.selectedAggregateBy.value;
        lastWeekDayWise = this.checklastWeek;
        rptViewTabCol = this.selectedShowReportOptions.value;
      }
      if( this.selectedExcelTemp == undefined){
        this.confirmationDialog("Error","No template is available.");
      }
      payload.metric = {
        tName: this.selectedExcelTemp.value
      }
      payload['excel'] = {
        timeFrTem: this.checkExcelOverridePreset,
        aggUnit: aggUnitTime, // minutes houes week
        lastWkDataDayWise: lastWeekDayWise, // in case week
        aggVal: aggValue, // by value
        rptView: rptViewTabCol// tab 1, column 0
      }
    }
    else if (this.reportType.value === "Summary") {
      payload.metric = {
        mOpt: 2, //(2 forUsing template),(1 for Select Metrics),(4 for Using Fav)
        tName: 'SummaryReportTemplate', //Template or Fav name
      }

      payload['summary'] = {
        perVal: this.selectedSummaryPerModel,
        shwTransErr: this.showTransactionError,
        shwTransErrChgPer: this.showTransactionErrorPerChange,
        detailTransColName: this.selectedTransactionCol,
        transErrCodeName: this.selectedTransactionErrorCode,
        sumStEnTimeList: [{
          st: startDate, // Start Date Time In mili
          et: endDate, //End Data Time In mili
          preset: this.tmpValue.timePeriod.selected.id, // Preset
          viewBy: parseInt(this.tmpValue.viewBy.selected.id) //View By
        }]
      }
    }
    else if (this.reportType.value === "Compare") {
      let msrObjectArr = [];
      if (this.selectedMetricOption != ReportConstant.SELECT_GRAPH_REPORT) {
        payload.metric = {
          mOpt: this.selectedMetricOption, //(2 forUsing template),(1 for Select Metrics),(4 for Using Fav)
          tName: this.selectedTempFav.value, //Template or Fav name
          inChart: this.checkIncludeChart //Include chart
        }
        if(this.checkIncludeChart && this.checkOverrideChart){
          payload.metric['glbCT'] = this.selectedOverrideChartType;
        }
      }
      if (this.selectedMetricOption == ReportConstant.SELECT_GRAPH_REPORT) {
        let reportSetData = this.addReportSettingsService.reportSetData;
        if (reportSetData == undefined || reportSetData.length == 0) {
          me.confirmationDialog("Error", "Please Add atleast one Report Set.");
          return;
        }
        payload.metric['mOpt'] = this.selectedMetricOption;
        payload.metric['selMtrData'] = reportSetData; //Used in case of select Metrics
      }

      if (this.selectedRow.length == 0) {
        this.confirmationDialog("Error", 'Please add atleast one measurement row');
        return;
      }


      for (let i = 0; i < this.data.data.length; i++) {
        let msrObj = {
          duration: {
            st: Date.parse(this.data.data[i].sTime),
            et: Date.parse(this.data.data[i].eTime),
            preset: this.data.data[i].preset,
            viewBy: this.data.data[i].viewBy
          },
          msrName: this.data.data[i].measurementName
        };
        msrObjectArr.push(msrObj);
      }
      payload['compare'] = {
        msrInfo: msrObjectArr,
        dataVal: this.selectedCmpDataValue.value,
        trend: this.checkTrendCompare,
        generators: false,
        vecMapp: false
      }
    }
    else if (this.reportType.value === "Hierarchical") {
      if (this.selectedMetricOption != ReportConstant.SELECT_GRAPH_REPORT) {
        payload.metric = {
          mOpt: this.selectedMetricOption, //(2 forUsing template),(1 for Select Metrics),(4 for Using Fav)
          tName: this.selectedTempFav.value, //Template or Fav name
          inChart: this.checkIncludeChart //Include chart
        }

      }

      if (this.selectedMetricOption == ReportConstant.SELECT_GRAPH_REPORT) {
        let reportSetData = this.addReportSettingsService.reportSetData;
        if (reportSetData == undefined || reportSetData.length == 0) {
          me.confirmationDialog("Error", "Please Add atleast one Report Set.");
          return;
        }
        payload.metric['mOpt'] = this.selectedMetricOption;
        payload.metric['selMtrData'] = reportSetData; //Used in case of select Metrics
      }

      payload['hierarchical'] = {
        mData: this.getMetaDataStr()
      }

    }
    me.getMetricsSource(payload);
    this.blockedDocument = true;
    this.display = true;
    
    //this.router.navigate(['/reports']);
  }
  }

  getGeneratedReport(payload){
    const me=this;
    me.addReportService.generateReport(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof GenerateReportLoadingState) {
          me.generateReportLoading(state);
          return;
        }

        if (state instanceof GenerateReportLoadedState) {
          me.generateReportLoaded(state);
          return;
        }
      },
      (state: GenerateReportLoadingErrorState) => {
        me.generateReportLoadingError(state);
      }
    );
  }

  getMetricServiceLoadingState(state){}
  getMetricServiceLoadedState(state,payload){
    const me=this;
    if(payload.basic.rType == ReportConstant.EXCEL_REPORT){
      payload.metric['excelTemplate']=state.data['excelTemplate'];
    }else{
      payload.metric['parser']=state.data.parser;
    }
    me.getChartAndReportData(payload);
  }
  getMetricServiceLoadingErrorState(state){}

  generateReportLoading(state) { 
    const me=this;
    me.timebarService.setLoading(true);
  }
  generateReportLoaded(state) { 
    const me=this;
    me.timebarService.setLoading(false);
    let dataAfterReportGeneration = state.data;
    if (dataAfterReportGeneration.reportGenStatus == true) { 
      this.reportsService.successReportGeneration = true;
      this.reportsService.reportName = state.data.rName;
      this.reportsService.reportType = state.data.rType;
      this.metricsService.loadMetricsTable(null);
      this.openReport(state);
      this.addReportSettingsService.reportSetData = [];   
    }
      else{
        this.dialogVisible = true;
        this.blockedDocument = false;
          this.confirmationService.confirm({
          key: 'addReportDialogue',
          message: "Report Not Generated Successfully.",
          header: "Error",
          accept: () => { this.dialogVisible = false;return;},
          });
          return;
      }  
  }

  generateReportLoadingError(state) {
    const me=this;
    me.timebarService.setLoading(false);
   }

   onClose() {
    this.display = false;
    this.confirmationService.confirm({
      message: 'Report Generation process is running in Back-Ground. After report generated,you will see report in Report GUI Management Window.',
      header: 'Generate Report in Back-Ground',
      // icon: 'fa fa-question-circle',
      key: 'addReportDialogue',
      accept: () => {
        this.dialogVisible = false;
        this.blockedDocument = true;
	      this.display = false;
        this.metricsService.loadMetricsTable(null);
      },
	    rejectVisible : false
    });
  }

  pathForReportsAccordingProductMulti(productName): string {
    let path = '';
    if (productName.toLowerCase() === 'nvsm' || productName.toLowerCase() === 'netstorm') {
      path = 'netstorm/analyze/';
    } else if (productName.toLowerCase() === 'netdiagnostics') {
      path = 'netdiagnostics/analyze/';
    } else if (productName.toLowerCase() === 'netcloud') {
      path = 'netcloud/analyze/';
    } else {
      path = 'netdiagnostics/analyze/';
    }
    return path;
  }

  pathForReportsAccordingProduct(productName): string {
    let path = '';
    if (productName.toLowerCase() === 'nvsm' || productName.toLowerCase() === 'netstorm') {
      path = 'netstorm/analyze/reports/';
    } else if (productName.toLowerCase() === 'netdiagnostics') {
      path = 'netdiagnostics/analyze/reports/';
    } else if (productName.toLowerCase() === 'netcloud') {
      path = 'netcloud/analyze/reports/';
    } else {
      path = 'netdiagnostics/analyze/reports/';
    }
    return path;
  }

  openReport(state) {
    try {
      
        let reportDirName = 'reports';
        let reportTypeNew = state.data.rType;
        let tr = state.data.tr;
        let pk = state.data.cctx.pk;
        let productName = state.data.cctx.prodType;
        let userName = state.data.cctx.u;
        let url = window.location.protocol + '//' + window.location.host + '/';
        let productNameForOpenReport = '';
        if (this.isProductTypeNVSM) {
          productNameForOpenReport = 'NVSM';
        } else {
          productNameForOpenReport = productName;
        }
        setTimeout(() => {
        if (reportTypeNew === ReportConstant.WORD_REPORT) {
          window.open(url + '../../../logs/TR' + tr + "/" + reportDirName + '/wordReports/' + this.reportName +
            '/' + this.reportName + '.rtf?testRun=' + tr + '&WAN_ENV=0&radRunPhase=0&testMode=W' + "&productKey=" + pk);
        }
        else if (reportTypeNew === ReportConstant.HTML_REPORT) {
          window.open(url + '../../../logs/TR' + tr + '/' + reportDirName + '/htmlReports/' + this.reportName
            + '/index.html?testRun=' + tr + '&WAN_ENV=0&radRunPhase=0&testMode=W' + "&productKey=" + pk);
        }
        else if (reportTypeNew === ReportConstant.CUSTOM_PDF_REPORT) {
          window.open(url + "../../../logs/TR" + tr + "/" + reportDirName + "/customPdfReport/"
            + this.reportName + "/" + this.reportName + ".pdf");
        }
        else if (reportTypeNew == ReportConstant.EXCEL_REPORT) {
          if (state.data.tName.substring(state.data.tName.lastIndexOf('.') + 1).endsWith("xls")) {
            window.open(url + "../../../logs/TR" + tr + "/" + reportDirName + "/excelReports/" + this.reportName + "/" + this.reportName + ".xls?testRun=" + tr + "&WAN_ENV=0&radRunPhase=0&testMode=W" + "&productKey=" + pk);
          } else {
            window.open(url + "../../../logs/TR" + tr + "/" + reportDirName + "/excelReports/" + this.reportName + "/" + this.reportName + ".xlsx?testRun=" + tr + "&WAN_ENV=0&radRunPhase=0&testMode=W" + "&productKey=" + pk + "&mO=" + ReportConstant.TEMPLATE_GRAPH_REPORT);
          }
        }
        else if (reportTypeNew === ReportConstant.STATS_REPORT) {
          let productNameForStats = 'NS';
          if (productName === 'netdiagnostics' || productName === "NetDiagnostics") {
            productNameForStats = 'NDE';
          } else if (productName === 'netcloud') {
            productNameForStats = 'NC';
          } else if (productName === 'netvision') {
            productNameForStats = 'NVSM';
          }
          if (this.isProductTypeNVSM) {
            productNameForStats = 'NVSM';
          }

          let subProductType = '';

          if (subProductType === 'nvsm') {
            url = url + this.pathForReportsAccordingProduct(productName) + "StatsReportGrid.html?rptName=" + this.reportName + "&testRun=" + tr + "&productName=" + subProductType + "&productKey=" + pk + "&isUnified=true";
          } else {
            url = url + this.pathForReportsAccordingProduct(productName) + "StatsReportGrid.html?rptName=" + this.reportName + "&testRun=" + tr + "&productName=" + productNameForStats + "&productKey=" + pk + "&isUnified=true";
          }
          window.open(url);
        }
        else if (reportTypeNew === ReportConstant.COMPARE_REPORT) {
          if(this.sessionService.preSession.multiDc){
            let master = this.sessionService.preSession.dcData.find((info) => {if(info.master){return info}});
              url = master['tomcatURL']+this.pathForReportsAccordingProduct(productName) + "compareReport.html?reportSetName=" + this.reportName + "&testRun=" + tr + "&productKey=" + pk + "&isFromUnified=true";
            }else{
          url = url + this.pathForReportsAccordingProduct(productName)
            + 'compareReport.html?reportSetName=' + this.reportName + '&testRun=' + tr + "&productKey=" + pk + "&isFromUnified=true";
            }
          window.open(url);
        } else if (reportTypeNew === ReportConstant.Cmp_WORD_Report) {
          window.open(url + '../../../logs/TR' + tr + '/' + reportDirName + '/compareWordReports/' + this.reportName + '/'
            + this.reportName + '.rtf');
        } else if (reportTypeNew === ReportConstant.Cmp_HTML_Report) {
          window.open(url + '../../../logs/TR' + tr + '/' + reportDirName + '/compareHTMLReports/'
            + this.reportName + '/index.html?testRun=' + tr + '&WAN_ENV=0&radRunPhase=0&testMode=W' + "&productKey=" + pk);
        }
        else if (reportTypeNew === ReportConstant.SUMMARY_REPORT) {
          let productNameForSummary = 'NS';
          if (productName === 'netdiagnostics' || productName === "NetDiagnostics") {
            productNameForSummary = 'NDE';
          } else if (productName === 'netcloud') {
            productNameForSummary = 'NC';
          } else if (productName === 'netvision') {
            productNameForSummary = 'NVSM';
          }
          if (this.isProductTypeNVSM) {
            productNameForSummary = 'NVSM';
          }
          window.open(url + this.pathForReportsAccordingProduct(productName)
            + 'summary_report.html?testRun=' + tr + '&productName=' + productNameForSummary + '&rptName=' + this.reportName + "&productKey=" + pk);
        } else if (reportTypeNew === ReportConstant.HIERARCHICAL_REPORT) {
          if(this.sessionService.preSession.multiDc){
          let master = this.sessionService.preSession.dcData.find((info) => {if(info.master){return info}});
          url =  master['tomcatURL']+this.pathForReportsAccordingProductMulti(productName) + "productUIRedirect.jsp?strOprName=openHirechicalReport&sesLoginName="
          + userName + "&productType=" + productName + "&testRun=" + tr + "&productKey=" + pk + "&reportSetName=" + this.reportName;
          }else{
          url = url + this.pathForReportsAccordingProduct(productName) + "../productUIRedirect.jsp?strOprName=openHirechicalReport&sesLoginName="
            + userName + "&productType=" + productName + "&testRun=" + tr + "&productKey=" + pk + "&reportSetName=" + this.reportName;
          }
          window.open(url);
        }
      }, 3000);
    } catch (error) {
      console.error("error :", error);
    }
  }


  fillOverrideChartOption() {
    let reportId = this.getReportTypeValue(this.reportType.value, this.reportVisualizeType);
    if (reportId == ReportConstant.HIERARCHICAL_REPORT) {
      this.overrideChartOption = Report_Option_Field.HierarchicalOption;
    }
    else {
      this.overrideChartOption = Report_Option_Field.StatsOption;
    }
    this.selectedOverrideChartType = this.overrideChartOption[0];
  }

  getClearFilterforDropDownTempFav() {
    try {
      if (this.tempFavDropdownReferenceObj.hasOwnProperty("filterValue")) {
        if (this.tempFavDropdownReferenceObj.filterValue != undefined && this.tempFavDropdownReferenceObj.filterValue != null) {
          this.tempFavDropdownReferenceObj.filterValue = "";
        }
      }
    } catch (error) {
      console.error("Error :", error);
    }
  }

  fillAggregateTimeOption() {
    try {
      this.aggregateTimeOption = Report_Option_Field.TimeViewOption;
      this.selectedAggregateTime = this.aggregateTimeOption[0];
      this.fillAggregateByDropdown();
    }
    catch (e) {
      console.error(e);
    }
  }

  fillAggregateByDropdown() {
    try {

      if (this.selectedAggregateTime.value === 'Minute') {
        this.aggregatebyDropdownOption = Report_Option_Field.aggegatedByOption.forMinutes;
      }
      else if (this.selectedAggregateTime.value === 'Hour') {
        this.aggregatebyDropdownOption = Report_Option_Field.aggegatedByOption.forHours;

      }
      else if (this.selectedAggregateTime.value === 'Day' ||
        this.selectedAggregateTime.value === 'Week' ||
        this.selectedAggregateTime.value === 'Month') {
        this.aggregatebyDropdownOption = Report_Option_Field.aggegatedByOption.forOtherTime;
      }

      this.selectedAggregateBy = this.aggregatebyDropdownOption[0];
    }
    catch (e) {
      console.error(e);
    }
  }

  transactionsColChanedEvent() {
    try {
      let percentile = '';
      for (let i = 0; i < this.selectedTransactionCol.length; i++) {
        if (percentile === '') {
          percentile = this.selectedTransactionCol[i];
        } else {
          percentile = percentile + ',' + this.selectedTransactionCol[i];
        }
      }

    } catch (error) {
      console.error(error);
    }
  }

  summeryPercentileEvent() {
    try {
      let percentile = '';
      for (let i = 0; i < this.selectedSummaryPerModel.length; i++) {
        if (percentile === '') {
          percentile = this.selectedSummaryPerModel[i];
        } else {
          percentile = percentile + ',' + this.selectedSummaryPerModel[i];
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  showTransactionErrorEvent() {
    const me = this;
    me.addReportService.getTransactionErrorList().subscribe(
      (state: Store.State) => {
        if (state instanceof TransactionErrorCodeLoadingState) {
          me.transactionErrorListReportLoading(state);
          return;
        }

        if (state instanceof TransactionErrorCodeLoadedState) {
          me.transactionErrorListReportLoaded(state);
          return;
        }
      },
      (state: TransactionErrorCodeLoadingErrorState) => {
        me.transactionErrorListLoadingError(state);
      }
    );
  }

  transactionErrorListReportLoading(state) { };
  transactionErrorListReportLoaded(state) {
    if(this.reportType.value === 'Summary'){
      if(state.data.length == 0){
        this.confirmationDialog("Error","There is no transaction error code available.");
      }
    }

    let errCodeList = state.data;
    let json = [];
    for (let i = 0; i < errCodeList.length; i++) {
      json.push({ 'label': errCodeList[i], 'value': errCodeList[i] });
    }
    this.transactionErrorCodeOptions = json;
    if(this.reportType.value === 'Summary'){
      for (let i = 0; i < errCodeList.length; i++) {
        this.selectedTransactionErrorCode.push(errCodeList[i]);
      }
    }
    // this.selectedTransactionErrorCode = [errCodeList[0]];

  }
  transactionErrorListLoadingError(state) { }

  changeTransactionErrorCodeOptions() {
    try {
      let temp = '';
      for (let i = 0; i < this.selectedTransactionErrorCode.length; i++) {
        if (temp === '') {
          temp = this.selectedTransactionErrorCode[i];
        } else {
          temp = temp + ',' + this.selectedTransactionErrorCode[i];
        }
      }

    } catch (error) {

    }
  }

  addCompareMeasurement() {
    for(let i=0;i<this.data.data.length; i++){
      if(this.data.data[i].measurementName == this.msrName){
        this.confirmationDialog("Error","Please enter unique measurement name");
        this.msrName = null;
        return;
      }
    }
    if (this.msrName == null) {
      this.confirmationDialog("Error", 'Please enter measurement name');
      return;
    }
    if (this.msrName.length > 64) {
      this.confirmationDialog("Error", "Measurement name should not exceed 64 characters.");
      return;
    }
    let regex_report_name = new RegExp('^[a-zA-Z][A-Za-z0-9_%\s\/ \. ();:-]*$');
    if (!regex_report_name.test(this.msrName) || this.msrName.indexOf(',') > -1) {
      this.confirmationDialog("Error", "Please enter valid Measurement Name" + "\n" + "Measurement Name must start with Alphabet" + "\n" + "Maximum length should be 64" + "\n" + "Allowed Characters are Alpha,numeric,space and special characters(/%()_;:.-)");
      return;
    }
    if(this.validateOnTimeFilterCustomTimeChange()){
    let startDate = this.dateTimeFrame[0].format('MM/DD/YYYY HH:mm:ss');
    let endDate = this.dateTimeFrame[1].format('MM/DD/YYYY HH:mm:ss');

    let json = {
      measurementName: this.msrName,
      label: this.selectEvent(this.tmpValue.timePeriod.selected.label,this.tmpValue.timePeriod.selected.id),
      preset: this.tmpValue.timePeriod.selected.id,
      sTime: startDate,
      eTime: endDate,
      viewBy: parseInt(this.tmpValue.viewBy.selected.id)
    }
    this.data.data.push(json);
    this.msrName = null;
    this.checkFirstTimePreset =true;
    this.presetTimeCall();
    this.preset = true;
    this.selectedRow = this.data.data;
  }
  }
  selectEvent(timeEvent,timeId){
    if(timeId.startsWith("EV1"))
      return "Black Friday" + " " + timeEvent;
    else if(timeId.startsWith("EV2")) 
      return "Christmas Day" + " " + timeEvent;
    else if(timeId.startsWith("EV3")) 
      return "Cyber Monday" + " " + timeEvent;
    else if(timeId.startsWith("EV4")) 
      return "Good Friday" + " " + timeEvent;
    else if(timeId.startsWith("EV5")) 
      return "New Years Day" + " " + timeEvent;
    else if(timeId.startsWith("EV6")) 
      return "President's Day" + " " + timeEvent;
    else if(timeId.startsWith("EV7")) 
      return "Thanks Giving Day" + " " + timeEvent;
    else if(timeId.startsWith("EV8")) 
      return "Valentines Day" + " " + timeEvent;
    else
      return timeEvent;
  }

  updateCompareMeasurement() {
    if (this.msrName == null || (this.selectedRow.length >= 1 && this.msrName == null)) {
      this.confirmationDialog("Error", 'Please enter measurement name');
      return;
    }
    
    for (let i = 0; i < this.data.data.length; i++) {
      if (this.data.data[i].measurementName === this.previousMSRName) {
        continue;
      }
      if (this.data.data[i].measurementName.trim() === this.msrName.trim()) {
        this.confirmationDialog("Error","Please enter unique measurement name.");
        return;
      }
    }

    if(this.selectedRow.length == 0){
      this.confirmationDialog("Error","Please select atleast one row.");
      return;
    }
   
    if (this.selectedRow.length > 1) {
      this.confirmationDialog("Error", 'Please select only one measurement row');
      return;
    }

    let dataObj = this.data.data;
    let startDate = this.dateTimeFrame[0].format('MM/DD/YYYY HH:mm:ss');
    let endDate = this.dateTimeFrame[1].format('MM/DD/YYYY HH:mm:ss');
    let json = {
      measurementName: this.msrName,
      label:this.selectEvent(this.tmpValue.timePeriod.selected.label,this.tmpValue.timePeriod.selected.id),
      preset: this.tmpValue.timePeriod.selected.id,
      sTime: startDate,
      eTime: endDate,
      viewBy: parseInt(this.tmpValue.viewBy.selected.id)
    };

    if (this.selectedRow && this.selectedRow.length == 1) {
      for (let j = 0; j < dataObj.length; j++) {
        if (this.selectedRow[0].measurementName == dataObj[j].measurementName) {
          this.data.data[j] = json;
          break;
        }
      }
    }
    this.msrName = null;
    this.checkFirstTimePreset =true;
    this.presetTimeCall();
    this.preset = true;
    this.selectedRow =[];
  }

  onRowSelect(event){
    const me = this;
    let timeValue = this.tmpValue;
    this.msrName = event.data.measurementName;
    this.previousMSRName = event.data.measurementName;
    for (let i = 0; i < timeValue.timePeriod.options.length; i++) {
      let getItem = timeValue.timePeriod.options[i];
      let presetFromEvent = event.data.preset;
      if(presetFromEvent.startsWith("LIVE") || presetFromEvent.startsWith("PAST") || presetFromEvent.startsWith("TB")){
        this.preset=true;
        for (let j = 0; j < getItem.items.length; j++) {
            let obj = getItem.items[j];
            if (obj.id == event.data.preset) { 
              let getObject = obj;
              this.tmpValue.timePeriod.selected = getObject;
              let getStartTime = Date.parse(event.data.sTime);
              let getEndTime = Date.parse(event.data.eTime);
              this.dateTimeFrame = [
                moment(getStartTime),
                moment(getEndTime)
              ];
              break;
            }
        }
        for (let i = 0; i < timeValue.viewBy.options.length; i++) {
          let viewByItem = timeValue.viewBy.options[i];
          let presetFromEvent = event.data.preset;
          if(presetFromEvent.startsWith("LIVE") || presetFromEvent.startsWith("PAST") || presetFromEvent.startsWith("TB")){
            for (let k = 0; k < viewByItem.items.length; k++) {
            let objViewBy = viewByItem.items[k];
            if (objViewBy.id == event.data.viewBy) { 
              let getObject = objViewBy;
              this.tmpValue.viewBy.selected = getObject;
              break;  
            }
            }  
          }
        }
      }
      else if(presetFromEvent.startsWith("EV")){
        this.preset=true;
          for (let j = 0; j < this.tmpValue.timePeriod.options[2].items.length; j++) {
            let presetval= this.tmpValue.timePeriod.options[2].items[j];
            for(let i=0;i<presetval.items.length;i++){
              let itemsVal= presetval.items[i];
              if(itemsVal.id == event.data.preset){
                let finalObj = itemsVal;
                this.tmpValue.timePeriod.selected = finalObj;
                let getStartTime = Date.parse(event.data.sTime);
                let getEndTime = Date.parse(event.data.eTime);
                this.dateTimeFrame = [
                  moment(getStartTime),
                  moment(getEndTime)
                ];
                break;
              }
            }
            for (let i = 0; i < timeValue.viewBy.options.length; i++) {
              let viewByItem = timeValue.viewBy.options[i];
                for (let k = 0; k < viewByItem.items.length; k++) {
                let objViewBy = viewByItem.items[k];
                if (objViewBy.id == event.data.viewBy) { 
                  let getObject = objViewBy;
                  this.tmpValue.viewBy.selected = getObject;
                  break;  
                } 
              }
            }
          }
        }
        else if(presetFromEvent.startsWith("SPECIFIED")){
          this.preset=false;
          this.onTimeFilterCustomTimeChange();
          let getStartTime = Date.parse(event.data.sTime);
          let getEndTime = Date.parse(event.data.eTime);
          this.dateTimeFrame = [
          moment(getStartTime),
          moment(getEndTime)
          ];
          break;
        }
  } 
  }

  onRowUnselect(event){
    if(this.selectedRow.length == 0){
      this.msrName=null;
      this.preset=true;
      this.checkFirstTimePreset =true;
      this.presetTimeCall();
    }
    else{
    const me = this;
    let timeValue = this.tmpValue;
    for (let i = 0; i < timeValue.timePeriod.options.length; i++) {
      let getItem = timeValue.timePeriod.options[i];
      for (let k = 0; k < this.selectedRow.length; k++) {
        let presetFromEvent = this.selectedRow[k].preset;
        this.msrName=this.selectedRow[k].measurementName;
      if(presetFromEvent.startsWith("LIVE") || presetFromEvent.startsWith("PAST") || presetFromEvent.startsWith("TB")){
        this.preset=true;
        this.msrName = this.selectedRow[k].measurementName;
          for (let j = 0; j < getItem.items.length; j++) {
            let obj = getItem.items[j];
            if (obj.id == this.selectedRow[k].preset) { 
              let getObject = obj;
              this.tmpValue.timePeriod.selected = getObject;
              let getStartTime = Date.parse(this.selectedRow[k].sTime);
              let getEndTime = Date.parse(this.selectedRow[k].eTime);
              this.dateTimeFrame = [
                moment(getStartTime),
                moment(getEndTime)
              ];
              break;
            }
          }        
      }
      else if(presetFromEvent.startsWith("EV")){
        this.preset=true;
        for (let k = 0; k < this.selectedRow.length; k++) {
          for (let j = 0; j < this.tmpValue.timePeriod.options[2].items.length; j++) {
            let presetval= this.tmpValue.timePeriod.options[2].items[j];
            for(let i=0;i<presetval.items.length;i++){
              let itemsVal= presetval.items[i];
              if(itemsVal.id == this.selectedRow[k].preset){
                let finalObj = itemsVal;
                this.tmpValue.timePeriod.selected = finalObj;
                let getStartTime = Date.parse(this.selectedRow[k].sTime);
                let getEndTime = Date.parse(this.selectedRow[k].eTime);
                this.dateTimeFrame = [
                  moment(getStartTime),
                  moment(getEndTime)
                ];
                break;
              }
            }
          }
        }
      }
      else if(presetFromEvent.startsWith("SPECIFIED")){
        this.preset=false;
        this.onTimeFilterCustomTimeChange();
        for(let k=0;k<this.selectedRow.length;k++){
        this.msrName = this.selectedRow[k].measurementName;
        let getStartTime = Date.parse(this.selectedRow[k].sTime);
        let getEndTime = Date.parse(this.selectedRow[k].eTime);
        this.dateTimeFrame = [
        moment(getStartTime),
        moment(getEndTime)
        ];
        break;
      }
      }
      this.previousMSRName = this.msrName;
    }
    }
    for (let i = 0; i < timeValue.viewBy.options.length; i++) {
      let getItem = timeValue.viewBy.options[i];
      for (let k = 0; k < this.selectedRow.length; k++) {
        let presetFromEvent = this.selectedRow[k].preset;
        this.msrName=this.selectedRow[k].measurementName;
      if(presetFromEvent.startsWith("LIVE") || presetFromEvent.startsWith("PAST") || presetFromEvent.startsWith("TB")){
        this.preset=true;
        this.msrName = this.selectedRow[k].measurementName;
          for (let j = 0; j < getItem.items.length; j++) {
            let obj = getItem.items[j];
            if (obj.id == this.selectedRow[k].viewBy) {
              let getObject = obj;
              this.tmpValue.viewBy.selected = getObject;
              break;
            }
          }
      }
      else if(presetFromEvent.startsWith("EV")){
        this.preset=true;
        for (let k = 0; k < this.selectedRow.length; k++) {
          for (let j = 0; j < this.tmpValue.viewBy.options[2].items.length; j++) {
            let presetval= this.tmpValue.viewBy.options[2].items[j];
              if(presetval.id == this.selectedRow[k].viewBy){
                let finalObj = presetval;
                this.tmpValue.viewBy.selected = finalObj;
                break;
              }
          }
        }
      }
      else if(presetFromEvent.startsWith("SPECIFIED")){
        this.preset=false;
        this.onTimeFilterCustomTimeChange();
        for(let k=0;k<this.selectedRow.length;k++){
        this.msrName = this.selectedRow[k].measurementName;
        let getStartTime = Date.parse(this.selectedRow[k].sTime);
        let getEndTime = Date.parse(this.selectedRow[k].eTime);
        this.dateTimeFrame = [
        moment(getStartTime),
        moment(getEndTime)
        ];
        break;
      }
      }
      this.previousMSRName = this.msrName;
    }
    }
  } 
  }


  deleteCompareMeasurement() {
    const me = this;
    if (this.selectedRow.length == 0) {
      this.confirmationDialog("Error", 'Please select atleast one measurement row');
      return;
    }
    this.deletionConfirmDialog();
  }

  deletionConfirmDialog() {
    const me = this;
    this.dialogVisible = true;
    let rowData = [];
    for (let i = 0; i < me.selectedRow.length; i++) {
      rowData.push(me.selectedRow[i]);
    }
    this.confirmationService.confirm({
      key: 'addReportDialogue',
      message: "Do you want to delete selected measurement(s)?",
      header: "Confirmation",
      accept: () => {
        let dataObj = this.data.data;
        for (let i = 0; i < rowData.length; i++) {
          for (let j = 0; j < dataObj.length; j++) {
            if (rowData[i].measurementName == dataObj[j].measurementName) {
              me.data.data.splice(j, 1);
              break;
            }
          }
        }
        this.successDialog();
      },
      reject: () => { this.dialogVisible = false; return; },
      rejectVisible: true
    });
  }

  successDialog() {
    const me = this;
    this.dialogVisibleSuccess = true;
    this.confirmationService.confirm({
      key: 'addReportSuccessDialogue',
      message: "Measurement(s) deleted successfully",
      header: "Success",
      accept: () => {
        me.selectedRow = [];
        this.msrName = null;
        this.preset=true;
        this.checkFirstTimePreset =true;
        this.presetTimeCall();
      },
      rejectVisible: true
    });
  }

  confirmationDialog(head, msg) {
    this.dialogVisible = true;
    this.confirmationService.confirm({
      key: 'addReportDialogue',
      message: msg,
      header: head,
      accept: () => { this.dialogVisible = false; return; },
      rejectVisible: false
    });
  }

  // Need Group Data for Meta Data Hierarchichy Option 
  reportGroupDataList() {
    const me = this;
    const payload = {
      opType: 4,
      cctx: me.sessionService.session.cctx,
      duration: me.getDuration(),
      tr: this.sessionService.testRun.id,
      clientId: "Default",
      appId: "Default",
      selVector: null
    }
    me.addReportService.groupDataList(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof AddReportGroupLoadingState) {
          me.groupDataLoading(state);
          return;
        }

        if (state instanceof AddReportGroupLoadedState) {
          me.groupDataLoadedGroup(state);
          return;
        }
      },
      (state: AddReportGroupLoadingErrorState) => {
        me.groupDataLoadingError(state);
      }
    );
  }

  groupDataLoading(state) { }
  groupDataLoadedGroup(state) {
    let stateData= state.data.status;
    if(stateData.code != 200){
      this.confirmationDialog("Error",stateData.msg);
      return;
    }
    this.groupDataList = state.data.group;
    this.fillMetaDataHierarchichy();
  }
  groupDataLoadingError(state) { }

  fillMetaDataHierarchichy() {
    const me = this;
    me.isDropdownDisabledArr = [];
    me.selectedHierarchichyNgModel = [];
    let jsonDataArr = this.groupDataList;
    me.maxValue = 0;
    let dataArrOption = [];
    for (let i = 0; i < jsonDataArr.length; i++) {
      let hierarchiArr = jsonDataArr[i].hierarchicalComponent.split('>');
      if (me.maxValue < hierarchiArr.length) {
        me.maxValue = hierarchiArr.length;
      }
      dataArrOption.push(hierarchiArr[0]);
    }

    let finalArrayData = [...new Set(dataArrOption.map(item => item))];

    for (let j = 0; j < me.maxValue; j++) {
      me.hirerchichyDropdownOptionArr[j] = [];
      me.selectedHierarchichyNgModel.push('--Select--');
      if (j === 0)
        me.isDropdownDisabledArr.push(false);
      else
        me.isDropdownDisabledArr.push(true);
    }
    let optionArr = [];
    optionArr.push({ label: '--Select--', value: '--Select--' });
    for (let k = 0; k < finalArrayData.length; k++) {
      optionArr.push({ label: finalArrayData[k], value: finalArrayData[k] });
    }
    me.hirerchichyDropdownOptionArr[0] = optionArr;
  }

  selectedHierarchichyOption(level) {
    const me = this;
    //if (this.selectedHierarchichyNgModel[level] === '--Select--') {
      for (let p = 0; p < me.selectedHierarchichyNgModel.length; p++) {
        if (p > level) {
          me.isDropdownDisabledArr[p] = true;
          me.selectedHierarchichyNgModel[p] = '--Select--';
        }
      }
     //  return;
    //}

    let jsonDataArr = this.groupDataList;
    let dataArrOption = [];
    me.hirerchichyDropdownOptionArr[level + 1] = [];
    me.isDropdownDisabledArr[level + 1] = false;
    for (let i = 0; i < jsonDataArr.length; i++) {
      let hierarchiArr = jsonDataArr[i].hierarchicalComponent.split('>');
      if (hierarchiArr[level] === this.selectedHierarchichyNgModel[level]) {
        if (hierarchiArr[level + 1]) {
          dataArrOption.push(hierarchiArr[level + 1]);
        }
      }
    }
    let finalArrayData = [...new Set(dataArrOption.map(item => item))];

    if (finalArrayData.length == 0) {
      me.isDropdownDisabledArr[level + 1] = true;
    }

    let optionArr = [];
    optionArr.push({ label: '--Select--', value: '--Select--' });
    for (let k = 0; k < finalArrayData.length; k++) {
      optionArr.push({ label: finalArrayData[k], value: finalArrayData[k] })
    }
    me.hirerchichyDropdownOptionArr[level + 1] = optionArr;

  }

  getDuration() {
    let startDate = Date.parse(this.dateTimeFrame[0].format('MM/DD/YYYY HH:mm:ss'));
    let endDate = Date.parse(this.dateTimeFrame[1].format('MM/DD/YYYY HH:mm:ss'));
    let duration = {
      st: startDate, // Start Date Time In mili
      et: endDate, //End Data Time In mili
      preset: this.tmpValue.timePeriod.selected.id, // Preset
      viewBy: parseInt(this.tmpValue.viewBy.selected.id) //View By
    };
    return duration;
  }

  numericCheckUptoThreeDec(value): boolean {
    try {
      if (/^(0|[0-9]*\d)(\.\d{1,3})?$/.test(value))
        return true;
      else
        return false;
    } catch (error) {

    }
  }
  onChangeFilterOption() {
    if (this.isEnableFilter == false) {
      this.selectedCategory = 'All';
      this.selectedOperator = { label: '=', value: 0 };
      this.selectedfilterInclude = 'Include';
      this.selectedfilterValue =  0;
      this.filterFirstValue = "";
      this.filterSecondValue = "";
    }
  }

  ChangeOverridePreset(){
    this.checkExcelOverridePreset = false;
  }
  selectedTooltipPer(event){
    const me = this;
    let formula = [];
    for(let i =0; i < event.value.length; i++){
    formula.push(event.value[i]);
    }
    me.tooltipPercentile = formula;
    if(event.value.length === 0){
      me.tooltipPercentile = ["Choose"];
    }
  }
  selectedTooltipTransection(event){
    const me = this;
    let formula = [];
    for(let i =0; i < event.value.length; i++){
    formula.push(event.value[i]);
    }
    me.tooltipTransection = formula;
    if(event.value.length === 0){
      me.tooltipTransection = ["Choose"];
    }
  }
  tooltipTranErr(event){
    const me = this;
    let formula = [];
    for(let i =0; i < event.value.length; i++){
    formula.push(event.value[i]);
    }
    me.tooltipTranError = formula;
    if(event.value.length === 0){
      me.tooltipTranError = ["Choose"];
    }
  }

 getTrendCompareList(){

    let reportId = this.getReportTypeValue(this.reportType.value, this.reportVisualizeType);
      if(reportId == ReportConstant.COMPARE_REPORT && this.checkTrendCompare){
        this.overrideChartOption = Report_Option_Field.CompareTrendOption;
      }
      else{
          this.fillOverrideChartOption();
      }
    this.selectedOverrideChartType = this.overrideChartOption[0];
    this.checkOverrideChart = false;   
  }
  saveTemplateForReport(isSaveTemplate){
    const me = this;
    try {
      if (me.reportName === '' || me.reportName == null) {
        this.confirmationDialog("Error", "Please Enter Report Name");
        return;
      }
      let regex_filter_validation = new RegExp('^[0-9]*$');
      let selectedFilterBy: any = me.filterFirstValue;
      if ((me.selectedOperator.label === "Top" || me.selectedOperator.label === "Bottom")
      && selectedFilterBy <= 0) {
        this.confirmationDialog("Error", "Invalid input type given, Please enter a Numeric value greater than Zero for advance filter.");
        return;
      }
      if ((me.selectedOperator.label === "Top" || me.selectedOperator.label === "Bottom")
        && !regex_filter_validation.test(selectedFilterBy)) {
        this.confirmationDialog("Error", "Invalid input type given, Please enter a Numeric value for advance filter(Without decimal).");
        return;
      }
      let regex_report_name = new RegExp('^[a-zA-Z][A-Za-z0-9_()\.:]*$');
      let rpt = me.reportName;
      if (!regex_report_name.test(rpt)) {
        this.confirmationDialog("Error", "Please Enter valid Report Name.\r\nReport "
          + "Name must start with alphabet. \r\nMaximum length is 64. \r\nAllowed "
          + "characters are alphanumeric and following special characters:(_ . : )")
        return;
      }
      if (me.reportName.length > 128) {
        me.confirmationDialog("Error", "Report Name should not exceed 128 characters.");
        return;
      }
      for(let j = 0; j < me.addReportService.templateListData.length; j++){
        if (me.reportName === me.addReportService.templateListData[j].label) {
          me.confirmationDialog("Error", "Please enter a unique report name.");
          return;
        }
      } 
      me.addTemplateService.templateName = me.reportName;
      if (me.addReportSettingsService.reportSetData == undefined || me.addReportSettingsService.reportSetData.length == 0) {
        me.confirmationDialog("Error", "Please Add atleast one Report Set.");
        return;
      }
      let tnObj: TInfo = {
        tn: me.reportName,
        des: '-',
        cd: me.getMachineDateTime(),
        md: me.getMachineDateTime(),
        un: me.sessionService.session.cctx.u,
        tr: parseInt(me.sessionService.session.testRun.id),
        rptSetNum: me.addReportSettingsService.reportSetData.length,
        type: "U",
        ext: "json"
      }
      if (me.templateService.isEdit) {
        tnObj.temInfo = [{ tn: me.templateService.previousTempName }];
      }
      let ft = null;
      if (this.isEnableFilter) {
        if (this.selectedCategory == 'All') {
          ft = {"in": true,
          "opt": ">",
          "typ": [0, 7],
          "val1": 0,
          "val2": -1
        }
        }
        else if (this.selectedCategory == 'Zero') {
          ft = {
            "in": true,
            "opt": "<",
            "typ": [0, 7],
            "val1": 0,
            "val2": -1
          }
        }
        else if (this.selectedCategory == 'Advance') {

          if (this.selectedOperator.value == ReportConstant.IN_BETWEEN) {
            let firstcheck = this.numericCheckUptoThreeDec(this.filterFirstValue);
            if (!firstcheck) {
              this.confirmationDialog("Error", "Invalid input type given, Please enter a Numeric value for advance filter( decimal upto 3 digits)");
              return;
            }
            let secondcheck = this.numericCheckUptoThreeDec(this.filterSecondValue);
            if (!secondcheck) {
              this.confirmationDialog("Error", "Invalid input type given, Please enter a Numeric value for advance filter( decimal upto 3 digits)");
              return;
            }
          }
          else {

            let firstcheck = this.numericCheckUptoThreeDec(this.filterFirstValue);
            if (!firstcheck) {
              this.confirmationDialog("Error", "Invalid input type given, Please enter a Numeric value for advance filter( decimal upto 3 digits)");
              return;
            }
          }
          let typ =  [this.selectedfilterValue];
          let inc = false;
          let val1 = -1;
          let val2 = -1;
          if(this.selectedfilterInclude === "Include"){
            inc = true;
            typ.push(7);
          }
          if(this.filterFirstValue){
            val1 = this.filterFirstValue;
          }
          if(this.filterSecondValue){
            val2 = this.filterSecondValue;
          }
          ft = {
            opt: this.selectedOperator.label,
            in: inc,
            typ: typ,
            val1: val1,
            val2: val2
          }
        }
      }

      let cctxObj: CctxInfo = {
        cck: me.sessionService.session.cctx.cck,
        pk: me.sessionService.session.cctx.pk,
        prodType: me.sessionService.session.cctx.prodType,
        u: me.sessionService.session.cctx.u
      }
      let templatedtObj: TemplateObject = {
        tInfo: tnObj,
        ars: me.addReportSettingsService.reportSetData,
        ft: ft,
      }
      this.blockedDocument = true;
      const payload: TemplateDataDTO = {
        templateDTO: templatedtObj,
        cctx: cctxObj,
      }
      me.addTemplateService.saveTemplateData(payload).subscribe(
        (state: Store.State) => {
          if (state instanceof SaveTemplateLoadingState) {
            me.saveTemplateLoading(state);
            return;
          }

          if (state instanceof SaveTemplateLoadedState) {
            me.saveTemplateLoaded(state);
            return;
          }
        },
        (state: SaveTemplateLoadingErrorState) => {
          me.saveTemplateLoadingError(state);
        }
      );

    } catch (error) {
      console.error(error);
    }  
   }
   saveTemplateLoading(state) {
    this.timebarService.setLoading(true);
    }
   saveTemplateLoaded(state) {
     const me = this;
     this.timebarService.setLoading(false);
     let list = state.data.temList;
     let temData = [];
     for(let i = 0; i < list.length; i++){
       let objtemp = {}
       objtemp['label']=list[i].tn;
       objtemp['value']=list[i].tn;
       temData.push(objtemp);
     }
     me.addReportService.templateListData = temData;
     this.reportTempFavOptions = temData;
     try { 
       this.dialogVisible = true;
       this.blockedDocument = false;
       this.confirmationService.confirm({
         key: 'addReportDialogue',
         message: "Template saved successfully.",
         header: "Success",
         accept: () => {},
         rejectVisible: false
       });
     }
      catch (error) {
       console.error(error);
     }
   }
   saveTemplateLoadingError(state) { 
    this.timebarService.setLoading(false);
   }
   getMachineDateTime() {
     try {
       let currentTime = Date.now();
       let timeZoneId = "Asia/Kolkata"
       //  let timeZoneId = sessionStorage.getItem('timeZoneId');
       let date = moment.tz(currentTime, timeZoneId).format('MM/DD/YY HH:mm:ss');
       return date;
     }
     catch (error) {
       console.error("error in machine date time fetching---", error);
     }
   }
   checkIncludeChartValue(event){
     this.addReportService.checkIncludeChart = event.checked;
   }
   checkTrendCompareValue(event){
     this.addReportService.ischeckTrendCompare = event.checked;
   } 
  ngOnDestroy() {
    this.subscribe.unsubscribe();
  }
  deleteExcelTemplate(){
    let ext = this.selectedExcelTemp.value.split(".");
    const me = this;
    let tempInfoo = [{
      cd:"-",
      des:"-",
      ext:ext[1],
      md:"-",
      rptSetNum:0,
      tn:this.selectedExcelTemp.label,
      tr:-1,
      type:"Excel",
      un:"-"
    }];
      try {
        if (!me.selectedExcelTemp) {
          this.dialogVisible = true;
          this.confirmationService.confirm({
            key: 'addReportDialogue',
            message: "template is not selected",
            header: "Info",
            accept: () => {
              this.dialogVisible = false;
            },
            rejectVisible: true
          });
          return;
        }
        this.dialogVisible = true;
        if(me.selectedExcelTemp){
        this.confirmationService.confirm({
          key: 'addReportDialogue',
          message: "Do you want to delete the selected template ?",
          header: "Info",
          accept: () => {
                me.templateService.deleteTemplateList(tempInfoo).subscribe(
                (state: Store.State) => {
                  if (state instanceof DeleteTemplateLoadingState) {
                    me.deleteExcelLoading(state);
                    return;
                  }
    
                  if (state instanceof DeleteTemplateLoadedState) {
                    me.deleteExcelLoaded(state);
                    return;
                  }
                },
                (state: DeleteTemplateLoadingErrorState) => {
                  me.deleteExcelLoadingError(state);
                }
              );
            
            return;
          },
          reject: () => { this.dialogVisible = false; return; },
          rejectVisible: true
        });
      }
      } catch (error) {
        console.error(error);
      }
    }
    deleteExcelLoading(state) { }
    deleteExcelLoaded(state) {
      const me = this;
      try {
        me.listReportTypeTemplate();
        this.messageService.add({severity:"success", summary:"Template delete", detail:"Template deleted successfully" });
        this.toolTip="";  
      } catch (error) {
        console.error(error);
      }
    }
    deleteExcelLoadingError(state) { }
    deleteThresholdTemplate(){
        const me = this;
        let tempInfoo = [{
          cd:"-",
          des:"-",
          ext:"csv",
          md:"-",
          rptSetNum:0,
          tn:this.selectThresholdTemp.label,
          tr:-1,
          type:"Threshold",
          un:"-"
        }];
        try {
          if (!this.selectThresholdTemp) {
            this.dialogVisible = true;
            this.confirmationService.confirm({
              key: 'addReportDialogue',
              message: "template is not selected",
              header: "Info",
              accept: () => {
                this.dialogVisible = false;
              },
              rejectVisible: true
            });
            return;
          }
          this.dialogVisible = true;
          if(this.selectThresholdTemp){
          this.confirmationService.confirm({
            key: 'addReportDialogue',
            message: "Do you want to delete the selected template ?",
            header: "Info",
            accept: () => {
                  me.templateService.deleteTemplateList(tempInfoo).subscribe(
                  (state: Store.State) => {
                    if (state instanceof DeleteTemplateLoadingState) {
                      me.deleteThresholdLoading(state);
                      return;
                    }
      
                    if (state instanceof DeleteTemplateLoadedState) {
                      me.deleteThresholdLoaded(state);
                      return;
                    }
                  },
                  (state: DeleteTemplateLoadingErrorState) => {
                    me.deleteThresholdLoadingError(state);
                  }
                );
              
              return;
            },
            reject: () => { this.dialogVisible = false; return; },
            rejectVisible: true
          });
        }
        } catch (error) {
          console.error(error);
        }
      }
      deleteThresholdLoading(state) { }
      deleteThresholdLoaded(state) {
        const me = this;
    
        try {
          me.listReportTypeTemplate();
          this.messageService.add({severity:"success", summary:"Threshold delete", detail:"Threshold deleted successfully" });
          this.toolTip="";
        } catch (error) {
          console.error(error);
        }
      }
      deleteThresholdLoadingError(state) { }

      getChartAndReportData(payload){
        const me=this;
        me.addReportService.getChartAndReportData(payload).subscribe(
          (state: Store.State) => {
            if (state instanceof getChartAndReportDataLoading) {
              me.getChartAndReportDataLoading(state);
              return;
            }
    
            if (state instanceof getChartAndReportDataLoaded) {
              me.getChartAndReportDataLoaded(state,payload);
              return;
            }
          },
          (state: getChartAndReportDataError) => {
            me.getChartAndReportDataError(state);
          }
        );
      }
      getChartAndReportDataLoading(state){

      }
      getChartAndReportDataLoaded(state,payload){
        const me=this;
        if(payload.basic.rType == ReportConstant.EXCEL_REPORT){
          let renderObj = {};
          renderObj['excelData'] = state.data.excelData;
          renderObj['sETList'] = state.data.sETList;
          renderObj['sWTime'] =  state.data.sWTime;
          payload['render']= renderObj;
        }else{
        payload['render']={"responseObjMap":state.data.responseObjMap}
        }
        me.createChartAndReport(payload);
      }
      getChartAndReportDataError(state){

      }

      createChartAndReport(payload){
        const me=this;
        me.addReportService.createChartAndReport(payload).subscribe(
          (state: Store.State) => {
            if (state instanceof createChartAndReportLoading) {
              me.createChartAndReportLoading(state);
              return;
            }
    
            if (state instanceof createChartAndReportLoaded) {
              me.createChartAndReportLoaded(state);
              return;
            }
          },
          (state: createChartAndReportError) => {
            me.createChartAndReportError(state);
          }
        );
      }

      createChartAndReportLoading(state){

      }
      createChartAndReportLoaded(state){
        this.generateReportLoaded(state);
      }
      createChartAndReportError(state){

      }
    
}

