import { Component, OnInit, ViewEncapsulation, Input, Output, EventEmitter } from '@angular/core';
import { PageDialogComponent } from 'src/app/shared/page-dialog/page-dialog.component';
import { MenuItem } from 'primeng';
import { MetadataService } from '../../../../home/home-sessions/common/service/metadata.service';
import { Metadata } from '../../../../home/home-sessions/common/interfaces/metadata';
import { MessageService } from 'primeng/api';
import { EventDataSource } from './eventdatasource';
import { NvhttpService } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
@Component({
	selector: 'app-add-check-point',
	templateUrl: './add-check-point.component.html',
	styleUrls: ['./add-check-point.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [Metadata, MessageService]
})
export class AddCheckPointComponent
	implements OnInit {
	@Input() displayCheckpoint;
	@Input() updatedisplayCheckpoint;
	@Input() rowdatachild;
	@Input() addEvent;

	@Output() close: EventEmitter<boolean>;
	@Output() updatedclose: EventEmitter<boolean>;
	@Output() data: EventEmitter<any>;
	visible: boolean;
	allState: MenuItem[];
	allEvent: MenuItem[];
	allMode: MenuItem[];
	allCondition: MenuItem[];
	allSearch: MenuItem[];
	allScope: MenuItem[];
	button: boolean;
	searchtype: any[];
	msgs: any;
	enabletoggle: boolean;
	oparg: any;
	rowindex: number;
	updaterowindex: number;
	updateVar = false;
	UupdateVar = false;
	updateruleresponse: any = [];
	id: any;
	checkpointvalue: any;
	selector: string;
	updateselector: string
	rulesvalue: any;
	updaterulesvalue: any;
	activech: any;
	ruleresponse: any = [];
	matchingtext: string;
	updatematchingtext: string;
	updatematching: string;
	updatedata: any;
	matchingop: any[];
	updatedomselector: string;
	domselector: string;
	updatehttpurl: string;
	httpurl: string;
	matching: string;
	activateig: boolean = false;
	activatestartic: boolean = false;
	updateactivateig: boolean = false;
	updateenabletoggle = false;
	pagevalue: any[];
	scope: any;
	Scopeop: any[];
	npage: any[];
	eventname: any;
	obj: any = {};
	pages: any;
	cpname: any;
	startstring: any;
	endstring: any;
	searchtext: any;
	busy: boolean = false;
	speceficfail: any[];
	lbrbfail: any[];
	jsonfail: any[];
	specificfail_flag = false;
	lb_rb_fail_flag = false;
	jsonfail_flag = false;
	updatespecificfail_flag = false;
	updatelb_rb_fail_flag = false;
	updatejsonfail_flag = false;
	fail: number;
	updatefail: number;
	arg1 = {} as { text: string, regex: any, ic: boolean, path: string };
	arg2 = {} as { text: string, regex: any, ic: boolean };
	arg3 = {} as { text: string, regex: any, ic: boolean, path: string };
	arg4 = {} as { text: string, regex: any, ic: boolean };
	textpattern: string;
	failure: any;
	updatefailure: any;
	metadata: Metadata = null;
	//updatedisplayCheckpoint : boolean = false;
	regexspecific = false;
	textignorecase = false;
	regex: boolean;
	rightregex: boolean;
	ignorecase: boolean;
	rightignorecheckvalue = false;
	leftignorecase: boolean;
	leftregex: boolean;
	updatejsonpath: string;
	updateregex: boolean;
	updaterightregex: boolean;
	updateleftregex: boolean;
	updateregexspecific = false;
	updatetextignorecase = false;
	updateleftignore = false;
	updaterightignore = false;

	leftregexspecific: any = [];
	rightregexspecific: any = [];
	updatetextpattern: string;
	leftboundtextpattern: string;
	rightboundtextpattern: string
	updateleftboundtextpattern: string;
	updaterightboundtextpattern: string
	nevent: any = [];
	Radioval: number;
	updateeventname: any;
	updatepages: any;
	updatepaging: any;
	updatecpname: any;
	updatestartstring: any;
	updateendstring: any;
	updatesearchtext: any;
	updateRadioval: number;
	updatescope: any;
	updateactivech: any;
	updateoparg: any;
	uupdatedata: any;
	searchregexp: any;
	Searchic: any[];
	searchic: any;
	startstringregexp: any;
	startstringic: any;
	endstringregexp: any;
	rightignorecase: boolean;
	endstringic: any;
	updatesearchregexp: any;
	updatesearchic: any;
	selectordialogue = false;
	updateselectordialogue = false;
	selectoroptions: any[];
	updatestartstringregexp: any;
	updatestartstringic: any;
	updateendstringregexp: any;
	updateendstringic: any;
	displayEvent: boolean = false;
	Icons: any;
	name: any;
	description: any;
	goal: any;
	StrugglingEvent: any;
	updatedescription: any;
	updateStrugglingEvent: any;
	updatename: any;
	updategoal: any;
	updateIcons: any;
	updatedisplayEvent: any;
	eventvalue: any;

	regextextstring: string;
	leftregextextstring: string;
	rightregextextstring: string;
	matchingenable = false
	updatematchingenable: boolean;
	lefttextarea: string;
	righttextarea: any;

	updatelefttextarea: string;
	updaterighttextarea: any;
	jsonpath: string;
	updateignorecasejsonpath = false;
	ignorecasejsonpath = false;

	jsonignorecase = false;
	leftignore = false;
	updateleftregextextstring: string;
	updaterightregextextstring: string;
	updateregextextstring: string;
	nomatch = false;



	constructor(private metadataService: MetadataService, private messageService: MessageService, private httpService: NvhttpService) {
		this.metadata = new Metadata();
		this.enabletoggle = true;
		this.specificfail_flag = true;
		this.updatespecificfail_flag = true;
		this.close = new EventEmitter();
		this.data = new EventEmitter();
		this.updatedclose = new EventEmitter();
		this.metadataService.getMetadata().subscribe(response => {
			this.metadata = response;
			let eventm: any[] = Array.from(this.metadata.eventMap.keys());
			this.nevent = eventm.map(key => {
				return {
					label: this.metadata.eventMap.get(key).name,
					value: this.metadata.eventMap.get(key).name
				}
			});
			let pagem: any[] = Array.from(this.metadata.pageNameMap.keys());
			this.npage = pagem.map(key => {
				return {
					label: this.metadata.pageNameMap.get(key).name,
					value: this.metadata.pageNameMap.get(key).name
				}
			});
		});
		this.getdata(false);
		this.getCheckPointData(false);
		if (this.displayCheckpoint == true) {
			this.enabletoggle = false;
		}

	}

	ngOnInit(): void {
		const me = this;
		this.specificfail_flag = true;
		this.updatespecificfail_flag = true;
		this.matchingenable = false;
		this.updatematchingenable = false;
		this.eventname = null;
		this.pages = '';
		this.cpname = '';
		this.selector = '';
		this.activateig = false;
		this.activatestartic = false;
		this.activech = "0"
		this.speceficfail = [{
			label: 'Found',
			value: 0x0
		},
		{
			label: 'Not Found',
			value: 0x1
		}
		]

		this.lbrbfail = [{
			label: 'Length Is Less Than Equal',
			value: 0x10
		},
		{
			label: 'Length Is Equal',
			value: 0x20
		},
		{
			label: 'Length Is greater Than equal',
			value: 0x40
		},
		{
			label: 'Is Equal',
			value: 0x0100
		},
		{
			label: 'Is Not Equal',
			value: 0x0200
		},
		{
			label: 'Contain The String',
			value: 0x0400
		},
		]


		this.jsonfail = [{
			label: 'Found',
			value: 0x0
		},
		{
			label: 'Not Found',
			value: 0x1
		},
		{
			label: 'Length Is Less Than Equal',

			value: 0x10
		},
		{
			label: 'Length Is Equal',
			value: 0x20
		},
		{
			label: 'Length Is greater Than equal',
			value: 0x40
		},
		{
			label: 'Is Equal',
			value: 0x0100
		},
		{
			label: 'Is Not Equal',
			value: 0x0200
		},
		{
			label: 'Contain The String',
			value: 0x0400
		},
		{
			label: 'Not Contain The String',
			value: 0x1000
		},
		{
			label: 'Match The Regex',
			value: 0x2000
		},
		{
			label: 'Does not Match The Regex',
			value: 0x4000
		},
		{
			label: 'Length Is Greater Than',
			value: 0x10000
		},
		{
			label: 'Length Is Not Equal',
			value: 0x20000
		},
		{
			label: 'Length Is Less Than',
			value: 0x40000
		},
		{
			label: 'Has Member More Than',
			value: 0x100000

		},
		{
			label: 'Has Member More Than Equal',
			value: 0x200000
		},
		{
			label: 'Has member less than',
			value: 0x400000
		},
		{
			label: 'Has member less than equal',
			value: 0x1000000
		}
		];

		this.fail = 0x0;
		this.updatefail = 0x0;
		this.matchingop = [{
			label: 'Any',
			value: "any"
		},
		{
			label: 'All',
			value: "all"
		}

		]
		this.matching = "all"
		this.selectoroptions = [{
			label: 'Specific Text Pattern',
			value: 1
		},
		{
			label: 'Left Bound Right Bound',
			value: 2
		},
		{
			label: 'Jsonpath Selector',
			value: 3
		}
		];
		this.Radioval = 1;
		this.updateRadioval = 1;
		this.activech = "0"
		this.Scopeop = [{
			label: 'Complete Dom & Dom Changes Both',
			value: "99"
		},
		{
			label: 'Complete Dom',
			value: "0"
		},
		{
			label: 'Dom Changes',
			value: "1"
		},
		{
			label: 'Http Response',
			value: '2'
		},
		{
			label: 'Http Response Header',
			value: '3'
		},
		{
			label: 'Http Response Body and Header both',
			value: '4'
		}
		];
		this.scope = "99";

		this.showSaveCheckPoint(event);



	}


	open() {
		this.visible = true;
	}

	closeDialog() {
		this.visible = false;
	}



	//get row selected data from parent to editing
	showSaveCheckPoint(event) {
		this.updatematchingenable = false;
		console.log('row data object received=', this.rowdatachild);
		if (this.rowdatachild == undefined || this.rowdatachild == null)
			return;

		if (this.rowdatachild.ruleselector != undefined && this.rowdatachild.ruleselector != null && this.rowdatachild.ruleselector != "")
			this.selector = this.rowdatachild.ruleselector;
		this.id = this.rowdatachild.id;
		this.updateactivech = this.rowdatachild.updateactivech;
		this.updateeventname = this.rowdatachild.updateeventname,
			this.updatepaging = this.rowdatachild.updatepaging;
		this.updatecpname = this.rowdatachild.updatecpname;
		//this.updateRadioval = this.rowdatachild.updateRadioval;
		this.updatescope = this.rowdatachild.updatescope;
		this.updateselector = this.rowdatachild.updateselector;
		this.updatefail = this.rowdatachild.updatefail;
		this.updatepages = this.rowdatachild.updatepages;
		if (this.rowdatachild.updaterules != undefined)
			this.updateruleresponse = JSON.parse(this.rowdatachild.updaterules);
		if (this.updateruleresponse != null && this.updateruleresponse != "null") {
			for (var k of this.updateruleresponse) {
				if (k.mode == 3)
					k.fail_label = this.getJsonFailLabel(k.fail);
				if (k.mode == 2)
					k.fail_label = this.getLBRBFailLabel(k.fail);
				if (k.mode == 1)
					k.fail_label = this.getSpecificFailLabel(k.fail);
			}
		}
		if (this.updateruleresponse == null || this.updateruleresponse == "null")
			this.updateruleresponse = [];

		this.updatematching = this.rowdatachild.updatematch;
		if (this.rowdatachild.updatescope == "99" || this.rowdatachild.updatescope == "1" || this.rowdatachild.updatescope == "0") {
			this.updatedomselector = this.rowdatachild.updateselector;
		}
		if (this.rowdatachild.updatescope == "2" || this.rowdatachild.updatescope == "3" || this.rowdatachild.updatescope == "4") {
			this.updatehttpurl = this.rowdatachild.updateselector;
		}

		if (this.rowdatachild.updateactivech === "1") {
			this.updateenabletoggle = true;
		}
		if (this.rowdatachild.updateactivech === "0") {
			this.updateenabletoggle = false;
		}
	}

	//set edited data in a object for sending it to parents
	updateSaveCheckPoint() {
		if (this.updateenabletoggle === true) {
			this.updateactivech = "1";
		}
		if (this.updateenabletoggle === false) {
			this.updateactivech = "0";
		}


		if (this.updatescope == '2' || this.updatescope == '3' || this.updatescope == '4') {
			this.updateselector = this.updatehttpurl;
		}

		if (this.updatescope == '99' || this.updatescope == '1') {
			this.updateselector = this.updatedomselector;
		}
		if (this.updateruleresponse != null && this.updateruleresponse != "null")
			this.EncodeRules(this.updateruleresponse);
		this.obj = {
			'id': this.id,
			'updateactivech': this.updateactivech,
			'updateeventname': this.updateeventname,
			'updatepaging': this.updatepaging,
			'updatecpname': this.updatecpname,
			'updatestartstring': null,
			'updateendstring': null,
			'updatesearchtext': null,
			'fakeRadioval': 0,
			'updatescope': this.updatescope,
			'updateselector': this.updateselector,
			'updateoparg': 0,
			'updatefail': 0,
			'updatesearchregexp': null,
			'updatesearchic': 0,
			'updatestartstringregexp': null,
			'updatestartstringic': 0,
			'updateendstringregexp': null,
			'updateendstringic': 0,
			'updatepages': this.updatepages,
			'updaterules': JSON.stringify(this.updateruleresponse),
			'updatematch': this.updatematching
		}
		if (this.obj['updaterules'] != "null" && this.obj['updaterules'] != null) {
			let temp = JSON.parse(this.obj['updaterules']);
			for (var k of temp)
				delete (k.fail_label);
			this.obj['updaterules'] = JSON.stringify(temp);
		}
		this.data.emit(this.obj);
	}
	EncodeRules(rules) {
		for (var k of rules) {
			if (k.arg1.text != undefined) {
				if (k.arg1.text.includes("'"))
					k.arg1.text = k.arg1.text.replace(/'/g, "''");
			}
			if (k.arg2 != undefined) {
				if (k.arg2.text.includes("'"))
					k.arg2.text = k.arg2.text.replace(/'/g, "''");
			}
		}
	}
	openDialog() {
		this.displayEvent = true;
	}

	closeEventPopup($event) {
		this.displayEvent = false;
	}


	//closes the add popup
	Cancel() {
		this.close.emit(false);
	}

	//closes the edit popup
	updatedCancel() {
		this.updatedclose.emit(false);
	}
	saveEvent(event) {
		console.log("data object=", event);
		this.Icons = event.Icons;
		this.name = event.name;
		this.description = event.description;
		this.goal = event.goal;
		this.StrugglingEvent = event.StrugglingEvent;
		this.id = event.id;
		this.updatedescription = event.updatedescription;
		this.updateStrugglingEvent = event.updateStrugglingEvent;
		this.updatename = event.updatename;
		this.updategoal = event.updategoal;
		this.updateIcons = event.updateIcons;


		if (
			this.name == "" ||
			this.name == undefined ||
			this.name == "undefined"
		) {

			this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Please enter  Name', detail: '' });
			return;
		}
		if (
			this.description == "" ||
			this.description == undefined ||
			this.description == "undefined"
		) {
			this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Please enter Description', detail: '' });
			return;
		}

		this.displayEvent = false;
		let data = new EventDataSource(
			this.description,
			this.name,
			this.StrugglingEvent,
			this.Icons,
			this.goal,
			""
		);
		// this.eventvalue = data;
		this.busy = true;
		this.httpService.addevent(data).subscribe((response: any) => {
			if (response == false)
				this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'This Event Already  Exist', detail: '' });
			this.getdata(true);
			this.busy = false;
			let description = "Event " + "'" + data.name + "'" + " added";
			this.httpService
				.getAuditLog(
					"INFO",
					"Open Configuration",
					description,
					"UX Monitoring::ConfigUI::Event"
				)
				.subscribe(response => { });
		});

		this.getdata(true);
		this.getCheckPointData(true);
		this.close.emit(false);
	}

	getdata(mflag) {
		this.busy = true;
		if (mflag == true) this.metadataService.refreshMetadata();
		this.httpService.getEventData().subscribe((response: any) => {
			if (response != null && response.length > 0) {
				this.eventvalue = response;
				this.busy = false;
			} else {
				this.eventvalue = [];
				this.busy = false;
			}
		});
	}

	getCheckPointData(mflag) {
		this.busy = true;
		if (mflag == true) {
			this.metadataService.refreshMetadata();
		}
		this.httpService.getCheckpointData().subscribe((response: any) => {
			if (response != null && response.length > 0) {
				this.checkpointvalue = response;
				this.busy = false;
				console.log("check point in audit log--", this.checkpointvalue);
			} else {
				this.busy = false;
				this.checkpointvalue = [];
			}
		});
	}

	openselectordialog(): void {
		document.getElementById("savecpid")["disabled"] = "true";
		if (this.updateVar == false) {
			this.Radioval = 1;
			this.resetseletordialog();
		}
		this.selectordialogue = true;
		if (this.updateVar == true) {
			this.fail = parseInt(this.updatedata.fail);
			this.Radioval = parseInt(this.updatedata.mode);
			if (this.updatedata.mode == 3) {
				this.jsonpath = this.updatedata.arg1.path;
				this.ignorecasejsonpath = this.updatedata.arg1.ic;
			}

			if (this.updatedata.mode == 1) {
				if (this.updatedata.arg1) {
					this.textpattern = this.updatedata.arg1.text;

				}
				if (this.updatedata.arg1.regex != false) {
					this.regexspecific = true;
					this.regex = true;
					this.regextextstring = this.updatedata.arg1.regex;
				}

				if (this.updatedata.arg1.regex == false)
					this.regexspecific = false;

				if (this.updatedata.arg1.ic == true)
					this.textignorecase = true;

				if (this.updatedata.arg1.ic == false)
					this.textignorecase = false;

			}

			if (this.updatedata.mode == 2) {
				this.leftboundtextpattern = this.updatedata.arg1.text;
				this.rightboundtextpattern = this.updatedata.arg2.text;

				if (this.updatedata.arg1.regex != false) {
					this.leftregex = true;
					this.leftregexspecific = true;
					this.leftregextextstring = this.updatedata.arg1.regex;
				}

				if (this.updatedata.arg1.ic == true)
					this.leftignore = true;

				if (this.updatedata.arg2.regex != false) {
					this.rightregex = true;
					this.rightregexspecific = true;
					this.rightregextextstring = this.updatedata.arg2.regex;
				}

				if (this.updatedata.arg2.ic == true)
					this.rightignorecheckvalue = true;

			}

		}
	}

	openupdateselectordialog() {
		document.getElementById("updatesavecpid")["disabled"] = "true";
		if (this.UupdateVar == false) {
			this.updateRadioval = 1;
			this.updateresetseletordialog();
		}
		this.updateselectordialogue = true;


		if (this.UupdateVar == true) {
			this.updatefail = parseInt(this.uupdatedata.fail);
			this.updateRadioval = parseInt(this.uupdatedata.mode);
			if (this.uupdatedata.mode == 3) {
				this.updateignorecasejsonpath = this.uupdatedata.arg1.ic;
				this.updatejsonpath = this.uupdatedata.arg1.path;
			}
			this.updateRadioval = this.uupdatedata.mode;
			if (this.uupdatedata.mode == 1) {
				if (this.uupdatedata.arg1) {
					this.updatetextpattern = this.uupdatedata.arg1.text;

				}
				if (this.uupdatedata.arg1.regex != false) {
					this.updateregexspecific = true;
					this.updateregextextstring = this.uupdatedata.arg1.regex;
				}

				if (this.uupdatedata.arg1.regex == false)
					this.updateregexspecific = false;

				if (this.uupdatedata.arg1.ic == true)
					this.updatetextignorecase = true;

				if (this.uupdatedata.arg1.ic == false)
					this.updatetextignorecase = false;

			}

			if (this.uupdatedata.mode == 2) {
				this.updateleftboundtextpattern = this.uupdatedata.arg1.text;
				this.updaterightboundtextpattern = this.uupdatedata.arg2.text;
				if (this.uupdatedata.arg1.regex != false) {
					this.updateleftregex = true;
					this.updateleftregextextstring = this.uupdatedata.arg1.regex;
				}

				if (this.uupdatedata.arg1.regex == false) {
					this.updateleftregex = false;
				}


				if (this.uupdatedata.arg1.ic == true)
					this.updateleftignore = true;

				if (this.uupdatedata.arg2.regex != false) {
					this.updaterightregex = true;
					this.updaterightregextextstring = this.uupdatedata.arg2.regex;
				}
				if (this.uupdatedata.arg2.regex == false)
					this.updaterightregex = false;

				if (this.uupdatedata.arg2.ic == true)
					this.updaterightignore = true;


			}

		}

	}
	isValidRegex(text) {
		try {
			RegExp(text)
			return true;
		} catch (e) {
			return false;
		}
	}
	saveTextSelector() {
		this.msgs = [];
		if (this.Radioval == 3) {
			this.matchingenable = false;
			this.lb_rb_fail_flag = false;
			this.specificfail_flag = false;
			this.jsonfail_flag = true;
			if (this.jsonpath == undefined || this.jsonpath == "") {
				this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Please Fill The Value Of Json Path', detail: '' });

				return;
			}
		}
		if (this.Radioval == 1) {
			this.fail = 0x0;
			this.matchingenable = false;
			this.specificfail_flag = true;
			this.lb_rb_fail_flag = false;
			this.jsonfail_flag = false;
			if (this.textpattern == undefined) {
				this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Please Fill The Value Of Text Pattern', detail: '' });
				return;
			}

			if (this.regex == true) {
				if (this.regextextstring == undefined) {
					this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Please Fill The Value Of Test String', detail: '' });
					return;
				}
			}
		}
		if (this.Radioval == 2) {
			this.fail = 0x10;
			this.matchingenable = true;
			this.lb_rb_fail_flag = true;
			this.specificfail_flag = false;
			this.jsonfail_flag = false;
			if (this.leftboundtextpattern == undefined) {
				this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Please Fill The Value Of Left Bound Text Pattern', detail: '' });
				return;
			}
			if (this.rightboundtextpattern == undefined) {
				this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Please Fill The Value Of Right Bound Text Pattern', detail: '' });
				return;
			}

			if (this.rightregex == true) {
				if (this.rightregextextstring == undefined) {
					this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Please Fill The Value Of Test String In Right Bound', detail: '' });
					return;
				}
			}

			if (this.leftregex == true) {
				if (this.leftregextextstring == undefined) {
					this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Please Fill The Value Of Test String In Left Bound', detail: '' });
					return;
				}
			}

		}


		if (this.Radioval == 1) {
			if (this.regex == true) {
				if (this.isValidRegex(this.regextextstring) == false) {
					this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Unable to Save As Rgex is Not Valid', detail: '' });
					return;
				}
			}
		}

		this.arg1 = {} as { text: string, regex: any, ic: boolean, path: string };
		this.arg2 = {} as { text: string, regex: any, ic: boolean };
		if (this.Radioval == 3) {
			this.arg1.path = this.jsonpath;
			this.arg1.ic = this.ignorecasejsonpath;
			this.rulesvalue = JSON.stringify(this.arg1)
		}
		if (this.Radioval == 2) {
			this.arg1.text = this.leftboundtextpattern;
			if (this.leftregex == undefined) {
				this.leftregex = false;
			}

			if (this.leftignorecase == undefined) {
				this.leftignorecase = false;
			}
			if (this.leftregex == true)
				this.arg1.regex = this.leftregextextstring;
			if (this.leftregex == false)
				this.arg1.regex = this.leftregex;
			this.arg1.ic = this.leftignorecase;

			this.arg2.text = this.rightboundtextpattern;
			if (this.rightregex == undefined) {
				this.rightregex = false;
			}
			if (this.rightignorecase == undefined) {
				this.rightignorecase = false;
			}
			if (this.rightregex == true)
				this.arg2.regex = this.rightregextextstring;
			if (this.rightregex == false)
				this.arg2.regex = this.rightregex;
			this.arg2.ic = this.rightignorecase;
			this.rulesvalue = JSON.stringify(this.arg1) + " " + JSON.stringify(this.arg2)

		}

		if (this.Radioval == 1) {
			this.arg1.text = this.textpattern;
			if (this.regex === undefined) {
				this.regex = false;
			}
			if (this.ignorecase === undefined) {
				this.ignorecase = false;
			}
			if (this.regex == true)
				this.arg1.regex = this.regextextstring;
			if (this.regex == false)
				this.arg1.regex = this.regex;
			this.arg1.ic = this.ignorecase;

			this.rulesvalue = JSON.stringify(this.arg1);
		}
		this.selectordialogue = false;
		document.getElementById("savecpid")["disabled"] = false;
	}

	updatesaveTextSelector() {

		this.msgs = [];
		if (this.Radioval == 3) {
			this.updatematchingenable = false;
			if (this.updatejsonpath == undefined || this.updatejsonpath == "") {
				this.msgs.push({
					severity: 'error',
					summary: 'Message',
					detail: 'Please Fill The Value Of Json Path'
				});
				this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Unable to Save As Rgex is Not Valid', detail: '' });
				return;
			}
		}
		if (this.updateRadioval == 1) {
			this.updatefail = 0x0;
			this.updatematchingenable = false;
			if (this.updatetextpattern == undefined) {
				this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Please Fill The Value Of Text Pattern', detail: '' });
				return;
			}

			if (this.updateregex == true) {
				if (this.updateregextextstring == undefined) {
					this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Please Fill The Value Of Test String', detail: '' });
					return;
				}
			}
		}
		if (this.updateRadioval == 2) {
			this.updatefail = 0x10;
			this.updatematchingenable = true;
			if (this.updateleftboundtextpattern == undefined) {
				this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Please Fill The Value Of Left Bound Text Pattern', detail: '' });
				return;
			}
			if (this.updaterightboundtextpattern == undefined) {

				this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Please Fill The Value Of Right Bound Text Pattern', detail: '' });
				return;
			}

			if (this.updaterightregex == true) {
				if (this.updaterightregextextstring == undefined) {
					this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Please Fill The Value Of Test String In Right Bound', detail: '' });
					return;
				}

			}

			if (this.updateleftregex == true) {
				if (this.updateleftregextextstring == undefined) {
					this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Please Fill The Value Of Test String In Left Bound', detail: '' });
					return;
				}
			}

		}


		if (this.updateRadioval == 1) {
			if (this.updateregex == true) {
				if (this.isValidRegex(this.regextextstring) == false) {

					this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Unable to Save As Rgex is Not Valid', detail: '' });
					return;
				}
			}
		}

		this.arg3 = {} as { text: string, regex: any, ic: boolean, path: string };
		this.arg4 = {} as { text: string, regex: any, ic: boolean };
		if (this.updateRadioval == 3) {
			//let obj = '{"a":23}';
			//if (this.isValidJson(obj, this.updatejsonpath) == false) {
			//this.msgs.push({ severity: 'warn', summary: 'Message', detail: 'Unable to Save As Json Path is Not Valid' });
			//return;
			// }
			this.arg3.path = this.updatejsonpath;
			this.arg3.ic = this.updateignorecasejsonpath
			this.updaterulesvalue = JSON.stringify(this.arg3);
			this.updatejsonfail_flag = true;
			this.updatelb_rb_fail_flag = false;
			this.updatespecificfail_flag = false;
		}
		if (this.updateRadioval == 2) {
			this.updatejsonfail_flag = false;
			this.updatelb_rb_fail_flag = true;
			this.updatespecificfail_flag = false;
			this.arg3.text = this.updateleftboundtextpattern;
			if (this.updateleftregex == undefined) {
				this.updateleftregex = false;
			}
			if (this.updateleftregex == true) {
				this.arg3.regex = this.updateleftregextextstring;
			}
			if (this.updateleftregex == false) {
				this.arg3.regex = this.updateleftregex;
			}

			if (this.updateleftignore == undefined) {
				this.updateleftignore = false;
			}
			this.arg3.ic = this.updateleftignore

			this.arg4.text = this.updaterightboundtextpattern;
			if (this.updaterightregex == undefined) {
				this.updaterightregex = false;
			}
			if (this.updaterightregex == true) {
				this.arg4.regex = this.updaterightregextextstring;
			}
			if (this.updaterightregex == false) {
				this.arg4.regex = this.updaterightregex;
			}

			if (this.updaterightignore == undefined) {
				this.updaterightignore = false;
			}
			this.arg4.ic = this.updaterightignore;
			this.updaterulesvalue = JSON.stringify(this.arg3) + " " + JSON.stringify(this.arg4)
		}

		if (this.updateRadioval == 1) {
			this.updatejsonfail_flag = false;
			this.updatelb_rb_fail_flag = false;
			this.updatespecificfail_flag = true;
			this.arg3.text = this.updatetextpattern;
			if (this.updateregex === undefined) {
				this.updateregex = false;
			}

			if (this.updateregexspecific == true)
				this.updateregex = true;
			if (this.updateregexspecific == false)
				this.updateregex = false;
			if (this.updateregex == true)
				this.arg3.regex = this.updateregextextstring;
			if (this.updateregex == false)
				this.arg3.regex = this.updateregex;

			if (this.updatetextignorecase === undefined) {
				this.updatetextignorecase = false;
			}
			this.arg3.ic = this.updatetextignorecase;
			this.updaterulesvalue = JSON.stringify(this.arg3);
			this.updaterulesvalue = JSON.stringify(this.arg3);

		}


		this.updateselectordialogue = false;
		document.getElementById("updatesavecpid")["disabled"] = false;

	}

	SaveCheckPoint() {
		if (this.enabletoggle === true) {
			this.activech = "1";
		}
		if (this.enabletoggle === false) {
			this.activech = "0";
		}

		if (this.scope == '2' || this.scope == '3' || this.scope == '4') {
			this.selector = this.httpurl;
		}

		if (this.scope == '99' || this.scope == '1') {
			this.selector = this.domselector;
		}
		if (this.ruleresponse != null && this.ruleresponse != "null")
			this.EncodeRules(this.ruleresponse);
		this.obj = {
			'state': this.activech,
			'Scope': this.scope,
			'eventname': this.eventname,
			'Page': this.pages,
			'checkpoint': this.cpname,
			'Selector': this.selector,
			'searchmethod': 0,
			'textstring': null,
			'startstring': null,
			'endstring': null,
			'endstringregexp': null,
			'startstringregexp': null,
			'mode': 0,
			'searchic': 0,
			'ConditionforEventGeneration': 0,
			'startstringic': 0,
			'endstringic': 0,
			'StringEvent': 'null',
			'Lengthcondition': '0',
			'Valuecondition': '0',
			'oparg': 0,
			'rules': JSON.stringify(this.ruleresponse),
			'match': this.matching
		}

		if (this.obj['rules'] != "null" && this.obj['rules'] != null) {
			let temp = JSON.parse(this.obj['rules']);
			for (var k of temp)
				delete (k.fail_label);
			this.obj['rules'] = JSON.stringify(temp);
		}
		this.data.emit(this.obj);


	}
	ConfirmRule(): void {


		this.msgs = [];
		if (this.matchingenable == true) {
			if (this.matchingtext == undefined || this.matchingtext == "") {
				// this.msgs.push({
				// 	severity: 'warn',
				// 	summary: 'Message',
				// 	detail: 'Please Fill the R.H.S Value'
				// });
				return;
			}

		}
		if (this.rulesvalue == undefined) {
			// this.msgs.push({
			// 	severity: 'warn',
			// 	summary: 'Message',
			// 	detail: 'Please Fill the L.H.S Value'
			// });
			return;
		}
		const rule = [];
		const temp = {} as { arg1: {}, arg2: {}, fail_label: string, mode: number, fail: number, value: string };

		temp.arg1 = this.arg1;

		if (this.Radioval == 2)
			temp.arg2 = this.arg2;
		temp.mode = this.Radioval;
		temp.fail = this.fail;
		if (this.Radioval == 1)
			temp.fail_label = this.getSpecificFailLabel(this.fail);
		if (this.Radioval == 3)
			temp.fail_label = this.getJsonFailLabel(this.fail);
		if (this.Radioval == 2)
			temp.fail_label = this.getLBRBFailLabel(this.fail);

		if (this.fail != 0 && this.fail != 1)
			temp.value = this.matchingtext;

		rule.push(temp);

		if (this.updateVar === false) {
			if (this.Radioval == 1)
				delete (rule[0].arg2);
			if (this.ruleresponse.length != 0) {
				for (var k of this.ruleresponse) {
					let a = k
					let lfaillabel = a.fail_label;
					delete (a.fail_label);
					let rhs = JSON.stringify(a);
					let b = (rule[0]);
					let rfaillabel = b.fail_label;
					delete (b.fail_label);
					let lhs = JSON.stringify(b);
					if (lhs == rhs) {
						k.fail_label = lfaillabel;
						rule[0].fail_label = rfaillabel;
						this.msgs.push({
							severity: 'error',
							summary: 'Message',
							detail: ' This Data Already Exist'
						});
						return;
					} else {
						k.fail_label = lfaillabel;
						rule[0].fail_label = rfaillabel;
					}
				}
			}
			this.ruleresponse.push(rule[0]);
		}

		if (this.updateVar === true) {
			if (this.Radioval == 1) {
				delete (this.ruleresponse[this.rowindex].arg2);
			}
			this.ruleresponse[this.rowindex].arg1 = this.arg1;
			this.ruleresponse[this.rowindex].arg2 = this.arg2;
			this.ruleresponse[this.rowindex].fail = this.fail;
			if (this.Radioval == 3) {
				this.ruleresponse[this.rowindex].fail_label = this.getJsonFailLabel(this.fail);
			}
			if (this.Radioval == 2) {
				this.ruleresponse[this.rowindex].fail_label = this.getLBRBFailLabel(this.fail);
			}
			if (this.Radioval == 1) {
				this.ruleresponse[this.rowindex].fail_label = this.getSpecificFailLabel(this.fail);
			}
			if (this.fail == 0 || this.fail == 1) {
				delete (this.ruleresponse[this.rowindex].value)
			}
			if (this.fail != 0 && this.fail != 1)
				this.ruleresponse[this.rowindex].value = this.matchingtext;
			this.ruleresponse[this.rowindex].mode = this.Radioval;
		}

		if (this.Radioval == 1 && this.updateVar == true) {
			if (this.ruleresponse[this.rowindex].arg2 != undefined)
				delete (this.ruleresponse[this.rowindex].arg2);
		}


		if (this.Radioval == 3 && this.updateVar == true) {
			this.ruleresponse[this.rowindex].arg1 = this.arg1;
			if (this.ruleresponse[this.rowindex].arg2 != undefined)
				delete (this.ruleresponse[this.rowindex].arg2);
		}

		this.rulesvalue = undefined;
		this.matchingtext = undefined;
		this.fail = 0x0;
		this.updateVar = false;
		this.specificfail_flag = true;
		this.lb_rb_fail_flag = false;
		this.jsonfail_flag = false;
		this.matchingenable = false;


	}
	updateConfirmRule() {
		this.msgs = [];
		if (this.updatematchingenable == true) {
			if (this.updatematchingtext == undefined || this.updatematchingtext == "") {
				// this.msgs.push({
				// 	severity: 'warn',
				// 	summary: 'Message',
				// 	detail: 'Please Fill the R.H.S Value'
				// });
				return;
			}
		}
		if (this.updaterulesvalue == undefined) {
			// this.msgs.push({
			// 	severity: 'warn',
			// 	summary: 'Message',
			// 	detail: 'Please Fill the L.H.S Value'
			// });
			return;
		}
		this.updatetextpattern = undefined;
		this.updateleftboundtextpattern = undefined;
		this.updateregexspecific = false;
		this.updatetextignorecase = false;
		const rule = [];
		const temp = {} as { arg1: {}, arg2: {}, fail_label: string, mode: number, fail: number, value: string };
		if (Object.keys(this.arg3).length === 0 && this.uupdatedata != undefined)
			temp.arg1 = this.uupdatedata.arg1;
		else
			temp.arg1 = this.arg3;
		if (Object.keys(this.arg4).length === 0 && this.uupdatedata != undefined && this.updateRadioval == 2)
			temp.arg2 = this.uupdatedata.arg2;
		else if (this.updateRadioval == 2)
			temp.arg2 = this.arg4;
		temp.fail = this.updatefail;
		temp.mode = this.updateRadioval;
		if (this.updateRadioval == 1)
			temp.fail_label = this.getSpecificFailLabel(this.updatefail);
		if (this.updateRadioval == 3)
			temp.fail_label = this.getJsonFailLabel(this.updatefail);
		if (this.updateRadioval == 2)
			temp.fail_label = this.getLBRBFailLabel(this.updatefail);
		if (this.updatefail != 0 && this.updatefail != 1)
			temp.value = this.updatematchingtext;

		rule.push(temp);

		if (this.UupdateVar === false) {
			if (this.updateRadioval == 1)
				delete (rule[0].arg2);
			if (this.updateruleresponse != null) {
				if (this.updateruleresponse.length != 0) {
					for (var k of this.updateruleresponse) {
						let a = k
						let lfaillabel = a.fail_label;
						delete (a.fail_label);
						let rhs = JSON.stringify(a);
						let b = (rule[0]);
						let rfaillabel = b.fail_label;
						delete (b.fail_label);
						let lhs = JSON.stringify(b);
						if (lhs == rhs) {
							k.fail_label = lfaillabel;
							rule[0].fail_label = rfaillabel;
							this.msgs.push({
								severity: 'error',
								summary: 'Message',
								detail: ' This Data Already Exist'
							});
							return;
						} else {
							k.fail_label = lfaillabel;
							rule[0].fail_label = rfaillabel;
						}
					}
				}
			}
			this.updateruleresponse.push(rule[0]);
		}
		if (this.UupdateVar === true) {
			if (this.updateRadioval == 1) {
				let realtmp = Object.keys(this.updateruleresponse[this.updaterowindex]);
				if (realtmp.indexOf("arg2") > -1)
					delete (this.updateruleresponse[this.updaterowindex].arg2);
			}
			if (Object.keys(this.arg3).length === 0)
				this.updateruleresponse[this.updaterowindex].arg1 = this.uupdatedata.arg1;
			else
				this.updateruleresponse[this.updaterowindex].arg1 = this.arg3;

			this.updateruleresponse[this.updaterowindex].fail = this.updatefail;
			if (this.updateRadioval == 2) {
				if (Object.keys(this.arg4).length === 0)
					this.updateruleresponse[this.updaterowindex].arg2 = this.uupdatedata.arg2;
				else
					this.updateruleresponse[this.updaterowindex].arg2 = this.arg4;
			}
			if (this.updateRadioval == 3) {
				this.updateruleresponse[this.updaterowindex].arg1 = this.uupdatedata.arg1;
				if (this.updateruleresponse[this.updaterowindex].arg2 != undefined)
					delete (this.updateruleresponse[this.updaterowindex].arg2);
			}
			if (this.updateRadioval == 3) {
				this.updateruleresponse[this.updaterowindex].fail_label = this.getJsonFailLabel(this.updatefail);
			}
			if (this.updateRadioval == 2) {
				this.updateruleresponse[this.updaterowindex].fail_label = this.getLBRBFailLabel(this.updatefail);
			}
			if (this.updateRadioval == 1) {
				this.updateruleresponse[this.updaterowindex].fail_label = this.getSpecificFailLabel(this.updatefail);
			}
			if (this.updatefail == 0 || this.updatefail == 1) {
				delete (this.updateruleresponse[this.updaterowindex].value)
			}
			if (this.updatefail != 0 && this.updatefail != 1)
				this.updateruleresponse[this.updaterowindex].value = this.updatematchingtext;
			this.updateruleresponse[this.updaterowindex].mode = this.updateRadioval;
		}
		this.updaterulesvalue = undefined;
		this.updatematchingtext = undefined;
		this.updatefail = 0x0;
		this.UupdateVar = false;
		this.updatespecificfail_flag = true;
		this.updatelb_rb_fail_flag = false;
		this.updatejsonfail_flag = false;
		this.updatematchingenable = false;


	}


	getJsonFailLabel(failvalue) {
		for (var d of this.jsonfail) {
			if (d.value == failvalue)
				return d.label;
		}

	}

	getLBRBFailLabel(failvalue) {
		for (var d of this.lbrbfail) {
			if (d.value == failvalue)
				return d.label;
		}
	}

	getSpecificFailLabel(failvalue) {
		for (var d of this.speceficfail) {
			if (d.value == failvalue)
				return d.label;
		}
	}

	checkvalue(e) {
		if (e.checked == true) {
			this.regex = true;
		}
		if (e.checked === false) {
			this.regex = false;
		}

	}

	ignorecheckvalue(e) {
		if (e.checked == true) {
			this.ignorecase = true;
		}
		if (e.checked === false) {
			this.ignorecase = false;
		}
	}


	rightgnorecheckvalue(e) {
		if (e.checked == true) {
			this.rightignorecase = true;
		}
		if (e.checked == false) {
			this.rightignorecase = false;
		}

	}


	leftignorecheckvaluefunction(e) {
		if (e.checked == true) {
			this.leftignorecase = true;
		}
		if (e.checked == false) {
			this.leftignorecase = false;
		}

	}
	editRule(data, i) {
		this.updateVar = true;
		this.updatedata = data;
		this.rowindex = i;
		if (data.mode == 3) {
			this.rulesvalue = JSON.stringify(data.arg1);
			this.specificfail_flag = false;
			this.lb_rb_fail_flag = false;
			this.jsonfail_flag = true;
		}
		if (data.mode == 2) {
			this.rulesvalue = JSON.stringify(data.arg1) + " " + JSON.stringify(data.arg2);
			this.specificfail_flag = false;
			this.lb_rb_fail_flag = true;
			this.jsonfail_flag = false;
		}
		if (data.mode == 1) {
			this.rulesvalue = JSON.stringify(data.arg1);
			this.specificfail_flag = true;
			this.lb_rb_fail_flag = false;
			this.jsonfail_flag = false;
		}
		this.fail = data.fail;
		if (this.fail != 0 && this.fail != 1)
			this.matchingenable = true;
		if (this.fail == 0 || this.fail == 1)
			this.matchingenable = false;
		this.matchingtext = data.value;

	}


	updateeditRule(data, i) {
		this.UupdateVar = true;
		this.uupdatedata = data;
		this.updaterowindex = i;
		this.updateRadioval = data.mode;
		if (data.mode == 3) {
			this.updaterulesvalue = JSON.stringify(data.arg1);
			this.updatespecificfail_flag = false;
			this.updatelb_rb_fail_flag = false;
			this.updatejsonfail_flag = true;
		}
		if (data.mode == 2) {
			this.updaterulesvalue = JSON.stringify(data.arg1) + " " + JSON.stringify(data.arg2);
			this.updatespecificfail_flag = false;
			this.updatelb_rb_fail_flag = true;
			this.updatejsonfail_flag = false;
		}
		if (data.mode == 1) {
			this.updaterulesvalue = JSON.stringify(data.arg1);
			this.updatespecificfail_flag = true;
			this.updatelb_rb_fail_flag = false;
			this.updatejsonfail_flag = false;
		}
		this.updatefail = data.fail;
		this.updatematchingtext = data.value;
		if (this.updatefail != 0 && this.updatefail != 1)
			this.updatematchingenable = true;
		if (this.updatefail == 0 || this.updatefail == 1)
			this.updatematchingenable = false;

	}

	deleteRule(i) {
		this.ruleresponse.splice(i, 1);
		this.rulesvalue = undefined;
		this.matchingtext = undefined;
		this.fail = 0x0;
		this.matchingenable = false;
		this.updateVar = false;


	}


	updatedeleteRule(i) {
		let fail = 0x0;
		this.updateruleresponse.splice(i, 1);
		this.updaterulesvalue = undefined;
		this.updatematchingtext = undefined;
		this.updatefail = 0x0;
		this.updatematchingenable = false;
		this.UupdateVar = false;


	}


	updateregexcheckvalue(e) {
		if (e.checked == true) {
			this.updateregex = true;
		}
		if (e.checked == false) {
			this.updateregex = false;
		}

	}


	checkvalueright(e) {
		if (e.checked == true) {
			this.rightregex = true;
		}
		if (e.checked === false) {
			this.rightregex = false;
		}
	}


	checkvalueleft(e) {
		if (e.checked == true) {
			this.leftregex = true;
		}
		if (e.checked === false) {
			this.leftregex = false;
		}
	}

	updaterightignorecheckvalue(e) {
		if (e.checked == true) {
			this.updaterightignore = true;
		}
		if (e.checked === false) {
			this.updaterightignore = false;
		}
	}

	jsonignorecheckvalue(e) {
		if (e.checked == true) {
			this.ignorecasejsonpath = true;
		}
		if (e.checked === false) {
			this.ignorecasejsonpath = false;
		}
	}

	updatejsonignorecheckvalue(e) {
		if (e.checked == true) {
			this.updateignorecasejsonpath = true;
		}
		if (e.checked === false) {
			this.updateignorecasejsonpath = false;
		}
	}

	updaterightregexvalue(e) {
		if (e.checked == true) {
			this.updaterightregex = true;
		}
		if (e === false) {
			this.updaterightregex = false;
		}
	}

	updateleftignorecheckvalue(e) {
		if (e.checked == true) {
			this.updateleftignore = true;
		}
		if (e.checked === false) {
			this.updateleftignore = false;
		}
	}
	updateleftregexvalue(e) {
		if (e.checked == true) {
			this.updateleftregex = true;
		}
		if (e.checked === false) {
			this.updateleftregex = false;
		}
	}


	RegexTest(a, b) {
		if (RegExp(b).test(a) == true) {
			this.matchedstringmessage();
		} else {
			this.nonmatchedstringmessage();


		}

	}

	LeftRegexTest() {
		if (RegExp(this.leftregextextstring).test(this.leftboundtextpattern) == true) {
			this.matchedstringmessage();
		} else {
			this.nonmatchedstringmessage();

		}
	}


	RightRegexTest(a, b) {
		if (RegExp(b).test(a) == true) {
			this.matchedstringmessage();
		} else {
			this.nonmatchedstringmessage();

		}
	}
	matchedstringmessage() {
		this.messageService.add({ key: 'add-checkpoint', severity: 'success', summary: 'Test String Matched', detail: '' });
	}
	nonmatchedstringmessage() {
		this.messageService.add({ key: 'add-checkpoint', severity: 'warn', summary: 'Test String Not Matched', detail: '' });
	}


	TestJsonPath(leftvalue, jsonpathvalue, indicator: string) {
		if (leftvalue == undefined) {
			return;
		}
		this.msgs = [];
		let obj = JSON.parse(leftvalue);
		let match = this.jsonPath(obj, jsonpathvalue);
		let tmp = this.isValidJson(obj, jsonpathvalue);
		if (tmp != false) {
			this.nomatch = false;
			if (indicator == 'add')
				this.righttextarea = JSON.stringify(tmp, undefined, 4);
			if (indicator == 'update')
				this.updaterighttextarea = JSON.stringify(tmp, undefined, 4);
		} else {
			this.nomatch = true;
			if (indicator == 'add')
				this.righttextarea = "No Match";
			if (indicator == 'update')
				this.updaterighttextarea = "No Match";
		}


	}

	isValidJson(obj, jsonpath: string): any {
		try {
			let t = this.jsonPath(obj, jsonpath);
			return t;
		} catch (e) {
			return false;
		}
	}

	jsonPath(obj, expr, arg?) {
		var P = {
			resultType: arg && arg.resultType || "VALUE",
			result: [],
			normalize: function (expr) {
				var subx = [];
				return expr.replace(/[\['](\??\(.*?\))[\]']|\['(.*?)'\]/g, function ($0, $1, $2) {
					return "[#" + (subx.push($1 || $2) - 1) + "]";
				}) /* http://code.google.com/p/jsonpath/issues/detail?id=4 */
					.replace(/'?\.'?|\['?/g, ";")
					.replace(/;;;|;;/g, ";..;")
					.replace(/;$|'?\]|'$/g, "")
					.replace(/#([0-9]+)/g, function ($0, $1) {
						return subx[$1];
					});
			},
			asPath: function (path) {
				var x = path.split(";"),
					p = "$";
				for (var i = 1, n = x.length; i < n; i++)
					p += /^[0-9*]+$/.test(x[i]) ? ("[" + x[i] + "]") : ("['" + x[i] + "']");
				return p;
			},
			store: function (p, v) {
				if (p) P.result[P.result.length] = P.resultType == "PATH" ? P.asPath(p) : v;
				return !!p;
			},
			trace: function (expr, val, path) {
				if (expr !== "") {
					var x = expr.split(";"),
						loc = x.shift();
					x = x.join(";");
					if (val && val.hasOwnProperty(loc))
						P.trace(x, val[loc], path + ";" + loc);
					else if (loc === "*")
						P.walk(loc, x, val, path, function (m, l, x, v, p) {
							P.trace(m + ";" + x, v, p);
						});
					else if (loc === "..") {
						P.trace(x, val, path);
						P.walk(loc, x, val, path, function (m, l, x, v, p) {
							typeof v[m] === "object" && P.trace("..;" + x, v[m], p + ";" + m);
						});
					} else if (/^\(.*?\)$/.test(loc)) // [(expr)]
						P.trace(P.eval(loc, val, path.substr(path.lastIndexOf(";") + 1)) + ";" + x, val, path);
					else if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
						P.walk(loc, x, val, path, function (m, l, x, v, p) {
							if (P.eval(l.replace(/^\?\((.*?)\)$/, "$1"), v instanceof Array ? v[m] : v, m)) P.trace(m + ";" + x, v, p);
						}); // issue 5 resolved
					else if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
						P.slice(loc, x, val, path);
					else if (/,/.test(loc)) { // [name1,name2,...]
						for (var s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++)
							P.trace(s[i] + ";" + x, val, path);
					}
				} else
					P.store(path, val);
			},
			walk: function (loc, expr, val, path, f) {
				if (val instanceof Array) {
					for (var i = 0, n = val.length; i < n; i++)
						if (i in val)
							f(i, loc, expr, val, path);
				} else if (typeof val === "object") {
					for (var m in val)
						if (val.hasOwnProperty(m))
							f(m, loc, expr, val, path);
				}
			},
			slice: function (loc, expr, val, path) {
				if (val instanceof Array) {
					var len = val.length,
						start = 0,
						end = len,
						step = 1;
					loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function ($0, $1, $2, $3) {
						start = parseInt($1 || start);
						end = parseInt($2 || end);
						step = parseInt($3 || step);
					});
					start = (start < 0) ? Math.max(0, start + len) : Math.min(len, start);
					end = (end < 0) ? Math.max(0, end + len) : Math.min(len, end);
					for (var i = start; i < end; i += step)
						P.trace(i + ";" + expr, val, path);
				}
			},
			eval: function (x, _v, _vname) {
				try {
					return $ && _v && eval(x.replace(/(^|[^\\])@/g, "$1_v").replace(/\\@/g, "@"));
				} // issue 7 : resolved ..
				catch (e) {
					throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/(^|[^\\])@/g, "$1_v").replace(/\\@/g, "@"));
				} // issue 7 : resolved ..
			}
		};

		var $ = obj;
		if (expr && obj && (P.resultType == "VALUE" || P.resultType == "PATH")) {
			P.trace(P.normalize(expr).replace(/^\$;?/, ""), obj, "$"); // issue 6 resolved
			return P.result.length ? P.result : false;
		}
	}

	jsonurl() {
		window.open('https://restfulapi.net/json-jsonpath/');
	}


	onKeydown(l, a, b, jsonvalue) {
		console.log(l);
		try {
			JSON.parse(l);
			if (jsonvalue != undefined && b == 'updatejsonmatchbutton') {
				this.TestJsonPath(l, jsonvalue, 'update')
			}
			if (jsonvalue != undefined && b == 'jsonmatchbutton') {
				this.TestJsonPath(l, jsonvalue, 'add')
			}
			if (jsonvalue == undefined || jsonvalue == "" || this.nomatch == true) {
				if (b == 'jsonmatchbutton') {
					this.righttextarea = "No Match";
				}
			}
			if (jsonvalue == undefined || jsonvalue == "" || this.nomatch == true) {
				if (b == 'updatejsonmatchbutton') {
					this.updaterighttextarea = "No Match";
				}
			}
			document.getElementById(a).style.borderColor = "";
			return;
		} catch (e) {
			if (b == 'updatejsonmatchbutton') {
				this.updaterighttextarea = "Json Parse Error";
			}

			if (b == 'jsonmatchbutton') {
				this.righttextarea = "Json Parse Error";
			}
			console.log("Error Triggered")
			document.getElementById(a).style.borderColor = "red";

		}


	}
	scopevaluechange() {
		this.domselector = undefined;
		this.httpurl = undefined;
	}

	updatescopevaluechange() {
		this.updatedomselector = undefined;
		this.updatehttpurl = undefined;
	}

	ResetRule() {
		this.updateVar = false;
		this.rulesvalue = undefined;
		this.fail = 0x0;
		this.matchingtext = undefined;
	}

	updateResetRule() {
		this.UupdateVar = false;
		this.updaterulesvalue = undefined;
		this.updatefail = 0x0;
		this.updatematchingtext = undefined;
	}


	jsonfailvaluechanged(e) {
		console.log(e);
		if (e.value != 1 || e.value != 0)
			this.matchingenable = true;

		if (e.value == 1 || e.value == 0)
			this.matchingenable = false;
	}

	updatejsonfailvaluechanged(e) {
		console.log(e);
		if (e.value != 1 || e.value != 0)
			this.updatematchingenable = true;

		if (e.value == 1 || e.value == 0)
			this.updatematchingenable = false;
	}

	resetseletordialog() {
		this.textpattern = undefined;
		this.regextextstring = undefined;
		this.leftboundtextpattern = undefined;
		this.leftregextextstring = undefined;
		this.rightboundtextpattern = undefined;
		this.regex = false;
		this.rightregextextstring = undefined;
		this.regexspecific = false;
		this.textignorecase = false;
		this.jsonignorecase = false;
		this.jsonpath = undefined;
		this.ignorecasejsonpath = false;
		this.lefttextarea = undefined;
		this.righttextarea = undefined;
		this.leftregexspecific = false;
		this.leftignore = false;
		this.rightregexspecific = false;
		this.rightignorecheckvalue = false;
	}
	CancelSelector() {
		document.getElementById("savecpid")["disabled"] = false;
	}
	UpdateCancelSelector() {
		document.getElementById("updatesavecpid")["disabled"] = false;
	}

	updateresetseletordialog() {
		this.updatetextignorecase = false;
		this.updaterightregex = false;
		this.updaterightignore = false;
		this.updateleftignore = false;
		this.updateleftregex = false;
		this.updateregexspecific = false;
		this.updateregextextstring = undefined;
		this.updatetextpattern = undefined;
		this.updateleftboundtextpattern = undefined;
		this.updateleftregextextstring = undefined;
		this.updaterightboundtextpattern = undefined;
		this.updaterightregextextstring = undefined;

		this.updatejsonpath = undefined;
		this.updateignorecasejsonpath = false;
		this.updatelefttextarea = undefined;
		this.updaterighttextarea = undefined;
		this.regexspecific = false;
		this.textignorecase = false;
	}
}
