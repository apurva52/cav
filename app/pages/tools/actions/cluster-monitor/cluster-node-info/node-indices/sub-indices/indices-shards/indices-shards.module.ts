import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicesShardsComponent } from './indices-shards.component';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  TooltipModule,
  TableModule,
  InputTextModule,
  ButtonModule,
  MultiSelectModule,
} from 'primeng';

const routes: Routes = [
  {
    path: 'indices-shards',
    component: IndicesShardsComponent,
  },
];

const imports = [
  CommonModule,
  TooltipModule,
  TableModule,
  InputTextModule,
  ButtonModule,
  MultiSelectModule,
  FormsModule,
];

const components = [IndicesShardsComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class IndicesShardsModule {}
