import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GcManagerComponent } from './gcManager.component';
import { RouterModule, Routes } from '@angular/router';
import { BlockUIModule, ConfirmDialogModule, FileUploadModule, ToastModule, ProgressBarModule, AccordionModule, DialogModule, TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, SplitButtonModule, OverlayPanelModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/shared/header/header.module';
// import { DashboardRESTDataAPIService } from '../service/dashboard-rest-data-api.service';
// import { DdrDataModelService } from '../service/ddr-data-model.service';
// import { DDRRequestService } from '../service/ddr-request.service';
// import { CommonServices } from '../service/common.services'
const routes: Routes = [
  {
    path: 'gc-manager',
    component: GcManagerComponent,
  },
];

const imports = [BlockUIModule, ConfirmDialogModule, FileUploadModule, ProgressBarModule, ToastModule, AccordionModule, FormsModule, DialogModule, CommonModule, TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, SplitButtonModule, OverlayPanelModule, HeaderModule];

const components = [GcManagerComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
  providers: []
})
export class GCManagerModule {}
