import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, MessageModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule, PanelModule, } from 'primeng';
import { CommonStatsFilterModule } from '../shared/common-stats-filter/common-stats-filter.module';
import {TabMenuModule} from 'primeng/tabmenu';
import { SessionStatComponent } from '../session-stats/session-stats.component';
import { RouterModule, Routes } from '@angular/router';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

const imports = [
  CommonModule,
  TableModule, 
  MessageModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  DropdownModule,
  InputTextModule,
  ButtonModule,
  PanelModule,
  TabMenuModule,
  CommonStatsFilterModule,
  PipeModule
];
const components = [
    SessionStatComponent
  ];
  const routes: Routes = [
    {
      path: 'add-session-stats',
      component: SessionStatComponent
    }
  ];
  @NgModule({
    declarations: [components],
    imports: [
      imports,
      RouterModule.forChild(routes)
    ],
    exports: [
      components
    ]
  })
export class SessionStatModule { }
