import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UxComponent } from './ux.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, CheckboxModule, ConfirmDialogModule, ContextMenuModule, DropdownModule, InputTextModule, MessageModule, RadioButtonModule, TabMenuModule, ToastModule, TooltipModule, TreeModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { GeneralReportsModule } from './general-reports/general-reports.module';
import { SpecialReportsModule } from './special-reports/special-reports.module';
import { SpecialReportsFilterModule } from './special-reports/special-reports-filter/special-reports-filter.module';


const imports = [
  CommonModule,
  CardModule,
  TabMenuModule,
  InputTextModule,
  RadioButtonModule,
  DropdownModule,
  MessageModule,
  FormsModule,
  ButtonModule,
  CheckboxModule,
  TreeModule,
  GeneralReportsModule,
  ToastModule,
  TooltipModule,
  SpecialReportsModule,
  SpecialReportsFilterModule,
  ConfirmDialogModule,
  ContextMenuModule
];

const components = [
  UxComponent
];
const routes: Routes = [
  {
    path: 'ux',
    component: UxComponent,
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
export class UxModule { }
