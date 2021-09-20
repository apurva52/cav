import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplateComponent } from './template.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule, CardModule, ButtonModule, ToastModule, MessageModule,
   TooltipModule, CheckboxModule, MultiSelectModule, DialogModule, SlideMenuModule, MenuModule, 
   InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, ConfirmDialogModule,
   BlockUIModule, ProgressSpinnerModule} from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { IpSummaryOpenBoxModule } from 'src/app/shared/ip-summary-open-box/ip-summary-open-box.module';
import { LongValueModule } from 'src/app/shared/long-value/long-value.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { AddTemplateModule } from './add-template/add-template.module';
import { AddTemplateComponent } from './add-template/add-template.component';

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
  ReactiveFormsModule,
  LongValueModule,
  DialogModule,
  PipeModule,
  SlideMenuModule,
  MenuModule,
  IpSummaryOpenBoxModule,
  InputTextModule, //conflicts
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule,
  DropdownModule,
  AddTemplateModule,
  ConfirmDialogModule,
  ProgressSpinnerModule,
  BlockUIModule
];

const routes: Routes = [
  {
    path: 'template',
    component: TemplateComponent,
    children: [
      {
        path: 'add-template',
        loadChildren: () => import('./add-template/add-template.module').then(m => m.AddTemplateModule),
        component: AddTemplateComponent
      },
      
    ]
  }
];


const components = [
  TemplateComponent
];
@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class TemplateModule { }
