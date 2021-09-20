import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommandListComponent } from './command-list.component';
import { AddUserDefinedCommandComponent } from './add-user-defined-command/add-user-defined-command.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { CardModule, TabMenuModule, InputTextModule, RadioButtonModule, DropdownModule, MessageModule, ButtonModule, AccordionModule, CheckboxModule, TreeModule, ToolbarModule, MultiSelectModule, PanelModule, InputTextareaModule, BreadcrumbModule, MenuModule, InputSwitchModule, FieldsetModule, TableModule, ToastModule, TooltipModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AddUserDefinedCommandModule } from './add-user-defined-command/add-user-defined-command.module';



const routes: Routes = [
  {
    path: 'app-command-list',
    children: [
      {
        path: '',
        redirectTo: 'app-command-list',
        pathMatch: 'full',
      },
      {
        path: 'app-command-list',
        component: CommandListComponent,
      },
      {
        path: 'add-user-defined-command',
        loadChildren: () =>
        import('./add-user-defined-command/add-user-defined-command.module').then((m) => m.AddUserDefinedCommandModule),
        component: AddUserDefinedCommandComponent,
      },
    ],
  },
];

const imports = [CommonModule,
  CardModule,
  TabMenuModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,
  MessageModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  FormsModule,
  ButtonModule,
  AccordionModule,
  CheckboxModule,
  TreeModule,
  ToolbarModule,
  HeaderModule,
  MultiSelectModule,
  PanelModule,
  InputTextareaModule,
  BreadcrumbModule,
  MenuModule,
  InputSwitchModule,
  FieldsetModule,
  TableModule,
  AppMessageModule,
  ToastModule,
  ReactiveFormsModule,
  LongValueModule,
  PipeModule,
  IpSummaryOpenBoxModule,
  AddUserDefinedCommandModule,
  TooltipModule


];

const components = [CommandListComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})

export class CommandListModule { }
