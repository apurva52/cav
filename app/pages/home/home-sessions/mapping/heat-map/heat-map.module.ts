import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeatMapComponent } from './heat-map.component';
import { MappingConfigurationModule } from '../mapping-configuration/mapping-configuration.module';
import { ButtonModule, InputTextModule } from 'primeng';

@NgModule({
  declarations: [HeatMapComponent],
  imports: [
    CommonModule,MappingConfigurationModule,ButtonModule, InputTextModule
  ]
})
export class HeatMapModule { }
