import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AccordionModule, ButtonModule, CheckboxModule, ConfirmDialogModule, DropdownModule, FieldsetModule, MultiSelectModule, PanelModule, ProgressSpinnerModule, TableModule, TabViewModule, ToolbarModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { CavMonDynatraceComponent } from './cav-mon-dynatrace.component';
import {InputTextModule} from 'primeng/inputtext';
import { MonStatsModule } from '../../mon-stats/mon-stats.module';



const imports = [
  CommonModule,
  HeaderModule,
  ToolbarModule,
  PanelModule,
  DropdownModule,
  ButtonModule,
  FormsModule,
  PipeModule,
  TabViewModule,
  FieldsetModule,
  AccordionModule,
  TableModule,
  CheckboxModule,
  MultiSelectModule,
  InputTextModule,
  ConfirmDialogModule,
  ProgressSpinnerModule,
  MonStatsModule
]

const components = [
    CavMonDynatraceComponent
];
const routes: Routes = [
  {
    path: 'cav-mon-dynatrace',
    component: CavMonDynatraceComponent
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ],  
})
export class CavMonDynatraceModule { }
