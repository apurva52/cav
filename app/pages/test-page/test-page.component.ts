import { Component, OnInit, PipeTransform } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { NumEnUsPipe } from 'src/app/shared/pipes/num-en-us/num-en-us.pipe';
import { Dec1Pipe } from 'src/app/shared/pipes/dec-1/dec-1.pipe';
import { NumEnUsDec2Pipe } from 'src/app/shared/pipes/num-en-us-dec-2/num-en-us-dec-2.pipe';
import { CurUsdSymPipe } from 'src/app/shared/pipes/cur-usd-sym/cur-usd-sym.pipe';
import { CurUsdSymDec2Pipe } from 'src/app/shared/pipes/cur-usd-sym-dec-2/cur-usd-sym-dec-2.pipe';
import { PerSymPipe } from 'src/app/shared/pipes/per-sym/per-sym.pipe';
import { PerSymDec2Pipe } from 'src/app/shared/pipes/per-sym-dec-2/per-sym-dec-2.pipe';
import { Lt00Pipe } from 'src/app/shared/pipes/lt_0_0/lt-0-0.pipe';
import { Lt0Pipe } from 'src/app/shared/pipes/lt-0/lt-0.pipe';
import { Lt1Pipe } from 'src/app/shared/pipes/lt-1/lt-1.pipe';
import { NanPipe } from 'src/app/shared/pipes/nan/nan.pipe';
import { Dec2Pipe } from 'src/app/shared/pipes/dec-2/dec-2.pipe';
import { Dec3Pipe } from 'src/app/shared/pipes/dec-3/dec-3.pipe';
import { PipeService } from 'src/app/shared/pipes/pipe.service';
import value from '*.json';
import { FKpiPipe } from 'src/app/shared/pipes/f_kpi/f-kpi.pipe';

interface Test1 {
  serial?: number;
  format?: string;
  input?: any;
  generatedOutput?: any;
  output?: any;
}

@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.scss'],
  providers: [
    NumEnUsPipe,
    Dec1Pipe,
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
    FKpiPipe
  ],
})
export class TestPageComponent implements OnInit {
  tests1: Test1[] = [
    {
      serial: 1,
      format: 'f_kpi',
      input: 0.0001,
      output: '<1',
    },{
      serial: 1,
      format: 'num_en_us',
      input: 13511.65169,
      output: '13,512',
    },
    {
      serial: 2,
      format: 'num_en_us',
      input: 135151.1568,
      output: '135,151',
    },
    {
      serial: 3,
      format: 'num_en_us',
      input: 123151.519,
      output: '123,152',
    },
    {
      serial: 4,
      format: 'num_en_us',
      input: -132131.69,
      output: '-132,132',
    },
    {
      serial: 5,
      format: 'num_en_us',
      input: -132.41,
      output: -132,
    },
    {
      serial: 6,
      format: 'num_en_us',
      input: 0.131,
      output: 0,
    },
    {
      serial: 7,
      format: 'num_en_us',
      input: 132135.4,
      output: '132,135',
    },
    {
      serial: 8,
      format: 'num_en_us',
      input: 'abc',
      output: '-',
    },
    {
      serial: 9,
      format: 'num_en_us',
      input: '@',
      output: '-',
    },
    {
      serial: 10,
      format: 'num_en_us_dec_2',
      input: 13511.65169,
      output: '13,511.65',
    },
    {
      serial: 11,
      format: 'num_en_us_dec_2',
      input: 135151.1568,
      output: '135,151.16',
    },
    {
      serial: 12,
      format: 'num_en_us_dec_2',
      input: 123151.519,
      output: '123,151.52',
    },
    {
      serial: 13,
      format: 'num_en_us_dec_2',
      input: -132131.69,
      output: '-132,131.69',
    },
    {
      serial: 14,
      format: 'num_en_us_dec_2',
      input: -132.41,
      output: -132.41,
    },
    {
      serial: 15,
      format: 'num_en_us_dec_2',
      input: 0.131,
      output: 0.13,
    },
    {
      serial: 16,
      format: 'num_en_us_dec_2',
      input: 132135.4,
      output: '132,135.40',
    },
    {
      serial: 17,
      format: 'num_en_us_dec_2',
      input: 'abc',
      output: '-',
    },
    {
      serial: 18,
      format: 'num_en_us_dec_2',
      input: '@',
      output: '-',
    },
    {
      serial: 19,
      format: 'cur_usd_sym',
      input: 13511.65169,
      output: '$13,512',
    },
    {
      serial: 20,
      format: 'cur_usd_sym',
      input: 135151.1568,
      output: '$135,151',
    },
    {
      serial: 21,
      format: 'cur_usd_sym',
      input: 123151.519,
      output: '$123,152',
    },
    {
      serial: 22,
      format: 'cur_usd_sym',
      input: 132131.69,
      output: '$132,132',
    },
    {
      serial: 23,
      format: 'cur_usd_sym',
      input: 13213.41,
      output: '$13,213',
    },
    {
      serial: 24,
      format: 'cur_usd_sym',
      input: 13151.7,
      output: '$13,152',
    },
    {
      serial: 25,
      format: 'cur_usd_sym',
      input: 0.97,
      output: '$1',
    },
    {
      serial: 26,
      format: 'cur_usd_sym',
      input: 'abc',
      output: '$0',
    },
    {
      serial: 27,
      format: 'cur_usd_sym',
      input: '@',
      output: '$0',
    },
    {
      serial: 28,
      format: 'cur_usd_sym',
      input: -10.35,
      output: '$0',
    },
    {
      serial: 29,
      format: 'cur_usd_sym_dec_2',
      input: 13511.65169,
      output: '$13,511.65',
    },
    {
      serial: 30,
      format: 'cur_usd_sym_dec_2',
      input: 135151.1568,
      output: '$135,151.16',
    },
    {
      serial: 31,
      format: 'cur_usd_sym_dec_2',
      input: 123151.519,
      output: '$123,151.52',
    },
    {
      serial: 32,
      format: 'cur_usd_sym_dec_2',
      input: 132131.69,
      output: '$132,131.69',
    },
    {
      serial: 33,
      format: 'cur_usd_sym_dec_2',
      input: 13213.41,
      output: '$13,213.41',
    },
    {
      serial: 34,
      format: 'cur_usd_sym_dec_2',
      input: 13151.7,
      output: '$13,151.70',
    },
    {
      serial: 35,
      format: 'cur_usd_sym_dec_2',
      input: 132135.4,
      output: '$132,135.40',
    },
    {
      serial: 36,
      format: 'cur_usd_sym_dec_2',
      input: 'abc',
      output: '$0.00',
    },
    {
      serial: 37,
      format: 'cur_usd_sym_dec_2',
      input: '@',
      output: '$0.00',
    },
    {
      serial: 38,
      format: 'cur_usd_sym_dec_2',
      input: -10.35,
      output: '$0.00',
    },
    {
      serial: 39,
      format: 'per_sym',
      input: 1324.687,
      output: '1325%',
    },
    {
      serial: 40,
      format: 'per_sym',
      input: 1354.12,
      output: '1354%',
    },
    {
      serial: 41,
      format: 'per_sym',
      input: 1215.9,
      output: '1216%',
    },
    {
      serial: 42,
      format: 'per_sym',
      input: 0,
      output: '0%',
    },
    {
      serial: 43,
      format: 'per_sym',
      input: -105.68,
      output: '-106%',
    },
    {
      serial: 44,
      format: 'per_sym',
      input: -88.9191,
      output: '-89%',
    },
    {
      serial: 45,
      format: 'per_sym',
      input: 132.45,
      output: '132%',
    },
    {
      serial: 46,
      format: 'per_sym',
      input: 100,
      output: '100%',
    },
    {
      serial: 47,
      format: 'per_sym',
      input: 'abc',
      output: '0%',
    },
    {
      serial: 48,
      format: 'per_sym',
      input: '@',
      output: '0%',
    },
    {
      serial: 49,
      format: 'per_sym_dec_2',
      input: 1324.687,
      output: '1324.69%',
    },
    {
      serial: 50,
      format: 'per_sym_dec_2',
      input: 1354.12,
      output: '1354.12%',
    },
    {
      serial: 51,
      format: 'per_sym_dec_2',
      input: 1215.9,
      output: '1215.90%',
    },
    {
      serial: 52,
      format: 'per_sym_dec_2',
      input: 132.45,
      output: '132.45%',
    },
    {
      serial: 53,
      format: 'per_sym_dec_2',
      input: -105.68,
      output: '-105.68%',
    },
    {
      serial: 54,
      format: 'per_sym_dec_2',
      input: -88.9191,
      output: '-88.92%',
    },
    {
      serial: 55,
      format: 'per_sym_dec_2',
      input: 100,
      output: '100.00%',
    },
    {
      serial: 56,
      format: 'per_sym_dec_2',
      input: 'abc',
      output: '0.00%',
    },
    {
      serial: 57,
      format: 'per_sym_dec_2',
      input: '@',
      output: '0.00%',
    },
    {
      serial: 58,
      format: 'lt_1',
      input: 0.7,
      output: '<1',
    },
    {
      serial: 59,
      format: 'lt_1',
      input: 0.9,
      output: '<1',
    },
    {
      serial: 60,
      format: 'lt_1',
      input: 0.5,
      output: '<1',
    },
    {
      serial: 61,
      format: 'lt_1',
      input: 0,
      output: 0,
    },
    {
      serial: 62,
      format: 'lt_1',
      input: -0.5,
      output: '<1',
    },
    {
      serial: 63,
      format: 'lt_1',
      input: -1,
      output: '<1',
    },
    {
      serial: 64,
      format: 'lt_1',
      input: 2,
      output: 2,
    },
    {
      serial: 65,
      format: 'lt_1',
      input: 1.001,
      output: 1,
    },
    {
      serial: 66,
      format: 'lt_1',
      input: 'abc',
      output: '-',
    },
    {
      serial: 67,
      format: 'lt_1',
      input: '@',
      output: '-',
    },
    {
      serial: 68,
      format: 'lt_0',
      input: -1,
      output: '<0',
    },
    {
      serial: 69,
      format: 'lt_0',
      input: -0.5,
      output: '<0',
    },
    {
      serial: 70,
      format: 'lt_0',
      input: -0.9,
      output: '<0',
    },
    {
      serial: 71,
      format: 'lt_0',
      input: -0.1,
      output: '<0',
    },
    {
      serial: 72,
      format: 'lt_0',
      input: -0.555,
      output: '<0',
    },
    {
      serial: 73,
      format: 'lt_0',
      input: -0.009,
      output: '<0',
    },
    {
      serial: 74,
      format: 'lt_0',
      input: 0.1,
      output: 0,
    },
    {
      serial: 75,
      format: 'lt_0',
      input: 1,
      output: 1,
    },
    {
      serial: 76,
      format: 'lt_0',
      input: 'abc',
      output: '-',
    },
    {
      serial: 77,
      format: 'lt_0',
      input: '@',
      output: '-',
    },
    {
      serial: 78,
      format: 'lt_0_0',
      input: -1,
      output: 0,
    },
    {
      serial: 79,
      format: 'lt_0_0',
      input: -0.5,
      output: 0,
    },
    {
      serial: 80,
      format: 'lt_0_0',
      input: -0.9,
      output: 0,
    },
    {
      serial: 81,
      format: 'lt_0_0',
      input: -0.1,
      output: 0,
    },
    {
      serial: 82,
      format: 'lt_0_0',
      input: -0.555,
      output: 0,
    },
    {
      serial: 83,
      format: 'lt_0_0',
      input: 0.1,
      output: 0,
    },
    {
      serial: 84,
      format: 'lt_0_0',
      input: 99,
      output: 99,
    },
    {
      serial: 85,
      format: 'lt_0_0',
      input: 0.009,
      output: 0,
    },
    {
      serial: 86,
      format: 'lt_0_0',
      input: 'abc',
      output: '-',
    },
    {
      serial: 87,
      format: 'lt_0_0',
      input: '@',
      output: '-',
    },
    {
      serial: 88,
      format: 'nan',
      input: -123456789,
      output: '-',
    },
    {
      serial: 89,
      format: 'nan',
      input: 123456789,
      output: 123456789,
    },
    {
      serial: 90,
      format: 'nan',
      input: -1,
      output: -1,
    },
    {
      serial: 91,
      format: 'nan',
      input: 1,
      output: 1,
    },
    {
      serial: 92,
      format: 'nan',
      input: 'abc',
      output: '-',
    },
    {
      serial: 93,
      format: 'nan',
      input: '@',
      output: '-',
    },
    {
      serial: 94,
      format: 'dec_1',
      input: 13511.65169,
      output: 13511.7,
    },
    {
      serial: 95,
      format: 'dec_1',
      input: 135151.1568,
      output: 135151.2,
    },
    {
      serial: 96,
      format: 'dec_1',
      input: 123151.519,
      output: 123151.5,
    },
    {
      serial: 97,
      format: 'dec_1',
      input: -132.69,
      output: -132.7,
    },
    {
      serial: 98,
      format: 'dec_1',
      input: 13213.41,
      output: 13213.4,
    },
    {
      serial: 99,
      format: 'dec_1',
      input: 13151.7,
      output: 13151.7,
    },
    {
      serial: 100,
      format: 'dec_1',
      input: 132135.4,
      output: 132135.4,
    },
    {
      serial: 101,
      format: 'dec_1',
      input: 199,
      output: 199,
    },
    {
      serial: 102,
      format: 'dec_1',
      input: 'abc',
      output: 0,
    },
    {
      serial: 103,
      format: 'dec_1',
      input: '@',
      output: 0,
    },
    {
      serial: 104,
      format: 'dec_2',
      input: 222,
      output: 222,
    },
    {
      serial: 105,
      format: 'dec_2',
      input: 13511.65169,
      output: 13511.65,
    },
    {
      serial: 106,
      format: 'dec_2',
      input: 135151.1568,
      output: 135151.16,
    },
    {
      serial: 107,
      format: 'dec_2',
      input: 123151.519,
      output: 123151.52,
    },
    {
      serial: 108,
      format: 'dec_2',
      input: -132.69,
      output: -132.69,
    },
    {
      serial: 109,
      format: 'dec_2',
      input: 13213.41,
      output: 13213.41,
    },
    {
      serial: 110,
      format: 'dec_2',
      input: 13151.7,
      output: 13151.7,
    },
    {
      serial: 111,
      format: 'dec_2',
      input: 132135.4,
      output: 132135.4,
    },
    {
      serial: 112,
      format: 'dec_2',
      input: 'abc',
      output: 0,
    },
    {
      serial: 113,
      format: 'dec_2',
      input: '@',
      output: 0,
    },
    {
      serial: 114,
      format: 'dec_3',
      input: 13511.65169,
      output: 13511.652,
    },
    {
      serial: 115,
      format: 'dec_3',
      input: 135151.1568,
      output: 135151.157,
    },
    {
      serial: 116,
      format: 'dec_3',
      input: -123.519,
      output: -123.519,
    },
    {
      serial: 117,
      format: 'dec_3',
      input: 132131.69,
      output: 132131.69,
    },
    {
      serial: 118,
      format: 'dec_3',
      input: 13213.41,
      output: 13213.41,
    },
    {
      serial: 119,
      format: 'dec_3',
      input: 13151.7,
      output: 13151.7,
    },
    {
      serial: 120,
      format: 'dec_3',
      input: 132135.4,
      output: 132135.4,
    },
    {
      serial: 121,
      format: 'dec_3',
      input: 1321,
      output: 1321,
    },
    {
      serial: 122,
      format: 'dec_3',
      input: 'abc',
      output: 0,
    },
    {
      serial: 123,
      format: 'dec_3',
      input: '@',
      output: 0,
    },
    {
      serial: 124,
      format: 'f_kpi',
      input: 'abc',
      output: 'abc',
    },
    {
      serial: 125,
      format: 'f_kpi',
      input: '@',
      output: '@',
    },
    {
      serial: 125,
      format: 'f_kpi',
      input: 13511.65169,
      output: '13,512',
    },
    {
      serial: 125,
      format: 'f_kpi',
      input: 135151.1568,
      output: '135,151',
    },
    {
      serial: 125,
      format: 'f_kpi',
      input: 123151.519,
      output: '123,152',
    },
    {
      serial: 125,
      format: 'f_kpi',
      input: -132131.69,
      output: '-',
    },
    {
      serial: 125,
      format: 'f_kpi',
      input: -132.41,
      output: '-',
    },
    {
      serial: 125,
      format: 'f_kpi',
      input: 0.131,
      output: '<1',
    },
    {
      serial: 125,
      format: 'f_kpi',
      input: 0.987,
      output: '<1',
    },
    {
      serial: 125,
      format: 'f_kpi',
      input: 0,
      output: '0',
    },
    {
      serial: 125,
      format: 'f_kpi',
      input: '0',
      output: '0',
    },
    {
      serial: 125,
      format: 'f_kpi',
      input: 132135.4,
      output: '132,135',
    }, 
    {
      serial: 125,
      format: 'f_kpi',
      input: -1,
      output: '-',
    },
    {
      serial: 125,
      format: 'f_kpi',
      input: -123456789,
      output: '-',
    }, 
    {
      serial: 125,
      format: 'f_kpi',
      input: '<0',
      output: '-',
    },
    {
      serial: 125,
      format: 'f_kpi',
      input: '',
      output: '-',
    },
    {
      serial: 125,
      format: 'f_kpi',
      input: null,
      output: '-',
    },  
  ];

  constructor(private pipeService: PipeService) {}

  ngOnInit(): void {
    for (const t of this.tests1) {
      const formatter: PipeTransform = this.pipeService.getFormatter(t.format);
      if (formatter) {
        t.generatedOutput = formatter.transform(t.input);
      }
    }
  }
}
