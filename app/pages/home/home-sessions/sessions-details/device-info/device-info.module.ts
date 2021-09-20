import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceInfoComponent } from './device-info.component';

import { MessageModule } from 'primeng';

@NgModule({
  declarations: [DeviceInfoComponent],
  imports: [
    CommonModule,
    MessageModule
  ]
})
export class DeviceInfoModule { }
