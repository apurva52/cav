import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeleteEntryComponent } from './delete-entry.component';
import { DialogModule, ButtonModule, CheckboxModule, InputTextModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';


const components = [
  DeleteEntryComponent
];

const imports = [
  CommonModule,
  DialogModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  InputTextModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})

export class DeleteEntryModule { }
