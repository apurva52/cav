import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrePostLogComponent } from './pre-post-log.component';
import { ButtonModule, CardModule, DialogModule } from 'primeng';
import { FormsModule } from '@angular/forms';


const components = [
  PrePostLogComponent
];

const imports = [
  CommonModule,
  DialogModule,
  ButtonModule,
  FormsModule,
  CardModule,
];

const declarations = [PrePostLogComponent];

@NgModule({
  declarations: [declarations],
  imports: [imports],
  exports: [declarations],
})
export class PrePostLogModule { }
