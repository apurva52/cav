import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClassicDashboardComponent } from './classic-dashboard.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { CardModule, ButtonModule, MessageModule, TooltipModule, InputTextModule, DropdownModule, SidebarModule, PanelModule, SelectButtonModule, FieldsetModule, AccordionModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';

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

const components = [ClassicDashboardComponent];

const routes: Routes = [
  {
    path: 'classic-dashboard',
    component: ClassicDashboardComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})


export class ClassicDashboardModule { }
