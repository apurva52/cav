import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MappingConfigurationComponent } from './mapping-configuration.component';
import { RouterModule, Routes } from '@angular/router';
import { FieldsetModule, ButtonModule, CardModule, CheckboxModule, DropdownModule, InputTextModule, MessageModule, RadioButtonModule, SidebarModule, SliderModule, TooltipModule } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { OwlMomentDateTimeModule } from 'src/app/shared/date-time-picker-moment/moment-date-time.module';

const imports = [
  CommonModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  MessageModule,
  TooltipModule,
  FormsModule,
  InputTextModule,
  DropdownModule,
  SidebarModule,
  DropdownModule,
  RadioButtonModule,
  OwlDateTimeModule,
  OwlMomentDateTimeModule,
  CheckboxModule,
  SliderModule,
  FieldsetModule
];

const components = [MappingConfigurationComponent];

const routes: Routes = [
  {
    path: 'mapping-configuration',
    component: MappingConfigurationComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class MappingConfigurationModule { }
