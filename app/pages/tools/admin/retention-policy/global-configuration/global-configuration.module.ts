import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalConfigurationComponent } from './global-configuration.component';
import { ButtonModule, CardModule, DropdownModule, InputSwitchModule, MenuModule, MessageModule, MultiSelectModule, PanelModule, TableModule } from 'primeng';
import { OwlDateTimeModule } from 'ng-pick-datetime';
import { FormsModule } from '@angular/forms';



@NgModule({
  declarations: [GlobalConfigurationComponent],
  imports: [
    CommonModule,
    PanelModule,
    TableModule,
    ButtonModule,
    DropdownModule,
    CardModule,
    InputSwitchModule,
    OwlDateTimeModule,
    MessageModule,
    FormsModule,
    MultiSelectModule,
    MenuModule
  ]
})
export class GlobalConfigurationModule { }
