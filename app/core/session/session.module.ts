import { NgModule } from '@angular/core';
import { SessionService } from './session.service';
import { RouterModule } from '@angular/router';


@NgModule({
    providers: [
        SessionService
    ]
})
export class SessionModule {}
