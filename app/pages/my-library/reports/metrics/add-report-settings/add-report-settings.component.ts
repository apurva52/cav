import { Component, ElementRef, Input, OnInit, QueryList, ViewChild, ViewChildren, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem, ConfirmationService, OrderList } from 'primeng';
import { ReportSet } from './service/add-report-settings.model';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { ADD_REPORT_SETTINGS_DATA, REPORT_SET_TABLE_DATA } from './service/add-report-settings.dummy';
import { AddReportSettingsData } from './service/add-report-settings.model';
import { DefaultPercentileLoadedState, DefaultPercentileLoadingErrorState, DefaultPercentileLoadingState, ReportGraphLoadedState, ReportGraphLoadingErrorState, ReportGraphLoadingState, ReportGroupLoadedState, ReportGroupLoadingErrorState, ReportGroupLoadingState, ReportPresetLoadedState, ReportPresetLoadingErrorState, ReportPresetLoadingState } from './service/add-report-settings.state';
import { AddReportSettingsService } from './service/add-report-settings.service'
import { SessionService } from 'src/app/core/session/session.service';
import { DerivedMetricIndicesComponent } from 'src/app/shared/derived-metric/derived-metric-indices/derived-metric-indices.component';
import { TemplateService } from '../../template/service/template.service'
import { AddReportService } from '../../metrics/add-report/service/add-report.service';
import { ReportTimebarLoadedState, ReportTimebarLoadingErrorState, ReportTimebarLoadingState } from '../add-report/service/add-report.state';
import { TableHeaderColumn } from 'src/app/shared/table/table.model';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import { ReportConstant } from '../add-report/service/add-report-enum';

@Component({
  selector: 'app-add-report-settings',
  templateUrl: './add-report-settings.component.html',
  styleUrls: ['./add-report-settings.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ConfirmationService]
})
export class AddReportSettingsComponent implements OnInit {

  @ViewChild('addTemplateCard', { read: ElementRef })
  @ViewChildren("row", { read: ElementRef }) rowElement:
    QueryList<ElementRef>;
  @ViewChild(OrderList) list: OrderList;
  @ViewChild('metricGroupOrder') metricGroupOrder: OrderList;
  @ViewChild('graph') graph: OrderList;
  // @ViewChild('group', {static: false}) group: ElementRef;
  addTemplateCard: ElementRef;
  error: AppError;
  empty: boolean;
  loading: boolean;
  data: AddReportSettingsData;
  breadcrumb: MenuItem[];

  reportSetBtnName = 'Add Report Set';
  reportSetName = '';

  firstCard: boolean = true;
  secondCard: boolean = true;
  thirdCard: boolean = true;
  fourthCard: boolean = true;

  groupNewEvent: any;
  groupEvent: any;
  graphListData = [];
  groupList = [];
  graphList = [];

  editReportSetData: any;
  selectedReportSet: any;
  selectedGroupName = [];
  selectedGraphName = [];

  fixedTrendCritical;
  fixedTrendMajor;
  fixedTrendMinor;

  isLegendEnable = false;
  isChartsPerIndices: boolean = false;

  isThreshold: boolean = false;
  selectedChartType: any = { label: 'Line', value: 0 };
  selectedGraphType: any = { label: 'Normal Graph', value: 0 };
  selectedFormulaType = [{ label: 'Avg', value: 0 }];
  formulaData: any = "Avg";

  dialogVisible: boolean = false;

  reportSetData = [];

  totalbuckets = 10;
  basedOn = -1;

  percentiles1 = [];
  percentiles2 = [];
  percentiles3 = [];
  percentiles4 = [];
  percentiles5 = [];
  percentileCss = [];
  onCancelButtonSelectedPer = [];

  selectedPercentileValueArr = [];
  selectedPercentileModelArr = [];
  defaultSelectedPercentile = [50, 80, 90, 95, 99]

  displayPerConf = false;
  isReportSetEdit = false;
  fromIndicesWindow = false;
  tagListFromIndices = [];
  dataFromSpecifed: any;
  selectedIndices = 'All';

  patternExpFromTxtArea: string;
  durationObj = {};

  totalRecords: number;
  cols: TableHeaderColumn[] = [];
  _selectedColumns: TableHeaderColumn[] = [];
  selectedRow: any;
  reportSetDataTable: any;

  selectedGraphData = [];
  selectedGraphChecked = [];
  isCheckedGraph = false;

  selectedGraph = [];
  selectedGroup = [];

  percentileData = [{ label: 50, value: 50 }, { label: 80, value: 80 }, { label: 90, value: 90 }, { label: 95, value: 95 },
  { label: 99, value: 99 }];

  isMasterCheck = false;
  selected = [];

  selectedMetricGroupArr = [];
  selectedMetricGrpRowVal = [];

  selectedMetricesRowVal = [];
  grpBySelectedMetricsMap = new Map();
  metricsListAccMetricGrp = new Map();

  blockuiForGroupGraph = false;
  customMetricGroup = false;

  constructor(
    public timebarService: TimebarService,
    private router: Router,
    private addReportSettingsService: AddReportSettingsService,
    public sessionService: SessionService, private confirmationService: ConfirmationService,
    public templateService: TemplateService,
    public addReportService: AddReportService) {
  }

  ngOnInit(): void {
    this.displayPerConf = false;
    this.fillPercentileArray();
    this.getDefaultPercentileArray();
    //this.selectDefaultPercentilesBtn();
    const me = this;
    me.breadcrumb = [
      { label: 'Home', routerLink: '/home/dashboard' },
      { label: 'System', routerLink: '/home/system' },
      { label: 'Reports', routerLink: '/reports/metrics' },
      { label: 'Add Report Settings' },
    ];
    me.data = ADD_REPORT_SETTINGS_DATA;
    me.reportSetDataTable = REPORT_SET_TABLE_DATA;
    me.cols = me.reportSetDataTable.headers[0].cols;
    for (const c of me.reportSetDataTable.headers[0].cols) {
      if (c.selected) {
        me._selectedColumns.push(c);
      }
    }
    me.getDuration();
  }


  // This method for group data call for one time on component load
  reportGroupList(duration) {
    const me = this;
    me.selectedIndices = 'All'
    const payload = {
      opType: 4,
      cctx: me.sessionService.session.cctx,
      duration: duration,
      tr: parseInt(this.sessionService.session.testRun.id),
      clientId: "Default",
      appId: "Default",
      selVector: null
    }
    me.blockuiForGroupGraph = true;
    me.addReportSettingsService.loadGroupData(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof ReportGroupLoadingState) {
          me.onLoadingGroup(state);
          return;
        }

        if (state instanceof ReportGroupLoadedState) {
          me.reportCustomMetricGroupList(duration,state);
          return;
        }
      },
      (state: ReportGroupLoadingErrorState) => {
        me.onLoadingErrorGroup(state);
      }
    );
  }

  reportCustomMetricGroupList(duration,normalGroup) {
    const me = this;
    const payload = {
      opType: 16,
      cctx: me.sessionService.session.cctx,
      duration: duration,
      tr: parseInt(this.sessionService.session.testRun.id),
      clientId: "Default",
      appId: "Default",
      selVector: null
    }
    me.blockuiForGroupGraph = true;
    me.addReportSettingsService.loadGroupData(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof ReportGroupLoadingState) {
          me.onLoadingGroup(state);
          return;
        }

        if (state instanceof ReportGroupLoadedState) {
          me.onLoadedGroup(state,normalGroup);
          return;
        }
      },
      (state: ReportGroupLoadingErrorState) => {
        me.onLoadingErrorGroup(state);
      }
    );
  }

  onLoadedGroup(state,normalGroup) {
    const me = this;
    me.timebarService.setLoading(false);
    me.blockuiForGroupGraph = false;
    me.patternExpFromTxtArea = '';
    let stateData = state.data.status;
    if (stateData.code != 200) {
      me.confirmationDialog("Error", stateData.msg);
      return;
    }
    me.error = null;
    me.loading = false;
    me.groupList = [];
    for (let i = 0; i < state.data.group.length; i++) {
      let json = state.data.group[i];
      json['label'] = state.data.group[i].groupName+"(Derived)";
      json['value'] = state.data.group[i].groupName+"(Derived)";
      json['glbMgId'] = state.data.group[i].glbMgId;
      json['mgId'] = state.data.group[i].mgId;
      json['hierarchicalComponent'] = state.data.group[i].hierarchicalComponent;
      json['metricTypeName'] = state.data.group[i].metricTypeName;
      json['vectorType'] = state.data.group[i].vectorType;
      json['groupcheck'] = false;
      json['customMetric'] = true;
      me.groupList.push(json);
    }
    for (let i = 0; i < normalGroup.data.group.length; i++) {
      let json = normalGroup.data.group[i];
      json['label'] = normalGroup.data.group[i].groupName;
      json['value'] = normalGroup.data.group[i].groupName;
      json['glbMgId'] = normalGroup.data.group[i].glbMgId;
      json['mgId'] = normalGroup.data.group[i].mgId;
      json['hierarchicalComponent'] = normalGroup.data.group[i].hierarchicalComponent;
      json['metricTypeName'] = normalGroup.data.group[i].metricTypeName;
      json['vectorType'] = normalGroup.data.group[i].vectorType;
      json['groupcheck'] = false;
      json['customMetric'] = false;
      me.groupList.push(json);
    }
    me.sortList(me.groupList);
    
    if (me.metricGroupOrder.filterValue) {
      let element = document.querySelector('[aria-label="metricsGrpFilter"]');
      element['value'] = null;
      me.metricGroupOrder.filterValue = "";
      me.metricGroupOrder.visibleOptions = me.groupList;
    }
    // if (!me.templateService.isEdit) {
    //   me.groupList[0].groupcheck = true;
    //   me.selectedGroupName = [me.groupList[0]];
    //   me.reportGraphList(me.groupList[0].groupName, state);
    // }
    // let event =[]
    // event['checked'] = true;
    // me.checkedGroup(state,event);
    if (!me.templateService.isEdit) {
      me.groupList[0].groupcheck = true;
      me.selectedMetricGrpRowVal[0] = me.groupList[0];
      me.customMetricGroup = me.groupList[0].customMetric;
      me.selectedMetricGroupArr.push(me.groupList[0]);
      me.getMetricesAccMetricGroup();
      // let event = {};
      // event['value'] = [me.groupList[0]]
      // me.onMetricGroupRowSelection(event);
    }
    if (me.templateService.isEdit) {
      me.templateService.isEdit = false;
      me.editTemplate();
    }
  }

  onLoadingGroup(state) {
    this.timebarService.setLoading(true);
  }
  onLoadingErrorGroup(state) {
    this.timebarService.setLoading(false);
  }
  sortList(event) {
    event.sort(function (a, b) {

      const genreA = a.label;
      const genreB = b.label;

      let comparison = 0;
      if (genreA > genreB) {
        comparison = 1;
      } else if (genreA < genreB) {
        comparison = -1;
      }
      return comparison;

    });
  }
  changeOrderGraphList(event) {
    const me = this;
    if (me.selectedChartType.value == 8) {
      if (me.selectedGraph.length > 2) {
        me.confirmationDialog("Error", "Correlate graph must have only two graph.");
        event.value.splice(event.value[0].length - 1);
        return;
      }
    }
    for (let i = 0; i < event.value.length; i++) {
      if (event.value[i].graphcheck) {
        event.value[i].graphcheck = true;
        me.selectedGraph.push(event.value[i].label);
      }
      else {
        event.value[0].graphcheck = false;
        for (let i = 0; i < me.selectedGraph.length; i++) {
          if (event.value[0].label === me.selectedGraph[i]) {
            me.selectedGraph.splice(i, 1);
          }
        }
      }
    }
    // if(me.selectedGraph.length == 0){
    //   me.selectedGroupName[0].groupcheck = false; 
    //  }
    //  else{
    //    me.selectedGroupName[0].groupcheck = true;
    //  }
    let tagArr = [];

    let hierArr = me.groupEvent.hierarchicalComponent;
    hierArr = hierArr.split('>');
    for (let j = 0; j < hierArr.length; j++) {
      let hierObj = {
        key: hierArr[j],
        value: 'All',
        mode: 2
      }
      tagArr.push(hierObj);
    }

    if (!me.isReportSetEdit) {
      let graphDataArr1 = me.getGraphNameArrObj(me.selectedGraph);
      for (let i = 0; i < graphDataArr1.length; i++) {
        let objectGroup = {
          graphNameObj: graphDataArr1[i],
          groupObject: me.groupEvent,
          subjectTag: [tagArr]
        }
        me.graphListData.push(objectGroup);
      }
    }
    if (me.isReportSetEdit) {
      let updateGraphList = [];
      for (let i = 0; i < me.graphListData.length; i++) {
        if (me.selectedGroupName[0].label !== me.graphListData[i].groupObject.groupName) {
          updateGraphList.push(me.graphListData[i]);
        }
      }
      me.graphListData = updateGraphList;
      let graphDataArr = me.getGraphNameArrObj(me.selectedGraph);
      for (let i = 0; i < graphDataArr.length; i++) {
        let objectGroup2 = {
          graphNameObj: graphDataArr[i],
          groupObject: me.groupEvent,
          subjectTag: [tagArr]
        }
        me.graphListData.push(objectGroup2);
      }
    }
  }
  checkedGraph(event, per) {
  }
  getGraphNameArrObj(graphNameArray) {
    const me = this;
    let graphDataObjArray = []
    try {
      if (graphNameArray && graphNameArray.length > 0) {
        if (me.graphList && me.graphList.length > 0) {
          for (let j = 0; j < graphNameArray.length; j++) {
            for (let i = 0; i < me.graphList.length; i++) {
              if (graphNameArray[j] === me.graphList[i].name) {
                graphDataObjArray.push(me.graphList[i]);
                break;
              }
            }
          }

        }
      }
      return graphDataObjArray;
    } catch (error) {
      console.error(error);
    }
  }

  // get graph list on select group value or init call 
  // reportGraphList(groupName, event) {

  //   // alert("reportGraphList");
  //   const me = this;
  //   me.isMasterCheck = false;
  //   me.groupEvent = me.getGroupNameObject(groupName);
  //   me.selectedGroup.push(groupName);

  //   for(let i = 0; i < me.groupList.length; i++){
  //     for(let j = 0; j < me.selectedMetricGroup.length; j++){
  //       if(me.selectedMetricGroup[j].groupName === me.groupList[i].groupName){
  //         me.selectedMetricGroup[j].groupcheck = true;
  //       }
  //    }
  // }
  //   //*This is for edit ReportSet multipleGroup*//
  //   if (this.isReportSetEdit) {
  //     for (let i = 0; i < me.editReportSetData.gCtx.length; i++) {
  //       for (let j = 0; j < me.groupList.length; j++) {
  //         if (me.editReportSetData.gCtx[i].measure.mg === me.groupList[j].groupName) {
  //           me.groupNewEvent = me.editReportSetData;
  //         }
  //       }
  //     }
  //   }

  //   me.graphList = [];
  //   const groupNameObject = me.getGroupNameObject(groupName);
  //   const payload = {
  //     opType: 5,
  //     cctx: me.sessionService.session.cctx,
  //     duration: me.durationObj,
  //     tr: parseInt(me.sessionService.session.testRun.id),
  //     clientId: "Default",
  //     appId: "Default",
  //     mgId: groupNameObject.mgId,
  //     glbMgId: groupNameObject.glbMgId,
  //     grpName: groupName,

  //   }
  //   if (groupName) {
  //     me.addReportSettingsService.loadGraphData(payload).subscribe(
  //       (state: Store.State) => {
  //         if (state instanceof ReportGraphLoadingState) {
  //           me.onLoadingGraph(state);
  //           return;
  //         }

  //         if (state instanceof ReportGraphLoadedState) {
  //           me.onLoadedGraph(state, me.groupNewEvent, event);
  //           return;
  //         }
  //       },
  //       (state: ReportGraphLoadingErrorState) => {
  //         me.onLoadingErrorGraph(state);
  //       }
  //     );

  //   }
  // }

  // onLoadedGraph(state, groupEvent, event) {
  //   const me = this;
  //   me.graphList = [];
  //   let groupName = state.data.groupName
  //   let stateData= state.data.status;
  //   if(stateData.code != 200){
  //     this.confirmationDialog("Error",stateData.msg);
  //     return;
  //  }
  //   let backup = [];
  //   me.error = null;
  //   me.loading = false;
  //   if (groupEvent && groupEvent.option) {
  //     groupEvent = groupEvent.option;
  //   }
  //   for (let i = 0; i < state.data.graph.length; i++) {
  //     const json = state.data.graph[i];
  //     json['label'] = state.data.graph[i].name;
  //     json['value'] = state.data.graph[i].name;
  //     json['metricId'] = state.data.graph[i].metricId;
  //     json['name'] = state.data.graph[i].name;
  //     json['glbMetricId'] = state.data.graph[i].glbMetricId;
  //     json['description'] = state.data.graph[i].description;
  //     json['graphcheck'] = false;
  //     json['Group'] = groupName;
  //     me.graphList.push(json);
  //   }
  //   me.sortList(me.graphList);
  //   me.graphList = [...me.graphList];


  //   // if (!me.templateService.isEdit && !me.isReportSetEdit) {
  //   //   me.graphList[0].graphcheck = true;
  //   //   me.selectedGraphName.push(me.graphList[0]);
  //   //   let dataEvent = {};
  //   //   dataEvent['value'] = me.selectedGraphName; 
  //   //   me.changeOrderGraphList(dataEvent);
  //   // }

  //   if (!me.templateService.isEdit && !me.isReportSetEdit) {
  //     me.graphList[0].graphcheck = true;
  //     me.selectedMetrices.push(me.graphList[0]);
  //     let dataEvent = {};
  //     dataEvent['value'] = me.selectedMetrices; 
  //     me.createSelectedMetricgroupAndMetrices(dataEvent);
  //   }

  //    if(!event.value[0].groupcheck){
  //     for (let i = 0; i < me.graphList.length; i++) {
  //       me.graphList[i].graphcheck = false;
  //     }
  //   }
  //   if (me.isReportSetEdit) {
  //     if (groupEvent) {
  //       for (let i = 0; i < me.graphList.length; i++) {
  //         for (let j = 0; j < me.groupNewEvent.gCtx.length; j++) {
  //           if (me.graphList[i].name == me.groupNewEvent.gCtx[j].measure.metric && me.groupNewEvent.gCtx[j].measure.mg === me.selectedGroupName[0].label) {
  //             me.graphList[i].graphcheck = true;
  //             backup.push(me.graphList[i]);
  //           }
  //         }
  //       }
  //       me.selectedGraphName = backup;
  //       let dataEvent = {};
  //       dataEvent['value'] = backup;
  //       me.changeOrderGraphList(dataEvent);
  //     }
  //   }
  // }

  // onLoadingGraph(state) { }
  // onLoadingErrorGraph(state) { }


  addReportSet() {
    const me = this;
    let graphNameObject = [];
    let formula = [];
    let allGctx = [];
    try {
      const el = this.rowElement.find(r => r.nativeElement.getAttribute("id") === this.groupList[0].groupName);
      el.nativeElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      this.selectedGroupName = null;

      let graphDataName = []
      // for(let i = 0; i < me.selectedGraphName.length; i++){
      //   graphDataName.push(me.selectedGraphName[i].name);
      // }
      if (me.formulaData == "Choose") {
        me.confirmationDialog("Error", "Please select atleast one formula type.");
        me.selectedGroupName = [me.groupList[0]];
        return;
      }
      let graphName = me.selectedGraph;
      if (me.reportSetName === '' || me.reportSetName === null) {
        me.confirmationDialog("Error", "Please Enter Report Set Name");
        me.selectedGroupName = [me.groupList[0]];
        return;
      }
      let regex_report_name = new RegExp('^[a-zA-Z][A-Za-z0-9_%\s\/ \. ()-]*$');

      if (!regex_report_name.test(me.reportSetName)) {
        this.confirmationDialog("Error", "Please enter valid Report Set Name. Report Set Name must start with Alphabet . Maximum length should be 64.  Allowed Characters are Alpha,numeric,space and special characters(/%()_.-)");
        me.selectedGroupName = [me.groupList[0]];
        return;
      }
      if (me.reportSetName.length > 64) {
        me.confirmationDialog("Error", "Enter Report Set Name <= 64 characters.");
        me.selectedGroupName = [me.groupList[0]];
        return;
      }

      for (let i = 0; i < me.reportSetData.length; i++) {
        if (me.reportSetName == me.reportSetData[i].rsName) {
          me.confirmationDialog("Error", "Duplicate report set name.Please enter unique name.");
          me.selectedGroupName = [me.groupList[0]];
          return;
        }
      }
      if (me.selectedMetricGroupArr == undefined || me.selectedMetricGroupArr.length == 0) {
        me.confirmationDialog("Error", "Please select atleast one Metric Group.");
        me.selectedGroupName = [me.groupList[0]];
        return;
      }

      for (let k = 0; k < me.selectedFormulaType.length; k++) {
        formula.push(me.selectedFormulaType[k].value);
      }

      let pctDataArr = [];
      if (me.selectedGraphType.value == 1) {
        pctDataArr = this.addReportSettingsService.getDefaultPctValues.arrPercentileValues;
        let pctupdateArr = me.getPercentileCountArr();
        if (pctupdateArr.length > 0) {
          pctDataArr = pctupdateArr;
        }
      }
      for (let i = 0; i < graphName.length; i++) {
        for (let j = 0; j < me.graphListData.length; j++) {
          for (let k = 0; k < me.selectedGroup.length; k++) {
            if (graphName[i] === me.graphListData[j].graphNameObj.label && me.graphListData[j].groupObject.groupName === me.selectedGroup[k]) {
              graphNameObject.push(me.graphListData[j]);
              break;
            }
          }
        }
      }

      allGctx = me.createGctxForReportSet();
      // me.graphListData = graphNameObject;
      // for (let i = 0; i < me.graphListData.length; i++) {
      //   let tagArr = [];

      //   let gctx = {
      //     glbMetricId: me.graphListData[i].groupObject.glbMgId,
      //     measure: {
      //       mgType: me.graphListData[i].groupObject.metricTypeName,
      //       mgTypeId: -1,
      //       mg: me.graphListData[i].groupObject.value,
      //       mgId: me.graphListData[i].groupObject.mgId,
      //       metric: me.graphListData[i].graphNameObj.label,
      //       metricId: me.graphListData[i].graphNameObj.metricId,
      //       showTogether: 0
      //     },
      //     subject: {
      //       tags: [],
      //     },
      //   }

      //   let subjectIndicesTags = me.graphListData[i].subjectTag;
      //   if (subjectIndicesTags && subjectIndicesTags.length > 0) {
      //     for (let j = 0; j < subjectIndicesTags.length; j++) {
      //       gctx.subject.tags = subjectIndicesTags[j];
      //       allGctx.push(gctx);
      //     }
      //   }
      //   else {
      //     let hierArr = me.graphListData[i].groupObject.hierarchicalComponent;
      //     hierArr = hierArr.split('>');
      //     for (let j = 0; j < hierArr.length; j++) {
      //       let hierObj = {
      //         key: hierArr[j],
      //         value: 'All',
      //         mode: 2
      //       }
      //       tagArr.push(hierObj)
      //     }
      //     gctx.subject.tags = [tagArr];
      //     allGctx.push(gctx);
      //   }
      // }

      let reportSetObj: ReportSet = {
        rsName: me.reportSetName,
        dt: me.selectedGraphType.value,
        ct: me.selectedChartType.value,
        fType: formula,
        basedOn: me.basedOn,
        sl: me.isLegendEnable,
        tb: me.totalbuckets,
        cpi: me.isChartsPerIndices,
        gCtx: allGctx,
        indices: me.patternExpFromTxtArea,
      };

      if (me.isThreshold) {
        if (me.fixedTrendMinor == undefined && me.fixedTrendMajor == undefined && me.fixedTrendCritical == undefined) {
          me.confirmationDialog("Error", "Please enter some threshold value.");
          me.selectedGroupName = [me.groupList[0]];
          return;
        } else {
          reportSetObj.threshold = {
            min: me.fixedTrendMinor,
            maj: me.fixedTrendMajor,
            cri: me.fixedTrendCritical
          }
        }
      }



      if (me.selectedGraphType.value == 1) {
        reportSetObj['pct'] = pctDataArr;
        /*reportSetObj['pct'] = me.percentileData;*/
      }

      me.reportSetData.push(reportSetObj);
      me.addReportSettingsService.reportSetData = me.reportSetData;
      me.clearReportSet();

      // me.selectDefaultPercentilesBtn();

    } catch (error) {
      console.error(error);
    }
  }

  editReportSet(event) {
    const me = this;
    let formulaUpdate = [];
    me.selectedGroupName = [];
    me.selectedPercentileModelArr = [];
    me.selectedGraphName = [];
    me.graphListData = [];
    me.selectedGraph = [];
    me.selectedGroup = [];

    // me.groupList = [];
    me.graphList = [];
    me.selectedMetricGroupArr = [];
    me.selectedMetricGrpRowVal = [];
    me.selectedMetricesRowVal = [];
    me.grpBySelectedMetricsMap = new Map();

    try {
      me.isReportSetEdit = true;
      me.addReportSettingsService.previousNameInUpdateRptSet = event.data.rsName;
      me.editReportSetData = event.data;
      me.reportSetName = event.data.rsName;
      me.isLegendEnable = event.data.sl;
      me.totalbuckets = event.data.tb;
      me.isChartsPerIndices = event.data.cpi;

      for (let i = 0; i < me.data.addTemplateMenuOptions.dropDownGraph.length; i++) {
        if (event.data.dt == me.data.addTemplateMenuOptions.dropDownGraph[i].value) {
          me.selectedGraphType = me.data.addTemplateMenuOptions.dropDownGraph[i];
        }
      }
      if (event.data.dt == 0) {
        let chart_option = me.data.addTemplateMenuOptions.dropDown;
        for (let i = 0; i < chart_option.length; i++) {
          if (event.data.ct == chart_option[i].value) {
            me.selectedChartType = me.data.addTemplateMenuOptions.dropDown[i];
          }
        }
      }
      else if (event.data.dt == 1) {
        let chart_option = me.data.addTemplateMenuOptions.graphPercentile;
        for (let i = 0; i < chart_option.length; i++) {
          if (event.data.ct == chart_option[i].value) {
            me.selectedChartType = me.data.addTemplateMenuOptions.graphPercentile[i];
          }
        }
      }
      else if (event.data.dt == 2) {
        let chart_option = me.data.addTemplateMenuOptions.graphSlab;
        for (let i = 0; i < chart_option.length; i++) {
          if (event.data.ct == chart_option[i].value) {
            me.selectedChartType = me.data.addTemplateMenuOptions.graphSlab[i];
          }
        }
      }
      if (event.data.dt == 1) {
        me.percentileData = []
        for (let index = 0; index < event.data.pct.length; index++) {
          let element = { label: event.data.pct[index], value: event.data.pct[index] };
          me.percentileData.push(element);
        }
        me.basedOn = event.data.basedOn;
      }
      else if (event.data.dt == 2) {
        let based_On = me.data.addTemplateMenuOptions.dropDownSlab;
        based_On = me.data.addTemplateMenuOptions.dropDownSlab;
        for (let i = 0; i < based_On.length; i++) {
          if (event.data.basedOn == based_On[i].value) {
            me.basedOn = me.data.addTemplateMenuOptions.dropDownSlab[i].value;
          }
        }
      }
      for (let i = 0; i < event.data.fType.length; i++) {
        for (let j = 0; j < me.data.addTemplateMenuOptions.dropDownBar.length; j++) {
          if (event.data.fType[i] == me.data.addTemplateMenuOptions.dropDownBar[j].value) {
            formulaUpdate.push(me.data.addTemplateMenuOptions.dropDownBar[j]);
          }
        }
      }
      me.selectedFormulaType = formulaUpdate;
      let formuladata = [];
      for (let i = 0; i < me.selectedFormulaType.length; i++) {
        formuladata.push(me.selectedFormulaType[i].label);
      }
      me.formulaData = formuladata;
      if (event.data && event.data.threshold) {
        me.isThreshold = true;
        //   me.fixedTrendMinor = event.data.threshold.min;
        //   me.fixedTrendMajor = event.data.threshold.maj;
        //   me.fixedTrendCritical = event.data.threshold.cri;
        // }
        if (event.data.threshold.min > -1) {
          me.fixedTrendMinor = event.data.threshold.min;
        } else {
          me.fixedTrendMinor = null;
        }
        if (event.data.threshold.maj > -1) {
          me.fixedTrendMajor = event.data.threshold.maj;
        } else {
          me.fixedTrendMajor = null;
        }
        if (event.data.threshold.cri > -1) {
          me.fixedTrendCritical = event.data.threshold.cri;
        } else {
          me.fixedTrendCritical = null;
        }
      }
      else {
        me.isThreshold = false;
      }

      if (event.data && event.data.pct) {
        me.onCancelButtonSelectedPer = event.data.pct;
        for (let i = 0; i < event.data.pct.length; i++) {
          me.selectedPercentileModelArr[event.data.pct[i]] = true;
        }
      }

      me.createMapFromGctx(event.data.gCtx);

      // if (event.data && event.data.indices) {
      //   me.selectedIndices = "Selected Indices";
      //   me.patternExpFromTxtArea = event.data.indices;

      // }
      // else {
      //   me.selectedIndices = "All";
      //   me.patternExpFromTxtArea = '';
      // }

      // for (let j = 0; j < this.groupList.length; j++) {
      //   if (event.data.gCtx[0].measure.mg === this.groupList[j].label) {
      //     me.selectedGroupName = [this.groupList[j]];
      //   }
      // }
      // for (let i = 0; i < me.editReportSetData.gCtx.length; i++) {
      //   for (let j = 0; j < me.groupList.length; j++) {
      //     if (me.editReportSetData.gCtx[i].measure.mg === me.groupList[j].groupName) {
      //       me.groupList[j].groupcheck = true;
      //     }
      //   }
      // }
      // me.groupList[0].groupcheck = false;
      // me.selectedGroupName[0].groupcheck = true;
      // me.onMetricGroupRowSelection(me.selectedGroupName[0].label);

    } catch (error) {
      console.error(error);
    }
  }/**
   * This method is used for open the derived Indices window
   * @param dmIndices
   */
  openDerivedIndecesWindow(dmIndices: DerivedMetricIndicesComponent) {
    const me = this;
    //if (me.selectedGroupName == undefined || me.selectedGroupName == null) {
    if (me.selectedMetricGrpRowVal.length <= 0 || !me.selectedMetricGrpRowVal[0]) {
      me.selectedIndices = "All";
      me.confirmationDialog("Error", "please select atleast one Group Name");
      me.selectedGroupName = [me.groupList[0]];
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select the group name.' });
      return;
    }

    //if (me.selectedGraphName == undefined || me.selectedGraphName == null || me.selectedGraphName.length < 1) {
    if (me.selectedMetricesRowVal.length <= 0 || !me.selectedMetricesRowVal[0]) {
      me.selectedIndices = "All";
      // alert("please select atleast one Metric");
      me.confirmationDialog("Error", "please select atleast one Metric");
      me.selectedGroupName = [me.groupList[0]];
      // this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please Select the graph name.' });
      return;
    }
    // let lastSelectedGrpName = me.selectedGroupName;
    // let groupName = lastSelectedGrpName[0].groupName;
    let groupName = me.selectedMetricGrpRowVal[0].label;
    dmIndices.openDerivedIndecesWindowForRule(this.durationObj, groupName, me.groupList);
    me.selectedIndices = "All";
  }

  getDataFromIndices(data: string, tagList: any[]) {
    const me = this;
    // let specifiedArr = [];
    // let arrOfTags = [];
    // let splitDataForSpecified = [];

    me.dataFromSpecifed = `${data}`;
    me.selectedIndices = "Selected Indices";
    me.patternExpFromTxtArea = me.dataFromSpecifed;

    me.updateIndicesInfoForHighlightedMetrics(me.patternExpFromTxtArea, tagList);

    // if (me.dataFromSpecifed && me.dataFromSpecifed != "" && me.dataFromSpecifed.indexOf("PATTERN#") == -1) {
    //   let arrSpecified = me.dataFromSpecifed.split(",");
    //   if (arrSpecified && arrSpecified.length > 0) {
    //     let hierarchicalArr = me.groupEvent.hierarchicalComponent.split('>');
    //     for (let i = 0; i < arrSpecified.length; i++) {
    //       splitDataForSpecified = arrSpecified[i].split('>');
    //       specifiedArr = [];
    //       for (let j = 0; j < hierarchicalArr.length; j++) {
    //         let jsonObj = {};
    //         jsonObj['key'] = hierarchicalArr[j]
    //         jsonObj['value'] = splitDataForSpecified[j];
    //         jsonObj['mode'] = 1;
    //         specifiedArr.push(jsonObj);
    //       }

    //       arrOfTags.push(specifiedArr);


    //     }
    //   }
    //   me.dataFromSpecifed = arrOfTags;
    // }
    // me.fromIndicesWindow = true;
    // let arrSpecifiedTagList = [];
    // arrSpecifiedTagList.push(tagList);
    // me.tagListFromIndices = arrSpecifiedTagList;
    // let groupGraphData = me.graphListData;
    // if (this.selectedIndices == 'Selected Indices') {
    //   let dataIndicesArr;
    //   if (tagList.length > 0) {
    //     dataIndicesArr = me.tagListFromIndices;
    //   }
    //   else {
    //     dataIndicesArr = me.dataFromSpecifed;
    //   }
    //   for (let i = 0; i < groupGraphData.length; i++) {
    //     if (groupGraphData[i].groupObject.groupName == me.groupEvent.groupName) {
    //       me.graphListData[i]['subjectTag'] = dataIndicesArr;
    //     }
    //   }
    // }
  }
  clickAllIndices() {
    const me = this;
    me.patternExpFromTxtArea = '';
    me.updateIndicesInfoForHighlightedMetrics(me.patternExpFromTxtArea, null);
    //let groupGraphData = me.graphListData;
    // for (let i = 0; i < groupGraphData.length; i++) {
    //   if (groupGraphData[i].groupObject.groupName == me.groupEvent.groupName) {
    //     let tagArr = [];
    //     let hierArr = me.groupEvent.hierarchicalComponent;
    //     hierArr = hierArr.split('>');
    //     for (let j = 0; j < hierArr.length; j++) {
    //       let hierObj = {
    //         key: hierArr[j],
    //         value: 'All',
    //         mode: 2
    //       }
    //       tagArr.push(hierObj);
    //     }
    //     me.graphListData[i]['subjectTag'] = [tagArr];
    //   }
    // }


  }
  clearReportSet() {
    const me = this;
    me.patternExpFromTxtArea = '';
    me.reportSetName = '';
    me.selectedGraph = [];
    me.selectedGroup = [];
    me.selectedChartType = { label: 'Line', value: 0, };
    me.selectedGraphType = { label: 'Normal Graph', value: 0 };
    me.isThreshold = false;
    me.fixedTrendMinor = null;
    me.fixedTrendMajor = null;
    me.fixedTrendCritical = null;
    me.isChartsPerIndices = false;
    me.selectedFormulaType = [{ label: 'Avg', value: 0 }];
    me.formulaData = "Avg";
    me.basedOn = -1;
    me.isLegendEnable = false;
    me.totalbuckets = 10;
    me.selectedGroupName = [];
    me.selectedGraphName = [];
    me.graphListData = [];
    me.onCancelButtonSelectedPer = [];
    me.selectedPercentileModelArr = [];

    me.selectedMetricGroupArr = [];
    me.selectedMetricGrpRowVal = [];
    me.selectedMetricesRowVal = [];
    me.grpBySelectedMetricsMap = new Map();
    me.metricsListAccMetricGrp = new Map();

    me.customMetricGroup = false;
    me.getDefaultPercentileArray();
    me.getDuration();
    //  if(me.group){
    //   me.group.nativeElement.value = "";
    //   // this.applyFilter("");
    //   }   
    // if(me.graph && me.graph.filterValue){
    //   me.graph.filterValue = "";
    // }
    // me.reportGroupList();
  }
  getPercentileCountArr() {
    const me = this;
    let arrPer = [];

    try {
      for (let i = 1; i <= me.selectedPercentileModelArr.length; i++) {
        if (me.selectedPercentileModelArr[i]) {
          arrPer.push(i)
        }
      }
      return arrPer;

    } catch (error) {
      console.error(error);
    }
  }

  updateReportSet() {
    const me = this;
    let formula = [];
    let updatedGctx = [];
    let graphName = this.selectedGraphName;

    try {
      const el = this.rowElement.find(r => r.nativeElement.getAttribute("id") === this.groupList[0].groupName);
      el.nativeElement.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      this.selectedGroupName = null;

      if (me.reportSetName === '' || me.reportSetName == null) {
        me.confirmationDialog("Error", "Please Enter Report Set Name");
        me.selectedGroupName = [me.groupList[0]];
        return;
      }
      if (me.formulaData == "Choose") {
        me.confirmationDialog("Error", "Please select atleast one formula type.");
        me.selectedGroupName = [me.groupList[0]];
        return;
      }
      let regex_report_name = new RegExp('^[a-zA-Z][A-Za-z0-9_%\s\/ \. ()-]*$');
      let rpt = me.reportSetName;
      if (!regex_report_name.test(rpt)) {
        me.confirmationDialog("Error", "Please enter valid Report Set Name.\r\nReport Set "
          + "Name must start with alphabet. \r\n Maximum length is 64. \r\nAllowed "
          + "characters are alphanumeric and  following special characters: ( ) % _  . ");
        me.selectedGroupName = [me.groupList[0]];
        return;
      }
      if (me.reportSetName.length > 64) {
        me.confirmationDialog("Error", "Enter Report Set Name <= 64 characters.");
        me.selectedGroupName = [me.groupList[0]];
        return;
      }

      for (let i = 0; i < me.reportSetData.length; i++) {
        if (me.reportSetName == me.reportSetData[i].rsName && !me.isReportSetEdit) {
          me.confirmationDialog("Error", "Duplicate report set name.Please enter unique name.");
          me.selectedGroupName = [me.groupList[0]];
          return;
        }
        else if (me.isReportSetEdit) {
          if (me.addReportSettingsService.previousNameInUpdateRptSet !== me.reportSetName) {
            for (let i = 0; i < me.reportSetData.length; i++) {
              if (me.reportSetName == me.reportSetData[i].rsName) {
                me.confirmationDialog("Error", "Duplicate report set name.Please enter unique name.");
                me.selectedGroupName = [me.groupList[0]];
                return;
              }
            }
          }
        }
      }
      if (me.selectedMetricGroupArr == undefined || me.selectedMetricGroupArr.length == 0) {
        me.confirmationDialog("Error", "Please select atleast one Metric Group.");
        me.selectedGroupName = [me.groupList[0]];
        return;
      }

      updatedGctx = me.createGctxForReportSet();

      // for (let i = 0; i < me.graphListData.length; i++) {
      //   let tagArr = [];

      //   let gctx = {
      //     glbMetricId: me.graphListData[i].groupObject.glbMgId,
      //     measure: {
      //       mgType: me.graphListData[i].groupObject.metricTypeName,
      //       mgTypeId: -1,
      //       mg: me.graphListData[i].groupObject.value,
      //       mgId: me.graphListData[i].groupObject.mgId,
      //       metric: me.graphListData[i].graphNameObj.label,
      //       metricId: me.graphListData[i].graphNameObj.metricId,
      //       showTogether: 0
      //     },
      //     subject: {
      //       tags: [],
      //     },
      //   }

      //   let subjectIndicesTags = me.graphListData[i].subjectTag;
      //   if (subjectIndicesTags && subjectIndicesTags.length > 0) {
      //     for (let j = 0; j < subjectIndicesTags.length; j++) {
      //       gctx.subject.tags = subjectIndicesTags[j];
      //       updatedGctx.push(gctx);
      //     }
      //   }
      //   else {
      //     let hierArr = me.graphListData[i].groupObject.hierarchicalComponent;
      //     hierArr = hierArr.split('>');
      //     for (let j = 0; j < hierArr.length; j++) {
      //       let hierObj = {
      //         key: hierArr[j],
      //         value: 'All',
      //         mode: 2
      //       }
      //       tagArr.push(hierObj)
      //     }
      //     gctx.subject.tags = [tagArr];
      //     updatedGctx.push(gctx);
      //   }
      // }

      for (let k = 0; k < me.selectedFormulaType.length; k++) {
        formula.push(me.selectedFormulaType[k].value);
      }

      let pctDataArr = [];
      if (me.selectedGraphType.value == 1) {
        pctDataArr = this.addReportSettingsService.getDefaultPctValues.arrPercentileValues;
        let pctupdateArr = me.getPercentileCountArr();
        if (pctupdateArr.length > 0) {
          pctDataArr = pctupdateArr;
        }
      }

      let reportSetObj: ReportSet = {
        rsName: me.reportSetName,
        dt: me.selectedGraphType.value,
        ct: me.selectedChartType.value,
        fType: formula,
        basedOn: me.basedOn,
        sl: me.isLegendEnable,
        tb: me.totalbuckets,
        cpi: me.isChartsPerIndices,
        gCtx: updatedGctx,
        pct: pctDataArr,
        indices: me.patternExpFromTxtArea
      }
      if (me.isThreshold) {
        if (me.fixedTrendMinor == undefined && me.fixedTrendMajor == undefined && me.fixedTrendCritical == undefined) {
          me.confirmationDialog("Error", "Please enter some threshold value.");
          me.selectedGroupName = [me.groupList[0]];
          return;
        } else {
          reportSetObj.threshold = {
            min: me.fixedTrendMinor,
            maj: me.fixedTrendMajor,
            cri: me.fixedTrendCritical
          }
        }
      }
      else {
        me.fixedTrendMinor = null;
        me.fixedTrendMajor = null;
        me.fixedTrendCritical = null;
      }
      let previousReportsetName = me.addReportSettingsService.previousNameInUpdateRptSet;
      for (let i = 0; i < me.reportSetData.length; i++) {
        if (previousReportsetName == me.reportSetData[i].rsName) {
          me.reportSetData[i] = reportSetObj;
          break;
        }
      }
      me.addReportSettingsService.reportSetData = me.reportSetData;
      me.isReportSetEdit = false;

      me.clearReportSet();
      me.selectedPercentileModelArr = [];
      me.getDefaultPercentileArray();
      // me.selectDefaultPercentilesBtn();

    } catch (error) {
      console.error(error);
    }
  }

  // for edit template on available list in template
  editTemplate() {
    try {
      const me = this;
      // me.templateService.isEdit = false;
      let readTemplateData = me.templateService.editAddedTemplate.data.template;
      me.reportSetData = readTemplateData.ars;
      me.addReportSettingsService.reportSetData = me.reportSetData;
      me.editReportSetData = readTemplateData.ars[0];
      me.editTemplateData(readTemplateData.ars[0]);

    } catch (error) {
      console.error(error);
    }
  }

  editTemplateData(event) {
    const me = this;
    let formulaUpdate = [];
    me.selectedGroupName = [];
    try {
      me.reportSetName = event.rsName;

      for (let i = 0; i < me.data.addTemplateMenuOptions.dropDownGraph.length; i++) {
        if (event.dt == me.data.addTemplateMenuOptions.dropDownGraph[i].value) {
          me.selectedGraphType = me.data.addTemplateMenuOptions.dropDownGraph[i];
        }
      }

      let chart_option = me.data.addTemplateMenuOptions.dropDown;
      if (event.dt == 1) {
        chart_option = me.data.addTemplateMenuOptions.graphPercentile;
      }
      else if (event.dt == 2) {
        chart_option = me.data.addTemplateMenuOptions.graphSlab;
      }

      for (let i = 0; i < chart_option.length; i++) {
        if (event.ct == chart_option[i].value) {
          me.selectedChartType = me.data.addTemplateMenuOptions.dropDown[i];
        }
      }

      me.isLegendEnable = event.sl;
      me.totalbuckets = event.tb;
      me.isChartsPerIndices = event.cpi;

      for (let i = 0; i < event.fType.length; i++) {
        for (let j = 0; j < me.data.addTemplateMenuOptions.dropDownBar.length; j++) {
          if (event.fType[i] == me.data.addTemplateMenuOptions.dropDownBar[j].value) {
            formulaUpdate.push(me.data.addTemplateMenuOptions.dropDownBar[j]);
          }
        }
      }
      me.selectedFormulaType = formulaUpdate;
      let ftData = []
      for (let i = 0; i < me.selectedFormulaType.length; i++) {
        ftData.push(me.selectedFormulaType[i].label);
      }
      me.formulaData = ftData;
      if (event && event.threshold) {
        me.isThreshold = true;
        if (event.threshold.min > -1) {
          me.fixedTrendMinor = event.threshold.min;
        } else {
          me.fixedTrendMinor = null;
        }
        if (event.threshold.maj > -1) {
          me.fixedTrendMajor = event.threshold.maj;
        } else {
          me.fixedTrendMajor = null;
        }
        if (event.threshold.cri > -1) {
          me.fixedTrendCritical = event.threshold.cri;
        } else {
          me.fixedTrendCritical = null;
        }
      }
      else {
        me.isThreshold = false;
      }

      if (event.dt == 1) {
        let based_On = me.data.addTemplateMenuOptions.dropDownPercentile;
        based_On = me.data.addTemplateMenuOptions.dropDownPercentile;
        for (let i = 0; i < based_On.length; i++) {
          if (event.basedOn == based_On[i].value) {
            me.basedOn = me.data.addTemplateMenuOptions.dropDownPercentile[i].value;
          }
        }
      }

      else if (event.dt == 2) {
        let based_On2 = me.data.addTemplateMenuOptions.dropDownSlab;
        based_On2 = me.data.addTemplateMenuOptions.dropDownSlab;
        for (let i = 0; i < based_On2.length; i++) {
          if (event.basedOn == based_On2[i].value) {
            me.basedOn = me.data.addTemplateMenuOptions.dropDownSlab[i].value;
          }
        }
      }
      if (event && event.pct) {
        // let finalArr = [];
        for (let i = 0; i < event.pct.length; i++) {
          for (let j = 0; j < me.selectedPercentileModelArr.length; j++) {
            me.selectedPercentileModelArr[event.pct[i]] = true;
            // finalArr.push(me.selectedPercentileModelArr[event.pct[i]]);
          }
        }
        // me.selectedPercentileModelArr = finalArr;
      }
      me.selectedRow = me.reportSetData[0];
      me.selectedGroupName = event.gCtx[0].measure.mg;
      let dataEvent = {};
      dataEvent['data'] = event;
      me.editReportSet(dataEvent);

    } catch (error) {
      console.error(error);
    }
  }

  keyPressOnMinor(event) {
    let numberValue = event.key;
    if (this.fixedTrendMinor) {
      numberValue = this.fixedTrendMinor + numberValue;
      if (parseInt(numberValue) > 999999999999) {
        event.preventDefault();
        return;
      }
    }
    if ((event.charCode == 48 && !this.fixedTrendMinor) || event.charCode == 45) {
      event.preventDefault();
      return;
    }
  }
  keyPressOnMajor(event) {
    let numberValue = event.key;
    if (this.fixedTrendMajor) {
      numberValue = this.fixedTrendMajor + numberValue;
      if (parseInt(numberValue) > 999999999999) {
        event.preventDefault();
        return;
      }
    }
    if ((event.charCode == 48 && !this.fixedTrendMajor) || event.charCode == 45) {
      event.preventDefault();
      return;
    }
  }
  keyPressOnCritical(event) {
    let numberValue = event.key;
    if (this.fixedTrendCritical) {
      numberValue = this.fixedTrendCritical + numberValue;
      if (parseInt(numberValue) > 999999999999) {
        event.preventDefault();
        return;
      }
    }
    if ((event.charCode == 48 && !this.fixedTrendCritical) || event.charCode == 45) {
      event.preventDefault();
      return;
    }
  }
  keyPressOnBucket(event) {
    let numberValue = event.key;
    if (this.totalbuckets) {
      numberValue = this.totalbuckets + numberValue;
      if (parseInt(numberValue) > 10) {
        event.preventDefault();
        return;
      }
    }
    if (event.charCode == 46 || (event.charCode == 48 && !this.totalbuckets)
      || event.charCode == 45 || event.charCode == 64 || event.charCode == 104
      || event.charCode == 35 || event.charCode == 33 || event.charCode == 36
      || event.charCode == 37 || event.charCode == 94 || event.charCode == 38
      || event.charCode == 42 || event.charCode == 40 || event.charCode == 41
      || event.charCode == 95 || event.charCode == 61 || event.charCode == 43
      || event.charCode == 60 || event.charCode == 62 || event.charCode == 63
      || event.charCode == 47 || event.charCode == 32 || event.charCode == 92
      || (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123)
      || event.charCode == 58 || event.charCode == 59 || event.charCode == 44 || event.charCode == 39
      || event.charCode == 123 || event.charCode == 125 || event.charCode == 91 || event.charCode == 93
      || event.charCode == 34) {
      event.preventDefault();
      return;
    }
  }
  getGroupNameObject(groupName) {
    const me = this;
    try {
      if (me.groupList && me.groupList.length > 1) {
        for (let i = 0; i < me.groupList.length; i++) {
          if (groupName === me.groupList[i].groupName) {
            return me.groupList[i];
          }
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  fillPercentileArray() {
    try {
      for (let i = 1; i <= 100; i++) {
        if (i <= 20) {
          this.percentiles1.push(i);
        } else if (i > 20 && i <= 40) {
          this.percentiles2.push(i);
        } else if (i > 40 && i <= 60) {
          this.percentiles3.push(i);
        } else if (i > 60 && i <= 80) {
          this.percentiles4.push(i);
        } else if (i > 80 && i <= 100) {
          this.percentiles5.push(i);
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  selectPercentileValue(event, perValue) {

    try {
      if (event && !event['checked']) {
        for (let i = 0; i < this.selectedPercentileValueArr.length; i++) {
          if (this.selectedPercentileValueArr[i] == perValue) {
            this.selectedPercentileValueArr.splice(i, 1);
            break;
          }
        }
      }

      if (!event || event['checked']) {
        this.selectedPercentileValueArr.push(perValue);
      }
    } catch (error) {
      console.error(error);
    }
  }

  clearPercentilesBtn() {
    try {
      this.selectedPercentileValueArr = [];
      for (let i = 1; i <= 100; i++) {
        this.selectedPercentileModelArr[i] = false;
      }
    } catch (error) {
      console.error(error);
    }
  }

  selectAllPercentilesBtn() {
    try {
      this.selectedPercentileValueArr = [];
      for (let i = 1; i <= 100; i++) {
        this.selectedPercentileModelArr[i] = true;
        this.selectedPercentileValueArr.push(i);
      }
    } catch (error) {
      console.error(error);
    }
  }

  selectDefaultPercentilesBtn() {
    try {
      this.selectedPercentileValueArr = [];
      for (let i = 1; i <= 100; i++) {
        if (this.defaultSelectedPercentile.includes(i)) {
          this.selectedPercentileModelArr[i] = true;
          this.selectedPercentileValueArr.push(i);
        }
        else {
          this.selectedPercentileModelArr[i] = false;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  cancelBtnEvent() {
    try {
      this.clearPercentilesBtn();
      for (let i = 0; i < this.onCancelButtonSelectedPer.length; i++) {
        this.selectedPercentileModelArr[this.onCancelButtonSelectedPer[i]] = true;
      }
      this.selectedPercentileValueArr = this.onCancelButtonSelectedPer;
      //this.selectDefaultPercentilesBtn();
      // this.selectedPercentileValueArr = this.selectedPercentileValueArr.sort(function (a, b) { return a - b; });
      // this.toShowArr = this.selectedPercentileValueArr;
      this.displayPerConf = false;
    } catch (error) {
      console.error(error);
    }
  }

  okBtnEvent() {
    const me = this;
    try {
      if (this.selectedPercentileValueArr.length === 0) {
        me.confirmationDialog("Error", "Please select some percentile values.");
        return;
      }
      me.selectedPercentileValueArr = me.selectedPercentileValueArr.sort(function (a, b) { return a - b; });
      me.displayPerConf = false;
      me.onCancelButtonSelectedPer = me.selectedPercentileValueArr;
      me.percentileData = [];
      for (let i = 0; i < me.onCancelButtonSelectedPer.length; i++) {
        me.percentileData.push({ label: me.onCancelButtonSelectedPer[i], value: me.onCancelButtonSelectedPer[i] });
      }
    } catch (error) {
      console.error(error);
    }
  }

  confirmationDialog(head, msg) {
    this.dialogVisible = true;
    this.confirmationService.confirm({
      key: 'addReportSettingsDialog',
      message: msg,
      header: head,
      accept: () => { this.dialogVisible = false; return; },
      rejectVisible: false
    });
  }

  removeMe(index: number) {
    const me = this;
    try {
      if (index == 0) {
        me.firstCard = false;
      } else if (index == 1) {
        me.secondCard = false;
      } else if (index == 2) {
        me.thirdCard = false;
      } else if (index == 3) {
        me.fourthCard = false;
      }

    } catch (error) {
      console.error(error);
    }
  }

  getCustomWidth() {
    const me = this;
    let el;

    if (me.addTemplateCard) {
      el = me.addTemplateCard.nativeElement.querySelector('p-card .ui-card');
      el.setAttribute('style', 'width: 300px');
    }
  }
  backToReport() {
    this.router.navigate(['/reports']);
  }
  selectIndices() {
    this.router.navigate(['/select-indices']);
  }

  removeReportSet(event) {
    const me = this;

    try {
      this.dialogVisible = true;
      this.confirmationService.confirm({
        key: 'addReportSettingsDialog',
        message: "Do you want to delete Report Set.",
        header: "Delete",
        accept: () => {
          this.dialogVisible = false;
          for (let i = 0; i < me.reportSetData.length; i++) {
            if (event.rsName === me.reportSetData[i].rsName) {
              me.reportSetData.splice(i, 1);
              break;
            }
          }
          me.isReportSetEdit = false;
          me.clearReportSet();
        },
        rejectVisible: false
      });
    } catch (error) {
      console.error(error);
    }

  }

  openPercentileWindow() {
    this.displayPerConf = true;
  }

  getDefaultPercentileArray() {
    this.onCancelButtonSelectedPer = [];
    //this.selectDefaultPercentilesBtn();
    const me = this;
    const payload = {
      cctx: me.sessionService.session.cctx,
      tR: parseInt(this.sessionService.session.testRun.id)
    }
    me.addReportSettingsService.getDefaultPercentileValues(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof DefaultPercentileLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof DefaultPercentileLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: DefaultPercentileLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );

  }
  onLoading(state) {

  }
  onLoaded(state) {
    this.defaultSelectedPercentile = state.data.arrDefaultPercentileValues;
    this.onCancelButtonSelectedPer = state.data.arrDefaultPercentileValues;
    this.percentileData = [];
    for (let index = 0; index < this.defaultSelectedPercentile.length; index++) {
      let element = { label: this.defaultSelectedPercentile[index], value: this.defaultSelectedPercentile[index] };
      this.percentileData.push(element);
    }
    this.selectDefaultPercentilesBtn();
  }
  onLoadingError(state) { }

  removeDuplicate(arrayData) {
    let sl = arrayData;
    let out = [];
    try {
      for (let i = 0, l = sl.length; i < l; i++) {
        let unique = true;
        for (let j = 0, k = out.length; j < k; j++) {
          if (sl[i].measure.metric === out[j].measure.metric && sl[i].measure.mg === out[j].measure.mg) {
            unique = false;
          }
        }
        if (unique) {
          out.push(sl[i]);
        }
      }
      return out;

    } catch (error) {
      console.error(error);
    }

  }
  /* This Method is used for tooltip */
  selectedFormula(event) {
    const me = this;
    let formula = [];
    for (let i = 0; i < event.value.length; i++) {
      formula.push(event.value[i].label);
    }
    me.formulaData = formula;
    if (event.value.length === 0) {
      me.formulaData = "Choose";
    }
  }
  changeGraphType(event) {
    const me = this;
    me.selectedChartType = { label: 'Line', value: 0 };
    me.selectedFormulaType = [{ label: 'Avg', value: 0 }];
    me.fixedTrendCritical = null;
    me.fixedTrendMajor = null;
    me.fixedTrendMinor = null;
    me.isLegendEnable = false;
    me.isChartsPerIndices = false;
    me.isThreshold = false;
    me.totalbuckets = 10;
    me.formulaData = "Avg";
  }

  getDuration() {
    const me = this;
    let sp = "LIVE10";
    if (this.addReportService.presetTime) {
      let preStartTime = this.addReportService.presetTime;
      const startTime: number = preStartTime.time.frameStart.value;
      const endTime: number = preStartTime.time.frameEnd.value;
      if (startTime == 0 || endTime == 0) {
        sp = preStartTime.timePeriod.selected.id;
        me.getTimeForDuration(sp);
      } else {
        me.durationObj = {
          st: startTime,
          et: endTime,
          preset: preStartTime.timePeriod.selected.id,
          viewBy: parseInt(preStartTime.viewBy.selected.id)
        }
        me.reportGroupList(me.durationObj);
      }
    } else {
      me.getTimeForDuration(sp);
    }
  }

  getTimeForDuration(sp) {
    const me = this;
    const payload = {
      cck: me.sessionService.session.cctx.cck,
      tr: parseInt(me.sessionService.session.testRun.id),
      pk: me.sessionService.session.cctx.pk,
      u: me.sessionService.session.cctx.u,
      sp: sp

    }
    me.addReportSettingsService.presetTimeCall(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof ReportPresetLoadingState) {
          me.onLoadingPresetCall(state);
          return;
        }
        if (state instanceof ReportPresetLoadedState) {
          me.onLoadedPresetCall(state, sp);
          return;
        }
      },
      (state: ReportPresetLoadingErrorState) => {
        me.onLoadingErrorPresetCall(state);
      }
    );
  }
  onLoadingPresetCall(state) { }
  onLoadedPresetCall(state, sp) {
    const me = this;
    const startTimeData = state.data[1];
    const endTimeData = state.data[2];
    const viewBy: number = 60;
    me.durationObj = {
      st: startTimeData,
      et: endTimeData,
      preset: sp,
      viewBy: viewBy,
    }
    me.reportGroupList(me.durationObj);
  }
  onLoadingErrorPresetCall(state) { }
  @Input() get selectedColumns(): TableHeaderColumn[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: TableHeaderColumn[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }
  selectChartType() {
    // this.getDuration();
    const me = this;
    me.totalbuckets = 10;
    if(me.selectedChartType.value == ReportConstant.PIE_CHART || me.selectedChartType.value == ReportConstant.DONUT_CHART){
      if(me.selectedGraphType.value == ReportConstant.PERCENTILE_GRAPH){
        me.basedOn = 50;
      }
      else if(me.selectedGraphType.value == ReportConstant.SLAB_COUNT_GRAPH){
        me.basedOn = 1;
      }
      else {
        me.basedOn = -1;
      }
    }
    else {
      me.basedOn = -1;
    }
    me.isLegendEnable = false;
    me.isChartsPerIndices = false;
  }
  checkBoxChecked(event) {
    const me = this;
    let json = [];
    let data = []
    for (let i = 0; i < me.graphList.length; i++) {
      if (event.checked == true) {
        me.graphList[i].graphcheck = true;
        data.push(me.graphList[i]);
        me.selectedGraphName.push(me.graphList[i]);
        json['value'] = data;

      }
      else {
        me.graphList[i].graphcheck = false;
        data.push(me.graphList[i]);
        json['value'] = data;
        me.selectedGraphName = [];
      }
    }
    me.changeOrderGraphList(json);
  }
  onMetricGroupRowCheckboxClick(rowdata, event) {
    const me = this;
    if (event.checked) {
      rowdata['event'] = "checked";
    } else {
      rowdata['event'] = "unchecked";
    }
  }


  onMetricGroupRowSelection(event) {
    const me = this;
    me.isMasterCheck = false;
    try {
      if (event.value[0].event) {/**On checkbox click event */
        /**Check box uncheck */
        if (event.value[0].event === "unchecked") {
          console.log("Group uncheck case");

          /**uncheck the master checkbox */
          me.isMasterCheck = false;

          /**Update group check value in available group list varriable */
          for (let i = 0; i < me.groupList.length; i++) {
            if (event.value[0].mgId == me.groupList[i].mgId) {
              me.groupList[i]['groupcheck'] = false;
              break;
            }
          }

          /**Remove Group from slected group array */
          for (let j = 0; j < me.selectedMetricGroupArr.length; j++) {
            if (me.selectedMetricGroupArr[j].mgId == event.value[0].mgId) {
              me.selectedMetricGroupArr.splice(j, 1);
              break;
            }
          }

          /**Remove selcted graph from map for unchecked group*/
          if (me.grpBySelectedMetricsMap.get(event.value[0].mgId)) {
            me.grpBySelectedMetricsMap.delete(event.value[0].mgId);
          }

          /** Change checked status in graphList */
          for (let index = 0; index < me.graphList.length; index++) {
            me.graphList[index]['graphcheck'] = false;
          }
          /**If uncheck group is not higlighted then dont chanage the highlighted group and graph */
          /**if only one Group was selected and got unchecked or highlighted group got uncheck*/
          // if (me.selectedMetricGroupArr.length == 0 || me.selectedMetricGrpRowVal[0].label === event.value[0].groupName) {
          //   me.selectedMetricesRowVal[0] = [];
          // }

          /**Higlight previous selected group and its graph*/
          // if (me.selectedMetricGroupArr.length != 0) {
          //  me.selectedMetricGrpRowVal[0] = me.selectedMetricGroupArr[me.selectedMetricGroupArr.length - 1];
          /**Reflect metric list according to newly heighlighted group */
          //  me.getMetricesAccMetricGroup();
          // } else {
          /**if only one Group was selected and got unchecked then heiglight nothing in group list and Graph List 
          but metric list should be visible for same group*/
          /**Remove Heilighted group and graph */
          // me.selectedMetricGrpRowVal[0] = [];
          // me.selectedMetricesRowVal[0] = [];

          /** Change checked status in graphList */
          // for (let index = 0; index < me.graphList.length; index++) {
          //  me.graphList[index]['graphcheck'] = false;
          // }
          //  }
        } else if (event.value[0].event === "checked") {/**When group is checked */
          console.log("Group check case");
          me.graphList = [];
          /**Populate GRaph list according to group */
          me.getMetricesAccMetricGroup();
          /**Highlight checked group and push it into selecte group array */
          for (let i = 0; i < me.groupList.length; i++) {
            if (event.value[0].mgId == me.groupList[i].mgId) {
              me.selectedMetricGrpRowVal[0] = me.groupList[i];
              me.customMetricGroup = me.groupList[i].customMetric;
              me.selectedMetricGroupArr.push(me.groupList[i]);
              break;
            }
          }
        }
        /**Delete added event from onchange methode of checkbox click */
        delete event.value[0].event;
      } else {/**Row click event */
        me.graphList = [];        
        /**Populate GRaph list according to group */
        me.getMetricesAccMetricGroup();
        /**If Group is already selected by user but want to view its selected metrics */
        if (event.value[0].groupcheck) {
          console.log("Group is already selected");
          me.customMetricGroup = event.value[0].customMetric;
        } else {
          /**Chenge group check status so it got checked in UI and push it into selected group array */
          for (let i = 0; i < me.groupList.length; i++) {
            if (event.value[0].mgId == me.groupList[i].mgId) {
              me.groupList[i].groupcheck = true;
              me.customMetricGroup = me.groupList[i].customMetric;
              me.selectedMetricGroupArr.push(me.groupList[i]);
              break;
            }
          }
        }
      }
      console.log("row Selection event selectedMetricGroup----->", me.selectedMetricGroupArr);
      console.log("row Selection event selectedMetricGrpRowVal---->", me.selectedMetricGrpRowVal);
    } catch (error) {
      console.error(error);
    }
  }

  /**Get Metric List according to highlighted group */
  getMetricesAccMetricGroup() {
    const me = this;
    const selectedMetricGroup = me.selectedMetricGrpRowVal[0];
    this.isMasterCheck = false;
    /**Get Metrics List from map if present */
    if (me.metricsListAccMetricGrp.get(selectedMetricGroup.mgId)) {
      me.graphList = me.metricsListAccMetricGrp.get(selectedMetricGroup.mgId).map(a => ({ ...a }));
      let metricList = []
      /**check for metrics array of highlighted group if user selected periously */
      if (me.grpBySelectedMetricsMap.get(selectedMetricGroup.mgId)) {
        /**Get metrics array of highlighted group which user selected periously */
        metricList = me.grpBySelectedMetricsMap.get(selectedMetricGroup.mgId);
        me.addSelectedMetricsPropertyInGraphList(metricList);
      }
      me.setDefaultMetricRowProperties(metricList);
      if (me.graph.filterValue) {
        let element = document.querySelector('[aria-label="metricsFilter"]');
        element['value'] = null;
        me.graph.filterValue = "";
        me.graph.visibleOptions = me.graphList;
      }
      return;
    }

let opcode = 5;
if(selectedMetricGroup.customMetric){
  opcode = 17;
}else{
  opcode = 5;
}
    /**Get Metric List from server */
    const payload = {
      opType: opcode,
      cctx: me.sessionService.session.cctx,
      duration: me.durationObj,
      tr: parseInt(me.sessionService.session.testRun.id),
      clientId: "Default",
      appId: "Default",
      mgId: selectedMetricGroup.mgId,
      glbMgId: selectedMetricGroup.glbMgId,
      grpName: selectedMetricGroup.groupName,
    }
    if (selectedMetricGroup.groupName) {
      me.blockuiForGroupGraph = true;
      me.addReportSettingsService.loadGraphData(payload).subscribe(
        (state: Store.State) => {
          if (state instanceof ReportGraphLoadingState) {
            me.onLoadingGraph(state);
            return;
          }

          if (state instanceof ReportGraphLoadedState) {
            me.onLoadedGraph(state, selectedMetricGroup.hierarchicalComponent,selectedMetricGroup.customMetric);
            return;
          }
        },
        (state: ReportGraphLoadingErrorState) => {
          me.onLoadingErrorGraph(state);
        }
      );

    }
  }
  onLoadedGraph(state, hierarchicalInfo,customMetric) {
    const me = this;
    me.timebarService.setLoading(false);
    me.blockuiForGroupGraph = false;
    me.graphList = [];
    let stateData = state.data.status;
    if (stateData.code != 200 && state.data.graph.length == 0) {
      this.confirmationDialog("Error", stateData.msg);
      return;
    }
    me.error = null;
    me.loading = false;
    for (let i = 0; i < state.data.graph.length; i++) {
      let valueObj = {
        mgType: me.selectedMetricGrpRowVal[0].metricTypeName,
        mgTypeId: -1,
        mg: state.data.groupName,
        mgId: state.data.mgId,
        metric: state.data.graph[i].name,
        metricId: state.data.graph[i].metricId,
        showTogether: 0,
      };
      let json = {
        label: state.data.graph[i].name,
        value: valueObj,
        graphcheck: false,
        glbMetricId: state.data.glbMgId,
        indicesInfo: me.patternExpFromTxtArea,
        hierarchicalInfo: hierarchicalInfo,
        customMetric : customMetric
      }
      me.graphList.push(json);
    }
    /**Sort list alphabeticly */
    me.sortList(me.graphList);
    me.graphList = [...me.graphList];
    /**Save this list for future */
    const newArray = me.graphList.map(a => ({ ...a }));
    me.metricsListAccMetricGrp.set(me.graphList[0].value.mgId, newArray);

    if (me.graph.filterValue) {
      let element = document.querySelector('[aria-label="metricsFilter"]');
      element['value'] = null;
      me.graph.filterValue = "";
      me.graph.visibleOptions = me.graphList;
    }

    /**In case of edit case if we need to check metrics which are added in report set */
    if ((me.templateService.isEdit || me.isReportSetEdit) && me.grpBySelectedMetricsMap.get(me.graphList[0].value.mgId)) {
      me.addSelectedMetricsPropertyInGraphList(me.grpBySelectedMetricsMap.get(me.graphList[0].value.mgId));
    }

    me.setDefaultMetricRowProperties([]);
    // /**If tempalte is not in edit mode then check and highlight first metric of the list and saved it in group by selected metrics */
    // if (!me.templateService.isEdit && !me.isReportSetEdit) {
    //   /**Set Default selected indices info */
    //   me.selectedIndices = "All";
    //   me.patternExpFromTxtArea = "";
    //   /** */
    //   me.graphList[0].graphcheck = true;
    //   me.graphList[0].indicesInfo = "";
    //   me.selectedMetricesRowVal[0] = me.graphList[0];
    //   let arr = [];
    //   arr.push(me.graphList[0]);
    //   me.grpBySelectedMetricsMap.set(me.graphList[0].value.mg, arr);
    // } else {
    //   me.selectedMetricesRowVal[0] = [];/**If edit mode then only list populated */
    // }
  }

  onLoadingGraph(state) {
    this.timebarService.setLoading(true);
  }
  onLoadingErrorGraph(state) {
    this.timebarService.setLoading(false);
  }

  onMetricesRowSelection(event) {
    const me = this;
    try {
      if (event.value[0].event) {/**On checkbox click event */
        /**If graph got unchecked */
        if (event.value[0].event === "unchecked") {

          this.isMasterCheck = false;

          /**Update graphcheck value in metric list*/
          for (let i = 0; i < me.graphList.length; i++) {
            if (event.value[0].label === me.graphList[i].label) {
              me.graphList[i]['graphcheck'] = false;
              me.graphList[i].indicesInfo = "";
              break;
            }
          }

          /**Update selected map */
          let arr = me.grpBySelectedMetricsMap.get(me.graphList[0].value.mgId);
          /**IF this is last value of selected metric list  of a group */
          if (arr.length == 1) {
            /**Remove entry from map */
            me.grpBySelectedMetricsMap.delete(me.graphList[0].value.mgId);
            /**Remove selected group from array */
            for (let j = 0; j < me.selectedMetricGroupArr.length; j++) {
              if (me.selectedMetricGroupArr[j].mgId == me.graphList[0].value.mgId) {
                me.selectedMetricGroupArr.splice(j, 1);
                break;
              }
            }
            /**Update value of group check in visible group list */
            for (let j = 0; j < me.groupList.length; j++) {
              if (me.groupList[j].mgId == event.value[0].value.mgId) {
                me.groupList[j].groupcheck = false;
                break;
              }
            }
            /**Update highlighted group row */
            // if (me.selectedMetricGroupArr.length > 0) {
            //   me.selectedMetricGrpRowVal[0] = me.selectedMetricGroupArr[me.selectedMetricGroupArr.length - 1];
            //   me.getMetricesAccMetricGroup();
            // } else {
            //   me.selectedMetricGrpRowVal[0] = [];
            //   me.selectedMetricesRowVal[0] = [];
            // }
          } else {/**selected metric array have more than one value */
            for (let j = 0; j < arr.length; j++) {
              if (arr[j].label === event.value[0].label) {
                arr.splice(j, 1);
                break;
              }
            }
            me.grpBySelectedMetricsMap.set(me.graphList[0].value.mgId, arr);
            // me.selectedMetricesRowVal[0] = arr[arr.length - 1];
          }
        } else if (event.value[0].event === "checked") {/**On checkbox check event */
          /**Update graph check value and update gropy by selected metrics map and highlight row of metric*/
          for (let i = 0; i < me.graphList.length; i++) {
            if (event.value[0].label === me.graphList[i].label) {
              me.graphList[i].indicesInfo = this.patternExpFromTxtArea;
              me.selectedMetricesRowVal[0] = me.graphList[i];
              let arr = [];
              if (me.grpBySelectedMetricsMap.get(me.graphList[i].value.mgId)) {
                arr = me.grpBySelectedMetricsMap.get(me.graphList[i].value.mgId);
              }
              arr.push(me.graphList[i]);
              if (arr.length == me.graphList.length) {
                this.isMasterCheck = true;
              } else {
                this.isMasterCheck = false;
              }
              me.grpBySelectedMetricsMap.set(me.graphList[i].value.mgId, arr);
              break;
            }
          }

          /**If group is not selected for selected metrics This case will come if highlisghted group got uncheck or user uncheck all graph of highlighted group then group got uncheck then selected some metrics again from same higlighted group */
          for (let j = 0; j < me.groupList.length; j++) {
            if (me.groupList[j].label === event.value[0].value.mg && !me.groupList[j].groupcheck) {
              me.groupList[j].groupcheck = true;
              me.selectedMetricGroupArr.push(me.groupList[j]);
              // me.selectedMetricGrpRowVal[0] = me.groupList[j];
              break;
            }
          }
        }
        delete event.value[0].event;
      } else {/**Row click event */
        if (event.value[0].graphcheck) {
          if (event.value[0].indicesInfo && event.value[0].indicesInfo != "") {
            me.selectedIndices = "Selected Indices";
            me.patternExpFromTxtArea = event.value[0].indicesInfo;
          } else {
            me.selectedIndices = "All";
            me.patternExpFromTxtArea = "";
          }
        } else {
          for (let i = 0; i < me.graphList.length; i++) {
            if (event.value[0].label === me.graphList[i].label) {
              me.graphList[i].graphcheck = true;
              me.graphList[i].indicesInfo = this.patternExpFromTxtArea;
              let arr = [];
              if (me.grpBySelectedMetricsMap.get(me.graphList[i].value.mgId)) {
                arr = me.grpBySelectedMetricsMap.get(me.graphList[i].value.mgId);
              }
              arr.push(me.graphList[i]);
              if (arr.length == me.graphList.length) {
                this.isMasterCheck = true;
              } else {
                this.isMasterCheck = false;
              }
              me.grpBySelectedMetricsMap.set(me.graphList[i].value.mgId, arr);
              break;
            }
          }

          /**If group is not selected for selected metrics This case will come if highlisghted group got uncheck or user uncheck all graph of highlighted group then group got uncheck then selected some metrics again from same higlighted group */
          for (let j = 0; j < me.groupList.length; j++) {
            if (me.groupList[j].label === event.value[0].value.mg && !me.groupList[j].groupcheck) {
              me.groupList[j].groupcheck = true;
              me.selectedMetricGroupArr.push(me.groupList[j]);
              break;
            }
          }

        }
      }
    } catch (error) {
      console.error(error);
    }
  }
  onMetricesRowCheckboxClick(rowdata, event) {
    const me = this;
    if (event.checked) {
      rowdata['event'] = "checked";
    } else {
      rowdata['event'] = "unchecked";
    }
  }
  /**Master checkbox evrnt */
  onMetricsMasterCheckbox(event) {
    const me = this;
    let arr = [];
    if (me.grpBySelectedMetricsMap.get(me.graphList[0].value.mgId)) {
      arr = me.grpBySelectedMetricsMap.get(me.graphList[0].value.mgId);
    }
    /**Master checkbox checked */
    if (event.checked) {
      arr = [];
      /**Update graph check value in visible metrics list and create new array for selected metrics map for sequencing*/
      for (let i = 0; i < me.graphList.length; i++) {
        if (!me.graphList[i].graphcheck) {/**If graph is already checked by row checkbox */
          me.graphList[i].graphcheck = true;
        }
        me.graphList[i].indicesInfo = this.patternExpFromTxtArea;
        arr.push(me.graphList[i]);
      }

      /**If group is not selected for selected metrics This case will come if highlisghted group got uncheck or user uncheck all graph of highlighted group then group got uncheck then selected some metrics again from same higlighted group */
      for (let j = 0; j < me.groupList.length; j++) {
        if (me.groupList[j].mgId == me.graphList[0].value.mgId && !me.groupList[j].groupcheck) {
          me.groupList[j].groupcheck = true;
          me.selectedMetricGroupArr.push(me.groupList[j]);
          // me.selectedMetricGrpRowVal[0] = me.groupList[j];
          break;
        }
      }

      /**Update group by selected metrics map */
      me.grpBySelectedMetricsMap.set(me.graphList[0].value.mgId, arr);
      /**need to rethink about highlight row if mater check box is checked the no row will be highlight due to specified indices confusion */
      //me.selectedMetricesRowVal[0] = [];
    }
    else {
      /**Update value of graphcheck in visible Graph List */
      for (let i = 0; i < me.graphList.length; i++) {
        me.graphList[i].graphcheck = false;
      }
      /**Remove from map */
      me.grpBySelectedMetricsMap.delete(me.graphList[0].value.mgId);
      /**Remove group from selected group array */
      for (let j = 0; j < me.selectedMetricGroupArr.length; j++) {
        if (me.selectedMetricGroupArr[j].mgId == me.graphList[0].value.mgId) {
          me.selectedMetricGroupArr.splice(j, 1);
          break;
        }
      }
      /**Update visible group list */
      for (let j = 0; j < me.groupList.length; j++) {
        if (me.groupList[j].mgId == me.graphList[0].value.mgId) {
          me.groupList[j].groupcheck = false;
          me.graphList[j].indicesInfo = "";
          break;
        }
      }
      /**Remove Heilighted group and graph */
      // me.selectedMetricGrpRowVal[0] = [];
      // me.selectedMetricesRowVal[0] = [];
      /**Commenting below code no need to jum previous selected group because all the metrics will be uncheck and group also uncheck but highlighted 
       * so that use can see tha highlighted group is uncheck and all metrics are unchecked other wise user can get confuse on which grp he performe master uncheck*/

      // if (me.selectedMetricGrpRowVal[0].groupName === me.graphList[0].value.mg) {
      //   if (me.selectedMetricGroupArr.length == 0) {
      //     me.selectedMetricGrpRowVal[0] = []
      //   } else {
      //     me.selectedMetricGrpRowVal[0] = me.selectedMetricGroupArr[me.selectedMetricGroupArr.length - 1];
      //     me.getMetricesAccMetricGroup();
      //   }
      // }
    }
  }

  addSelectedMetricsPropertyInGraphList(metricList) {
    try {
      const me = this;
      for (let index = 0; index < me.graphList.length; index++) {
        /**If some metrics are already selected then update status of graph check and its indices info*/
        for (let j = 0; j < metricList.length; j++) {
          if (me.graphList[index].label === metricList[j].label) {
            me.graphList[index].graphcheck = true;
            me.graphList[index].indicesInfo = metricList[j].indicesInfo;
            break;
          }
        }
        /**Mater check box condition */
        if (metricList.length == me.graphList.length || me.graphList.length == 1) {
          this.isMasterCheck = true;
        } else {
          this.isMasterCheck = false;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  setDefaultMetricRowProperties(arr) {
    try {
      const me = this;
      /**if template in edit mode and higlighted group is a new group(not added in reportset in add mode) then default setting will apply
       * In non edit mode and no previously selected metrics
      * then need to highlight and checked first metric and 
      * saved this array into group by selected metrics map*/
      if ((me.templateService.isEdit || me.isReportSetEdit && !me.grpBySelectedMetricsMap.get(me.graphList[0].value.mgId)) || (!me.templateService.isEdit && !me.isReportSetEdit && arr.length == 0)) {
        // if (!me.templateService.isEdit && !me.isReportSetEdit && arr.length == 0) {      
        me.selectedMetricesRowVal[0] = me.graphList[0];
        /**Mater check box condition */
        if (me.graphList.length == 1) {
          this.isMasterCheck = true;
        } else {
          this.isMasterCheck = false;
        }
        me.graphList[0].graphcheck = true;
        arr.push(me.graphList[0]);
        me.grpBySelectedMetricsMap.set(me.graphList[0].value.mgId, arr);
        /**Default indices info */
        me.selectedIndices = "All";
        me.patternExpFromTxtArea = "";
      } else {
        /**In edit mode and incase of previously selected metrics only list should be visible 
         * no default highlighted row */
        me.selectedMetricesRowVal[0] = [];
      }
    } catch (error) {
      console.error(error);
    }
  }

  updateIndicesInfoForHighlightedMetrics(metricsIndicesInfo, tagList) {
    try {
      const me = this;
      /**If highlight metric is checked then need to update its indices info in map */
      if (me.selectedMetricesRowVal.length > 0 && me.selectedMetricesRowVal[0] && me.selectedMetricesRowVal[0].graphcheck) {
        let arr = me.grpBySelectedMetricsMap.get(me.selectedMetricesRowVal[0].value.mgId);
        if (arr) {
          for (let index = 0; index < arr.length; index++) {
            if (me.selectedMetricesRowVal[0].label === arr[index].label) {
              arr[index].indicesInfo = metricsIndicesInfo;
              if(tagList){
               arr[index].tagList = tagList;
              }
              break;
            }
          }
          me.grpBySelectedMetricsMap.set(me.selectedMetricesRowVal[0].value.mgId, arr);
        }
      }

      /**Add indices info in metric object in metric list for higlighted one */
      for (let index = 0; index < me.graphList.length; index++) {
        if (me.graphList[index].graphcheck && me.selectedMetricesRowVal[0].label === me.graphList[index].label) {
          me.graphList[index].indicesInfo = metricsIndicesInfo;
          me.graphList[index].tagList = tagList;
          break;
        }
      }
    } catch (error) {

    }
  }

  createGctxForReportSet() {
    const me = this;
    let gctxArr = [];
    try {
      me.grpBySelectedMetricsMap.forEach(metricsArr => {
        for (let index = 0; index < metricsArr.length; index++) {
          const metricsInfo = metricsArr[index];
          let indicesInfo = metricsInfo.indicesInfo;      
          let tagList = metricsInfo.tagList;
          if(metricsInfo.customMetric){
            let gctx = {
              glbMetricId: metricsInfo.glbMetricId,
              measure: {
                mgType: metricsInfo.value.mgType,
                mgTypeId: -1,
                mg: metricsInfo.value.mg,
                mgId: metricsInfo.value.mgId,
                metric: metricsInfo.value.metric,
                metricId: metricsInfo.value.metricId,
                showTogether: 0
              },
              subject: {
                tags: []
              }
            }
            gctxArr.push(gctx);
          }else{
          /**if metric having indices info from Advace window then dont create tag array use saved tag array */
          if (indicesInfo.startsWith("PATTERN#") && tagList && tagList.length > 0) {
            let gctx = {
              glbMetricId: metricsInfo.glbMetricId,
              measure: {
                mgType: metricsInfo.value.mgType,
                mgTypeId: -1,
                mg: metricsInfo.value.mg,
                mgId: metricsInfo.value.mgId,
                metric: metricsInfo.value.metric,
                metricId: metricsInfo.value.metricId,
                showTogether: 0
              },
              subject: {
                tags: tagList
              }
            }
            gctxArr.push(gctx);
          } else {/**Specified Indices */
            let indicesInfoArr = indicesInfo.split(",");
            for (let index = 0; index < indicesInfoArr.length; index++) {
              const indices = indicesInfoArr[index];
              let tagArr = me.createSubjectTagsList(indices, metricsInfo.hierarchicalInfo);
              if (!tagArr || tagArr.length < 1) {
                continue;
              }
              let gctx = {
                glbMetricId: metricsInfo.glbMetricId,
                measure: {
                  mgType: metricsInfo.value.mgType,
                  mgTypeId: -1,
                  mg: metricsInfo.value.mg,
                  mgId: metricsInfo.value.mgId,
                  metric: metricsInfo.value.metric,
                  metricId: metricsInfo.value.metricId,
                  showTogether: 0
                },
                subject: {
                  tags: tagArr
                }
              }
              gctxArr.push(gctx);
            }
          }
        }
      }
      });
    } catch (error) {
      console.error(error);
    }
    return gctxArr;
  }

  createSubjectTagsList(indicesInfo, hierarchicalComponent) {
    const me = this;
    let tagArr = [];
    try {
      let hierarchicalArr = hierarchicalComponent.split('>');
      for (let j = 0; j < hierarchicalArr.length; j++) {
        let tagObj;
        if (indicesInfo.startsWith("PATTERN#")) {
          let splitDataForSpecified = indicesInfo.replace("PATTERN#", "").split('>');
          if (splitDataForSpecified[j] === "ALL" || splitDataForSpecified[j] === "All" || splitDataForSpecified[j] === "ALL") {
            tagObj = {
              key: hierarchicalArr[j],
              value: splitDataForSpecified[j],
              mode: 2
            }
          } else {
            tagObj = {
              key: hierarchicalArr[j],
              value: splitDataForSpecified[j],
              mode: 4
            }
          }
        } else if (indicesInfo.indexOf(">") > -1) {
          let splitDataForSpecified = indicesInfo.split('>');
          if (splitDataForSpecified.length != hierarchicalArr.length) {
            console.log("indicesInfo is not correct " + indicesInfo);
            return tagArr;
          }
          tagObj = {
            key: hierarchicalArr[j],
            value: splitDataForSpecified[j],
            mode: 1
          }
        } else {
          tagObj = {
            key: hierarchicalArr[j],
            value: 'All',
            mode: 2
          }
        }
        tagArr.push(tagObj);
      }
    } catch (error) {
      console.error(error);
    }
    return tagArr;
  }

  createMapFromGctx(gctxArr) {
    const me = this;
    try {

      let metricNameAccGrpMap = new Map();

      for (let index = 0; index < gctxArr.length; index++) {
        const gctx = gctxArr[index];
        let groupName = gctx.measure.mg;
        let metricName = gctx.measure.metric;
        let metricObj = {};
        let metricNameMap = new Map();
        if (metricNameAccGrpMap.get(gctx.measure.mgId)) {
          metricNameMap = metricNameAccGrpMap.get(gctx.measure.mgId);
        }

        if (metricNameMap.get(metricName)) {
          metricObj = metricNameMap.get(metricName);
          let obj = me.getIndicesInfoFromSubjectTagArr(gctx.subject.tags);
          metricObj['indicesInfo'] = metricObj['indicesInfo'] + "," + obj['indicesInfo'];
        } else {
          let valueObj = {
            mgType: gctx.measure.mgType,
            mgTypeId: -1,
            mg: groupName,
            mgId: gctx.measure.mgId,
            metric: gctx.measure.metric,
            metricId: gctx.measure.metricId,
            showTogether: 0,
          };
          if(gctx.subject.tags.length == 0){ /**Custom Metrics */
            metricObj = {
              label: gctx.measure.metric,
              value: valueObj,
              graphcheck: true,
              glbMetricId: gctx.glbMetricId,
              indicesInfo: "All",
              hierarchicalInfo: "",
              customMetric: true
            }
          }else{
          let obj = me.getIndicesInfoFromSubjectTagArr(gctx.subject.tags);
          metricObj = {
            label: gctx.measure.metric,
            value: valueObj,
            graphcheck: true,
            glbMetricId: gctx.glbMetricId,
            indicesInfo: obj['indicesInfo'],
            hierarchicalInfo: obj['hierarchicalInfo'],
            customMetric: false
          }
        }
        }
        metricNameMap.set(metricName, metricObj);
        metricNameAccGrpMap.set(gctx.measure.mgId, metricNameMap);
      }

      /**Fill selected Group array and */
      me.grpBySelectedMetricsMap = new Map();
      let groupArr = [];
      for (let key of metricNameAccGrpMap.keys()) {
        let metricNameMap = metricNameAccGrpMap.get(key);
        let metricArr = Array.from(metricNameMap.values());
        me.grpBySelectedMetricsMap.set(key, metricArr);
        groupArr.push(key);
      }

      me.createSelectedGrpArrayFrmGctxArr(groupArr);

    } catch (error) {
      console.error(error);
    }
  }

  getIndicesInfoFromSubjectTagArr(tagArr) {
    let obj = {};
    try {
      let hireCom = [];
      let indices = [];
      let mode = [];
      for (let index = 0; index < tagArr.length; index++) {
        const tag = tagArr[index];
        hireCom.push(tag['key']);
        indices.push(tag['value']);
        mode.push(tag['mode']);
      }
      /**Pattern and in patter if any hirecrical complete is selected all*/
      if (mode.includes(4) || (mode.includes(4) && mode.includes(2)) || (mode.includes(2) && mode.includes(1))) {
        obj['indicesInfo'] = "PATTERN#" + indices.join(">");
      } else if (mode.includes(2)) {/**All case */
        obj['indicesInfo'] = "";
      } else {/**Specified Case */
        obj['indicesInfo'] = indices.join(">");
      }
      obj['hierarchicalInfo'] = hireCom.join(">");
    } catch (error) {
      console.error(error);
    }
    return obj;
  }

  createSelectedGrpArrayFrmGctxArr(array) {
    try {
      const me = this;
      me.selectedMetricGroupArr = [];
      for (let index = 0; index < me.groupList.length; index++) {
        if (array.includes(me.groupList[index].mgId)) {
          me.groupList[index].groupcheck = true;
          me.selectedMetricGroupArr.push(me.groupList[index]);
        } else {
          me.groupList[index].groupcheck = false;
        }
      }
      me.selectedMetricGrpRowVal[0] = me.selectedMetricGroupArr[0];
      me.customMetricGroup =  me.selectedMetricGroupArr[0].customMetric;
      me.getMetricesAccMetricGroup();
    } catch (error) {
      console.error(error);
    }
  }
}
