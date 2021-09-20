import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditWidgetComponent } from './edit-widget.component';
import { FormsModule } from '@angular/forms';
import { SidebarModule, SlideMenuModule, BreadcrumbModule, ButtonModule, CheckboxModule, InputTextModule, DropdownModule, TabViewModule, AccordionModule, MultiSelectModule, ColorPickerModule, RadioButtonModule, CardModule, TableModule, MessageModule, TooltipModule} from 'primeng';
import { ConfirmationDialogModule } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.module';
import { InformativeDialogModule } from 'src/app/shared/dialogs/informative-dialog/informative-dialog.module';

const imports = [
  CommonModule,
  SidebarModule,
  SlideMenuModule,
  BreadcrumbModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule,
  FormsModule,
  TabViewModule,
  AccordionModule,
  MultiSelectModule,
  ColorPickerModule,
  RadioButtonModule,
  CardModule,
  TableModule,
  MessageModule,
  TooltipModule,
  ConfirmationDialogModule,
  InformativeDialogModule
];

const declarations = [EditWidgetComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})
export class EditWidgetModule { }
