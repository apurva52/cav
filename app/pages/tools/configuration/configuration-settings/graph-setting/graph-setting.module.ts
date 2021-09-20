import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphSettingComponent } from './graph-setting.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CardModule, ButtonModule, CheckboxModule, FieldsetModule, InputTextModule, DropdownModule, SliderModule } from 'primeng';

const imports = [
  CommonModule,  
  CardModule,
  ButtonModule,  
  CheckboxModule,  
  FormsModule,
  FieldsetModule,  
  InputTextModule,
  DropdownModule,
  SliderModule
];

const components = [GraphSettingComponent];

const routes: Routes = [
  {
    path: 'fav-setting',
    component: GraphSettingComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class GraphSettingModule { }
