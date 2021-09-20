import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GitConfigurationComponent } from './git-configuration.component';
import { ButtonModule, CheckboxModule, DialogModule, DropdownModule, InputTextModule, RadioButtonModule, ToastModule } from 'primeng';
import { FormsModule } from '@angular/forms';
import { ConfirmationDialogModule } from 'src/app/shared/dialogs/confirmation-dialog/confirmation-dialog.module';
import { ConfirmDialogModule} from 'primeng/confirmdialog';
import { InformativeDialogModule } from 'src/app/shared/dialogs/informative-dialog/informative-dialog.module';
import { FileManagerModule } from 'src/app/shared/file-manager/file-manager.module';

const imports = [
  CommonModule,
  ButtonModule,
  DialogModule,
  InputTextModule,
  CheckboxModule,
  DropdownModule,
  FormsModule,
  RadioButtonModule,
  ConfirmationDialogModule,
  ConfirmDialogModule,
  InformativeDialogModule,
  ToastModule,
  FileManagerModule
];

const components = [GitConfigurationComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class GitConfigurationModule {}



