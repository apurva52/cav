import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LowerTabularPanelComponent } from './lower-tabular-panel.component';
import { Routes, RouterModule } from '@angular/router';
import {
  TableModule,
  ButtonModule,
  TooltipModule,
  CardModule,
  ColorPickerModule,
  MultiSelectModule,
  CheckboxModule
} from 'primeng';
import { FormsModule } from '@angular/forms';
import { PipeModule } from '../pipes/pipes.module';
import {InputTextModule} from 'primeng/inputtext';
const imports = [
  CommonModule,
  TableModule,
  ButtonModule,
  TooltipModule,
  CardModule,
  ColorPickerModule,
  FormsModule,
  MultiSelectModule,
  CheckboxModule,
  PipeModule,
  InputTextModule
];
const components = [LowerTabularPanelComponent];
const routes: Routes = [
  {
    path: 'lower-tabular-panel',
    component: LowerTabularPanelComponent,
  },
];
@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class LowerTabularPanelModule {}
