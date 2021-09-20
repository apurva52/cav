import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PercentileComponent } from './percentile.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CardModule, ButtonModule, CheckboxModule, DropdownModule, FieldsetModule, MultiSelectModule } from 'primeng';


const imports = [
  CommonModule,  
  CardModule,
  ButtonModule,  
  CheckboxModule,  
  FormsModule,    
  MultiSelectModule, 
  FieldsetModule
];

const components = [PercentileComponent];

const routes: Routes = [
  {
    path: 'percentile',
    component: PercentileComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PercentileModule { }
