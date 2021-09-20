import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomMetricsComponent } from './custom-metrics.component';
import { FormsModule } from '@angular/forms';
import { ConfirmationDialogModule } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.module';
import { InformativeDialogModule } from 'src/app/shared/dialogs/informative-dialog/informative-dialog.module';
import {
  SidebarModule,
  SlideMenuModule,
  BreadcrumbModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule,
  DropdownModule,
  CardModule,
  TreeModule,
  ContextMenuModule,
  TooltipModule,
  ConfirmDialogModule


} from 'primeng';


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
  CardModule,
  TreeModule,
  ContextMenuModule,
  TooltipModule,
  ConfirmationDialogModule,
  InformativeDialogModule,
  ConfirmDialogModule


];

const declarations = [CustomMetricsComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})
export class CustomMetricsModule {}
