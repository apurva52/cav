import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrentSessionFilterComponent } from './current-session-filter.component';
import {
  AccordionModule,
  ButtonModule,
  CardModule,
  DropdownModule,
  FieldsetModule,
  InputTextModule,
  MessageModule,
  PanelModule,
  SelectButtonModule,
  SidebarModule,
  TooltipModule,
} from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

const imports = [
  CommonModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  FormsModule,
  InputTextModule,
  DropdownModule,
  SidebarModule,
  PanelModule,
  DropdownModule,
  SelectButtonModule,
  FieldsetModule,
  AccordionModule,
];

const components = [CurrentSessionFilterComponent];

const routes: Routes = [
  {
    path: 'current-session-filter',
    component: CurrentSessionFilterComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class CurrentSessionFilterModule { }
