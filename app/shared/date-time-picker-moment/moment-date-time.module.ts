/**
 * moment-date-time.module
 */

import { NgModule } from '@angular/core';
import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS } from './moment-date-time-adapter';
import { OWL_MOMENT_DATE_TIME_FORMATS } from './moment-date-time-format';
import { DateTimeAdapter, OWL_DATE_TIME_LOCALE, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';


@NgModule({
    providers: [
        {
            provide: DateTimeAdapter,
            useClass: MomentDateTimeAdapter,
            deps: [OWL_DATE_TIME_LOCALE, OWL_MOMENT_DATE_TIME_ADAPTER_OPTIONS]
        },
    ],
})
export class MomentDateTimeModule {
}

@NgModule({
    imports: [MomentDateTimeModule],
    providers: [{ provide: OWL_DATE_TIME_FORMATS, useValue: OWL_MOMENT_DATE_TIME_FORMATS }],
})
export class OwlMomentDateTimeModule {
}
