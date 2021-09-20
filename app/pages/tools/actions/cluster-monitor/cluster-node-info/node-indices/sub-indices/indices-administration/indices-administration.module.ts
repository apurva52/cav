import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndicesAdministrationComponent } from './indices-administration.component';
import { Routes, RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng';
import { IndicesFlushModule } from '../../../../dialogs/indices-flush/indices-flush.module';
import { IndicesClearCacheModule } from '../../../../dialogs/indices-clear-cache/indices-clear-cache.module';
import { IndicesOptimizeModule } from '../../../../dialogs/indices-optimize/indices-optimize.module';
import { IndicesRefreshModule } from '../../../../dialogs/indices-refresh/indices-refresh.module';

const routes: Routes = [
  {
    path: 'indices-administration',
    component: IndicesAdministrationComponent,
  },
];

const imports = [
  CommonModule,
  ButtonModule,
  IndicesClearCacheModule,
  IndicesFlushModule,
  IndicesOptimizeModule,
  IndicesRefreshModule,
];

const components = [IndicesAdministrationComponent];

@NgModule({
  declarations: [components],
  imports: [RouterModule.forChild(routes), imports],
  exports: [RouterModule],
})
export class IndicesAdministrationModule {}
