import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileNameDetailsComponent } from './profile-name-details.component';
import { RouterModule, Routes } from '@angular/router';
import { ButtonModule, CardModule, InputTextModule, TooltipModule,  } from 'primeng';
import { AppMessageModule } from 'src/app/shared/app-message/app-message.module';
import { FormsModule } from '@angular/forms';

const imports = [
  CommonModule,
  CardModule,
  ButtonModule,
  AppMessageModule,
  TooltipModule,
  FormsModule,
  InputTextModule
]

const routes: Routes = [
  {
    path: 'profile-name-details',
    component: ProfileNameDetailsComponent,
  },
];

const components = [ProfileNameDetailsComponent];

@NgModule({
  declarations: [components],
  imports: [imports, RouterModule.forChild(routes)],
  exports: [components, RouterModule],
})
export class ProfileNameDetailsModule { }
