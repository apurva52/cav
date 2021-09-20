import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppCrashComponent } from './app-crash.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule, ButtonModule, CheckboxModule, FieldsetModule, MessageModule, InputTextModule, DropdownModule, SliderModule, MultiSelectModule, TooltipModule, PanelModule, InputSwitchModule, TableModule } from 'primeng';


const imports = [
  CommonModule,
  CardModule,
  ButtonModule,
  CheckboxModule,
  FormsModule,
  FieldsetModule,
  InputTextModule,
  DropdownModule,
  MessageModule,
  SliderModule,
  MultiSelectModule,
  TooltipModule,
  PanelModule,
  InputSwitchModule,
  TableModule,
  ReactiveFormsModule,
];

const components = [AppCrashComponent];

const routes: Routes = [
  {
    path: 'app-crash',
    component: AppCrashComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, AppCrashComponent, CardModule, ButtonModule, CheckboxModule, FieldsetModule, MessageModule, InputTextModule, DropdownModule, SliderModule, MultiSelectModule, TooltipModule, PanelModule, InputSwitchModule, TableModule],
})

export class AppCrashModule { }

