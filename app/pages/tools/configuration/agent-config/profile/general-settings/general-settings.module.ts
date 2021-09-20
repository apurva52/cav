import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GeneralSettingsComponent } from './general-settings.component';
import { BreadcrumbModule, ButtonModule, TabMenuModule, ToolbarModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { FlowpathModule } from './flowpath/flowpath.module';
import { FlowpathComponent } from './flowpath/flowpath.component';
import { RouterModule, Routes } from '@angular/router';
import { HotspotModule } from './hotspot/hotspot.module';
import { HotspotComponent } from './hotspot/hotspot.component';
import { CaptureExceptionModule } from './capture-exception/capture-exception.module';
import { CaptureExceptionComponent } from './capture-exception/capture-exception.component';
import { FlowpathHttpDataModule } from './flowpath-http-data/flowpath-http-data.module';
import { FlowpathHttpDataComponent } from './flowpath-http-data/flowpath-http-data.component';
import { PercentileComponent } from './percentile/percentile.component';
import { CustomDataModule } from './custom-data/custom-data.module';
import { CustomDataComponent } from './custom-data/custom-data.component';
import { InstrumentationProfileComponent } from './instrumentation-profile/instrumentation-profile.component';
import { InstrumentationProfileModule } from './instrumentation-profile/instrumentation-profile.module';
import { OthersComponent } from './others/others.component';
import { OthersModule } from './others/others.module';


const imports = [
  CommonModule,
  ToolbarModule,
  HeaderModule,
  ButtonModule,
  BreadcrumbModule,
  TabMenuModule,
  FlowpathModule,
  HotspotModule,
  CaptureExceptionModule,
  FlowpathHttpDataModule,
  CustomDataModule,
  InstrumentationProfileModule,
  OthersModule
];


const components = [
  GeneralSettingsComponent
];

const routes: Routes = [
  {
    path: 'general-settings',
    component: GeneralSettingsComponent,
    children: [
      {
        path: '',
        redirectTo: 'flowpath',
        pathMatch: 'full',
      },
      {
        path: 'flowpath',
        loadChildren: () => import('./flowpath/flowpath.module').then(m => m.FlowpathModule),
        component: FlowpathComponent
      }, 
      {
        path: 'hotspot',
        loadChildren: () => import('./hotspot/hotspot.module').then(m => m.HotspotModule),
        component: HotspotComponent
      }, 
      {
        path: 'capture-exception',
        loadChildren: () => import('./capture-exception/capture-exception.module').then(m => m.CaptureExceptionModule),
        component: CaptureExceptionComponent
      }, 
      {
        path: 'flowpath-http-data',
        loadChildren: () => import('./flowpath-http-data/flowpath-http-data.module').then(m => m.FlowpathHttpDataModule),
        component: FlowpathHttpDataComponent
      }, 
      {
        path: 'percentile',
        loadChildren: () => import('./percentile/percentile.module').then(m => m.PercentileModule),
        component: PercentileComponent
      },      
      {
        path: 'custom-data',
        loadChildren: () => import('./custom-data/custom-data.module').then(m => m.CustomDataModule),
        component: CustomDataComponent
      }, 
      {
        path: 'instrumentation-profile',
        loadChildren: () => import('./instrumentation-profile/instrumentation-profile.module').then(m => m.InstrumentationProfileModule),
        component: InstrumentationProfileComponent
      }, 
      {
        path: 'others',
        loadChildren: () => import('./others/others.module').then(m => m.OthersModule),
        component: OthersComponent
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
export class GeneralSettingsModule { }
