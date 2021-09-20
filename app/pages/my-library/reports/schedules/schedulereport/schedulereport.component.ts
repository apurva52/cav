import { Router } from '@angular/router';
import { Moment } from 'moment-timezone';
import { ConfirmationService, MenuItem, SelectItem } from 'primeng';
import { Store } from 'src/app/core/store/store';
import { AppError } from 'src/app/core/error/error.model';
import { MailObj, CrqObj, SchObj } from '../../schedules/schedulereport/service/schedulereport.model'
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { ScheduleReportService } from '../schedulereport/service/schedulereport.service'
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import * as _ from 'lodash';
import { Component, Input, OnInit, ViewEncapsulation, ChangeDetectorRef, ViewChild } from '@angular/core';
import { SCHEDULE_REPORT_DATA, Report_Scheduler_Preset } from './service/schedulereport.dummy';
import { AddReportService } from '../../metrics/add-report/service/add-report.service';
import { ObjectUtility } from 'src/app/shared/utility/object';
import { AddReportData, TimebarTimeConfig } from '../../metrics/add-report/service/add-report.model';
import { SessionService } from 'src/app/core/session/session.service';
import { FileUpload, FileUploadModule } from 'primeng/fileupload';
import {Message,MessageService} from 'primeng/api';
import {
  FavoriteTaskListLoadingState, FavoriteTaskListLoadedState, FavoriteTaskListLoadingErrorState, FavTaskListLoadedState, FavTaskListLoadingErrorState, FavTaskListLoadingState, TemplateTaskListLoadingState, TemplateTaskListLoadedState, TemplateTaskListLoadingErrorState, AlertDigestTaskListLoadingState, AlertDigestTaskListLoadedState, AlertDigestListLoadingErrorState, ReportTimebarTimeLoadingErrorState, ReportTimebarTimeLoadingState, ReportTimebarTimeLoadedState,
  AddReportTaskLoadingState,
  AddReportTaskLoadedState,
  AddReportTaskLoadingErrorState,
  UpdateReportTaskLoadingState,
  UpdateReportTaskLoadedState,
  UpdateReportTaskLoadingErrorState

} from '../schedulereport/service/schedulereport.state';
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
} from 'ng-pick-datetime';
import { Observable, Subject, Subscription } from 'rxjs';
import {
  ReportTimebarLoadedState,
  ReportTimebarLoadingErrorState,
  ReportTimebarLoadingState
} from '../../metrics/add-report/service/add-report.state';
import { ADD_REPORT_DATA, Report_Date_Format, Report_Preset } from '../../metrics/add-report/service/add-report.dummy';
import { MomentDateTimeAdapter } from 'src/app/shared/date-time-picker-moment/moment-date-time-adapter';
import * as moment from 'moment-timezone';
import { TimebarValue, TimebarValueInput } from 'src/app/shared/time-bar/service/time-bar.model';
import { data } from 'jquery';
import { environment } from 'src/environments/environment';
import { SchedulesService } from '../service/schedules.service';
import { stringify } from '@angular/compiler/src/util';
import { ReportConstant } from '../../metrics/add-report/service/add-report-enum';
import { state } from '@angular/animations';
import { BOOL_TYPE, THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SCHEDULES_TABLE_DATA } from '../../schedules/service/schedules.dummy';
import { DeleteTemplateLoadingState, DeleteTemplateLoadedState, DeleteTemplateLoadingErrorState} from '../../template/service/template.state';
import { median } from 'd3-ng2-service/src/bundle-d3';
import { ReportsService } from '../../../reports/service/reports.service';
import { TestRunReportModule } from 'src/app/pages/tools/advanced/design/test-report/test-cases/test-run-report/test-run-report.module';
declare var $:any;
@Component({
  selector: 'app-schedulereport',
  templateUrl: './schedulereport.component.html',
  styleUrls: ['./schedulereport.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService,
    {
      provide: DateTimeAdapter,
      useClass: MomentDateTimeAdapter,
      deps: [OWL_DATE_TIME_LOCALE],
    },
    {
      provide: OWL_DATE_TIME_FORMATS,
      useValue: Report_Date_Format.formats.OWL_DATE_TIME_FORMATS,
    },
    MessageService
  ]
})
export class SchedulereportComponent implements OnInit {
  @ViewChild('timePeriodMenu') timePeriodMenu;
  @ViewChild('schExcelUpload') excelFileUpload: FileUpload;
  breadcrumb: MenuItem[];
  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  tmpValue: any = null;
  preset: boolean = true;
  isDiscontinue: boolean = true;
  includeMetricChart: boolean = true;
  showLastWeekData: boolean = true;
  overridePreset: boolean = false;
  showDiscontinued: boolean = true;
  aggregatedValue: boolean = true;
  subscribe: any;
  data;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  timeBack: any;
  timeBckCall: boolean = false;
  uploadURL: String;
  excelURL = '';
  excelArr;
  excelTemplateOption: SelectItem[];
  selectedExcelTemplate: any = { label: "AlertDigestReportWithGrouping", value: "AlertDigestReportWithGrouping"};
  selectedReportType = { label: 'Excel', value: 'Excel' };
  templateOptions: SelectItem[];
  selectedSystemTemplate: any;
  fileUpload: any;
  excelSchDropdown: [];
  showInDropdown: SelectItem[];
  selectedValue = { label: 'Column', value: 0 };
  drpRptViewTypeStatsList: SelectItem[];
  drpRptViewTypeList: SelectItem[];
  aggregateTimeDropdown: any[];
  aggregatebyDropdown: any[];
  selectedAggregateTimeOption = 'Minute(s)';
  selectedAaggregateByOption = { label: '1', value: '1' };
  aggTimeUnitInExcel = '-1';
  aggTimeValueInExcel = this.selectedAaggregateByOption;
  selectedTemplate: string = 'Using Template';
  selectedFavorite: string = '';
  dialogVisible = false;
  reportVisualizeType = 'WORD';
  addGraphImage: boolean = false;
  numGraphImgDropdown: any[];
  selectedNumGraphImg = '1';
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
  checkIncludeChart = true;
  isApply:boolean=false;
  objReportSetting = {};
  aggregatedDropdown: SelectItem[];
  selectedAggregatedValue: 'Minute(s)';
  addOffset: boolean = false;
  addOSInPreTime: boolean = false;
  dailyOrEvery = 'daily';
  minutesTab: boolean = true;
  hourlyTab: boolean;
  weeklyTab: boolean;
  monthlyTab: boolean;
  seletectedTabIndex: number = 0;
  scheduleExpiry: Date;
  scheduleExpiry1: Date;
  everyMinutesTxtModel: number;
  everyHourOffsetModel: number = 0;
  everyHourTxtModel: number;
  dailyTxtModel: Date;
  selectedWeek: string;
  weekDays: SelectItem[] = [];
  WeekStartTime: Date;
  DAYS: any[] = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  monthlyStartTime: Date;
  mDayModel: number;
  mMonthModel: number;
  schTaskObj = {};
  mailObj: MailObj = {};
  crqObj: CrqObj = {};
  schObj: SchObj = {};
  txtMailTo: string = '';
  txtMailSubject: string = '';
  txtMailBody: string = '';
  shwLstData: boolean = false;
  isMultiDC: boolean = false;
  boundaryCondition: string = "NA";
  taskName: string;
  cronFormat: string;
  sDateFormat: string;
  formatTxt: string = 'WORD';
  excelReportOption: number = ReportConstant.EXCEL_REPORT;
  selectedMetricOption: number = ReportConstant.TEMPLATE_GRAPH_REPORT;
  selectedFavMetricOption: number = ReportConstant.Favorite_GRAPH_REPORT;
  alertDigestReportOption: number = ReportConstant.ALERT_DIGEST_EXCEL_REPORT;
  displayReportSetting: boolean = false;
  exceloption: any;
  multiDCPort;
  jsonData;
  taskDescription: string;
  isEditClicked: boolean = false;
  tooltip = "";
  blockedDocument: boolean = false;
  rowsForDes = 8;
  checkFirstTimePreset: boolean = false;
  uploadedFileName: string = "";
  firstTimeCustom: boolean = false;

  count:number = 0;
  toolTipTest: any;
  srt: any;

  constructor(
    public timebarService: TimebarService,
    private scheduleReportService: ScheduleReportService,
    private addReportService: AddReportService,
    private router: Router,
    private cd: ChangeDetectorRef,
    public sessionService: SessionService,
    public confirmation: ConfirmationService,
    private schedulesService: SchedulesService,
    private messageService: MessageService,
    private reportsService: ReportsService
  ) {
    this.dialogVisible = false;
    this.pushWeekDays();
    this.pushGraphImageArr();
  }

  ngOnInit(): void {

      // this code for when page scroll close dropdown, menu, calender etc  
            $(document).ready(function() {
            $('.vertical-container').on('scroll',  function (){
              if ($(this).scrollTop() > 50) {
                $('body').click();
            } else  {
            }
            });
          });
      // end code

    const me = this;
    me.data = SCHEDULE_REPORT_DATA;
    me.selectedReportType = me.data.reportType[0];
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      // { label: 'System', routerLink: '/home/system' }, for bug id - 110253
      { label: 'My Library', routerLink: '/my-library/dashboards' },
      { label: 'Reports', routerLink: '/reports/metrics' },
      { label: 'Schedule', routerLink:'/schedules' },
      { label: 'Add Schedule' },
    ];
    me.tmpValue = Report_Scheduler_Preset;
    this.customTimeFrame = [
      moment(me.tmpValue.time.frameStart.value),
      moment(me.tmpValue.time.frameEnd.value)
    ];
    me.selectedReportType = me.data.reportType[0];
    if(!me.schedulesService.isEdit){
    me.getPresetInit();
    }
    me.showInDropdown = [
      { label: 'Column', value: 0 },
      { label: 'Tab', value: 1 }
    ];
    me.getDrpRptTypeList();
    me.fillAggregateByDropdown();
    me.selectAggregateTimeOption();
    //me.getTemplate();
     
    me.getReportTypeValue(me.selectedReportType.value, me.reportVisualizeType);
    if (me.schedulesService.isEdit) {
      this.isEditClicked = true;
      this.fillValues();
    }else{
      me.favoriteTaskList();
    }
    if(me.schedulesService.isScheduleReportButtonClicked){
      me.resetCreateTaskObj();
      me.schedulesService.isScheduleReportButtonClicked = false;
    }
  }
  routeToRptOrSch(){
    if(this.reportsService.fromReportUI){
      this.router.navigate(['/metrics']);
    }else{
      this.router.navigate(['/schedules']);
    }
  }
  fillValues() {
    const me = this;
    let jsonStringData = JSON.stringify(me.schedulesService.dataTobeEdit)
    this.jsonData = JSON.parse(jsonStringData);
    this.taskName = this.jsonData.data.crq.name;
    // setting report param
    if (me.schedulesService.rowDataFromParent.taskType === 'Excel Report') {
      this.selectedReportType = { label: 'Excel', value: 'Excel' };

    } else if (me.schedulesService.rowDataFromParent.taskType === 'Word Report') {
      this.selectedReportType = {
        label: 'Performance Stats',
        value: 'Performance Stats',
      };
      this.reportVisualizeType = 'WORD';

    } else if (me.schedulesService.rowDataFromParent.taskType === 'Html Report') {
      this.selectedReportType = {
        label: 'Performance Stats',
        value: 'Performance Stats',
      };
      this.reportVisualizeType = 'HTML';

    } else if (me.schedulesService.rowDataFromParent.taskType === 'Alert Digest WORD Report' || me.schedulesService.rowDataFromParent.taskType === 'Alert DigestWORD Report') {
      this.selectedReportType = {
        label: 'Alert Digest Report',
        value: 'Alert Digest Report',
      };
      this.reportVisualizeType = 'WORD';

    } else if (me.schedulesService.rowDataFromParent.taskType === 'Alert Digest EXCEL Report' || me.schedulesService.rowDataFromParent.taskType === 'Alert DigestEXCEL Report') {
      this.selectedReportType = {
        label: 'Alert Digest Report',
        value: 'Alert Digest Report',
      };
      this.reportVisualizeType = 'EXCEL';

    } else if (me.schedulesService.rowDataFromParent.taskType === 'Alert Digest PDF Report' || me.schedulesService.rowDataFromParent.taskType === 'Alert DigestPDF Report') {
      this.selectedReportType = {
        label: 'Alert Digest Report',
        value: 'Alert Digest Report',
      };
      this.reportVisualizeType = 'PDF';
    }
    //setting template name in the dropdown
    this.selectedExcelTemplate = this.jsonData.data.crq.templateName;
    if (this.jsonData.data.crq.readFromTemplate) {
      if (this.jsonData.data.crq.format === "EXCEL") {
        this.overridePreset = this.jsonData.data.crq.readFromTemplate;
      }
    }
    this.shwLstData = this.jsonData.data.crq.shwLstData;
    if (this.jsonData.data.crq.reportView) {
      if (this.jsonData.data.crq.reportView === 'tabView') {
        this.selectedValue = { label: 'Tab', value: 1 };
      } else {
        this.selectedValue = { label: 'Column', value: 0 };
      }
    }
    if (this.jsonData.data.crq.addGraphImageInSchMailBody) {
      this.addGraphImage = this.jsonData.data.crq.addGraphImageInSchMailBody;
      this.selectedNumGraphImg = this.jsonData.data.crq.numAddGraphImageInSchMailBody;
    }

    //for  aggEntireRpt
    if (this.jsonData.data.crq.aggEntireRpt) {
      let arr = [];
      arr = this.jsonData.data.crq.aggEntireRpt.split(' ');
      // arr[0] - 5
      // arr[1] - Hour
      // arr[2] - false
      this.aggregatedValue = this.getBooleanFromString(arr[2]);
      this.selectedAggregateTimeOption = arr[1] + '(s)';
      this.selectedAaggregateByOption = { label: arr[0], value: arr[0] };;
    }
    this.includeMetricChart = this.jsonData.data.crq.includeChart;
    this.addOSInPreTime = this.jsonData.data.crq.addOSInPreTime;
    this.isDiscontinue = true;
    this.boundaryCondition = "NA";
    this.selectedExcelTemplate = this.jsonData.data.crq.templateName;
    if(this.jsonData.data.crq.lastTime === "Custom"){
      let startDateTime = new Date();
      let endDateTime = new Date();
      let strtDateArr = this.jsonData.data.crq.startDate.split("/");// 05/25/2021
      let srtTimeArr = this.jsonData.data.crq.startTime.split(":");//11:02:02
      let endDateArr = this.jsonData.data.crq.endDate.split("/");// 05/25/2021
      let endTimeArr = this.jsonData.data.crq.endTime.split(":");//12:02:07
      startDateTime.setMonth(strtDateArr[0]-1);
      startDateTime.setDate(strtDateArr[1]);
      startDateTime.setFullYear(parseInt(strtDateArr[2]));
      startDateTime.setHours(srtTimeArr[0]);
      startDateTime.setMinutes(srtTimeArr[1]);
      startDateTime.setSeconds(srtTimeArr[2]);
      
      endDateTime.setMonth(endDateArr[0]-1);
      endDateTime.setDate(endDateArr[1]);
      endDateTime.setFullYear(parseInt(endDateArr[2]));
      endDateTime.setHours(endTimeArr[0]);
      endDateTime.setMinutes(endTimeArr[1]);
      endDateTime.setSeconds(endTimeArr[2]);
      this.customTimeFrame = [
      moment(startDateTime.getTime()),
      moment(endDateTime.getTime())
      ];
      this.preset = false; 
      if(me.scheduleReportService.presetData && me.scheduleReportService.presetData.data){
      const preparedValue = ObjectUtility.duplicate(me.scheduleReportService.presetData.data);

      if (this.jsonData.data.crq.viewBy) {//Minute_1
        let view = [];
        let l;
        view = this.jsonData.data.crq.viewBy.split('_');
        if (view[0] === 'Minute') {
          view[0] = 'Min';
        }

        if (view[0] === 'Hour') {
          if (view[1] == 1) {
            view[0] = 'Hour';
          }
          else { view[0] = 'Hours'; }
        }

        let newViewBy = view[1] + ' ' + view[0];// 1 Minute 


        for (let j = 0; j < preparedValue.viewBy.options.length; j++) {
          if(preparedValue.viewBy.options[j].items){
          for (let i = 0; i < preparedValue.viewBy.options[j].items.length; i++) {
            if (preparedValue.viewBy.options[j].items[i].label === newViewBy) {
              preparedValue.viewBy.selected = preparedValue.viewBy.options[j].items[i];
            }
          }
        }
        }
      }
    
      me.tmpValue = me.prepareValue(preparedValue);
    }
      me.tmpValue.timePeriod.selected.label = "Custom Time";
    }else if(this.jsonData.data.crq.lastTime === "Event Days"){
      if(me.scheduleReportService.presetData && me.scheduleReportService.presetData.data){
        const preparedValue = ObjectUtility.duplicate(me.scheduleReportService.presetData.data);
        for(let i = 0; i< preparedValue.timePeriod.options[2].items.length; i++){
          if(preparedValue.timePeriod.options[2].items[i].label == this.jsonData.data.crq.eventDay){
            for(let j = 0; j<preparedValue.timePeriod.options[2].items[i].items.length;j++){
              if(preparedValue.timePeriod.options[2].items[i].items[j].label == this.jsonData.data.crq.eventYear){
                preparedValue.timePeriod.selected = preparedValue.timePeriod.options[2].items[i].items[j];
              }
            }
          }
        }
        me.scheduleReportService.loadTime(preparedValue.timePeriod.selected.id).subscribe(
          (state: Store.State) => {
            if (state instanceof ReportTimebarTimeLoadingState) {
              me.timeLoading(state);
              return;
            }
            if (state instanceof ReportTimebarTimeLoadedState) {
              me.timeLoaded(state);
              return;
            }
          },
          (state: ReportTimebarTimeLoadingErrorState) => {
            me.timeLoadingError(state);
          }
        );

        if (this.jsonData.data.crq.viewBy) {//Minute_1
          let view = [];
          let l;
          view = this.jsonData.data.crq.viewBy.split('_');
          if (view[0] === 'Minute') {
            view[0] = 'Min';
          }
  
          if (view[0] === 'Hour') {
            if (view[1] == 1) {
              view[0] = 'Hour';
            }
            else { view[0] = 'Hours'; }
          }
  
          let newViewBy = view[1] + ' ' + view[0];// 1 Minute 
  
  
          for (let j = 0; j < preparedValue.viewBy.options.length; j++) {
            if(preparedValue.viewBy.options[j].items){
            for (let i = 0; i < preparedValue.viewBy.options[j].items.length; i++) {
              if (preparedValue.viewBy.options[j].items[i].label === newViewBy) {
                preparedValue.viewBy.selected = preparedValue.viewBy.options[j].items[i];
              }
            }
          }
          }
        }
        
        me.tmpValue = me.prepareValue(preparedValue);
      }
      }
      else{
        this.getPresetInit();
      }
    //for mO
    if (this.selectedReportType.label === "Performance Stats") {
      this.rowsForDes=10;
      if (this.jsonData.data.crq.templateName.indexOf("*Fav") > -1 || this.jsonData.data.crq.metricOption == ReportConstant.Favorite_GRAPH_REPORT) {
      
      this.selectedFavorite = 'Using Favorite';
      this.selectedTemplate='';
      this.getFavorite();
      }
      else if (this.jsonData.data.crq.metricOption == ReportConstant.TEMPLATE_GRAPH_REPORT) {
      
      this.selectedTemplate = 'Using Template';
      this.selectedFavorite = '';
      this.getTemplate();
      this.selectedSystemTemplate = this.jsonData.data.crq.templateName;
      
      }
      
    }
    else if (this.selectedReportType.label === 'Alert Digest Report') {
      this.rowsForDes = 15;
      this.getAlertDigestTemplate();
    }else{
      this.rowsForDes = 8;
      this.favoriteTaskList();
    }
      if(me.schedulesService.rowDataFromParent.taskDes === "NA"){
        this.taskDescription = "";
      }else{
        this.taskDescription = me.schedulesService.rowDataFromParent.taskDes;
      }
    this.multiDCPort = "";
    this.setScheduleParameter();
    //fill mailObj
    if (this.jsonData.data.mail) {
      this.txtMailTo = this.jsonData.data.mail.to;
      this.txtMailSubject = this.jsonData.data.mail.subject;
      this.txtMailBody = this.jsonData.data.mail.body;
    }
  }
  setScheduleParameter() {
    if (!this.jsonData.data.crq.addOSInPreTime) {
      this.addOSInPreTime = this.jsonData.data.crq.addOSInPreTime;
    }
    if (this.schedulesService.rowDataFromParent.expiryTime === 'NA') {
      this.scheduleExpiry = null;
    }
    if (this.schedulesService.rowDataFromParent.schTime === 'NA') {
      this.minutesTab = true;
      this.weeklyTab = false;
      this.hourlyTab = false;
      this.monthlyTab = false;
      return;
    }
    if (this.schedulesService.rowDataFromParent.expiryTime != "NA" && parseInt(this.schedulesService.rowDataFromParent.expiryTime) > 0) {
      var a = new Date(this.schedulesService.rowDataFromParent.expiryTime);
      this.scheduleExpiry = a;
    }
    if (this.schedulesService.rowDataFromParent.schTime != "NA" && this.schedulesService.rowDataFromParent.schTime.indexOf("Weekly") > -1) {
      this.weeklyTab = true;
      this.hourlyTab = false;
      this.monthlyTab = false;
      this.minutesTab = false;

      for (var x = 0; x < this.DAYS.length; x++) {
        if (this.DAYS[x] == this.schedulesService.rowDataFromParent.schTime.split(",")[1].trim().substring(0, 3))
          this.selectedWeek = String(this.weekDays[x].value);
      }

      var hoursMinutes = this.schedulesService.rowDataFromParent.schTime.split("at")[1].trim();
      var d = new Date();
      d.setHours(hoursMinutes.split(":")[0]);
      d.setMinutes(hoursMinutes.split(":")[1]);
      this.WeekStartTime = d;
    }
    if (this.schedulesService.rowDataFromParent.schTime != "NA" && ((this.schedulesService.rowDataFromParent.schTime.indexOf("Hourly") == -1) && (this.schedulesService.rowDataFromParent.schTime.indexOf("Daily") == -1)
      && (this.schedulesService.rowDataFromParent.schTime.indexOf("Every")) > -1)) {
      this.minutesTab = true;
      this.hourlyTab = false;
      this.monthlyTab = false;
      this.weeklyTab = false;

      if (this.schedulesService.rowDataFromParent.schTime.indexOf("Every") > -1) {
        this.everyMinutesTxtModel = parseInt(this.schedulesService.rowDataFromParent.schTime.split("Every")[1]);
      }

    }
    if (this.schedulesService.rowDataFromParent.schTime != "NA" && (this.schedulesService.rowDataFromParent.schTime.indexOf("Hourly") > -1 || this.schedulesService.rowDataFromParent.schTime.indexOf("Daily") > -1)) {

      //set the hourly tab
      this.hourlyTab = true;
      this.monthlyTab = false;
      this.weeklyTab = false;
      this.minutesTab = false;

      if (this.schedulesService.rowDataFromParent.schTime.indexOf("Every") > -1) {
        this.dailyOrEvery = "every";
        this.everyHourTxtModel = parseInt(this.schedulesService.rowDataFromParent.schTime.split("Every")[1]);
        let timeValue = this.schedulesService.rowDataFromParent.schTime.split("Hour(s)")[1];
        if (timeValue.length > 1) {
          this.addOffset = true;
          let minutes = 0;
          if (this.schedulesService.rowDataFromParent.schTime.indexOf("Starting OffSet") > -1) {
            minutes = parseInt(this.schedulesService.rowDataFromParent.schTime.split(" ")[8]);
          } else {
            minutes = parseInt(this.schedulesService.rowDataFromParent.schTime.split("Hour(s)")[1]);
          }
          if (minutes != NaN && minutes != 0) {
            this.everyHourOffsetModel = minutes;
          }
        } else {
          this.everyHourOffsetModel = null;
          this.addOffset = false;
        }
        this.dailyTxtModel = null;
      }
      else {

        this.dailyOrEvery = "daily";
        this.addOffset = false;
        var temp = this.schedulesService.rowDataFromParent.schTime.toLowerCase();

        var hoursMinutes = temp.split("at")[1].trim();
        var d = new Date();
        d.setHours(hoursMinutes.split(":")[0]);
        d.setMinutes(hoursMinutes.split(":")[1]);

        this.dailyTxtModel = d;

        this.everyHourTxtModel = null;
        this.everyHourOffsetModel = null;
      }
    }
    if (this.schedulesService.rowDataFromParent.schTime != "NA" && this.schedulesService.rowDataFromParent.schTime.indexOf("Monthly") > - 1) {

      this.monthlyTab = true;
      this.hourlyTab = false;
      this.weeklyTab = false;
      this.minutesTab = false;

      //Monthly, On day 1 every 3 month(s) At 09:30
      this.mDayModel = parseInt(this.schedulesService.rowDataFromParent.schTime.split('day')[1]);
      this.mMonthModel = parseInt(this.schedulesService.rowDataFromParent.schTime.split('every')[1]);
      var d = new Date();
      var hoursMinutes = this.schedulesService.rowDataFromParent.schTime.toLowerCase().split('at')[1].trim().split(":");
      d.setHours(hoursMinutes[0]);
      d.setMinutes(hoursMinutes[1]);
      this.monthlyStartTime = d;
    }

  }
  getBooleanFromString(str) {
    if (str === 'false') {
      return false;
    }
    else if (str === 'true') {
      return true;
    }
  }
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
  onTimeFilterTypeChange() {
    const me = this;
    if (!me.preset) {
      this.firstTimeCustom = true;
      const customTime: TimebarTimeConfig = me.addReportService.getTimeConfig(
        _.get(me.tmpValue, 'timePeriod.selected.id', '')
      );
      const serverTime = moment(me.sessionService.time);
      if (customTime) {
        me.customTimeFrame = [
          moment(customTime.frameStart.value),
          moment(customTime.frameEnd.value),
        ];
      }
      if (!me.customTimeFrame || !me.customTimeFrame.length) {
        me.customTimeFrame = [
          serverTime.clone().subtract(1, 'hour'),
          serverTime.clone(),
        ];
      }
      me.customTimeFrameMax = serverTime.clone();
      
      setTimeout(() => {
        me.onTimeFilterCustomTimeChange();
      });
    } else {
      this.checkFirstTimePreset = true;
      this.firstTimeCustom = false;
      me.presetTimeCall();
    }
  }
  getPresetInit() {
    const me = this;
    me.addReportService.pre().subscribe(
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
  presetLoading(state) { 
    this.blockedDocument = true;
  }
  presetLoaded(state) {
    if(state.data.timePeriod.options.length == 4){
      state.data.timePeriod.options.pop();
      }
      if(this.sessionService.session.cctx.prodType === "NetDiagnostics"){
        if(state.data.viewBy.options[0].label === "Auto"){
          state.data.viewBy.options.splice(0,1);
        }
      }
    this.scheduleReportService.presetData = state;
    this.preparedPreset(state.data, true);
    this.blockedDocument = false;
  }

  presetLoadingError(state) { 
    this.blockedDocument = false;
  }

  private preparedPreset(value: TimebarValue, silent?: boolean) {
    const me = this;
    const preparedValue = ObjectUtility.duplicate(value);
    this.blockedDocument = true;
    if (me.schedulesService.isEdit) {
      if (this.jsonData.data.crq.lastTime !== 'Event Days' || this.jsonData.data.crq.lastTime !== 'Time back') {
        for (let j = 0; j < preparedValue.timePeriod.options.length; j++) {
          for (let i = 0; i < preparedValue.timePeriod.options[j].items.length; i++) {
            if (preparedValue.timePeriod.options[j].items[i].label === this.jsonData.data.crq.lastTime) {
              preparedValue.timePeriod.selected = preparedValue.timePeriod.options[j].items[i];
            }
          }
        }

      }

      me.scheduleReportService.loadTime(preparedValue.timePeriod.selected.id).subscribe(
        (state: Store.State) => {
          if (state instanceof ReportTimebarTimeLoadingState) {
            me.timeLoading(state);
            return;
          }
          if (state instanceof ReportTimebarTimeLoadedState) {
            me.timeLoaded(state);
            return;
          }
        },
        (state: ReportTimebarTimeLoadingErrorState) => {
          me.timeLoadingError(state);
        }
      );

      if (this.jsonData.data.crq.viewBy) {//Minute_1
        let view = [];
        let l;
        view = this.jsonData.data.crq.viewBy.split('_');
        if (view[0] === 'Minute') {
          view[0] = 'Min';
        }

        if (view[0] === 'Hour') {
          if (view[1] == 1) {
            view[0] = 'Hour';
          }
          else { view[0] = 'Hours'; }
        }

        let newViewBy = view[1] + ' ' + view[0];// 1 Minute 


        for (let j = 0; j < preparedValue.viewBy.options.length; j++) {
          if(preparedValue.viewBy.options[j].items){
          for (let i = 0; i < preparedValue.viewBy.options[j].items.length; i++) {
            if (preparedValue.viewBy.options[j].items[i].label === newViewBy) {
              preparedValue.viewBy.selected = preparedValue.viewBy.options[j].items[i];
            }
          }
        }
        }
      }
      me.tmpValue = me.prepareValue(preparedValue);
      me.customTimeFrame = [
        moment(me.tmpValue.time.frameStart.value).zone(
          this.sessionService.selectedTimeZone.offset
        ),
        moment(me.tmpValue.time.frameEnd.value).zone(
          this.sessionService.selectedTimeZone.offset
        ),
            ];
    } else {
      me.tmpValue = me.prepareValue(preparedValue);
    this.checkFirstTimePreset = true;
    if(this.checkFirstTimePreset){
      for(let i=0;i<preparedValue.timePeriod.options[0].items.length;i++){
        if(preparedValue.timePeriod.options[0].items[i].label == 'Today'){
          let objFor = preparedValue.timePeriod.options[0].items[i];
          preparedValue.timePeriod.selected=objFor;
        }
      }
      for (let i = 0; i < preparedValue.viewBy.options[2].items.length; i++) {
        if (preparedValue.viewBy.options[2].items[i].label === "1 Hour") {
          let objViewBy = preparedValue.viewBy.options[2].items[i];
          preparedValue.viewBy.selected= objViewBy;
        }
      }
    }
    if(this.checkFirstTimePreset){
      let date = new Date();
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
    me.customTimeFrame = [
      moment(this.addReportService.srtTimeZero).zone(
        this.sessionService.selectedTimeZone.offset
      ),
      moment(me.tmpValue.time.frameEnd.value).zone(
        this.sessionService.selectedTimeZone.offset
      ),
    ];
    this.checkFirstTimePreset=false;
    }
    else{
      me.customTimeFrame = [
        moment(me.tmpValue.time.frameStart.value),
        moment(me.tmpValue.time.frameEnd.value),
      ];
    }

      if (!silent) {
        me.addReportService.setValue(me.tmpValue);
      }

      me.addReportService.setGlobalTimeBar(me.tmpValue);
    }
    this.blockedDocument = false;
    me.cd.detectChanges();
  }
  timeLoading(state) { }
  timeLoaded(state) {
    this.customTimeFrame = [
      moment(state.data[1]).zone(
        this.sessionService.selectedTimeZone.offset
      ),
      moment(state.data[2]).zone(
        this.sessionService.selectedTimeZone.offset
      )
    ];
  }
  timeLoadingError(state) { }

  onTimeFilterCustomTimeChange() {
    const me = this;
    let refDateTimeFrame = [...me.customTimeFrame];
    setTimeout(() => {
      if (me.customTimeFrame && me.customTimeFrame.length === 2) {
        if (
          me.customTimeFrame[0] !== null && me.customTimeFrame[1] !== null && me.customTimeFrame[0].valueOf() == me.customTimeFrame[1].valueOf()
        ) {
          const me = this;
          me.timeFilterEnableApply = false;
          me.invalidDate = true;
          if (me.invalidDate) {
            this.messageService.add({ severity: "error", summary: "Custom Date/Time", detail: "Start Date and End Date cannot be same." });
          }
          me.customTimeFrame = [
            refDateTimeFrame[0],
            refDateTimeFrame[1]
          ];
        }
        else if (me.customTimeFrame[0] === null) {
          me.invalidDate = true;
          if (me.invalidDate) {
            this.messageService.add({ severity: "error", summary: "Custom Date/Time", detail: "End Date should be greater than start Date." });
          }
          me.customTimeFrame = [
            refDateTimeFrame[0],
            refDateTimeFrame[1]
          ];
        }
        else if (me.customTimeFrame[1] === null) {
          me.invalidDate = true;
          if (me.invalidDate) {
            this.messageService.add({ severity: "error", summary: "Custom Date/Time", detail: "Start Date should not greater than End Date." });
          }
          me.customTimeFrame = [
            refDateTimeFrame[0],
            refDateTimeFrame[1]
          ];
        } else {
          me.invalidDate = false;
          const timePeriod = me.timebarService.getCustomTime(
            me.customTimeFrame[0].valueOf(),
            me.customTimeFrame[1].valueOf()
          );
          me.setTmpValue({
            timePeriod: timePeriod,
          });
        }
      }
    });
  }

  private setTmpValue(input: TimebarValueInput): Observable<TimebarValue> {
    const me = this;
    const output = new Subject<TimebarValue>();
    me.timeFilterEnableApply = false;

    me.timebarService
      .prepareValue(input, me.tmpValue)
      .subscribe((value: TimebarValue) => {
        const timeValuePresent = _.has(value, 'time.frameStart.value');
        if (value && timeValuePresent) {
          me.tmpValue = me.prepareValue(value);
          me.timeFilterEnableApply = true;
          let timeBack = me.tmpValue.timePeriod.selected.id;
          if (timeBack !== "TB0" && timeBack !== "TB1" && timeBack !== "TB2" && timeBack !== "TB3") {
            if(this.firstTimeCustom){
              let date1 = new Date();
              date1.setHours(0);
              date1.setMinutes(0);
              date1.setSeconds(0);
              me.customTimeFrame = [
                moment(this.addReportService.srtTimeZero).zone(
                  this.sessionService.selectedTimeZone.offset
                ),
                moment(me.tmpValue.time.frameEnd.value).zone(
                  this.sessionService.selectedTimeZone.offset
                ),
              ];
              this.firstTimeCustom=false;
            }else{
            me.customTimeFrame = [
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
          me.timeFilterEnableApply = false;
          output.next(me.tmpValue);
          output.complete();
        }
      });

    return output;
  }

  timeBackCall() {
    const me = this;
    me.timeBckCall = true;
    me.addReportService.setTimeBck(me.timeBack);
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
     // item.url = '';
      item.command = () => {
        if (!item.items) {
          me.tmpValue.viewBy.selected = item;
          me.validateTimeFilter();
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
    }

    me.setTmpValue(input);
  }

  favoriteTaskList() {
    const me = this;
    me.scheduleReportService.onTakingTempFavTaskList().subscribe(
      (state: Store.State) => {
        if (state instanceof FavoriteTaskListLoadingState) {
          me.favoriteTaskListLoading(state);
          return;
        }
        if (state instanceof FavoriteTaskListLoadedState) {
          me.favoriteTaskListLoaded(state);
          return;
        }
      },
      (state: FavoriteTaskListLoadingErrorState) => {
        me.favoriteTaskListLoadingError(state);
      }
    );
  }

  favoriteTaskListLoading(state) {
    const me = this;
    me.blockedDocument = true;
    this.timebarService.setLoading(true);
  }

  favoriteTaskListLoaded(state) {
    const me = this;
    me.excelTemplateOption = [];
    if (state.data && state.data.temFavList &&
    state.data.temFavList.excel && state.data.temFavList.excel.length > 0) {
    me.excelTemplateOption = state.data.temFavList.excel;
    me.selectedExcelTemplate = me.excelTemplateOption[0];
    if (me.schedulesService.isEdit) {
      if (this.jsonData.data.crq.format === 'EXCEL') {      
          let ar = this.jsonData.data.crq.templateName.split('.');
          for (let i = 0; i < state.data.temFavList.excel.length; i++) {
            if (state.data.temFavList.excel[i].label === ar[0]) {
              me.selectedExcelTemplate = state.data.temFavList.excel[i];
            }
          }
        }
      }
    }
    me.blockedDocument = false;
    me.timebarService.setLoading(false);
  }

  favoriteTaskListLoadingError(state) { 
    const me = this;
    me.blockedDocument = false;
    me.timebarService.setLoading(false);
  }

  getFavorite() {
    const me = this;
    const payload = {
      cctx: me.sessionService.session.cctx,
      rT: this.getReportTypeValue(this.selectedReportType.value, this.reportVisualizeType),
      mO: this.selectedFavMetricOption,
      tR: parseInt(me.sessionService.session.testRun.id),
    };
    const path = environment.api.report.getTemplateFavList.endpoint;
    const base = environment.api.core.defaultBase;
    me.scheduleReportService.onTakingFavTaskList(path, payload, base).subscribe(
      (state: Store.State) => {
        if (state instanceof FavTaskListLoadingState) {
          me.favTaskListLoading(state);
          return;
        }
        if (state instanceof FavTaskListLoadedState) {
          me.favTaskListLoaded(state);
          return;
        }
      },
      (state: FavTaskListLoadingErrorState) => {
        me.favTaskListLoadingError(state);
      }
    );
  }

  favTaskListLoading(state) {
    const me = this;
    me.blockedDocument = true;
    me.timebarService.setLoading(true);
   }

  favTaskListLoaded(state) {
    const me = this;
    if (state.data && state.data.temFavList &&
      state.data.temFavList.fav && state.data.temFavList.fav.length > 0) {
      me.templateOptions = [];
      me.templateOptions = state.data.temFavList.fav;
      me.selectedSystemTemplate = me.templateOptions[0];
      if (me.schedulesService.isEdit) {
        let ar = this.jsonData.data.crq.templateName.split(' ');
        for (let i = 0; i < state.data.temFavList.fav.length; i++) {
          if (state.data.temFavList.fav[i].value === ar[0]) {
            me.selectedSystemTemplate = state.data.temFavList.fav[i];
          }

        }
      }
    }
    me.blockedDocument = false;
    me.timebarService.setLoading(false);
  }

  favTaskListLoadingError(state) {
    const me = this;
    me.blockedDocument = false;
    this.timebarService.setLoading(false);
   }

  selectFavorite() {
    try {
      this.selectedFavorite = 'Using Favorite';
      this.selectedTemplate = '';
      this.getFavorite();
    }
    catch (error) {
      console.error(error);
    }
  }

  selectTemplate() {
    try {
      this.selectedTemplate = 'Using Template';
      this.selectedFavorite = '';
      this.getTemplate();
    }
    catch (error) {
      console.error("Error on selectTemplate call : ", error);
    }
  }
  selectMethod() {
    this.isApply=false;
    if (this.selectedReportType.value === 'Excel') {
      this.rowsForDes = 8;
      this.favoriteTaskList();
      this.addGraphImage = false;
      this.selectedNumGraphImg = '1';
    }
    else if (this.selectedReportType.value === 'Performance Stats') {
      this.rowsForDes = 10
      this.selectedFavorite = ' ';
      this.selectedTemplate = 'Using Template';
      this.getTemplate();
      this.reportVisualizeType = 'WORD';
    }
    else {
      this.rowsForDes = 15;
      this.getAlertDigestTemplate();
      this.reportVisualizeType = 'WORD';
      this.addGraphImage = false;
      this.selectedNumGraphImg = '1';
    }

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
  }
  getTemplate() {
    const me = this;
    const payload = {
      cctx: me.sessionService.session.cctx,
      rT: this.getReportTypeValue(this.selectedReportType.value, this.reportVisualizeType),
      mO: this.selectedMetricOption,
    };
    const path = environment.api.report.getTemplateFavList.endpoint;
    const base = environment.api.core.defaultBase;
    me.scheduleReportService.onTakingTemplateTaskList(path, payload, base).subscribe(
      (state: Store.State) => {
        if (state instanceof TemplateTaskListLoadingState) {
          me.templateTaskListLoading(state);
          return;
        }
        if (state instanceof TemplateTaskListLoadedState) {
          me.templateTaskListLoaded(state);
          return;
        }
      },
      (state: TemplateTaskListLoadingErrorState) => {
        me.templateTaskListLoadingError(state);
      }
    );

  }

  templateTaskListLoading(state) { 
    const me = this;
    me.blockedDocument = true;
    me.timebarService.setLoading(true);
  }

  templateTaskListLoaded(state) {
    const me = this;
    if (state.data && state.data.temFavList &&
      state.data.temFavList.json && state.data.temFavList.json.length > 0) {
      me.templateOptions = [];
      me.templateOptions = state.data.temFavList.json;
      me.selectedSystemTemplate = me.templateOptions[0];
      if (me.schedulesService.isEdit) {
        for (let i = 0; i < state.data.temFavList.json.length; i++) {
          if (state.data.temFavList.json[i].label === this.jsonData.data.crq.templateName) {
            me.selectedSystemTemplate = state.data.temFavList.json[i];
          }

        }
      }
    }
    me.blockedDocument = false;
    this.timebarService.setLoading(false);
  }

  templateTaskListLoadingError(state) {
    const me = this;
    me.blockedDocument = false;
    me.timebarService.setLoading(false);
   }


  downloadTemplate(selectedExcelTemplate, selectedReportType) {
    let url = window.location.protocol + '//' + window.location.host;
    if (selectedReportType.label == 'Excel') {
      url += "/templates/excel_templates/" + encodeURIComponent(selectedExcelTemplate.value);
    }
    else if (selectedReportType.label == 'Alert Digest Report') {
      url += "/templates/alertDigestTemplates/" + encodeURIComponent(selectedExcelTemplate.value);
    }
    window.open(url);
    this.messageService.add({severity:"success", summary:"Template Download", detail:"Template " +selectedExcelTemplate.value + " downloaded successfully." });  
    return;
  }
  onChangeTemplate(event) {
    this.selectedExcelTemplate = event.value;
  }

  onChangeReportType(event) {
    this.selectedReportType = event.value;
  }
  validateQty(event): boolean {
    if (event.charCode > 31 && (event.charCode < 48 || event.charCode > 57))
      return false;
    return true;
  }
  saveSchedule() {
    SCHEDULES_TABLE_DATA.paginator.first = 0;
    SCHEDULES_TABLE_DATA.paginator.rows = 10;
    let status = this.vaildateInputFields(this.taskName, this.txtMailTo, this.txtMailSubject, this.taskDescription);
    let status1 = false;

    if (this.taskName.length > 20) {
      this.confirmationDialog("Error", "Report Name should not exceed 20 characters.");
      return;
    }
    let tempp;
    let tempOrFav;
    if (this.selectedReportType.value === 'Excel' || this.selectedReportType.value === 'Alert Digest Report') {
    tempp = this.selectedExcelTemplate;
    if(tempp == undefined || tempp == null){
      this.confirmationDialog("Error", "Please select template");
      return;
    }
    if(this.selectedReportType.value === 'Excel'){
    tempOrFav = "Excel";
    }else if(this.selectedReportType.value === 'Alert Digest Report'){
      tempOrFav = "Alert";
    }
    } 
    else {
       if (this.selectedTemplate === 'Using Template') {
        tempp = this.selectedSystemTemplate;
        tempOrFav = "Template";
       }
       if (this.selectedFavorite === 'Using Favorite') {
        tempp = this.selectedSystemTemplate;
        tempOrFav = "Favourite";
       }
     }
    if(status){
      status = this.validateTemplate(tempp, tempOrFav);
    }
    if(status){
      status = this.validateOnTimeFilterCustomTimeChange();
    }
    if (status) {
       
      status1 = this.createCronString();
      if(status1){
      this.createMailObj();
      this.createCrqObj();
      this.createSch();
      this.blockedDocument = true;
      if (this.isEditClicked) {
        this.updateReportTask();
        this.isEditClicked = false;
        this.schedulesService.isEdit = false;
      }
      else {
        this.addReportTask();
      }
      this.resetCreateTaskObj();
      
    }
    }

  }
  resetCreateTaskObj() {
    this.taskName = '';
    this.selectedReportType = { label: 'Excel', value: 'Excel' };
    this.selectedTemplate = 'Using Template';
    this.selectedFavorite = '';
    this.preset = true;
    this.overridePreset = false;
    this.tmpValue = Report_Scheduler_Preset;
    this.customTimeFrame = [
      moment(this.tmpValue.time.frameStart.value),
      moment(this.tmpValue.time.frameEnd.value)
    ];
    this.aggregatedValue = true;
    this.selectedAggregateTimeOption = 'Minute(s)';
    this.aggregatedValue = true;
    this.selectedAaggregateByOption = { label: '1', value: '1' };
    this.shwLstData = false;
    this.selectedValue = { label: 'Column', value: 0 };
    this.taskDescription = '';
    this.reportVisualizeType = 'WORD';
    this.addGraphImage = false;

    // sch
    this.minutesTab = true;
    this.hourlyTab = false;
    this.weeklyTab = false;
    this.monthlyTab = false;
    this.everyMinutesTxtModel = null;
    this.scheduleExpiry = null;
    this.dailyOrEvery = 'daily';
    this.everyHourTxtModel = null;
    this.dailyTxtModel = null;
    this.addOffset = false;
    this.everyHourOffsetModel = 0;
    this.WeekStartTime = null;
    this.mDayModel = null;
    this.mMonthModel = null;
    this.monthlyStartTime = null;
    this.txtMailTo = '';
    this.txtMailSubject = '';
    this.txtMailBody = '';
  }
  createSch() {
    const me = this;
    //this.schObj.taskid = this.taskName;
    if (me.schedulesService.isEdit) {
      me.schObj.taskId = me.schedulesService.rowDataFromParent.taskId;
      me.schObj.taskType = this.getTaskTypeAccToDB(this.selectedReportType.value);
      this.schObj.status = me.schedulesService.rowDataFromParent.status;

    } else {
      me.schObj.taskId = -1;
      me.schObj.taskType = this.getTaskTypeAccToDB(this.selectedReportType.value);
      this.schObj.status = 'Active';
    }
    this.schObj.cronStr = this.cronFormat;

    if (this.scheduleExpiry == undefined) {
      this.schObj.expiryTime = '0';
    } else {
      this.schObj.expiryTime = moment(this.scheduleExpiry).format('MM/DD/YYYY HH:mm:ss');
    }
    this.schObj.schTime = this.sDateFormat;
    this.schObj.taskDes = this.taskDescription;
    this.schObj.scheduled = false;
  }
  getTaskTypeAccToDB(rawTaskType): string {
    let tskTyp;
    if (rawTaskType === 'Excel') {
      tskTyp = 'Excel Report';
    }
    else if (rawTaskType === 'Performance Stats' && this.reportVisualizeType === 'WORD') {
      tskTyp = 'Word Report';
    }
    else if (rawTaskType === 'Performance Stats' && this.reportVisualizeType === 'HTML') {
      tskTyp = 'Html Report';
    }
    else if (rawTaskType === 'Alert Digest Report') {
      let arr = rawTaskType.split(' ');
      tskTyp = arr[0] + ' ' + arr[1] + this.reportVisualizeType + ' ' + arr[2];
    }
    return tskTyp;
  }
  getDrpRptTypeList() {
    this.drpRptViewTypeStatsList = [];
    this.drpRptViewTypeList = [];
    this.drpRptViewTypeStatsList.push({ label: 'WORD', value: 'WORD' });
    this.drpRptViewTypeStatsList.push({ label: 'HTML', value: 'HTML' });
    this.drpRptViewTypeList.push({ label: 'WORD', value: 'WORD' });
    this.drpRptViewTypeList.push({ label: 'EXCEL', value: 'EXCEL' });
    this.drpRptViewTypeList.push({ label: 'PDF', value: 'PDF' });
  }
  fillAggregateByDropdown() {
    try {
      if (this.aggregatedValue)
        this.aggTimeUnitInExcel = '-1';
      else {
        this.aggTimeUnitInExcel = this.selectedAggregateTimeOption;
      }
      this.aggregatebyDropdown = [];
      if (this.selectedAggregateTimeOption === 'Minute(s)') {
        this.aggregatebyDropdown.push({ label: '1', value: '1' });
        this.aggregatebyDropdown.push({ label: '5', value: '5' });
        this.aggregatebyDropdown.push({ label: '10', value: '10' });
        this.aggregatebyDropdown.push({ label: '15', value: '15' });
        this.aggregatebyDropdown.push({ label: '30', value: '30' });
      }
      else if (this.selectedAggregateTimeOption === 'Hour(s)') {
        this.aggregatebyDropdown.push({ label: '1', value: '1' });
        this.aggregatebyDropdown.push({ label: '2', value: '2' });
        this.aggregatebyDropdown.push({ label: '4', value: '4' });
        this.aggregatebyDropdown.push({ label: '6', value: '6' });
        this.aggregatebyDropdown.push({ label: '12', value: '12' });
        this.aggregatebyDropdown.push({ label: '24', value: '24' });
      }
      else if (this.selectedAggregateTimeOption === 'Day(s)' || this.selectedAggregateTimeOption === 'Week(s)' || this.selectedAggregateTimeOption === 'Month(s)') {
        this.aggregatebyDropdown.push({ label: '1', value: '1' });
        this.aggregatebyDropdown.push({ label: '2', value: '2' });
        this.aggregatebyDropdown.push({ label: '3', value: '3' });
      }
    }
    catch (e) {
      console.error(e);
    }
  }
  selectAggregateTimeOption() {
    try {
      this.aggregateTimeDropdown = [];
      this.aggregateTimeDropdown.push({ label: 'Minute(s)', value: 'Minute(s)' });
      this.aggregateTimeDropdown.push({ label: 'Hour(s)', value: 'Hour(s)' });
      this.aggregateTimeDropdown.push({ label: 'Day(s)', value: 'Day(s)' });
      this.aggregateTimeDropdown.push({ label: 'Week(s)', value: 'Week(s)' });
      this.aggregateTimeDropdown.push({ label: 'Month(s)', value: 'Month(s)' });
      this.fillAggregateByDropdown();
    }
    catch (e) {
      console.error(e);
    }
  }

  selectAggregatebyOption() {
    try {
      this.aggTimeValueInExcel = this.selectedAaggregateByOption;
    } catch (error) {
      console.error(error);
    }
  }
  onSelectTemplateToUpload(event, fileUpload) {
    try {
      this.count = 0;
      let uploadFile = event.files[0].name;
      this.uploadedFileName = uploadFile;
      if (uploadFile.substring(uploadFile.lastIndexOf(".")) != '.xls' && uploadFile.substring(uploadFile.lastIndexOf(".")) != '.xlsx') {
        this.dialogVisible = true;
        this.confirmation.confirm({
          key: 'scheduler',
          message: "Please select correct "+this.selectedReportType.value+" Template file",
          header: "Error",
          accept: () => { this.dialogVisible = false; fileUpload.clear();this.tooltip=""; return; },
          rejectVisible: false
        });
        return;
      }
      this.tooltip = uploadFile;
      let productKey = this.sessionService.session.cctx.pk;
      let userName = this.sessionService.session.cctx.u;
      let path = environment.api.report.uploadTemplate.endpoint;
      let url = window.location.protocol + '//' + window.location.host;
      if (this.selectedReportType.value === 'Excel') {
        this.uploadURL = url + environment.api.core.defaultBase + path + '?fileName=' + uploadFile + "&productKey=" + productKey + "&userName=" + userName + "&rT=" + this.excelReportOption;
      }
      else {
        this.uploadURL = url + environment.api.core.defaultBase + path + '?fileName=' + uploadFile + "&productKey=" + productKey + "&userName=" + userName + "&rT=" + this.alertDigestReportOption;
      }
      if (this.excelTemplateOption) {
        for (let i = 0; i < this.excelTemplateOption.length; i++) {
          if (uploadFile == this.excelTemplateOption[i].value) {
            this.dialogVisible = true;
            this.confirmation.confirm({
              key: 'scheduler',
              message: "Template " +uploadFile+ " is already present.Do you want to overwrite this template?",
              header: "Confirmation",
              accept: () => { this.dialogVisible = false; this.tooltip=uploadFile; return; },
              reject: () => { this.dialogVisible = false; fileUpload.clear(); this.tooltip=""; return; },
              rejectVisible: true
            });
            return;
          }
        }
      }
    } catch (error) {
      this.count = 0;
      console.error(error);
    }
    let nameWithoutExtension = event.files[0].name.split(".xls");
    if(this.selectedReportType.value === 'Excel' &&(nameWithoutExtension[0].includes(".") || nameWithoutExtension[0].includes("/") || nameWithoutExtension[0].includes("#") || nameWithoutExtension[0].includes('"'))){
      this.confirmationDialog("Error","Excel Template with following special symbols (#./) and double quotation symbols are not allowed.");
      fileUpload.clear();
      this.tooltip="";
      return;
    }
    if(this.selectedReportType.value === 'Alert Digest Report' && (nameWithoutExtension[0].includes(".") || nameWithoutExtension[0].includes("/") || nameWithoutExtension[0].includes("#") || nameWithoutExtension[0].includes('"'))){
      this.confirmationDialog("Error","Alert Digest Template with following special symbols (#./) and double quotation symbols are not allowed.");
      fileUpload.clear();
      this.tooltip="";
      return;
    }
  }
  afterTemplateUploadScheduler(event, excelFileUpload) {
    try {
      this.count = this.count + 1;
      if(this.count == 1){
      if(this.selectedReportType.value === 'Excel'){
        this.favoriteTaskList();
      }
      if(this.selectedReportType.value === 'Alert Digest Report'){
        this.getAlertDigestTemplate();
      }
      let fileName;
      if(this.uploadedFileName){
        fileName = this.uploadedFileName;
      }else{
        fileName = "";
      }
      this.messageService.add({severity:"success", summary:"Template Upload", detail:"Template " +fileName+ " uploaded successfully." });
      this.tooltip="";
    }
    } catch (error) {
      console.error(error);
    }
  }
  createCrqObj() {
    if (this.tmpValue.timePeriod.selected.label === 'Custom Time') {
      this.crqObj.lastTime = 'Custom';
    } else if((this.tmpValue.timePeriod.selected.id).indexOf('EV')>-1){
      this.crqObj.lastTime = "Event Days";
      for(let i = 0; i<this.tmpValue.timePeriod.options[2].items.length; i++){
        for(let j=0;j<this.tmpValue.timePeriod.options[2].items[i].items.length; j++){
          if(this.tmpValue.timePeriod.selected.id === this.tmpValue.timePeriod.options[2].items[i].items[j].id){
            this.crqObj.eventDay = this.tmpValue.timePeriod.options[2].items[i].label;
          }

        }
      }
      this.crqObj.eventYear = this.tmpValue.timePeriod.selected.label;
    }else{
      this.crqObj.lastTime = this.tmpValue.timePeriod.selected.label;
    }
    if(this.aggregatedValue == true){
      this.crqObj.readFromTemplate = this.overridePreset;
      }else{
        this.crqObj.readFromTemplate = false;
      }
      this.crqObj.shwLstData = this.shwLstData;
    if (this.selectedValue.value == 1) {
      this.crqObj.reportView = "tabView";
    } else {
      this.crqObj.reportView = "columnView";
    }
    if(this.addGraphImage == false){
      this.crqObj.numAddGraphImageInSchMailBody = '-1';
    }else{
    this.crqObj.numAddGraphImageInSchMailBody = this.selectedNumGraphImg;
    }
    this.crqObj.isMultiDC = this.isMultiDC;
    this.crqObj.aggEntireRpt = this.selectedAaggregateByOption.value + ' ' + this.selectedAggregateTimeOption.split('(')[0] + ' ' + this.aggregatedValue;
    this.crqObj.includeChart = this.includeMetricChart;
    this.crqObj.userName = this.sessionService.session.cctx.u;
    this.crqObj.productKey = this.sessionService.session.cctx.pk;
    this.crqObj.testRun = this.sessionService.session.testRun.id;
    let viewByArr;
    let newViewByForCrqCreation;
    if (this.tmpValue.viewBy.selected.label) {
      viewByArr = this.tmpValue.viewBy.selected.label.split(' ');
      if (viewByArr[1] === 'Min') {
        viewByArr[1] = 'Minute';
      }
      if (viewByArr[1] === 'Hours') {
        viewByArr[1] = 'Hour';
      }
      newViewByForCrqCreation = viewByArr[1] + '_' + viewByArr[0];
    }
    this.crqObj.viewBy = newViewByForCrqCreation;
    if(!this.addOSInPreTime && this.addOffset){
    this.crqObj.addOSInPreTime = this.addOSInPreTime;
    }else{
      this.crqObj.addOSInPreTime = true;
    }
    if(this.addOffset){
      this.crqObj.offSetValue = this.everyHourOffsetModel + "";
    }
    if(this.sessionService.preSession.multiDc){
      this.crqObj.multiDCPort =  window.location.protocol+"//"+window.location.host;
      this.crqObj.isMultiDC = true;
    }else{
      this.crqObj.multiDCPort = '';
      this.crqObj.isMultiDC = false;
    }
    this.crqObj.isDiscontinue = this.isDiscontinue;
    this.crqObj.boundaryCondition = this.boundaryCondition;
    if (this.selectedReportType.value === 'Excel' || this.selectedReportType.value === 'Alert Digest Report') {
      this.crqObj.templateName = this.selectedExcelTemplate.value;
    } else {
      if (this.selectedTemplate === 'Using Template') {
        this.crqObj.templateName = this.selectedSystemTemplate.label;
      }
      if (this.selectedFavorite === 'Using Favorite') {
        this.crqObj.templateName = this.selectedSystemTemplate.value + ' *Fav';
      }
    }

    this.crqObj.addGraphImageInSchMailBody = this.addGraphImage;
    this.crqObj.name = this.taskName;
    if (this.selectedReportType.value === 'Excel') {
      this.crqObj.format = 'EXCEL';
    }
    else if (this.selectedReportType.value === 'Alert Digest Report') {
      this.crqObj.format = 'ALERT';
    }
    else if (this.selectedReportType.value === 'Performance Stats') {
      this.crqObj.format = this.reportVisualizeType;
    }
    let datetime: string;
    if (this.preset == false) {
      this.crqObj.startDate = this.customTimeFrame[0].format('MM/DD/YYYY');
      this.crqObj.startTime = this.customTimeFrame[0].format('HH:mm:ss');
      this.crqObj.endDate = this.customTimeFrame[1].format('MM/DD/YYYY');
      this.crqObj.endTime = this.customTimeFrame[1].format('HH:mm:ss');
    }
    if (this.selectedTemplate === 'Using Template' || this.selectedReportType.value === 'Excel') {
      this.crqObj.metricOption = ReportConstant.TEMPLATE_GRAPH_REPORT;
    } else if (this.selectedFavorite === 'Using Favorite') {
      this.crqObj.metricOption = ReportConstant.Favorite_GRAPH_REPORT;
    }
   // this.crqObj.multiDCPort = " ";
    this.crqObj.cck = this.sessionService.session.cctx.cck;
    this.crqObj.prodType = this.sessionService.session.cctx.prodType;


  }

  selectFormat(){
    this.checkMetricsCharts = true;
    this.includeMetricChart = true;
    this.addGraphImage = false;
    if(this.reportVisualizeType=="HTML"){
      console.log("1--------");
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
    }
  }

  pushGraphImageArr() {
    this.numGraphImgDropdown = [];
    this.numGraphImgDropdown.push({ label: '1', value: '1' });
    this.numGraphImgDropdown.push({ label: '2', value: '2' });
    this.numGraphImgDropdown.push({ label: '3', value: '3' });
    this.numGraphImgDropdown.push({ label: '4', value: '4' });
    this.numGraphImgDropdown.push({ label: '5', value: '5' });
    this.numGraphImgDropdown.push({ label: '6', value: '6' });
  }

  selectAlertDigest(){
    if(this.selectedExcelTemplate.label == 'AlertDigestReportWithGrouping'){
      this.toolTipTest = "Default Template cannot be deleted";
    }
    else{
      this.toolTipTest = "Delete";
    }
  }

  createMailObj() {
    this.mailObj.subject = this.txtMailSubject;
    this.mailObj.to = this.txtMailTo;
    this.mailObj.body = this.txtMailBody;
  }
  vaildateInputFields(tskName, mailId, subj, des) {
    let status = false;
    try {
      status = this.validateTaskNameAndDes(tskName, des);

      if (status) {
        status = this.validateEmail(mailId);
      }
      if(status){
        if (subj === '' || subj == null) {
          this.confirmationDialog("Error", "Subject field is empty");
          return;
        }
      }

    } catch (error) {
      console.error(error);
    }
    return status;
  }
  
  validateTaskNameAndDes(taskName, des) {
    try {
      let _regSeperator = new RegExp('^[a-zA-Z][a-zA-Z0-9_().{}\:\]*$');
      let _regSeperator1 = new RegExp("^[^\s]+[-a-zA-Z\s]+([-a-zA-Z]+)*$");
      if (taskName === '' || taskName == null) {
        this.confirmationDialog("Error", "Please enter Report Name");
        return;
      }

      if (!_regSeperator.test(taskName)) {
        this.confirmationDialog("Error", "Please enter valid Report Name.\r\nReport "
          + "name must start with alphabet. \r\n Maximum length is 128. \r\nAllowed "
          + "characters are alphanumeric and  following special characters: ( ) { } _  . \ :");
        return;
      }
      if (taskName.length > 128) {
        this.confirmationDialog("Error", "Enter Report Name <= 128 characters.");
        return;
      }
      if (des === '' || des == null) {
        this.confirmationDialog("Error", "Please enter task description");
        return;
      }
    } catch (error) {
      console.error(error);
    }
    return true;
  }
  
  confirmationDialog(head, msg) {
    this.dialogVisible = true;
    this.confirmation.confirm({
      key: 'scheduler',
      message: msg,
      header: head,
      accept: () => {
        this.dialogVisible = false;
        return;
      },
      rejectVisible: false
    });
  }
  
  validateEmail(inputText) {
    try {
      let txtEmailId = inputText;
      let arrEmailId = [];
      if (inputText.indexOf(";") > -1) {
        arrEmailId = txtEmailId.split(";");
      }
      else {
        arrEmailId[0] = txtEmailId;
      }

      let _regSeperator = new RegExp("[$&+,:=?#|'<>^*()%!]");

      for (let i = 0; i < arrEmailId.length; i++) {
        let emailValue = arrEmailId[i];

        if (!emailValue) {
          this.confirmationDialog("Error", "Please enter Email Id");
          return;
        }
        if (_regSeperator.test(emailValue)) {
          this.confirmationDialog("Error", "Please check, email addresses saperator not valid. Use semi-colon ';' for email seperator");
          return;
        }

        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.(com))+$/.test(emailValue))) {
          this.confirmationDialog("Error", "Email id is not correct. Please enter valid email id.");
          return;
        }
      }
      return true;
    }
    catch (error) {
      console.error("error :", error);
      return false;
    }
  }
  getReportTypeValue(selectedReportType, reportVisualizeType) {
    let reportId = ReportConstant.STATS_REPORT;
    if (selectedReportType.value == "Performance Stats") {
      if (reportVisualizeType == "WORD") {
        reportId = ReportConstant.WORD_REPORT;
      }
      else if (reportVisualizeType == "HTML") {
        reportId = ReportConstant.HTML_REPORT;
      }
    }
    return reportId;
  }

  reportSetting() {
    this.displayReportSetting = true;
  }

  styleForDialog(event) {
    return { width: '350px', minWidth: '200px' };
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
  createCronString() {
    var scheduleExpiry = "";
    if (this.minutesTab) {
      if (this.everyMinutesTxtModel == undefined) {
        this.confirmationDialog("Error", "Please enter number of minute(s)");
        return;
        
      }
      var _regHourly = new RegExp("^[0-9]{1,2}$");
      if (!_regHourly.test(String(this.everyMinutesTxtModel)) || this.everyMinutesTxtModel < 1) {
          this.confirmationDialog("Error", "Please enter the valid number of minutes(s)");
          return;
      }
      if (this.everyMinutesTxtModel > 59) {
          this.confirmationDialog("Error", "Number of minute(s) must not exceed 59");
          return;
      }
      
      if (this.scheduleExpiry != null && this.scheduleExpiry !== undefined) {
        let expiryTimeInMili = this.scheduleExpiry.getTime();
        /**If expiry time is less than the current time */
        if (expiryTimeInMili > 0 && expiryTimeInMili < new Date(this.getFormattedCurrDateAccToZone()).getTime()) {
          this.confirmationDialog("Error", "Schedule expiry Date is less than Schedule Date Time");
          return;
        }
      }
      this.cronFormat = "0 */" + this.everyMinutesTxtModel + " * * * *";
      this.sDateFormat = "Every " + this.everyMinutesTxtModel + " Minute(s) ";
      return true;
    } else if (this.hourlyTab) {
      if (this.dailyOrEvery == 'every')//for Every
      {
        if (this.everyHourTxtModel == undefined) {
          this.confirmationDialog("Error", "Please enter number of hour(s)");
          return;
        }
        var _regHourly = new RegExp("^[0-9]{1,2}$");
        if (!_regHourly.test(String(this.everyHourTxtModel)) || this.everyHourTxtModel < 1) {

          this.confirmationDialog("Error", "Please enter the valid number of hour(s)");
          return;
        }
        if (this.everyHourTxtModel > 23) {
          this.confirmationDialog("Error", "Number of hour(s) must not exceed 23");
          return;
        }

        let minutes = "";
        if (this.addOffset == true) {
          if (this.everyHourOffsetModel != null) {
            minutes = "with Starting OffSet of " + this.everyHourOffsetModel + " Minute(s)_" + this.addOSInPreTime;
            if (!_regHourly.test(String(this.everyHourOffsetModel)) || this.everyHourOffsetModel < 1) {
              this.confirmationDialog("Error", "Please enter the valid number of minute(s)");
              return;
            }

            if (this.everyHourOffsetModel > 59) {
              this.confirmationDialog("Error", "Number of minute(s) must not exceed 59");
              return;
            }

            if (this.everyHourOffsetModel == undefined) {
              this.confirmationDialog("Error", "Please enter number of minute(s)");
              return;
            }

          }else{
            this.confirmationDialog("Error", "Please enter the valid number of minute(s)");
              return;
          }
        }
        /**If offset is not enable */
        if (this.everyHourOffsetModel == null) {
          this.everyHourOffsetModel = 0;
        }
        if (this.scheduleExpiry != null && this.scheduleExpiry !== undefined) {
          let expiryTimeInMili = this.scheduleExpiry.getTime();
          if (expiryTimeInMili > 0) {
            /**If expiry time is less than the current time */
            if (expiryTimeInMili < new Date(this.getFormattedCurrDateAccToZone()).getTime()) {
              this.confirmationDialog("Error", "Schedule expiry Date is less than Schedule Date Time");
              return;
            }
            let index = 0;
            let nxtIterDate = 0
            let currentDateInmili;
            while (nxtIterDate < new Date(this.getFormattedCurrDateAccToZone()).getTime()) {
              if (index == 0) {
                currentDateInmili = new Date(this.getFormattedCurrDateAccToZone());
                currentDateInmili.setHours(0);
                currentDateInmili.setMinutes(0);
                currentDateInmili.setSeconds(0);
              }
              nxtIterDate = index * 3600 * 1000;
              nxtIterDate += this.everyHourOffsetModel * 60 * 1000;
              nxtIterDate = nxtIterDate + currentDateInmili.getTime();
              index += this.everyHourTxtModel;
              if (index > 23) {
                index = 0;
              }
            }

            if (nxtIterDate > expiryTimeInMili) {
              this.confirmationDialog("Error", "Schedule expiry Date is less than Schedule Date Time");
              return;
            }
          }
        }

        this.cronFormat = "0 " + this.everyHourOffsetModel + " */" + this.everyHourTxtModel + " * * *";
        this.sDateFormat = "Hourly, Every " + this.everyHourTxtModel + " Hour(s) " + minutes;
        return true;
      } else {//for daily
        var time = this.dailyTxtModel;
        var _regDailyAt = new RegExp("^[0-2][0-9]:[0-5][0-9]$");
        if (time == undefined) {
          this.confirmationDialog("Error", "Please enter daily at time");
          return;

        }
        if (this.scheduleExpiry != null && this.scheduleExpiry !== undefined) {
          let expiryTime = this.scheduleExpiry.getTime();
          if (expiryTime > 0) {
            /**If expiry time is less than the current time */
            if (expiryTime < new Date(this.getFormattedCurrDateAccToZone()).getTime()) {
              this.confirmationDialog("Error", "Schedule expiry Date is less than Schedule Date Time");
              return;
            }

            let currentDate = new Date();
            currentDate.setHours(time.getHours());
            currentDate.setMinutes(time.getMinutes());
            currentDate.setSeconds(0);
            /**current date iteration not possiable , check for nxt day*/
           if (new Date(this.getFormattedCurrDateAccToZone()).getTime() > currentDate.getTime()) {
              let nxtDate = currentDate.getDate() + 1;
              let nxtDateObj = new Date(this.getFormattedCurrDateAccToZone());
              nxtDateObj.setDate(nxtDate);
              nxtDateObj.setHours(time.getHours());
              nxtDateObj.setMinutes(time.getMinutes());
              nxtDateObj.setSeconds(0);
              if (nxtDateObj.getTime() > expiryTime) {
                this.confirmationDialog("Error", "Schedule expiry Date is less than Schedule Date Time");
                return;
              }
            }
          }
        }

        var d = new Date(time);
        this.cronFormat = "0 " + d.getMinutes() + " " + d.getHours() + " * * *";
        this.sDateFormat = "Daily, at " + this.appendZeroIfRequired(d.getHours()) + ":" + this.appendZeroIfRequired(d.getMinutes()) + "";

        return true;

      }

    } else if (this.weeklyTab) {
      var days = -1;
      var sdays = -1;

      var daysChecked = this.selectedWeek;
      var n = 0;
      if (daysChecked == undefined || daysChecked == "") {
        this.confirmationDialog("Error", "Select days of the week");
        return;
      }
      if (daysChecked == "Monday")
        days = 1
      if (daysChecked == "Tuesday")
        days = 2
      if (daysChecked == "Wednesday")
        days = 3
      if (daysChecked == "Thursday")
        days = 4
      if (daysChecked == "Friday")
        days = 5
      if (daysChecked == "Saturday")
        days = 6
      if (daysChecked == "Sunday")
        days = 0
      var _regWeekTime = new RegExp("^[0-2][0-9]:[0-5][0-9]$");
      if (this.WeekStartTime == undefined) {
        this.confirmationDialog("Error", "Please enter start time");
        return;
      }
      if (this.scheduleExpiry != null && this.scheduleExpiry !== undefined) {
        let expiryTime = this.scheduleExpiry.getTime();
        if (expiryTime > 0) {
          let expiryTimeDay = this.scheduleExpiry.getDay();
          if (expiryTime < new Date(this.getFormattedCurrDateAccToZone()).getTime() || expiryTimeDay <= days) {
            this.confirmationDialog("Error", "Schedule expiry Date is less than Schedule Date Time");
            return;
          }
        }
      }
      this.cronFormat = "0 " + this.WeekStartTime.getMinutes() + " " + this.WeekStartTime.getHours() + " * * " + days;
      this.sDateFormat = "Weekly, " + this.DAYS[days] + " at " + this.appendZeroIfRequired(this.WeekStartTime.getHours()) + ":" + this.appendZeroIfRequired(this.WeekStartTime.getMinutes());
      return true;
    } else if (this.monthlyTab) {
      var d = this.monthlyStartTime;
      if (this.mDayModel == undefined || String(this.mDayModel) == "") {
        this.confirmationDialog("Error", "Please enter number of days");
        return;
      }
      if (this.mDayModel < 1 || this.mDayModel > 31) {
        this.confirmationDialog("Error", "Day(s) should be between 1 to 31");
        return;
      }

      if (this.mMonthModel == undefined || String(this.mMonthModel) == "") {
        this.confirmationDialog("Error", "Enter number of months");
        return;
      }

      if (this.mMonthModel < 1 || this.mMonthModel > 12) {
        this.confirmationDialog("Error", "Month should be between 1  to 12");
        return;
      }
      if (this.monthlyStartTime == undefined) {
        this.confirmationDialog("Error", "Please enter start time");
        return;
      }
      if (this.scheduleExpiry != null && this.scheduleExpiry !== undefined) {
        let expiryTime = this.scheduleExpiry.getTime();
        if (expiryTime > 0) {

          /**If expiry time is less than the current time */
          if (expiryTime < new Date(this.getFormattedCurrDateAccToZone()).getTime()) {
            this.confirmationDialog("Error", "Schedule expiry Date is less than Schedule Date Time");
            return;
          }
          let currentDate = new Date();
          currentDate.setDate(this.monthlyStartTime.getDate());
          currentDate.setMonth(this.monthlyStartTime.getMonth());
          currentDate.setHours(this.monthlyStartTime.getHours());
          currentDate.setMinutes(this.monthlyStartTime.getMinutes());
          currentDate.setSeconds(0);
          /**current date iteration not possiable , check for nxt day*/
          if (new Date(this.getFormattedCurrDateAccToZone()).getTime() > currentDate.getTime()) {
            let nxtyear = currentDate.getFullYear() + 1;
            let nxtDateObj = new Date(this.getFormattedCurrDateAccToZone());
            nxtDateObj.setFullYear(nxtyear);
            nxtDateObj.setDate(this.monthlyStartTime.getDate());
            nxtDateObj.setMonth(this.monthlyStartTime.getMonth());
            nxtDateObj.setHours(this.monthlyStartTime.getHours());
            nxtDateObj.setMinutes(this.monthlyStartTime.getMinutes());
            nxtDateObj.setSeconds(0);
            if (nxtDateObj.getTime() > expiryTime) {
              this.confirmationDialog("Error", "Schedule expiry Date is less than Schedule Date Time");
              return;

            }
          }
        }
      }
      this.cronFormat = this.mDayModel + " */" + this.mMonthModel + " *";
      this.sDateFormat = "Monthly, On day " + this.mDayModel + " of every " + this.mMonthModel + " month(s)";
      this.cronFormat = "0 " + d.getMinutes() + " " + d.getHours() + " " + this.cronFormat;
      this.sDateFormat += " At " + this.appendZeroIfRequired(d.getHours()) + ":" + this.appendZeroIfRequired(d.getMinutes());
      return true;
    }

  }
  appendZeroIfRequired(element) {
    var temp = String(element);
    temp = temp.length > 1 ? temp : '0' + temp;
    return temp;
  }
  onTabChange(event) {

    this.seletectedTabIndex = event.index;//setting the selected tab
    if (this.seletectedTabIndex == 0) {
      this.minutesTab = true;
      this.hourlyTab = false;
      this.weeklyTab = false;
      this.monthlyTab = false;

    }
    else if (this.seletectedTabIndex == 1) {
      this.hourlyTab = true;
      this.weeklyTab = false;
      this.monthlyTab = false;
      this.minutesTab = false;
    }
    else if (this.seletectedTabIndex == 2) {
      this.hourlyTab = false;
      this.weeklyTab = true;
      this.monthlyTab = false;
      this.minutesTab = false;
    }
    else if (this.seletectedTabIndex == 3) {
      this.hourlyTab = false;
      this.weeklyTab = false;
      this.monthlyTab = true;
      this.minutesTab = false;
    }
    else if (this.seletectedTabIndex == 4) {
      this.hourlyTab = false;
      this.weeklyTab = false;
      this.monthlyTab = false;
      this.minutesTab = false;
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
      console.error("error : " + error);
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

  pushWeekDays() {
    var arr = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for (var i = 0; i < arr.length; i++) {
      this.weekDays.push({ label: arr[i], value: arr[i] });
    }
  }
  getAlertDigestTemplate() {
    const me = this;
    const payload = {
      cctx: me.sessionService.session.cctx,
      rT: this.alertDigestReportOption,
      mO: this.selectedMetricOption,
      tR: parseInt(me.sessionService.session.testRun.id),
    };
    const path = environment.api.report.getTemplateFavList.endpoint;
    const base = environment.api.core.defaultBase;
    me.scheduleReportService.onTakingAlertDigestTemplateTaskList(path, payload, base).subscribe(
      (state: Store.State) => {
        if (state instanceof AlertDigestTaskListLoadingState) {
          me.alertDigestTaskListLoading(state);
          return;
        }
        if (state instanceof AlertDigestTaskListLoadedState) {
          me.alertDigestTaskListLoaded(state);
          return;
        }
      },
      (state: AlertDigestListLoadingErrorState) => {
        me.alertDigestTaskListLoadingError(state);
      }
    );
  }

  alertDigestTaskListLoading(state) { 
    const me = this;
    me.blockedDocument = true;
    me.timebarService.setLoading(true);
  }
  alertDigestTaskListLoaded(state) {
    const me = this;
    me.excelTemplateOption = [];
    if (state && state.data && state.data.temFavList
      && state.data.temFavList.alert && state.data.temFavList.alert.length > 0) {
      me.excelTemplateOption = state.data.temFavList.alert;
      me.selectedExcelTemplate = me.excelTemplateOption[0];
      if (this.selectedExcelTemplate.label == 'AlertDigestReportWithGrouping') {
        this.toolTipTest = 'Default Template cannot be delated';
      }
      else {
        this.toolTipTest = 'Delete';
      }

      if (me.schedulesService.isEdit) {
        if (this.jsonData.data.crq.format === 'ALERT') {
          let ar = this.jsonData.data.crq.templateName.split('.');
          for (let i = 0; i < state.data.temFavList.alert.length; i++) {
            if (state.data.temFavList.alert[i].label === ar[0]) {
              me.selectedExcelTemplate = state.data.temFavList.alert[i];
            }
          }
        }
      }
    }
    me.blockedDocument = false;
    me.timebarService.setLoading(false);
  }

  alertDigestTaskListLoadingError(state) { 
    const me = this;
    me.blockedDocument = false;
    me.timebarService.setLoading(false);
  }

  fillMailBody(hint) {
    this.txtMailBody = this.txtMailBody + ' ' + hint + ' ';
  }
  addReportTask() {
    const me = this;
    let lastModified = new Date();
    me.schObj.lastModified = lastModified.getTime();
    const payload = {
      cctx: me.sessionService.session.cctx,
      crq: this.crqObj,
      mail: this.mailObj,
      taskInfoList: [this.schObj]
    };
    this.scheduleReportService.addReportTask(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof AddReportTaskLoadingState) {
          me.onLoadingAddReportTask(state);
          return;
        }

        if (state instanceof AddReportTaskLoadedState) {
          me.onLoadedAddReportTask(state);
          return;
        }
      },
      (state: AddReportTaskLoadingErrorState) => {
        me.onLoadingErrorAddreportTask(state);
      }
    );


  }
  onLoadingAddReportTask(state) {
    this.timebarService.setLoading(true);
  }
  onLoadedAddReportTask(state) {
    this.timebarService.setLoading(false);
    this.router.navigate(['/schedules']);
  }
  onLoadingErrorAddreportTask(state) {
    this.timebarService.setLoading(false);
   }
  updateReportTask() {
   const me = this;
   let lastModified = new Date();
   me.schObj.lastModified = lastModified.getTime();
   if(me.schObj.status === "Inactive"){
      me.schObj.status = "Active";
   }
    const payload = {
      cctx: me.sessionService.session.cctx,
      crq: this.crqObj,
      mail: this.mailObj,
      taskInfoList: [this.schObj]
    };
    this.scheduleReportService.updateReportTask(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof UpdateReportTaskLoadingState) {
          me.onLoadingUpdateReportTask(state);
          return;
        }

        if (state instanceof UpdateReportTaskLoadedState) {
          me.onLoadedUpdateReportTask(state);
          return;
        }
      },
      (state: UpdateReportTaskLoadingErrorState) => {
        me.onLoadingErrorUpdateReportTask(state);
      }
    );

  }
  onLoadingUpdateReportTask(state) {
    this.timebarService.setLoading(true);
  }
  onLoadedUpdateReportTask(state) {
    this.timebarService.setLoading(false);
    this.router.navigate(['/schedules']);
   }
  onLoadingErrorUpdateReportTask(state) {
    this.timebarService.setLoading(false);
   }

  selectHour() {
    if (this.dailyOrEvery == 'every') {
      this.addOffset = false;
      this.addOSInPreTime = false;
    }
  }
  readFrmTemp(){
    if(this.aggregatedValue){
      this.overridePreset = false;
    }
  }
  onResize(col){
    alert(col);
  }
  deleteExcelAlertTemplate(){
    let type;
    if(this.selectedReportType.label === "Excel"){
      type = "Excel";
    }else if(this.selectedReportType.label === "Alert Digest Report"){
      type = "AlertDigest";
    }
    let ext = this.selectedExcelTemplate.value.split(".");
    const me = this;
    let tempInfoo = [{
      cd:"-",
      des:"-",
      ext:ext[1],
      md:"-",
      rptSetNum:0,
      tn:this.selectedExcelTemplate.label,
      tr:-1,
      type:type,
      un:"-"
    }];
      try {
        if (!me.selectedExcelTemplate) {
          this.dialogVisible = true;
          this.confirmation.confirm({
            key: 'scheduler',
            message: "template is not selected",
            header: "Error",
            accept: () => {
              this.dialogVisible = false;
            },
            rejectVisible: true
          });
          return;
        }
        this.dialogVisible = true;
        if(me.selectedExcelTemplate){
        this.confirmation.confirm({
          key: 'scheduler',
          message: "Do you want to delete the selected template ?",
          header: "Error",
          accept: () => {
                me.scheduleReportService.deleteTemplateList(tempInfoo).subscribe(
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
        if(this.selectedReportType.label === "Excel"){
          me.favoriteTaskList();
        }else if(this.selectedReportType.label === "Alert Digest Report"){
          this.getAlertDigestTemplate();
        }
        this.messageService.add({severity:"success", summary:"Template delete", detail:"Template deleted successfully" });
        } catch (error) {
        console.error(error);
      }
    }
    deleteExcelLoadingError(state) { }
    validateTemplate(template, str){
      let status = true;
      let msg;
      if(str === "Favourite"){
        msg = "No favourite is available.";
      }
      else{
        msg = "No template is available.";
      }
      try {
      if (template === '' || template == null) {
        this.confirmationDialog("Error", msg);
              return false;
            }
         } catch (error) {
      console.error(error);
      }
      return status;
      }
      fillDateTimeAccToZone(){
        let dt1 = new Date();
        let dt = (moment(dt1.getTime()).zone(
        this.sessionService.selectedTimeZone.offset
        )).format('MM/DD/YYYY HH:mm:ss');
        if(this.scheduleExpiry == null){
        this.scheduleExpiry = new Date(dt);
        }
      }
      
      fillTimeAccToZoneInStartTimeOfHourly(){
        let dt1 = new Date();
        let dt = (moment(dt1.getTime()).zone(
        this.sessionService.selectedTimeZone.offset
        )).format('MM/DD/YYYY HH:mm:ss');
        if(this.dailyTxtModel == null){
        this.dailyTxtModel = new Date(dt);
        }
      }
      fillTimeAccToZoneInStartTimeOfWeek(){
        let dt1 = new Date();
        let dt = (moment(dt1.getTime()).zone(
        this.sessionService.selectedTimeZone.offset
        )).format('MM/DD/YYYY HH:mm:ss');
        if(this.WeekStartTime == null){
        this.WeekStartTime = new Date(dt);
        }
      }
      fillTimeAccToZoneInStartTimeOfMonth(){
        let dt1 = new Date();
        let dt = (moment(dt1.getTime()).zone(
        this.sessionService.selectedTimeZone.offset
        )).format('MM/DD/YYYY HH:mm:ss');
        if(this.monthlyStartTime == null){
        this.monthlyStartTime = new Date(dt);
        }
      }
      getFormattedCurrDateAccToZone(){
        let dt = (moment(new Date().getTime()).zone(
          this.sessionService.selectedTimeZone.offset
          )).format('MM/DD/YYYY HH:mm:ss');
          return dt;
      }
      clearExpireDateTime(){
        this.scheduleExpiry = null;
      }
      clearDailyAtTimeOfHourly(){
        this.dailyTxtModel = null;
      }
      clearStartTimeOfWeekly(){
        this.WeekStartTime = null;
      }
      clearStartTimeOfMonthly(){
        this.monthlyStartTime = null;
      }

  validateOnTimeFilterCustomTimeChange() {
    const me = this;
    let refDateTimeFrame = [...me.customTimeFrame];

    if (me.customTimeFrame && me.customTimeFrame.length === 2) {
      if (
        me.customTimeFrame[0] !== null && me.customTimeFrame[1] !== null
      ) {

        me.invalidDate = true;
        if (me.customTimeFrame[0].valueOf() === me.customTimeFrame[1].valueOf()) {
          console.log('start date ', me.customTimeFrame[0].valueOf());
          console.log('end date ', me.customTimeFrame[1].valueOf());
          if (me.invalidDate) {
            this.messageService.add({ severity: "error", summary: "Custom Date/Time", detail: "Start Date and End Date cannot be same." });

          }
          return false;
        }
        else if (me.customTimeFrame[0].valueOf() > me.customTimeFrame[1].valueOf()) {
          if (me.invalidDate) {
            this.messageService.add({ severity: "error", summary: "Custom Date/Time", detail: "Start Date should not be greater than End Date" });

          }
          return false;
        }
        me.customTimeFrame = [
          refDateTimeFrame[0],
          refDateTimeFrame[1]
        ];
      }
      else if (me.customTimeFrame[0] == null && me.customTimeFrame[1] == null) {
        me.invalidDate = true;
        if (me.invalidDate) {
          this.messageService.add({ severity: "error", summary: "Custom Date/Time", detail: "Please enter start Date and End Date." });

        }
        me.customTimeFrame = [
          refDateTimeFrame[0],
          refDateTimeFrame[1]
        ];
        return false;
      } else if (me.customTimeFrame[0] === null) {
        me.invalidDate = true;
        if (me.invalidDate) {
          this.messageService.add({ severity: "error", summary: "Custom Date/Time", detail: "Please enter start Date." });

        }
        me.customTimeFrame = [
          refDateTimeFrame[0],
          refDateTimeFrame[1]
        ];
        return false;
      }
      else if (me.customTimeFrame[1] === null) {
        me.invalidDate = true;
        if (me.invalidDate) {
          this.messageService.add({ severity: "error", summary: "Custom Date/Time", detail: "Please enter End Date." });

        }
        me.customTimeFrame = [
          refDateTimeFrame[0],
          refDateTimeFrame[1]
        ];
        return false;
      }
    }

    return true;
  }

}


