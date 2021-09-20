import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicesAliasesComponent } from './indices-aliases.component';
import { Routes, RouterModule } from '@angular/router';
import { PanelModule, TooltipModule, TableModule } from 'primeng';


const routes: Routes = [
  {
    path: 'indices-aliases',
    component: IndicesAliasesComponent,
  },
];

const imports = [
  CommonModule,
  PanelModule,
  TooltipModule,
  TableModule,
];

const components = [IndicesAliasesComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class IndicesAliasesModule { }
