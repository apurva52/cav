import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchSidebarComponent } from './search-sidebar.component';
import { ButtonModule, CardModule, CheckboxModule, DropdownModule, InputTextModule, MultiSelectModule, SidebarModule, TableModule, TabMenuModule, TabViewModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  DropdownModule,
  SidebarModule,
  TabMenuModule,
  TabViewModule,
  ButtonModule,
  CheckboxModule,
  TableModule,
  CardModule,
  TooltipModule,
  InputTextModule,
  MultiSelectModule,
  FormsModule
];

const components = [
  SearchSidebarComponent
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
export class SearchSidebarModule { }
