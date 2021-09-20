import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AccordionModule, ButtonModule, CheckboxModule, ConfirmDialogModule, DropdownModule, FieldsetModule, FileUploadModule, PanelModule, ProgressSpinnerModule, TableModule, TabViewModule, ToolbarModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { CavMonNewrelicComponent } from './cav-mon-newrelic.component';
//import { CavMonAzureComponent } from './cav-mon-azure.component';
//import { CavMonGcpComponent } from './cav-mon-gcp.component';
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
  FileUploadModule,
  InputTextModule,
  ConfirmDialogModule,
  CheckboxModule,
  ProgressSpinnerModule,
  MonStatsModule
]

const components = [
    CavMonNewrelicComponent
];
const routes: Routes = [
  {
    path: 'cav-mon-newrelic',
    component: CavMonNewrelicComponent
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
export class CavMonNewrelic { }
