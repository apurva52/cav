import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import { Moment } from 'moment-timezone';
import * as moment from 'moment-timezone';
import { MenuItem, SelectItem } from 'primeng';
import { merge, Observable, Subject, Subscription } from 'rxjs';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { TimebarMenuConfig, TimebarTimeConfig, TimebarValue, TimebarValueInput } from '../time-bar/service/time-bar.model';
import { TimebarService } from '../time-bar/service/time-bar.service';
import { MenuItemUtility } from '../utility/menu-item';
import { CompareDataSavedSnapshot, CompareDataTable, CompareDataTableHeaderCols, CompareGetData, CompareSnapShotResponse, Measurement, SnapShot } from './service/compare-data.model';
import { CompareDataService } from './service/compare-data.service';
import { CompareDataLoadedState, CompareDataLoadingErrorState, CompareDataLoadingState } from './service/compare-data.state';

import { ColorPicker } from 'primeng/colorpicker';
import { ObjectUtility } from '../utility/object';
import { SessionService } from 'src/app/core/session/session.service';
import { DashboardWidgetComponent } from '../dashboard/widget/dashboard-widget.component';
import { NumEnUsPipe } from '../pipes/num-en-us/num-en-us.pipe';
import { CompileMetadataResolver } from '@angular/compiler';
import { AppMenuItem } from '../menu-item/service/menu-item.model';
import { GlobalTimebarTimeLoadedState } from '../time-bar/service/time-bar.state';
import { DashboardService } from '../dashboard/service/dashboard.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InfoData } from '../dialogs/informative-dialog/service/info.model';
import { InformativeDialogComponent } from '../dialogs/informative-dialog/informative-dialog.component';
import { SSL_OP_SSLEAY_080_CLIENT_DH_BUG } from 'constants';
import { COMPARE_DATA_TABLE } from './service/compare-data.dummy';
import { SchedulerService } from '../scheduler/scheduler.service';
import { getSupportedInputTypes } from '@angular/cdk/platform';
//import { InfoData } from '../../dialogs/informative-dialog/service/info.model';
import { DateTimeAdapter, OWL_DATE_TIME_FORMATS, OWL_DATE_TIME_LOCALE } from 'ng-pick-datetime';
import { MomentDateTimeAdapter } from '../date-time-picker-moment/moment-date-time-adapter';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-compare-data',
  templateUrl: './compare-data.component.html',
  styleUrls: ['./compare-data.component.scss'],
  providers: [
    { provide: DashboardWidgetComponent, 
      useExisting: CompareDataComponent 
    },
    {
      provide: DateTimeAdapter,
      useClass: MomentDateTimeAdapter,
      deps: [OWL_DATE_TIME_LOCALE],
    },
    {
      provide: OWL_DATE_TIME_FORMATS,
      useValue: environment.formats.OWL_DATE_TIME_FORMATS,
    },
    NumEnUsPipe, ConfirmationService, MessageService
  ],
  encapsulation: ViewEncapsulation.None
})
export class CompareDataComponent implements OnInit {
  data: CompareDataTable;
  error: AppError;
  empty: boolean;
  loading: boolean;
  _selectedColumns: CompareDataTableHeaderCols[] = [];
  measurement: Measurement;
  tmpMeasurement: Measurement;
  snapshots: SnapShot;
  snapshotsSession: SnapShot[] = [];
  snapShotsList: SnapShot[] = [];
  selectedSnap: any = '';
  selectedTrend: string[] = [];
  trend: boolean;
  selectedBase: boolean = true;
  visible: boolean =false;
  autoplayEnabled: boolean;
  selectedRow: Measurement;
  customTimeFrame: Moment[] = null;
  customTimeFrameMax: Moment = null;
  timeFilterEnableApply: boolean = false;
  invalidDate: boolean = false;
  cols: any[];
  allPresetList: Array<any> = [];
  allViewByList: Array<any> = [];
  presetList: SelectItem[];
  selectedPreset: string = null;
  baselineName: string = null;
  viewbyList: SelectItem[] = [];
  viewByValueList: SelectItem[] = [];
  viewByselected: String = null;
  viewByValueSelected: String = null;
  @ViewChild('colorpicker') colorpicker: ColorPicker;
  events: { [key: string]: Subject<void> } = {};
  private timerLoading: NodeJS.Timeout = null;
  tmpValue: TimebarValue = null;
  tmpValueForBaseline: TimebarValue = null;
  preset: boolean = true;
  onetimeFlag: boolean = true;
  updateRow: boolean = false;
  sdata: any = null;
  selectedWidget: boolean = true;
  applyCompare: boolean;
  deleteSnapshot: boolean;
  widgetWiseIndex: number;
  widgetWiseCompare: boolean = false;
  timeBack: any =1;
  timeBackToggle: boolean = false;
  timeBckCall: boolean = false;
  measurementName: string;
  confirmCompare: boolean = true;
  confirmDisableCompare: boolean = false;
  @Input() dashboard: DashboardComponent;
  informativeData: InfoData;
  color: boolean = false;
  disableBaselineTime: boolean = false;
  color1: any;
  isDisabled: boolean = false;
  testToggle: boolean = false;
  confirmMeasurementDialogVisible: boolean = false;
  confirmSnapshotDialogVisible: boolean = false;
  confirmMeasurementDialogVisible1 = false;
  validate: boolean = false;
  globalCompare:boolean =false;
  visibleSidebar2:any;
  widgetWise:DashboardWidgetComponent;
  disableCompareFlagonApply :boolean =false;
  timeValueUpdate:any;
  constructor(
    private compareDataService: CompareDataService,
    public timebarService: TimebarService,
    public sessionService: SessionService,
    public dashboardService: DashboardService,
    public confirmation: ConfirmationService,
    private messageService: MessageService,
    private cd: ChangeDetectorRef,
    private schedulerService:SchedulerService
  ) {
  }

  ngOnInit(): void {
    const me = this;
    me.timebarService.instance.getInstance().subscribe(() => {
      me.init();
    });
    me.informativeData = { title: 'Compare Information', information: 'We can apply compare for 2 or more Measurement, In compare we have Trend Compare, Normal Compare Feature', button: 'Close' }
    // me.selectToggle(true);
  }

  // ngAfterViewInit() {
  //   const me = this;
  //   me.schedulerService.subscribe('compare-data', () => {
  //     if(me.confirmCompare){
  //     me.updateTableInfo();
  //     }
  //   });
  // }
  // ngOnDestroy() {
  //   const me = this;
  //   me.schedulerService.unsubscribe('compare-data');
  // }
  
  updateTableInfo() {
   let me =this;
  for(let i=0; i<me.timebarService.compareTableData.length;i++){
    const input: TimebarValueInput = {
      timePeriod: me.timebarService.compareTableData[i].preset,
      viewBy: me.tmpValue.viewBy.selected.id,
      running: true,
      discontinued: false,
      includeCurrent: me.tmpValue.includeCurrent,
    };
    input.updateTime =true;
    if(me.timebarService.compareTableData[i].preset.startsWith('TB')){
      me.timebarService.setTimeBckDetail(me.timebarService.compareTableData[i-1]);
      me.timebarService.setTimeBck(1);
      me.timebarService.setTimeBckFlag(true);
    }
    else{
      me.timeBack =null;
      me.timebarService.setTimeBck(null);
      me.timebarService.setTimeBckFlag(false);
    }
    const output = new Subject<TimebarValue>();
    me.timebarService.loadTime(me.timebarService.compareTableData[i].preset).subscribe((state: Store.State) => {
      if (state instanceof GlobalTimebarTimeLoadedState) {
        me.tmpValue.time = {
          min: {
            raw: null,
            value: state.data[0]
          },
          max: {
            raw: null,
            value: state.data[2]
          },
          frameStart: {
            raw: null,
            value: state.data[1]
          },
          frameEnd: {
            raw: null,
            value: state.data[2]
          }
        };

        setTimeout(() => {
          output.next(me.tmpValue);
        });
      }
    },
      () => {
        setTimeout(() => {
          output.next(me.tmpValue);
        });
      });
    //me.getDataAfterSample(input);
    me.timebarService.compareTableData[i].start = me.tmpValue.time.frameStart.value;
    me.timebarService.compareTableData[i].end =me.tmpValue.time.frameEnd.value;

  }    this.cd.detectChanges();

  }
  getDataAfterSample(input: TimebarValueInput) {
    let me =this;
    const output = new Subject<TimebarValue>();
    me.timebarService
    .prepareValue(input, me.tmpValue)
    .subscribe((value: TimebarValue) => {
      const timeValuePresent = _.has(value, 'time.frameStart.value');
      if (value && timeValuePresent) {
        me.tmpValue = me.prepareValue(value);
        me.timeFilterEnableApply = true;
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


  private init() {
    const me = this;
    me.loading = false;
    me.timebarService.events.onChange.subscribe(() => {
      if (me.onetimeFlag) {
        me.timeApply(me.timebarService.getValue(), true);
        me.onetimeFlag = false;
      }
    });
    me.cd.detectChanges();
  }

  /**
   * This method is used to fetch the time period detail.
   */
  private timeApply(value: TimebarValue, silent?: boolean) {
    const me = this;
    const preparedValue = me.prepareValue(value);
    preparedValue.timePeriod.options.push();
    me.tmpValue = ObjectUtility.duplicate(preparedValue);
    if (!silent) {
      me.timebarService.setValue(me.tmpValue);
    }
    me.cd.detectChanges();
  }


   /**
   * This method is used when we Apply Compare.
   */
  testCompareData() {
    let me = this;
    
    
    me.applyCompare = true;
    if (me.snapshots.snapShotName != null) {
      let regex = /^(?!\d+$)(?:[a-zA-Z0-9][a-zA-Z0-9 _@&$]*)?$/;
      if (!regex.test(me.snapshots.snapShotName)) {
        me.confirmSnapshotDialogVisible = true;
        this.confirmation.confirm({
          key: 'confirm-snapShot',
          message: 'Invalid measurement name found. Must start with Alphabet A-Z or a-z. Allowed characters are alphanumeric characters and special characters (_@&$).',
          accept: () => { },
          rejectVisible: false
        });
        me.applyCompare = false;
        me.visible = true;
        return;
      }

    }
    if (me.snapshots.compareData === null || me.snapshots.compareData.length === 0) {
      //this.messageService.add({severity:'error', summary: 'Error', detail: 'No Measurements Added, Please add measurement!!'});
      me.confirmMeasurementDialogVisible = true;
      setTimeout(() => {
        me.confirmMeasurementDialogVisible = false;
      }, 500);
      this.confirmation.confirm({
        key: 'confirm-measurement',
        message: 'No Measurements Added, Please add measurement!!',
        accept: () => { },
        rejectVisible: false
      });
      me.applyCompare = false;
      me.visible = true;
      return;
    }
    if (me.snapshots.compareData.length === 1) {
      //this.messageService.add({severity:'alert', summary: 'Alert', detail: 'Please add atleast 2 Measurement for comparison'});
      me.confirmMeasurementDialogVisible = true;
      setTimeout(() => {
        me.confirmMeasurementDialogVisible = false;
      }, 1000);
      this.confirmation.confirm({
        key: 'confirm-measurement',
        message: 'If you want to compare measurements ,Please add atleast 2 Measurement for comparison',
        accept: () => { },
        rejectVisible: false
      });
      me.applyCompare = false;
      me.visible = true;
      return;
    }
    if (me.snapshots.saveMeasurement && me.snapshots.snapShotName === null || me.snapshots.snapShotName === '') {
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Please give measurement name'});
      // me.confirmMeasurementDialogVisible = true;
      // setTimeout(() => {
      //   me.confirmMeasurementDialogVisible = false;
      // }, 1000);
      // this.confirmation.confirm({
      //   key: 'confirm-measurement',
      //   message: 'If you want to save measurement ,Please give some name to measurement otherwise Disable it',
      //   accept: () => { },
      //   rejectVisible: false
      // });
      me.applyCompare = false;
      me.visible = true;
      return;
    }
    //else{
    if (me.snapshots.saveMeasurement) {
      me.applyCompare = true;
      me.saveAndUpdate();
    }
    else {
      me.snapshots.compareData;
    }
    if (me.applyCompare) {
     // DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {
        me.disableCompareFlagonApply = true;
        if(me.widgetWise){
        me.dashboard =me.widgetWise.dashboard;
        }
        if(!me.compareDataService.widgetWiseCompareFlag && !me.snapshots.applyAllWidget){
          //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'While applying global compare apply on All Widget flag need to be selected' });
          //me.widgetWiseCompare = true;
          me.compareDataService.setWidgetWiseCompareFlag(true);
          me.widgetWiseCompare=true;
        }
       
        me.dashboard.selectedWidget.widget.isCompareData = true;
        if (me.snapshots.trendCompare && me.applyCompare && me.snapshots.applyAllWidget ) {
          for (let i = 0; i < me.dashboard.data.favDetailCtx.widgets.length; i++) {
            me.dashboard.data.favDetailCtx.widgets[i].isApplyCompare = me.applyCompare;
            me.dashboard.data.favDetailCtx.widgets[i].isTrendCompare = me.snapshots.trendCompare;
            me.dashboard.data.favDetailCtx.widgets[i].trendList = me.snapshots.compareData;
          }
          me.compareDataService.setApplyGlobalCompareFlag(true);
        }
        else{
          for (let i = 0; i < me.dashboard.data.favDetailCtx.widgets.length; i++) {
           // me.dashboard.data.favDetailCtx.widgets[i].isApplyCompare = me.applyCompare;
            me.dashboard.data.favDetailCtx.widgets[i].isTrendCompare = me.snapshots.trendCompare;
            //me.dashboard.data.favDetailCtx.widgets[i].trendList = me.snapshots.compareData;
          }
        }
        if (!me.snapshots.applyAllWidget) {
          if(me.snapshots.trendCompare ){
            for (let i = 0; i < me.dashboard.data.favDetailCtx.widgets.length; i++) {
              if(me.dashboard.selectedWidget.widget.widgetIndex ===i){
                me.dashboard.data.favDetailCtx.widgets[i].isApplyCompare = me.applyCompare;
                me.dashboard.data.favDetailCtx.widgets[i].isTrendCompare = me.snapshots.trendCompare;
                me.dashboard.data.favDetailCtx.widgets[i].trendList = me.snapshots.compareData;
                me.widgetWiseIndex=me.dashboard.selectedWidget.widget.widgetIndex;
                break;
              }
            }
            me.dashboard.selectedWidget.widget.isApplyCompare= true;
          }
          else{
            for(let i=0;i<me.dashboard.data.favDetailCtx.widgets.length;i++){
              if(me.dashboard.selectedWidget.widget.widgetIndex ===i){
              me.dashboard.data.favDetailCtx.widgets[i].isApplyCompare =true;
              me.dashboard.data.favDetailCtx.widgets[i].trendList = me.snapshots.compareData;
              me.widgetWiseIndex=me.dashboard.selectedWidget.widget.widgetIndex;
              me.dashboard.data.favDetailCtx.widgets[i].isTrendCompare = false;
              break;
              }
            }
          }
          me.widgetWiseCompare =true;
          me.dashboard.selectedWidget.widget.isCompareData = true;
          me.dashboard.selectedWidget.widget.compareDialogIndex = me.widgetWiseIndex;
        
        }
       // if(me.applyCompare){
         if(me.snapshots.applyAllWidget){
        for(let i=0;i<me.dashboard.data.favDetailCtx.widgets.length;i++){
          me.dashboard.data.favDetailCtx.widgets[i].isApplyCompare =true;
          me.dashboard.data.favDetailCtx.widgets[i].trendList = me.snapshots.compareData;
        }
      }
      me.dashboard.selectedWidget.widget.isCompareData = true;
      me.snapshots.viewByValue = me.tmpValue.viewBy.selected.id;
      me.snapshots.viewByLevel = me.tmpValue.viewBy.selected.label;
      me.dashboard.renderCompareData(ObjectUtility.duplicate(me.snapshots), me.widgetWiseCompare ,me.widgetWiseIndex);
        //me.confirmCompare=true;

      //});
      //me.applyCompare =false;
      me.visible = false;
    }
    else {
      me.visible = true;
    }
    if (me.applyCompare) {
     // me.applyCompare =true;
      this.compareDataService.setApplyGlobalCompareFlag(me.applyCompare);
      this.compareDataService.setSnapshotsList(me.snapshots);
   this.compareDataService.setTmpMeasurement(me.tmpMeasurement);
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Compare is Applied successfully' });
      // me.confirmMeasurementDialogVisible1=true;
      //   this.confirmation.confirm({
      //     key: 'confirm-measurement1',
      //     message: 'Compare is Applied successfully',
      //     accept: () => {  },
      //     rejectVisible:false
      //   }); 
      this.cd.detectChanges();
    }

  }
  applyWidgetWiseCompare() {
    let me =this;
    me.compareDataService.widgetWiseCompareFlag= true;
  }

  /**
   * This method is used when user change Snapshot list.
   */
  onSnapShotChange(event) {
    let me = this;
    me.data.snapshotsData =this.compareDataService.snapshotData;
    for (let i = 0; i < me.data.snapshots.length; i++) {
      // if(me.data.snapshotsData[i].trendCompare){
      //   me.snapshots.trendCompare = true;
      //   me.trendCompareApply(me.snapshots);
      // }
      if (event.value === undefined || event.value === '') {
        me.snapshots.compareData = [];
        me.snapshots.compareData.splice(0, 0, me.measurement);
      }
      else if (event.value === me.data.snapshots[i].label) {
        if (me.data.snapshotsData[i].trendCompare) {
          me.snapshots.trendCompare = me.data.snapshotsData[i].trendCompare;
          me.trendCompareApply(me.snapshots);
        }
        else {
          me.snapshots.trendCompare = me.data.snapshotsData[i].trendCompare;
          me.trendCompareApply(me.snapshots);
        }

        me.snapshots.compareData = me.data.snapshotsData[i].compareData;

      }
      // else if(event.value===''){
      //   me.snapshots.compareData=[];
      //   me.snapshots.compareData.splice(0,0,me.measurement);
      // }
    }
  }

  /**
    * This method is used to fetch Custom Time Details.
    */
  onTimeFilterCustomTimeChange() {
    const me = this;
    setTimeout(() => {
      if (me.customTimeFrame && me.customTimeFrame.length === 2) {
        if (
          me.customTimeFrame[0].valueOf() == me.customTimeFrame[1].valueOf()
        ) {
          const me = this;
          me.timeFilterEnableApply = false;
          me.invalidDate = true;
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
    me.cd.detectChanges();
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
          // let measurement = moment(me.tmpValue.time.frameStart.value).format('MM/DD/YYYY, HH:mm A') + "_" + moment(me.tmpValue.time.frameEnd.value).format('MM/DD/YYYY,HH:mm A');
          // me.tmpMeasurement.name = measurement;
          // console.log("me.tmp",me.tmpMeasurement);
          //me.tmpValueForBaseline = me.timebarService.getGlobalTimeBar();
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


  prepareValue(value: TimebarValue): TimebarValue {
    const me = this;
    MenuItemUtility.map((item: MenuItem) => {
      item.url = '';
      item.command = () => {
        if (!item.items) {
          me.tmpValue.timePeriod.selected = item;
          me.validateTimeFilter(true);
        }
      };
    }, value.timePeriod.options);

    MenuItemUtility.map((item: MenuItem) => {
      item.url = '';
      item.command = () => {
        if (!item.items) {
          me.tmpValue.viewBy.selected = item;
          me.validateTimeFilter();
        }
      };
    }, value.viewBy.options);
    return value;
  }

  /**
    * This method is used to validate the Time filter Detail.
    */
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
    if(me.tmpValue.timePeriod.selected.id.startsWith("EV")){
      me.getEventNameAndBaselineName();
    }
   else if (me.tmpValue.timePeriod.selected.label === "Hour Back" || me.tmpValue.timePeriod.selected.label === "Day Back" || me.tmpValue.timePeriod.selected.label === "Month Back" || me.tmpValue.timePeriod.selected.label === "Week Back") {
      if (me.timeBack === "") {
        me.baselineName = me.tmpValue.timePeriod.selected.label + " - " + me.timeBack + " " + me.tmpValue.timePeriod.selected.label;
      }
      else {
        me.baselineName = me.snapshots.compareData[me.snapshots.compareData.length - 1].presetlabel + " - " + me.timeBack + " " + me.tmpValue.timePeriod.selected.label;
      }
    }
    else {
      me.baselineName = me.tmpValue.timePeriod.selected.label;
    }
    if (me.tmpMeasurement){
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
      me.tmpMeasurement.name = me.baselineName;
    }
  }

  /**
    * This method is called when we clicked on includeDefaultBaseline options.
   */
  selectToggle(event) {
    let me = this;
    if (me.snapshots.includeDefaultBaseline) {
      me.tmpValueForBaseline = me.timebarService.getGlobalTimeBar();
      me.measurement.id = 0;
      me.measurement.name = me.tmpValueForBaseline.timePeriod.selected.label;
      me.measurement.preset = me.tmpValueForBaseline.timePeriod.selected.id;
      me.measurement.presetlabel = me.tmpValueForBaseline.timePeriod.selected.label;
      me.measurement.rowBgColorField = "#333674";
      me.measurement.start = me.tmpValueForBaseline.time.frameStart.value;
      me.measurement.end = me.tmpValueForBaseline.time.frameEnd.value;
      this.timebarService.setBaselineTime(me.measurement);
      me.snapshots.compareData.splice(0, 0, me.measurement);
      me.updateSnapshotMeasurementListId();
      me.tmpValue.timePeriod.options[3].disabled = false;
    }
    else {
      me.snapshots.compareData.splice(0, 1);
      me.updateSnapshotMeasurementListId();
      if(me.snapshots.compareData.length>=1){
        me.tmpValue.timePeriod.options[3].disabled = false;
      }
      else{
      me.tmpValue.timePeriod.options[3].disabled = true;
      }
    }
  }
  updateSnapshotMeasurementListId(){
    const me = this;
    me.snapshots.compareData.forEach((element,index) => {
      element.id = index;
    });
  }


  // selectToggleWidget(event){
  // let me =this;
  // //me.snapshots.applyAllWidget =false;
  // }

  /**
     * This method is used to update the measurement detail in table.
   */
  UpdateMeasuremnt(event) {
    let me = this;
    me.validate = true;
    for (let i = 0; i < me.snapshots.compareData.length; i++) {
      if (me.snapshots.compareData[i]['preset'].startsWith('TB')) {
        me.validate = true;
      }
      if (me.snapshots.compareData[i].id != me.tmpMeasurement.id) {
        if (me.snapshots.compareData[i]['presetlabel'] === me.tmpMeasurement.presetlabel) {

          me.confirmSnapshotDialogVisible = true;
          this.confirmation.confirm({
            key: 'confirm-snapShot',
            message: 'Measurement and preset name already in use. \n Please try using another measurement name and preset.',
            accept: () => { },
            rejectVisible: false
          });
          me.validate = true;
          return;
        }
      }
      // if(me.snapshots.compareData[i]['name'] != me.baselineName){
      //   me.snapshots.compareData[i]['name'] = me.baselineName;
      //    return;
      //  }
      //  else if(me.snapshots.compareData[i]['rowBgColorField'] != me.tmpMeasurement.rowBgColorField){
      //    me.snapshots.compareData[i]['rowBgColorField'] = me.tmpMeasurement.rowBgColorField;
      //    return;
      //  }
    }
    if (!me.preset) {
      me.selectedRow.preset = me.tmpValue.timePeriod.selected.id;
      me.selectedRow.presetlabel = "Custom Time"
      if (me.tmpMeasurement.preset.startsWith('SPECIFIED_TIME')) {
        let split1 = me.tmpMeasurement.preset.split("_");
        me.selectedRow.start = split1[2];
        me.selectedRow.end = split1[3];
      }
      // me.selectedRow.start = me.customTimeFrame[0];
      // me.selectedRow.end = me.customTimeFrame[1];
      if (me.baselineName === '' || me.baselineName === null) {
        me.selectedRow.name = me.baselineName = "From" + moment(me.customTimeFrame[0]).format('HH:mm') + "to" + moment(me.customTimeFrame[1]).format('HH:mm');
        me.baselineName = me.tmpMeasurement.name;
      }
      else {
        me.selectedRow.name = me.baselineName = "From" + moment(me.customTimeFrame[0]).format('HH:mm') + "to" + moment(me.customTimeFrame[1]).format('HH:mm');
      }
    }

    else {

      if (me.tmpValue.timePeriod.selected.id === 'TB0' || me.tmpValue.timePeriod.selected.id === 'TB1' || me.tmpValue.timePeriod.selected.id === 'TB2' || me.tmpValue.timePeriod.selected.id === 'TB3' || me.selectedRow.preset.startsWith('TB')) {
        me.selectedRow.presetlabel = me.timeBack + " " + me.tmpValue.timePeriod.selected.label;
        if (me.selectedRow.preset.startsWith('LIVE') ||me.selectedRow.preset.startsWith('TB')) {
          me.baselineName;
        }
        else {
          me.baselineName = me.timeBack + " " + me.tmpValue.timePeriod.selected.label;
        }
      }
      if (me.tmpValue.timePeriod.selected.id.startsWith("EV1_")) {
        for (let i = 0; i < me.tmpValue.timePeriod.options[2].items[0].items.length; i++) {
          if (me.tmpValue.timePeriod.selected.id === me.tmpValue.timePeriod.options[2].items[0].items[i].id) {
            me.selectedRow.presetlabel = me.tmpValue.timePeriod.options[2].items[0].label + " " + me.tmpValue.timePeriod.selected.label;
            break;
          }

        }
      }
      else if (me.tmpValue.timePeriod.selected.id.startsWith("EV2_")) {
        for (let i = 0; i < me.tmpValue.timePeriod.options[2].items[1].items.length; i++) {
          if (me.tmpValue.timePeriod.selected.id === me.tmpValue.timePeriod.options[2].items[1].items[i].id) {
            me.selectedRow.presetlabel = me.tmpValue.timePeriod.options[2].items[1].label + " " + me.tmpValue.timePeriod.selected.label;
            break;
          }
        }
      }
      else if (me.tmpValue.timePeriod.selected.id.startsWith("EV3_")) {
        for (let i = 0; i < me.tmpValue.timePeriod.options[2].items[2].items.length; i++) {
          if (me.tmpValue.timePeriod.selected.id === me.tmpValue.timePeriod.options[2].items[2].items[i].id) {
            me.selectedRow.presetlabel = me.tmpValue.timePeriod.options[2].items[2].label + " " + me.tmpValue.timePeriod.selected.label;
            break;
          }
        }
      }
      else if (me.tmpValue.timePeriod.selected.id.startsWith("EV4")) {
        for (let i = 0; i < me.tmpValue.timePeriod.options[2].items[3].items.length; i++) {
          if (me.tmpValue.timePeriod.selected.id === me.tmpValue.timePeriod.options[2].items[3].items[i].id) {
            me.selectedRow.presetlabel = me.tmpValue.timePeriod.options[2].items[3].label + " " + me.tmpValue.timePeriod.selected.label;
            break;
          }
        }
      }
      else if (me.tmpValue.timePeriod.selected.id.startsWith("EV5")) {
        for (let i = 0; i < me.tmpValue.timePeriod.options[2].items[4].items.length; i++) {
          if (me.tmpValue.timePeriod.selected.id === me.tmpValue.timePeriod.options[2].items[4].items[i].id) {
            me.selectedRow.presetlabel = me.tmpValue.timePeriod.options[2].items[4].label + " " + me.tmpValue.timePeriod.selected.label;
            break;
          }
        }
      }
      else if (me.tmpValue.timePeriod.selected.id.startsWith("EV6")) {
        for (let i = 0; i < me.tmpValue.timePeriod.options[2].items[5].items.length; i++) {
          if (me.tmpValue.timePeriod.selected.id === me.tmpValue.timePeriod.options[2].items[5].items[i].id) {
            me.selectedRow.presetlabel = me.tmpValue.timePeriod.options[2].items[5].label + " " + me.tmpValue.timePeriod.selected.label;
            break;
          }
        }
      }
      else if (me.tmpValue.timePeriod.selected.id.startsWith("EV7")) {
        for (let i = 0; i < me.tmpValue.timePeriod.options[2].items[6].items.length; i++) {
          if (me.tmpValue.timePeriod.selected.id === me.tmpValue.timePeriod.options[2].items[6].items[i].id) {
            me.selectedRow.presetlabel = me.tmpValue.timePeriod.options[2].items[6].label + " " + me.tmpValue.timePeriod.selected.label;
            break;
          }
        }
      }
      me.selectedRow.start = me.tmpValue.time.frameStart.value;
      me.selectedRow.end = me.tmpValue.time.frameEnd.value;
      me.updateRow = false;
      // me.onRowSelect(me.updateRow);
    }
    //me.selectedRow.rowBgColorField = me.tmpMeasurement.rowBgColorField;
    me.updateRow = false;
    //me.onRowSelect1(me.updateRow);
    // me.tmpValue.timePeriod.selected.id = me.tmpMeasurement.preset;

    me.selectedRow.presetlabel = me.tmpValue.timePeriod.selected.label;
    if(me.color1 ===undefined){
      me.color1 =me.selectedRow.rowBgColorField;
    }
    else{
      me.color1 =me.tmpMeasurement.rowBgColorField;
    }
  // me.snapshots.compareData[me.tmpMeasurement.id] = me.tmpMeasurement;
    // me.tmpMeasurement.presetlabel =me.selectedRow.presetlabel;
    me.trendCompareApply(me.snapshots.trendCompare);
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Measurement Updated successfully'});
    // me.confirmMeasurementDialogVisible = true;
    // setTimeout(() => {
    //   me.confirmMeasurementDialogVisible = false;
    // }, 500);
    // this.confirmation.confirm({
    //   key: 'confirm-measurement',
    //   message: 'Measurement Updated successfully',
    //   accept: () => { },
    //   rejectVisible: false
    // });
    if (me.colorpicker === undefined && me.tmpMeasurement.rowBgColorField === me.measurement.rowBgColorField) {
      if (me.tmpMeasurement.rowBgColorField === me.measurement.rowBgColorField && me.snapshots.compareData.length >= 1) {
        me.selectedRow.rowBgColorField = me.color1;
        me.tmpMeasurement.rowBgColorField = '#db1c0f';
        me.disableBaselineTime = true;
        me.isDisabled = false;
        me.tmpValueForBaseline = me.timebarService.getGlobalTimeBar();
        me.selectedRow.presetlabel = me.tmpValueForBaseline.timePeriod.selected.label;
        me.selectedRow.preset = me.tmpValueForBaseline.timePeriod.selected.id;
        //  me.baselineName = me.tmpMeasurement.name;
        me.selectedRow.name = me.baselineName;
      }
      else {
        me.selectedRow.rowBgColorField = this.getRandomColor();
      }
    }
    else if (me.measurement.rowBgColorField === me.selectedRow.rowBgColorField && me.measurement.rowBgColorField === "#333674" && me.snapshots.includeDefaultBaseline && me.snapshots.compareData.length >= 1) {
      me.selectedRow.rowBgColorField = me.color1;
      me.tmpMeasurement.rowBgColorField = '#db1c0f';
      me.disableBaselineTime = true;
      me.isDisabled = false;
      me.tmpValueForBaseline = me.timebarService.getGlobalTimeBar();
      me.selectedRow.presetlabel = me.tmpValueForBaseline.timePeriod.selected.label;
      me.selectedRow.preset = me.tmpValueForBaseline.timePeriod.selected.id;
      // me.baselineName = me.tmpMeasurement.name;
      me.selectedRow.name = me.baselineName;
    }
    else {
      if (me.color1 !== undefined) {
        me.selectedRow.rowBgColorField =me.tmpMeasurement.rowBgColorField;
      }
      else {
        me.selectedRow.rowBgColorField = me.color1;
      }
    }
    if (me.color) {
      me.color = false;
    }
    if (me.tmpMeasurement.name !== '' && me.baselineName !== '') {
      //me.baselineName = me.tmpMeasurement.name;
      me.selectedRow.name = me.baselineName;
    }
    else {
      me.selectedRow.name = me.tmpMeasurement.name;;
    }
    me.tmpMeasurement.rowBgColorField =me.getRandomColor();
    me.onRowUnselect1(false);
    me.clearMeasurementonRowUnSelect();
  }

  /**
     * This method is used  at time user unselect the row in table.
   */
  onRowUnselect1(arg0: boolean) {
    let me = this;
    me.updateRow = arg0;
    me.selectedRow = null;
    me.disableBaselineTime = false;
    me.isDisabled = false;
    me.cd.detectChanges();
  }


  onRowSelect1(updateRow: boolean) {
    let me = this;
    if (!me.preset) {
      me.tmpMeasurement = ObjectUtility.duplicate(me.selectedRow);
      me.baselineName = me.tmpMeasurement.name;
    }
    else {
      me.tmpMeasurement = ObjectUtility.duplicate(me.selectedRow);
      if (me.tmpValue.timePeriod.selected.id.startsWith("EV1_") || me.tmpValue.timePeriod.selected.id.startsWith("EV2_") || me.tmpValue.timePeriod.selected.id.startsWith("EV3_") || me.tmpValue.timePeriod.selected.id.startsWith("EV3_") || me.tmpValue.timePeriod.selected.id.startsWith("EV4_") || me.tmpValue.timePeriod.selected.id.startsWith("EV5_") || me.tmpValue.timePeriod.selected.id.startsWith("EV6_") || me.tmpValue.timePeriod.selected.id.startsWith("EV7_")) {
        me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
      }
      else if (me.tmpValue.timePeriod.selected.id === 'TB0' || me.tmpValue.timePeriod.selected.id === 'TB1' || me.tmpValue.timePeriod.selected.id === 'TB2' || me.tmpValue.timePeriod.selected.id === 'TB3' && me.tmpMeasurement.preset! === me.tmpValue.timePeriod.selected.id) {
        if (me.snapshots.compareData.length >= 1 && me.tmpMeasurement.rowBgColorField === "#333674") {
          me.tmpValueForBaseline = me.timebarService.getGlobalTimeBar();
          me.tmpMeasurement.presetlabel = me.tmpValueForBaseline.timePeriod.selected.label;
          me.tmpMeasurement.preset = me.tmpValueForBaseline.timePeriod.selected.id;
        }
        else {
          me.tmpMeasurement.presetlabel = me.timeBack + " " + me.tmpValue.timePeriod.selected.label;
          me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
          // if(me.color1===null ||me.color1===undefined){
          //   if(event.data.rowBgColorField===me.tmpMeasurement.rowBgColorField){
          //     me.tmpMeasurement.rowBgColorField;
          //   }else{
          //   me.tmpMeasurement.rowBgColorField = '#db1c0f';
          //   }
          // }
          // else{
          // if(event.data.rowBgColorField===me.tmpMeasurement.rowBgColorField){
          //   me.tmpMeasurement.rowBgColorField;
          // }else{ 
          me.tmpMeasurement.rowBgColorField = me.color1;
          //}
          //}
        }
      }
      else {
        me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
      }
      me.baselineName = me.tmpMeasurement.name;
      me.tmpValue.time.frameStart.value = me.tmpMeasurement.start;
      me.tmpValue.time.frameEnd.value = me.tmpMeasurement.end;
    }
    if (me.snapshots.includeDefaultBaseline && me.snapshots.compareData.length === 1) {
      me.disableBaselineTime = true;
      me.isDisabled = false;
      me.tmpValueForBaseline = me.timebarService.getGlobalTimeBar();
      me.tmpMeasurement.presetlabel = me.tmpValueForBaseline.timePeriod.selected.label;
      me.tmpMeasurement.preset = me.tmpValueForBaseline.timePeriod.selected.id;
    }
    else if (me.snapshots.compareData.length > 1 && me.tmpMeasurement.rowBgColorField === "#333674") {
      me.disableBaselineTime = true;
      me.isDisabled = false;
      me.tmpValueForBaseline = me.timebarService.getGlobalTimeBar();
      me.tmpMeasurement.presetlabel = me.tmpValueForBaseline.timePeriod.selected.label;
      me.tmpMeasurement.preset = me.tmpValueForBaseline.timePeriod.selected.id;
    }
    else {
      me.disableBaselineTime = false;
      me.isDisabled = false;
    }
    me.updateRow = true;
    if (updateRow === false) {
      me.updateRow = false;
    }
  }

  /**
     * This method is called at the time of Adding Measurement in table.
   */
  AddNewMeasuremnt(event) {
    const me = this;
    if(me.tmpValue.timePeriod.selected.id.startsWith('SPECIFIED_TIME')){
      me.preset =false;
    }
    if (!me.preset) {
    // me.onTimeFilterTypeChange();
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      if (me.tmpMeasurement.preset.startsWith('SPECIFIED_TIME')) {
        let split1 = me.tmpMeasurement.preset.split("_");
        // me.tmpMeasurement.start = split1[2];
        // me.tmpMeasurement.end = split1[3];
        me.tmpMeasurement.start = moment(me.customTimeFrame[0]).format('MM/DD/YYYY HH:mm');
        me.tmpMeasurement.end = moment(me.customTimeFrame[1]).format('MM/DD/YYYY HH:mm');
        for (let i = 0; i < me.snapshots.compareData.length; i++) {
          if (me.snapshots.compareData[i]['start'] === me.tmpMeasurement.start && me.snapshots.compareData[i]['end'] === me.tmpMeasurement.end) {
            setTimeout(() => {
              me.confirmSnapshotDialogVisible = true;
            }, 500);
            this.confirmation.confirm({
              key: 'confirm-snapShot',
              message: 'Measurement start and end time already in use. \n Please try using another measurement start and end time.',
              accept: () => { },
              rejectVisible: false
            });
            // me.tmpMeasurement.start = moment(me.customTimeFrame[0]).format('MM/DD/YYYY HH:mm:ss');
            // console.log("me.tmpMeasurement.start-------->",me.tmpMeasurement.start);
            //  me.tmpMeasurement.end = moment(me.customTimeFrame[1]).format('MM/DD/YYYY HH:mm:ss');
            return;
          }
        }
      }
      else {
        //this.messageService.add({severity:'error', summary: 'Error', detail: 'Please select Correct start Time and End Time'});
        setTimeout(() => {
          me.confirmSnapshotDialogVisible = true;
        }, 500);
        this.confirmation.confirm({
          key: 'confirm-snapShot',
          message: 'Please select Correct start Time and End Time',
          accept: () => { },
          rejectVisible: false
        });
        // me.tmpMeasurement.start = moment(me.customTimeFrame[0]).format('MM/DD/YYYY HH:mm:ss');
        // console.log("me.tmpMeasurement.start-------->",me.tmpMeasurement.start);
        //  me.tmpMeasurement.end = moment(me.customTimeFrame[1]).format('MM/DD/YYYY HH:mm:ss');
        return;
      }
      //console.log("me.tmpValue.timePeriod.selected.id-------->",me.tmpValue.timePeriod.selected.id);
      me.tmpMeasurement.presetlabel = "Custom Time";
      if (me.baselineName === '' || me.baselineName === null) {
        me.tmpMeasurement.name = moment(me.customTimeFrame[0]).format('MM/DD/YYYY HH:mm A') + "_" + moment(me.customTimeFrame[1]).format('MM/DD/YYYY HH:mm A');
        me.baselineName = " From " + moment(me.customTimeFrame[0]).format('HH:mm') + " to " + moment(me.customTimeFrame[1]).format(' HH:mm');
      }
      else {
        me.tmpMeasurement.name = " From " + moment(me.customTimeFrame[0]).format('HH:mm') + " to " + moment(me.customTimeFrame[1]).format(' HH:mm');
      }
      //me.preset =false;
    }
    else {
      if (me.tmpValue.timePeriod.selected.id === 'TB0' || me.tmpValue.timePeriod.selected.id === 'TB1' || me.tmpValue.timePeriod.selected.id === 'TB2' || me.tmpValue.timePeriod.selected.id === 'TB3') {
        if (me.snapshots.compareData.length >= 1) {
          if (me.timeBack === 1 ) {
            me.baselineName = me.tmpValueForBaseline.timePeriod.selected.label + " - " + me.timeBack + " " + me.tmpValue.timePeriod.selected.label;
          }
          else if(me.timeBack===null ||me.timeBack===""){
            this.messageService.add({severity:'error', summary: 'Error', detail: 'Please select correct timeBack'});
            return;
          }
          else {
            me.baselineName = me.snapshots.compareData[me.snapshots.compareData.length - 1].presetlabel + " - " + me.timeBack + " " + me.tmpValue.timePeriod.selected.label;
          }
          me.tmpMeasurement.presetlabel = me.timeBack + " " + me.tmpValue.timePeriod.selected.label;
          
        }
        else {
          this.messageService.add({severity:'error', summary: 'Error', detail: 'Please select atleast one measurement to compare hour back feature'});
          // me.confirmSnapshotDialogVisible = true;

          // this.confirmation.confirm({
          //   key: 'confirm-snapShot',
          //   message: 'Please select atleast one measurement to compare Hour Back feature',
          //   accept: () => { },
          //   rejectVisible: false,

          // });
          // return;
        }
        //me.baselineName = me.tmpValueForBaseline.timePeriod.selected.label + " - "+ me.timeBack + " " +me.tmpValue.timePeriod.selected.label;
      }
     else if(me.tmpValue.timePeriod.selected.id.startsWith("EV")){
        me.getEventNameAndBaselineName();
      }
      else {
        me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label
      }
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;

      me.tmpMeasurement.start = me.tmpValue.time.frameStart.value;
      me.tmpMeasurement.end = me.tmpValue.time.frameEnd.value;
      if (me.baselineName === '' || me.baselineName === null) {
        me.tmpMeasurement.name = me.tmpValue.timePeriod.selected.label;
        me.baselineName = me.tmpMeasurement.name;
      }
      else {
        me.tmpMeasurement.name = me.baselineName;
      }
    }
    if (me.snapshots.compareData === null || me.snapshots.compareData === undefined) {
      me.snapshots.compareData = [];
    }
    if (me.snapshots.trendCompare) {
      me.snapshots.trendCompare = true;
      me.trendCompareApply(me.snapshots.trendCompare);
    }
    //sessionStorage.setItem("color",me.tmpMeasurement.rowBgColorField);
    //me.chooseColor(me.tmpMeasurement.rowBgColorField, false);
    if (me.colorpicker === undefined && !me.color && me.tmpMeasurement.rowBgColorField === me.measurement.rowBgColorField) {
      me.tmpMeasurement.rowBgColorField = this.getRandomColor();
    }
    else {
      me.tmpMeasurement.rowBgColorField;
    }
    if (me.color) {
      me.color = false;
    }
    let isValidMeasurementName = this.mesMentNameChk();
    if(!me.tmpMeasurement.preset.startsWith('SPECIFIED_TIME')){
    if (!isValidMeasurementName) {
      //let msg = 'Measurement name already in use. \n Please try using another measurement name.';
      //this.messageService.add({severity:'error', summary: 'Error', detail: 'Measurement and preset name already in use. \n Please try using another measurement name and preset.'});
      me.confirmSnapshotDialogVisible = true;
      this.confirmation.confirm({
        key: 'confirm-snapShot',
        message: 'Measurement and preset name already in use. \n Please try using another measurement name and preset.',
        accept: () => { },
        rejectVisible: false
      });
      me.validate = false;
      return;
    }
  }

    me.disableBaselineTime = false;
    me.isDisabled = false;
    me.clearMeasurement();
    if(me.snapshots.compareData.length>9){
      this.messageService.add({severity:'error', summary: 'Error', detail: 'Only 10 measurement will be added for comparision.'});
     // me.applyCompare = false;
     // me.visible = true;
      return;
    }
    me.tmpMeasurement.id = me.snapshots.compareData.length;
    me.snapshots.compareData.push(ObjectUtility.duplicate(me.tmpMeasurement));
    this.timebarService.setCompareTableData(ObjectUtility.duplicate(me.snapshots.compareData));
  
    if (me.tmpValue.timePeriod.selected.id === "TB0" || me.tmpValue.timePeriod.selected.id === "TB1" || me.tmpValue.timePeriod.selected.id === "TB2" || me.tmpValue.timePeriod.selected.id === "TB3") {
      me.timeBackCall();
    }
    me.tmpMeasurement.rowBgColorField = this.getRandomColor();
    this.messageService.add({severity:'success', summary: 'Success', detail: 'Measurement Added successfully'});
    me.tmpMeasurement.id = -1;
    // me.confirmMeasurementDialogVisible = true;
    // setTimeout(() => {
    //   me.confirmMeasurementDialogVisible = false;
    // }, 500);

    // this.confirmation.confirm({
    //   key: 'confirm-measurement',
    //   message: 'Measurement Added successfully',
    //   accept: () => { },
    //   rejectVisible: false
    // });
  }
  getEventNameAndBaselineName() {
    let me =this;
    if (me.tmpValue.timePeriod.selected.id.startsWith("EV1_")) {
      for (let i = 0; i < me.tmpValue.timePeriod.options[2].items[0].items.length; i++) {
        if (me.tmpValue.timePeriod.selected.id === me.tmpValue.timePeriod.options[2].items[0].items[i].id) {
          me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.options[2].items[0].label + " " + me.tmpValue.timePeriod.selected.label;
          me.baselineName =me.tmpMeasurement.presetlabel;
          break;
        }

      }
    }
    else if (me.tmpValue.timePeriod.selected.id.startsWith("EV2_")) {
      for (let i = 0; i < me.tmpValue.timePeriod.options[2].items[1].items.length; i++) {
        if (me.tmpValue.timePeriod.selected.id === me.tmpValue.timePeriod.options[2].items[1].items[i].id) {
          me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.options[2].items[1].label + " " + me.tmpValue.timePeriod.selected.label;
          me.baselineName =me.tmpMeasurement.presetlabel;
          break;
        }
      }
    }
    else if (me.tmpValue.timePeriod.selected.id.startsWith("EV3_")) {
      for (let i = 0; i < me.tmpValue.timePeriod.options[2].items[2].items.length; i++) {
        if (me.tmpValue.timePeriod.selected.id === me.tmpValue.timePeriod.options[2].items[2].items[i].id) {
          me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.options[2].items[2].label + " " + me.tmpValue.timePeriod.selected.label;
          me.baselineName =me.tmpMeasurement.presetlabel;
          break;
        }
      }
    }
    else if (me.tmpValue.timePeriod.selected.id.startsWith("EV4")) {
      for (let i = 0; i < me.tmpValue.timePeriod.options[2].items[3].items.length; i++) {
        if (me.tmpValue.timePeriod.selected.id === me.tmpValue.timePeriod.options[2].items[3].items[i].id) {
          me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.options[2].items[3].label + " " + me.tmpValue.timePeriod.selected.label;
          me.baselineName =me.tmpMeasurement.presetlabel;
          break;
        }
      }
    }
    else if (me.tmpValue.timePeriod.selected.id.startsWith("EV5")) {
      for (let i = 0; i < me.tmpValue.timePeriod.options[2].items[4].items.length; i++) {
        if (me.tmpValue.timePeriod.selected.id === me.tmpValue.timePeriod.options[2].items[4].items[i].id) {
          me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.options[2].items[4].label + " " + me.tmpValue.timePeriod.selected.label;
          me.baselineName =me.tmpMeasurement.presetlabel;
          break;
        }
      }
    }
    else if (me.tmpValue.timePeriod.selected.id.startsWith("EV6")) {
      for (let i = 0; i < me.tmpValue.timePeriod.options[2].items[5].items.length; i++) {
        if (me.tmpValue.timePeriod.selected.id === me.tmpValue.timePeriod.options[2].items[5].items[i].id) {
          me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.options[2].items[5].label + " " + me.tmpValue.timePeriod.selected.label;
          me.baselineName =me.tmpMeasurement.presetlabel;
          break;
        }
      }
    }
    else if (me.tmpValue.timePeriod.selected.id.startsWith("EV7")) {
      for (let i = 0; i < me.tmpValue.timePeriod.options[2].items[6].items.length; i++) {
        if (me.tmpValue.timePeriod.selected.id === me.tmpValue.timePeriod.options[2].items[6].items[i].id) {
          me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.options[2].items[6].label + " " + me.tmpValue.timePeriod.selected.label;
          me.baselineName =me.tmpMeasurement.presetlabel;
          break;
        }
      }
    }
  }

  clearMeasurementonRowUnSelect() {
    let me = this;
    if (me.tmpValue.timePeriod.selected.id === "TB0" || me.tmpValue.timePeriod.selected.id === "TB1" || me.tmpValue.timePeriod.selected.id === "TB2" || me.tmpValue.timePeriod.selected.id === "TB3") {
      me.preset = true;
      me.timeBackCall();
      me.baselineName = me.tmpValueForBaseline.timePeriod.selected.label + " - " + me.timeBack + " " + me.tmpValue.timePeriod.selected.label;
    }
    else {
      me.preset = true;
       me.baselineName=me.tmpValue.timePeriod.selected.label;
    }
  }

  clearMeasurement() {
    let me = this;
    if (me.tmpValue.timePeriod.selected.id === "TB0" || me.tmpValue.timePeriod.selected.id === "TB1" || me.tmpValue.timePeriod.selected.id === "TB2" || me.tmpValue.timePeriod.selected.id === "TB3") {
      me.preset = true;
      if (me.timeBack === 1) {
        me.baselineName = me.snapshots.compareData[me.snapshots.compareData.length - 1].presetlabel + " - " + me.timeBack + " " + me.tmpValue.timePeriod.selected.label;
        me.tmpMeasurement.name = me.baselineName;
      }
    }
    else if (me.tmpValue.timePeriod.selected.id.startsWith('SPECIFIED_')) {
       me.preset = false;
      if (me.baselineName === '' || me.baselineName === null) {
        me.tmpMeasurement.name = moment(me.customTimeFrame[0]).format('MM/DD/YYYY HH:mm A') + "_" + moment(me.customTimeFrame[1]).format('MM/DD/YYYY HH:mm A');
        me.baselineName = " From " + moment(me.customTimeFrame[0]).format('HH:mm') + " to " + moment(me.customTimeFrame[1]).format(' HH:mm');
      }
      me.tmpMeasurement.name = me.baselineName;
    }
    else {
      //me.preset = true;
      // me.onTimeFilterTypeChange();
      //me.tmpMeasurement.preset =me.tmpValue.timePeriod.selected.id;
      // if(me.tmpMeasurement.preset.startsWith('SPECIFIED_TIME')){
      //   let split1 = me.tmpMeasurement.preset.split("_");
      //me.tmpMeasurement.start = split1[2];
      //me.tmpMeasurement.end = split1[3];

      // let start = new Date(split1[2]);
      // let end =new Date(split1[3]);
      // me.tmpMeasurement.start = moment(start).format('MM/DD/YYYY HH:mm:ss');
      // console.log("start-----",start);
      // me.customTimeFrame[0] = me.tmpMeasurement.start;
      // console.log("end---------",end);
      //  me.tmpMeasurement.end = moment(end).format('MM/DD/YYYY HH:mm:ss');
      //  me.customTimeFrame[1] = me.tmpMeasurement.end;
      //}
      //me.baselineName= "Custom Time";
    }
  }

  /**
   * This method is called while selecting meaurement color.
 */
  chooseColor(event) {
    let me = this;
    //me.color =false;
    me.color1 = me.tmpMeasurement.rowBgColorField;
    if (event != undefined) {
      me.color = true;
    }
    else {
      me.color = false;
    }
  }

  /**
   * This method is called  to reduce the table column at time of trend compare.
 */
  trendCompareApply(snapshots) {
    let me = this;
    localStorage.setItem("cols", JSON.stringify(me.cols));
    localStorage.setItem("realcol", JSON.stringify(me.data.headers[0].cols));
    if (me.snapshots.trendCompare) {
      let index;
      let col3: any[] = [];
      col3 = JSON.parse(localStorage.getItem("cols"));
      for (let i = 0; i < col3.length; i++) {
        if (col3[i]['valueField'] === 'color') {
          index = i;
          col3.splice(index, 1);
          me._selectedColumns = col3;
          return col3;
        }
      }
    }
    else if (me.deleteSnapshot) {
      let cols: any[] = [];
      let cols2: any[] = [];
      cols = JSON.parse(localStorage.getItem("cols"));
      cols2 = JSON.parse(localStorage.getItem('realcol'));
      for (let i = 0; i < cols.length; i++) {
        me._selectedColumns = cols2;
      }
    }
    else {
      me.cols = me.data.headers[0].cols;
      me._selectedColumns = me.cols;
    }
  }


  updateMeasurement(name: string) {
    let me = this;
    me.tmpMeasurement.name = name;
    //me.snapshots.compareData.push(ObjectUtility.duplicate(me.tmpMeasurement));
  }

  updateSnap(value: string) {
    let me = this;
    me.snapshots.snapShotName = value;
  }

  /**
     * This method is called  to get random color for measurement color.
   */
  getRandomColor = function () {
    try {
      var letters = '0123456789ABCDEF';
      var color = '#';
      for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      if (color.startsWith('#0')) {
        this.getRandomColor();
      }
      return color;
    } catch (error) {
      this.log.error('Error in getRandomColor method')
    }
  };

  /**
    * This method is called  when we select table row.
  */
  onRowSelect(event) {
    let me = this;
    if (me.tmpMeasurement.preset.startsWith('LIVE') || me.tmpMeasurement.preset.startsWith('TB') || me.tmpMeasurement.preset.startsWith('EV')) {
      me.preset = true;
    }
    if (!me.preset) {
      me.tmpMeasurement = ObjectUtility.duplicate(me.selectedRow);
      me.baselineName = me.tmpMeasurement.name;
    }
    else {
      me.tmpMeasurement = ObjectUtility.duplicate(me.selectedRow);
      if (me.tmpValue.timePeriod.selected.id.startsWith("EV1_") || me.tmpValue.timePeriod.selected.id.startsWith("EV2_") || me.tmpValue.timePeriod.selected.id.startsWith("EV3_") || me.tmpValue.timePeriod.selected.id.startsWith("EV3_") || me.tmpValue.timePeriod.selected.id.startsWith("EV4_") || me.tmpValue.timePeriod.selected.id.startsWith("EV5_") || me.tmpValue.timePeriod.selected.id.startsWith("EV6_") || me.tmpValue.timePeriod.selected.id.startsWith("EV7_")) {
        me.tmpValue.timePeriod.selected.label;
      }
      else if (me.tmpValue.timePeriod.selected.id === 'TB0' || me.tmpValue.timePeriod.selected.id === 'TB1' || me.tmpValue.timePeriod.selected.id === 'TB2' || me.tmpValue.timePeriod.selected.id === 'TB3' && me.tmpMeasurement.preset! === me.tmpValue.timePeriod.selected.id) {
        if (me.snapshots.compareData.length >= 1 && me.tmpMeasurement.rowBgColorField === "#333674") {
          me.tmpValueForBaseline = me.timebarService.getGlobalTimeBar();
          me.tmpMeasurement.presetlabel = me.tmpValueForBaseline.timePeriod.selected.label;
          me.tmpMeasurement.preset = me.tmpValueForBaseline.timePeriod.selected.id;
          me.baselineName = me.tmpValueForBaseline.timePeriod.selected.label + " - " + me.timeBack + " " + me.tmpValue.timePeriod.selected.label;
        }
        else {
          me.tmpMeasurement.presetlabel = me.timeBack + " " + me.tmpValue.timePeriod.selected.label;
          me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
          if (me.color1 === null || me.color1 === undefined) {
            if (event.data.rowBgColorField === me.tmpMeasurement.rowBgColorField) {
              me.tmpMeasurement.rowBgColorField;
            } else {
              me.tmpMeasurement.rowBgColorField = '#db1c0f';
            }
          }
          else {
            if (event.data.rowBgColorField === me.tmpMeasurement.rowBgColorField) {
              me.tmpMeasurement.rowBgColorField;
            } else {
              me.tmpMeasurement.rowBgColorField = me.color1;
            }
          }
        }
      }
      else {
        //me.tmpValue.timePeriod.selected.label =me.selectedRow.presetlabel;
        //me.onTimeFilterTypeChange();
        //me.tmpValue.timePeriod.previous.label =me.tmpMeasurement.presetlabel;
      }
      me.baselineName = me.tmpMeasurement.name;
      me.tmpValue.time.frameStart.value = me.tmpMeasurement.start;
      me.tmpValue.time.frameEnd.value = me.tmpMeasurement.end;
    }
    if (me.snapshots.includeDefaultBaseline && me.snapshots.compareData.length === 1) {
      me.disableBaselineTime = true;
      me.tmpValueForBaseline = me.timebarService.getGlobalTimeBar();
      me.selectedRow.presetlabel = me.tmpValueForBaseline.timePeriod.selected.label;
      me.selectedRow.preset = me.tmpValueForBaseline.timePeriod.selected.id;
      me.isDisabled = false;
    }
    else if (me.snapshots.compareData.length > 1 && me.tmpMeasurement.rowBgColorField === "#333674") {
      me.disableBaselineTime = true;
      me.tmpValueForBaseline = me.timebarService.getGlobalTimeBar();
      me.selectedRow.presetlabel = me.tmpValueForBaseline.timePeriod.selected.label;
      me.selectedRow.preset = me.tmpValueForBaseline.timePeriod.selected.id;
      me.isDisabled = false;
    }
    else {
      me.disableBaselineTime = false;
      me.isDisabled = false;
    }

    me.updateRow = true;
    if (event === false) {
      me.updateRow = false;
    }
  }

  /**
     * This method is called  when we unselect table row.
   */
  onRowUnselect(event) {
    let me = this;
    me.updateRow = false;
    me.selectedRow = null;
    me.tmpMeasurement.id = -1;
    if (me.colorpicker === undefined && !me.color && me.tmpMeasurement.rowBgColorField !== me.measurement.rowBgColorField) {
      me.tmpMeasurement.rowBgColorField = this.getRandomColor();
    }
    else if (me.tmpMeasurement.rowBgColorField === me.measurement.rowBgColorField && me.snapshots.compareData.length === 1) {
      me.tmpMeasurement.rowBgColorField = '#db1c0f';
      me.disableBaselineTime = false;
    }
    else {
      me.tmpMeasurement.rowBgColorField;
    }
    if (me.color) {
      me.color = false;
    }
    if (me.snapshots.compareData.length >= 1 && me.measurement.rowBgColorField === "#333674") {
      me.disableBaselineTime = false;
      me.isDisabled = false;
    }
    else {
      me.isDisabled = false;
      me.disableBaselineTime = false;
    }
    me.clearMeasurementonRowUnSelect();
  }

  /**
     * This method is called  when we delete table row.
   */
  deleteRow(index,row) {
    let me = this;
    //this.messageService.add({severity:'success', summary: 'Success', detail: 'Measurement Detail deleted successfully!!'});
    
    if (me.tmpMeasurement.id == row.id) {
      me.confirmMeasurementDialogVisible = true;
      this.confirmation.confirm({
        key: 'confirm-measurement',
        header:'Update Mode',
        message: 'In updation mode, Measurement cannot be deleted.',
        accept: () => {return;},
        rejectVisible:false
      });
      //this.updateRow=false;
     
    }
    else{
    me.confirmMeasurementDialogVisible = true;
    this.confirmation.confirm({
      key: 'confirm-measurement',
      message: 'Are you sure you want to delete Measurement?',
      accept: () => { this.deleteRow1(index,row) },
      reject: () => { return;
      }
    });
  }
  }
  
  deleteRow1(index,row){
    let me =this;
    if(me.updateRow){
      me.updateRow=false;
    }
    let preset:string;
    let preset1 :string;
    if (index === 0 && me.snapshots.includeDefaultBaseline) {
      me.snapshots.includeDefaultBaseline = false;
    }
    me.snapshots.compareData.splice(index, 1);
    if(me.tmpMeasurement.id > row.id){
      me.tmpMeasurement.id = me.tmpMeasurement.id-1;
    }
    me.updateSnapshotMeasurementListId();
    // if(index ===0 ){
    //   for(let i=0;i<=me.snapshots.compareData.length;i++){
    //     if(me.snapshots.compareData.length===1 && me.snapshots.compareData[i-1].preset.startsWith('TB')){
    //       me.snapshots.compareData.splice(i-1, 1);
    //     }
    //    else if(me.snapshots.compareData[i].preset.startsWith('TB')){
    //     me.snapshots.compareData.splice(i, 1);
    //     i=0;
          
    //     }
    //   }
    // }

    // let idx =index;
    //  if(row.preset.startsWith('TB')){
    //   for(let i=index;i>=idx -1;i--){
    //     if(me.snapshots.compareData[i].preset.startsWith('TB')){
    //       preset1 =me.snapshots.compareData[i].preset;
    //       me.snapshots.compareData.splice(i, 1);
    //       index --;
    //       //me.snapshots.compareData.splice(row, 1);
    //     }
    //     else if(i=== index){
    //       if(!me.snapshots.compareData[i].preset.startsWith('TB')){
    //         preset =me.snapshots.compareData[i].preset;
    //         //me.snapshots.compareData.splice(i, 1);
    //         if (i === 0 && me.snapshots.includeDefaultBaseline) {
    //           me.snapshots.includeDefaultBaseline = false;
    //         }
    //         break;
    //       }
    //     }
    //   }
    //   if(me.snapshots.compareData.length >0){
    //     for(let i=me.snapshots.compareData.length;i>=0;i--){
    //       if(preset!==undefined && !preset.startsWith('TB') && preset!==null){
    //         if (i-1 === 0 && me.snapshots.includeDefaultBaseline) {
    //           me.snapshots.includeDefaultBaseline = false;
    //         }
    //          return;
    //       }
    //        else if(me.snapshots.compareData[i-1].preset.startsWith('TB')){
    //           me.snapshots.compareData.splice(i-1, 1);
    //         }
    //         // else if(me.snapshots.compareData.length===1){
    //         //   me.snapshots.compareData.splice(i-1, 1);
    //         //   break;
    //         // }
    //         else if(!preset1.startsWith('TB')){
    //           me.snapshots.compareData.splice(i-1, 1);
    //           break;
    //         }
    //         else{
    //           return;
    //         }
    //         if (i-1 === 0 && me.snapshots.includeDefaultBaseline) {
    //           me.snapshots.includeDefaultBaseline = false;
    //         }
    //     }
    //   }
    //   // for(let i=0;i<=index;i++){
    //   //  // if(me.snapshots.compareData[i].preset.startsWith('TB')){
    //   //     me.snapshots.compareData.splice(i-1, 1);
    //   //   //}
    //   // }
    //   // me.snapshots.compareData.splice(row, 1);
    // }
    // else{
    //   if(me.snapshots.compareData.length>0){
    //     for(let i=index;i<me.snapshots.compareData.length;i++){
    //       if(!me.snapshots.compareData[i].preset.startsWith('TB')){
    //            index =i;
    //       }
    //      else if(me.snapshots.compareData[index+1].preset.startsWith('TB')){
    //         me.snapshots.compareData.splice(index+1, 1);
    //       }
    //     }
    //   }
    // me.snapshots.compareData.splice(index, 1);
    // }
    if (!me.snapshots.includeDefaultBaseline && me.snapshots.compareData.length === 0) {
      me.tmpValue.timePeriod.options[3].disabled =false;
      me.disableBaselineTime =false;
    }
    else {
      me.tmpValue.timePeriod.options[3].disabled = false;
    }
    // if (me.updateRow) {
    //   // me.updateRow = false;
    //   //me.onRowUnselect(false);
    // }
  }

  //   onChange(event){
  //     const me = this;
  //     me.viewByselected = event.value;
  //       if(me.viewByselected ==="Sec" ||me.viewByselected===""){
  //         me.viewByValueList=[]; 
  //           me.viewByValueList.push(
  //             { label: "1 Sec", value:"1 Sec"},
  //             {label: "10 Sec", value:"10 Sec"}
  //   )
  //       }

  //      else  if(me.viewByselected ==="Min"){
  //       me.viewByValueList=[]; 
  //         me.viewByValueList.push(
  //           { label: "1 Sec", value:"1 Sec"},
  //             {label: "10 Sec", value:"10 Sec"},
  //             { label: "1 Min", value:"1 Min"},
  //             {label: "10 Min", value:"10 Min"}
  //           )
  //     }
  //    else if(me.viewByselected ==="Hour"){
  //     me.viewByValueList=[]; 
  //     me.viewByValueList.push(
  //       { label: "1 Sec", value:"1 Sec"},
  //         {label: "10 Sec", value:"10 Sec"},
  //         { label: "1 Min", value:"1 Min"},
  //         {label: "10 Min", value:"10 Min"},
  //         { label: "1 Hour", value:"1 Hour"},
  //         {label: "4 Hour", value:"4 Hour"}
  //       )
  //   }
  //  else if(me.viewByselected ==="Days"){  
  //   me.viewByValueList=[]; 
  //   me.viewByValueList.push(
  //     { label: "1 Sec", value:"1 Sec"},
  //       {label: "10 Sec", value:"10 Sec"},
  //       { label: "1 Min", value:"1 Min"},
  //       {label: "10 Min", value:"10 Min"},
  //       { label: "1 Hour", value:"1 Hour"},
  //       {label: "4 Hour", value:"4 Hour"},
  //       {label: "1 Day", value:"1 Day"},
  //     )
  // }

  //  }

  /**
     * This method is called  when we save measurement to server.
   */
  saveAndUpdate() {
    const me = this;
    //if(me.snapshots.snapShotName!==null){
    for (let item = 0; item < me.data.snapshots.length; item++) {
      if (me.data.snapshots[item].label === me.snapshots.snapShotName) {
        //this.messageService.add({severity:'error', summary: 'Error', detail: 'Please use different Snapshot name, it is already present in measurement set'}); 
        me.confirmSnapshotDialogVisible = true;
        this.confirmation.confirm({
          key: 'confirm-snapShot',
          message: 'Please use different Snapshot name, it is already present in measurement set',
          accept: () => { },
          rejectVisible: false
        });
        me.applyCompare = false;
        me.visible = true;
        return;
      }
    }
    //}
    if (me.applyCompare)
      me.data.snapshots = JSON.parse(sessionStorage.getItem("data"));
    me.data.snapshots.push({
      label: me.snapshots.snapShotName, value: me.snapshots.snapShotName
    });
    sessionStorage.setItem('dataLabel', JSON.stringify(me.data.snapshots));
    me.data.snapshots = JSON.parse(sessionStorage.getItem("dataLabel"));
    if (me.data.snapshotsData === undefined || me.data.snapshotsData === null) {
      me.data.data.push(me.snapshots);
      sessionStorage.setItem('dataValue', JSON.stringify(me.data.data));
    }
    else {
      me.data.snapshotsData.push(me.snapshots);
      sessionStorage.setItem('dataValue', JSON.stringify(me.data.snapshotsData));
    }
    me.snapshots.opType = "save";
    me.compareDataService.load(me.snapshots).subscribe(
      (state: Store.State) => {
        if (state instanceof CompareDataLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof CompareDataLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: CompareDataLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  /**
     * This method is called when first time compare window load.
   */
  load() {
    const me = this;
    //me.fillViewByOption();
    //me.fillViewByValue();
     if(me.compareDataService.applyGlobalCompareFlag){
      me.data = me.compareDataService.loadCategory(me.snapshots,me.compareDataService.measurementSet);
             me.cols = me.data.headers[0].cols;
             me._selectedColumns = me.cols;
             if(me.snapshots==undefined){
             me.snapshots =me.compareDataService.snapshotsList;
             }
             if(me.snapshots.trendCompare){
              me.trendCompareApply(me.snapshots);
             }
             
             me.tmpMeasurement =this.compareDataService.tmpMeasurement;
             me.visible =true;
             me.disableCompareFlagonApply=true;
             this.cd.detectChanges();
             return;
             
        }
    if (me.applyCompare && me.deleteSnapshot) {
      me.snapshots.saveMeasurement = false;
      if (me.snapshots.trendCompare) {
        me.trendCompareApply(me.snapshots.trendCompare);
        return;
      }
      else {
        return;
      }
    }
else{
  me.selectedSnap="";
    me.snapshots = {
      trendCompare: false,
      saveMeasurement: false,
      opType: 'get',
      snapShotName: "",
      snapshopIndex: 0,
      compareData: [],
      includeDefaultBaseline: true,
      applyAllWidget: true,
      viewByLevel: 'Min',
      viewByValue: '60'
    };
    me.measurement = {
      name: "Hello",
      preset: me.tmpValue.timePeriod.selected.id,
      presetlabel: me.tmpValue.timePeriod.selected.label,
      rowBgColorField: '#db1c0f',
      start: me.tmpValue.time.frameStart.value,
      end: me.tmpValue.time.frameEnd.value,

    }
    //me.preset=true;
    me.presetOptionsForBaseline();
      //me.getCompareData(me.snapshots);
    me.compareDataService.load(me.snapshots).subscribe(
      (state: Store.State) => {
        if (state instanceof CompareDataLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof CompareDataLoadedState) {
          me.onLoaded(state);
          me.visible =true;
          me.cd.detectChanges();
          return;
        }
      },
      (state: CompareDataLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }
}
  // getCompareData(snapshots: SnapShot) {
  //   let me=this;
  //   const input =me.getInput(snapshots);
  //   if (!me.widgetWiseCompare) {
  //     me.snapshots.applyAllWidget = true;
  //   }
  //   else {
  //     me.snapshots.applyAllWidget = false;
  //   }
  //   if (input.snapshotsData === undefined || input.snapshotsData === null) {
  //     me.snapshots.compareData = ObjectUtility.duplicate(input.data[0].compareData);
  //   }
  //   else {
  //     if (me.snapshots.compareData === null || me.snapshots.compareData === undefined) {
  //       me.snapshots.compareData = [];
  //     }
  //     if (me.applyCompare) {
  //       for (let i = 0; i < input.snapshotsData.length; i++) {
  //         if (me.snapshots.snapShotName === input.snapshotsData[i].snapShotName) {
  //           me.snapshots.compareData = ObjectUtility.duplicate(input.snapshotsData[i].compareData);
  //           break;
  //         }
  //       }

  //     }
  //     else {
  //       if (input.snapshots.length === 0 || input.snapshots.length === 1) {
  //         input.snapshots.push(
  //           {
  //             label: me.snapshots.snapShotName, value: me.snapshots.snapShotName
  //           });
  //       }
  //       else {
  //         input.snapshots = JSON.parse(sessionStorage.getItem("data"));
  //       }
  //     }
  //   }

  //   me.cols = input.headers[0].cols;
  //   me._selectedColumns = me.cols;
  // me.snapshots.snapShotName = null;
  // me.cd.detectChanges();
  // }
  // if(me.data.snapshots!==null){
  //   //me.data.snapshots= me.data.snapshots.sort();
  //   me.data.snapshots.sort((a, b) => (a.value.toLocaleLowerCase() > b.value.toLocaleLowerCase()) ? 1 : (a.value.toLocaleLowerCase() === b.value.toLocaleLowerCase()) ? ((a.value.toLocaleLowerCase() > b.value.toLocaleLowerCase()) ? 1 : -1) : -1 )
  // }

      
  

//   getInput(snapshots: SnapShot) {
//     let data2:CompareGetData;
//     //let data1 :SnapShot[];
//     //data1[0] =snapshots;
//     let newSnapshotsList: CompareDataSavedSnapshot[]= [];
//    data2={
//      "data":[
//     {
//  "applyAllWidget":snapshots.applyAllWidget,
//  "compareData":snapshots.compareData,
//  "includeDefaultBaseline":snapshots.includeDefaultBaseline,
//  "opType":snapshots.opType,
//  "saveMeasurement":snapshots.saveMeasurement,
//  "snapShotName":snapshots.snapShotName,
//  "snapshopIndex":snapshots.snapshopIndex,
//  "trendCompare":snapshots.trendCompare,
//  "viewByLevel":60,
//  "viewByValue":""
//    }
//      ]

//    }

//     newSnapshotsList.push({label:snapshots.snapShotName ,value: snapshots.snapShotName});
//     const input: CompareDataTable = {
//       data: data2.data,
//       headers: COMPARE_DATA_TABLE.headers,
//       snapshots:newSnapshotsList,
//       snapshotsData:data2.data,
//       };
//       return input;
//   }

  /**
   * This method is used at time of loading the compare window to set default setting of preset.
 */
  presetOptionsForBaseline() {
    let me = this;
    
    me.tmpValueForBaseline = me.timebarService.getGlobalTimeBar();
    let value = me.timebarService.originalPreCallData;
    this.tmpValue.timePeriod.options=value.timePeriod;
    if (me.tmpValueForBaseline.timePeriod.selected.label === "Custom Time") {
      me.preset = false;
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.selectToggle(true);
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Last 5 Minutes" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 10 Minutes" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 30 Minutes" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 1 Hour" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 2 Hours" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 4 Hours" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 6 Hours" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 8 Hours" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 12 Hours" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 24 Hours" || me.tmpValueForBaseline.timePeriod.selected.label === "Hour Back") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      //me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[3].items[0].label;
      //me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[3].items[0].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpValue.timePeriod.selected.id=me.tmpValue.timePeriod.options[3].items[0].id;
      me.tmpValue.timePeriod.selected.label =me.tmpValue.timePeriod.options[3].items[0].label;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
      me.baselineName = me.tmpValue.timePeriod.options[3].items[0].label;
      me.selectToggle(true);
      me.timeBack = "";
      //me.timeBackCall();
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Today") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      // me.tmpValue.timePeriod.selected.label =me.tmpValue.timePeriod.options[3].items[0].label;
      // me.tmpValue.timePeriod.selected.id =me.tmpValue.timePeriod.options[3].items[0].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Last 7 Days" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 30 Days" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 90 Days" || me.tmpValueForBaseline.timePeriod.selected.label === "Yesterday" || me.tmpValueForBaseline.timePeriod.selected.label === "Day Back") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[3].items[1].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[3].items[1].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
      me.baselineName = me.tmpMeasurement.presetlabel;
      me.selectToggle(true);
      me.timeBack = "";
      //me.timeBackCall();
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "This Week") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[1].items[1].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[1].items[1].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "This Month") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[1].items[5].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[1].items[5].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "This Year") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[1].items[9].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[1].items[9].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Last Week" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 2 Weeks" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 3 Weeks" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 4 Weeks" || me.tmpValueForBaseline.timePeriod.selected.label === "Week Back") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[3].items[2].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[3].items[2].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
      me.selectToggle(true);
      me.timeBack = "";
      //me.timeBackCall();
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Last Month" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 2 Months" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 3 Months" || me.tmpValueForBaseline.timePeriod.selected.label === "Last 6 Months" || me.tmpValueForBaseline.timePeriod.selected.label === "Month Back") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[3].items[3].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[3].items[3].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
      me.selectToggle(true);
      me.timeBack = "";
      //me.timeBackCall();
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Black Friday 2020") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[0].items[1].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[0].items[1].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Black Friday 2019") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[0].items[2].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[0].items[2].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Black Friday 2018") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[0].items[3].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[0].items[3].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Black Friday 2017") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[0].items[4].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[0].items[4].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Black Friday 2016") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[0].items[5].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[0].items[5].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Black Friday 2015") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[0].items[6].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[0].items[6].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Black Friday 2014") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[0].items[7].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[0].items[7].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Black Friday 2013") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[0].items[8].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[0].items[8].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Black Friday 2012") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[0].items[9].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[0].items[9].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Black Friday 2011") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[0].items[10].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[0].items[10].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Black Friday 2010" || me.tmpValueForBaseline.timePeriod.selected.label === "Christmas Day 2010" || me.tmpValueForBaseline.timePeriod.selected.label === "Cyber Monday 2010" || me.tmpValueForBaseline.timePeriod.selected.label === "Good Friday 2010" || me.tmpValueForBaseline.timePeriod.selected.label === "New Years Day 2010" || me.tmpValueForBaseline.timePeriod.selected.label === "President's Day 2010" || me.tmpValueForBaseline.timePeriod.selected.label === "Thanks Giving Day 2010" || me.tmpValueForBaseline.timePeriod.selected.label === "Valentines Day 2010") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.preset = false;
      // me.tmpValue.timePeriod.selected.label =me.tmpValue.timePeriod.options[2].items[0].items[6].label;
      // me.tmpValue.timePeriod.selected.id =me.tmpValue.timePeriod.options[2].items[0].items[6].id;
      // me.tmpMeasurement.preset= me.tmpValue.timePeriod.selected.id;
      // me.tmpMeasurement.presetlabel=me.tmpValue.timePeriod.selected.label;
    }

    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Christmas Day 2020") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[1].items[1].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[1].items[1].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Christmas Day 2019") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[1].items[2].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[1].items[2].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Christmas Day 2018") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[1].items[3].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[1].items[3].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Christmas Day 2017") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[1].items[4].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[1].items[4].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Christmas Day 2016") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[1].items[5].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[1].items[5].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Christmas Day 2015") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[1].items[6].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[1].items[6].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Christmas Day 2014") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[1].items[7].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[1].items[7].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Christmas Day 2013") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[1].items[8].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[1].items[8].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Christmas Day 2012") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[1].items[9].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[1].items[9].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
    else if (me.tmpValueForBaseline.timePeriod.selected.label === "Christmas Day 2011") {
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[2].items[1].items[10].label;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[2].items[1].items[10].id;
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
    }
  }

  // fillViewByValue() {
  //   let me = this;
  //   me.viewByValueList =[];
  //   console.log("me.tmpValue.viewBy------->",me.tmpValue.viewBy);
  //   me.viewByValueList.push({
  //     label: me.tmpValue.viewBy.selected.label, value:me.tmpValue.viewBy.selected.id
  //   })
  //     for(let m =0;m<me.tmpValue.viewBy.options[0].items.length;m++){
  //       me.viewByValueList.push({
  //         label: me.tmpValue.viewBy.options[0].items[m].label, value:me.tmpValue.viewBy.options[0].items[m].id
  //       })
  //     }

  // }

  // fillViewByOption() {
  //   let me = this;
  //  // for(let k=0;k<me.tmpValue.viewBy.options.length;k++){
  //   me.viewbyList =[];
  //     // me.viewbyList.push(
  //     //   { label:"Sec" , value: "Sec" },
  //     //   { label:"Min" , value: "Min" },
  //     //   { label:"Hour" , value: "Hour" },
  //     //   { label:"Days" , value: "Days" }

  //     // );
  //     for(let m =0;m<me.tmpValue.viewBy.options.length;m++){
  //       me.viewbyList.push({
  //         label: me.tmpValue.viewBy.options[m].label, value:me.tmpValue.viewBy.options[m].id
  //       })
  //     }
  //   //}
  // }


  private onLoading(state: CompareDataLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: CompareDataLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = true;
  }

  private onLoaded(state: CompareDataLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    this.compareDataService.setSnapshotData(me.data.snapshotsData);
    sessionStorage.setItem('data', JSON.stringify(me.data.snapshots));
    //this.messageService.add({severity:'success', summary: 'Success', detail: 'Measurement deleted successfully!!'});
  
    if (me.deleteSnapshot) {
      if (!me.widgetWiseCompare) {
        me.snapshots.applyAllWidget = true;
      }
      else {
        me.snapshots.applyAllWidget = false;
      }
    }

    else {
      if (!me.widgetWiseCompare) {
        me.snapshots.applyAllWidget = true;
      }
      else {
        me.snapshots.applyAllWidget = false;
      }
      if (me.data.snapshotsData === undefined || me.data.snapshotsData === null) {
        me.snapshots.compareData = ObjectUtility.duplicate(me.data.data[0].compareData);
      }
      else {
        if (me.snapshots.compareData === null || me.snapshots.compareData === undefined) {
          me.snapshots.compareData = [];
        }
        if (me.applyCompare) {
          for (let i = 0; i < me.data.snapshotsData.length; i++) {
            if (me.snapshots.snapShotName === me.data.snapshotsData[i].snapShotName) {
              me.snapshots.compareData = ObjectUtility.duplicate(me.data.snapshotsData[i].compareData);
              break;
            }
          }

        }
        else {
          if (me.data.snapshots.length === 0 || me.data.snapshots.length === 1) {
            me.data.snapshots.push(
              {
                label: "No record", value: "No record"
               
              });
          }
          else {
            me.data.snapshots = JSON.parse(sessionStorage.getItem("data"));
           
          }
        }
      }

      me.cols = me.data.headers[0].cols;
      me._selectedColumns = me.cols;
    }
    // if(me.data.snapshots!==null){
    //   //me.data.snapshots= me.data.snapshots.sort();
    //   me.data.snapshots.sort((a, b) => (a.value.toLocaleLowerCase() > b.value.toLocaleLowerCase()) ? 1 : (a.value.toLocaleLowerCase() === b.value.toLocaleLowerCase()) ? ((a.value.toLocaleLowerCase() > b.value.toLocaleLowerCase()) ? 1 : -1) : -1 )
    // }
    me.snapshots.snapShotName = null;
    me.cd.detectChanges();
  }


  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  /**
   * This method is called at the time of opening the compare from globar view.
 */
  open() {
    let me = this;
   // this.visible = true;
    //me.widgetWiseCompare = false;
   // me.globalCompare =true;
   if(me.compareDataService.widgetWiseCompareFlag){
    me.snapshots =me.compareDataService.snapshotsList;
    me.applyCompare =true;
    if(me.data ===undefined){
      me.data ={};
    }
   me.data.snapshots =me.compareDataService.measurementSet;
   }
   if(me.disableCompareFlagonApply){
    me.applyCompare=true;
  }
   if(!me.compareDataService.widgetWiseCompareFlag && !me.applyCompare){
     me.applyCompare=false;
   }
    me.load();
    me.onTimeFilterTypeChange(false);
    if(me.tmpValue.timePeriod.options[0].items[0].id.startsWith('TB')){
      me.onTimeFilterTypeChange(false);
    }
    //if(!me.snapshots.applyAllWidget){
        me.snapshots.applyAllWidget =true; 
   // }
    if(me.applyCompare){
      me.visible =true;
    }
    //me.timeBack =null;
    me.cd.detectChanges();
   
  }
  /**
   * This method is called at the time of opening the compare from selected Widget.
 */
  openWidgetWiseCompare(index, widget:DashboardWidgetComponent) {
    let me = this;
    
    me.widgetWiseIndex = index;
    me.widgetWise =widget;
    me.widgetWiseCompare = true;
    if(widget.dashboard.selectedWidget.widget.trendList===undefined ||widget.dashboard.selectedWidget.widget.trendList===null){
      me.applyCompare=false;
      me.compareDataService.setApplyGlobalCompareFlag(false);
      me.disableCompareFlagonApply=widget.dashboard.selectedWidget.widget.disableCompare;
      me.load();

    }
    else{
    DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {
      //me.disableCompareFlagonApply =dc.selectedWidget.widget.disableCompare;
       if(dc.selectedWidget.widget.trendList){
      for(let i=0;i<dc.data.favDetailCtx.widgets.length;i++){
       if(dc.selectedWidget.widget.widgetIndex===dc.data.favDetailCtx.widgets[i].widgetIndex){
        this.compareDataService.setMeasurementList(dc.selectedWidget.widget.trendList);
        me.applyCompare =true;
        me.disableCompareFlagonApply=true;
          me.snapshots =this.compareDataService.snapshotsList;
          if(me.snapshots.compareData===null){
          me.snapshots.compareData=dc.selectedWidget.widget.trendList;
          }
            me.snapshots.applyAllWidget =false;
           me.tmpMeasurement =this.compareDataService.tmpMeasurement;
           this.compareDataService.setWidgetWiseCompareFlag(me.widgetWiseCompare);
       }

      }
      me.load();
    }
    else{
      me.applyCompare=false;
      me.load();
    }
      });
    }
    me.onTimeFilterTypeChange(false);
    if(me.applyCompare){
      me.visible =true;
    }
    me.cd.detectChanges();
  }

  onTimeFilterTypeChange(flag: boolean) {
    const me = this;
    if (flag && me.preset){
      me.tmpMeasurement = ObjectUtility.duplicate(me.measurement);
      me.tmpMeasurement.preset = me.tmpValue.timePeriod.selected.id;
      me.tmpValue.timePeriod.selected.id = me.tmpValue.timePeriod.options[3].items[0].id;
      me.tmpValue.timePeriod.selected.label = me.tmpValue.timePeriod.options[3].items[0].label;
      me.tmpMeasurement.presetlabel = me.tmpValue.timePeriod.selected.label;
      me.baselineName = me.tmpValue.timePeriod.options[3].items[0].label;
      me.timeBack = "";
    }

    if (!me.preset) {
      // This is the case of when the local time zone is different and server time zone is different the wne have to set the time zone according to the server in moment js
      let timeZone = sessionStorage.getItem("_nvtimezone");
      let zone = me.sessionService.selectedTimeZone.value;
      if (!(!me.sessionService.selectedTimeZone && (!zone || zone.indexOf(",") == -1 || (zone.split(",").length < 2)))) {
        timeZone = zone.split(",")[1].trim();
      }
      moment.tz.setDefault(timeZone); // set the time zone into moment
      const customTime: TimebarTimeConfig = me.timebarService.getTimeConfig(
        _.get(me.tmpValue, 'timePeriod.selected.id', '')
      );

      // const serverTime = moment(me.sessionService.time);
      const serverTime = moment(me.sessionService.time).zone(this.sessionService.selectedTimeZone.offset);
      if (customTime) {
        me.customTimeFrame = [
          moment(customTime.frameStart.value).zone(
            this.sessionService.selectedTimeZone.offset),
          moment(customTime.frameEnd.value).zone(
            this.sessionService.selectedTimeZone.offset),
        ];
      }
      else {
        me.customTimeFrame = [
          moment(me.tmpValue.time.frameStart.value).zone(
            this.sessionService.selectedTimeZone.offset),
          moment(me.tmpValue.time.frameEnd.value).zone(
            this.sessionService.selectedTimeZone.offset),
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
      me.baselineName = " From " + moment(me.customTimeFrame[0]).format('HH:mm') + " to " + moment(me.customTimeFrame[1]).format(' HH:mm');
    } else {
      me.validateTimeFilter();
    }
  }

  /**
     * This method is called when we disabled compare window.
   */
  disableCompare() {
    let me = this;
    me.visible = false;
    DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {
      me.disableCompareFlagonApply = false;
      if(!me.snapshots.applyAllWidget){
        for (let i = 0; i < dc.data.favDetailCtx.widgets.length; i++) {
          if(dc.selectedWidget.widget.widgetIndex===i){
          dc.data.favDetailCtx.widgets[i].isApplyCompare = false;
          dc.data.favDetailCtx.widgets[i].isTrendCompare = false;
          dc.data.favDetailCtx.widgets[i].trendList = null;
          dc.data.favDetailCtx.widgets[i].disableCompare = false;
          dc.data.favDetailCtx.widgets[i].compareData = null;
          dc.data.favDetailCtx.widgets[i].isCompareData = false;
          me.widgetWiseCompare =true;
          dc.data.favDetailCtx.widgets[i].compareZoomInfo=null;
          dc.selectedWidget.widget.isApplyCompare = false;
          dc.compareSnapShot = null;
         me.compareDataService.snapshotsList.compareData =null;
         me.compareDataService.setSnapshotsList(me.compareDataService.snapshotsList);
          me.compareDataService.applyGlobalCompareFlag =false;
          me.compareDataService.widgetWiseCompareFlag =false;
          dc.renderCompareData(null,me.widgetWiseCompare ,dc.selectedWidget.widget.widgetIndex);
          break;
          }
        }
      }
      else{
        me.widgetWiseCompare =false;
        for (let i = 0; i < dc.data.favDetailCtx.widgets.length; i++) {
          dc.data.favDetailCtx.widgets[i].isApplyCompare = false;
          dc.data.favDetailCtx.widgets[i].isTrendCompare = false;
          dc.data.favDetailCtx.widgets[i].trendList = null;
          dc.data.favDetailCtx.widgets[i].compareZoomInfo=null;
          dc.data.favDetailCtx.widgets[i].compareData = null;
          dc.data.favDetailCtx.widgets[i].isCompareData = false;
        }
        dc.compareSnapShot = null;
        dc.renderCompareData(null, null,null);
        me.compareDataService.snapshotsList =null;
        me.compareDataService.widgetWiseCompareFlag =false;
        me.compareDataService.applyGlobalCompareFlag =false;
      }
      
      me.confirmCompare = false;
      me.applyCompare = false;
      me.confirmDisableCompare = true;
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Compare is disabled successfully' });
     this.cd.detectChanges();
    });
  }

  closeDialog() {
    this.visible = false;
  }

  /**
     * This method is called when we delete snapshot from Measurement set.
   */
  deleteSnapShotFromList(drop) {
    let me = this;
    if(drop.selectedOption.label ===null ||drop.selectedOption.label==="" ||drop.selectedOption.label ===undefined){
      return;
    }
    else{
    me.confirmSnapshotDialogVisible=true;
    this.confirmation.confirm({
      header :'Delete Measurement Set',
      message:'Do you want to delete measurement?',
      key:"confirm-snapShot",
      accept: () => {
        me.deleteSnapShotData(drop); this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Measurement deleted successfully' });
      },
      reject: () => {return;
      }
    });
  }
  }


  deleteSnapShotData(drop){
    let me=this;
    for (let k = 0; k < me.data.snapshots.length; k++) {
      if (drop.selectedOption.label === me.data.snapshots[k].label) {
        me.snapshots.snapshopIndex = k;
        me.snapshots.snapShotName = me.selectedSnap;
        break;
      }
    }
    me.deleteSnapshot = true;
    me.deleteSnapshots(me.snapshots.snapshopIndex, me.snapshots.snapShotName, me.snapshots.trendCompare);
    drop.options = me.data.snapshotsData;
    if (me.data.snapshotsData.length === 0) {
      me.snapshots.compareData = [];
      me.snapshots.compareData.splice(0, 0, me.measurement);
    }
    else if (me.data.snapshotsData[0].compareData.length !== 0) {
      me.snapshots.compareData = me.data.snapshotsData[0].compareData;
    }
    else {
      me.snapshots.compareData = [];
      me.snapshots.compareData.splice(0, 0, me.measurement);
    }
  }

  /**
     * This method is called when we delete snapshot from Server.
   */
  deleteSnapshots(index, snapName, trendMode) {
    let me = this;
    me.snapshots.trendCompare = trendMode;
    me.snapshots.snapshopIndex = index;
    me.snapshots.snapShotName = snapName;
    me.snapshots.opType = "delete";
    me.data.snapshots.splice(me.snapshots.snapshopIndex, 1);
    me.data.snapshotsData.splice(me.snapshots.snapshopIndex, 1);
    for (let i = 0; i < me.snapshots.compareData.length; i++) {
      me.snapshots.compareData.splice(i, 1);
    }
    sessionStorage.setItem('afterDeleteLabel', JSON.stringify(me.data.snapshots));
    sessionStorage.setItem('afterDeleteValue', JSON.stringify(me.data.snapshotsData));
    me.compareDataService.load(me.snapshots).subscribe(
      (state: Store.State) => {
        if (state instanceof CompareDataLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof CompareDataLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: CompareDataLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  /**
     * This method is called when we deal with Time Back feature.
   */
  timeBackCall() {
    let me = this;
    me.timeBckCall = true;
    const output = new Subject<TimebarValue>();
    // if(me.timeBack===null){
    //   me.confirmSnapshotDialogVisible=true;
    // this.confirmation.confirm({
    //   message: 'Please select timeBack, it can not be null or empty',
    //   key:"confirm-snapShot",
    //   accept: () => {
    //     return
    //   },
    //  rejectVisible:false
    // });
    // }
    me.timebarService.setTimeBck(me.timeBack);
    me.timebarService.setTimeBckDetail(ObjectUtility.duplicate(me.snapshots.compareData[me.snapshots.compareData.length - 1]));
    me.timebarService.setTimeBckFlag(me.timeBckCall);
    if (me.tmpValue.timePeriod.selected.label === "Hour Back" || me.tmpValue.timePeriod.selected.label === "Day Back" || me.tmpValue.timePeriod.selected.label === "Month Back" || me.tmpValue.timePeriod.selected.label === "Week Back") {
      if (me.timeBack === 1 || me.timeBack === "") {
        me.baselineName = me.tmpValueForBaseline.timePeriod.selected.label + " - " + me.timeBack + " " + me.tmpValue.timePeriod.selected.label;
      }
      else {
        me.baselineName = me.snapshots.compareData[me.snapshots.compareData.length - 1].presetlabel + " - " + me.timeBack + " " + me.tmpValue.timePeriod.selected.label;
      }
    }
    else {
      me.baselineName = me.tmpValue.timePeriod.selected.label;
    }
    me.timebarService.loadTime(me.tmpValue.timePeriod.selected.id).subscribe((state: Store.State) => {
      if (state instanceof GlobalTimebarTimeLoadedState) {
        me.tmpValue.time = {
          min: {
            raw: null,
            value: state.data[0]
          },
          max: {
            raw: null,
            value: state.data[2]
          },
          frameStart: {
            raw: null,
            value: state.data[1]
          },
          frameEnd: {
            raw: null,
            value: state.data[2]
          }
        };

        setTimeout(() => {
          output.next(me.tmpValue);
        });
      }
    },
      () => {
        setTimeout(() => {
          output.next(me.tmpValue);
        });
      });
    me.cd.detectChanges();
  }

  getPreset() {
    let me = this;
    me.preset = false;
  }
  toggle(tmpValue1: TimebarValue) {
    let me = this;
    if (tmpValue1 !== null || tmpValue1 !== undefined) {
      if (tmpValue1.timePeriod.previous.id === tmpValue1.timePeriod.selected.id) {
        me.testToggle = false;
      }
      else {
        me.testToggle = true;
      }
    }
    else {
      me.testToggle = false;
    }
  }

  /**
     * This method is called when user click on apply on all widget.
   */
  applyAllWidget(applyAllWidget) {
    let me = this;
    if(!applyAllWidget){
      me.widgetWiseCompare= true;
    }
    else{
      me.widgetWiseCompare=false;
    }
    // if (!applyAllWidget) {
    //   me.confirmMeasurementDialogVisible = true;
    //   this.confirmation.confirm({
    //     key: 'confirm-measurement',
    //     message: 'If you want to apply compare on all widget ,Please enable applyAllWidget',
    //     accept: () => { },
    //   });
    // }
  }
  /* checks if selected measurement name already exist in table or not */
  mesMentNameChk = function () {
    try {
      let me = this;
      me.validate = true;
      for (let i = 0; i < me.snapshots.compareData.length; i++) {
        if (me.snapshots.compareData[i]['preset'].startsWith('TB')) {
          me.validate = true;
        }
        else if (me.snapshots.compareData[i]['name'] === me.tmpMeasurement.name || me.snapshots.compareData[i]['presetlabel'] === me.tmpMeasurement.presetlabel) {
          this.baselineName = '';
          me.validate = false;
        }
     

      }
      return me.validate;
    } catch (error) {
    }
  };

  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;
  }

}
