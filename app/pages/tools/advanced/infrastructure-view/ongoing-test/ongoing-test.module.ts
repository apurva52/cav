import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OngoingTestComponent } from './ongoing-test.component';
import { ButtonModule, CardModule, CheckboxModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, TooltipModule } from 'primeng';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';

const imports = [
  CommonModule,
  TableModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  MultiSelectModule,
  FormsModule,
  MenuModule,
  InputTextModule,
  CheckboxModule
];

const components = [
  OngoingTestComponent
];
const routes: Routes = [
  {
    path: 'ongoing-test',
    component: OngoingTestComponent,
  }
];

@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule,components
  ]
})
export class OngoingTestModule { }
