import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JsErrorFilterComponent } from './js-error-filter.component';
import { JsErrorDetailComponent }  from '../jserror-details/jserror-detail.component';
import { ButtonModule, CardModule, CheckboxModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, ToastModule, ToolbarModule, TooltipModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule , ReactiveFormsModule} from '@angular/forms';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';
import { RouterModule, Routes } from '@angular/router';
import { HeaderModule } from 'src/app/shared/header/header.module';
import {JsErrorFilterSidebarModule} from './sidebar/js-error-filter.sidebar/js-error-filter-sidebar.module';
import {BreadcrumbModule} from 'primeng/breadcrumb';
import { AutoCompleteModule } from 'primeng'; 
import { ProgressSpinnerModule } from 'primeng/progressspinner';



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
  ReactiveFormsModule,
  JsErrorFilterSidebarModule,
  BreadcrumbModule,
  AutoCompleteModule,
  ProgressSpinnerModule
 
  
];


const routes: Routes = [
  {
    path: 'js-error-filter',
    component: JsErrorFilterComponent,
  },
  {
       path : 'jserror-detail',
       component : JsErrorDetailComponent
  }
];





@NgModule({
  declarations: [JsErrorFilterComponent,JsErrorDetailComponent],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class JsErrorFilterModule { }
