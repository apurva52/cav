import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, DialogModule, DropdownModule, FieldsetModule, InputTextModule, InputSwitchModule, MultiSelectModule, PanelModule, ProgressBarModule, CheckboxModule, SliderModule, TableModule, TooltipModule,ToastModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { ParserSettingComponent } from './parser-setting.component';


const imports = [
  CommonModule,
  CardModule,
  ButtonModule,
  InputSwitchModule,
  FormsModule,
  DialogModule,
  ToastModule,
  DropdownModule,
  CheckboxModule,
  MultiSelectModule,
  TooltipModule,
  PanelModule,
  TableModule,
  ProgressBarModule,
  ChartModule
];

const components = [ParserSettingComponent];

const routes: Routes = [
  {
    path: 'parser-setting',
    component: ParserSettingComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})
export class ParserSettingModule { }

