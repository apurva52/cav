import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, ToolbarModule, TooltipModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { BusinessApplicationViewComponent } from './business-application-view.component';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  CheckboxModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  InputTextModule,
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule
]

const components = [BusinessApplicationViewComponent];

const routes: Routes = [
  {
    path: 'business-application-view',
    component: BusinessApplicationViewComponent,
  },
];

@NgModule({
  declarations: [components,],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class BusinessApplicationViewModule { }
