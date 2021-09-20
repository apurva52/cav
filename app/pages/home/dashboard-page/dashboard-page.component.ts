import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import {
  Router,
  RouterEvent,
  NavigationStart,
  NavigationEnd,
} from '@angular/router';
import { ResizedEvent } from 'angular-resize-event';
import { MenuItem } from 'primeng';
import { Subscription } from 'rxjs';
import { SessionService } from 'src/app/core/session/session.service';
import { DashboardComponent } from 'src/app/shared/dashboard/dashboard.component';
import { MenuService } from 'src/app/shared/dashboard/menu.service';
import { DashboardService } from 'src/app/shared/dashboard/service/dashboard.service';
import { DashboardWidgetComponent } from 'src/app/shared/dashboard/widget/dashboard-widget.component';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DashboardPageComponent implements AfterViewInit {
  visible: boolean;
  showTemplate: boolean = false;
  favMenuOptions: MenuItem[];
  isShow: boolean = true;
  isWidgetSetting: boolean;
  isGraph: boolean;
  menuType: string;

  subscription: Subscription;
  disableOptions : boolean = false;
  @ViewChild('dashboard', { read: DashboardComponent })
  dashboardC: DashboardComponent;

  widget: DashboardWidgetComponent;
  noPermission : boolean = false;
  //Add New Widget Menu Options
  newWidgetMenuOptions: MenuItem[];
@ViewChild('menu') menufav:any;
  saveDashboardTooltip: string;
  constructor(
    private sessionService: SessionService,
    private menuService: MenuService,
    private dashboarService : DashboardService
  ) {
    const me = this;
    me.disableOptions = !this.dashboarService.getUserPermissions();
    me.dashboarService.getPermissionInfoToUpdateDashboard().subscribe(updateDashboardInfo => this.noPermission = updateDashboardInfo);
    me.dashboarService.isReloadFavorite().subscribe(isBack =>{
      if(me.favMenuOptions && me.favMenuOptions.length >0){
        me.favMenuOptions[3].disabled = isBack;
      }
    })
    if(this.noPermission){
      this.saveDashboardTooltip="Save Dashboard changes";
    }else{
      this.saveDashboardTooltip="User can not update System Dashboard";
    }
    me.subscription = me.menuService.getOpenCommand().subscribe((data) => {
      if (data) {
        me.isShow = data.text;
        me.menuType = data.type;
        me.widget = data.widget;
      }
    });

    // me.subscription = me.menuService.getOpenCommand().subscribe(isOpen => {
    //   if (isOpen) {
    //     me.isShow = isOpen.text1;
    //   }
    // });

    me.subscription = me.menuService.getCloseCommand().subscribe((data) => {
      if (data) {
        me.isShow = data.text;
      }
    });
  }

  ngOnDestroy() {
    const me = this;
    me.subscription.unsubscribe();
  }

  ngAfterViewInit() {
    const me = this;
    // to avoid parallel view updates
    setTimeout(() => {

      if(me.sessionService.dashboardCache && !me.dashboarService.isCallFromAlert) {

        me.dashboardC.drawPrevfavorite(me.sessionService.dashboardCache);
        me.dashboardC.name = me.sessionService.session.defaults.dashboardName;
        me.dashboardC.path =  me.sessionService.session.defaults.dashboardPath;
      }else {
        me.dashboardC.load(
          'DASHBOARD',
          me.sessionService.session.defaults.dashboardName,
          me.sessionService.session.defaults.dashboardPath
        );
      }

    });

    me.favMenuOptions = [
      {
        label: 'Filter by Favorite',
        command: (event: any) => {
          me.dashboardC.openFilterByParam();
        },
      },
      {
        label: 'Filter by Parameters',
        command: (event: any) => {
          me.dashboardC.openParameterize();
        },
      },
      {
        label: 'Copy Favorite Link',
        command: (event: any) => {
          me.dashboardC.openCopyLink();
        },
      },
      {
        label: 'Back',
        disabled : true,
        command: (event: any) => {
          me.dashboardC.reload();
        },
      },
    ];

    me.newWidgetMenuOptions = [
      {
        label: 'Data Widget',
        command: (event: any) => {
          me.dashboardC.addNewWidget('DATA');
        },
      },
      {
        label: 'Graph Widget',
        command: (event: any) => {
          me.dashboardC.addNewWidget('GRAPH');
        },
      },
      {
        label: 'Tabular Widget',
        command: (event: any) => {
          me.dashboardC.addNewWidget('TABULAR');
        },
      },
      {
        label: 'System Health Widget',
        command: (event: any) => {
          me.dashboardC.addNewWidget('SYSTEM_HEALTH');
        },
      },
      {
        label: 'Label Widget',
        command: (event: any) => {
          me.dashboardC.addNewWidget('LABEL');
        },
      },
      {
        label: 'Image Widget',
        command: (event: any) => {
          me.dashboardC.addNewWidget('IMAGE');
        },
      },
      {
        label: 'File Widget',
        command: (event: any) => {
          me.dashboardC.addNewWidget('FILE');
        },
      },
      {
        label: 'Group Widget',
        command: (event: any) => {
          me.dashboardC.addNewWidget('GROUP');
        },
      },
    ];
  }

  openTemplate() {
    this.showTemplate = true;
  }

  openCustomTemplateLayoutDialog() {
    console.log('it works');
  }

  openCompareData() {
    console.log('it works');
  }

  //rearrange layout
   onResized(event: ResizedEvent) {
     window.dispatchEvent(new Event('resize'));
   }
   canDeactivate(){
     if(this.dashboardC && this.dashboardC.layout && this.dashboardC.layout.mode == "EDIT"){
    var result =  window.confirm('You have unsaved changes in canvas mode. Are you sure want to leave this page ?');
    if (result == true) {
      //this.dashboarService.setDashboardSelected(false);
      this.dashboardC.dashboardChangesNotApplied();
     return true;
  } else {
    setTimeout(() => {
      this.dashboarService.setDashboardSelected(true);
    }, 0);

        return;
  }
 }
 return true;
   }
}
