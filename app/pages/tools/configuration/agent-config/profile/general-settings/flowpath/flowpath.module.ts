import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowpathComponent } from './flowpath.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CardModule, ButtonModule, CheckboxModule, MultiSelectModule, FieldsetModule, RadioButtonModule, InputTextModule } from 'primeng';


const imports = [
  CommonModule,  
  CardModule,
  ButtonModule,  
  CheckboxModule,  
  FormsModule, 
  RadioButtonModule,
  InputTextModule
];

const components = [FlowpathComponent];

const routes: Routes = [
  {
    path: 'percentile',
    component: FlowpathComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlowpathModule { }
