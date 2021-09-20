import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuerySettingComponent } from './query-setting.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule, ButtonModule, CheckboxModule, MultiSelectModule, FieldsetModule, DropdownModule, InputTextModule } from 'primeng';

const imports = [
  CommonModule,  
  CardModule,
  ButtonModule,  
  CheckboxModule,  
  FormsModule,    
  MultiSelectModule, 
  FieldsetModule,
  DropdownModule,
  InputTextModule
];

const components = [QuerySettingComponent];

const routes: Routes = [
  {
    path: 'query-setting',
    component: QuerySettingComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})


export class QuerySettingModule { }
