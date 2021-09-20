import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, OverlayPanel, SelectItem } from 'primeng';
import { AppError } from 'src/app/core/error/error.model';
import { Store } from 'src/app/core/store/store';
import { SearchSidebarComponent } from 'src/app/shared/search-sidebar/search-sidebar/search-sidebar.component';
import { SearchSidebarModule } from 'src/app/shared/search-sidebar/search-sidebar/search-sidebar.module';
import { SpecifiedTimeComponent } from '../../drilldown/transactions-trend/specified-time/specified-time.component';
import { EndToEndService } from '../service/end-to-end.service';
import { NodeActionSidebarComponent } from '../sidebars/node-action-sidebar/node-action-sidebar.component';
import { ShowDashboardComponent } from '../sidebars/show-dahboard/show-dahboard.component';

import {
  jsPlumbToolkit,
  jsPlumbToolkitOptions,
  ViewOptions,
  SurfaceRenderParams,
  Surface,
} from 'jsplumbtoolkit';
import {
  jsPlumbSurfaceComponent,
  jsPlumbService,
  AngularViewOptions,
} from 'jsplumbtoolkit-angular';
import { SolarPrefNodeComponent } from './solar-pref-node/solar-pref-node.component';
import { OutputNodeComponent } from './output-node/output-node.component';
import {
  EndToEndEditData,
  EndToEndGraphical,
  EndToEndNode,
  EndToEndEdge,
  Duration,
} from './service/end-to-end-graphical.model';
import {
  EndToEndGraphicalDataLoadingState,
  EndToEndGraphicalDataLoadedState,
  EndToEndGraphicalDataLoadingErrorState,
} from './service/end-to-end-graphical.state';
import { EndToEndGraphicalService } from './service/end-to-end-graphical.service';
import { CallDetailsComponent } from '../dialog/call-details/call-details.component';
import { MapIntegrationComponent } from '../dialog/map-integration/map-integration.component';
import { RenameIntegrationComponent } from '../dialog/rename-integration/rename-integration.component';
import { RenameMultipleIntegrationComponent } from '../dialog/rename-multiple-integration/rename-multiple-integration.component';
import { ResetIntegrationComponent } from '../dialog/reset-integration/reset-integration.component';
import { EndToEndNewGroupComponent } from '../dialog/end-to-end-new-group/end-to-end-new-group.component';
import { NodeInfoComponent } from '../sidebars/node-info/node-info.component';
import { NodeRepresentationComponent } from '../sidebars/node-representation/node-representation.component';
import { TopTransactionComponent } from '../sidebars/top-transaction/top-transaction.component';
import { Subscription } from 'rxjs';
import { EteTimeFilterComponent } from 'src/app/shared/ete-time-filter/ete-time-filter.component';
import { END_TO_END_EDIT_DROPDOWN_OPTIONS } from './service/end-to-end-graphical.dummy';
import { customSelectItem } from './service/end-to-end-graphical.model';

@Component({
  selector: 'app-end-to-end-graphical',
  templateUrl: './end-to-end-graphical.component.html',
  styleUrls: ['./end-to-end-graphical.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class EndToEndGraphicalComponent implements OnInit, AfterViewInit {
  @ViewChild('op1') op1: OverlayPanel;

  @ViewChild(CallDetailsComponent, { read: CallDetailsComponent })
  private callDetailsComponent: CallDetailsComponent;

  @ViewChild(MapIntegrationComponent, { read: MapIntegrationComponent })
  private mapIntegrationComponent: MapIntegrationComponent;

  @ViewChild(RenameIntegrationComponent, { read: RenameIntegrationComponent })
  private renameIntegrationComponent: RenameIntegrationComponent;

  @ViewChild(RenameMultipleIntegrationComponent, {
    read: RenameMultipleIntegrationComponent,
  })
  private renameMultipleIntegrationComponent: RenameMultipleIntegrationComponent;

  @ViewChild(ResetIntegrationComponent, { read: ResetIntegrationComponent })
  private resetIntegrationComponent: ResetIntegrationComponent;

  @ViewChild(EndToEndNewGroupComponent, { read: EndToEndNewGroupComponent })
  private EndToEndNewGroupComponent: EndToEndNewGroupComponent;

  @ViewChild(NodeActionSidebarComponent, { read: NodeActionSidebarComponent })
  private nodeActionSidebarComponent: NodeActionSidebarComponent;

  @ViewChild('searchSidebar', { read: SearchSidebarComponent })
  searchSidebar: SearchSidebarComponent;

  @ViewChild('nodeInfo', { read: NodeInfoComponent })
  public nodeInfo: NodeInfoComponent;

  @ViewChild(TopTransactionComponent, { read: TopTransactionComponent })
  private nodeTransaction: TopTransactionComponent;

  @ViewChild(NodeRepresentationComponent, { read: NodeRepresentationComponent })
  private nodeRepresentation: NodeRepresentationComponent;

  @ViewChild(ShowDashboardComponent, { read: ShowDashboardComponent })
  private nodeShowDashboard: ShowDashboardComponent;

  // we dont really need this, we just put it here to show you how you can do it.
  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent: jsPlumbSurfaceComponent;

  @ViewChild('tmplNode', { read: ElementRef, static: false })
  tmplNode: ElementRef;

  @ViewChild('solarPerf')
  solarPrefOverlay: OverlayPanel;

  @ViewChild('outputNode')
  outputOverlay: OverlayPanel;

  callDetailsInfo: any;
  selectedSidebar: any;
  selectedDialog: any;

  data: EndToEndGraphical;
  editOptions: EndToEndEditData;

  leaf?: boolean;
  expanded?: boolean;
  error: AppError;
  loading: boolean;
  empty: boolean;

  tier: string;
  zoomRange: number;

  endtoendEditMode: boolean;

  isShow: boolean;

  showLegends: boolean = false;

  breadcrumb: MenuItem[];

  saveOptions: MenuItem[];
  outputNodeMenu: MenuItem[];

  showNewGroup = false;
  saveAs: boolean = false;
  list2: any[];

  selectedNodes: any;
  filteredNodes: any[];

  showCallSetting: any;
  valueSetting: any;

  isEnabledColumnFilter: boolean = false;
  filterTitle: string = 'Enable Filters';
  tooltipzindex = 100000;

  isCallDetailsEnabledColumnFilter: boolean = false;
  callDetailFilterTitle: string = 'Enable Filters';

  nodeOverlayData: EndToEndNode;
  outputNodeOverlayData: EndToEndNode;
  nodeData: EndToEndNode;
  solarNodeData: EndToEndNode;
  // these are plugged in to the Surface component.
  surfaceId = 'flowchartSurface';
  toolkitId = 'flowchart';
  surface: Surface;

  toolkit: jsPlumbToolkit;
  play : boolean = true;
  showPlayBtn : boolean = true;
  playPauseTooltip : string = 'Pause';
  // Empty in this demonstration.
  toolkitParams: jsPlumbToolkitOptions = {};

  zoomLevel: string = '1';


  toggleOverlay = ({ originalEvent }) => this.op1.toggle(originalEvent);

  // view: AngularViewOptions;
  renderParams: SurfaceRenderParams;

  //Edit-Flowmap Options
  flowmapInfo: any;
  enableTPS: boolean = false;
  enableRES: boolean = false;
  enableCPU: boolean = false;
  useLocalRenaming: boolean = false;
  showIPwith0Calls: boolean = false;
  isFullFlowPath: boolean = false;
  enableApplyToIPCheck: boolean = false;
  visibleNodes : EndToEndNode[]= [];
  visibleEdges : EndToEndEdge[] = [];
  showOrHideTiersCheck: boolean = false;
  configTps: string = '-1';
  configRes: string = '-1';
  configCpu: string = '-1';
  tpsOperator: string = '>=';
  cpuOperator: string = '>=';
  resOperator: string = '>=';
  callsUnit: string = '';
  _selectedColumns: customSelectItem[] = [];
  endToEndTimeFilterChangeSubscription: Subscription;

  private timeperiod: string = null;

  endToEndURL = '/end-to-end/detailed';

  constructor(
    private $jsplumb: jsPlumbService,
    private endtoendGraphicalService: EndToEndGraphicalService,
    private cd: ChangeDetectorRef,
    private router: Router,

    private route: ActivatedRoute
  ) {
    // this.toolkitId = 'flowchart';
  }

  ngOnInit(): void {
    const me = this;

    // Create the Toolkit instance via the jsPlumb service.
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams);

    me.breadcrumb = [{ label: 'System' }, { label: 'End To End Tier' }];

    me.renderParams = {
      layout: {
        type: 'Spring',
      },
      zoomToFit: true,
      consumeRightClick: false,
      enablePanButtons: false,
    };
  }

  ngAfterViewInit(): void {
    const me = this;

    // me.route.params.subscribe((params) => {
    //   if (params && params.tp && me.timeperiod != params.tp) {
    //     me.endToEndURL += '/detailed/' + params.tp + '/' + params.vb;
    //     me.getflowmapInfo();
    //     // me.load(params.tp);
    //   }
    // });

    EteTimeFilterComponent.getInstance().subscribe(
      (endToEndTimeFilterComponent: EteTimeFilterComponent) => {
        me.getflowmapInfo();
        if (me.endToEndTimeFilterChangeSubscription) {
          me.endToEndTimeFilterChangeSubscription.unsubscribe();
        }

        me.endToEndTimeFilterChangeSubscription = endToEndTimeFilterComponent.onChange.subscribe(
          (data) => {
            // TO-DO : Time Period state management
            me.endtoendGraphicalService.setDuration(me.endtoendGraphicalService.createDuration(data.temporaryTimeFrame[1],data.temporaryTimeFrame[2],data.timePeriod.selected.id,+data.viewBy.selected.id));
            me.load(me.endtoendGraphicalService.getDuration());
          }
        );
      }
    );

    me.list2 = [];

    me.saveOptions = [
      {
        label: 'Save',
      },
      {
        label: 'Save As',
        command: this.toggleOverlay,
      },
    ];

    me.outputNodeMenu = [
      {
        label: 'Drill Down',
      },

      {
        label: 'Map Integration Point Tier',
        command: (event: any) => {
          this.mapIntegrationComponent.show();
        },
      },
      {
        label: 'Rename Integration Point',
        command: (event: any) => {
          this.renameIntegrationComponent.show();
        },
      },
      {
        label: 'Rename Multiple Integration Point',
        command: (event: any) => {
          this.renameMultipleIntegrationComponent.show();
        },
      },
      {
        label: 'Reset Integration Point Names',
        command: (event: any) => {
          this.resetIntegrationComponent.show();
        },
      },

      {
        label: 'Call Details',
        command: (event: any) => {
          this.callDetailsComponent.show();
        },
      },
    ];



    this.$jsplumb.getSurface(this.surfaceId, (s: Surface) => {
      this.surface = s;
    });
  }

  togglePlayPause(){
    const me = this;
    me.play = !me.play;
    me.playPauseTooltip = me.play ? 'Pause' : 'Play';
  }
  firstTimeLoadToolKit(){
    const me = this;
    me.editOptions = END_TO_END_EDIT_DROPDOWN_OPTIONS;
    var tierSearch : customSelectItem[] = [];
    tierSearch =  me.data.endToEndGraphicalView.node.map(e=>{
        return {
          label: e.nodeName,
          value: e.id,
          visible : false
        };
    })

    me.editOptions.dropdownOptions.tierSearch = tierSearch;
    const hiddenTiers = me.flowmapInfo.setValuesToSession.split(",");
    
    for (const c of me.editOptions.dropdownOptions.tierSearch) {
      if (!hiddenTiers.includes(c.value)) {
        c.visible = true;
        me._selectedColumns.push(c);
      }
    }
    me.visibleNodes = me.data.endToEndGraphicalView.node.filter((e) => {
      return (!hiddenTiers.includes(e.id))
    });
    me.visibleEdges = me.data.endToEndGraphicalView.edge.filter((e) => {
      return (!hiddenTiers.includes(e.source) && !hiddenTiers.includes(e.target))
    });

  }

  view: AngularViewOptions = {
    nodes: {
      solarParent: {
        events: {
          tap: (params: any) => {
            this.openNodeInfoSidebar(params.node.data);
          },
          mouseover: (param: any) => {
            this.solarNodeData = param.node.data;
            this.openSolarNodePopup(param.node.data);
            if (
              this.outputOverlay &&
              this.outputOverlay.overlayVisible === true
            ) {
              this.outputOverlay.hide();
            }
          },
          mouseout: (param: any) => {
            // setTimeout(() => {
            //   this.overlayPanel.hide();
            // }, 1500);
          },
        },
      },
      outputParent: {
        events: {
          mouseover: (param: any) => {
            this.openOutputNodeOverlay(param.node.data);
            if (
              this.solarPrefOverlay &&
              this.solarPrefOverlay.overlayVisible === true
            ) {
              this.solarPrefOverlay.hide();
            }
          },
          mouseout: (param: any) => {
            // setTimeout(() => {
            //   this.outputOverlay.hide();
            // }, 500);
          },
        },
      },
      solarPrefNode: {
        parent: 'solarParent',
        component: SolarPrefNodeComponent,
        events: {
          click: function (e, originalEvent) {},
        },
      },
      outputNode: {
        parent: 'outputParent',
        component: OutputNodeComponent,
      },
    },
    edges: {
      default: {
        connector: 'Straight',
        anchor: ['Right', 'Left'],
        overlays: [
          ['Label', { location: 0.5, label: '${label}' }],
          ['Arrow', { location: 0.3, width: 8, length: 8, direction: 1 }],
        ],

        endpoint: 'Blank',
      },
    },
  };

  filterNodes(event) {
    const filtered: any[] = [];
    const query = event.query;
    // for (const nodesall of this.data.options.nodesGroup) {
    //   if (nodesall.name.toLowerCase().indexOf(query.toLowerCase()) === 0) {
    //     filtered.push(nodesall);
    //   }
    // }
    this.filteredNodes = filtered;
  }

  @Input() get selectedColumns(): customSelectItem[] {
    const me = this;
    return me._selectedColumns;
  }

  set selectedColumns(val: customSelectItem[]) {
    const me = this;
    me._selectedColumns = me.editOptions.dropdownOptions.tierSearch.filter((col) => val.includes(col));
  }

  zoomToFit() {
    this.surface.getToolkit().clearSelection();
    this.surface.zoomToFit();
  }

  

  zoomToLevelOne() {
    this.zoomLevel = '1';
    this.surface.setZoom(0.2);
  }
  zoomToLevelTwo() {
    this.zoomLevel = '2';
    this.surface.setZoom(0.4);
  }
  zoomToLevelThree() {
    this.zoomLevel = '3';
    this.surface.setZoom(0.7);
  }
  zoomToLevelFour() {
    this.zoomLevel = '4';
    this.surface.setZoom(1);
  }

  openNewGroup() {
    this.showNewGroup = true;
  }

  load(duration : Duration) {
    const me = this;
    me.timeperiod = duration.preset;
    me.endtoendGraphicalService.load(duration).subscribe(
      (state: Store.State) => {
        if (state instanceof EndToEndGraphicalDataLoadingState) {
          me.onLoading(state);
          return;
        }
        if (state instanceof EndToEndGraphicalDataLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: EndToEndGraphicalDataLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }

  getflowmapInfo(){
    const me = this;
    me.endtoendGraphicalService.flowmapInfo().subscribe(
      (state) => {
        if(state!=null || state!=undefined)
          me.flowmapInfo = state;
      },
      (e: any) => {
       console.error("Error in getflowmapInfo method ", e);
      }
    );
  }

  private onLoading(state: EndToEndGraphicalDataLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: EndToEndGraphicalDataLoadingErrorState) {
    const me = this;
    me.data = null;
    me.error = state.error;
    me.loading = false;
  }

  private onLoaded(state: EndToEndGraphicalDataLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;

    if (me.data) {
      me.firstTimeLoadToolKit();
      me.toolkit.clear();
      me.toolkit.load({
        data: {
          nodes: me.visibleNodes,
          edges: me.visibleEdges,
        },
      });
    }
  }


  existInNodeSelection(arr : EndToEndNode[], source : string, target : string) : boolean{
    var sourceFound = false, targetFound = false;
    arr.forEach(e=>{
      if(e.id==source){
        sourceFound = true;
      }
      if(e.id==target){
        targetFound = true;
      }

    });
    return sourceFound&&targetFound;
  }


  //Save Edit Changes
  ApplyEditChanges() {
     /**
     * TO-DO  | handle below
     * Use Local Renaming of Integration
     * Show Flowpath upto n level on double click
     * Show Integration Point with 0 Calls
     * Apply these settings on integration point also
     * Show Call Details per
     */
    const me = this;
    var nodeSelection : EndToEndNode[] = [] , edgeSelection : EndToEndEdge[] = [] ;

    const selectedNodes = me.selectedColumns.map(e=>e.value).toString();
      nodeSelection = me.data.endToEndGraphicalView.node.filter(e=>{
        return (selectedNodes.includes(e.id));
      });
      edgeSelection = me.data.endToEndGraphicalView.edge.filter(e=>{
        return (selectedNodes.includes(e.source) && selectedNodes.includes(e.target));
      });

    if (me.enableTPS) {
      nodeSelection = nodeSelection.filter(e=> {
        if (me.tpsOperator == '>=' && e.tps >= Number.parseInt(me.configTps))
          return e;
        if (me.tpsOperator == '<=' && e.tps <= Number.parseInt(me.configTps))
          return e;
      });
      edgeSelection = edgeSelection.filter(e=> {
        return (me.existInNodeSelection(nodeSelection,e.source,e.target));
      });
    }
    if (me.enableCPU) {
      nodeSelection = nodeSelection.filter(e=> {
        if (me.cpuOperator == '>=' && e.cpuUtilization >= Number.parseInt(me.configCpu))
          return e;
        if (me.cpuOperator == '<=' && e.cpuUtilization <= Number.parseInt(me.configCpu))
          return e;
      });
      edgeSelection = edgeSelection.filter(e=> {
        return (me.existInNodeSelection(nodeSelection,e.source,e.target));
      });
    }
    if (me.enableRES) {
      nodeSelection = nodeSelection.filter(e=> {
        if (me.resOperator == '>=' && e.avgResTime >= Number.parseInt(me.configRes))
          return e;
        if (me.resOperator == '<=' && e.avgResTime <= Number.parseInt(me.configRes))
          return e;
      });
      edgeSelection = edgeSelection.filter(e=> {
        return (me.existInNodeSelection(nodeSelection,e.source,e.target));
      });
    }
    
    me.toolkit.clear();
    me.toolkit.load({
      data : {
        nodes : nodeSelection,
        edges : edgeSelection
      }
    });
    me.endtoendEditMode = false;
  }


  searchSummaryHide($event) {
    this.isShow = $event;
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

  checkToogle() {
    const me = this;
    me.isCallDetailsEnabledColumnFilter = !me.isCallDetailsEnabledColumnFilter;
    if (me.isCallDetailsEnabledColumnFilter === true) {
      me.callDetailFilterTitle = 'Disable Filters';
    } else {
      me.callDetailFilterTitle = 'Enable Filters';
    }
  }

  openSolarNodePopup(data) {
    this.nodeOverlayData = data;
    if (this.solarPrefOverlay) {
      this.solarPrefOverlay.show(event);
    }
  }

  openOutputNodeOverlay(data) {
    this.outputNodeOverlayData = data;
    if (this.outputOverlay) {
      this.outputOverlay.show(event);
    }
  }

  openNodeInfoSidebar(data) {
    this.nodeData = data;
    this.nodeInfo.visible = true;
    this.nodeInfo.openNodeInfo();
  }

  openNodeTransactionSidebar(tierName) {
    this.nodeTransaction.visible = true;
    this.nodeTransaction.tierName = tierName;
    this.nodeTransaction.load(this.endtoendGraphicalService.getDuration());
    this.cd.detectChanges();
  }

  openNodeRepresentationSidebar() {
    this.nodeRepresentation.visible = true;
    this.cd.detectChanges();
  }

  openNodeShowDashboardSidebar(data) {
    this.solarNodeData = data;
    this.nodeShowDashboard.visible = true;
    this.nodeShowDashboard.load(this.endtoendGraphicalService.getDuration());
    this.cd.detectChanges();
  }

  openNodeSearchSidebar() {
    this.searchSidebar.open();
    this.cd.detectChanges();
  }

  openNewGroupDialog(nodeName) {
    this.EndToEndNewGroupComponent.nodeName = nodeName;
    this.EndToEndNewGroupComponent.load();
    this.nodeInfo.hide();
    this.cd.detectChanges();
  }

  openTierInformation(node : string) {
    const me = this;
    const duration = me.endtoendGraphicalService.getDuration();
    this.router.navigate(['/end-to-end-tier'], { queryParams: {node : node, st : duration.st, et : duration.et, preset : duration.preset}});
  }
}
