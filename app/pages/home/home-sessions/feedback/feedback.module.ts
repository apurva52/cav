import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeedbackComponent } from './feedback.component';
import { RouterModule, Routes } from '@angular/router';
import { BreadcrumbModule, ButtonModule, CardModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, RadioButtonModule, RatingModule, TableModule,
  TabMenuModule, ToolbarModule, TooltipModule,  } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FormsModule } from '@angular/forms';
import { FeedbackFilterSidebarModule } from './feedback-filter-sidebar/feedback-filter-sidebar.module'; 

import { ProgressSpinnerModule } from 'primeng/progressspinner';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  InputTextModule,
  MessageModule,
  DialogModule,
  CardModule,
  FormsModule,
  DropdownModule,
  CheckboxModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  TooltipModule,
  RadioButtonModule,
  RatingModule,
  FeedbackFilterSidebarModule,
  ProgressSpinnerModule
]

const components = [FeedbackComponent];

const routes: Routes = [
  {
    path: 'feedback',
    component: FeedbackComponent,
  },
];

@NgModule({
  declarations: [components,],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class FeedbackModule { }
