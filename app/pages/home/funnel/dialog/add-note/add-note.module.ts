import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddNoteComponent } from './add-note.component';
import { DialogModule, ButtonModule, InputTextModule, DropdownModule } from 'primeng';
import { FormsModule } from '@angular/forms';

const components = [
  AddNoteComponent
];

const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  InputTextModule,
  DropdownModule,
  FormsModule
];

@NgModule({
  declarations: [components],
  imports: [
    imports
  ],
  exports: [components]
})

export class AddNoteModule { }
