import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileSystemComponent } from './file-system.component';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, TableModule, TooltipModule } from 'primeng';

const routes: Routes = [
  {
    path: 'file-system',
    component: FileSystemComponent,
  },
];

const imports = [CommonModule, ChartModule, TooltipModule, TableModule, ButtonModule];

const components = [FileSystemComponent];

@NgModule({
  declarations: [components],
  imports: [CommonModule, RouterModule.forChild(routes), imports],
  exports: [RouterModule, components],
})
export class FileSystemModule {}
