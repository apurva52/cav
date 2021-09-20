import { EllipsisPipe } from './ellipsis/ellipsis.pipe';
import { FormatDatePipe } from './date/date.pipe';
import { NgModule, PipeTransform, Type } from '@angular/core';
import { FormatDateTimePipe } from './dateTime/dateTime.pipe';
import { NumEnUsPipe } from './num-en-us/num-en-us.pipe';
import { Dec1Pipe } from './dec-1/dec-1.pipe';
import { NumEnUsDec2Pipe } from './num-en-us-dec-2/num-en-us-dec-2.pipe';
import { CurUsdSymPipe } from './cur-usd-sym/cur-usd-sym.pipe';
import { CurUsdSymDec2Pipe } from './cur-usd-sym-dec-2/cur-usd-sym-dec-2.pipe';
import { PerSymPipe } from './per-sym/per-sym.pipe';
import { PerSymDec2Pipe } from './per-sym-dec-2/per-sym-dec-2.pipe';
import { Lt00Pipe } from './lt_0_0/lt-0-0.pipe';
import { Lt0Pipe } from './lt-0/lt-0.pipe';
import { Lt1Pipe } from './lt-1/lt-1.pipe';
import { NanPipe } from './nan/nan.pipe';
import { Dec2Pipe } from './dec-2/dec-2.pipe';
import { Dec3Pipe } from './dec-3/dec-3.pipe';
import { PipeService } from './pipe.service';
import { FKpiPipe } from './f_kpi/f-kpi.pipe';
import { DdrPipe } from './ddr-pipes/ddr.pipe'
import { FilterPipe } from './filter/filter.pipe';
import { ServerFormatDateTimePipe } from './dateTime/server-dateTime.pipe';
import { ClientFormatDateTimePipe } from './dateTime/client-dateTime.pipe';
import { Lt1Gt0Is0Pipe } from './lt_1_gt_0_0/lt-1-gt-0-0.pipe';
import { SizePipe } from './fileSize/size.pipe';
import { AlertTimeAgo } from './dateTime/alert/alert-timeAgo.pipe';
import { AlertSeverityColor } from './dateTime/alert/alert-severity-color.pipe';
import { CommaFormatPipe } from './dateTime/comma-format.pipe';
import { ActionType } from './dateTime/alert/actionType.pipe';
import { DBMonitoringPipe } from './db-monitoring-pipes/db-monitoring.pipe';
import { ActionStyle } from './dateTime/alert/action-style.pipe';
import { FormatUTCTimePipe } from './dateTime/UTCTime.pipe';

const pipes = [
    FormatDatePipe,
    FormatDateTimePipe,
    FormatUTCTimePipe,
    EllipsisPipe,
    Lt1Gt0Is0Pipe,
    NumEnUsPipe,
    NumEnUsDec2Pipe,
    CurUsdSymPipe,
    CurUsdSymDec2Pipe,
    PerSymPipe,
    PerSymDec2Pipe,
    Lt00Pipe,
    Lt0Pipe,
    Lt1Pipe,
    NanPipe,
    Dec2Pipe,
    Dec3Pipe,
    Dec1Pipe,
    FKpiPipe,
    DdrPipe,
    FilterPipe,
    ServerFormatDateTimePipe,
    ClientFormatDateTimePipe,
    AlertTimeAgo,
    AlertSeverityColor,
    SizePipe,
    CommaFormatPipe,
    ActionType,
    ActionStyle,
    DBMonitoringPipe
];

@NgModule({
    declarations: pipes,
    providers: pipes,
    exports: pipes
})
export class PipeModule {

}
