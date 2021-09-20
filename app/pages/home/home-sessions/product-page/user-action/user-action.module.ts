import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserActionComponent } from './user-action.component';
import { ButtonModule, CardModule, CheckboxModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, ToastModule, ToolbarModule, TooltipModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import {ClipboardModule} from '@angular/cdk/clipboard';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  ToastModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  PipeModule,
  InputTextModule,
  HeaderModule,
  ToolbarModule,
  ClipboardModule 
];

const components = [UserActionComponent];

const routes: Routes = [
  {
    path: 'user-action',
    component: UserActionComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserActionModule { }
