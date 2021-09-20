import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {DialogModule} from 'primeng/dialog';
import {CardModule} from 'primeng/card';
import { EventRevenueComponent } from './event-revenue.component';
import { EventFilterModule } from './event-filter/event-revenue-sidebar.module';
import { TableModule } from 'primeng/table';
import { LoaderModule } from '../loader/loader.module';


const imports = [
  CommonModule,
  DialogModule,
  CardModule,
  EventFilterModule,
  TableModule,
  LoaderModule
  
  
];

const components = [EventRevenueComponent];

const routes: Routes = [
  {
    path: 'event-revenue',
    component: EventRevenueComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})

export class EventRevenueModule { }