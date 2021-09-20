import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SequenceDiagramComponent } from './sequence-diagram.component';
import { Routes, RouterModule } from '@angular/router';
import { ChartModule } from 'src/app/shared/chart/chart.module';
import { MessageModule } from 'primeng';

const imports = [CommonModule, ChartModule, MessageModule];

const components = [SequenceDiagramComponent];

const routes: Routes = [
  {
    path: 'sequence-diagram',
    component: SequenceDiagramComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})
export class SequenceDiagramModule {}
