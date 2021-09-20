import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VariationComponent } from './variation.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ToggleButtonModule, ToastModule, ButtonModule, SliderModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, RadioButtonModule, TableModule, TabMenuModule, ToolbarModule, TooltipModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AddNewVariationModule } from './add-new-variation/add-new-variation.module';
import { GoalinvariationModule } from './../goalinvariation/goalinvariation.module';
const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  ReactiveFormsModule,
  ToggleButtonModule,
  BreadcrumbModule,
  SliderModule,
  TabMenuModule,
  ToastModule,
  AddNewVariationModule,
  GoalinvariationModule,
  InputTextModule,
  MessageModule,
  DialogModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  TooltipModule,
  RadioButtonModule,
  PanelModule
]

const components = [VariationComponent];

const routes: Routes = [
  {
    path: 'variation',
    component: VariationComponent,
  },
];

@NgModule({
  declarations: [components,],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class VariationModule { }

