import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateIndicesComponent } from './create-indices.component';
import { DialogModule, ButtonModule, InputTextModule } from 'primeng';

const imports = [CommonModule, DialogModule, ButtonModule, InputTextModule];

const components = [CreateIndicesComponent];

@NgModule({
  declarations: [components],
  imports: [imports],
  exports: [components],
})
export class CreateIndicesModule {}
