import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpRelatedmetricsComponent } from './helprelatedmetrics.component';
import { DialogModule, TableModule } from 'primeng';


const imports = [
  CommonModule,
  DialogModule,
  TableModule
];

const components = [HelpRelatedmetricsComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class HelpRelatedmetricsModule { }
