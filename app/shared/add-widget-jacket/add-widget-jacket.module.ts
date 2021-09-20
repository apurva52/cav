import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddWidgetJacketComponent } from './add-widget-jacket.component';
import {ListboxModule} from 'primeng/listbox';
import {BreadcrumbModule, ButtonModule} from 'primeng';

const imports = [
  CommonModule,
  BreadcrumbModule,
  ButtonModule,
  ListboxModule
];

const components = [
  AddWidgetJacketComponent
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports:[
    components
  ]
})

export class AddWidgetJacketModule { }
