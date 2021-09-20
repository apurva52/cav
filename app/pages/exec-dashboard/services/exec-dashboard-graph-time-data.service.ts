import { element } from 'protractor';
import { Injectable } from '@angular/core';

// Moment
import * as moment from 'moment';
import * as jQuery from 'jquery';
import 'moment-timezone';

@Injectable()
export class ExecDashboardGraphTimeDataservice {
	private txtStartDate: Date;
//        private txtStartDate: Date = (sessionStorage.getItem('appliedEDStartTime')) ? new Date(moment(sessionStorage.getItem('appliedEDStartTime'), 'DD/MM/YYYY').tz(sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY')) : (this.txtStartDate) ? this.txtStartDate : new Date(moment().tz(sessionStorage.getItem('timeZoneId')).format('MM/DD/YYYY HH:mm:ss'));

	private txtStartTime: string = (sessionStorage.getItem('appliedEDStartTime')) ? sessionStorage.getItem('appliedEDStartTime').split(' ')[1] : '00:00:00';

	private txtEndDate: Date = (sessionStorage.getItem('appliedEDEndTime')) ? new Date(moment(sessionStorage.getItem('appliedEDEndTime'), 'DD/MM/YYYY').tz(sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss')) : new Date(moment().tz(sessionStorage.getItem('_nvtimezone')).format('MM/DD/YYYY HH:mm:ss'));
	private txtEndTime: string = (sessionStorage.getItem('appliedEDEndTime')) ? sessionStorage.getItem('appliedEDEndTime').split(' ')[1] : '23:59:59';

	private chkIncludeDiscontineGraph: boolean = false;
	private appliedTimePeriod: string = (sessionStorage.getItem('appliedEDGraphTime')) ? sessionStorage.getItem('appliedEDGraphTime') : 'Last 1 Hour';
        private previousTime: string = (sessionStorage.getItem('appliedEDGraphTime')) ? sessionStorage.getItem('appliedEDGraphTime') : 'Last 1 Hour';
        /*
	* storing previous actual time in case if current request fails to fetch the data	
        */
	   private gkpiAppliedTimePeriod : string = (sessionStorage.getItem('appliedGKPITime')) ? sessionStorage.getItem('appliedGKPITime') : 'Today';
        private previousActTime: string = (sessionStorage.getItem('appliedEDGraphTime')) ? sessionStorage.getItem('appliedEDGraphTime') : 'Last_60_Minutes';
	constructor() { }

	public get $txtStartDate(): Date {
		return this.txtStartDate;
	}

	public set $txtStartDate(value: Date) {
		this.txtStartDate = value;
	}

	public get $txtEndDate(): Date {
		return this.txtEndDate;
	}

	public set $txtEndDate(value: Date) {
		this.txtEndDate = value;
	}

	public get $chkIncludeDiscontineGraph(): boolean {
		return this.chkIncludeDiscontineGraph;
	}

	public set $chkIncludeDiscontineGraph(value: boolean) {
		this.chkIncludeDiscontineGraph = value;
	}

	public get $txtStartTime(): string {
		return this.txtStartTime;
	}

	public set $txtStartTime(value: string) {
		this.txtStartTime = value;
	}

	public get $txtEndTime(): string {
		return this.txtEndTime;
	}

	public set $txtEndTime(value: string) {
		this.txtEndTime = value;
	}

	public get $appliedTimePeriod(): string {
		return this.appliedTimePeriod;
	}

	public set $appliedTimePeriod(value: string) {
		sessionStorage.setItem('appliedEDGraphTime', value);
		this.appliedTimePeriod = value;
	}

	public get $gkpiAppliedTimePeriod(): string {
		return this.gkpiAppliedTimePeriod;
	}

	public set $gkpiAppliedTimePeriod(value: string) {
		sessionStorage.setItem('appliedGKPITime', value);
		this.gkpiAppliedTimePeriod = value;
	}

	setDefaultValueOfStartTime = function () {
		this.txtStartTime = '00:00:00';
	}

	setDefaultValueOfEndTime = function () {
		this.txtEndTime = '23:59:59';
	}

        public get $previousTime():string{
		 return this.previousTime;	 
	}

	public set $previousTime(value:string){
		this.previousTime = value;
	}
        public get $previousActTime(): string {
                return this.previousActTime;
        }

        public set $previousActTime(value: string) {
                this.previousActTime = value;
        }
}
