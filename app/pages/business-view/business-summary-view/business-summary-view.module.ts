import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessSummaryViewComponent } from './business-summary-view.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TableModule, CardModule, ButtonModule, MessageModule, TooltipModule, CheckboxModule, MultiSelectModule, SlideMenuModule, MenuModule, InputTextModule, ToolbarModule, BreadcrumbModule, DropdownModule, SplitButtonModule, OverlayPanelModule, AutoCompleteModule, TabViewModule, TabMenuModule, CarouselModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';

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
  PipeModule,
  SlideMenuModule,
  MenuModule,
  InputTextModule,
  HeaderModule,
  ToolbarModule,
  BreadcrumbModule,
  DropdownModule,
  SplitButtonModule,
  OverlayPanelModule,
  AutoCompleteModule,
  TabViewModule,
  TabMenuModule,
  CarouselModule
 
];

const components = [BusinessSummaryViewComponent];

const routes: Routes = [
  {
    path: 'business-summary-view',
    component: BusinessSummaryViewComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule,BusinessSummaryViewComponent],
})

export class BusinessSummaryViewModule { }
