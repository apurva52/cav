import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionWaitStatsComponent } from './session-wait-stats.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableModule, MessageModule, TooltipModule, MultiSelectModule, MenuModule, DropdownModule, InputTextModule, ButtonModule } from 'primeng';



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
];
const components = [];
// const routes: Routes = [
  // {
  //   path: 'session-stats',
  //   component: SessionStatsComponent,
  // },
// ];

@NgModule({
  declarations: [components],
  imports: [imports],//, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SessionStatsModule { }
