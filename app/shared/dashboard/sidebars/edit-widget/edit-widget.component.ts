import { ChangeDetectorRef, Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { ConfirmationService, MenuItem, Message, MessageService, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { DashboardComponent } from '../../dashboard.component';
import { CONTENT, FILTER_TABLE, monoChromaticColorList, WIDGET_SETTING_DROPDOWN_DATA } from './service/filter-table.dummy';
import { FilterHeaderCols, FilterTable, WidgetSettingsDropDownData } from './service/filter-table.model';
import { DashboardWidgetComponent } from 'src/app/shared/dashboard/widget/dashboard-widget.component';
import {
  DashboardWidget, DashboardWidgetTypeDataConfig, DashboardWidgetTypeGraphConfig, DashboardWidgetTypeTableColumnDef,
  DashboardWidgetTypeTableConfig, DashboardWidgetTypeTextConfig, GraphSampleFilterDTO, HealthWidgetRuleInfo, HealthWidgetSeverityDef
} from '../../service/dashboard.model';
import { ChartType } from '../../widget/constants/chart-type.enum';
import { WidgetTypeValue } from '../../widget/constants/widget-type.enum';
import { GraphTypeValue } from '../../widget/constants/graph-type.enum';
import { WidgetSettingService } from './service/widget-settings.service';
import { DashboardWidgetTypeSystemHealthConfig, DashboardWidgetFilterConfig } from './../../service/dashboard.model';
import { MenuService } from '../../menu.service';
import { WidgetMenuService } from './../../widget/widget-menu/service/widget-menu.service';
import { WIDGET_SETTINGS } from 'src/app/shared/actions.constants';
import { ActionInfo } from '../../widget/widget-menu/service/widget-menu.model';
import { InfoData } from 'src/app/shared/dialogs/informative-dialog/service/info.model';
import { DialogsService } from 'src/app/shared/dialogs/dialogs.service';
import { Subscription } from 'rxjs';
import { WINDOW_TYPE } from 'src/app/pages/my-library/alert/alert-rules/alert-configuration/service/alert-config.dummy';
import { SessionService } from 'src/app/core/session/session.service';

@Component({
  selector: 'app-edit-widget',
  templateUrl: './edit-widget.component.html',
  styleUrls: ['./edit-widget.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService]
})

export class EditWidgetComponent implements OnInit {

  @Input() dashboard: DashboardComponent;
  widget: DashboardWidget;
  @Input() widgetC: DashboardWidgetComponent;
  content: InfoData;
  dropDownData: WidgetSettingsDropDownData;
  data: FilterTable;
  error: AppError;
  loading: boolean;
  empty: boolean;
  emptyTable: boolean;
  totalRecords: number;
  cols: FilterHeaderCols[] = [];
  _selectedColumns: FilterHeaderCols[] = [];

  //bgColor: string = '#a7eb62';
  bgColor: string = '#FFFFFF';
  selectedValues: string;
  showLegend: Boolean;
  val2: string = 'daily';
  val1: string = 'positive';
  RedColor: string = '#ec5a5a';
  GreenColor: string = '#92f08e';
  BlueColor: string = '#9ab8ea';
  YellowColor: string = '#f6f07c';
  //fontColor: string = '#f6f07c';
  fontColor: string = '#333333';
  iconColor: string = '#333333';
  backgroundColor: string = '#FFFFFF'
  valueLabelOptions: MenuItem[];
  selectedLabel: MenuItem;
  decimalOptions: MenuItem[];
  selectedDecimal: MenuItem;
  nfQuery:string = 'index=* query=*';
  selectedDataSourceType: string = 'metric';
  selectedWidgetType: string = 'graph';
  selectedGraphType: string = 'normal_graph';
  selectedChartType: string = 'line';
  selectedDataFieldType: string = 'min';
  selectedTableFieldType: string[] = ["avg"];
  selectedTableType: string = 'graph_stats_based';
  selectedFormulaType: string[] = ['average'];
  selectedEnvironmentType: string;
  selectedIndexPatternType: string;
  selectedQueryType: string;
  selectedFieldType: string;
  selectedLegendType: string = 'center';
  selectedCriticalSeverityType: string = 'Select operator';
  selectedGeoMapValueType : string = '0';
  selectedGeoMapColorBandType : string = '0';
  selectedMajorSeverityType: string = 'Select operator';
  selectedcriticalHealthType: string;
  selectedMajorHealthType: string;
  selectedCriticalHealthType: string = 'Select operator';
  selectedMajorHealthOperatorType: string;
  selectedWidgetDrillData: string;
  selectedTrendType: string;
  selectedStatusFontFamily: string;
  selectedStatusFontSize: string;
  selectedValueFontFamily: string;
  selectedValueFontSize: string;
  selectedTitleFontFamily: string;
  selectedTitleFontSize: string;
  selectedDispalyFontFamily: string;
  selectedDisplayFontSize: string;
  selectedcolorid = 1;
  //graph filters
  operatersData: SelectItem[];
  operater: string = '=';
  operaterValue1: number = 0;
  operaterValue2: number = 0;
  selectedFilter: string = 'Non-Zero';
  filterBy: string = 'Avg';
  isInclude: boolean = true;
  filterByData: SelectItem[];
  criteriaData: SelectItem[];
  selectedcriteria: string;

  //sample filters
  filterType: string = '>=';
  filterBasedOn: string;
  filterValue2: number = 0;
  filterValue1: number = 0;

  //severity definitions for data/heath widget
  selectedCriticalOperatorType: string = 'Select operator';
  selectedMajorOperatorType: string = 'Select operator';
  criticalThreshold: number = null;
  majorThreshold: number = null;
  selectedFavForDrillDown: string;
  drillDownOptions: SelectItem[];
  primaryYAxisLabel: string;
  secondaryYAxisLabel: string;
  widgetIndex: number = 0;
  currentWidgetType: string;

  //dial/meter properties
  minDialValue: number = 0;
  maxDialValue: number = 100;
  selectedDialOperator: string;
  warningDialValue: number = 30;
  dialExpression: string;
  criticalDialValue: number = 70;
  maxChartsDialValue: number;
  healthCriticalPct: number;
  favPathArr: string[] = [];
  criticalAnotherPct: number;
  criticalAnotherSeverity: string;
  majorPct: any;
  majorSeverity: string;
  majorCondition: string;
  majorAnotherPct: any;
  majorAnotherSeverity: string;
  showSecdCondForCritical: boolean;
  showSecdCondForMajor: boolean;
  criticalOperator: boolean;
  majorOperator: boolean;
  criticalPct: number;
  captionMessage: string;
  captionError: boolean;
  captionEmpty: string = '';

  enableFilter: boolean = false;
  editCaption: boolean = false;
  isWidgetDrillDown: boolean = false;
  valueType: string;
  enableSampleFilter: boolean;
  enableGraphSampleFilter: string[] = [];
  dataDisplayName: string = 'Minimum';
  showNameOnTop: boolean = false;
  showMetric:boolean =false;
  labelField: string = '';
  selectedPanelTimeDelay: number;
  delayTime: number = 0;
  prefix: string = '';
  suffix: string = '';
  drillDownLevel: string = '0';
  disableParameterization: boolean = false;
  panelCaption: string = '';
  isCompareWith: boolean = false;
  selectedCompareTrend: string = 'fixed_trends';
  fixedTrendCritical: string = '0';
  fixedTrendMajor: string = '0';
  fixedTrendMinor: string = '0';
  hideXAxis: boolean = false;
  hideYAxis: boolean = false;
  isBold: boolean = true;
  isItalic: boolean = false;
  isUnderline: boolean = false;
  isUnderlineCaption :boolean =false;
  isBoldCaption: boolean = true;
  isItalicCaption: boolean = false;
  selectedFontFamily: string = "Poppins,sans-serif";
  selectedFontSize: string = '8';
  selectedGridLineWidth: string = '2';
  isMonochromatic: boolean = false;
  monochromaticColor: string = '';
  fontcolor: string = '';
  monoChromaticColor = [];
  // iconColor: string = '';
  // backgroundColor: string = '';
  isShowRankScore: boolean = false;
  isLabelBgColor: boolean = false;
  labelBgColor: string = '#92f08e';
  showDataValue: boolean =false;
  selectedBasedOn: string = '90';
  showfilterTable: boolean;
  selectedGraphForFilter: string = '';
  sampleFilterBy: string;
  criteriaSampleData: string = 'Include';
  dataBackGroundColor : boolean = false;
  isDualGraph: boolean = false;
  rejectVisible : boolean = false;
  errorMessage : string =null;
  tableMessage : string = null;
  dialOperatorerror : string = null;
  selectedTab:number =0;
  colorList: [
    ["#5c0202", "#850505", "#a90606", "#ce0707", "#e27474", "#e45959", "#e63f3f", "#e92828", "#ef0505"],
    ["#122501", "#1c3b01", "#2a5802", "#387603", "#458f04", "#5cc005", "#71e909", "#81c784", "#8de73f"],
    ["#263238", "#37474f", "#455a64", "#607d8b", "#90a4ae", "#b0bec5", "#b0bec5", "#bdbdbd", "#cfd8dc"],
    ["#02a2f9", "#1565c0", "#1a237e", "#3178ef", "#3f51b5", "#67cbbf", "#9fa8da", "#b3e5df", "#b3e5fc"]
  ];

  formulaTypeDataOptions?: SelectItem[];
  private widgetSelectionSubscription: Subscription;

  constructor(
    private widgetSettingsService: WidgetSettingService,
    private menuService: MenuService,
    private widgetMenuService: WidgetMenuService,
    private cd: ChangeDetectorRef,
    private dialogService: DialogsService,
    private messageService: MessageService,
    private sessionService: SessionService
  ) {
    const me = this;
  }

  closeClick() {
    const me = this;
    me.menuService.closeSidePanel(true);
  }

  setInitialValues() {
    const me = this;
    me.setInitialValuesForChartTab();
    me.setInitialValuesForAdvanceTab();
    me.setInitialValuesForFilterTab();
    if(me.selectedWidgetType == WidgetTypeValue.GRAPH_WIDGET && me.selectedGraphType!= 'slab_count_graph'){
    me.changeGraphType(me.selectedGraphType  , false);
    }

  }
  changeDataSourceType(selectedDataSourceType) {
    const me = this;
    me.widgetC.widget.settings.dataSourceType = selectedDataSourceType.toUpperCase();
    me.selectedGraphType = 'normal_graph';
  }

  onChangeDataFieldName(selectedDataFieldType){
    let me =this;
    //me.widgetC.widget.settings.types.data.dataAttrName =selectedDataFieldType;
    //me.widgetC.widget.settings.types.data.dataDisplayName = me.widgetC.widget.settings.types.data.dataAttrName;
    // me.setInitialValuesForChartTab();
    //me.dataDisplayName = selectedDataFieldType;
    for(let i=0;i<me.dropDownData.dataFieldOptions.length;i++){
      if(me.dropDownData.dataFieldOptions[i].value ==selectedDataFieldType){
        me.dataDisplayName =me.dropDownData.dataFieldOptions[i].label;
        break;
      }
    }
    this.cd.detectChanges();

  }

  setInitialValuesForChartTab() {
    try {
      const me = this;
      //configurations
      me.selectedDataSourceType = me.widgetC.widget.settings.dataSourceType.toLowerCase();
      me.selectedWidgetType = me.widgetSettingsService.giveSelectedTypeWidget(me.widgetC.widget.type);

      //nf logs
      if (me.selectedDataSourceType == 'log') {
        const indexPattern = 'index=' + me.widgetC.widget.settings.nfIndexPattern || '*';
        const query = ' query=' + me.widgetC.widget.settings.nfWidgetQuery || '*';
        me.nfQuery = indexPattern + query;
      }

      //graphwidget
      if (me.selectedWidgetType == WidgetTypeValue.GRAPH_WIDGET) {
        me.selectedGraphType = me.widgetSettingsService.getGraphTypeBasedOnChartId(me.widgetC.widget.settings.chartType);
        me.selectedChartType = me.widgetSettingsService.getChartTypeBasedOnChartId(me.widgetC.widget.settings.chartType);

        me.formulaTypeDataOptions = me.formulaTypeDataOptions.filter(type => type.label !== 'Sum');

        if(me.selectedChartType == 'dial' ||me.selectedChartType == 'meter' ) {
          me.formulaTypeDataOptions.push( {label: 'Sum', value: 'sum'});
        }
        me.selectedFormulaType = me.widgetSettingsService.getGraphStatsType(me.widgetC.widget.settings.graphStatsType);
        me.selectedLegendType = me.widgetC.widget.settings.types.graph.legendAlignmentOnWidget == "" ? 'center' : me.widgetC.widget.settings.types.graph.legendAlignmentOnWidget;
        me.showLegend = me.widgetC.widget.settings.types.graph.showLegendOnWidget;
        me.selectedBasedOn = me.widgetC.widget.settings.types.graph.pctOrSlabValue.toString();

        //Geo Map
        if (me.selectedChartType == 'geo_map') {
          let geoMap = me.widgetC.widget.settings.types.graph.geomap;
          let type = me.widgetC.widget.settings.types.graph.type;
          if(type == 16) {
            me.selectedGeoMapValueType = "0";
          }else if(type == 15) {
            me.selectedGeoMapValueType = "1";
          }else if(type == 67) {
            me.selectedGeoMapValueType = "2";
          }

          if(geoMap.redToGreen) {
            me.selectedGeoMapColorBandType = "1";
          }else {
            me.selectedGeoMapColorBandType = "0";

          }
        }
        //dial/meter chart
        if (me.selectedChartType == 'dial' || me.selectedChartType == 'meter') {
          let dialExp = me.widgetC.widget.settings.types.graph.dialMeterExp;
          if (dialExp) {
            let convertedDailExp = dialExp.split('_');
            me.minDialValue = parseInt(convertedDailExp[0]);
            me.maxDialValue = parseInt(convertedDailExp[1]);
            me.warningDialValue = parseInt(convertedDailExp[3]);
            me.criticalDialValue = parseInt(convertedDailExp[4]);
            me.selectedDialOperator = convertedDailExp[2];
          }
          me.maxChartsDialValue = 10;
        }
        if (
          me.selectedChartType == 'dual_axis_line' ||
          me.selectedChartType == 'dual_axis_bar_line' ||
          me.selectedChartType == 'dual_axis_area_line' ||
          me.selectedChartType == 'dual_axis_stacked_bar' &&me.widgetC.widget.dataCtx.gCtx.length>=2
        ) {

            me.primaryYAxisLabel=me.widgetC.widget.dataCtx.gCtx[0].measure.metric;

            me.secondaryYAxisLabel=me.widgetC.widget.dataCtx.gCtx[1].measure.metric;
        }
      }
      //data widget
      if (me.selectedWidgetType == WidgetTypeValue.DATA_WIDGET) {
        // if(me.dataDisplayName ==="Minimum" || me.dataDisplayName ==="Vector Count" ||me.dataDisplayName ==="Sample Count" ||me.dataDisplayName ==="Maximum" ||me.dataDisplayName ==="Average" ||me.dataDisplayName ==="Standard Deviation"||me.dataDisplayName ==="Last Sample"   && me.widgetC.widget.settings.types.data.dataDisplayName !==me.dataDisplayName){
        //   me.dataDisplayName = me.widgetC.widget.settings.types.data.dataDisplayName;
        //  }
        // if(me.dataDisplayName!==me.widgetC.widget.settings.types.data.dataDisplayName){
        //   me.widgetC.widget.settings.types.data.dataDisplayName= me.dataDisplayName ;
        // }
        me.dataDisplayName = me.widgetC.widget.settings.types.data.dataDisplayName;
        me.selectedDataFieldType = me.widgetSettingsService.getDataTypeBasedOnDataAttrName(me.widgetC.widget.settings.types.data.dataAttrName);
        if(me.widgetC.widget.settings.types.data.dataWidgetSeverityDefDTO){
          me.selectedCriticalOperatorType = me.widgetC.widget.settings.types.data.dataWidgetSeverityDefDTO.criticalMSRString;
          me.criticalThreshold = me.widgetC.widget.settings.types.data.dataWidgetSeverityDefDTO.criticalValue == -1 ? null : me.widgetC.widget.settings.types.data.dataWidgetSeverityDefDTO.criticalValue;
          me.selectedMajorOperatorType = me.widgetC.widget.settings.types.data.dataWidgetSeverityDefDTO.majorMSRString;
          me.majorThreshold = me.widgetC.widget.settings.types.data.dataWidgetSeverityDefDTO.majorValue == -1 ? null : me.widgetC.widget.settings.types.data.dataWidgetSeverityDefDTO.majorValue;
          me.dataBackGroundColor = me.widgetC.widget.settings.types.data.dataWidgetSeverityDefDTO.colorChecked;
        }
        else{
          me.selectedCriticalOperatorType = 'Select operator';
          me.selectedMajorSeverityType = 'Select operator';
          me.criticalThreshold = null;
          me.majorThreshold = null;
          me.dataBackGroundColor = false;
        }
        // console.log("dataFieldType === ", me.datafieldType);
        // for (let j = 0; j < me.dropDownData.dataFieldOptions.length; j++) {
        //   console.log("me.dropDownData.dataFieldOptions ==", me.dropDownData.dataFieldOptions[j]);
        //   console.log("dataFieldType == ", me.datafieldType);
        //   if (me.dropDownData.dataFieldOptions[j].label === me.datafieldType) {
        //     console.log("iffff ");
        //     me.selectedDataFieldType = me.dropDownData.dataFieldOptions[j].value;
        //   }
        // }
      }
      //tabular widget
      if (me.selectedWidgetType == WidgetTypeValue.TABULAR_WIDGET) {
        me.selectedTableType = me.widgetSettingsService.getTableType(me.widgetC.widget.settings.types.table.tableType);
        //me.selectedTableFieldType = ['avg'];
        me.selectedTableFieldType = me.widgetSettingsService.getSelectedTableFieldType(me.widgetC.widget.settings.types.table.cols);
        for (let i = 0; i < me.selectedTableFieldType.length; i++) {
          for (let j = 0; j < me.dropDownData.FieldDataOptions.length; j++) {
            if (me.dropDownData.FieldDataOptions[j].label === me.selectedTableFieldType[i])
              me.selectedTableFieldType.push(me.dropDownData.FieldDataOptions[j].value);
          }
        }
        console.log("selectedTableFieldType------>",this.selectedTableFieldType);
        me.isShowRankScore = false;
      }
      //health widget
      if (me.selectedWidgetType == WidgetTypeValue.HEALTH_WIDGET) {
        me.showNameOnTop = me.widgetC.widget.settings.types.systemHealth.isGraphNameOnTop;
        me.showMetric = me.widgetC.widget.settings.types.systemHealth.showMetric;
        me.selectedDataFieldType = me.widgetSettingsService.getDataTypeBasedOnDataAttrName(me.widgetC.widget.settings.types.systemHealth.dataAttrName);
        me.criticalThreshold = me.widgetSettingsService.getCriticalThresholdValues(me.widgetC.widget.settings.types.systemHealth.healthWidgetSeverityDef);
        me.majorThreshold = me.widgetSettingsService.getMajorThresholdValues(me.widgetC.widget.settings.types.systemHealth.healthWidgetSeverityDef);
        me.selectedCriticalOperatorType = me.widgetC.widget.settings.types.systemHealth.healthWidgetSeverityDef.criticalMSRString;
        me.selectedMajorOperatorType = me.widgetC.widget.settings.types.systemHealth.healthWidgetSeverityDef.majorMSRString;

        let healthWidgetRuleInfo = me.widgetC.widget.settings.types.systemHealth.healthWidgetRuleInfo;
        if (healthWidgetRuleInfo != null) {

          if (healthWidgetRuleInfo.criticalPct === -1)
            me.healthCriticalPct = null;
          else
            me.healthCriticalPct = healthWidgetRuleInfo.criticalPct;

          me.selectedCriticalSeverityType = healthWidgetRuleInfo.criticalSeverity;
          me.selectedCriticalHealthType = healthWidgetRuleInfo.criticalCondition == "" ? 'Select operator' : healthWidgetRuleInfo.criticalCondition;

          if (healthWidgetRuleInfo.criticalAnotherPct === -1 || healthWidgetRuleInfo.criticalAnotherPct == 0)
            me.criticalAnotherPct = null;
          else
            me.criticalAnotherPct = healthWidgetRuleInfo.criticalAnotherPct;

          me.criticalAnotherSeverity = healthWidgetRuleInfo.criticalAnotherSeverity;

          if (healthWidgetRuleInfo.majorPct === -1)
            me.majorPct = null;
          else
            me.majorPct = healthWidgetRuleInfo.majorPct;

            if(healthWidgetRuleInfo.criticalPct === -1)
            me.criticalPct = null;
            else
            me.criticalPct = healthWidgetRuleInfo.criticalPct;
          // me.percentageFirstForMajor = healthWidgetRuleInfo.majorPct;
          me.selectedMajorSeverityType = healthWidgetRuleInfo.majorSeverity == "" ? "Select operator" : healthWidgetRuleInfo.majorSeverity;
         me.selectedMajorHealthType = healthWidgetRuleInfo.majorCondition == "" ? "Select operator" : healthWidgetRuleInfo.majorCondition;
          if (healthWidgetRuleInfo.majorAnotherPct === -1 || healthWidgetRuleInfo.majorAnotherPct == 0) {
            me.majorAnotherPct = null;
          } else {
            me.majorAnotherPct = healthWidgetRuleInfo.majorAnotherPct;
          }
          //me.percentageSecondForMajor = healthWidgetRuleInfo.majorAnotherPct;
          me.majorAnotherSeverity = healthWidgetRuleInfo.majorAnotherSeverity;
          me.showSecdCondForCritical = healthWidgetRuleInfo.showSecdCondForCritical;
          me.showSecdCondForMajor = healthWidgetRuleInfo.showSecdCondForMajor;
          me.criticalOperator = healthWidgetRuleInfo.criticalOperator;
          me.majorOperator = healthWidgetRuleInfo.majorOperator;
          // me.isThresholdCritical = healthWidgetRuleInfo.isThresholdCritical; // abc
          // me.isThresholdMajor = healthWidgetRuleInfo.isThresholdMajor; // abc
         // me.criticalPct = healthWidgetRuleInfo.criticalPct;
          //me.majorPct = healthWidgetRuleInfo.majorPct;
        }

        /// Code not to remove, need to correct
        // if (me.selectedFirstCriticalSevType === 'Critical') {
        //   me.selectedSecondCriticalSevType = 'Major';
        // } else if (me.selectedFirstCriticalSevType === 'Major') {
        //   me.selectedSecondCriticalSevType = 'Critical';
        // }

        // if (me.statusFirstForMajor === 'Critical') {
        //   me.statusSecondForMajor = 'Major';
        // } else if (me.statusFirstForMajor === 'Major') {
        //   me.statusSecondForMajor = 'Critical';
        // }
      }
      //label widget
      if (me.selectedWidgetType == WidgetTypeValue.LABEL_WIDGET) {
        // me.isLabelBgColor = false;
        //me.labelBgColor = me.widgetC.widget.settings.types.text.bgColor;
        // if(me.labelField=== ""){
        me.labelField = me.widgetC.widget.settings.types.text.text;
        // }
        // else{
        //   me.widgetC.widget.settings.types.text.text=me.labelField;
        // }
      }


    } catch (error) {
      console.error("Error while setting initial values for chart Tab", error)
    }
  }

  changeChartType(selectedChartType){
    let me =this;
    me.selectedChartType =selectedChartType;
    if (
     selectedChartType == 'dual_axis_line' ||
     selectedChartType == 'dual_axis_bar_line' ||
      selectedChartType == 'dual_axis_area_line' ||
      selectedChartType == 'dual_axis_stacked_bar' &&me.widgetC.widget.dataCtx.gCtx.length>=2
    ) {

        me.primaryYAxisLabel=me.widgetC.widget.dataCtx.gCtx[0].measure.metric;

        me.secondaryYAxisLabel=me.widgetC.widget.dataCtx.gCtx[1].measure.metric;
    }

    me.formulaTypeDataOptions = me.formulaTypeDataOptions.filter(type => type.label !== 'Sum');

    if(selectedChartType == 'dial' || selectedChartType == 'meter' ) {

      me.formulaTypeDataOptions.push( {label: 'Sum', value: 'sum'});
    }

    let isAvailable = false;
    me.formulaTypeDataOptions.forEach(element =>{
      if(element.label == "Sum")
      {
        isAvailable = true;
      }
    });

    if(me.selectedFormulaType.includes("sum")  && !isAvailable) {
         me.selectedFormulaType = ['average'];
    }


  }
  setInitialValuesForAdvanceTab() {
    try {
      const me = this;
      if (me.selectedWidgetType == WidgetTypeValue.LABEL_WIDGET) {
        me.isUnderline = me.widgetC.widget.settings.types.text.underline == "underline" ? true : false;
        me.isItalic = me.widgetC.widget.settings.types.text.italic == "italic" ? true : false;
        me.isBold = me.widgetC.widget.settings.types.text.bold == "bold" ? true : false;
        me.backgroundColor = me.widgetC.widget.settings.types.text.bgColor == "transparent" ? "#FFFFFF" : me.widgetC.widget.settings.types.text.bgColor;
        me.iconColor = me.widgetC.widget.settings.types.text.iconColor == "" || me.widgetC.widget.settings.types.text.iconColor == undefined  ? '#333333' : me.widgetC.widget.settings.types.text.iconColor;
        me.fontColor = me.widgetC.widget.settings.types.text.fontColor == "" ? '#333333' : me.widgetC.widget.settings.types.text.fontColor;
        me.selectedFontFamily = me.widgetC.widget.settings.types.text.fontFamily;
        me.selectedFontSize = me.widgetC.widget.settings.types.text.fontSize;
      }
      else if (me.selectedWidgetType == WidgetTypeValue.TABULAR_WIDGET) {
        me.isUnderline = me.widgetC.widget.settings.types.table.underline;
        me.isItalic = me.widgetC.widget.settings.types.table.italic;
        me.isBold = me.widgetC.widget.settings.types.table.bold;
        me.backgroundColor = me.widgetC.widget.settings.types.table.bgColor == "transparent" ? "#FFFFFF" : me.widgetC.widget.settings.types.table.bgColor;
        me.iconColor = me.widgetC.widget.settings.types.table.iconColor == "" ? '#333333' : me.widgetC.widget.settings.types.table.iconColor;
        me.fontColor = me.widgetC.widget.settings.types.table.displayWidgetFontColor == "" ? '#333333' : me.widgetC.widget.settings.types.table.displayWidgetFontColor;
        me.selectedFontFamily = me.widgetC.widget.settings.types.table.displayWidgetFontFamily;
        me.panelCaption = me.widgetC.widget.settings.caption.caption;
        if(!me.widgetC.widget.settings.caption.caption){
          me.widgetC.widget.settings.caption.caption = me.widgetC.widget.name;
          me.panelCaption = me.widgetC.widget.settings.caption.caption;
        }

        me.editCaption = me.widgetC.widget.settings.caption.overriden;
        me.isWidgetDrillDown = me.widgetC.widget.settings.widgetDrillDown;
        me.drillDownLevel = me.widgetC.widget.settings.selectedFavLevel;
      }
      else {
        if (me.selectedWidgetType == WidgetTypeValue.GRAPH_WIDGET) {
          me.delayTime = me.widgetC.widget.settings.types.graph.selectedWidgetTimeDelay == -1 ? 0 : me.widgetC.widget.settings.types.graph.selectedWidgetTimeDelay;
          me.hideXAxis = me.widgetC.widget.settings.types.graph.xAxis == true ? false : true;
          me.hideYAxis = me.widgetC.widget.settings.types.graph.yAxis == true ? false : true;
          me.isCompareWith = me.widgetC.widget.settings.baselineCompare.enabled;
          me.selectedCompareTrend = 'fixed_trends';
          me.fixedTrendCritical = me.widgetC.widget.settings.baselineCompare.critical;
          me.fixedTrendMajor = me.widgetC.widget.settings.baselineCompare.major;
          me.fixedTrendMinor = me.widgetC.widget.settings.baselineCompare.minor;
          me.isUnderline = me.widgetC.widget.settings.types.graph.underline;
          me.isItalic = me.widgetC.widget.settings.types.graph.italic;
          me.isBold = me.widgetC.widget.settings.types.graph.bold;
          me.backgroundColor = me.widgetC.widget.settings.types.graph.bgColor == "transparent" ? "#FFFFFF" : me.widgetC.widget.settings.types.graph.bgColor;
          me.iconColor = me.widgetC.widget.settings.types.graph.iconColor == "" ? '#333333' : me.widgetC.widget.settings.types.graph.iconColor;
          me.fontColor = me.widgetC.widget.settings.types.graph.displayWidgetFontColor == "" ? '#333333' : me.widgetC.widget.settings.types.graph.displayWidgetFontColor;
          me.selectedFontFamily = me.widgetC.widget.settings.types.graph.displayWidgetFontFamily;
          me.selectedGridLineWidth = me.widgetC.widget.settings.types.graph.gridLineWidth.toString();
        }
        else if (me.selectedWidgetType == WidgetTypeValue.DATA_WIDGET) {
          me.prefix = me.widgetC.widget.settings.types.data.prefix;
          me.suffix = me.widgetC.widget.settings.types.data.suffix;
          me.iconColor = me.widgetC.widget.settings.types.data.iconColor == "" ? '#333333' : me.widgetC.widget.settings.types.data.iconColor;
          me.fontColor = me.widgetC.widget.settings.types.data.fontColor == "" ? '#333333' : me.widgetC.widget.settings.types.data.fontColor;
          me.backgroundColor = me.widgetC.widget.settings.types.data.widgetBgColor == "transparent" ? "#FFFFFF" : me.widgetC.widget.settings.types.data.widgetBgColor;
          me.selectedFontFamily = me.widgetC.widget.settings.types.data.displayFontFamily = me.widgetC.widget.settings.types.data.displayFontFamily;
          me.isBold = me.widgetC.widget.settings.types.data.bold;
          me.isItalic = me.widgetC.widget.settings.types.data.italic;
          me.isUnderline = me.widgetC.widget.settings.types.data.underline;
          me.isBoldCaption = me.widgetC.widget.settings.types.data.boldCaption;
          me.isItalicCaption = me.widgetC.widget.settings.types.data.italicCaption;
          me.isUnderlineCaption = me.widgetC.widget.settings.types.data.underlineCaption;
          me.selectedFontSize = me.widgetC.widget.settings.types.data.fontSize;
          me.panelCaption = me.widgetC.widget.settings.caption.caption;
          if(!me.widgetC.widget.settings.caption.caption){
            me.widgetC.widget.settings.caption.caption = me.widgetC.widget.name;
            me.panelCaption = me.widgetC.widget.settings.caption.caption;
          }

          me.editCaption = me.widgetC.widget.settings.caption.overriden;
        }
	   else if (me.selectedWidgetType == WidgetTypeValue.HEALTH_WIDGET) {
        me.prefix = me.widgetC.widget.settings.types.systemHealth.prefix;
        me.suffix = me.widgetC.widget.settings.types.systemHealth.suffix;
        me.iconColor = me.widgetC.widget.settings.types.systemHealth.iconColor == "" ? '#333333' : me.widgetC.widget.settings.types.systemHealth.iconColor;
        me.fontColor = me.widgetC.widget.settings.types.systemHealth.fontColor == "" ? '#333333' : me.widgetC.widget.settings.types.systemHealth.fontColor;
        me.backgroundColor = me.widgetC.widget.settings.types.systemHealth.bgColor == "transparent" ? "#FFFFFF" :  me.widgetC.widget.settings.types.systemHealth.bgColor;
        me.selectedFontFamily = me.widgetC.widget.settings.types.systemHealth.displayFontFamily = me.widgetC.widget.settings.types.systemHealth.displayFontFamily;
        me.isBold = me.widgetC.widget.settings.types.systemHealth.bold;
        me.isItalic = me.widgetC.widget.settings.types.systemHealth.italic;
        me.isUnderline = me.widgetC.widget.settings.types.systemHealth.underline;
        me.isBoldCaption = me.widgetC.widget.settings.types.systemHealth.boldCaption;
        me.isItalicCaption = me.widgetC.widget.settings.types.systemHealth.italicCaption;
        me.isUnderlineCaption = me.widgetC.widget.settings.types.systemHealth.underlineCaption;
        me.selectedFontSize = me.widgetC.widget.settings.types.systemHealth.fontSize;
        me.fontColor =  me.widgetC.widget.settings.types.systemHealth.fontColor;
      }
        me.panelCaption = me.widgetC.widget.settings.caption.caption;
        if(!me.widgetC.widget.settings.caption.caption){
          me.widgetC.widget.settings.caption.caption = me.widgetC.widget.name;
          me.panelCaption = me.widgetC.widget.settings.caption.caption;
        }
        me.editCaption = me.widgetC.widget.settings.caption.overriden;
        me.isWidgetDrillDown = me.widgetC.widget.settings.widgetDrillDown;
        me.drillDownLevel = me.widgetC.widget.settings.selectedFavLevel;
        me.disableParameterization = me.widgetC.widget.settings.parametrization;
        me.isMonochromatic = me.widgetC.widget.settings.monochromatic;
        me.monochromaticColor = '';
        if (me.widgetC.widget.settings.panelFavRelativePath)
          me.selectedFavForDrillDown = me.widgetC.widget.settings.panelFavRelativePath;
        else if (me.dropDownData.drillDownOptions)
          me.selectedFavForDrillDown = me.dropDownData.drillDownOptions[0].value;
        else
          me.selectedFavForDrillDown = 'No favorites found.';
      }
    } catch (error) {
      console.error("Error while setting initial values for advance Tab", error)
    }
  }

  setInitialValuesForFilterTab() {

    try {
      const me = this;
      if (me.widgetC.widget.settings.widgetFilter) {
     //   me.selectedFilter = me.widgetC.widget.settings.widgetFilter.criteria;
        me.enableFilter = me.widgetC.widget.settings.widgetFilter.enabled;
        me.operater = me.widgetC.widget.settings.widgetFilter.operator;
        me.operaterValue1 = me.widgetC.widget.settings.widgetFilter.firstValue;
        me.operaterValue2 = me.widgetC.widget.settings.widgetFilter.secondValue;
        me.filterBy = me.widgetC.widget.settings.widgetFilter.criteria;
        me.criteriaSampleData = me.widgetC.widget.settings.widgetFilter.include ? "Include" : "Exclude";
        if(me.enableFilter){
         if(me.operater == "=" && me.operaterValue1 == 0){
          me.selectedFilter = "Zero";
         }
         else if(me.operater == ">" && me.operaterValue1 == 0){
          me.selectedFilter = "Non-Zero";
         }
         else{
         me.selectedFilter = "Advanced";
         }
        }
      }
    } catch (error) {
      console.error("Error while setting initial values for filter Tab", error)
    }
  }

  ngOnInit(): void {
    const me = this;
    me.widgetIndex = me.widgetC.widget.widgetIndex;
    me.currentWidgetType = me.widgetC.widget.type;
    me.dropDownData = me.sortDropDownData(WIDGET_SETTING_DROPDOWN_DATA);
    me.formulaTypeDataOptions = [...me.dropDownData.formulaTypeDataOptions];
    me.content = CONTENT;
    me.errorMessage = null;
    me.tableMessage = null;
    me.dialOperatorerror = null;
    me.setFavoriteDropDownForDrillDown();
    me.setGraphDropDownForGraphSampleFilter();
    me.setInitialValues();
    me.data = FILTER_TABLE;
    me.cols = me.data.headers[0].cols;
    for (const c of me.data.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }

    me.widgetSelectionSubscription = me.dashboard.events.widgetSelected.subscribe(
      (widget: DashboardWidgetComponent) => {
        if(widget.widget.type === "IMAGE"){
          me.closeClick();
        }
        me.loading = true;
        me.widgetC = widget;
        me.widgetIndex = me.widgetC.widget.widgetIndex;
        me.currentWidgetType = me.widgetC.widget.type;
        me.errorMessage = null;
        me.tableMessage = null;
        me.dialOperatorerror = null;
        setTimeout(() => {
          me.setInitialValues();
        });
      }
    );

  }

  setFavoriteDropDownForDrillDown() {
    const me = this;
    let favList: any;
    if (sessionStorage.getItem('favList')) {
      favList = JSON.parse(sessionStorage.getItem('favList'));

      for (let i = 0; i < favList.length; i++) {
        if (favList[i].id === "system" || favList[i].id === "dashboards" || favList[i].id === "mssqlfavorites")
          continue;
        else {
          if (favList[i].items.length === 0) {
            if (!favList[i].state)
              continue;

            me.favPathArr.push(favList[i].state['path']);
          }
          else {
            me.checkFavData(favList[i].items, null);
          }
        }
      }
      me.dropDownData.drillDownOptions = [];
      for (const index of me.favPathArr) {
        me.dropDownData.drillDownOptions.push({ label: index, value: index });
      }
    }
  }

  /** method to plot graph name in dropdown list*/
  setGraphDropDownForGraphSampleFilter() {
    const me = this;
    me.isDualGraph = false;
    if(me.dashboard.selectedWidget !== null && me.dashboard.selectedWidget.data){
    let graphList = me.dashboard.selectedWidget.data.grpData.mFrequency;
    for (let i = 0; i < graphList.length; i++) {
      for (let j = 0; j < graphList[i].data.length; j++) {
        me.dropDownData.graphNameOptions.push({ label: graphList[i].data[j]['measure']['metric'], value: graphList[i].data[j]['measure']['metric'] });
        if (me.dropDownData.graphNameOptions[j].label == "")
          me.dropDownData.graphNameOptions.splice(j, 1);
      }
    }
  }
  }

  checkFavData(favTreeDTO, prevTreeDTO) {
    const me = this;
    if (favTreeDTO !== undefined) {
      if (favTreeDTO.length === 0) {
	 if(prevTreeDTO.state !== undefined){
        me.favPathArr.push(prevTreeDTO.state['path']);
	}
      }
      else {
        for (var a = 0; a < favTreeDTO.length; a++) {
          me.checkFavData(favTreeDTO[a].items, favTreeDTO[a]);
        }
      }
    }
  }

  resetWidgetSettings() {
    const me = this;
    me.setInitialValues();

    //Reset severity Defination for both data and System.
    if (me.selectedWidgetType == WidgetTypeValue.HEALTH_WIDGET || me.selectedWidgetType == WidgetTypeValue.DATA_WIDGET) {
      me.selectedCriticalOperatorType = 'Select operator';
      me.selectedMajorOperatorType = 'Select operator';
      me.criticalThreshold = null;
      me.majorThreshold = null;
    }

    else if (me.selectedWidgetType == WidgetTypeValue.GRAPH_WIDGET || me.selectedWidgetType == WidgetTypeValue.DATA_WIDGET || me.selectedWidgetType == WidgetTypeValue.TABULAR_WIDGET) {
      me.filterType = '>=';
      me.filterBasedOn = "";
      me.filterValue2 = 0;
      me.filterValue1 = 0;
      me.enableSampleFilter = false;
      me.operater = '=';
      me.enableFilter = false;
      me.operaterValue1 = 0;
      me.operaterValue2 = 0;
      me.selectedFilter = 'Non-Zero';
      me.filterBy = 'Avg';
      me.isInclude = false;
      me.selectedcriteria = "";
    }
    //me.dialogService.showInformativeBox("Error", "Hi ", "ok");
  }

  applyWidgetSettings() {
    if(this.selectedWidgetType != 'label' && (this.widgetC.widget.dataCtx.gCtx.length==0 || this.widgetC.widget.dataCtx.gCtx == undefined || this.widgetC.widget.dataCtx.gCtx == null)){
      this.messageService.add({ severity: 'error', summary: 'Error message', detail: "Please drag any Graph" });
      this.closeClick();
      return;
  }

    try {
      const me = this;
      me.setPropertiesForChartTab();
      if(me.panelCaption== "" && me.selectedWidgetType != 'label'){
        me.captionError=true;
        me.captionMessage = 'Caption is Empty';
        return;
      }
      if(me.errorMessage == null && me.tableMessage == null && me.dialOperatorerror == null){
      if (me.selectedWidgetType != 'label') {
        me.setPropertiesForFilterTab();
      }
      me.setPropertiesForAdvanceTab();
      const actionInfo = new ActionInfo();
      actionInfo.action = WIDGET_SETTINGS;
      actionInfo.data = { widgetIndex: me.widgetIndex };
      me.widgetMenuService._widgetSettings.next(actionInfo);
      me.widgetC.gridContainer.gridster.optionsChanged();
      // set flag for widget setting changed
      me.widgetC.widget.isWidgetSettingChanged = true;
      if (me.selectedDataSourceType == 'log') {
        me.widgetC.widget.settings.nfIndexPattern = me.nfQuery.substring(me.nfQuery.indexOf('index=')+6, me.nfQuery.indexOf(' '));
        me.widgetC.widget.settings.nfWidgetQuery = me.nfQuery.substring(me.nfQuery.indexOf('query=')+6, me.nfQuery.length);
        me.widgetC.widget.settings.queryHostPortValue = this.sessionService.dashboardConfigSettingData.queryHostPortValue;
      }
      if(me.selectedWidgetType == WidgetTypeValue.GRAPH_WIDGET){
        me.widgetC.widget.settings.types.graph.type= me.widgetSettingsService.getChartIdBasedOnChartType(me.selectedGraphType,me.selectedChartType);
        if(me.selectedChartType == "geo_map") {
          if(me.selectedGeoMapValueType == "0") {
            me.widgetC.widget.settings.types.graph.type = 16;
          }else if(me.selectedGeoMapValueType == "1") {
            me.widgetC.widget.settings.types.graph.type = 15;
          } else if(me.selectedGeoMapValueType == "2") {
            me.widgetC.widget.settings.types.graph.type = 67;
          }
        }
      me.widgetC.widget.settings.chartType =me.widgetC.widget.settings.types.graph.type;
      me.widgetC.widget.settings.types.graph.pctOrSlabValue = parseInt(me.selectedBasedOn);
      }
      //   if(me.selectedTab===0 ){
      // me.setInitialValuesForChartTab();
      // }
      setTimeout(() => {
        me.dashboard.layout.renderWidgets(true, true, true);
      });

      me.closeClick();
    }
    } catch (error) {
      console.error("Error while applying widget settings.", error)
    }
  }

  setPropertiesForChartTab() {

    try {
      const me = this;
      if (me.selectedDataSourceType == 'log') {
        //pending from nf logs
      }
      switch (me.selectedWidgetType) {
        case 'graph':
          me.setGraphWidgetProperties();
          break;
        case 'data':
          me.setDataWidgetProperties();
          break;
        case 'tabular':
          me.setTableWidgetProperties();
          break;
        case 'system_health':
          me.setHealthWidgetProperties();
          break;
        case 'label':
          me.setLabelWidgetProperties();
          break;
        default:
          me.setGraphWidgetProperties();
      }
    } catch (error) {
      console.error("Error while setting properties for chart Tab", error)
    }
  }
  setGraphWidgetProperties() {

    try {
      const me = this;
      let validMsg = false;
      if (me.selectedChartType == 'dial' || me.selectedChartType == 'meter'){
      validMsg = me.validateDialMeter();
      }
      if(validMsg){
        return;
      }
      let type = me.widgetSettingsService.deleteOtherTypeWidget(
        me.currentWidgetType
      );
      if (type != 'graph') delete me.widgetC.widget.settings.types[type];
      me.widgetC.widget.type = 'GRAPH';
      me.widgetC.widget.settings.dataFilter = [0, 1, 2, 3, 4, 5];
      me.setLegendProperties();
      let newgraphStatsArray = [];
      me.errorMessage = null;
      me.dialOperatorerror = null;
      if(me.selectedFormulaType.length===0){
        me.errorMessage = "Please select Formula Type";
        return;
      }

      for (var i = 0; i < me.selectedFormulaType.length; i++) {
        if (me.selectedFormulaType[i] === 'sum_count') {
          newgraphStatsArray.push(ChartType.GRAPH_STATS_SUMCOUNT);
        } else if (me.selectedFormulaType[i] === 'minimum') {
          newgraphStatsArray.push(ChartType.GRAPH_STATS_MIN);
        } else if (me.selectedFormulaType[i] === 'maximum') {
          newgraphStatsArray.push(ChartType.GRAPH_STATS_MAX);
        } else if (me.selectedFormulaType[i] === 'count') {
          newgraphStatsArray.push(ChartType.GRAPH_STATS_COUNT);
        } else if (me.selectedFormulaType[i] === 'last') {
          newgraphStatsArray.push(ChartType.GRAPH_STATS_LAST);
        }else if (me.selectedFormulaType[i] === 'sum') {
          newgraphStatsArray.push(ChartType.GRAPH_STATS_SUM);
        } else {
          newgraphStatsArray.push(ChartType.GRAPH_STATS_AVG);
        }
      }
      newgraphStatsArray = newgraphStatsArray.filter(function (
        item,
        index,
        inputArray
      ) {
        return inputArray.indexOf(item) === index;
      });
      me.widgetC.widget.settings.graphStatsType = newgraphStatsArray.toString();

      if (!me.widgetC.widget.settings.types.graph) {
        let graphWidget: DashboardWidgetTypeGraphConfig = {
          bgColor: 'transparent',
          bold: false,
          displayWidgetFontColor: '',
          displayWidgetFontFamily: 'Select Font Family',
          gridLineWidth: 0.4,
          iconColor: '',
          iconSelected: true,
          italic: false,
          legendAlignmentOnWidget: '',
          arrPct: [],
          pctOrSlabValue: 0,
          selectedWidgetTimeDelay: -1,
          showChartValue: false,
          showLegendOnWidget: false,
          showLegends: false,
          type: 0,
          underline: false,
          xAxis: true,
          yAxis: true,
        };
        me.widgetC.widget.settings.types['graph'] = graphWidget;
      }


      if (me.selectedChartType == 'dial' || me.selectedChartType == 'meter')
        me.setDialMeterProperties();

      if(me.selectedChartType == 'geo_map') {
        me.setGeoMapProperties();
      }


      switch (me.selectedGraphType) {
        case GraphTypeValue.NORMAL_GRAPH:
          me.setNormalGraphProperties();
          break;
        case GraphTypeValue.PERCENTILE_GRAPH:
          me.setPercentileGraphProperties();
          break;
      case GraphTypeValue.SLAB_COUNT_GRAPH:
          me.setSlabCountGraphProperties();
          break;
        case GraphTypeValue.CATEGORY_GRAPH:
          me.setCategoryGraphProperties();
          break;
        case GraphTypeValue.CORRELATED_GRAPH:
          me.setCorrelatedGraphProperties();
          break;
        default:
          me.setNormalGraphProperties();
      }

    } catch (error) {
      console.error("Error while setting properties for graph widget", error)
    }
  }

  setPropertiesForAdvanceTab() {

    try {
      const me = this;
      if (me.selectedWidgetType == WidgetTypeValue.GRAPH_WIDGET) {
        me.setDelayTime();
        me.setHideAxis();
      }
     
      me.setPanelCaptionProperties();
      me.setWidgetDrillDown();
      me.setCompareBaseline();
      //me.setColorSettings();
      // me.setDisplaySettings();
      me.setColorDisplaySettings();
    } catch (error) {
      console.error("Error while setting properties for advance Tab", error)
    }
  }

  setPropertiesForFilterTab() {

    try {
      const me = this;
      if (
        me.selectedWidgetType == WidgetTypeValue.GRAPH_WIDGET ||
        me.selectedWidgetType == WidgetTypeValue.DATA_WIDGET ||
        me.selectedWidgetType == WidgetTypeValue.TABULAR_WIDGET
      )
        me.setGraphFilters();
      if (me.selectedWidgetType == WidgetTypeValue.GRAPH_WIDGET)
        me.setSampleFilters();
      if (
        me.selectedChartType == 'geomap' ||
        me.selectedChartType == 'geomap_extended'
      )
        me.setGeoMapFilters();

    } catch (error) {
      console.error("Error while setting properties for filter Tab", error)
    }
  }

  setColorSettings() {
    const me = this;
  }
  setDisplaySettings() {
    const me = this;
  }
  setColorDisplaySettings() {
    const me = this;
    switch (me.selectedWidgetType) {
      case WidgetTypeValue.GRAPH_WIDGET:
        me.widgetC.widget.settings.types.graph.bgColor = me.backgroundColor;
        me.widgetC.widget.settings.types.graph.iconColor = me.iconColor;
        me.widgetC.widget.settings.types.graph.displayWidgetFontColor = me.fontColor;
        me.widgetC.widget.settings.types.graph.italic = me.isItalic;
        me.widgetC.widget.settings.types.graph.bold = me.isBold;
        me.widgetC.widget.settings.types.graph.underline = me.isUnderline;
        me.widgetC.widget.settings.types.graph.displayWidgetFontFamily = me.selectedFontFamily;
        me.widgetC.widget.settings.types.graph.gridLineWidth = Number(me.selectedGridLineWidth);
        // me.widgetC.widget.settings.types.graph.color
        break;
      case WidgetTypeValue.DATA_WIDGET:
        me.widgetC.widget.settings.types.data.iconColor = me.iconColor;
        me.widgetC.widget.settings.types.data.fontColor = me.fontColor;
        me.widgetC.widget.settings.types.data.widgetBgColor = me.backgroundColor;
        me.widgetC.widget.settings.types.data.displayFontFamily = me.selectedFontFamily;
        me.widgetC.widget.settings.types.data.bold = me.isBold;
        me.widgetC.widget.settings.types.data.italic = me.isItalic;
        me.widgetC.widget.settings.types.data.underline = me.isUnderline;
        me.widgetC.widget.settings.types.data.fontSize =me.selectedFontSize;

        break;
      case WidgetTypeValue.LABEL_WIDGET:
        me.widgetC.widget.settings.types.text.bold = me.isBold ? 'bold' : 'normal';
        me.widgetC.widget.settings.types.text.underline = me.isUnderline ? 'underline' : 'normal';
        me.widgetC.widget.settings.types.text.italic = me.isItalic ? 'italic' : 'normal';
        me.widgetC.widget.settings.types.text.bgColor = me.backgroundColor;
        me.widgetC.widget.settings.types.text.fontColor = me.fontColor;
        me.widgetC.widget.settings.types.text.iconColor = me.iconColor;
        me.widgetC.widget.settings.types.text.fontFamily = me.selectedFontFamily;
        me.widgetC.widget.settings.types.text.fontSize = me.selectedFontSize;
        break;
      case WidgetTypeValue.TABULAR_WIDGET:
        me.widgetC.widget.settings.types.table.underline = me.isUnderline;
        me.widgetC.widget.settings.types.table.italic = me.isItalic;
        me.widgetC.widget.settings.types.table.bold = me.isBold;
        me.widgetC.widget.settings.types.table.bgColor = me.backgroundColor;
        me.widgetC.widget.settings.types.table.iconColor = me.iconColor;
        me.widgetC.widget.settings.types.table.displayWidgetFontColor = me.fontColor;
        me.widgetC.widget.settings.types.table.displayWidgetFontFamily = me.selectedFontFamily;
        break;
      case WidgetTypeValue.HEALTH_WIDGET:
        me.widgetC.widget.settings.types.systemHealth.iconColor = me.iconColor;
        me.widgetC.widget.settings.types.systemHealth.fontColor = me.fontColor;
        me.widgetC.widget.settings.types.systemHealth.bgColor = me.backgroundColor;
        me.widgetC.widget.settings.types.systemHealth.displayFontFamily = me.selectedFontFamily;
        me.widgetC.widget.settings.types.systemHealth.bold = me.isBold;
        me.widgetC.widget.settings.types.systemHealth.italic = me.isItalic;
        me.widgetC.widget.settings.types.systemHealth.underline = me.isUnderline;
        me.widgetC.widget.settings.types.systemHealth.boldCaption= me.isBoldCaption;
       me.widgetC.widget.settings.types.systemHealth.italicCaption= me.isItalicCaption;
        me.widgetC.widget.settings.types.systemHealth.underlineCaption= me.isUnderlineCaption;
        me.widgetC.widget.settings.types.systemHealth.fontFamily = me.selectedFontFamily;
        me.widgetC.widget.settings.types.systemHealth.fontSize =me.selectedFontSize;
        me.widgetC.widget.settings.types.systemHealth.fontColor=me.fontColor;
        break;

    }
    //  me.selectMonochramticColor(0);
  }

  setNormalGraphProperties() {
    const me = this;
    // me.widgetC.widget.settings.chartType = 0;
    // me.widgetC.widget.settings.types.graph.type = 0;
    me.widgetC.widget.settings.types.graph.type = me.widgetSettingsService.getChartIdBasedOnChartType(
      me.selectedGraphType,
      me.selectedChartType
    );

    if(me.selectedChartType == "geo_map") {
      if(me.selectedGeoMapValueType == "0") {
        me.widgetC.widget.settings.types.graph.type = 16;
      }else if(me.selectedGeoMapValueType == "1") {
        me.widgetC.widget.settings.types.graph.type = 15;
      }else if(me.selectedGeoMapValueType == "2") {
        me.widgetC.widget.settings.types.graph.type = 67;
      }
    }
    me.widgetC.widget.settings.chartType =
      me.widgetC.widget.settings.types.graph.type;
  }
  setPercentileGraphProperties() {
    const me = this;
    // me.widgetC.widget.settings.chartType = 38;
    // me.widgetC.widget.settings.types.graph.type = 38;
    me.widgetC.widget.settings.types.graph.type = me.widgetSettingsService.getChartIdBasedOnChartType(
      me.selectedGraphType,
      me.selectedChartType
    );
    me.widgetC.widget.settings.chartType =
      me.widgetC.widget.settings.types.graph.type;
    me.widgetC.widget.settings.dataFilter = [7];
    me.widgetC.widget.settings.types.graph.pctOrSlabValue = 50;
    me.widgetC.widget.settings.types.graph.arrPct = [70,80,90,95,99];
  }
  setSlabCountGraphProperties() {
    const me = this;
    // me.widgetC.widget.settings.chartType = 45;
    // me.widgetC.widget.settings.types.graph.type = 45;
    me.widgetC.widget.settings.types.graph.type = me.widgetSettingsService.getChartIdBasedOnChartType(
      me.selectedGraphType,
      me.selectedChartType
    );
    me.widgetC.widget.settings.chartType =
      me.widgetC.widget.settings.types.graph.type;
    me.widgetC.widget.settings.dataFilter = [8];
    //me.widgetC.widget.settings.types.graph.pctOrSlabValue = 1;
  }
  setCategoryGraphProperties() {
    const me = this;
    me.widgetC.widget.settings.dataFilter = [9];
    if (me.selectedChartType == 'stacked_bar') {
      me.widgetC.widget.settings.chartType = 61; //stacked bar
      me.widgetC.widget.settings.types.graph.type = me.widgetSettingsService.getChartIdBasedOnChartType(
        me.selectedGraphType,
        'stacked_bar'
      );
    } else if (me.selectedChartType == 'stacked_area') {
      me.widgetC.widget.settings.chartType = 62; //stacked area
      me.widgetC.widget.settings.types.graph.type = me.widgetSettingsService.getChartIdBasedOnChartType(
        me.selectedGraphType,
        'stacked_area'
      );
    }
  }
  setCorrelatedGraphProperties() {
    const me = this;
    me.widgetC.widget.settings.dataFilter = [10];
    if (me.selectedChartType == 'line') {
      me.widgetC.widget.settings.chartType = 85;
      me.widgetC.widget.settings.types.graph.type = me.widgetSettingsService.getChartIdBasedOnChartType(
        me.selectedGraphType,
        me.selectedChartType
      );
    } else if (me.selectedChartType == 'bar') {
      me.widgetC.widget.settings.chartType = 87;
      me.widgetC.widget.settings.types.graph.type = me.widgetSettingsService.getChartIdBasedOnChartType(
        me.selectedGraphType,
        me.selectedChartType
      );
    } else if (me.selectedChartType == 'area') {
      me.widgetC.widget.settings.chartType = 86;
      me.widgetC.widget.settings.types.graph.type = me.widgetSettingsService.getChartIdBasedOnChartType(
        me.selectedGraphType,
        me.selectedChartType
      );
    }
  }
  setDataWidgetProperties() {
    const me = this;
    me.dialOperatorerror = null;
        me.errorMessage =null;
    // if(me.selectedCriticalOperatorType == "Select operator" && me.selectedMajorOperatorType == "Select operator"){
    //   me.errorMessage = "Need to fill at least one threshold value either critical or major.";
    //   return;
    // }
    if(me.selectedCriticalOperatorType !== "Select operator" && me.criticalThreshold == null){
      me.errorMessage ="Need to give critical threshold value";
      return;
    }
    if(me.selectedMajorOperatorType !== "Select operator" && me.majorThreshold == null){
      me.errorMessage = "Need to give major threshold value";
      return;
    }
    let type = me.widgetSettingsService.deleteOtherTypeWidget(
      me.currentWidgetType
    );
    if (type != 'data') delete me.widgetC.widget.settings.types[type];
    me.widgetC.widget.type = 'DATA';

    if (!me.widgetC.widget.settings.types.data) {
      let dataWidget: DashboardWidgetTypeDataConfig = {
        dataAttrName: me.selectedDataFieldType,
        dataDisplayName: me.dataDisplayName,
        dataImgName: 'icons8 icons8-up',
        bgColor: '#009973',
        fontColor: 'white',
        prefix: me.prefix,
        suffix: me.suffix,
        showIcon: true,
        showTitleBar: true,
        valueFontColor: '',
        textFontColor: '',
        displayFontSize: '18',
        displayFontFamily: 'Roboto',
        valueFontSize: '15',
        valueFontFamily: 'Roboto',
        decimalFormat: 'dec_3',
        fontSize: me.selectedFontSize,
        dataWidgetSeverityDefDTO : null
      };
      me.widgetC.widget.settings.types['data'] = dataWidget;

  }
  me.widgetC.widget.settings.types['data'].dataAttrName = me.selectedDataFieldType;
  me.widgetC.widget.settings.types['data'].dataDisplayName = me.dataDisplayName;

          // set Severity
         // let severity = null;
          //if(me.selectedCriticalOperatorType !== 'Select operator'|| me.selectedMajorOperatorType !== 'Select operator'){
          let severity = {
            criticalMSRString: me.selectedCriticalOperatorType,
            criticalValue: me.criticalThreshold,
            majorMSRString: me.selectedMajorOperatorType,
            majorValue: me.majorThreshold,
            colorChecked: me.dataBackGroundColor,
            severityColor: 'transparent'
          }
        //}

     me.widgetC.widget.settings.types.data.dataWidgetSeverityDefDTO = severity;

}
  setTableWidgetProperties() {
    const me = this;
    if(me.selectedTableFieldType.length == 0 && me.selectedTableType  !== "vector_based"){
      me.tableMessage = "Select Data Field";
      return;
    }
    //me.errorMessage = null;
    me.tableMessage = null;
    me.dialOperatorerror = null;
    let type = me.widgetSettingsService.deleteOtherTypeWidget(
      me.currentWidgetType
    );
    if (type != 'table') delete me.widgetC.widget.settings.types[type];
    me.widgetC.widget.type = 'TABULAR';

    let cellTooltipTemplate =
      '<div class="ui-grid-cell-contents" title = "{{COL_FIELD}}" tooltip-placement="bottom"  border-bottom-color="grey">{{ COL_FIELD }}</div>';
    let columnDefs = [];
    let METRIC_NAME = 1;
    if(me.selectedTableType  == "vector_based"){
      me.selectedTableFieldType = [];
      me.selectedTableFieldType.length = 0;
      me.selectedTableFieldType = ["avg"];
    }
    let length = me.selectedTableFieldType.length + METRIC_NAME;
    let width = 50 / length;
    for (let i = 0; i < length; i++) {
     // let dataAttrName = me.selectedTableFieldType[i];
     let firstField = me.selectedTableType == "graph_stats_based" ? 'measure.metric' : 'subject.tags[0].sName';
     let firstDataAttrName = me.selectedTableType == "graph_stats_based" ? 'metricName' : 'vectorName';
     let firstDisplayName = me.selectedTableType == "graph_stats_based" ? 'Metric Name' : 'Vector Name';
      let tableColDef = {
        cellFilter: '',
        field: i == 0 ? firstField : 'summary.'+me.selectedTableFieldType[i-1],
        width: width + '%',
        minWidth: 150,
        dataAttrName: i == 0 ? firstDataAttrName:  me.selectedTableFieldType[i-1],
        displayName: i== 0 ? firstDisplayName : me.getFieldDisplayName(me.selectedTableFieldType[i-1]),
        cellClass: 'grid-align',
        headerCellClass: 'grid-align-center',
        headerTooltip: '',
        cellTemplate: cellTooltipTemplate,
        type: 'number',
      };
      columnDefs.push(tableColDef);
    }
    let table: DashboardWidgetTypeTableConfig = {
      bgColor: 'transparent',
      cols: columnDefs,
      enableColumnResizing: "true",
      enableFiltering: "false",
      enableGridMenu: "false",
      enableSorting: "true",
      fastWatch: "false",
      format: 'dec_3',
      rowHeight: '16',
      showGridFooter: "false",
      tableHeight: '100',
      tableType: me.selectedTableType == "graph_stats_based" ? "0" : "1",
      showRankScore: false,
    };

    switch (me.selectedWidgetType) {
      case 'graph_stats_based':
        me.setGraphTabularProperties(table);
        break;
      case 'vector_based':
        me.setVectorTabularProperties(table);
        break;
      default:
     //   me.setGraphTabularProperties(table);
    }

    me.widgetC.widget.settings.types.table = table;
  }

  setGraphTabularProperties(table: DashboardWidgetTypeTableConfig) {
    const me = this;
    table.tableType = '0';
    me.widgetC.widget.dataAttrName = 'graphName';
    me.widgetC.widget.displayName = 'Metric Name';
    let cols: DashboardWidgetTypeTableColumnDef = {
      cellFilter: '',
      displayName: 'Metric Name',
      field: 'measure.metric',
      headerCellClass: 'grid-align-center',
      headerTooltip: '',
      minWidth: '150',
      type: 'number',
      width: '50%',
    };
  }

  setVectorTabularProperties(table: DashboardWidgetTypeTableConfig) {
    const me = this;
    table.tableType = '1';
    me.widgetC.widget.dataAttrName = 'vectorName';
    me.widgetC.widget.displayName = 'Vector Name';

    if (me.isShowRankScore) table.showRankScore = true;
    let cols: DashboardWidgetTypeTableColumnDef = {
      cellFilter: '',
      displayName: 'Rank',
      field: 'summary.avg',
      headerTooltip: '',
      minWidth: '',
      type: 'number',
      width: '50%',
    };
    // table.cols = cols;
    //need to set cols in table object
  }

  setHealthWidgetProperties() {
    const me = this;
    //validations
    me.dialOperatorerror = null;
    if(me.selectedCriticalOperatorType == "Select operator" && me.selectedMajorOperatorType == "Select operator"){
      me.errorMessage = "Need to fill at least one threshold value either critical or major.";
      return;
    }
    if(me.selectedCriticalOperatorType !== "Select operator" && me.criticalThreshold == null){
      me.errorMessage ="Need to give critical threshold value";
      return;
    }
    if(me.selectedMajorOperatorType !== "Select operator" && me.majorThreshold == null){
      me.errorMessage = "Need to give major threshold value";
      return;
    }
    if(me.healthCriticalPct == null && me.majorPct == null){
      // me.errorMessage ="Need to fill at least one health rule either critical or major.";
      // return;
    }
    if(me.selectedCriticalSeverityType == "Select operator" && me.criticalPct !== null){
      // me.errorMessage = "Need to fill value for critical severity";
      // return;
    }
    if(me.selectedMajorSeverityType == "Select operator" && me.majorPct !== null){
      me.errorMessage = "Need to fill value for major severity";
      return;
    }
    if(me.selectedCriticalHealthType !== "Select operator" && me.criticalAnotherPct == null){
      me.errorMessage = "Need to fill critical percentage value."
      return;
    }
    if(me.selectedMajorHealthType !== "Select operator" && me.majorAnotherPct == null){
      me.errorMessage = "Need to fill major percentage value."
      return;
    }
    me.errorMessage = null;
    let type = me.widgetSettingsService.deleteOtherTypeWidget(
      me.currentWidgetType
    );
    if (type != 'systemHealth') delete me.widgetC.widget.settings.types[type];
    me.widgetC.widget.type = 'SYSTEM_HEALTH';
      let healthWidgetSeverity: HealthWidgetSeverityDef = {
        criticalMSRString: me.selectedCriticalOperatorType,
        criticalValue:  me.selectedCriticalOperatorType  == "Select operator" ||  me.criticalThreshold == null ? -1 : me.criticalThreshold,
        majorMSRString: me.selectedMajorOperatorType,
        majorValue: me.selectedMajorOperatorType  == "Select operator" || me.majorThreshold == null  ? -1 : me.majorThreshold
      };

      let healthRuleInfo: HealthWidgetRuleInfo = {
        criticalAnotherPct:  me.selectedCriticalHealthType === 'Select operator' ? -1 : me.criticalAnotherPct,
        criticalAnotherSeverity: me.criticalAnotherSeverity,
        criticalCondition: me.selectedCriticalHealthType === 'Select operator' ? "" : me.selectedCriticalHealthType,
        criticalPct: me.selectedCriticalSeverityType === 'Select operator' ? -1 : me.healthCriticalPct,
        criticalPerc: me.selectedCriticalSeverityType === 'Select operator' ? false : true,
        criticalSeverity: me.selectedCriticalSeverityType === 'Select operator' ? "" : me.selectedCriticalSeverityType,
        criticalOperator: me.selectedCriticalOperatorType === 'Select operator' ? false : true,
        majorOperator: false,
        isThresholdCritical: false,
        isThresholdMajor: false,
        majorAnotherPct: me.selectedMajorOperatorType === 'Select operator' ? -1 : me.majorAnotherPct,
        majorAnotherSeverity: me.majorAnotherSeverity ,
        majorCondition: me.selectedMajorHealthType === 'Select operator' ? "" : me.selectedMajorHealthType,
        majorPct: me.selectedMajorSeverityType === 'Select operator' ? -1 : me.majorPct,
        majorPerc: me.majorAnotherSeverity === 'Select operator' ? false : true,
        majorSeverity: me.selectedMajorSeverityType === 'Select operator' ? "" : me.selectedMajorSeverityType,
        showSecdCondForCritical: me.criticalAnotherSeverity === 'Select operator'? false : true,
        showSecdCondForMajor: me.majorAnotherSeverity === 'Select operator' ? false : true

      };

      let healthWidget: DashboardWidgetTypeSystemHealthConfig = {
        bgColor: '',
        dataAttrName: me.selectedDataFieldType,
        dataImgName: 'icons8 icons8-up',
        fontColor: 'black',
        graphNameOnTop: me.showNameOnTop,
        healthWidgetSeverityDef: healthWidgetSeverity,
        healthWidgetRuleInfo: healthRuleInfo,
        prefix: me.prefix,
        severity: 'critical',
        showIcon: true,
        showTitleBar: true,
        suffix: me.suffix,
        fontFamily: 'Arial',
        fontSize: me.selectedFontSize,
        showMetric:me.showMetric,
        boldCaption: false,
        italicCaption: false,
        underlineCaption:false

      };
      me.widgetC.widget.settings.types['systemHealth'] = healthWidget;
    }

  setLabelWidgetProperties() {
    const me = this;
    let type = me.widgetSettingsService.deleteOtherTypeWidget(
      me.currentWidgetType
    );
    if (type != 'text') delete me.widgetC.widget.settings.types[type];
    me.widgetC.widget.type = 'LABEL';
    if (me.isLabelBgColor)
      var bgColor = me.labelBgColor;
    else
      var bgColor = 'transparent';
    //if (!me.widgetC.widget.settings.types.text) {
      let textWidget: DashboardWidgetTypeTextConfig = {
        align: 'left',
        bgColor: bgColor,
        bold: 'normal',
        fontColor: '#000000',
        fontFamily: 'Arial',
        fontSize: "18",
        height: "58px",
        italic: "normal",
        origin: "0% 0%",
        rotate: "rotate(0deg)",
        showTextArea: false,
        text: me.labelField,
        underline: "none",
        width: "431px"
      };
      me.widgetC.widget.settings.types['text'] = textWidget;
    //}
  }

  setLegendProperties() {
    const me = this;
    if (me.showLegend) {
      me.widgetC.widget.settings.types.graph.showLegends = true;
      me.widgetC.widget.settings.types.graph.showLegendOnWidget = true;
      me.widgetC.widget.settings.types.graph.legendAlignmentOnWidget = me.selectedLegendType;
    }
    else {
      if(me.widgetC.widget.settings.types &&  me.widgetC.widget.settings.types.graph){
      me.widgetC.widget.settings.types.graph.showLegends = false;
      me.widgetC.widget.settings.types.graph.showLegendOnWidget = false;
      }
    }
  }

  setGeoMapProperties() {
    const me = this;
    if(me.selectedGeoMapColorBandType == "0") {
      me.widgetC.widget.settings.types.graph.geomap.redToGreen = false;
    }else {
      me.widgetC.widget.settings.types.graph.geomap.redToGreen = true;
    }

    if(me.selectedGeoMapValueType == "0") {
      me.widgetC.widget.settings.types.graph.type = 16;
    } else if(me.selectedGeoMapValueType == "1") {
      me.widgetC.widget.settings.types.graph.type = 15;
    }else if(me.selectedGeoMapValueType == "2") {
      me.widgetC.widget.settings.types.graph.type = 67;
    }
  }
  setDialMeterProperties() {
    const me = this;

    if (me.minDialValue === 0 && me.maxDialValue === 0) {
      alert('Please enter non-zero values');
      return;
    }

    if (me.selectedDialOperator === 'null' || me.selectedDialOperator === '') {
      alert('Please select Threshold sign');
      return;
    }

    if (me.minDialValue > me.maxDialValue) {
      alert('Minimum should be less than Maximum');
      return;
    }

    if (me.warningDialValue <= me.minDialValue || me.warningDialValue >= me.maxDialValue) {
      alert('Warning Threshold should be greater than Minimum and less than Maximum');
      return;
    }

    if (me.criticalDialValue <= me.minDialValue || me.criticalDialValue >= me.maxDialValue) {
      alert('Critical Threshold should be greater than Minimum and less than Maximum');
      return;
    }

    if (!(me.selectedDialOperator === 'null' || me.selectedDialOperator === '')) {
      if (me.selectedDialOperator === '>' && me.criticalDialValue < me.warningDialValue) {
        alert('Critical Threshold should be greater than Warning');
        return;
      }
    }

    if (!(me.selectedDialOperator === 'null' || me.selectedDialOperator === '')) {
      if (me.selectedDialOperator === '<' && me.criticalDialValue > me.warningDialValue) {
        alert('Critical Threshold should be less than Warning');
        return;
      }
    }

    me.dialExpression = me.minDialValue + '_' + me.maxDialValue + '_' + me.selectedDialOperator + '_' + me.warningDialValue + '_' + me.criticalDialValue;
    me.widgetC.widget.settings.types.graph.dialMeterExp = me.dialExpression;
  }

  setDelayTime() {
    const me = this;
    me.widgetC.widget.settings.types.graph.selectedWidgetTimeDelay = me.delayTime;
  }

  validateQty(event) {
    if ((event.charCode >= 48 && event.charCode <= 57) || (event.charCode >= 65 && event.charCode <= 90) ||
      (event.charCode >= 97 && event.charCode <= 122) || (event.charCode == 58) || (event.charCode == 8) || (event.charCode == 0))
      return true;
    else
      return false;
  }

  setPanelCaptionProperties() {
    const me = this;
    if (me.editCaption) {
      me.widgetC.widget.settings.caption.caption = me.panelCaption;
      me.widgetC.widget.settings.caption.overriden = true;
      me.widgetC.widget.name = me.panelCaption;
    }
    else{
      me.widgetC.widget.settings.caption.caption = me.panelCaption;
      me.widgetC.widget.settings.caption.overriden = false;
      me.widgetC.widget.name = me.panelCaption;
    }

    if (me.selectedWidgetType == 'data' ) {
      me.widgetC.widget.settings.types.data.prefix = me.prefix;
      me.widgetC.widget.settings.types.data.suffix = me.suffix;
      me.widgetC.widget.settings.types.data.underline = me.isUnderline;
      me.widgetC.widget.settings.types.data.boldCaption= me.isBoldCaption;
     me.widgetC.widget.settings.types.data.italicCaption= me.isItalicCaption;
    }
    if(me.selectedWidgetType == 'system_health'){
      me.widgetC.widget.settings.types.systemHealth.prefix = me.prefix;
      me.widgetC.widget.settings.types.systemHealth.suffix = me.suffix;
      me.widgetC.widget.settings.types.systemHealth.underline = me.isUnderline;
      me.widgetC.widget.settings.types.systemHealth.boldCaption= me.isBoldCaption;
     me.widgetC.widget.settings.types.systemHealth.italicCaption= me.isItalicCaption;
    }

    if (
      me.selectedChartType == 'dual_axis_line' ||
      me.selectedChartType == 'dual_axis_bar_line' ||
      me.selectedChartType == 'dual_axis_area_line' ||
      me.selectedChartType == 'dual_axis_stacked_bar'
    ) {
      me.widgetC.widget.settings.types.graph.primaryYAxisLabel =
        me.primaryYAxisLabel;
      me.widgetC.widget.settings.types.graph.primaryYAxisLabel =
        me.secondaryYAxisLabel;
    }
  }

  setWidgetDrillDown() {
    const me = this;
    me.widgetC.widget.settings.widgetDrillDown = me.isWidgetDrillDown;
    if (me.isWidgetDrillDown) {
      me.widgetC.widget.settings.selectedFavLevel = me.drillDownLevel;
      me.widgetC.widget.settings.parametrization = me.disableParameterization;
      if (!me.selectedFavForDrillDown)
        me.widgetC.widget.settings.panelFavRelativePath = me.dropDownData.drillDownOptions[0].label;
      else
        me.widgetC.widget.settings.panelFavRelativePath = me.selectedFavForDrillDown;

      if (me.selectedFavForDrillDown.includes('/')) {
        let tmpArr = me.selectedFavForDrillDown.split('/');
        me.widgetC.widget.settings.panelFavName = tmpArr[tmpArr.length - 1];
      }
      else
        me.widgetC.widget.settings.panelFavName = me.selectedFavForDrillDown;
    }

  }

  setHideAxis() {
    const me = this;
    me.widgetC.widget.settings.types.graph.xAxis = !me.hideXAxis;
    me.widgetC.widget.settings.types.graph.yAxis = !me.hideYAxis;
  }

  setCompareBaseline() {
    const me = this;
    if (me.isCompareWith) {
      me.widgetC.widget.settings.baselineCompare.enabled = true;
      me.widgetC.widget.settings.baselineCompare.trendMode = '2'; //fixed trend
      me.widgetC.widget.settings.baselineCompare.critical =
        me.fixedTrendCritical;
      me.widgetC.widget.settings.baselineCompare.major = me.fixedTrendMajor;
      me.widgetC.widget.settings.baselineCompare.minor = me.fixedTrendMinor;
    }
    else{
      me.widgetC.widget.settings.baselineCompare.enabled = false;
      me.widgetC.widget.settings.baselineCompare.critical = "0";
      me.widgetC.widget.settings.baselineCompare.major = "0";
      me.widgetC.widget.settings.baselineCompare.minor = "0";
    }
  }

  setGraphFilters() {
    const me = this;
    if (!me.widgetC.widget.settings.widgetFilter) {
      let widgetFilter: DashboardWidgetFilterConfig = {
        criteria: '',
        enabled: false,
        operator: '',
        firstValue: 0,
        include: false,
        secondValue: 0,
        basedOn: '',
      };
      me.widgetC.widget.settings['widgetFilter'] = widgetFilter;
    }
    if (me.enableFilter) {
      me.widgetC.widget.settings.widgetFilter.enabled = true;
      me.widgetC.widget.settings.widgetFilter.criteria = me.selectedFilter;
      me.widgetC.widget.settings.widgetFilter.include = me.criteriaSampleData == "Include" ? true : false;
      switch (me.selectedFilter) {
        case 'Non-Zero':
          me.filterBasedOnNonZero();
          break;
        case 'Zero':
          me.filterBasedOnZero();
          break;
        case 'Advanced':
          me.filterBasedOnAdvanced();
      }
    } else {
      me.widgetC.widget.settings.widgetFilter.enabled = false;
      me.widgetC.widget.settings.widgetFilter.criteria = '';
      me.widgetC.widget.settings.widgetFilter.firstValue = 0;
      me.widgetC.widget.settings.widgetFilter.include = false;
      me.widgetC.widget.settings.widgetFilter.operator = '';
      me.widgetC.widget.settings.widgetFilter.secondValue = 0;
      me.widgetC.widget.settings.widgetFilter.basedOn = '';
    }
  }

  //only to show graph having non zero values
  filterBasedOnNonZero() {
    const me = this;
    me.widgetC.widget.settings.widgetFilter.criteria = me.filterBy;
    me.widgetC.widget.settings.widgetFilter.firstValue = 0;
    me.widgetC.widget.settings.widgetFilter.operator = ">"
    me.widgetC.widget.settings.widgetFilter.secondValue = -1;
    // firstValue: 0
    // include: false
    // operator: "="
    // secondValue: -1
  }

  //only to show graph having zero values
  filterBasedOnZero() {
    const me = this;
    me.widgetC.widget.settings.widgetFilter.criteria = me.filterBy;
    me.widgetC.widget.settings.widgetFilter.firstValue = 0;
    me.widgetC.widget.settings.widgetFilter.operator = "="
    me.widgetC.widget.settings.widgetFilter.secondValue = -1;
    me.widgetC.widget.settings.widgetFilter.basedOn = me.filterBy;
  }

  filterBasedOnAdvanced() {
    const me = this;
    me.widgetC.widget.settings.widgetFilter.criteria = me.filterBy;
    me.widgetC.widget.settings.widgetFilter.firstValue = me.operaterValue1;
    //me.widgetC.widget.settings.widgetFilter.include = me.isInclude;
    me.widgetC.widget.settings.widgetFilter.operator = me.operater;
    me.widgetC.widget.settings.widgetFilter.secondValue = me.operaterValue2;
    me.widgetC.widget.settings.widgetFilter.basedOn = me.filterBy;
  }

  setSampleFilters() {
    const me = this;
    if (me.enableSampleFilter) {
      if (!me.widgetC.widget.settings.graphFilter) {
        let sampleArr: GraphSampleFilterDTO[] = [{ filterType: '', filterValue1: 0, filterValue2: 0, graphName: '' }];
        me.widgetC.widget.settings['graphFilter'] = sampleArr;
      }
      if (!me.sampleFilterBy)
        me.sampleFilterBy = 'avg';
      me.widgetC.widget.settings.graphFilter[0].filterBasedOn = me.sampleFilterBy;
      me.widgetC.widget.settings.graphFilter[0].filterType = me.filterType;
      me.widgetC.widget.settings.graphFilter[0].filterValue1 = me.filterValue1;
      me.widgetC.widget.settings.graphFilter[0].filterValue2 = me.filterValue2;
      me.widgetC.widget.settings.graphFilter[0].graphName = me.selectedGraphForFilter != '' ? me.selectedGraphForFilter : me.dropDownData.graphNameOptions[0].label;
      // me.widgetC.widget.settings.graphFilter[0].graphid
      // me.widgetC.widget.settings.graphFilter[0].groupId

      //need to handle based on like avg,min,max
    }
    else
      me.widgetC.widget.settings.graphFilter = null;
  }

  addRowToSampleFilters() {
    const me = this;
    console.log("data comingggg", me.data.data);
    me.data.data.splice(0, 1);
    let rowData = {
      number: 2,
      graph: me.selectedGraphForFilter,
      operator: me.filterType,
      filterValue1: me.filterValue1,
      filterValue2: me.filterValue2,
      icon1: 'icons8-delete-trash',
      icon2: 'icons8-edit-2',
    }
    // me.selectedGraphForFilter
    me.data.data.push(rowData);
  }

  setGeoMapFilters() {
    const me = this;
    //geo map currently not supported in widget
  }

  openEditWidget(widget: DashboardWidgetComponent) {
    const me = this;
    me.widgetC = widget;
    me.widgetIndex = widget.widget.widgetIndex;
    me.currentWidgetType = widget.widget.type;
    // super.show();
  }

  @Input() get selectedColumns(): FilterHeaderCols[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: FilterHeaderCols[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  toggleVisibility() {
    this.enableSampleFilter = !this.enableSampleFilter;
  }

  selectMonochramticColor(index) {
    const me = this;
    // this.monoChromaticColor[previousselecteindex].border = "0px solid black"
    //this.monoChromaticColor[this.presentselectedindex].border = "3px solid black";
    //this.selectedColorIndex =  this.monoChromaticColor[this.presentselectedindex].id
    //this.isMonoColorChanged = true;
    me.monoChromaticColor = monoChromaticColorList;
    let colorIndex = index;
    me.widgetC.widget.graphs.widgetGraphs.forEach((element: any, index: number) => {
      me.widgetC.widget.graphSettings[index].color = me.monoChromaticColor[index].shades[colorIndex];
      colorIndex += 1;
      if (colorIndex == me.monoChromaticColor.length)
        colorIndex = 0;

    });

  }
changeGraphType(selectedGraphType , isChartTypeChange ? : boolean){
  const me = this;
  if(selectedGraphType== 'slab_count_graph'){
    me.selectedBasedOn ='1';
  }
   if(selectedGraphType== 'percentile_graph'){
    me.selectedBasedOn ='90';
  }
    if(selectedGraphType == "normal_graph" || selectedGraphType == "percentile_graph" || selectedGraphType == "slab_count_graph" ){
      this.dropDownData.chartTypeDataOptions = WIDGET_SETTING_DROPDOWN_DATA.normalChartTypeDataOptions;
      me.enableDisableGraphType(selectedGraphType);

      me.selectedChartType = isChartTypeChange ? "line" : me.selectedChartType;
    }
    else if (selectedGraphType == "category_graph"){
      me.dropDownData.chartTypeDataOptions = WIDGET_SETTING_DROPDOWN_DATA.categoryTypeDataOptions;
     // me.selectedChartType = "stacked_area";
     me.selectedChartType = isChartTypeChange ? "stacked_area" : me.selectedChartType;
    }
    else if (selectedGraphType == "correlated_graph"){
      me.dropDownData.chartTypeDataOptions = WIDGET_SETTING_DROPDOWN_DATA.corelatedTypeDataOPrions;
      me.selectedChartType = isChartTypeChange ? "line" : me.selectedChartType;
    }
    }
    enableDisableGraphType(selectedGraphType ? : String){
      const me = this;

      const dashboardConfigSettingData = this.sessionService.dashboardConfigSettingData;
      const arrGeoMapID = dashboardConfigSettingData.arrGeoMapGroupIdValue;

    if(me.dashboard.selectedWidget.data && me.dashboard.selectedWidget.data.grpData  && me.dashboard.selectedWidget.data.grpData.mFrequency[0].data.length > 1){
      me.dropDownData.chartTypeDataOptions.forEach(element => {
        if(element.value =="geo_map"){
        if(arrGeoMapID.indexOf(me.dashboard.selectedWidget.widget.dataCtx.gCtx[0].measure.mgId) !== -1) {
          element.disabled = false;
        }else {
        element.disabled = true;
        }
        } else if (element.value =="geo_map_extended" ) {
          element.disabled = true;
        }
        else if( element.value == 'dual_axis_line' || element.value == 'dual_axis_bar_line' ||
        element.value == 'dual_axis_area_line' || element.value == 'dual_axis_stacked_bar' || element.value == 'line_stacked_bar'){
        element.disabled = false;
        }
     });

     }
     else{
       me.dropDownData.chartTypeDataOptions.forEach(element => {
         if(element.value =="geo_map_extended"  || element.value == 'dual_axis_line' || element.value == 'dual_axis_bar_line' ||
         element.value == 'dual_axis_area_line' || element.value == 'dual_axis_stacked_bar' || element.value == 'line_stacked_bar'){
         element.disabled = true;
         }else if(element.value =="geo_map" && arrGeoMapID.indexOf(me.dashboard.selectedWidget.widget.dataCtx.gCtx[0].measure.mgId) !== -1) {
          element.disabled = false;
         }
      });
     }
}

changeWidgetTypeOptions(selectedWidgetType){
  const me = this;
  me.tableMessage = null;
  switch (me.selectedWidgetType) {
    case 'graph':
      me.errorMessage = null;
      me.dialOperatorerror = null;
     // me.setGraphWidgetProperties();
      break;
    case 'data':
      me.errorMessage = null;
      me.dialOperatorerror = null;
      me.selectedCriticalOperatorType = 'Select operator';
      me.selectedMajorSeverityType = 'Select operator';
      me.criticalThreshold = 0;
      me.majorThreshold = 0;
      me.dataBackGroundColor = false;
      break;
    case 'tabular':
      me.errorMessage = null;
      me.dialOperatorerror = null;
      me.selectedDataFieldType= "Average";
      me.selectedTableFieldType= ["avg"];
      // me.selectedTableFieldType = [];
      break;
    case 'system_health':
      me.errorMessage = null;
      me.dialOperatorerror = null;
      me.selectedCriticalOperatorType = 'Select operator';
      me.selectedMajorSeverityType = 'Select operator';
      me.selectedMajorOperatorType = 'Select operator';
      me.criticalThreshold = null;
      me.majorThreshold = null;
      me.criticalAnotherPct = null,
      me.criticalAnotherSeverity = '';
      me.selectedCriticalHealthType = 'Select operator';
      me.healthCriticalPct = null;
      me.selectedCriticalSeverityType = 'Select operator';
      me.majorAnotherPct = null;
      me.majorAnotherSeverity = '';
      me.majorPct = null;
      me.majorSeverity = ''
      me.selectedMajorHealthType = "Select operator";
      break;
    case 'label':
      me.errorMessage = null;
      me.dialOperatorerror = null;
      //me.setLabelWidgetProperties();
      break;
    default:
      //me.setGraphWidgetProperties();
  }
}

changeCriticalSeverityOperators(){
  const me = this;
  if(me.selectedCriticalHealthType !== "Select operator"){
  me.criticalAnotherSeverity = me.selectedCriticalSeverityType == "Critical" ? "Major" : me.selectedCriticalSeverityType == "Major" ? "Critcal" : "";
  }
  else{
    me.criticalAnotherPct =   null ;
    me.criticalAnotherSeverity = "";
  }
}

changeMajorSeverityOperators(){
  const me = this;
  if(me.selectedMajorHealthType !== "Select operator"){
  me.majorAnotherSeverity = me.selectedMajorSeverityType == "Critical" ? "Major" : me.selectedMajorSeverityType == "Major" ? "Critcal" : "";
  }
  else{
    me.majorAnotherPct = null;
    me.majorAnotherSeverity = "";
  }
}

changeCriticalOperatorType(){
  const me = this;
  me.criticalThreshold = me.selectedCriticalOperatorType == "Select operator" ? null : me.criticalThreshold;
}

changeMajorOperatorType(){
  const me = this;
  me.majorThreshold = me.selectedMajorOperatorType == "Select operator" ? null : me.majorThreshold;
}

changeCriticalSeverity(){
  const me = this;
  me.healthCriticalPct = me.selectedCriticalSeverityType == "Select operator" ? null : me.healthCriticalPct;
  me.selectedCriticalHealthType = me.selectedCriticalSeverityType == "Select operator" ? "Select operator" : me.selectedCriticalHealthType;
  me.criticalAnotherPct = me.selectedCriticalSeverityType == "Select operator" ? null : me.criticalAnotherPct;
  me.criticalAnotherSeverity = me.selectedCriticalSeverityType == "Select operator" ? "" : me.criticalAnotherSeverity;
}

changeMajorSeverity(){
  const me = this;
  me.majorPct = me.selectedMajorSeverityType == "Select operator" ? null : me.majorPct;
  me.selectedMajorHealthType = me.selectedMajorSeverityType == "Select operator" ?  "Select operator"  : me.selectedMajorHealthType;
  me.majorAnotherPct = me.selectedMajorSeverityType == "Select operator" ? null : me.majorAnotherPct;
  me.majorAnotherSeverity = me.selectedMajorSeverityType == "Select operator" ? "" : me.majorAnotherSeverity;
}

SelectedTableField(){
  if(this.selectedTableFieldType.length > 0){
    this.tableMessage = null;
  }
}

getFieldDisplayName(value : string){
const me = this;
let returnDisplayName;
for(var i =0; i< me.dropDownData.FieldDataOptions.length;i++){
  if(me.dropDownData.FieldDataOptions[i].value == value){
    returnDisplayName = me.dropDownData.FieldDataOptions[i].label;
    break;
  }
}
return returnDisplayName;
}

validateDialMeter(){
  const me = this;
let isValid = false;
  if (me.minDialValue === 0 && me.maxDialValue === 0) {
    //alert('Please enter non-zero values');
    me.dialOperatorerror = 'Please enter non-zero values';
    return true;
  }

  if (!me.selectedDialOperator || me.selectedDialOperator === '') {
   // alert('Please select Threshold sign');
   me.dialOperatorerror = "Please select Threshold sign";
    return true;
  }
  if (me.selectedDialOperator =="null" || me.selectedDialOperator === 'undefined') {
    // alert('Please select Threshold sign');
    me.dialOperatorerror = "Please select Threshold sign";
     return true;
   }
  if (me.minDialValue > me.maxDialValue) {
   // alert('Minimum should be less than Maximum');
   me.dialOperatorerror = "Minimum should be less than Maximum";
    return true;
  }

  if (me.warningDialValue <= me.minDialValue || me.warningDialValue >= me.maxDialValue) {
   // alert('Warning Threshold should be greater than Minimum and less than Maximum');
   me.dialOperatorerror =  'Warning Threshold should be greater than Minimum and less than Maximum';
   return true;
  }

  if (me.criticalDialValue <= me.minDialValue || me.criticalDialValue >= me.maxDialValue) {
   // alert('Critical Threshold should be greater than Minimum and less than Maximum');
   me.dialOperatorerror = 'Critical Threshold should be greater than Minimum and less than Maximum';
   return true;
  }

  if (!(me.selectedDialOperator === 'null' || me.selectedDialOperator === '')) {
    if (me.selectedDialOperator === '>' && me.criticalDialValue < me.warningDialValue) {
    //  alert('Critical Threshold should be greater than Warning');
    me.dialOperatorerror = 'Critical Threshold should be greater than Warning';
      return true;
    }
  }

  if (!(me.selectedDialOperator === 'null' || me.selectedDialOperator === '')) {
    if (me.selectedDialOperator === '<' && me.criticalDialValue > me.warningDialValue) {
     // alert('Critical Threshold should be less than Warning');
     me.dialOperatorerror = 'Critical Threshold should be less than Warning';
      return true;
    }
  }
  return false;

}
sortDropDownData(dataDrop){
 dataDrop.graphTypeOptions.sort((a,b) => a.value.localeCompare(b.value));
 dataDrop.widgetTypeOptions.sort((a,b) => a.value.localeCompare(b.value));
 dataDrop.categoryTypeDataOptions.sort((a,b) => a.value.localeCompare(b.value));
 dataDrop.corelatedTypeDataOPrions.sort((a,b) => a.value.localeCompare(b.value));
 dataDrop.tableTypeDataOptions.sort((a,b) => a.value.localeCompare(b.value));
 dataDrop.formulaTypeDataOptions.sort((a,b) => a.value.localeCompare(b.value));
 dataDrop.valueSampleData.sort((a,b) => a.value.localeCompare(b.value));
  return dataDrop;
}

changeDialOperator(){
  const me = this;
  me.dialOperatorerror = null;
}
onChangeTableFieldName(datafield){
let me =this;
console.log("datafield0",datafield);
}
}
