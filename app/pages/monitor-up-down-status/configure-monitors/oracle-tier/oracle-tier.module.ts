import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OracleTierComponent } from './oracle-tier.component';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { BreadcrumbModule, DropdownModule, InputTextModule, ToolbarModule } from 'primeng';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { MonitorsModule } from '../monitors/monitors.module';




const routes: Routes = [
  {
    path: 'oracle-tier/:tech/:tier/:techDispName',
    component: OracleTierComponent
  }
];

@NgModule({
  declarations: [OracleTierComponent],
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

export class OracleTierModule { }
