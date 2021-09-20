import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AccordionModule, ButtonModule, CheckboxModule, ConfirmDialogModule, DropdownModule, FieldsetModule, PanelModule, ProgressSpinnerModule, TableModule, TabViewModule, ToolbarModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { CavMonAzureComponent } from './cav-mon-azure.component';
import {InputTextModule} from 'primeng/inputtext';
import {MultiSelectModule} from 'primeng/multiselect';
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
  InputTextModule,
  MultiSelectModule,
  ConfirmDialogModule,
  CheckboxModule,
  ProgressSpinnerModule,
  MonStatsModule
]

const components = [
    CavMonAzureComponent
];
const routes: Routes = [
  {
    path: 'cav-mon-azure',
    component: CavMonAzureComponent
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
export class CavMonAzureModule { }
