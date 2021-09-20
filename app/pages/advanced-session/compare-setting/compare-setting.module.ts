import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { DialogModule, CardModule, DropdownModule, CheckboxModule, InputTextModule, ButtonModule, TableModule, MessageModule, MenuModule, TabMenuModule, TabViewModule, RadioButtonModule } from 'primeng';
import { CompareSettingComponent } from './compare-setting.component';


const imports = [
  CommonModule,
  DialogModule,  
  DropdownModule,
  FormsModule,
  InputTextModule,
  RadioButtonModule,
  ButtonModule,
  TabViewModule
];

const components = [
  CompareSettingComponent
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [
    components
  ]
})
export class CompareSettingModule { }
