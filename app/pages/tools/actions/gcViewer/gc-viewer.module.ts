import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GcViewerComponent } from './gcViewer.component'
import { RouterModule, Routes } from '@angular/router';
import { BlockUIModule, ConfirmDialogModule, FileUploadModule, ToastModule, ProgressBarModule, AccordionModule, DialogModule, TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, SplitButtonModule, OverlayPanelModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { HighchartsChartModule } from 'highcharts-angular';
import { HeaderModule } from 'src/app/shared/header/header.module';
// import { DashboardRESTDataAPIService } from './service/dashboard-rest-data-api.service';
// import { DdrDataModelService } from '../service/ddr-data-model.service';
const routes: Routes = [
  {
    path: 'gc-viewer',
    component: GcViewerComponent,
  },
];

const imports = [HighchartsChartModule, BlockUIModule, ConfirmDialogModule, FileUploadModule, ProgressBarModule, ToastModule, AccordionModule, FormsModule, DialogModule, CommonModule, TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, SplitButtonModule, OverlayPanelModule, HeaderModule];

const components = [GcViewerComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
  providers: []
})
export class GCViewerModule {}
