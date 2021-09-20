import { Component, ElementRef, OnInit, ViewChild } from '@angular/core'
import { ExecDashboardConfigService } from '../../services/exec-dashboard-config.service'
import { ExecDashboardCommonRequestHandler } from '../../services/exec-dashboard-common-request-handler.service'
import { TierStatusDataHandlerService } from '../exec-dashboard-tier-status/services/tier-status-data-handler.service';
import { ExecDashboardCommonKPIDataservice } from '../../services/exec-dashboard-common-kpi-data.service'
import { Dropdown, SelectItem } from 'primeng'
import { ExecDashboardUtil } from '../../utils/exec-dashboard-util'
import { EVENT_DAYS } from '../../constants/exec-dashboard-graphTime-const'
import { ExecDashboardGraphTimeDataservice } from '../../services/exec-dashboard-graph-time-data.service';
import { ExecDashboardGraphicalKpiService } from '../../services/exec-dashboard-graphical-kpi.service';
import * as moment from 'moment';
import 'moment-timezone';
import { CavConfigService } from 'src/app/pages/tools/configuration/nd-config/services/cav-config.service';
interface CustomSelectItem {
    label?: string
    value: any
    custom?: boolean
    dateEditable?: boolean
    styleClass?: string
    icon?: string
    title?: string
    disabled?: boolean
}
@Component({
    selector: 'app-exec-dashboard-time-period',
    templateUrl: './exec-dashboard-time-period.component.html',
    styleUrls: ['./exec-dashboard-time-period.component.css']
})
export class ExecutiveDashboardTimePeriod implements OnInit {
    _dialogVisibility: boolean = false
    _timePeriodList: CustomSelectItem[]
    _yearList: SelectItem[] = []
    _eventDaysList: SelectItem[] = []
    _maxDate: Date = new Date()
    _minDate: Date = new Date("2014")
    _maxYear: number = new Date().getFullYear()
    _showMonthsYears: boolean = true;
    _yearRange: string = ""
    _startTime: Date
    _endTime: Date
    _serverDateTime: string = ""
    _appliedTimePeriod: string = ""
    _selectedEventDay: string = ""
    _selectedEventDayYear: string = ""
    _discGraphChecked: boolean = sessionStorage.appliedEDDiscGraph == "true"
    _timePeriodChangedFromBack: boolean = false
    _selectedTimePeriod: any
    @ViewChild('timePeriod', { read: Dropdown, static: true })
    _timePeriod: Dropdown;
    // private _timePeriod: any
    // @ViewChild('timePeriod', { static: false }) set progressStatusRef(progressStatus: ElementRef<HTMLElement>) {
    //     this._timePeriod = progressStatus.nativeElement;
    //   }
    @ViewChild('eventDay') _eventDay: any
    @ViewChild('eventYear') _eventYear: any
    @ViewChild('startCal') _startCal: any
    @ViewChild('endCal') _endCal: any
    @ViewChild('discontGraph') _discontGraph: any
    constructor(private _config: ExecDashboardConfigService,
        private execDashboardKpiDataService: ExecDashboardCommonKPIDataservice,
        private _requestHandler: ExecDashboardCommonRequestHandler,
        private _graphicalKpiService: ExecDashboardGraphicalKpiService,
        private _cavConfig: CavConfigService,
        private _graphTime: ExecDashboardGraphTimeDataservice,
        private _tierStatusDataHandlerService: TierStatusDataHandlerService) { }
    ngOnInit() {
        this.assignServerDateTime();
        this._timePeriodList = this.getTimePeriodOnBasisOfEnv()
        for (let _Y = new Date().getFullYear(); _Y >= 2016; _Y--) {
            this._yearList.push({ label: _Y.toString(), value: _Y })
        }
        this._maxDate = new Date()
        Object.values(EVENT_DAYS).forEach(element => this._eventDaysList.push({ label: element, value: element }))
        this._yearRange = this._minDate.getFullYear() + ":" + this._maxDate.getFullYear()
        let _ = sessionStorage.getItem('appliedEDGraphTime')
        if (_) {
            // this._timePeriod.value = this._graphTime.$appliedTimePeriod
            this._timePeriod.value = "Last_60_Minutes"
            this._appliedTimePeriod = this._cavConfig.$eDParam.graphKeyLabel?this._cavConfig.$eDParam.graphKeyLabel:this._timePeriodList.filter(element => element.value == _)[0].label
        }else {
            this._graphTime.$appliedTimePeriod = "Last_60_Minutes"
            this._timePeriod.value = "Last_60_Minutes"
            this._appliedTimePeriod = this._cavConfig.$eDParam.graphKeyLabel?this._cavConfig.$eDParam.graphKeyLabel:"Last 1 Hour" 
        }
        
    }
    /**
   * This is responsible for getting different options in Cont/Non Cont Env for Time period
   * 
   */
    getTimePeriodOnBasisOfEnv() {
        try {
            let _A = [
                { label: "Today", value: "last_day", custom: false },
                { label: "Event Day", value: "Event Day", custom: true, dateEditable: false },
                { label: "Last 10 Minutes", value: "Last_10_Minutes", custom: false, removeOnKPI: true },
                { label: "Last 30 Minutes", value: "Last_30_Minutes", custom: false, removeOnKPI: true },
                { label: "Last 1 Hour", value: "Last_60_Minutes", custom: false },
                { label: "Last 2 Hours", value: "Last_120_Minutes", custom: false },
                { label: "Last 4 Hours", value: "Last_240_Minutes", custom: false },
                { label: "Last 6 Hours", value: "Last_360_Minutes", custom: false },
                { label: "Last 8 Hours", value: "Last_480_Minutes", custom: false },
                { label: "Last 12 Hours", value: "Last_720_Minutes", custom: false },
                { label: "Last 24 Hours", value: "Last_1440_Minutes", custom: false },
                { label: "Yesterday", value: "yesterday", custom: true, dateEditable: false },
                { label: "Last Week Same Day", value: "Last Week Same Day", custom: true, dateEditable: false },
                { label: "Custom Date", value: "Custom Date", custom: true, dateEditable: true }
            ]
            // If KPI is opened, remove Last 1 and 30 min from graph time options
            if (window.location.href.substring(window.location.href.lastIndexOf('/') + 1, window.location.href.length) === 'kpi') {
                _A.forEach((element, index) => {
                    if (element.removeOnKPI) {
                        _A.splice(index, 1)
                    }
                })
            }
            if (this._config.$serverChk !== 'ND') {
                _A.splice(_A.length, 0, { label: "By Phase", value: "By Phase", custom: true, dateEditable: true }, { label: "Total Test Run", value: "WholeScenario", custom: true, dateEditable: true })
            }
            return _A
        } catch (error) {
            console.error(error)
        }
    }
    initializeDateTime() {
        try{
            //let _t = sessionStorage.EDappliedTimePeriodKey;
            let _t = sessionStorage.appliedEDGraphTime;
            if ( sessionStorage.appliedEDGraphTimeLabel != undefined && sessionStorage.appliedEDGraphTimeLabel.toLocaleLowerCase() == "yesterday") {
            _t = "yesterday";
            }
                else if(_t != undefined && _t.includes("SPECIFIED_TIME")) {
              _t = "Custom Date"
            }
            this._timePeriod.selectedOption = _t?this._timePeriodList.filter(element => element.value == _t)[0]:this._timePeriodList[0]; 
            if (this._timePeriod.selectedOption && this._timePeriod.selectedOption.custom) {
               let  _ = sessionStorage.getItem('appliedEDEventDay')
                let _a = _.split(" ")
                if (_ && _ != "undefined" && _a.length) {
                    this._selectedEventDayYear = this._yearList.filter(element => element.value == _a[_a.length-1])[0].value
                    _a.splice(_a.length-1,1)
                    const _d = _a.join(" ")
                    this._selectedEventDay = this._eventDaysList.filter(element => element.value == _d)[0].value
                    this._timePeriod.selectedOption = this._timePeriodList.filter(element => element.value == "Event Day")[0];
                }
            }
            this._startTime = sessionStorage.getItem("appliedEDStartTime") && new Date(sessionStorage.appliedEDStartTime).toString() != "Invalid Date"?new Date(sessionStorage.getItem("appliedEDStartTime")):(new Date(this._startTime).toString() == "Invalid Date"?new Date():this._startTime);
            this._endTime = sessionStorage.getItem("appliedEDEndTime") && new Date(sessionStorage.appliedEDEndTime).toString() != "Invalid Date"?new Date(sessionStorage.getItem("appliedEDEndTime")):(new Date(this._endTime).toString() == "Invalid Date"?new Date():this._endTime);
            console.log("start time: "+this._startTime+":  end time: "+this._endTime);
            this._discGraphChecked = this._config.$isIncDisGraph
            this._selectedTimePeriod = this._timePeriod.selectedOption && this._timePeriod.selectedOption.value ? this._timePeriod.selectedOption.value:"Last_60_Minutes";
            this._timePeriodChangedFromBack = true
            // this.changeTimePeriod(this._timePeriod.selectedOption.value, this._startTime?this._startTime.toISOString():"")
            this._timePeriodChangedFromBack = false
        }catch(err) {
            console.error(err)
        }
    }
    /**
   * Generate Select Item
   */
    generateSelectItems(list) {
        try {
            return ExecDashboardUtil.createSelectItem(list)
        } catch (err) {
            console.error(err)
        }
    }
    changeTimePeriod(selectedTimePeriod: string, date?: string) {
        const _ = this._timePeriodList.map(element => element.value).indexOf(selectedTimePeriod)
        if (_ != -1) {
            if (date) {
                this.changeStartEndDateTime(_, date)
            } else {
                this.changeStartEndDateTime(_)
            }
        }
    }
    getMinMaxDateRange(dateEditable: boolean, minOrMax?: string, yearRange?: boolean): any {
        if (yearRange) {
            let tmp = this.getMinMaxDateRange(dateEditable, 'min').getFullYear() + ":" +
                this.getMinMaxDateRange(dateEditable, 'max').getFullYear()
            return tmp
        }
        if (dateEditable) {
            if (minOrMax == 'max') {
                return new Date()
            } else {
                return new Date(Math.min.apply(null, this._yearList) + " ")
            }
        } else {
            if (minOrMax == 'max') {
                return this._maxDate
            } else {
                return new Date(this._maxDate.getFullYear() + " ")
            }
        }
    }
    show(data) {
        console.log('calender data-->', data)
    }
    changeStartEndDateTime(index: number, date?: string): void {
        date = date?date:this._serverDateTime
        if (this._timePeriodList[index].custom) {
            if (this._timePeriodList[index].dateEditable) {
                if (date.length == 0) {
                    this._maxDate = new Date()
                } else {
                    this._maxDate = new Date(date)
                }
                const _  = this._maxDate
                if (!this._timePeriodChangedFromBack) {
                    this._startTime = new Date(_.setHours(0, 0, 0, 0))
                    this._endTime = this._maxDate
                }
                this.setMinMaxDateTime(true)
            } else {
                switch (this._timePeriodList[index].value) {
                    case "Event Day": {
                        this.eventDateHandler()
                        break
                    }
                    case "yesterday": {
                        if (!this._timePeriodChangedFromBack) {
                            this._startTime = new Date(new Date(date).setHours(-23, -59, -60))
                            this._endTime = new Date(new Date(date).setHours(-1, 59, 59, 59))
                        }
                        this.setMinMaxDateTime()
                        break
                    }
                    case "Last Week Same Day": {
                        if (!this._timePeriodChangedFromBack) {
                            this._startTime = new Date(new Date(date).setHours(-7 * 23 - 6, -59, -60))
                            this._endTime = new Date(new Date(date).setHours(-7 * 24 + 23, 59, 59))
                        }
                        this.setMinMaxDateTime()
                        break
                    }
                    default: { break }
                }
            }
        }
    }
    eventDateHandler(eventDay?: string, eventYear?: string): void {
        let _: string = ""
        if (eventDay == "" || eventYear == "" || !eventDay || !eventYear) {
            _ = "eventDay=Black Friday&eventYear=" + new Date(this._serverDateTime).getFullYear()
        } else {
            _ = "eventDay=" + eventDay + "&eventYear=" + eventYear
        }
        if (eventDay == "Christmas Day") {
            this._startTime = new Date("12/25/" + eventYear)
            this._endTime = new Date(new Date("12/25/" + eventYear).setHours(23, 59, 59, 59))
            this.setMinMaxDateTime()
        } else if (eventDay == "New Years Day") {
            this._startTime = new Date("01/01/" + eventYear)
            this._endTime = new Date(new Date("01/01/" + eventYear).setHours(23, 59, 59, 59))
            this.setMinMaxDateTime()
        } else {
            let nodeServerInfo = this._tierStatusDataHandlerService.getNodePresetURL();
            let host = nodeServerInfo.hostOrigin + this._tierStatusDataHandlerService.getPresetURLIfExists(nodeServerInfo);
            this._requestHandler.getDataFromGetTextRequest(
                host + "DashboardServer/RestService/KPIWebService/eventDate?" + encodeURI(_),
                data => {
                    if (data.toString().startsWith("\"")) {
                        data = data.toString().trim().slice(1,-1);
                    }
                    this._startTime = new Date(data)
                    this._endTime = new Date(new Date(data).setHours(23, 59, 59, 59))
                    this.setMinMaxDateTime()
                }
            )
        }
    }
    setMinMaxDateTime(showOtherMonths?: boolean) {
        if (showOtherMonths) {
            this._minDate = null
            // this._maxDate = this._endTime
            this._showMonthsYears = true
        } else {
            this._minDate = this._startTime
            this._maxDate = this._endTime
            this._showMonthsYears = false
        }
    }
    onDateClose(calType: string, calObj: any) {
        if (calType == 'start') {
            if (calObj.inputFieldValue == null || calObj.inputFieldValue == ""
                || new Date(calObj.inputFieldValue).toDateString() == "Invalid Date"
                || new Date(calObj.inputFieldValue) < this._minDate) {
                this._startTime = this._minDate
            }
        } else {
            if (calObj.inputFieldValue == null || calObj.inputFieldValue == ""
                || new Date(calObj.inputFieldValue).toDateString() == "Invalid Date"
                || new Date(calObj.inputFieldValue) > this._maxDate) {
                this._endTime = this._maxDate
            }
        }
    }
    resetFields(timePeriod: any) {
        if (!sessionStorage.getItem('appliedEDGraphTime')) {
            this._timePeriod.selectedOption = this._timePeriodList.filter(element => element.value == "Last_60_Minutes")[0]
        }
    }
    applyTimePeriod(timePeriod?: string, eventDay?: string, eventYear?: string, startDate?: string, endDate?: string, discontGraph?: boolean) {
        try {
            timePeriod = this._timePeriod.selectedOption.value
            eventDay = this._eventDay?this._eventDay.selectedOption.value:""
            eventYear = this._eventYear?this._eventYear.selectedOption.value:""
            startDate = this._startCal?this._startCal.inputFieldValue:""
            endDate = this._endCal?this._endCal.inputFieldValue:""
            discontGraph = this._discontGraph?this._discontGraph.checked:false
            const selectedTimePeriod: CustomSelectItem = this._timePeriodList.filter(element => element.value == timePeriod)[0]
            sessionStorage.EDappliedTimePeriodKey = selectedTimePeriod.value
            if (selectedTimePeriod.custom) {
                if (new Date(startDate).toDateString() == "Invalid Date") {
                    this._config.showAlert("Start Date-time is not valid!" + startDate)
                    return
                }
                if (new Date(endDate).toDateString() == "Invalid Date") {
                    this._config.showAlert("End Date-time is not valid!")
                    return
                }
                if (new Date(startDate) > new Date(endDate)) {
                    this._config.showAlert("Start Date-time is greater than End Date-time!")
                    return
                }
                if (this._serverDateTime && new Date(startDate) > new Date(this._serverDateTime)) {
                    this._config.showAlert("Start Date-time is greater than System time!")
                    return
                }
                switch (selectedTimePeriod.value) {
                    case "Event Day":
                        this._config.$appliedEventDay = `${eventDay} ${eventYear}`
                        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (${eventDay} ${startDate} To ${endDate})`
                        sessionStorage.appliedEDGraphTimeLabel = eventDay + " " + startDate + " To " + endDate
                        break
                    case "By Phase":
                        this._config.$appliedEventDay = "ALL"
                        break
                    case "Last Week Same Day":
                        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (${selectedTimePeriod.value} ${startDate} To ${endDate})`
                        sessionStorage.appliedEDGraphTimeLabel = "Last Week Same Day " + startDate + " To " + endDate
                        break
                    case "Custom Date":
                        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (${startDate} To ${endDate})`
                        sessionStorage.appliedEDGraphTimeLabel = "Custom Date " + startDate + " To " + endDate
                        break
                    case "yesterday":
                        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ` (Yesterday)`
                        sessionStorage.appliedEDGraphTimeLabel = "Yesterday " + startDate + " To " + endDate
                        break
                    default:
                        this._config.$appliedStartTime = ''
                        this._config.$appliedEndTime = ''
                        this._config.$appliedEventDay = ''
                        this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ``
                        sessionStorage.appliedEDGraphTimeLabel = "Last 1 Hour"
                }
                this._config.$appliedStartTime = startDate
                this._config.$appliedEndTime = endDate
                this._config.$isIncDisGraph = discontGraph
                if (selectedTimePeriod.value == "last_day" || selectedTimePeriod.value == "yesterday") {
                    if (selectedTimePeriod.value == "yesterday") {
                        let date = this._serverDateTime
                        if (new Date(new Date(date).setHours(-23, -59, -60)).getTime() == this._startTime.getTime() || new Date(new Date(date).setHours(-1, 59, 59, 59)).getTime() == this._endTime.getTime()) {
                            this._config.$actTimePeriod = "yesterday"
                        } else {
                            //this._config.$actTimePeriod = "SPECIFIED_TIME_" + new Date(startDate).getTime().toString() + "_" +  new Date(endDate).getTime().toString()
           let tempStartTimeStamp = moment.tz(startDate, "M/D/YYYY H:mm", sessionStorage.getItem('timeZoneId')).utcOffset(0).valueOf(); 
           let tempEndTimeStamp = moment.tz(endDate, "M/D/YYYY H:mm", sessionStorage.getItem('timeZoneId')).utcOffset(0).valueOf();
           this._config.$actTimePeriod = "SPECIFIED_TIME_" + new Date(tempStartTimeStamp).getTime().toString() + "_" +  new Date(tempEndTimeStamp).getTime().toString()
                        }
                    } else {
                        this._config.$actTimePeriod = "last_day"
                    }
                } else {
                   // this._config.$actTimePeriod = "SPECIFIED_TIME_" + new Date(startDate).getTime().toString() + "_" +  new Date(endDate).getTime().toString()
           let tempStartTimeStamp = moment.tz(startDate, "M/D/YYYY H:mm", sessionStorage.getItem('timeZoneId')).utcOffset(0).valueOf();
           let tempEndTimeStamp = moment.tz(endDate, "M/D/YYYY H:mm", sessionStorage.getItem('timeZoneId')).utcOffset(0).valueOf();
           this._config.$actTimePeriod = "SPECIFIED_TIME_" + new Date(tempStartTimeStamp).getTime().toString() + "_" +  new Date(tempEndTimeStamp).getTime().toString()
                }
                this._graphTime.$appliedTimePeriod = this._config.$actTimePeriod
                this._config.$appliedTimePeriodStr = this._config.$actTimePeriod
            } else {
                this._config.$appliedStartTime = ''
                this._config.$appliedEndTime = ''
                this._config.$appliedEventDay = ''
                this.execDashboardKpiDataService.$appliedTimePeriodLabelForOrderRev = ''
                sessionStorage.setItem('appliedEDStartTime', '')
                sessionStorage.setItem('appliedEDEndTime', '')
                sessionStorage.setItem('appliedEDEventDay', '')
                sessionStorage.appliedEDGraphTimeLabel = selectedTimePeriod.label
                this._config.$actTimePeriod = selectedTimePeriod.value
                this._graphTime.$appliedTimePeriod = selectedTimePeriod.value
                this._config.$appliedTimePeriodStr = selectedTimePeriod.value
            }
            sessionStorage.setItem('appliedEDGraphTime',this._config.$actTimePeriod)
	    this._appliedTimePeriod = this._timePeriod.selectedOption.custom?this._timePeriod.selectedOption.label + " " + startDate + " To " + endDate:this._timePeriod.selectedOption.label
	    this._cavConfig.$eDParam = {
                graphKey: this._config.$actTimePeriod,
                graphKeyLabel: this._appliedTimePeriod,
                startTime: startDate,
                endTime: endDate,
                eventDay: this._config.$appliedEventDay,
                isDiscontGraph: discontGraph
            };
            if (window.location.href.indexOf('graphicalKpi') != -1) {
                this._cavConfig.$edGKPIQueryParam = { 'graphKey': this._config.$actTimePeriod, 'graphTimeLabel': selectedTimePeriod.value }
                this.execDashboardKpiDataService.$blockUI = true
                this._graphicalKpiService.getGKPIData();
            } else if (window.location.href.indexOf('main/kpi') != -1) {
                this._cavConfig.$edKPIQueryParam = { 'graphKey': this._config.$actTimePeriod, 'graphTimeLabel': selectedTimePeriod.value }
                this.execDashboardKpiDataService.getKPIDataFromServer(this.execDashboardKpiDataService.$dcList, true)
            } else if (window.location.href.indexOf('/main/storeView') != -1 || window.location.href.indexOf('/main/tierStatus') != -1) {
                let obj = {
                    'graphKey': this._config.$actTimePeriod,
                    'graphTimeLabel': selectedTimePeriod.label,
                    'appliedTimePeriod': selectedTimePeriod.value,
                    'startTime': startDate,
                    'endTime': endDate,
                    'prevTimePeriod': selectedTimePeriod.value,
                    'isIncDisGraph': discontGraph,
                    'appliedEventDay': this._config.$appliedEventDay,
                    'appliedTimePeriodStr': this._config.$appliedTimePeriodStr,
                    'msg': 'TIMEPERIOD_CHANGED'
                }
                if (window.location.href.indexOf('/main/tierStatus') != -1) {
                    this._tierStatusDataHandlerService.getTSData(obj)
                } else {
                    this._graphicalKpiService.getStoreData(obj)
                }
            }
            this._dialogVisibility = false
        } catch (error) {
            console.error('Error applying timeperiod', error)
        }
    }
    assignServerDateTime() {
        try {
            let serverDate = new Date();
            let date = serverDate.toLocaleDateString('en-US'); // create a formatted date like "mm/dd/yyyy"
            let hours = serverDate.getHours();
            let minutes = serverDate.getMinutes();
            let seconds = serverDate.getSeconds();
            this._serverDateTime = `${date} ${hours}:${minutes}:${seconds}`; // update server's date-time
                    this._config.$appliedStartTime = sessionStorage.getItem('appliedEDStartTime') != undefined && !sessionStorage.getItem('appliedEDStartTime').includes("undefined")?sessionStorage.getItem('appliedEDStartTime'):new Date(new Date(this._serverDateTime).getTime() - (1000*60*60)).toLocaleDateString('en-US') + " " + new Date(new Date(this._serverDateTime).getTime() - (1000*60*60)).toTimeString().split(" ")[0]; // assign start time to default if not available in session storage
                    this._config.$appliedEndTime = sessionStorage.getItem('appliedEDEndTime') != undefined && !sessionStorage.getItem('appliedEDEndTime').includes("undefined")?sessionStorage.getItem('appliedEDEndTime'):this._serverDateTime; // assign end time to default if not available in session storage
                    this._config.$appliedEventDay = sessionStorage.getItem('appliedEDEventDay') != undefined && !sessionStorage.getItem('appliedEDEventDay').includes("undefined")?sessionStorage.getItem('appliedEDEventDay'):""
            this.updateSystemTime(); // start server date-time syncing
        } catch(e) {
            console.error("error in assignServerDateTime ", e)
        }
    }

    private systemTimeInterval = null; // stores process id of system date-time sync process
    private isServerDateAssigned = false; // stores server date fetched from server
    /**
     * Syncs current time with server's date-time
     */
    updateSystemTime() {
        let timeInterval = 5000; // time interval to update server date-time
        this.systemTimeInterval = setInterval(()=> {
            let serverDateString = this._tierStatusDataHandlerService.$serverDateTime; // get server's date-time
            if (this.isServerDateAssigned) {
                serverDateString = this._serverDateTime; // restore server's date-time
            }
            let serverDate = new Date(serverDateString); // create new date instace with server's date-time
            if (serverDate.toString() != "Invalid Date") { // check if valid date
                if (!this.isServerDateAssigned) {
                    this.isServerDateAssigned = true;
                }
                serverDate = new Date(serverDate.getTime() + timeInterval); // increment the server's date-time with the interval provided
                let date = serverDate.toLocaleDateString('en-US'); // create a formatted date like "mm/dd/yyyy"
                let hours = serverDate.getHours();
                let minutes = serverDate.getMinutes();
                let seconds = serverDate.getSeconds();
                this._serverDateTime = `${date} ${hours}:${minutes}:${seconds}`; // update server's date-time
            }
        }, timeInterval);
    }

    ngOnDestroy(): void {
        clearInterval(this.systemTimeInterval); // clear server date-time updation
    }
}

