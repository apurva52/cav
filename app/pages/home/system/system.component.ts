import { Component, OnInit,OnDestroy, ViewEncapsulation, ViewChild, AfterViewInit } from '@angular/core';
import { TimebarService } from 'src/app/shared/time-bar/service/time-bar.service';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { SystemTable } from './service/system.model';
import { END_TO_END_VIEW, SYSTEM_TABLE } from './service/system.dummy';
import {
  TimebarValue,
  TimebarValueInput,
} from 'src/app/shared/time-bar/service/time-bar.model';
import { SchedulerService } from 'src/app/shared/scheduler/scheduler.service';
import { DBMonitoringService } from '../../db-monitoring/services/db-monitoring.services';
import { Subscriptions } from 'src/app/shared/common-models/common-models';
import { MessageService, OverlayPanel } from 'primeng';
import * as Highcharts from 'highcharts';

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
import { SolarPrefNodeComponent } from '../../end-to-end/end-to-end-graphical/solar-pref-node/solar-pref-node.component';
import { OutputNodeComponent } from '../../end-to-end/end-to-end-graphical/output-node/output-node.component';
import { EndToEndGraphicalView } from '../../end-to-end/service/end-to-end.model';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SystemComponent implements OnInit,OnDestroy,AfterViewInit {
  // we dont really need this, we just put it here to show you how you can do it.
  @ViewChild(jsPlumbSurfaceComponent) surfaceComponent: jsPlumbSurfaceComponent;
  data: SystemTable;
  constructor(
    public timebarService: TimebarService,
    private schedulerService: SchedulerService,
    private dbMonService: DBMonitoringService,
    private messageService: MessageService,
    private $jsplumb: jsPlumbService,
  ) {}

  kpiURL = '/kpi';
  endToEndURL = '/end-to-end';
  geoLocationURL = '/geo-location';
  dbServerSubscriber : Subscription;
  Highcharts: typeof Highcharts = Highcharts;
  chartConstructor = "mapChart";
  chartData = [{ code3: "ABW", z: 105 }, { code3: "AFG", z: 35530 }];
  surfaceId = 'flowchartSurface';
  toolkitId = 'flowchart';
  surface: Surface;
   toolkit: jsPlumbToolkit;
 // Empty in this demonstration.
  toolkitParams: jsPlumbToolkitOptions = {};
  // view: AngularViewOptions;
  // renderParams: SurfaceRenderParams;
  renderParams: SurfaceRenderParams = {
    layout: {
      type: 'Hierarchical',
      parameters:{
        padding:[ 300, 550 ],
        orientation:"vertical",
        // spacing: "compress",
        zoomToFit: true,
      consumeRightClick: false,
      enablePanButtons: false,
      }
    },
    zoomToFit: true,
    consumeRightClick: false,
    enablePanButtons: false,
  }; 
  endtoenddata: EndToEndGraphicalView;

  ngOnInit(): void {
    const me = this;
    me.endtoenddata = END_TO_END_VIEW;
    me.schedulerService.unsubscribe('global-timebar');
    me.timebarService.instance.getInstance().subscribe(() => {
      const value = me.timebarService.getValue();
      const timePeriod = _.get(value, 'timePeriod.selected.id', null);
      const viewBy = _.get(value, 'viewBy.selected.id', null);
      const st = _.get(value, 'time.frameStart.value', null);
      const et = _.get(value, 'time.frameEnd.value', null);

      if (timePeriod) {
        me.kpiURL += '/graphical';
        me.endToEndURL += '/graphical-tier/' + timePeriod + '/' + viewBy;
        me.geoLocationURL += '/details/' + timePeriod + '/' + st + '/' + et;
      }
      this.surface.setZoom(0.8);
      const timebarValueInput: TimebarValueInput = {
        timePeriod: value.timePeriod.selected.id,
        viewBy: value.viewBy.selected.id,
        running: value.running,
        discontinued: value.discontinued,
      };

      me.timebarService
        .prepareValue(timebarValueInput, me.timebarService.getValue())
        .subscribe((value: TimebarValue) => {
          setTimeout(() => {
            me.timebarService.setValue(value);
          });
        });
    });
    me.data = SYSTEM_TABLE;
    if (me.dbMonService.$dbMonitorUIJson == undefined || me.dbMonService.$dbMonitorUIJson.length < 1) {
      me.dbMonService.loadUI();
    }
    me.dbServerSubscriber = me.dbMonService.dbListAvailableObservable$.subscribe(
      result => {
        if (result != undefined) {
          if(me.dbMonService.getSqlDbServerList()  == undefined || me.dbMonService.getSqlDbServerList()['ErrorCode'] !=undefined || me.dbMonService.getSqlDbServerList().dbSourceList.length <1){
            me.data.charts[4].pagelink = '/home/system';
            let msg = {
              severity: 'error',
              summary: 'DB Monitoring not configured.'
            };
            me.messageService.add(msg);
          }else{
            me.data.charts[4].pagelink = '/db-monitoring';
          }
        }
      });
      if(me.dbMonService.getSqlDbServerList() == undefined || me.dbMonService.getSqlDbServerList().dbSourceList.length <1){
        me.dbMonService.getDbServerList();
      }
        // Create the Toolkit instance via the jsPlumb service.
    this.toolkit = this.$jsplumb.getToolkit(this.toolkitId, this.toolkitParams);
    
    // me.renderParams = {
    //   layout: {
    //     type: 'Hierarchical',
    //     parameters:{
    //       padding:[ 50, 50 ]
    //     }
    //   },
    //   zoomToFit: true,
    //   consumeRightClick: false,
    //   enablePanButtons: false,
    // };
    if(me.endtoenddata){
      me.toolkit.clear();
    me.toolkit.load({
      data: {
        nodes: me.endtoenddata.node,
        edges: me.endtoenddata.edge,
        },
    });
  }
  }

  ngAfterViewInit():void{
    this.$jsplumb.getSurface(this.surfaceId, (s: Surface) => {
      this.surface = s;
    });
  }
    // zoomToFit() {
  //   this.surface.getToolkit().clearSelection();
  //   this.surface.zoomToFit();
  // }

 

  view: AngularViewOptions = {
    nodes: {
      solarParent: {
    
      },
      outputParent: {
      
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
          ['Arrow', { location: 1, width: 6, length: 6, direction: 1 }],
        ],

        endpoint: 'Blank',
      },
    },
  };
  ngOnDestroy(): void {
    const me = this;
    if(me.dbServerSubscriber)
     me.dbServerSubscriber.unsubscribe();
  }

}
