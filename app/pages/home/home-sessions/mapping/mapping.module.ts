import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MappingComponent } from './mapping.component';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { BreadcrumbModule, ButtonModule, TabMenuModule, ToolbarModule } from 'primeng';
import { ClickMapComponent } from './click-map/click-map.component';
import { NavigationMapComponent } from './navigation-map/navigation-map.component';
import { ScrollMapComponent } from './scroll-map/scroll-map.component';
import { HeatMapComponent } from './heat-map/heat-map.component';
import { AttentionMapComponent } from './attention-map/attention-map.component';
import { RouterModule, Routes } from '@angular/router';

const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule
];


const components = [
  MappingComponent
];

const routes: Routes = [
  {
    path: 'mapping',
    component: MappingComponent,
    children: [
      {
        path: '',
        redirectTo: 'click-map',
        pathMatch: 'full',
      },
      {
        path: 'click-map',
        loadChildren: () => import('./click-map/click-map.module').then(m => m.ClickMapModule),
        component: ClickMapComponent
      },
      {
        path: 'navigation-map',
        loadChildren: () => import('./navigation-map/navigation-map.module').then(m => m.NavigationMapModule),
        component: NavigationMapComponent
      },
      {
        path: 'scroll-map',
        loadChildren: () => import('./scroll-map/scroll-map.module').then(m => m.ScrollMapModule),
        component: ScrollMapComponent
      },
      {
        path: 'heat-map',
        loadChildren: () => import('./heat-map/heat-map.module').then(m => m.HeatMapModule),
        component: HeatMapComponent
      },
      {
        path: 'attention-map',
        loadChildren: () => import('./attention-map/attention-map.module').then(m => m.AttentionMapModule),
        component: AttentionMapComponent
      },
    ]
  }
];


@NgModule({
  declarations: [components],
  imports: [
    imports,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class MappingModule { }
