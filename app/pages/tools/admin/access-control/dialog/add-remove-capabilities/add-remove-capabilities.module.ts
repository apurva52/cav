import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddRemoveCapabilitiesComponent } from './/add-remove-capabilities.component';
import { ButtonModule, CardModule, DialogModule, DropdownModule, InputTextModule, MenuModule, MessageModule, MultiSelectModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';


const components = [AddRemoveCapabilitiesComponent];
@NgModule({
  declarations: [AddRemoveCapabilitiesComponent],
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    TableModule,
    CardModule,
    MessageModule,
    TooltipModule,
    MultiSelectModule,
    FormsModule,
    DropdownModule,
    InputTextModule,
    MenuModule,
  ],
  exports: [components],
})
export class AddRemoveCapabilitiesModule { }
