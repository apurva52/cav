import { Component, OnInit, ViewChild, Input, ViewEncapsulation } from '@angular/core';
import { Dialog, SelectItem } from 'primeng';
import { FormBuilder } from '@angular/forms';
import { DashboardWidgetTypeService } from './service/dashboard-widget-service/dashboard-widget-type.service';
import { Store } from 'src/app/core/store/store';
import { merge } from 'rxjs';
import {
  WidgetTypeLoadedState,
  GraphTypeLoadedState,
  ChartTypeLoadedState,
  DataFieldLoadedState,
  TableTypeLoadedState,
  FormulaTypeLoadedState,
  SelectFieldLoadedState,
  LegendPositionLoadedState,
  SeverityOperatorLoadedState,
  HealthSeverityOperatorLoadedState,
  HealthSeverityOptionsLoadedState,
  WidgetDrillDownOptionLoadedState,
  CampareTrendsOptionsLoadedState,
  FontFamilyLoadedState,
  FontSizeLoadedState,
  EnablePanelSelectedValueLoadedState,
  EPSelectedValueBasedOnLoadedState,
  EnableGraphSelectedValueLoadedState,
  EnableGraphSelectGraphLoadedState,
  DataSourceLoadedState,
  EnvironmentTypeLoadedState,
  IndexPatternLoadedState,
  QueryTypeLoadedState,
  GridLineWidthValueLoadedState
} from './service/dashboard-widget-service/select-item.state';
import { WedgetSettingData } from './service/widget-setting.model';
import { WIDGET_SETTING_DATA } from './service/widget-setting.dummy';
import { DashboardWidgetComponent } from '../dashboard/widget/dashboard-widget.component';

@Component({
  selector: 'app-widget-setting',
  templateUrl: './widget-setting.component.html',
  styleUrls: ['./widget-setting.component.scss'],
  encapsulation: ViewEncapsulation.None
})


export class WidgetSettingComponent implements OnInit {
  data: WedgetSettingData;
  error: boolean;
  loading: boolean;
  displayNameInput: string;
  showValuesFilter: string;
  showHideLegend: boolean;
  isVisible: boolean = false;
  enableShiftDataBackBy: boolean;
  enableCaption: boolean = true;
  showHideMonochromColor: boolean = false;
  enableDrillDown: boolean = true;
  enableTrends: boolean = true;
  enableGraphFilter: boolean = true;
  showGraphSampleFilter: boolean = false;
  enableCriticalThresholdInput: boolean = true;
  enableMajorThresholdInput: boolean = true;
  criticalSeverityOptions: boolean = true;
  majorSeverityOptions: boolean = true;
  widget: DashboardWidgetComponent;

  //delay time
  selectedPanelTimeDelay: number = 0;
  userInputValueTimeDelay: string = '00:00:00';
  hourTimeDelay: number = 0;
  minTimeDelay: number = 0;
  secTimeDelay: number = 0;
  maxLimitForTimeDelay : number = 0;

  // Dummy data
  disabled: boolean = true;
  displayBasic2: boolean;
  val1: string;
  iconColor: string = '#1976D2';
  labelColor: string = '#ff9f1c';
  valueColor: string = '#ff4646';
  bgColor: string = '#a7eb62';
  MonochromColor: string = '#4dccbd';

  // widget setting: FormGroup;
  dataSourceOption: SelectItem[];
  @Input() dataSourceType: string;

  widgetTypeData: SelectItem[];
  @Input() widgetType: string;

  graphTypeData: SelectItem[];
  @Input() graphType: string;

  chartTypeData: SelectItem[];
  @Input() chartType: string;

  dataFieldType: SelectItem[];
  @Input() dataFieldOptions: string;

  tabulardataFieldType: SelectItem[];
  @Input() tabulardataFielOptions: string;

  tableTypeData: SelectItem[];
  @Input() tableTypeOptions: string;

  formulaTypeData: SelectItem[];
  @Input() formulaType: string;

  evironmentTypeOption: SelectItem[];
  @Input() evironmentType: string;

  indexPatternData: SelectItem[];
  @Input() indexPatternType: string;

  queryTypeOption: SelectItem[];
  @Input() queryType: string;

  selectFieldData: SelectItem[];
  @Input() selectField: string;

  legendPositionOptions: SelectItem[];
  @Input() legendOptions: string;

  criticalSeverityOperator: SelectItem[];
  @Input() criticalSeverityCondiations: string;

  majorSeverityOperator: SelectItem[];
  @Input() majorSeverityCondiations: string;

  criticalhealthSeverityOptions: SelectItem[];
  @Input() criticalSeverityOption: string;

  majorhealthSeverityOptions: SelectItem[];
  @Input() majorSeverityOption: string;

  criticalhealthSeverityOperators: SelectItem[];
  @Input() criticalSeverityOperators: string;

  majorhealthSeverityOperators: SelectItem[];
  @Input() majorSeverityOperators: string;

  widgetDrillData: SelectItem[];
  @Input() widgetDrillOptions: string;

  compareTrendOptions: SelectItem[];
  @Input() trendsOption: string;

  statusFontFamily: SelectItem[];
  @Input() statusFontOptions: string;

  statusFontSize: SelectItem[];
  @Input() statusFontSizeOptions: string;

  valueFontFamily: SelectItem[];
  @Input() valueFontOptions: string;

  valueFontSize: SelectItem[];
  @Input() valueFontSizeOptions: string;

  titleFontFamily: SelectItem[];
  @Input() titleFontOptions: string;

  titleFontSize: SelectItem[];
  @Input() titleFontSizeOptions: string;

  displayFontFamily: SelectItem[];
  @Input() dispalyFontOptions: string;

  displayFontSize: SelectItem[];
  @Input() displayFontSizeOptions: string;

  epSelectedValueData: SelectItem[];
  @Input() epSelectedValueOptions: string;

  epSelectedBasedOnData: SelectItem[];
  @Input() epSelectedBasedOnOptions: string;

  egSelectedValueData: SelectItem[];
  @Input() egSelectedValueOptions: string;

  egSlectedGraphData: SelectItem[];
  @Input() egSlectedGraphOptions: string;

  gridLineWidthData: SelectItem[];
  @Input() gridLineWidthOptions: string;

  @ViewChild('dialog', { read: Dialog }) dialog: Dialog;

  constructor(
    private fb: FormBuilder,
    private dashboardWidgetTypeService: DashboardWidgetTypeService
  ) {
    const me = this;
    me.widgetType = 'graph';
  }

  ngOnInit(): void {
    const me = this;
    me.load();
    me.data = WIDGET_SETTING_DATA;

    // if(widget.selectedPanelTimeDelay != -1){
    //   this.selectedPanelTimeDelay = panelData.selectedPanelTimeDelay;
    //   }

    //   let maxLimitDelayTime = this._dataService.getDashboardConfigData().wDConfigurationDTO['maxLimitForTimeDelay'];
    //   if (maxLimitDelayTime > 0) {
    //     this.maxLimitForTimeDelay  = maxLimitDelayTime;
    //   }
    // console.log("selectedPanelTimeDelay",this.selectedPanelTimeDelay);
    // if(this.selectedPanelTimeDelay < 0 || this.selectedPanelTimeDelay > this.maxLimitForTimeDelay ){

    //   this._modelService.showAlert('Delay time value should be greater than 0 and less than max Limit provided by user. By default, it is 1440. ','Widget Settings','OK');
    //   return;
    // }

    // if( Number.isInteger(this.selectedPanelTimeDelay) == false){

    //   this._modelService.showAlert('Delay time value should not be in decimals ','Widget Settings','OK');
    //   return;
    // }
  }
  validateDelayTime() {
    if (this.checkVar_Null_Undefined_Empty(this.selectedPanelTimeDelay) || this.validateDateTimeByRegexExp(this.selectedPanelTimeDelay)) {
        let msg = 'Please enter delay time in HH:mm:ss format and should be numeric';
        alert(msg);
        return;

    }
  }

  checkVar_Null_Undefined_Empty(value) {
    if (value === undefined || value === null || value === 'null' || value === '' || value === ' ') {
        return true;
    } else {
        return false;
    }
}

/** validating input values with regex  */
validateDateTimeByRegexExp(value) {
  if (( /[A-Za-z-!$%^&*()+|~=`{}<>?,@#]/g.test(value))) {
   return true;
 }
return false;
}


saveWidgetSettings(){
  this.isVisible = false;
  console.log("widgetType------>",this.widgetType);
  this.widget.widget.settings.types.graph.selectedWidgetTimeDelay = this.selectedPanelTimeDelay * 60 * 1000;
}
  load() {
    const me = this;
    merge(
      me.dashboardWidgetTypeService.loadDataSource(),
      me.dashboardWidgetTypeService.loadWidgetType(),
      me.dashboardWidgetTypeService.loadGraphType(),
      me.dashboardWidgetTypeService.loadChartType(),
      me.dashboardWidgetTypeService.loadDataFieldType(),
      me.dashboardWidgetTypeService.loadTableType(),
      me.dashboardWidgetTypeService.loadFormulaType(),
      me.dashboardWidgetTypeService.loadEnvironmentType(),
      me.dashboardWidgetTypeService.loadIndexPattern(),
      me.dashboardWidgetTypeService.loadQueryType(),
      me.dashboardWidgetTypeService.loadSelectField(),
      me.dashboardWidgetTypeService.loadLegendPositionOptions(),
      me.dashboardWidgetTypeService.loadSeverityOptions(),
      me.dashboardWidgetTypeService.loadHelathSeverityOptions(),
      me.dashboardWidgetTypeService.loadHelathSeverityOpertaors(),
      me.dashboardWidgetTypeService.loadWidgetDrillDownOption(),
      me.dashboardWidgetTypeService.loadCompareTrendsOptions(),
      me.dashboardWidgetTypeService.loadFontFamily(),
      me.dashboardWidgetTypeService.loadFontSize(),
      me.dashboardWidgetTypeService.loadEnablePanelSelectedValue(),
      me.dashboardWidgetTypeService.loadEPSelectedValueBasedOn(),
      me.dashboardWidgetTypeService.loadEnableGraphSelectedValue(),
      me.dashboardWidgetTypeService.loadEGSelectGraphData(),
      me.dashboardWidgetTypeService.loadGridLineWidthValue()

    ).subscribe((state: Store.State) => {
      if (state instanceof DataSourceLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof WidgetTypeLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof GraphTypeLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof ChartTypeLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof DataFieldLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof TableTypeLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof FormulaTypeLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof SelectFieldLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof EnvironmentTypeLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof IndexPatternLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof QueryTypeLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof LegendPositionLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof SeverityOperatorLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof HealthSeverityOptionsLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof HealthSeverityOperatorLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof WidgetDrillDownOptionLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof CampareTrendsOptionsLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof FontFamilyLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof FontSizeLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof EnablePanelSelectedValueLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof EPSelectedValueBasedOnLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof EnableGraphSelectedValueLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof EnableGraphSelectGraphLoadedState) {
        me.onLoaded(state);
        return;
      }
      if (state instanceof GridLineWidthValueLoadedState) {
        me.onLoaded(state);
        return;
      }
    });
  }

  private onLoaded(state: Store.State) {
    const me = this;

    if (state instanceof DataSourceLoadedState) {
      me.dataSourceOption = state.data;
    }
    if (state instanceof WidgetTypeLoadedState) {
      me.widgetTypeData = state.data;
    }
    if (state instanceof GraphTypeLoadedState) {
      me.graphTypeData = state.data;
    }
    if (state instanceof ChartTypeLoadedState) {
      me.chartTypeData = state.data;
    }
    if (state instanceof DataFieldLoadedState) {
      me.dataFieldType = state.data;
      me.tabulardataFieldType = state.data;
    }
    if (state instanceof TableTypeLoadedState) {
      me.tableTypeData = state.data;
    }
    if (state instanceof FormulaTypeLoadedState) {
      me.formulaTypeData = state.data;
    }
    if (state instanceof SelectFieldLoadedState) {
      me.selectFieldData = state.data;
    }
    if (state instanceof EnvironmentTypeLoadedState) {
      me.evironmentTypeOption = state.data;
    }
    if (state instanceof IndexPatternLoadedState) {
      me.indexPatternData = state.data;
    }
    if (state instanceof QueryTypeLoadedState) {
      me.queryTypeOption = state.data;
    }
    if (state instanceof LegendPositionLoadedState) {
      me.legendPositionOptions = state.data;
    }
    if (state instanceof SeverityOperatorLoadedState) {
      me.criticalSeverityOperator = state.data;
      me.majorSeverityOperator = state.data;
    }
    if (state instanceof HealthSeverityOptionsLoadedState) {
      me.criticalhealthSeverityOptions = state.data;
      me.majorhealthSeverityOptions = state.data;
    }
    if (state instanceof HealthSeverityOperatorLoadedState) {
      me.criticalhealthSeverityOperators = state.data;
      me.majorhealthSeverityOperators = state.data;
    }
    if (state instanceof WidgetDrillDownOptionLoadedState) {
      me.widgetDrillData = state.data;
    }
    if (state instanceof CampareTrendsOptionsLoadedState) {
      me.compareTrendOptions = state.data;
    }
    if (state instanceof FontFamilyLoadedState) {
      me.statusFontFamily = state.data;
      me.valueFontFamily = state.data;
      me.titleFontFamily = state.data;
      me.displayFontFamily = state.data;
    }
    if (state instanceof FontSizeLoadedState) {
      me.statusFontSize = state.data;
      me.valueFontSize = state.data;
      me.titleFontSize = state.data;
      me.displayFontSize = state.data;
    }
    if (state instanceof EnablePanelSelectedValueLoadedState) {
      me.epSelectedValueData = state.data;
    }
    if (state instanceof EPSelectedValueBasedOnLoadedState) {
      me.epSelectedBasedOnData = state.data;
    }
    if (state instanceof EnableGraphSelectedValueLoadedState) {
      me.egSelectedValueData = state.data;
    }
    if (state instanceof EnableGraphSelectGraphLoadedState) {
      me.egSlectedGraphData = state.data;
    }
    if (state instanceof GridLineWidthValueLoadedState) {
      me.gridLineWidthData = state.data;
    }
    me.error = true;
    me.loading = true;
  }

  // Form Modal open
  open(widget) {
    const me = this;
    me.widget = widget;
    me.isVisible = true;
  }

  // Form Modal Close
  showBasicDialog2() {
    this.displayBasic2 = true;
  }

  showDataWidgetTypeFields() {
    const me = this;
    if (me.widgetType === 'data') {
      me.displayNameInput = 'Minimum';
    }
  }

  changeLegendPosition() {
    const me = this;
    me.showHideLegend = !this.showHideLegend;
  }

  enablePanelFilterOptions() {
    const me = this;
    me.enableGraphFilter = !this.enableGraphFilter;
  }

  enableGraphFilterOptions() {
    const me = this;
    me.showGraphSampleFilter = !this.showGraphSampleFilter;
  }

  enableCaptionField() {
    const me = this;
    me.enableCaption = !this.enableCaption;
  }

  showMonochromColorPicker() {
    const me = this;
    me.showHideMonochromColor = !this.showHideMonochromColor;
  }

  enableDrillDownOption() {
    const me = this;
    me.enableDrillDown = !this.enableDrillDown;
  }

  enableTrendOptions() {
    const me = this;
    me.enableTrends = !this.enableTrends;
  }

  enableCriticalThreshold() {
    const me = this;
    me.enableCriticalThresholdInput = !this.enableCriticalThresholdInput;
  }

  enableMajorThreshold() {
    const me = this;
    me.enableMajorThresholdInput = !this.enableMajorThresholdInput;
  }

  enableCritSeverity() {
    const me = this;
    me.criticalSeverityOptions = !this.criticalSeverityOptions;
  }

  enableMjrSeverity() {
    const me = this;
    me.majorSeverityOptions = !this.majorSeverityOptions;
  }
}
