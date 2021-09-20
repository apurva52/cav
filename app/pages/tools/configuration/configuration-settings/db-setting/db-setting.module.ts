import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DbSettingComponent } from './db-setting.component';
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

const components = [DbSettingComponent];

const routes: Routes = [
  {
    path: 'db-setting',
    component: DbSettingComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class DbSettingModule { }
