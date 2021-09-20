import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopyFavoriteLinkBoxComponent } from './copy-favorite-link-box.component';
import {
  ButtonModule, DialogModule, InputTextModule, DropdownModule, ToastModule
} from 'primeng';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  ButtonModule,
  FormsModule,
  DialogModule,
  InputTextModule,
  DropdownModule,
  ToastModule
];

const components = [
  CopyFavoriteLinkBoxComponent
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
export class CopyFavoriteLinkBoxModule { }
