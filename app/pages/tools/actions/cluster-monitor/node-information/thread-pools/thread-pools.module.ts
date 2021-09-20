import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreadPoolsComponent } from './thread-pools.component';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, TableModule, TooltipModule } from 'primeng';

const routes: Routes = [
  {
    path: 'thread-pools',
    component: ThreadPoolsComponent,
  },
];

const imports = [CommonModule, ChartModule, TooltipModule, TableModule, ButtonModule];

const components = [ThreadPoolsComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class ThreadPoolsModule { }
