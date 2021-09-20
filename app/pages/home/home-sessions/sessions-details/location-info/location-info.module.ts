import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationInfoComponent } from './location-info.component';

import { MessageModule } from 'primeng';

@NgModule({
  declarations: [LocationInfoComponent],
  imports: [
    CommonModule,
    MessageModule
  ]
})
export class LocationInfoModule { }
