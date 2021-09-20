import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OracleServerComponent } from './oracle-server.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, DropdownModule, InputTextModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { MonitorsModule } from '../monitors/monitors.module';

const routes: Routes = [
  {
    path: 'oracle-server/:tech/:techDispName/:tierName',
    component: OracleServerComponent
  }
];

@NgModule({
  declarations: [OracleServerComponent],
  imports: [
    CommonModule,
    HeaderModule,
    ToolbarModule,
    DropdownModule,
    InputTextModule,
    PipeModule,
    FormsModule,
    BreadcrumbModule,
    MonitorsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class OracleServerModule { }
