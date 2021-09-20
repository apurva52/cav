import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { TableModule } from 'primeng/table';

/*components*/
import { AccessControlListComponent } from './access-control-list.component';
import { AccessControlManagementComponent } from './components/access-control-management/access-control-management.component';
import { AccesControlUserManagementComponent } from './components/acces-control-user-management/acces-control-user-management.component';
import { AccesControlGroupManagementComponent } from './components/acces-control-group-management/acces-control-group-management.component';
import { AccessControlCapabilitiesComponent } from './components/access-control-capabilities/access-control-capabilities.component';
import { AccessControlGroupAddUserComponent } from './components/access-control-group-add-user/access-control-group-add-user.component';
import { AccessControlGroupAddNodeInfoComponent } from './components/access-control-group-add-node-info/access-control-group-add-node-info.component';
import { AccessControllGroupAddCapabilitesComponent } from './components/access-controll-group-add-capabilites/access-controll-group-add-capabilites.component';
import { AccessControlUserPasswordComponent } from './components/access-control-user-password/access-control-user-password.component';

/*services*/
import { AccessControlRestDataApiService } from './services/access-control-rest-data-api.service';
import { AccessControlConfigDataServiceService } from './services/access-control-config-data-service.service';
import { AccesControlDataService } from './services/acces-control-data.service';
import { AccessControlRoutingGuardService } from './services/access-control-routing-guard.service';
import { AccessControlFeaturePermService } from './services/access-control-feature-perm.service'

/*Routes*/
import { APP_ROUTES_ACCESSCONTROL } from './access-control-routes';
//import { AccessControlConfirmAlertComponent } from './components/access-control-confirm-alert/access-control-confirm-alert.component';
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { CardModule } from 'primeng/card';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TreeTableModule } from 'primeng/treetable';
import { TreeModule } from 'primeng/tree';
import { DropdownModule } from 'primeng/dropdown';
import { CheckboxModule } from 'primeng/checkbox';
import { DragDropModule } from 'primeng/dragdrop';
import { AccordionModule } from 'primeng/accordion';
import { TooltipModule } from 'primeng/tooltip';
import { MultiSelectModule } from 'primeng/multiselect';
import { TabViewModule } from 'primeng/tabview';
import { TabMenuModule } from 'primeng/tabmenu';
import { FieldsetModule } from 'primeng/fieldset';
import { InplaceModule } from 'primeng/inplace';
import { CalendarModule } from 'primeng/calendar';
import { ToolbarModule } from 'primeng/toolbar';
import { DialogModule } from 'primeng/dialog';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SlideMenuModule } from 'primeng/slidemenu';
import { SplitButtonModule } from 'primeng/splitbutton';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { PanelModule } from 'primeng/panel';
import { MenubarModule } from 'primeng/menubar';
import { MenuModule } from 'primeng/menu';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogService } from 'primeng/dynamicdialog';
import { BreadcrumbModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { ToastModule } from 'primeng/toast';
import { MatSelectModule  } from '@angular/material/select';
import { ConfirmDialogModule } from 'primeng';
@NgModule({
  declarations: [
    AccessControlListComponent,
    AccessControlManagementComponent,
    AccesControlUserManagementComponent,
    AccesControlGroupManagementComponent,
    AccessControlCapabilitiesComponent,
    AccessControlGroupAddUserComponent,
    AccessControlGroupAddNodeInfoComponent,
    AccessControllGroupAddCapabilitesComponent,
    AccessControlUserPasswordComponent,
    //AccessControlConfirmAlertComponent,

  ],
  imports: [
    CommonModule, FormsModule, HttpClientModule,
    TieredMenuModule, MenuModule, MenubarModule, PanelModule, ButtonModule,
    PaginatorModule, SplitButtonModule, SlideMenuModule, PanelMenuModule,
    TreeModule, InputTextModule, DropdownModule, ContextMenuModule, DialogModule,
    ToolbarModule, CheckboxModule, DragDropModule, AccordionModule,
    TooltipModule, MultiSelectModule, TabViewModule,
    TabMenuModule, FieldsetModule, TreeTableModule, InplaceModule, CalendarModule, RadioButtonModule, TableModule,
    RouterModule.forChild(APP_ROUTES_ACCESSCONTROL),
    HttpClientModule, CardModule, DynamicDialogModule, BreadcrumbModule, HeaderModule, ToastModule
    ,MatSelectModule, ConfirmDialogModule
  ],
  providers: [
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: HttpRequestInterceptorService,
    //   multi: true
    // },
    AccessControlRestDataApiService,
    AccessControlConfigDataServiceService,
    AccesControlDataService,
    AccessControlRoutingGuardService,
    AccessControlFeaturePermService,
    DialogService],
  entryComponents: [
    AccessControlGroupAddUserComponent,
    AccessControlGroupAddNodeInfoComponent,
    AccessControllGroupAddCapabilitesComponent,
    AccessControlUserPasswordComponent,
    //AccessControlConfirmAlertComponent,
    
  ],
  exports: [
    
  ],
})
export class AccessControlV1Module { }
