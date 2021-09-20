import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { PageScatterplotComponent } from './page-scatter-plot.component';
import { PageScatterplotComponent } from './page-scatter-plot.component';
import { ButtonModule, CardModule, DialogModule, PaginatorModule, PanelModule } from 'primeng';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartModule } from 'src/app/shared/chart/chart.module';

const components = [PageScatterplotComponent];
const imports = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  PanelModule,
  InputNumberModule,
  DropdownModule,
  ChartModule,
  PaginatorModule,
  DialogModule,
  ButtonModule,
  CardModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})

export class PageScatterplotModule { }
