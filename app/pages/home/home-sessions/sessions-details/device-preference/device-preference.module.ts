import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevicePreferenceComponent } from './device-preference.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { InputTextModule, ButtonModule, MessageModule, CardModule, DropdownModule, TableModule, MenuModule, TooltipModule } from 'primeng';
import { ChartModule } from 'src/app/shared/chart/chart.module';

const imports = [
  CommonModule,
  InputTextModule,
  ButtonModule,
  MessageModule,
  CardModule,
  FormsModule,
  DropdownModule,
  TableModule,
  MenuModule,
  TooltipModule,
  ChartModule,
]

const routes: Routes = [
  {
    path: 'device-preference',
    component: DevicePreferenceComponent,
  },
];

const components = [DevicePreferenceComponent];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})

export class DevicePreferenceModule { }
