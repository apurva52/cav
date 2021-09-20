import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import {DialogModule} from 'primeng/dialog';
import {CardModule} from 'primeng/card';
import { LoaderComponent } from './loader.component';

import { TableModule } from 'primeng/table';


const imports = [
  CommonModule,
  DialogModule,
  CardModule,
  
  TableModule,
  
  
];

const components = [LoaderComponent];

const routes: Routes = [
  {
    path: 'loader',
    component: LoaderComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})

export class LoaderModule { }