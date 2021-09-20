import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttentionMapComponent } from './attention-map.component';
import { MappingConfigurationModule } from '../mapping-configuration/mapping-configuration.module';
import { ButtonModule, InputTextModule } from 'primeng';



@NgModule({
  declarations: [AttentionMapComponent],
  imports: [
    CommonModule,MappingConfigurationModule,ButtonModule, InputTextModule
  ]
})
export class AttentionMapModule { }
