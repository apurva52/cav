import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessDumpComponent } from './process-dump.component';
import { RouterModule, Routes } from '@angular/router';
import { ToastModule, AccordionModule, DialogModule, TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, SplitButtonModule, OverlayPanelModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { DashboardRESTDataAPIService } from '../service/dashboard-rest-data-api.service';
import { DdrDataModelService } from '../service/ddr-data-model.service';
const routes: Routes = [
  {
    path: 'process-dump',
    component: ProcessDumpComponent,
  },
];

const imports = [ToastModule, AccordionModule, FormsModule, DialogModule, CommonModule, TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, SplitButtonModule, OverlayPanelModule];

const components = [ProcessDumpComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
  providers : [DashboardRESTDataAPIService, DdrDataModelService]
})
export class ProcessDumpModule {}
