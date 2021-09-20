import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphTreeSettingComponent } from './graph-tree-setting.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule, ButtonModule, CheckboxModule, FieldsetModule, InputTextModule } from 'primeng';

const imports = [
  CommonModule,  
  CardModule,
  ButtonModule,  
  CheckboxModule,  
  FormsModule,
  FieldsetModule,  
  InputTextModule
];

const components = [GraphTreeSettingComponent];

const routes: Routes = [
  {
    path: 'fav-setting',
    component: GraphTreeSettingComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class GraphTreeSettingModule { }
