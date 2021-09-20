import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductPageComponent } from './product-page.component';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { ChartModule, ProgressSpinnerModule,ToolbarModule, ButtonModule, CheckboxModule, InputTextModule, BreadcrumbModule, MenuModule, MessageModule, TableModule, TooltipModule, CardModule, TabMenuModule, CarouselModule } from 'primeng';
import { HeaderModule } from 'src/app/shared/header/header.module';
import { SessionDataModule } from '../sessions-details/session-data/session-data.module';
import { NavigationTimingModule } from './navigation-timing/navigation-timing.module';
import { NavigationTimingComponent } from './navigation-timing/navigation-timing.component';
import { ResourceTimingComponent } from './resource-timing/resource-timing.component';
import { ResourceTimingModule } from './resource-timing/resource-timing.module';
import { CustomMetricsComponent } from './custom-metrics/custom-metrics.component';
import { UserTimingModule } from './user-timing/user-timing.module';
import { UserTimingComponent } from './user-timing/user-timing.component';
import { EventsComponent } from './events/events.component';
import { EventsModule } from './events/events.module';
import { CookiesModule } from './cookies/cookies.module';
import { CookiesComponent } from './cookies/cookies.component';
import { HttpRequestModule } from './http-request/http-request.module';
import { HttpRequestComponent } from './http-request/http-request.component';
import { JsErrorModule } from './js-error/js-error.module';
import { JsErrorComponent } from './js-error/js-error.component';
import { UserActivityModule } from './user-activity/user-activity.module';
import { UserActivityComponent } from './user-activity/user-activity.component';
import { TransactionsModule } from './transactions/transactions.module';
import { TransactionsComponent } from './transactions/transactions.component';
import { UserActionModule } from './user-action/user-action.module';
import { UserActionComponent } from './user-action/user-action.component';
import { PageDumpModule } from './page-dump/page-dump.module';
import { PageDumpComponent } from './page-dump/page-dump.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { PipeModule } from 'src/app/shared/pipes/pipes.module';


const imports = [
  CommonModule,
  ChartModule,
  ClipboardModule,
  ToolbarModule,
  TooltipModule,
  HeaderModule,
  ButtonModule,
  CheckboxModule,
  BreadcrumbModule,
  MenuModule,
  ProgressSpinnerModule,
  FormsModule,
  MessageModule,
  TableModule,
  CardModule,
  TabMenuModule,
  SessionDataModule,
  NavigationTimingModule,
  ResourceTimingModule,
  UserTimingModule,
  EventsModule,
  CookiesModule,
  HttpRequestModule,
  JsErrorModule,
  UserActivityModule,
  TransactionsModule,
  UserActionModule,
  PageDumpModule,
  CarouselModule,
  PipeModule
];

const components = [
  ProductPageComponent
];
const routes: Routes = [
  {
    path: 'product-page',
    redirectTo: 'page-detail'
  },
  {
    path: 'page-detail',
    component: ProductPageComponent,
    children: [
      {
        path: '',
        redirectTo: 'navigation-timing',
        pathMatch: 'full',
      },
      {
        path: 'navigation-timing',
        loadChildren: () => import('./navigation-timing/navigation-timing.module').then(m => m.NavigationTimingModule),
        component: NavigationTimingComponent
      },
      {
        path: 'resource-timing',
        loadChildren: () => import('./resource-timing/resource-timing.module').then(m => m.ResourceTimingModule),
        component: ResourceTimingComponent
      },
      {
        path: 'custom-metrics',
        loadChildren: () => import('./custom-metrics/custom-metrics.module').then(m => m.CustomMetricsModule),
        component: CustomMetricsComponent
      },
      {
        path: 'user-timing',
        loadChildren: () => import('./user-timing/user-timing.module').then(m => m.UserTimingModule),
        component: UserTimingComponent
      },
      {
        path: 'events',
        loadChildren: () => import('./events/events.module').then(m => m.EventsModule),
        component: EventsComponent
      },
      {
        path: 'cookies',
        loadChildren: () => import('./cookies/cookies.module').then(m => m.CookiesModule),
        component: CookiesComponent
      },
      {
        path: 'http-request',
        loadChildren: () => import('./http-request/http-request.module').then(m => m.HttpRequestModule),
        component: HttpRequestComponent
      },
      {
        path: 'js-error',
        loadChildren: () => import('./js-error/js-error.module').then(m => m.JsErrorModule),
        component: JsErrorComponent
      },
      {
        path: 'user-activity',
        loadChildren: () => import('./user-activity/user-activity.module').then(m => m.UserActivityModule),
        component: UserActivityComponent
      },
      {
        path: 'transactions',
        loadChildren: () => import('./transactions/transactions.module').then(m => m.TransactionsModule),
        component: TransactionsComponent
      },
      {
        path: 'user-action',
        loadChildren: () => import('./user-action/user-action.module').then(m => m.UserActionModule),
        component: UserActionComponent
      },
      {
        path: 'page-dump',
        loadChildren: () => import('./page-dump/page-dump.module').then(m => m.PageDumpModule),
        component: PageDumpComponent
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
    RouterModule, components
  ]
})
export class ProductPageModule { }
