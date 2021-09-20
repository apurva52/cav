import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {InputTextModule} from 'primeng/inputtext';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { AccordionModule, ButtonModule, CheckboxModule, DropdownModule, FieldsetModule, MultiSelectModule, PanelModule, TableModule, TabViewModule, ToolbarModule, ConfirmDialogModule, ProgressSpinnerModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { CavMonAwsComponent } from './cav-mon-aws.component';
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
    CavMonAwsComponent
];
const routes: Routes = [
  {
    path: 'cav-mon-aws',
    component: CavMonAwsComponent
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
export class CavMonAwsModule { }
