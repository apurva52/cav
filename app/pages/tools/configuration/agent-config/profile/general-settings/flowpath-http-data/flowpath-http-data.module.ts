import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlowpathHttpDataComponent } from './flowpath-http-data.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CardModule, ButtonModule, CheckboxModule, InputTextModule, RadioButtonModule } from 'primeng';


const imports = [
  CommonModule,  
  CardModule,
  ButtonModule,  
  CheckboxModule,  
  FormsModule, 
  InputTextModule,
  RadioButtonModule
];

const components = [FlowpathHttpDataComponent];

const routes: Routes = [
  {
    path: 'flowpath-http-data',
    component: FlowpathHttpDataComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlowpathHttpDataModule { }
