import { Injectable } from '@angular/core';
import { NumEnUsPipe } from './num-en-us/num-en-us.pipe';
import { NumEnUsDec2Pipe } from './num-en-us-dec-2/num-en-us-dec-2.pipe';
import { CurUsdSymPipe } from './cur-usd-sym/cur-usd-sym.pipe';
import { CurUsdSymDec2Pipe } from './cur-usd-sym-dec-2/cur-usd-sym-dec-2.pipe';
import { PerSymPipe } from './per-sym/per-sym.pipe';
import { PerSymDec2Pipe } from './per-sym-dec-2/per-sym-dec-2.pipe';
import { Lt1Pipe } from './lt-1/lt-1.pipe';
import { Lt0Pipe } from './lt-0/lt-0.pipe';
import { Lt00Pipe } from './lt_0_0/lt-0-0.pipe';
import { NanPipe } from './nan/nan.pipe';
import { Dec1Pipe } from './dec-1/dec-1.pipe';
import { Dec2Pipe } from './dec-2/dec-2.pipe';
import { Dec3Pipe } from './dec-3/dec-3.pipe';
import { FKpiPipe } from './f_kpi/f-kpi.pipe';
import { FormatDateTimePipe } from './dateTime/dateTime.pipe';
import { ServerFormatDateTimePipe } from './dateTime/server-dateTime.pipe';
import { ClientFormatDateTimePipe } from './dateTime/client-dateTime.pipe';
import { SizePipe } from './fileSize/size.pipe';
import { CommaFormatPipe } from './dateTime/comma-format.pipe';

@Injectable({
    providedIn: 'root',
})
export class PipeService {

    constructor(
        private num_en_us: NumEnUsPipe,
        private num_en_us_dec_2: NumEnUsDec2Pipe,
        private cur_usd_sym: CurUsdSymPipe,
        private cur_usd_sym_dec_2: CurUsdSymDec2Pipe,
        private per_sym: PerSymPipe,
        private per_sym_dec_2: PerSymDec2Pipe,
        private lt_1: Lt1Pipe,
        private lt_0: Lt0Pipe,
        private lt_0_0: Lt00Pipe,
        private nan: NanPipe,
        private dec_1: Dec1Pipe,
        private dec_2: Dec2Pipe,
        private dec_3: Dec3Pipe,
        private f_kpi: FKpiPipe,
        private format_date_time: FormatDateTimePipe,
        private server_format_date_time: ServerFormatDateTimePipe,
        private client_format_date_time: ClientFormatDateTimePipe,
        private file_size_pipe : SizePipe,
        private comma_format_pipe: CommaFormatPipe
    ) {

    }

    getFormatter<T>(key: string): T {
        const me = this;
        if (me[key]) {
            return me[key];
        }
        return null;
    }
}