import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BusinessProcessFilterComponent } from './business-process-filter.component';
import { ButtonModule, DropdownModule, InputTextModule, SidebarModule } from 'primeng';


@NgModule({
  declarations: [BusinessProcessFilterComponent],
  imports: [
    CommonModule,
    SidebarModule,
    ButtonModule,
    InputTextModule,
    DropdownModule,
  ],
  exports: [BusinessProcessFilterComponent],
})
export class BusinessProcessFilterModule { }
