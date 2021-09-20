import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestRunReportComponent } from './test-run-report.component';
import { SidebarModule, TooltipModule } from 'primeng';
import { RouterModule, Routes } from '@angular/router';


const imports = [
  CommonModule,
  TooltipModule,
  SidebarModule,
];

const components = [TestRunReportComponent];

const routes: Routes = [
  {
    path: 'test-run-report',
    component: TestRunReportComponent,
  },
];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [RouterModule, components],
})
export class TestRunReportModule { }
