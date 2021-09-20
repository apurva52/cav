import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OthersComponent } from './others.component';
import { RouterModule, Routes } from '@angular/router';
import { CardModule, ButtonModule, CheckboxModule, MultiSelectModule, FieldsetModule, RadioButtonModule, DropdownModule } from 'primeng';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,  
  CardModule,
  ButtonModule,  
  CheckboxModule,  
  FormsModule, 
  RadioButtonModule,
  DropdownModule
];

const components = [OthersComponent];

const routes: Routes = [
  {
    path: 'others',
    component: OthersComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})


export class OthersModule { }
