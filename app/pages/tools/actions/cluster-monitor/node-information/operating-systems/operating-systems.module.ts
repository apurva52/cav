import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperatingSystemsComponent } from './operating-systems.component';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, TableModule, TooltipModule } from 'primeng';

const routes: Routes = [
  {
    path: 'operating-systems',
    component: OperatingSystemsComponent,
  },
];

const imports = [CommonModule, ChartModule, TooltipModule, TableModule, ButtonModule];

const components = [OperatingSystemsComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class OperatingSystemsModule { }
