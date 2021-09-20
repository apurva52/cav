import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MultidiskSettingComponent } from './multidisk-setting.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, ToolbarModule, CardModule, DialogModule, ToastModule, TreeTableModule, CheckboxModule, DropdownModule, FieldsetModule, InputTextModule, MultiSelectModule, PanelModule, ProgressBarModule, SliderModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { ClipboardModule } from '@angular/cdk/clipboard';


const imports = [
  CommonModule,
  CardModule,
  DropdownModule,
  ButtonModule,
  FormsModule,
  SliderModule,
  ToastModule,
  DialogModule,
  CheckboxModule,
  ToolbarModule,
  TreeTableModule,
  MultiSelectModule,
  TooltipModule,
  PanelModule,
  TableModule,
  ProgressBarModule,
  ChartModule,
  ClipboardModule
];

const components = [MultidiskSettingComponent];

const routes: Routes = [
  {
    path: 'multidisk-setting',
    component: MultidiskSettingComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})
export class MultidiskSettingModule { }


