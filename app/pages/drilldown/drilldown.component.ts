import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { EllipsisPipe } from 'src/app/shared/pipes/ellipsis/ellipsis.pipe';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { filter } from 'rxjs/operators';
import { DrilldownService } from './service/drilldown.service';
import { Store } from 'src/app/core/store/store';
import { DrilldownLoadingState, DrilldownLoadingErrorState, DrilldownLoadedState } from './service/drilldown..state';
import { DatePipe } from '@angular/common'
import { SessionService } from 'src/app/core/session/session.service';
import { BreadcrumbService } from 'src/app/core/breadcrumb/breadcrumb.service';



@Component({
  selector: 'app-drilldown',
  templateUrl: './drilldown.component.html',
  styleUrls: ['./drilldown.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [EllipsisPipe]
})
export class DrilldownComponent implements OnInit {
  static readonly ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  readonly home = { icon: 'pi pi-home', url: '#/home/dashboard' };
  menuItems: MenuItem[];

  tabs: MenuItem[];
  // breadcrumb: MenuItem[];
  data:any=[];
  error:any;
  loading:boolean=false;
  empty:any;
  someVal:string;
  showtabs:boolean=false;
  isBtType: any;
  //selectedFilter = "Tier=RHEL,BT=/DashboardService/RestService,StartTime=06/26/20 16:40:00, EndTime=06/26/20 20:38:56, BT Type=All";

  constructor(private router: Router, private route: ActivatedRoute, public drilldownService: DrilldownService, public datepipe: DatePipe,
    private sessionService: SessionService, public breadcrumb: BreadcrumbService) { }

  ngOnInit(): void {
    const me = this;
    // if( me.sessionService.getSetting("reportID") == "FP" || me.sessionService.getSetting("reportID") == "BTT")
    // {
    //   this.showtabs =true;
    //   me.breadcrumb = [
    //     { label: 'Home', routerLink: '/home/dashboard' },
    //     { label: 'DrillDown Flowpaths' }
    //   ];
    // }else{
    //   this.showtabs =false;
    //   me.breadcrumb = [
    //     { label: 'Home', routerLink: '/home/dashboard' }
    //   ];
    // }
    // me.breadcrumb.add({label: 'DrillDown Flowpaths', routerLink: '/drilldown/flow-path' } as MenuItem);
    // if (!(me.sessionService.getSetting("reportID") == "DBR" || me.sessionService.getSetting("reportID") == "DBG_BT" || me.sessionService.getSetting("reportID") == "FPG_BT")) {
    //     this.breadcrumb.removeAll();
    //     this.breadcrumb.addNewBreadcrumb({label: 'Home', routerLink: '/home'} as MenuItem);
    // }
    this.load();
    this.tabs = [
      { label: 'FLOWPATH', routerLink: 'flow-path' },
      { label: 'TRANSACTIONS TREND', routerLink: 'transactions-trend' },
      // { label: 'TRANSACTIONS GROUP', routerLink: 'transactions-group' },
    ];


    // this.router.events
    //   .pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe(() => me.breadcrumb = this.createBreadcrumbs(this.route.root));

  }

  getTabOptionsFor(tab: MenuItem): MenuItem[] {

    const me = this;

    return [
      {
        label: 'Set as Default',
        command: () => {
          me.tabSetDefault(tab);
        },
        disabled: true
      },
      {
        label: 'Change Order', command: () => {
          me.tabSetDefault(tab);
        },
        disabled: true
      },
    ];
  }

  tabSetDefault(tab: MenuItem) {
    console.log('Set to defualt', tab); // TODO: Call Service
  }

  tabChangeOrder(tab: MenuItem) {
    console.log('Change the order', tab); // TODO: Call Service
  }

  // private createBreadcrumbs(route: ActivatedRoute, url: string = '#', breadcrumbs: MenuItem[] = []): MenuItem[] {
  //   const me = this;
  //   const children: ActivatedRoute[] = route.children;


  //   if (children.length === 0) {
  //     return breadcrumbs;
  //   }

  //   for (const child of children) {
  //     const routeURL: string = child.snapshot.url.map(segment => segment.path).join('/');
  //     if (routeURL !== '') {
  //       url += `/${routeURL}`;
  //     }
  //     me.breadcrumb = [];
  //     me.breadcrumb = [
  //       { label: 'Home', routerLink: '/home/dashboard' },
  //     ];

  //     const label = child.snapshot.data[DrilldownComponent.ROUTE_DATA_BREADCRUMB];
  //     if (!isNullOrUndefined(label)) {
  //       me.breadcrumb.push({ label, url });

  //       // breadcrumbs.push({ label, url });
  //     }

  //     return this.createBreadcrumbs(child, url, me.breadcrumb);
  //   }
  // }

  load(){
    const me = this;
    me.isBtType= me.sessionService.getSetting('ddrBtCategory');
    try{
    me.drilldownService.load().subscribe(
      (state: Store.State) => {
        if (state instanceof DrilldownLoadingState) {
          me.onLoading(state);
          return;
        }

        if (state instanceof DrilldownLoadedState) {
          me.onLoaded(state);
          return;
        }
      },
      (state: DrilldownLoadingErrorState) => {
        me.onLoadingError(state);
      }
    );
  }catch(e){
    console.error(e);
  }
  }
  private onLoading(state: DrilldownLoadingState) {
    const me = this;
    me.error = null;
    me.loading = true;
  }

  private onLoadingError(state: DrilldownLoadingErrorState) {
    const me = this;
    me.empty = null;
    me.error = state.error;
    me.loading = false;
    console.log(me.error);
  }

  private onLoaded(state: DrilldownLoadedState) {
    const me = this;
    me.data = state.data;
    me.error = null;
    me.loading = false;
    //const moment = require('moment-timezone');
    // var strTime = moment().format('DD/MM/YY hh:mm:ss');
    // var edTime = moment().format('DD/MM/YY hh:mm:ss');
    var date=new Date(me.data[0].startTime);
    var strTime = this.datepipe.transform(date, 'dd/MM/yy HH:MM:SS');
    var date1=new Date(me.data[0].endTime);
    var edTime = this.datepipe.transform(date1, 'dd/MM/yy HH:MM:SS');
    console.log("starttime=" + strTime + "endtime=" + edTime);
    // Done changes for CQM
    this.drilldownService.filterCriteriaObj = {};
    this.drilldownService.filterCriteriaObj = {
      "Tier": me.data[0].tierName, "Server": me.data[0].serverName, "Instance": me.data[0].instanceName,
      "StartTime": strTime, "EndTime": edTime, "BT": me.data[0].btTransaction, "OrderBy": "Total Response Time"
    }

    // Done changes for filter criteria for reports.
    if(me.isBtType==='Normal')
    {
      this.drilldownService.selectedFilter = "Tier=" + me.data[0].tierName + ", Server=" + me.data[0].serverName + 
      ", Instance=" + me.data[0].instanceName +  ", StartTime=" + strTime + ", EndTime=" + edTime + ", BT Type=Normal" + ", BT=" + me.data[0].btTransaction + ", OrderBy=Total Response Time";
    }
    else if(me.isBtType==='Slow')
    {
      this.drilldownService.selectedFilter = "Tier=" + me.data[0].tierName + ", Server=" + me.data[0].serverName + 
    ", Instance=" + me.data[0].instanceName +  ", StartTime=" + strTime + ", EndTime=" + edTime + ", BT Type=Slow" + ", BT=" + me.data[0].btTransaction + ", OrderBy=Total Response Time";
    }
    else if(me.isBtType==='VerySlow')
    {
      this.drilldownService.selectedFilter = "Tier=" + me.data[0].tierName + ", Server=" + me.data[0].serverName + 
    ", Instance=" + me.data[0].instanceName +  ", StartTime=" + strTime + ", EndTime=" + edTime + ", BT Type=VerySlow" +", BT=" + me.data[0].btTransaction + ", OrderBy=Total Response Time";
    }
    else if(me.isBtType==='Error')
    {
      this.drilldownService.selectedFilter = "Tier=" + me.data[0].tierName + ", Server=" + me.data[0].serverName + 
    ", Instance=" + me.data[0].instanceName +  ", StartTime=" + strTime + ", EndTime=" + edTime + ", BT Type=Error" + ", BT=" + me.data[0].btTransaction + ", OrderBy=Total Response Time";
    }
    else
    {
    this.drilldownService.selectedFilter = "Tier=" + me.data[0].tierName + ", Server=" + me.data[0].serverName + 
    ", Instance=" + me.data[0].instanceName +  ", StartTime=" + strTime + ", EndTime=" + edTime + ", BT=" + me.data[0].btTransaction + ", OrderBy=Total Response Time";
    }
    /*setting value of filter criteria in drilldown service */
    me.drilldownService.filterCriteriaVal = this.drilldownService.selectedFilter;
    
  }
  
}
