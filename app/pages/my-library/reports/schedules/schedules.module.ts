import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SchedulereportComponent } from './schedulereport/schedulereport.component';
import { SchedulesComponent } from './schedules.component';
import { RouterModule, Routes } from '@angular/router';
import { SchedulereportModule } from './schedulereport/schedulereport.module';
import { BreadcrumbModule, ButtonModule, CardModule, InputTextModule, TooltipModule, MenuModule, MessageModule, MultiSelectModule, TableModule, ToolbarModule, InputSwitchModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule } from 'primeng/confirmdialog';


const imports = [
  CommonModule,
  SchedulereportModule,
  TableModule,
  CardModule,
  MessageModule,
  ToolbarModule,
  TooltipModule,
  HeaderModule,
  BreadcrumbModule,
  MenuModule,
  ButtonModule,
  MultiSelectModule,
  FormsModule,
  InputTextModule,
  InputSwitchModule,
  ConfirmDialogModule
];

const components = [
  SchedulesComponent
];

const routes: Routes = [
  {
    path: 'schedules',
    component: SchedulesComponent,
    children: [
      {
        path: 'schedulereport',
        loadChildren: () => import('./schedulereport/schedulereport.module').then(m => m.SchedulereportModule),
        component: SchedulereportComponent
      },
    ]
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
  ]
})

export class SchedulesModule { }
