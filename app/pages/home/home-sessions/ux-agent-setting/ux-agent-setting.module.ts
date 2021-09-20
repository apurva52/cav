import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { TableModule, DialogModule, CardModule, ButtonModule, ConfirmDialogModule, ToastModule, TooltipModule, AccordionModule, BreadcrumbModule, CarouselModule, ChartModule, CheckboxModule, DropdownModule, InputSwitchModule, InputTextareaModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, RadioButtonModule, ToolbarModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { UxAgentSettingComponent } from './ux-agent-setting.component';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { EditUxAgentSettingComponent } from './edit-ux-agent-setting/edit-ux-agent-setting.component';
import { EditUxAgentSettingModule } from './edit-ux-agent-setting/edit-ux-agent-setting.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  TooltipModule,
  FormsModule,
  ToastModule,
  CommonModule,
  ChartModule,
  CarouselModule,
  AccordionModule,
  ToolbarModule,
  HeaderModule,
  CheckboxModule,
  MultiSelectModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,
  PanelModule,
  ConfirmDialogModule,
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  MessageModule,
  DialogModule,
  EditUxAgentSettingModule
];

const components = [
  UxAgentSettingComponent
];
const routes: Routes = [
  {
    path: 'ux-agent-setting',
    component: UxAgentSettingComponent,
    children: [
      {
        path: '',
        redirectTo: 'ux-agent-setting',
        pathMatch: 'full',
      },
      {
        path: 'edit-ux-agent-setting',
        loadChildren: () =>
          import('./edit-ux-agent-setting/edit-ux-agent-setting.module').then(
            (m) => m.EditUxAgentSettingModule
          ),
        component: EditUxAgentSettingComponent
      }
    ]
  },
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule, components
  ]
})
export class UxAgentSettingModule { }



