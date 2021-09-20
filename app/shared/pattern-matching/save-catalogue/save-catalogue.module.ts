import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SaveCatalogueComponent } from './save-catalogue.component';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule, FieldsetModule, SliderModule, DropdownModule, TabViewModule, PickListModule, RadioButtonModule, TableModule, CardModule } from 'primeng';
import { HeaderModule } from '../../header/header.module';
import { FormsModule } from '@angular/forms';
import { ConfirmDialogModule, ToastModule, MessageModule} from 'primeng';
const components = [
    SaveCatalogueComponent
];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  FieldsetModule,
  SliderModule,
  DropdownModule,
  TabViewModule,
  PickListModule,
  RadioButtonModule,
  TableModule,
  CardModule,
  FormsModule,
  ConfirmDialogModule,
  MessageModule,
  ToastModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})


export class SaveCatalogueModule { }
