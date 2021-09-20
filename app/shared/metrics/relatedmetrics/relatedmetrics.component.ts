import { DerivedMetricIndicesComponent } from './../../derived-metric/derived-metric-indices/derived-metric-indices.component';
import { Component, Input, OnInit, ViewChild, ViewEncapsulation, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MenuItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { PageDialogComponent } from '../../page-dialog/page-dialog.component';
import { RELATED_METRICS_DATA } from './service/relatedmetrics.dummy';
import { RelatedMetricsTable, RelatedMetricsTableHeaderCols, RelatedMetricsGroupBy, RelatedMetricsMetricSetToLookup, RelatedMetricsMetricFilter } from './service/relatedmetrics.model';
import {
  RelatedMetricsLoadingState,
  RelatedMetricsLoadedState,
  RelatedMetricsLoadingErrorState,
  saveCatalogueLoadingState,
  saveCatalogueLoadingErrorState,
  saveCatalogueLoadedState,
  getCatalogueLoadingState,
  getCatalogueLoadedState,
  getCatalogueLoadingErrorState
} from './service/relatedmetrics.state';
import { RelatedMetricsService } from './service/relatedmetrics.service';
import { Store } from 'src/app/core/store/store';
import { ActivatedRoute, Router } from '@angular/router';
import { SelectItem } from "primeng/primeng";
import { values } from 'lodash';
import * as _ from 'lodash';
import { SessionService } from 'src/app/core/session/session.service';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { DashboardTime, DashboardWidgetLayout } from '../../dashboard/service/dashboard.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmationDialogComponent } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.component';
import { TargetData } from '../../../shared/pattern-matching/pattern-matching.model';
import { CatalogueTableData, SaveCatalogue, SaveCatlogueResponse } from '../../../shared/pattern-matching/catalogue-management/service/catalogue-management.model';
import { SaveCatalogueComponent } from './../../../shared/pattern-matching/save-catalogue/save-catalogue.component';
import { TreeOperationsService } from '../../../shared/dashboard/sidebars/show-graph-in-tree/service/tree-operations.service';


@Component({
  selector: 'app-relatedmetrics',
  templateUrl: './relatedmetrics.component.html',
  styleUrls: ['./relatedmetrics.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RelatedmetricsComponent extends PageDialogComponent
  implements OnInit, OnDestroy {
  downloadOptions: MenuItem[];
  @Input() dashboard: DashboardComponent;
  error: AppError;
  empty: boolean;
  loading: boolean;
  openRelated: any;
  breadcrumb: MenuItem[];
  metricData;
  totalHierarchyList = []
  showSelectedOperationType: string = 'all';
  enableFilter: number;
  typ: any;
  graphInformation: string;
  groupList = [];
  graphList = [];
  hierarchyobj = [];
  tabledata = [];
  tablevalues = [];
  selectedGroupName: any;
  selectedGraphs: any;
  specifiedGraph = '';
  values: SelectItem[];
  valueType: any;
  openWith: SelectItem[];
  layoutType: any;
  _selectedColumns: RelatedMetricsTableHeaderCols[];
  grpBy = {};
  metricSetToLookup = {};
  filter = {};
  cols: any[];
  openWithNewLayout: boolean = true;
  excOverallMetric: boolean = true;
  filterby: SelectItem[];
  matchValues: SelectItem[];
  patternMatch: string;
  By: string;
  criteria: SelectItem[];
  selectedcriteria: string;
  criteriaChk: number;
  operaters: SelectItem[];
  metric_form: SelectItem[];
  Value: string;
  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  Val1: number = -1;
  Val2: number = -1;
  subjectsTags = [];
  treeVectorSelectArr: Array<string> = [];
  dropDownIndex: number = 0;
  treeSameVectComponent: Array<string> = [];
  indicesInfo = [];
  catalogueName = '';
  dashboardCom: DashboardComponent;
  tags = [];
  exactMatch: number;
  firstTimeLoad: boolean;
  toEnterPattern: boolean;
  pattern: string;
  selectedHierarcy = [];
  index: number;
  flags = [];
  dataFromSpecifed: string = "";
  fromIndicesWindow: boolean = false;
  relatedCatalogue: boolean = false;
  dialogVisible: boolean = false;
  tagListFromIndices: any = [];
  graphStatsType: number = 0;
  selectedGraphWithIndicesTable = [];
  GroupId: number = 0;
  openRelatedData = []
  savedata: SaveCatlogueResponse;
  tableDatas: CatalogueTableData[];
  cataloguedata: CatalogueTableData[] = [];
  catalogueTabularData = [];
  catalogueList = [];
  selectedCatalogue: any;
  advancevalue: SelectItem[];
  GRID_ROWHEIGHT = 1;
  GRID_MAXCOLS = 200;
  WIDGETS_MARGIN = 5;
  autoSuggestColors: SelectItem[];
  widgetLayouts: DashboardWidgetLayout[] = [];
  loadData = [];

  // @ViewChild('confirmDialog', { read: ConfirmationDialogComponent })
  // @ViewChild('saveRelatedCatalogue', { read: SaveCatalogueComponent })
  // confirmDialog: ConfirmationDialogComponent;
  // saveRelatedCatalogue : SaveCatalogueComponent;

  constructor(
    private relatedMetricsService: RelatedMetricsService,
    route: ActivatedRoute,
    private sessionService: SessionService,
    private ref: ChangeDetectorRef,
    private messageService: MessageService,
    public confirmation: ConfirmationService,
    private treeOperationsService: TreeOperationsService,
  ) {
    super();
    const me = this;
    me.dropDownData();
    me.graphInformation = "catalogue";
    me.valueType = 'Avg';
    me.layoutType = '3';
    me.By = 'Avg';
    me.selectedcriteria = 'Include';
    me.Value = '=';
    me.exactMatch = 0;
    me.firstTimeLoad = true;
    me.toEnterPattern = false;
    me.dialogVisible = false;
    me.pattern = '';
    me.grpBy = {};
    me.metricSetToLookup = {};
    me.filter = {};
  }

  openDerivedIndecesWindow(dmIndices: DerivedMetricIndicesComponent) {
    const me = this;
    if (!me.selectedGroupName) {
      this.alertMsg("Please Select the graph name", "Error");
      //me.messageService.add({ key: 'openRelatedMetrics', severity: 'error', summary: 'Error message', detail: "Please Select the graph name" });
      return;
    }
    dmIndices.openDerivedIndecesWindowForRelated(me.getDuration(), me.selectedGroupName.label, me.groupList);
  }


  getDataFromIndices(data: string, tagList: any[]) {
    const me = this;
    me.dataFromSpecifed = `${data}`;
    if (me.dataFromSpecifed && me.dataFromSpecifed != "" && me.dataFromSpecifed.indexOf("PATTERN#") == -1) {
      let specifiedData = ""
      let arrSpecified = me.dataFromSpecifed.split(",");
      if (arrSpecified && arrSpecified.length > 0) {
        for (let i = 0; i < arrSpecified.length; i++) {
          if (specifiedData == "") {
            specifiedData = arrSpecified[i];
          } else {
            specifiedData = specifiedData + ", " + arrSpecified[i];
          }
        }
      }
      me.dataFromSpecifed = specifiedData;
    }
    me.fromIndicesWindow = true;
    me.tagListFromIndices = tagList;
  }

  showRelatedMetrics(dashboard: DashboardComponent) {
    const me = this;
    me.dashboardCom = dashboard;
    me.firstTimeLoad = true;
    me.hierarchyobj = [];
    me.loadData = [];
    me.grpBy = {};
    me.metricSetToLookup = {};
    me.filter = {};
    me.treeVectorSelectArr = [];
    me.treeSameVectComponent = [];
    me.selectedHierarcy = [];
    me.tablevalues = [];
    me.catalogueTabularData = [];
    me.tabledata = [];
    me.index = 0;
    me.graphInformation = "catalogue";
    me.valueType = 'Avg';
    me.layoutType = '3';
    me.By = 'Avg';
    me.selectedcriteria = 'Include';
    me.Value = '=';
    me.exactMatch = 0;
    me.firstTimeLoad = true;
    me.toEnterPattern = false;
    me.pattern = '';
    me.selectedGroupName = '';
    me.selectedGraphs = [];
    me.groupList = [];
    me.graphList = [];
    me.enableFilter = 0;
    me.catalogueName = 'NA';
    me.indicesInfo = [];
    me.dataFromSpecifed = '';
    me.tagListFromIndices = [];
    me.specifiedGraph === 'All'
    me.showSelectedOperationType = 'all';
    me.selectedCatalogue = "--Select a Catalogue--";
    me.patternMatch = "exact";
    me.graphStatsType = 0;
    me.selectedGraphWithIndicesTable = [];
    me.GroupId = 0;
    me.openRelatedData = [];
    me.catalogueList = [];
    me.Val1 = -1;
    me.Val2 = -1;
    me.selectedCatalogue = "";
    if (me.treeOperationsService.stopCounter)
      clearInterval(me.treeOperationsService.stopCounter);
    let selectedHierarcy = me.relatedMetricsService.getOpenRelatedsubjectsTags();
    me.fillDropdownData();

    me.getselectedHierarcy(selectedHierarcy);
    me.getbreadcrumb();
    me.getHierarchical([], -1, "01000000");
    me.getCatalogueInfoList();
    me.show();
  }
  getCatalogueInfoList() {
    const payload = {
      "opType": "get",
      "cctx": this.sessionService.session.cctx,
    }
    this.getCatalogueInfo(payload);
  }

  fillDropdownData() {

    const me = this;

    this.advancevalue = [
      { label: 'All', value: 'all' },
      { label: 'Zero', value: 'zero' },
      { label: 'Non Zero', value: 'nonZero' },
      { label: 'Advanced', value: 'advanced_Op' }
    ]

    me.filterby = [];
    me.filterby.push({ label: 'Avg', value: 'Avg' });
    me.filterby.push({ label: 'Min', value: 'Min' });
    me.filterby.push({ label: 'Max', value: 'Max' });
    me.filterby.push({ label: 'Count', value: 'Count' });

    me.criteria = [];
    me.criteria.push({ label: 'Include', value: 'Include' });
    me.criteria.push({ label: 'Exclude', value: 'Exclude' });

    me.operaters = [];
    me.operaters.push({ label: '=', value: '=' });
    me.operaters.push({ label: '>', value: '>' });
    me.operaters.push({ label: '<', value: '<' });
    me.operaters.push({ label: '>=', value: '>=' });
    me.operaters.push({ label: '<=', value: '<=' });
    me.operaters.push({ label: 'Top', value: 'Top' });
    me.operaters.push({ label: 'Bottom', value: 'Bottom' });
    me.operaters.push({ label: 'In-Between', value: 'In-Between' });


    me.values = [];
    me.values.push({ label: 'Avg', value: 'Avg' });
    me.values.push({ label: 'Min', value: 'Min' });
    me.values.push({ label: 'Max', value: 'Max' });
    me.values.push({ label: 'Count', value: 'Count' });
    me.values.push({ label: 'SumCount', value: 'SumCount' });

    me.openWith = [];
    me.openWith.push({ label: '1 x 1', value: '1' });
    me.openWith.push({ label: '2 x 2', value: '2' });
    me.openWith.push({ label: '3 x 3', value: '3' });
    me.openWith.push({ label: '4 x 4', value: '4' });
    me.openWith.push({ label: '9 x 9', value: '9' });
    me.openWith.push({ label: '16 x 16', value: '16' });
    me.openWith.push({ label: '18 x 18', value: '18' });
    me.openWith.push({ label: '20 x 20', value: '20' });
    me.openWith.push({ label: '32 x 32', value: '32' });


  }
  ngOnInit(): void {
    const me = this;
    me.downloadOptions = [
      { label: 'WORD' },
      { label: 'PDF' },
      { label: 'EXCEL' }
    ]
    me.metricData = RELATED_METRICS_DATA;
    me._selectedColumns = me.cols;
    me.firstTimeLoad = true;
  }

  @Input() get selectedColumns(): any[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    const me = this;
    me._selectedColumns = me.cols.filter((col) => val.includes(col));
  }

  toggleFilters() {
    const me = this;
    me.isEnabledColumnFilter = !me.isEnabledColumnFilter;
    if (me.isEnabledColumnFilter === true) {
      me.filterTitle = 'Disable Filters';
    } else {
      me.filterTitle = 'Enable Filters';
    }
  }
  /*Dev-Code*---------------------------------------------------------------------------------------------*/
  dropDownData = function () {
    const me = this;

    /*  me.metric_form = [];
      me.metric_form.push({ label: "Add new Graph", value: "graph" });
      me.metric_form.push({ label: "Add graph from Catalogue", value: "catalogue" });
     */

    me.filterby = [];
    me.filterby.push({ label: 'Avg', value: 'Avg' });
    me.filterby.push({ label: 'Min', value: 'Min' });
    me.filterby.push({ label: 'Max', value: 'Max' });

    me.matchValues = [];
    me.matchValues.push({ label: 'Exact', value: 'exact' });
    me.matchValues.push({ label: 'Partial', value: 'partial' });

    me.criteria = [];
    me.criteria.push({ label: 'Include', value: 'Include' });
    me.criteria.push({ label: 'Exclude', value: 'Exclude' });

    me.operaters = [];
    me.operaters.push({ label: '=', value: '=' });
    me.operaters.push({ label: '>', value: '>' });
    me.operaters.push({ label: '<', value: '<' });
    me.operaters.push({ label: '>=', value: '>=' });
    me.operaters.push({ label: '<=', value: '<=' });
    me.operaters.push({ label: 'Top', value: 'Top' });
    me.operaters.push({ label: 'Bottom', value: 'Bottom' });
    me.operaters.push({ label: 'In-Between', value: 'In-Between' });


    me.values = [];
    me.values.push({ label: 'Avg', value: 'Avg' });
    me.values.push({ label: 'Min', value: 'Min' });
    me.values.push({ label: 'Max', value: 'Max' });
    me.values.push({ label: 'Count', value: 'Count' });
    me.values.push({ label: 'SumCount', value: 'SumCount' });

    me.openWith = [];
    me.openWith.push({ label: '1 x 1', value: '1' });
    me.openWith.push({ label: '2 x 2', value: '2' });
    me.openWith.push({ label: '3 x 3', value: '3' });
    me.openWith.push({ label: '4 x 4', value: '4' });
    me.openWith.push({ label: '9 x 9', value: '9' });
    me.openWith.push({ label: '16 x 16', value: '16' });
    me.openWith.push({ label: '18 x 18', value: '18' });
    me.openWith.push({ label: '20 x 20', value: '20' });
    me.openWith.push({ label: '32 x 32', value: '32' });
  }
  getCatalogueInfo(payload) {
    let me = this;
    me.relatedMetricsService.saveCatalogue(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof saveCatalogueLoadingState) {
          me.getCatalogueonLoading(state);
          return;
        }

        if (state instanceof saveCatalogueLoadedState) {
          me.getCatalogueonLoaded(state);
          return;
        }
      },
      (state: saveCatalogueLoadingErrorState) => {
        me.getCatalogueonLoadingError(state);
      }
    );
  }

  getCatalogueonLoaded(state: saveCatalogueLoadedState) {
    let me = this;
    me.error = null;
    me.loading = false;
    if (state.data && state.data.data) {
      me.tableDatas = state.data.data;
      me.getCatalogueList();
    }
    // else{
    //   this.messageService.add({ severity: 'error', summary: 'Error message', detail: 'Catalogue list is not Available.' });
    //   return;
    // }
    me.ref.detectChanges();
  }
  getCatalogueonLoadingError(state: saveCatalogueLoadingErrorState) {
    const me = this;
    me.tableDatas = null;
    me.error = state.error;
    me.loading = false;
  }
  getCatalogueonLoading(state: saveCatalogueLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  getCatalogueList() {
    const me = this;
    me.catalogueList = [];
    for (let i = 0; i < me.tableDatas.length; i++) {
      if (me.tableDatas[i].name)
        me.catalogueList.push({ label: me.tableDatas[i].name, value: me.tableDatas[i].name });
    }
    me.catalogueList = [...me.catalogueList];
    me.ref.detectChanges();
  }

  getbreadcrumb() {
    const me = this;
    let breadcrumb = [];
    breadcrumb.push({ label: "SelectedHierarchy:" });
    for (let i = 0; i < me.selectedHierarcy.length; i++) {
      breadcrumb.push({ label: me.selectedHierarcy[i].value });
    }
    me.breadcrumb = breadcrumb;
  }
  getselectedHierarcy(selectedHierarcy) {
    const me = this;
    if (selectedHierarcy && selectedHierarcy.length > 0) {
      me.selectedHierarcy = selectedHierarcy[0].subjectTags.reverse();
    }
  }

  getHierarchical(subjectsTags, level, glbMgId) {
    try {
      const me = this;
      if (level == -1) {
        me.firstTimeLoad = true;
      }
      const Hierarchicalpayload = {
        opType: 9,
        cctx: me.sessionService.session.cctx,
        duration: this.getDuration(),
        tr: me.sessionService.testRun.id,
        clientId: "Default",
        appId: "Default",
        glbMgId: glbMgId,
        levels: level,
        subject: {
          tags: subjectsTags,
        }
      };
      me.relatedMetricsService.loadHierarchical(Hierarchicalpayload).subscribe(
        (state: Store.State) => {
          if (state instanceof RelatedMetricsLoadingState) {
            me.onLoadingHierarchical(state);
            return;
          }

          if (state instanceof RelatedMetricsLoadedState) {
            me.onLoadedHierarchical(state);
            return;
          }
        },
        (state: RelatedMetricsLoadingErrorState) => {
          me.onLoadingHierarchicalError(state);
        }
      );

    } catch (e) {
      console.error("Error in groupsForSpecified--", e);
    }

  }

  private onLoadingHierarchical(state: RelatedMetricsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingHierarchicalError(state: RelatedMetricsLoadingErrorState) {
    const me = this;
    me.hierarchyobj = null;
    me.empty = null;
    me.error = state.error;
    me.loading = false;
    console.error(me.error);
  }

  private onLoadedHierarchical(state: RelatedMetricsLoadedState) {
    const me = this;
    let hierarchyList = state.data['hierarchy'];
    if (hierarchyList !== null && hierarchyList !== undefined && hierarchyList.length > 0) {
      if (this.firstTimeLoad) {
        me.populateGroupDataOnFirstTimeLoad(hierarchyList);
      }
      else {
        me.populateGroupData(hierarchyList);
      }
    }
    me.error = null;
    me.loading = false;
    this.ref.detectChanges();
  }

  /**
   * This method id used for fill the drodown list first Time Load of Open Related Metrics Window Operations
   */
  populateGroupDataOnFirstTimeLoad(dataToPopulate) {
    let jsons = dataToPopulate;
    if (!jsons) {
      return;
    }
    this.subjectsTags = [];
    this.hierarchyobj = [];
    this.treeVectorSelectArr = [];
    this.totalHierarchyList = [];
    if (jsons.length > 0) {
      let jsonmetaData = jsons[0];
      this.getMetaDataList(jsonmetaData);
    }
    for (let i = 0; i < this.totalHierarchyList.length; i++) {
      let json = {};
      json['metadata'] = this.totalHierarchyList[i];
      json['vectorList'] = [];
      json['isPatterBox'] = false;
      json['value'] = "";
      json['check'] = 'Show Together'
      this.hierarchyobj.push(json);
    }
    this.firstTimeLoad = false;
    this.fillOperations(jsons);
  }
  /*Fill vectorList into DropDown in Operations*/
  fillOperations(json) {
    let idx = this.index;
    let level = 1;
    let glbMgId = "01000000";
    if (idx != 0) {
      this.populateGroupData(json);
    }
    for (let i = idx; i < this.hierarchyobj.length; i++) {

      if (i < this.selectedHierarcy.length) {
        if (this.selectedHierarcy[i].key == this.hierarchyobj[i].metadata) {
          this.treeVectorSelectArr[i] = this.selectedHierarcy[i].value;
        }
        if (i == 0) {
          ++this.index;
          this.getHierarchicalOnFirstLoad([], level, glbMgId);
        } else {
          ++this.index;
          let tags = [];
          for (let j = 0; j < i; j++) {
            tags.push(this.selectedHierarcy[j])
          }
          this.getHierarchicalOnFirstLoad(tags, 1, glbMgId);
        }
      } else {
        this.treeVectorSelectArr[i] = 'All'
        if (i == this.selectedHierarcy.length) {
          ++this.index;
          this.getHierarchicalOnFirstLoad(this.selectedHierarcy, level, glbMgId);
        } else {
          ++this.index;
          if (i > this.selectedHierarcy.length) {
            this.selectedHierarcy.push({ key: this.hierarchyobj[i - 1].metadata, value: "All", mode: 2 })
            this.getHierarchicalOnFirstLoad(this.selectedHierarcy, level, glbMgId);
          }
        }
      }
    }
    this.subjectsTags = this.selectedHierarcy;
  }
  /**
   * This method id used for fill the drodown list of Open Related Metrics Window Operations
   */
  populateGroupData(dataToPopulate) {
    let json = dataToPopulate;
    if (!json) {
      return;
    }
    for (let i = 0; i < json.length; i++) {
      let vList = [];
      let metadataName = json[i]['metadata'];
      let metadataPresent = false;
      let count = 0;
      if (this.totalHierarchyList.indexOf(metadataName) != -1) {
        metadataPresent = true;
        count = this.totalHierarchyList.indexOf(metadataName);
      }
      if (metadataPresent) {
        vList.push({ label: 'ALL', value: 'All' })
        vList.push({ label: 'Pattern', value: 'Pattern' })
        for (let j = 0; j < json[i].vectorList.length; j++) {
          vList.push({ label: json[i].vectorList[j], value: json[i].vectorList[j] })
        }


        let k = this.hierarchyobj[count];
        let data = {
          metadata: k.metadata,
          vectorList: vList,
          isPatterBox: false,
          value: "",
          check: 'Show Together'
        }

        this.hierarchyobj[count] = { ...data };
        this.ref.detectChanges();
      }
    }
  }
  getMetaDataList(jsonmetaData) {

    if (this.selectedHierarcy.length > 2) {
      for (let i = 0; i < this.selectedHierarcy.length; i++) {
        this.totalHierarchyList.push(this.selectedHierarcy[i].key)
      }
    }
    else {
      if (jsonmetaData.metadata && jsonmetaData.metadata !== undefined) {
        let metaData = jsonmetaData.metadata;
        this.totalHierarchyList.push(metaData);
      }
      if (jsonmetaData.subjects && jsonmetaData.subjects !== undefined && jsonmetaData.subjects.length > 0) {
        let subject = jsonmetaData.subjects[0];
        this.getMetaDataList(subject)
      }
    }
  }

  OnHierarchyChange(event, i, metadataName) {
    this.dropDownIndex = i;
    if (this.dropDownIndex >= i) {
      this.subjectsTags = this.subjectsTags.slice(0, i);
      for (let k = i + 1; k < this.hierarchyobj.length; k++) {
        this.hierarchyobj[k].vectorList = [];
        this.hierarchyobj[k].isPatterBox = false;
        this.hierarchyobj[k].value = "";
        this.treeVectorSelectArr[k] = '';
      }
    }
    if (event.value == 'Pattern') {
      this.toEnterPattern = true;
      this.hierarchyobj[i]['isPatterBox'] = true;
      this.hierarchyobj[i].value = "";
      this.subjectsTags = this.gettingListOfTaggs('All', metadataName);

    }
    else {
      this.hierarchyobj[i]['isPatterBox'] = false;
      this.hierarchyobj[i].value = event.value;
      this.subjectsTags = this.gettingListOfTaggs(event.value, metadataName)
    }
    this.firstTimeLoad = false;
    this.getHierarchical(this.subjectsTags, 1, "01000000");
    this.pattern = '';


  }

  gettingListOfTaggs(metaDataValue, metadata) {
    let mode = 1;
    if (metaDataValue == "All") {
      mode = 2;
    }
    this.subjectsTags.push(
      {
        "key": metadata,
        "value": metaDataValue,
        "mode": mode
      }
    )
    return this.subjectsTags;

  }
  rightRadioClick() {
    const me = this;
    if (me.graphInformation === 'graph') {
      me.specifiedGraph = 'All';
      me.tabledata = [];
      this.groupsForSpecified();
    } else if (me.graphInformation === 'catalogue') {
      me.selectedCatalogue = "--Select a Catalogue--";
      me.getCatalogueInfoList();
      this.specifiedGraph = 'All';
      me.tabledata = [];
      if (me.catalogueList.length == 0) {
        this.messageService.add({ severity: 'error', summary: 'Error message', detail: 'Catalogue list is not Available.' });
        return;
      }
    }
  }

  selecteCatalogue(selectedCatalogue) {
    const me = this;
    me.tablevalues = [];
    me.tabledata = [];
    let metrics = [];
    let measure = {};
    let metricIds = [];
    let hierarchy = this.hierarchyobj;
    hierarchy.pop();
    for (let i = 0; i < me.tableDatas.length; i++) {
      if (me.tableDatas[i].name == selectedCatalogue.label) {
        me.catalogueName = selectedCatalogue.label;
        let temptargetDatadata = me.tableDatas[i].targetData;
        for (let k = 0; k < temptargetDatadata.length; k++) {
          let tableObj = {};
          var vector = temptargetDatadata[k].vectorName.sMeta;
          if ((vector == "All" || (vector.indexOf("PATTERN#") != -1))) {
            var groupname = temptargetDatadata[k];
            metrics.push(temptargetDatadata[k].label);
            metricIds.push(temptargetDatadata[k].metricId);
          } else {
            /*This is the case of specified of specified */
            metrics = [];
            metricIds = [];
            for (let idx = 0; idx < temptargetDatadata.length; idx++) {
              if (vector == temptargetDatadata[idx].vectorName.sMeta) {
                var groupnames = temptargetDatadata[idx];
                metrics.push(temptargetDatadata[idx].label);
                metricIds.push(temptargetDatadata[idx].metricId);
              }
            }

            let subject = {
              'tags': me.catalougeSubjectTag(vector, hierarchy),
            }

            me.makeindicesInfo(measure, groupnames, metrics, metricIds, subject);
          }
          tableObj = { group: temptargetDatadata[k].mg, gname: temptargetDatadata[k].label, indices: vector, icon: 'icons8 icons8-delete-trash' }
          me.tablevalues.push(tableObj);
        }
        if ((vector == "All" || (vector.indexOf("PATTERN#") != -1))) {
          let tempvector = [];
          if (vector.indexOf("PATTERN#") != -1) {
            tempvector = vector.split("#");
          }
          if (tempvector.length > 1) {
            vector = tempvector[1];
          }
          let subject = {
            'tags': me.catalougeSubjectTag(vector, hierarchy),
          }
          me.makeindicesInfo(measure, groupname, metrics, metricIds, subject);
        }

        me.tabledata = me.tablevalues;
      }
    }
  }

  catalougeSubjectTag(tags, hierarchy) {
    var temptag = [];
    if (tags !== "All")
      temptag = tags.split(">");
    else
      temptag.push(tags);

    let tag = [];
    for (let i = 0; i < hierarchy.length; i++) {

      if (temptag[i] && temptag[i] !== "*" && tags !== "All") {
        tag.push({ 'key': hierarchy[i].metadata, 'value': temptag[i], 'mode': 1 });
      } else {
        tag.push({ 'key': hierarchy[i].metadata, 'value': "All", 'mode': 2 });
      }
    }
    return tag;
  }
  /** this method is used to get all groups name for specified graph */
  groupsForSpecified() {
    try {
      const me = this;
      const grouppayload = {
        opType: 4,
        cctx: me.sessionService.session.cctx,
        duration: me.getDuration(),
        tr: me.sessionService.testRun.id,
        clientId: "Default",
        appId: "Default",
        selVector: "",
      };
      me.relatedMetricsService.loadgroup(grouppayload).subscribe(
        (state: Store.State) => {
          if (state instanceof RelatedMetricsLoadingState) {
            me.onLoadingGroup(state);
            return;
          }

          if (state instanceof RelatedMetricsLoadedState) {
            me.onLoadedGroup(state);
            return;
          }
        },
        (state: RelatedMetricsLoadingErrorState) => {
          me.onLoadingGroupError(state);
        }
      );

    } catch (e) {
      console.error("Error in groupsForSpecified--", e);
    }

  }

  private onLoadingGroup(state: RelatedMetricsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingGroupError(state: RelatedMetricsLoadingErrorState) {
    const me = this;
    me.groupList = null;
    me.empty = null;
    me.error = state.error;
    me.loading = false;
    console.error(me.error);
  }

  private onLoadedGroup(state: RelatedMetricsLoadedState) {
    const me = this;
    let groups = state.data;

    me.error = null;
    me.loading = false;
    me.populateGroupDatas(groups);
  }

  /**
   * This is used for fill the group name list
   */
  populateGroupDatas(dataToPopulate) {
    const me = this;
    me.groupList = [];
    let i = 0;
    let len = dataToPopulate.group.length;
    while (i < len) {
      let json = dataToPopulate.group[i];
      json['label'] = dataToPopulate.group[i].groupName;
      json['value'] = dataToPopulate.group[i].groupName;
      me.groupList.push(json);
      i++;
    }
    this.ref.detectChanges();
  }

  getGraphsOnGroupSelection() {
    try {
      const me = this;
      if (me.selectedGroupName === undefined || (me.selectedGroupName.label !== undefined && me.selectedGroupName.mgId === 'NA')) {
        me.selectedGraphs = [];
        return;
      }
      let groupName = me.selectedGroupName.groupName;
      let mgId = me.selectedGroupName.mgId;
      me.GroupId = mgId;
      let glbMgId = me.selectedGroupName.glbMgId;
      const graphpayload = {
        opType: 5,
        cctx: me.sessionService.session.cctx,
        duration: me.getDuration(),
        tr: me.sessionService.testRun.id,
        clientId: "Default",
        appId: "Default",
        mgId: mgId,
        glbMgId: glbMgId,
        grpName: groupName
      };

      me.relatedMetricsService.loadgraph(graphpayload).subscribe(
        (state: Store.State) => {
          if (state instanceof RelatedMetricsLoadingState) {
            me.onLoadingGraph(state);
            return;
          }

          if (state instanceof RelatedMetricsLoadedState) {
            me.onLoadedGraph(state);
            return;
          }
        },
        (state: RelatedMetricsLoadingErrorState) => {
          me.onLoadingGraphError(state);
        }
      );

    } catch (e) {
      console.error("Error in groupsForSpecified--", e);
    }

  }
  private onLoadingGraph(state: RelatedMetricsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingGraphError(state: RelatedMetricsLoadingErrorState) {
    const me = this;
    me.graphList = null;
    me.empty = null;
    me.error = state.error;
    me.loading = false;
    console.error(me.error);
  }

  private onLoadedGraph(state: RelatedMetricsLoadedState) {
    const me = this;
    let graphs = state.data['graph'];
    if (graphs !== null && graphs !== undefined && graphs.length > 0) {
      me.graphList = [];
      for (let i = 0; i < graphs.length; i++) {
        me.graphList.push({ label: graphs[i].name, value: graphs[i].metricId });
      }
    }
    me.specifiedGraph = 'All';
    me.error = null;
    me.loading = false;
    this.ref.detectChanges();
  }


  /**this method is used to add all selected graph into table */
  addSelectedGraphInTable() {
    try {
      const me = this;
      let measure = {};
      let metrics = [];
      let metricIds = [];
      me.tabledata = [];
      me.selectedGraphWithIndicesTable = [];
      if (me.selectedGraphs === undefined || me.selectedGraphs.length === 0) {
        this.messageService.add({ severity: 'error', summary: 'Error message', detail: 'Please select atleast one graph to add.' });
        return;
      }
      if (me.specifiedGraph === 'All') {
        me.tags = [];
        if (me.tablevalues.length == 0) {
          for (let i = 0; i < me.selectedGraphs.length; i++) {
            let tabelobj = {};
            metrics.push(this.selectedGraphs[i].label);
            metricIds.push(this.selectedGraphs[i].value);
            tabelobj = { group: me.selectedGroupName.label, gname: this.selectedGraphs[i].label, indices: me.specifiedGraph, icon: 'icons8 icons8-delete-trash' }
            me.tablevalues.push(tabelobj);
            me.makeCatalogueData(this.selectedGraphs[i], me.GroupId, me.specifiedGraph, me.selectedGroupName.label);

          }
        } else {
          for (let i = 0; i < me.selectedGraphs.length; i++) {
            let tabelobj = {};
            if (!(me.tablevalues.some(tablevalues => tablevalues.gname === this.selectedGraphs[i].label))) {
              metrics.push(this.selectedGraphs[i].label);
              metricIds.push(this.selectedGraphs[i].value);
              tabelobj = { group: me.selectedGroupName.label, gname: this.selectedGraphs[i].label, indices: me.specifiedGraph, icon: 'icons8 icons8-delete-trash' }
              me.tablevalues.push(tabelobj);
              me.makeCatalogueData(this.selectedGraphs[i], me.GroupId, me.specifiedGraph, me.selectedGroupName.label);
            }
          }
        }

        let tags = [];
        let hierarchyc: [] = [];
        let hierarchy = this.selectedGroupName.hierarchicalComponent;
        hierarchyc = hierarchy.split(">");
        for (let i = 0; i < hierarchyc.length; i++) {
          tags.push({ 'key': hierarchyc[i], 'value': me.specifiedGraph, 'mode': 2 });
        }
        let subject = {
          'tags': tags,
        }
        me.makeindicesInfo(measure, me.selectedGroupName, metrics, metricIds, subject);
      } else {
        /*If dataFromSpecifed not include PATTERN#----- */
        if (me.dataFromSpecifed && me.dataFromSpecifed != "" && me.dataFromSpecifed.indexOf("PATTERN#") == -1) {
          me.tags = [];
          let arrSpecified = me.dataFromSpecifed.split(",");
          if (me.tablevalues.length == 0) {
            for (let i = 0; i < me.selectedGraphs.length; i++) {
              metrics.push(this.selectedGraphs[i].label);
              metricIds.push(this.selectedGraphs[i].value);
              for (let j = 0; j < arrSpecified.length; j++) {
                let tabelobj = {};
                tabelobj = { group: me.selectedGroupName.label, gname: this.selectedGraphs[i].label, indices: arrSpecified[j], icon: 'icons8 icons8-delete-trash' }
                me.tablevalues.push(tabelobj);
                me.makeCatalogueData(this.selectedGraphs[i], me.GroupId, arrSpecified[j], me.selectedGroupName.label);
              }
            }
          } else {
            for (let i = 0; i < me.selectedGraphs.length; i++) {
              if (!(me.tablevalues.some(tablevalues => tablevalues.gname === this.selectedGraphs[i].label))) {
                metrics.push(this.selectedGraphs[i].label);
                metricIds.push(this.selectedGraphs[i].value);
                for (let j = 0; j < arrSpecified.length; j++) {
                  let tabelobj = {};
                  tabelobj = { group: me.selectedGroupName.label, gname: this.selectedGraphs[i].label, indices: arrSpecified[j], icon: 'icons8 icons8-delete-trash' }
                  me.tablevalues.push(tabelobj);
                  me.makeCatalogueData(this.selectedGraphs[i], me.GroupId, arrSpecified[j], me.selectedGroupName.label);
                }
              }
            }
          }
          for (let j = 0; j < arrSpecified.length; j++) {
            let subject = {
              'tags': me.makeSpecifiedSubjectTag(arrSpecified[j], this.hierarchyobj),
            }
            me.makeindicesInfo(measure, me.selectedGroupName, metrics, metricIds, subject);
          }
        }
        else if (me.dataFromSpecifed == "") {
          this.alertMsg("Please select specified indices!", "Error");
          return;

        }
        else {
          me.tags = [];
          if (me.tablevalues.length == 0) {
            for (let i = 0; i < me.selectedGraphs.length; i++) {
              let tabelobj = {};
              metrics.push(this.selectedGraphs[i].label);
              metricIds.push(this.selectedGraphs[i].value);
              tabelobj = { group: me.selectedGroupName.label, gname: this.selectedGraphs[i].label, indices: me.dataFromSpecifed, icon: 'icons8 icons8-delete-trash' }
              me.tablevalues.push(tabelobj);
              me.makeCatalogueData(this.selectedGraphs[i], me.GroupId, me.dataFromSpecifed, me.selectedGroupName.label);

            }
          } else {
            for (let i = 0; i < me.selectedGraphs.length; i++) {
              let tabelobj = {};
              if (!(me.tablevalues.some(tablevalues => tablevalues.gname === this.selectedGraphs[i].label))) {
                metrics.push(this.selectedGraphs[i].label);
                metricIds.push(this.selectedGraphs[i].value);
                tabelobj = { group: me.selectedGroupName.label, gname: this.selectedGraphs[i].label, indices: me.dataFromSpecifed, icon: 'icons8 icons8-delete-trash' }
                me.tablevalues.push(tabelobj);
                me.makeCatalogueData(this.selectedGraphs[i], me.GroupId, me.dataFromSpecifed, me.selectedGroupName.label);
              }
            }
          }
          //me.makeSubjectTag();
          let subject = {
            'tags': me.makeSpecifiedSubjectTag(me.tagListFromIndices, this.hierarchyobj),
          }
          me.makeindicesInfo(measure, me.selectedGroupName, metrics, metricIds, subject);
        }
      }
      me.tabledata = me.tablevalues;
      this.selectedGraphWithIndicesTable = [...me.tabledata];
    } catch (e) {
      console.error("error in addSelectedGraphInTable--", e);
    }
  }
  /*This code for making IndicesInfo*/
  makeindicesInfo(measure, selectedGroupName, metrics, metricIds, subject) {
    const me = this;
    if (selectedGroupName.mg !== undefined && selectedGroupName.mg !== null) {
      selectedGroupName.label = selectedGroupName.mg;
    }
    if (metrics.length > 0) {
      measure['mgType'] = 'NA';
      measure['mgTypeId'] = -1;
      measure['mg'] = selectedGroupName.label;
      measure['mgId'] = selectedGroupName.mgId;
      measure['metrics'] = metrics;
      measure['metricIds'] = metricIds;
      let data = {
        subject: subject,
        measure: measure,
      }
      me.indicesInfo.push(data);
    }
  }
  /*this code for making catalogue */
  makeCatalogueData(graph, GroupId, specifiedGraph, groupName) {
    let catalogueTableobj = {
      "description": "",
      "glbMetricId": "-1",
      "label": graph.label,
      "name": graph.label,
      "value": graph.label,
      "mgId": GroupId,
      "metricId": graph.value,
      "vectorName": {
        "mode": 0,
        "sMeta": specifiedGraph
      },
      "derivedNumber": 0,
      "mg": groupName
    }
    this.catalogueTabularData.push(catalogueTableobj);
  }

  /* Making subject tags for the specified */
  makeSpecifiedSubjectTag(tags, hierarchyobj) {
    if(tags.includes('>')){             //Bug 110179
    var temptag = [];
    if (tags !== "All")
      temptag = tags.split(">");
    else
      temptag.push(tags);
 
    let tag = [];
    for (let i = 0; i < hierarchyobj.length; i++) {

      if (temptag[i] && temptag[i] !== "*" && tags !== "All") {
        tag.push({ 'key': hierarchyobj[i].metadata, 'value': temptag[i], 'mode': 1 });
      } else {
        tag.push({ 'key': hierarchyobj[i].metadata, 'value': "All", 'mode': 2 });
      }
    }
    return tag;
     }else{
       return tags;
     }

  }

  createJsonForOpenRelatedMembers() {
    const me = this;
    me.tags = []
    me.typ = [];
    if (me.showSelectedOperationType !== "all" && me.showSelectedOperationType !== undefined) {
      this.enableFilter = 7;
    } else {
      this.enableFilter = 0;
    }
    let filter = null;
    let opt = '';
    me.makeSubjectTag();

    let subject = {
      'tags': me.tags,
    }
    //me.layoutType = 3;
    let type: number;
    if (this.valueType === 'undefined') {
      type = 0;
    } else if (this.valueType === 'Avg') {
      type = 0;
    }
    else if (this.valueType === 'Min') {
      type = 1;
    } else if (this.valueType === 'Max') {
      type = 2;
    } else if (this.valueType === 'Count') {
      type = 3;
    } else if (this.valueType === 'SumCount') {
      type = 4;
    }
    me.graphStatsType = type;
    /**Instansiating TreeOperaionsFilterByValueInfo. */
    if (this.enableFilter == 0) {
      filter = null
    } else {
      if (this.showSelectedOperationType == 'nonZero') {
        const me = this;
        me.typ.push(1);
        me.typ.push(this.enableFilter);
        me.Val1 = 0;
        me.Val2 = -1;
        opt = ">";
      }
      else if (this.showSelectedOperationType == 'zero') {
        const me = this;
        me.typ.push(2);
        me.typ.push(this.enableFilter);
        me.Val1 = 0;
        me.Val2 = -1;
        opt = "=";
      }
      else if (this.showSelectedOperationType == 'advanced_Op') {
        let AdvFiltertype = 0;
        if (this.By === 'undefined') {
          AdvFiltertype = 0;
        } else if (this.By === 'Avg') {
          AdvFiltertype = 0;
        }
        else if (this.By === 'Min') {
          AdvFiltertype = 1;
        } else if (this.By === 'Max') {
          AdvFiltertype = 2;
        } else if (this.By === 'Count') {
          AdvFiltertype = 3;
        }
        me.typ.push(AdvFiltertype);
        me.typ.push(this.enableFilter);
        if (me.Value === 'undefined') {
          opt = "=";
        } else if (me.Value === '=') {
          opt = me.Value;
        } else if (me.Value === '>') {
          opt = me.Value;
        } else if (me.Value === '>=') {
          opt = me.Value;
        } else if (me.Value === '<') {
          opt = me.Value;
        } else if (me.Value === '<=') {
          opt = me.Value;
        } else if (me.Value === 'In-Between') {
          opt = me.Value;
        } else if (me.Value === 'Top') {
          opt = me.Value;
        } else if (me.Value === 'Bottom') {
          opt = me.Value;
        }
        /* Changing Include value of Criteria to true otherwise false */
        // if (me.selectedcriteria === 'Include') {
        //   me.criteriaChk = 1;
        // } else {
        //   me.criteriaChk = 0;
        // }


      }
      filter = {
        "typ": me.typ,
        "opt": opt.toString(),
        "val1": Number(me.Val1),
        "val2": Number(me.Val2)
      }
    }
    me.filter = filter;
    me.grpBy['subject'] = subject;
    me.metricSetToLookup['catalogueName'] = "NA";
    me.metricSetToLookup['indicesInfo'] = me.indicesInfo;
  }



  /*This method is to make json for operation*/
  operations = function (metData, optValue, optName) {
    let mode: number;
    if (optValue === 'Pattern' && !optName.startsWith("*")) {
      optName = "*" + optName;
    }
    if (optValue === 'Pattern') {
      mode = 4;
    } else if (optValue === 'All') {
      mode = 2;
    } else {
      mode = 1;
    }
    let a = {
      'key': metData,
      'value': optName,
      'mode': mode,
    };

    return a;
  };

  /*Making Subject Tags*/
  makeSubjectTag() {
    for (let i = 0; i < this.selectedHierarcy.length; i++) {
      if (this.treeVectorSelectArr[i] === 'Pattern' && (this.treeSameVectComponent[i] === '' || this.treeSameVectComponent[i] === undefined)) {
        let msg = 'Please fill Pattern of ' + this.hierarchyobj[i].meta;
        this.messageService.add({ severity: 'error', summary: 'Error message', detail: msg });
        return;
      }
      if (this.treeSameVectComponent[i] === '' || this.treeSameVectComponent[i] === undefined) {
        this.treeSameVectComponent[i] = this.treeVectorSelectArr[i];
      }
      if (this.treeVectorSelectArr[i] !== 'Pattern' && this.treeVectorSelectArr[i] !== 'All' && this.treeVectorSelectArr[i] !== this.treeSameVectComponent[i]) {
        this.treeSameVectComponent[i] = this.treeVectorSelectArr[i];
      }
      this.tags.push(this.operations(this.hierarchyobj[i].metadata, this.treeVectorSelectArr[i], this.treeSameVectComponent[i]));
    }
  }
  /**
     * This method is used for get the duration object from the dashboard component
     */
  getDuration() {
    try {

      const dashboardTime: DashboardTime = this.dashboardCom.getTime(); // TODO: widget time instead of dashboard

      const startTime: number = _.get(
        dashboardTime,
        'time.frameStart.value',
        null
      );
      const endTime: number = _.get(dashboardTime, 'time.frameEnd.value', null);
      const graphTimeKey: string = _.get(dashboardTime, 'graphTimeKey', null);
      const viewBy: number = _.get(dashboardTime, 'viewBy', null);

      const duration = {
        st: startTime,
        et: endTime,
        preset: graphTimeKey,
        viewBy,
      }

      return duration;

    } catch (error) {
      console.error("Error is coming while getting the duration object ", error);
      return null;
    }
  }

  getHierarchicalOnFirstLoad(subjectsTags, level, glbMgId) {
    try {
      const me = this;
      const Hierarchicalpayload = {
        opType: 9,
        cctx: me.sessionService.session.cctx,
        duration: this.getDuration(),
        tr: me.sessionService.testRun.id,
        clientId: "Default",
        appId: "Default",
        glbMgId: glbMgId,
        levels: level,
        subject: {
          tags: subjectsTags,
        }
      };
      me.relatedMetricsService.loadHierarchical(Hierarchicalpayload).subscribe(
        (state: Store.State) => {
          if (state instanceof RelatedMetricsLoadingState) {
            me.onLoadingHierarchicalOnFirstLoad(state);
            return;
          }

          if (state instanceof RelatedMetricsLoadedState) {
            me.onLoadedHierarchicalOnFirstLoad(state);
            return;
          }
        },
        (state: RelatedMetricsLoadingErrorState) => {
          me.onLoadingHierarchicalErrorOnFirstLoad(state);
        }
      );

    } catch (e) {
      console.error("Error in groupsForSpecified--", e);
    }

  }
  private onLoadingHierarchicalOnFirstLoad(state: RelatedMetricsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingHierarchicalErrorOnFirstLoad(state: RelatedMetricsLoadingErrorState) {
    const me = this;
    me.hierarchyobj = null;
    me.empty = null;
    me.error = state.error;
    me.loading = false;
    console.error(me.error);
  }

  private onLoadedHierarchicalOnFirstLoad(state: RelatedMetricsLoadedState) {
    const me = this;
    let hierarchyList = state.data['hierarchy'];
    if (hierarchyList !== null && hierarchyList !== undefined && hierarchyList.length > 0)
      me.fillOperations(hierarchyList);
    me.error = null;
    me.loading = false;
    this.ref.detectChanges();
  }

  /*This method call when user click on open button*/
  openRelatedMembers() {
    try {
      const me = this;
      me.filter = null;
      me.flags = [];
      me.typ = [];

      if (me.graphInformation === 'catalogue') {
        if ((me.selectedCatalogue === "--Select a Catalogue--" || me.selectedCatalogue === "") && (me.tabledata.length === 0)) {
          me.alertMsg("Please select Catalogue.", "Error");
          return;
        }
      }
      if (me.graphInformation === 'graph') {
        if ((me.selectedGraphWithIndicesTable === undefined || me.selectedGraphWithIndicesTable === null || me.selectedGraphWithIndicesTable.length === 0)) {
          me.alertMsg("Please select graph to open !.", "Error");
          return;
        }
      }

      me.createJsonForOpenRelatedMembers();

      if (me.enableFilter == 7) {
        let efilter = 1;
        me.flags.push(efilter)
      }

      if (me.pattern == "exact") {
        me.exactMatch = 2;
        me.flags.push(me.exactMatch);
      }
      let exclOverall = 0;

      if (me.excOverallMetric === true) {
        exclOverall = 4;
        me.flags.push(exclOverall);
      }
      // me.flags.push(me.exactMatch);
      const openRelatedPayload = {
        opType: 7,
        cctx: me.sessionService.session.cctx,
        duration: me.getDuration(),
        tr: me.sessionService.testRun.id,
        clientId: "Default",
        appId: "Default",
        etag: "version_for_etag_provided_by_tsdb",
        flags: me.flags,
        grpBy: me.grpBy,
        metricSetToLookup: me.metricSetToLookup,
        ft: me.filter,
      };
      me.metaDataCall(openRelatedPayload);
    } catch (e) {
      console.error("error in openRelatedMembers--", e);
    }

  }

  metaDataCall(openRelatedPayload) {
    const me = this;

    me.relatedMetricsService.loadopenRelated(openRelatedPayload).subscribe(
      (state: Store.State) => {
        if (state instanceof RelatedMetricsLoadingState) {
          me.onLoadingopenRelated(state);
          return;
        }

        if (state instanceof RelatedMetricsLoadedState) {
          if (me.loadData.length == 0) {
            me.onLoadedopenRelated(state);
          }
          else {
            me.checkData(state);
          }

          return;
        }
      },
      (state: RelatedMetricsLoadingErrorState) => {
        me.onLoadingopenRelatedError(state);
      }
    );

    if (me.sessionService.testRun.id && me.sessionService.testRun.running) {
      if (me.treeOperationsService.stopCounter)
        clearInterval(me.treeOperationsService.stopCounter);

      me.treeOperationsService.stopCounter = setInterval(() => {
        me.metaDataCall(openRelatedPayload);
      }, 5000 * 60);
    }

  }
  private onLoadingopenRelated(state: RelatedMetricsLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingopenRelatedError(state: RelatedMetricsLoadingErrorState) {
    const me = this;
    me.openRelated = null;
    me.empty = null;
    me.error = state.error;
    me.loading = false;
    console.error(me.error);
    this.visible = false;
  }

  private onLoadedopenRelated(state: RelatedMetricsLoadedState) {
    const me = this;
    if (state.data && state.data['grpMetaData'] !== undefined) {
      me.loadData = state.data['grpMetaData'];
      if (me.loadData.length == 0) {
        me.openRelatedData = [];
        this.alertMsg("No Metric Found Based on applied criteria.", "Error");
        // me.messageService.add({ key: 'openRelatedMetrics', severity: 'error', summary: 'Error message', detail: "Data Not Available." });


        return;
      } else {
        me.dashboardInstance(me.loadData);
        me.error = null;
        me.loading = false;
        this.visible = false;
      }
    }

    this.ref.detectChanges();
  }

  public checkData(state: RelatedMetricsLoadedState) {
    const me = this;
    let tempData = [];
    if (state.data && state.data['grpMetaData'] !== undefined) {
      tempData = state.data['grpMetaData'];
      if (tempData.length > 0 && me.loadData.length !== tempData.length) { 
        me.loadData = tempData;
        me.dashboardInstance(tempData);
      }
    }

    
    me.error = null;
    me.loading = false;
  }

  dashboardInstance(data) {
    const me = this;
    let finalobj = [];
    for (let i = 0; i < data.length; i++) {
      let obj1 = {};
      let meData = data[i].mdata;
      obj1['mData'] = this.makeData(meData);
      obj1['pCaption'] = data[i].title;
      obj1['graphSettings'] = {};
      finalobj.push(obj1);
    }

    me.openRelatedData = [];
    me.openRelatedData = finalobj;
    DashboardComponent.getInstance().subscribe((dc: DashboardComponent) => {
      if (me.openWithNewLayout) {
        dc.selectedWidget.widget.widgetIndex = 0;
      }
      let length = (this.layoutType * this.layoutType);

      if (me.openRelatedData.length > length)
        length = me.openRelatedData.length;


      // me.dashboardCom.data.favDetailCtx.widgets = [];
      dc.data.favDetailCtx.widgets = [];
      this.widgetLayouts = this.getWidgetLayouts(this.layoutType, this.layoutType, length);
      dc.data.favDetailCtx.layout.configGrid.cols = this.GRID_MAXCOLS;
      dc.data.favDetailCtx.layout.configGrid.rowHeight = this.GRID_ROWHEIGHT;
      dc.data.favDetailCtx.layout.configGrid.widgetLayouts = this.widgetLayouts;

      for (let i = 0; i < length; i++) {
        let newWidget = dc.getNewWidget('GRAPH')
        newWidget.name = "";
        newWidget.id = "";
        dc.data.favDetailCtx.widgets.push(newWidget);
        dc.data.favDetailCtx.widgets[i].widgetIndex = i;
        if (me.openRelatedData[i]) {
          dc.data.favDetailCtx.widgets[i].id = me.openRelatedData[i].pCaption;
          dc.data.favDetailCtx.widgets[i].name = me.openRelatedData[i].pCaption;
        }

        dc.data.favDetailCtx.widgets[i].dataAttrName = "avg";
        dc.data.favDetailCtx.widgets[i].description = "";
        dc.data.favDetailCtx.widgets[i].graphs = {};
        dc.data.favDetailCtx.widgets[i].layout = dc.data.favDetailCtx.layout.configGrid.widgetLayouts[i];
      }

      me.dashboardCom.changeLayout(me.dashboardCom.data.favDetailCtx.layout);

      dc.renderMetricsSetting(me.openRelatedData, me.graphStatsType, me.selectedcriteria, me.GroupId, me.filter, "Open Related Metrics");

    });

  }
  makeData(meData) {
    let objs = [];
    for (let j = 0; j < meData.length; j++) {
      let vectorName = '';
      let subject = [];
      let subj = meData[j].subject;
      for (let k = 0; k < subj.length; k++) {
        if (k == 0)
          vectorName = subj[k].value;
        else
          vectorName = vectorName + ">" + subj[k].value;
        subject.push({ key: subj[k].key, value: subj[k].value, mode: 1 });
      }
      objs.push(
        {
          "measure": meData[j].measure,
          "subject": subject,
          "glbMetricId": meData[j].glbMetricId,
          "vectorName": vectorName,
        }
      );
    }
    return objs;
  }
  SaveCatalogue(saveCatalogue: SaveCatalogueComponent) {
    if (this.selectedGraphWithIndicesTable === undefined || this.selectedGraphWithIndicesTable === null || this.selectedGraphWithIndicesTable.length === 0) {
      this.messageService.add({ severity: 'error', summary: 'Error message', detail: "Select some graph to save the new catalogue." });
      this.ref.detectChanges();
      return;
    }
    this.relatedCatalogue = true;
    saveCatalogue.openSaveCatalogue(this.relatedCatalogue, this.catalogueList);
    this.relatedCatalogue = false;
  }

  /*This code is for Update and save catalogue*/
  updateCatalogue(catalogueName, catalogueDescription) {
    let me = this;
    let forSave = true;
    me.catalogueName = catalogueName;
    let catalogueDataTobeUpdated: TargetData[] = [];
    catalogueDataTobeUpdated = me.catalogueTabularData;
    let creationDate: string;
    const cctx = this.sessionService.session.cctx;
    creationDate = new Date().toLocaleString();
    if (me.catalogueList.length > 0) {
      if (!(me.catalogueList.some(catalogueList => catalogueList.label === catalogueName))) {
        forSave = true
      }
      else {
        forSave = false;
      }
    }
    if (forSave == true) {
      var payload: SaveCatalogue = {
        'opType': "save",
        'cctx': cctx,
        'targetData': catalogueDataTobeUpdated,
        'name': catalogueName,
        'description': catalogueDescription,
        'createdBy': cctx.u,
        "creationDate": creationDate,
        "metricType": "Normal",
        "arrPercentileOrSlabValues": [],
        "chartType": "0",
        "seriesType": ""
      }
    } else {
      var payload: SaveCatalogue = {
        'opType': "update",
        'cctx': cctx,
        'targetData': catalogueDataTobeUpdated,
        'name': catalogueName,
        'description': catalogueDescription,
        'createdBy': cctx.u,
        "creationDate": creationDate,
        "metricType": "Normal",
        "arrPercentileOrSlabValues": [],
        "chartType": "0",
        "seriesType": ""
      }
    }
    me.relatedMetricsService.saveCatalogue(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof saveCatalogueLoadingState) {
          me.updateonLoading(state);
          return;
        }

        if (state instanceof saveCatalogueLoadedState) {
          me.updateonLoaded(state);
          return;
        }
      },
      (state: saveCatalogueLoadingErrorState) => {
        me.updateonLoadingError(state);
      }
    );
    me.getCatalogueInfoList()
    me.ref.detectChanges();
  }
  updateonLoadingError(state: saveCatalogueLoadingErrorState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  updateonLoaded(state: saveCatalogueLoadedState) {
    let me = this;
    me.error = null;
    me.loading = false;
    me.savedata = state.data;
    if (me.savedata === null) {
      return null;
    }
    if (me.savedata.status.code === 202) {
      me.visible = false;
    }

  }
  updateonLoading(state: saveCatalogueLoadingState) {
    const me = this;
    me.error = null;
    me.savedata = null;
    me.loading = true;
  }

  hide() {
    this.visible = false;
  }


  getWidgetLayouts(rowsCalc, colsCalc, length) {
    const me = this;
    let viewPortContainerHeight = this.calculateContainerHeight();
    let fixedRowHeight = this.GRID_ROWHEIGHT; //rowheight of grids
    let margin = this.WIDGETS_MARGIN; // margin between widgets
    let totalRowHeight = fixedRowHeight + margin;
    let maxCols = this.GRID_MAXCOLS; // fixed cols in layout
    let totalNoOfRows = Math.floor(viewPortContainerHeight / totalRowHeight);
    let widgetPerRowHeight = Math.floor(totalNoOfRows / rowsCalc);
    let widgetHeightCalc = widgetPerRowHeight * rowsCalc;
    let wHeight = totalNoOfRows > widgetHeightCalc ? totalNoOfRows - widgetHeightCalc : widgetHeightCalc - totalNoOfRows;
    let islessHeight = totalNoOfRows > widgetHeightCalc ? true : false;
    let calc = rowsCalc;
    let counter = 1;
    let rowCounter = 1;
    let widgetPerColWidth = colsCalc <= 0 ? maxCols : Math.floor(maxCols / colsCalc);
    let widgetWidthCalc = widgetPerColWidth * colsCalc;
    let wWidth = maxCols > widgetWidthCalc ? maxCols - widgetWidthCalc : widgetWidthCalc - maxCols;
    let islessWidth = maxCols > widgetWidthCalc ? true : false;
    let colNewCalc = colsCalc - 1;
    let widgetLayouts: DashboardWidgetLayout[] = [];
    widgetLayouts.push({ cols: widgetPerColWidth, rows: widgetPerRowHeight, x: 0, y: 0 });
    //convert according to widget length

    for (let i = 0; i < length; i++) {

      //ignoring first widget
      if (i == 0) {
        continue;
      }

      else if (i % colsCalc == 0) {
        let rows = widgetPerRowHeight;
        counter++;
        if (counter == rowsCalc) {
          rows = islessHeight ? widgetPerRowHeight + wHeight : widgetPerRowHeight - wHeight;
          counter = 0;
        }

        widgetLayouts.push({ cols: widgetPerColWidth, rows: rows, x: 0, y: widgetLayouts[i - 1].rows + widgetLayouts[i - 1].y });
        continue;
      }
      //for same row for another cols
      let cols = widgetPerColWidth;
      if (rowCounter == colNewCalc) {
        cols = islessWidth ? widgetPerColWidth + wWidth : widgetPerColWidth - wWidth;
        rowCounter = 0;
      }
      rowCounter++;
      widgetLayouts.push({ cols: cols, rows: widgetLayouts[i - 1].rows, x: widgetLayouts[i - 1].cols + widgetLayouts[i - 1].x, y: widgetLayouts[i - 1].y });
      continue;
    }
    return widgetLayouts;
  }

  calculateContainerHeight() {
    if (document.getElementsByClassName('scrollVertical')[0] !== undefined) {
      let totalheight = (<HTMLElement>document.getElementsByClassName('scrollVertical')[0]).clientHeight;
      if (document.getElementsByClassName('open')[0] !== undefined) {
        let lowerPanelHeight = (<HTMLElement>document.getElementsByClassName('scrollVertical')[0]).clientHeight;
        totalheight = totalheight + lowerPanelHeight + 2;
      }
      return totalheight;
    }

    let height = Math.round(document.getElementsByClassName('selected-widget-container')[0].getBoundingClientRect().height);
    let x = Math.floor(document.getElementsByClassName('ui-carousel-items-container')[0].getBoundingClientRect().x) + Math.floor(document.getElementsByClassName('selected-widget-container')[0].getBoundingClientRect().x);
    let totalheight = height + x + (2 * this.WIDGETS_MARGIN);
    return totalheight;
  }

  deleteRowData(rowData) {
    if (this.tabledata.indexOf(rowData) != -1) {
      let index = this.tabledata.indexOf(rowData);
      this.tabledata.splice(index, 1);
    }

  }
  deleteAllRowData() {

    this.tabledata = [];
    this.selectedGraphWithIndicesTable = [];

  }

  alertMsg(msg, header) {
    this.dialogVisible = true;
    this.confirmation.confirm({
      key: "openRelatedMetric",
      message: msg,
      header: header,
      accept: () => { this.dialogVisible = false; },
      reject: () => { this.dialogVisible = false; },
      rejectVisible: false
    });

    this.ref.detectChanges();
  }

  /**destroying a component */
  ngOnDestroy() {
    try {
      clearInterval(this.treeOperationsService.stopCounter);
    } catch (error) {
      console.error('error in unsubscribe', error);
    }
  }

}
