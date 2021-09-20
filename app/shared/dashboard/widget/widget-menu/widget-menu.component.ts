import {
  Component,
  OnInit,
  ViewEncapsulation,
  Input,
  ChangeDetectorRef,
  ViewChild,
  OnDestroy,
} from '@angular/core';
import { MenuItem, MenuItemContent, SlideMenu } from 'primeng';
import { WidgetMenuService } from './service/widget-menu.service';
import {
  WidgetDrillDownMenuItem,
  WidgetDrillDownMenu,
  WidgetDrillDownMenuState,
} from './service/widget-menu.model';
import { DashboardWidgetComponent } from '../dashboard-widget.component';
import { PlatformLocation } from '@angular/common';
import {
  WidgetDrillDownMenuLoadedState,
  WidgetDrillDownMenuLoadingErrorState,
  WidgetDrillDownMenuLoadingState,
} from './service/widget-menu.state';
import { Store } from 'src/app/core/store/store';
import { Router } from '@angular/router';
import { DashboardGraphService } from '../../service/dashboard-graph.service';
import { SessionService } from 'src/app/core/session/session.service';
import { AppError } from 'src/app/core/error/error.model';
import { DashboardService } from '../../service/dashboard.service';
import { IDGenerator } from 'src/app/shared/utility/IDGenerator';
import { connect } from 'http2';
import { MenuItemUtility } from 'src/app/shared/utility/menu-item';
import { DashboardTime } from '../../service/dashboard.model';
import * as _ from 'lodash';
import { WIDGET_SETTINGS } from './../../../actions.constants';
import { DBMonitoringService } from 'src/app/pages/db-monitoring/services/db-monitoring.services';
import { Subscription } from 'rxjs';
import { DdrDataModelService } from './../../../../pages/tools/actions/dumps/service/ddr-data-model.service';
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { tap } from "rxjs/operators";
//import { Logger } from '../../../vendors/angular2-logger/core';
import { MatDialogModule } from '@angular/material/dialog';
import { NVDDRService } from './service/nvddrservice.service';

@Component({
  selector: 'app-widget-menu',
  templateUrl: './widget-menu.component.html',
  styleUrls: ['./widget-menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WidgetMenuComponent implements OnInit {
  items: MenuItem[];
  @Input() widget: DashboardWidgetComponent;

  checkDDRMenu: number = 0;

  @ViewChild(SlideMenu, { read: SlideMenu }) slideMenu: SlideMenu;
  @ViewChild('menu') menu : any;
  dbServerSubscriber : Subscription;

  constructor(
    private widgetMenuService: WidgetMenuService,
    private cd: ChangeDetectorRef,
    private platformLocation: PlatformLocation,
    private router: Router,
    private sessionService: SessionService,
    private dashboardService: DashboardService,
    private ddr_data : DdrDataModelService,
    private dbMonService: DBMonitoringService,
    private http: HttpClient,
    //private log: Logger,
    public dialog: MatDialogModule,
    private _nvddrservice: NVDDRService
  ) {
    platformLocation.onPopState(() => this.slideMenu.hide());
    this.getSubscriptionFromWidgetSettings();
  }

  /* This method is for getting event subscription every time user save widget settings */
  getSubscriptionFromWidgetSettings() {
    const me = this;
    try {
      const data = this.widgetMenuService._widgetSettingsProviders$.subscribe(
        result => {
          if(result.action == WIDGET_SETTINGS && result.data['widgetIndex'] == me.widget.widget.widgetIndex)
          me.ngOnInit();
        },
        error => {
          console.log('error in getting data ', error);
          data.unsubscribe();
        },
        () => {
          data.unsubscribe();
        }
      );
    } catch (error) {
      console.error('error in getting subscription');
    }
  }

  ngOnInit(): void {
    const me = this;
    // me.widget.dashboard.events.analysisModeToggle.subscribe(
    //   (flag: boolean) => {
    //     // console.log("toggle flag======"+flag);
    //     me.items[4].label = flag ? "Minimize" : "Maximize";
    //   me.checkDDRMenu = 0;
    //   });
    if(me.widget.widget.type == "LABEL"){
      me.items = [
        {
          label: 'Widget Settings',
          command: (event: any) => {
            me.widget.dashboard.openEditWidget(me.widget);
            me.menu.hide();
          },
          disabled: false,
          state: {
            isDrillDown: false,
          },
        },
        // {
        //   label: 'Edit Mode',
        //   items: [
        //     {
        //       label: 'On',
        //       command: () => {
        //         console.log("edit mode on")
        //       },
        //       disabled: true
        //     },
        //     {
        //       label: 'Off',
        //       command: () => {
        //         console.log("edit mode off")
        //       },
        //       disabled: true
        //     },
        //   ],
        //   disabled: false,
        //   state: {
        //     isDrillDown: false,
        //   },
        // },
      ];
    }
    else{
    me.items = [
      {
        label: 'Widget Settings',
        command: (event: any) => {
          me.widget.dashboard.openEditWidget(me.widget);
          me.menu.hide();
        },
        disabled: false,
        state: {
          isDrillDown: false,
        },
      },
      {
        label: 'Time Period & View By',
        command: (event: any) => {
          me.widget.dashboard.openTimePeriodDialog(me.widget);
        },
        disabled: false,
        state: {
          isDrillDown: false,
        },
      },
      {
        label: 'Show Metric Data',
        command: (event: any) => {
          me.widget.dashboard.openGraphData(me.widget);
        },
        disabled: false,
        state: {
          isDrillDown: false,
        },
      },
      {
        label: 'Page Dashboard',
        command: (event: any) => {
          //TBD
        },
        disabled: true,
        visible: me.enableDisablePageDashboard(me.widget),
        title: 'Not supported yet.',
        state: {
          isDrillDown: false,
        },
      },
      // {
      //   label: 'Add To Favourites',
      //   disabled: false,
      //   command: (event: any) => {
      //     //Event to add to favourites
      //   },
      //   state: {
      //     isDrillDown: false,
      //   },
      // },
      // {
      //   label: 'DrillDown Reports',
      //   disabled: false,
      //   command: (event: any) => {
      //     //Event to redirect to drilldown report
      //   },
      //   state: {
      //     isDrillDown: false,
      //   },
      // },
      // {
      //   label: 'Add to custom metrics',
      //   command: (event: any) => {
      //     me.widget.dashboard.openAddCustomMetrices(me.widget);
      //   },
      //   disabled: false,
      //   state: {
      //     isDrillDown: false,
      //   },
      // },
      // {
      //   label: 'Alert Overlay',
      //   disabled: false,
      //   command: (event: any) => {
      //     //Event to redirect to drilldown report
      //   },
      //   state: {
      //     isDrillDown: false,
      //   },
      // },
      // {
      //   label: 'Maximize',
      //   command: (event: any) => {
      //     me.widget.focus(me.widget.isFocused);
      //   },
      //   state: {
      //     isDrillDown: false,
      //   },
      // },
      // {
      //   label: 'Open Dashboard',
      //   command: (event: any) => {
      //     me.widget.goToLink();
      //   },
      //   disabled: !me.widget.hasLink(),
      //   state: {
      //     isDrillDown: false,
      //   },
      // },
      {
        label: 'Pattern Matching',
        command: (event: any) => {
          me.widget.dashboard.openPatternMatching(me.widget);
          me.menu.hide();
        },
        disabled: false,
        state: {
          isDrillDown: false,
        },
      },
      // {
      //   label: 'Show Graph In Tree',
      //   command: (event: any) => {
      //     me.widget.dashboard.openShowGraphInTree();
      //     me.menu.hide();
      //   },
      //   disabled: false,
      //   state: {
      //     isDrillDown: false,
      //   },
      // },
      // {
      //   label: 'Reports',
      //   command: (event: any) => {
      //     me.widget.dashboard.openReportsDialog(me.widget);
      //   },
      //   disabled: false,
      //   state: {
      //     isDrillDown: false,
      //   },
      // },
      {
        label: 'Compare',
        command: (event: any) => {
          me.widget.dashboard.openCompareWindow(me.widget);
          me.menu.hide();
        },
        disabled: false,
        state: {
          isDrillDown: false,
        },
      },

      {
        label: 'Run Commands',
        command: (event: any) => {
          me.widget.dashboard.openRunCommand(me.widget);
          me.menu.hide();
        },
        disabled: false,
        state: {
          isDrillDown: false,
        },
      },
      // {
      //   label: 'Dump',
      //   disabled: false,
      //   command: (event: any) => {
      //   },
      //   state: {
      //     isDrillDown: false,
      //   },
      // },
      // {
      //   label: 'Download As',
      //   items: [
      //     {
      //       label: 'PNG',
      //     },
      //     {
      //       label: 'JPEG',
      //     },
      //     {
      //       label: 'SVG',
      //     },
      //     {
      //       label: 'PDF',
      //     },
      //   ],
      //   disabled: false,
      //   state: {
      //     isDrillDown: false,
      //   },
      // },
      // {
      //   label: 'Advanced Open/Merge',
      //   command: () => {
      //     me.widget.dashboard.openAdvanceOpenMerge(me.widget);
      //   },
      //   disabled: false,
      //   state: {
      //     isDrillDown: false,
      //   },
      // },
      // {
      //   label: 'Monochromatic Color',
      //   items: [
      //     {
      //       label: 'Off',
      //     },
      //     {
      //       label: 'On',
      //     },
      //   ],
      //   disabled: false,
      //   state: {
      //     isDrillDown: false,
      //   },
      // },
      // {
      //   label: 'Set Widget Index',
      //   items: [
      //     {
      //       label: '1',
      //       command: () => {
      //         me.widget.gridContainer.sendToBack(1)
      //       }
      //     },
      //     {
      //       label: '2',
      //       command: () => {
      //         me.widget.gridContainer.bringToFront(1)
      //       }
      //     },
      //   ],
      //   disabled: false,
      //   state: {
      //     isDrillDown: false,
      //   },
      // },
    ];
  }
  }

  initiateDDRCall() {
    const me = this;
    this.getDdrSourceType();
   // me.ddrSourceType = "1";
    let groupID;
    let selectedGraph;
    let selectedWidget;
    me.widget.forEachGraph((args) => {
      me.widget.getSelectedGraph(args.graph, args.graphSettings.selected);
      selectedWidget = me.widget.widget;
      if (args.graphSettings.selected === true) {
        selectedGraph = args.graph;
        groupID = args.graph.measure.mgId;
      } else if (args.graphIndex === 0) {
        selectedGraph = args.graph;
        groupID = args.graph.measure.mgId;
      }
    });

    for (const conditionArray of me.sessionService.session.ddrMenuCondition) {
      if (conditionArray.groupId === groupID) {
        for (const ddrItem of me.items) {
          if (ddrItem.state.isDrillDown) {
          } else {
            if(me.items[me.items.length-1].label =="Drill Down Report") {
                me.items.splice(me.items.length-1,1);
                me.checkDDRMenu = 0;
            }
            if (me.checkDDRMenu == 0) {
              me.items.push({
                label: 'Drill Down Report',
                items: [],
                state: {
                  isDrillDown: true,
                },
              });
              me.checkDDRMenu = 1;

            }
            break;
          }
        }
        console.log(me.items);
        me.drillDownMenuLoad(selectedGraph, selectedWidget);
        console.log(me.items);
        //me.cd.detectChanges();
      }
    }
  }

  drillDownMenuLoad(graph, widget) {
    const me = this;
    const drillMenuItem: MenuItem = {};

    const payload = {
      cctx: me.sessionService.session.cctx,
      tr: me.sessionService.testRun.id,
      panelNum: widget.widgetIndex,
      selectedGraph: graph.measure.metric + ' - ' + graph.subject.tags[0].sName,
      ggv: graph.measure.mgId + ' - ' + graph.measure.metricId + ' - ' + graph.subject.tags[0].sName,
      compare: false,
      trCompare: 'undefined',
      measurementList: 'undefined',
      geoMap: false,
      favNameCtx: me.widget.dashboard.data.favNameCtx,
      hmMenuheirarchy: graph.subject.tags[0].sMeta
    };
    me.widgetMenuService.loadDrillDownMenu(payload).subscribe(
      (state: Store.State) => {
        if (state instanceof WidgetDrillDownMenuLoadingState) {
          drillMenuItem.items = [
            {
              label: 'Loading...',
              disabled: false,
            },
          ];
          return;
        }
        if (state instanceof WidgetDrillDownMenuLoadedState) {
          drillMenuItem.items = [...me.prepareDrillMenu(state.data)];
          this.cd.detectChanges();
          return;
        }
      },
      (state: WidgetDrillDownMenuLoadingErrorState) => {
        // event.item.items = [
        //   {
        //     label: 'Error while loading',
        //     disabled: true
        //   }
        // ];
      }
    );
  }

  private prepareDrillMenu(
    widgetDrillDownMenu: WidgetDrillDownMenu
  ): MenuItem[] {
    const me = this;
    return me.prepareDrillMenuItems(widgetDrillDownMenu.items);
  }

  private prepareDrillMenuItems(
    widgetDrillDownMenuItems: WidgetDrillDownMenuItem[]
  ): MenuItem[] {
    const me = this;
    const items: MenuItem[] = [];

    for (const menuItem of me.items) {
      if (menuItem.state.isDrillDown) {
        if(menuItem.items.length > 0) {
          menuItem.items = [];
        }
        if (menuItem.items.length == 0) {
          widgetDrillDownMenuItems.forEach(
            (widgetDrillDownMenuItem: WidgetDrillDownMenuItem) => {

              menuItem.items.push({
                label: widgetDrillDownMenuItem.label,
                state: widgetDrillDownMenuItem.state,
                items: widgetDrillDownMenuItem.items,
                command: me.drillMenuItemCommandFn()
              });
            });
          MenuItemUtility.map((item: MenuItem) => {
            if (!item.items) {
              item.command = me.drillMenuItemCommandFn();
            }
          }, widgetDrillDownMenuItems);
        }
      }
    }
    return items;
  }

  getTime() {
    const me = this;
    const selectedTime = [];

    const dashboardTime: DashboardTime = me.widget.dashboard.getTime(); // TODO: widget time instead of dashboard

    selectedTime.push({
      startTime: _.get(dashboardTime, 'time.frameStart.value', null),
      endTime: _.get(dashboardTime, 'time.frameEnd.value', null),
      graphTimeKey: _.get(dashboardTime, 'graphTimeKey', null),
      viewBy: _.get(dashboardTime, 'viewBy', null),
    });

    return selectedTime;
  }

  private drillMenuItemCommandFn(): (event: {
    item: MenuItem;
    originalEvent: Event;
  }) => void {
    const me = this;

    return (event: { item: MenuItem; originalEvent: Event }) => {
      // TODO: handle drill down method
      console.log('menu clicked');

      const ddrInfo = {
        state: event.item.state,
        time: me.getTime(),
        isDirect: true
      }

      const stateID = 'ddrMenu' + '-' + IDGenerator.newId();
      console.log("stateIDDD", stateID);
      me.sessionService.setSetting(stateID, ddrInfo);

      //set in session  for ddr handeling
      me.sessionService.setSetting("reportID", event.item.state.id);
      me.sessionService.setSetting("ddrSource", "widget");
      me.sessionService.setSetting("ddrMenu", ddrInfo);

      /*setting this for bt trend */
      me.sessionService.setSetting("strGraphTime", ddrInfo?.time[0]?.graphTimeKey);
      me.sessionService.setSetting("viewBy", ddrInfo?.time[0]?.viewBy);

      //const sourceType = Number(prompt("which UI you want to Navigate?"));
      console.log("sourceType", this.ddrSourceType);
      if (this.ddrSourceType === "1") {
        this.ddr_data.getBtData(stateID);
        switch (event.item.state.id) {
          case 'FP': { // FlowPath Report
            me.sessionService.setSetting('ddrBtCategory', 'undefined')
            me.router.navigate(['/ddr/flowpath'], { queryParams: { state: stateID } });
            //me.slideMenu.hide();
            break;
          }
          case 'FPG_BT': { // FlowPath Group By Business Transaction
            me.router.navigate(['/ddr/Flowpathgroupby'], { queryParams: { state: stateID } });
            break;
          }
          case 'FPA': { // Flowpath Analyzer Report
            if (ddrInfo.state.subject.tags[3].value) {
              if (ddrInfo.state.subject.tags[3].value == "AllTransactions") {
                alert('Flowpath analysis is not meaningful when it is done for multiple Transactions i.e. "All Transactions". Please select one transaction for the analysis.');
                break;
              }
            }
            me.sessionService.setSetting('ddrBtCategory', 'undefined');
            me.router.navigate(['/ddr/flowpathAnalyzer'], { queryParams: { state: stateID } });
            break;
          }
          case 'BTT': { // BT Trend Report
		    this.setBtTrendParam();
            me.router.navigate(['/ddr/DdrBtTrendComponent'], { queryParams: { state: stateID } });
            break;
          }
          case 'DBR': { // DB Request Report
            me.router.navigate(['/ddr/dbReport'], { queryParams: { state: stateID } });
            break;
          }
          case 'DBG_BT': { // DB Request Group By Business Transaction
            me.router.navigate(['/ddr/dbGroupBy'], { queryParams: { state: stateID } });
            break;
          }
          // case 'HTTP': { // HTTP Report
          //   me.router.navigate(['/dashboard-service-req/http-report'], { queryParams: { state: stateID } });
          //   break;
          // }
          case 'MT': {   // Method Timing
            me.router.navigate(['/ddr/methodtiming'], { queryParams: { state: stateID } });
            break;
          }
          case 'FPN': {  // Normal Transaction
            me.sessionService.setSetting('ddrBtCategory', 'Normal')
            me.router.navigate(['/ddr/flowpath'], { queryParams: { state: stateID } });
            break;
          }
          case 'FPS': {  // Slow Transaction
            me.sessionService.setSetting('ddrBtCategory', 'Slow')
            me.router.navigate(['/ddr/flowpath'], { queryParams: { state: stateID } });
            break;
          }
          case 'FPV': {  // Very Slow Transaction
            me.sessionService.setSetting('ddrBtCategory', 'VerySlow')
            me.router.navigate(['/ddr/flowpath'], { queryParams: { state: stateID } });
            break;
          }
          case 'FPE': {  // Error Transaction
            me.sessionService.setSetting('ddrBtCategory', 'Error')
            me.router.navigate(['/ddr/flowpath'], { queryParams: { state: stateID } });
            break;
          }
          case 'Flowpath By IP': { //
            me.router.navigate(['/ddr/flowpath'], { queryParams: { state: stateID } });
            break;
          }
          case 'Flowpath By IP Response Time': { // Flowpath By IP Response Time
            me.router.navigate(['/ddr/flowpath'], { queryParams: { state: stateID } });
            break;
          }
          case 'GBCD': {  // Group By Custom Data
            const customOptions = this.getCustomDataOptions();
            console.log('CustomOptions------', customOptions);
            me.router.navigate(['/ddr/CustomDataByBTSplitting'], { queryParams: { state: stateID } });
            break;
          }
          case 'THS': {   // Thread Hotspots
            me.router.navigate(['/ddr/threadhotspot'], { queryParams: { state: stateID } });
            break;
          }
          case 'NFL': {   // NF Logs
            me.router.navigate([]);
            break;
          }
        }

        // ignore non leaf node.
        if (event.item.state && event.item.hasOwnProperty('items') && event.item.items !== undefined && event.item.items.length > 0)
          return;

        if (event.item.state && event.item.state.measure) {
          // Check if NV DDR.
          if (this._nvddrservice.ddrtonv(event, parseInt(event.item.state.measure.mgId), me))
            return;
        }
      }
      else {
        console.log("you are navigating to New UI");
        switch (event.item.state.id) {
          case 'FP': { // FlowPath Report
            me.sessionService.setSetting('ddrBtCategory', 'undefined')
            me.router.navigate(['/drilldown/flow-path'], { queryParams: { state: stateID } });
            me.slideMenu.hide();
            break;
          }
          case 'FPG_BT': { // FlowPath Group By Business Transaction
            me.router.navigate(['/drilldown/flowpath-group-by'], { queryParams: { state: stateID } });
            break;
          }
          case 'FPA': { // Flowpath Analyzer Report
            if (ddrInfo.state.subject.tags[3].value) {
              if (ddrInfo.state.subject.tags[3].value == "AllTransactions") {
                alert('Flowpath analysis is not meaningful when it is done for multiple Transactions i.e. "All Transactions". Please select one transaction for the analysis.');
                break;
              }
            }
            me.sessionService.setSetting('ddrBtCategory', 'undefined');
            me.router.navigate(['flowpath-analyzer'], { queryParams: { state: stateID } });
            break;
          }
          case 'BTT': { // BT Trend Report
            me.router.navigate(['/drilldown/transactions-trend'], { queryParams: { state: stateID } });
            break;
          }
          case 'DBR': { // DB Request Report
            me.router.navigate(['/dashboard-service-req/db-queries'], { queryParams: { state: stateID } });
            break;
          }
          case 'DBG_BT': { // DB Request Group By Business Transaction
            me.router.navigate(['/drilldown/db-group-by'], { queryParams: { state: stateID } });
            break;
          }
          case 'HTTP': { // HTTP Report
            me.router.navigate(['/dashboard-service-req/http-report'], { queryParams: { state: stateID } });
            break;
          }
          case 'MT': {   // Method Timing
            me.router.navigate(['/dashboard-service-req/method-timing'], { queryParams: { state: stateID } });
            break;
          }
          case 'FPN': {  // Normal Transaction
            me.sessionService.setSetting('ddrBtCategory', 'Normal')
            me.router.navigate(['/drilldown/flow-path'], { queryParams: { state: stateID } });
            break;
          }
          case 'FPS': {  // Slow Transaction
            me.sessionService.setSetting('ddrBtCategory', 'Slow')
            me.router.navigate(['/drilldown/flow-path'], { queryParams: { state: stateID } });
            break;
          }
          case 'FPV': {  // Very Slow Transaction
            me.sessionService.setSetting('ddrBtCategory', 'VerySlow')
            me.router.navigate(['/drilldown/flow-path'], { queryParams: { state: stateID } });
            break;
          }
          case 'FPE': {  // Error Transaction
            me.sessionService.setSetting('ddrBtCategory', 'Error')
            me.router.navigate(['/drilldown/flow-path'], { queryParams: { state: stateID } });
            break;
          }
          case 'Flowpath By IP': { //
            me.router.navigate(['/drilldown/flow-path'], { queryParams: { state: stateID } });
            break;
          }
          case 'Flowpath By IP Response Time': { // Flowpath By IP Response Time
            me.router.navigate(['/drilldown/flow-path'], { queryParams: { state: stateID } });
            break;
          }
          case 'GBCD': {  // Group By Custom Data
            me.router.navigate([]);
            break;
          }
          case 'THS': {   // Thread Hotspots
            me.router.navigate(['/ddr/threadhotspot'], { queryParams: { state: stateID } });
            break;
          }
          case 'NFL': {   // NF Logs
            me.router.navigate([]);
            break;
          }
          case 'MSSQLMS': {  // MSSQL Memory Stats
            me.openDbMonitoring('server-stats/configurations');
          }
          case 'MSSQLCS': {  // MSSQL Connection Stats
            me.openDbMonitoring('server-stats/connection-stats');
          }
          case 'MSSQLBS': {  // MSSQL Blocking Stats
            me.openDbMonitoring('sql-activity/blocking-session');
          }
          case 'MSSQLLS': {  // MSSQL Lock Stats
            me.openDbMonitoring('sql-activity/locks');
          }
          case 'MSSQLSU': {  // MSSQL Summary Stats
            me.openDbMonitoring('sql-activity/summary');
          }
          case 'MSSQLWS': {  // MSSQL Wait Stats
            me.openDbMonitoring('wait-statistics');
          }
          case 'MSSQLDBS': {  // MSSQL Database Stats
            me.openDbMonitoring('database');
          }
          case 'MSSQLTDBS': {  // MSSQL TEMPDB Stats
            me.openDbMonitoring('temp-db');
          }
          case 'MSSQLDBQS': {  // MSSQL DB Query Stats
            me.openDbMonitoring('sql-activity/db-query-stats');
          }
          case 'MSSQLBJ': {  // MSSQL Batch Jobs Stats
            me.openDbMonitoring('support-services/batch-jobs');
          }
          case 'MSSQLDL': {  // MSSQL Deadlock Stats
            me.openDbMonitoring('sql-activity/deadlocks');
          }
          case 'MSSQLIOF': {  // MSSQL IO BY FILE Stats
            me.openDbMonitoring('sql-activity/io-file');
          }
          case 'MSSQLSS': {  // MSSQL Support Services Stats
            me.openDbMonitoring('support-services/support-status');
          }
        }

        // ignore non leaf node.
        if (event.item.state && event.item.hasOwnProperty('items') && event.item.items !== undefined && event.item.items.length > 0)
          return;

        if (event.item.state && event.item.state.measure) {
          // Check if NV DDR.
          if (this._nvddrservice.ddrtonv(event, parseInt(event.item.state.measure.mgId), me))
            return;
        }
      }
    };
  }
  private openDbMonitoring(routeTo: string){
    const me = this;
    if (me.dbMonService.$dbMonitorUIJson == undefined || me.dbMonService.$dbMonitorUIJson.length < 1) {
      me.dbMonService.loadUI();
    }
    me.dbMonService.isRequestFromDrillDown = true;
    // me.dbMonService.dataSource = me.
    me.dbServerSubscriber = me.dbMonService.dbListAvailableObservable$.subscribe(
      result => {
        if (result != undefined) {
          if(me.dbMonService.getSqlDbServerList()  == undefined || me.dbMonService.getSqlDbServerList()['ErrorCode'] !=undefined || me.dbMonService.getSqlDbServerList().dbSourceList.length <1){
            alert('DB Monitoring not configured');

          }else{
            me.router.navigate(['/dbmonitoring/' + routeTo]);
          }
        }
      });
      me.dbMonService.getDbServerList();
  }
  
    setBtTrendParam() {
    let params = {};
    if (this.ddr_data.serverName && this.ddr_data.serverName.toLowerCase().includes("overall")) {
      if (this.ddr_data.appName && this.ddr_data.appName.toLowerCase().includes("overall"))
        params['vectorName'] = this.ddr_data.tierName;
    }
    else if (this.ddr_data.serverName && this.ddr_data.appName)
      params['vectorName'] = this.ddr_data.tierName + '>' + this.ddr_data.serverName + '>' + this.ddr_data.appName;

    const getGraphTimeKeyID = this.sessionService.getSetting("strGraphTime");
    const viewby = this.sessionService.getSetting("viewBy");
    if (getGraphTimeKeyID) {
      this.ddr_data.strGraphKey = this.ddr_data.getGraphKeyByTime(getGraphTimeKeyID, viewby);
      console.log("graphhhKeyyy", this.ddr_data.strGraphKey);
      params['strGraphKey'] = this.ddr_data.strGraphKey;
    } else
      params['strGraphKey'] = 'Last_240_Minutes' + '_' + "600";

    params['tierNameList'] = this.ddr_data.tierName;
    params['testRun'] = this.ddr_data.testRun;
    params['strStartTime'] = this.ddr_data.startTime;
    params['strEndTime'] = this.ddr_data.endTime;
    params['eventDay'] = undefined;
    params['product'] = this.ddr_data.product;
    params['serverName'] = this.ddr_data.serverName;
    params['appName'] = this.ddr_data.appName;
    params['btCategory'] = 'All';
    params['strIncDisGraph'] = false;
    if (this.ddr_data.urlName && this.ddr_data.urlName.includes("AllTransactions")) {
      params['btName'] = "";                         //AllTransactions
    }
    else if (this.ddr_data.urlName)
      params['btName'] = this.ddr_data.urlName;   //particular bt

    this.ddr_data.btTrendParamFromStoreView = params;
    console.log("param created in ddrDatamodel", this.ddr_data.btTrendParamFromStoreView);
  }

  ddrSourceType;
  getDdrSourceType() {
    let url = decodeURIComponent(window.location.protocol + '//' + window.location.host + '/' + 'netdiagnostics') + "/v1/cavisson/netdiagnostics/webddr/ddrSourceType";
    this.getDataInStringUsingGet(url).subscribe(res => {
      let data = <any>res;
      this.ddrSourceType = data;
      console.log('ddrSourceTypee amannnn>>>>>>>>>>>>>', this.ddrSourceType);
      sessionStorage.setItem('ddrSourceType', this.ddrSourceType.toString());
      this.sessionService.setSetting('ddrSourceType', this.ddrSourceType.toString());
      if (!this.ddrSourceType) {
        this.ddrSourceType = 0;
        sessionStorage.setItem('ddrSourceType', this.ddrSourceType.toString());
        this.sessionService.setSetting('ddrSourceType', this.ddrSourceType.toString());
      }
    })
  }

  /*Getting Data Through REST API in String format by using GET Method */
  getDataInStringUsingGet(url, param?) {
    console.log(`Making RestCall in widget menu for source type ${url} and
      params = ${param}`);
    return this.http.get(url, { responseType: 'text' }).pipe(
      tap(
        data => data
      )
    );
  }

  /**
   * To get the Custom Data options for DDR
   */
  getCustomDataOptions() {
    let options: any;
    const restDrillDownUrl1 = decodeURIComponent(window.location.protocol + '//' + window.location.host + '/' + 'netstorm') +
      ('/v1/cavisson/netdiagnostics/ddr/config/customDataOptions');
    options = this.getDataInStringUsingGet(restDrillDownUrl1, '').subscribe(
      data => {
        this.assignData(data);
      });
    return options;
  }

  assignData(response: any) {
    // console.log('response---', response);
    return response;
  }

  private menuUpdated() {
    const me = this;
    me.slideMenu.updateViewPort();
    me.slideMenu.viewportUpdated = true;
  }

  enableDisablePageDashboard(widget: DashboardWidgetComponent) {
    try {

      if (widget.widget.settings.widgetDrillDown)
        return true;
      else
        return false;
    }
    catch (e) {
      console.error(e);
      return false;
    }
  }
}
