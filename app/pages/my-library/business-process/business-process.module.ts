import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessProcessComponent } from './business-process.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { BusinessProcessFilterModule } from '../../home/funnel/sidebar/business-process-filter/business-process-filter.module';

const imports = [
  CommonModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  CardModule,
  FormsModule,
  TableModule,
  MultiSelectModule,
  MenuModule,
  TooltipModule,
  BusinessProcessFilterModule
]

const components = [
  BusinessProcessComponent
];


const routes: Routes = [
  {
    path: 'business-process',
    component: BusinessProcessComponent,
  }
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


export class BusinessProcessModule { }
