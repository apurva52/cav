import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProcessInfoComponent } from './process-info.component';
import { RouterModule, Routes } from '@angular/router';
import { CardModule, SidebarModule, TableModule, TooltipModule } from 'primeng';
import { FormsModule } from '@angular/forms';


const imports = [
  CommonModule,
  TooltipModule,
  SidebarModule,
  TableModule,
  CardModule,
  FormsModule
];

const components = [ProcessInfoComponent];

const routes: Routes = [
  {
    path: 'processInfo',
    component: ProcessInfoComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class ProcessInfoModule { }
