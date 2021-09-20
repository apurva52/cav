import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng';
import { UxaAgentSettingTable } from './service/ux-agent-setting.model';
import { MetadataService } from './../common/service/metadata.service';
import { Metadata } from '../common/interfaces/metadata';
import { NvhttpService } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import { Util } from 'src/app/pages/home/home-sessions/common/util/util';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { SessionStateService } from '../session-state.service';
import { Store } from 'src/app/core/store/store';
import 'moment-timezone';
@Component({
	selector: 'app-ux-agent-setting',
	templateUrl: './ux-agent-setting.component.html',
	styleUrls: ['./ux-agent-setting.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [Metadata, MessageService]
})
export class UxAgentSettingComponent implements OnInit {

	data: UxaAgentSettingTable;
	breadcrumb: MenuItem[];
	addnewconfiguration = false;
	busy: boolean = false;
	addflag: boolean = true;
	readonly: boolean = false;
	nchannel: any;
	ntype: any;
	profile_name: any[];
	type: any;
	description: any;
	name: any;
	library: boolean = false;
	channel: any;
	agentform = false;
	button: boolean;
	deletebutton: boolean;
	editbutton: boolean;
	tabledatavalue: any;
	copyProfile: boolean;
	pfname: any;
	notypename: any;
	adminflag: boolean;
	copypathname: any;
	copyflag: boolean = false;
	metadata: Metadata;
	noprofile: string;
	channelvalues: any;
	constructor(private router: Router, private sessionstateservice: SessionStateService, private confirmationService: ConfirmationService, private messageService: MessageService, private httpService: NvhttpService, private metadataService: MetadataService) {
		this.metadata = new Metadata();
	}
	ngOnInit() {
		this.breadcrumb = [
			{ label: 'Home', routerLink: '/home/dashboard' },
			{ label: 'Sessions', routerLink: '/home/home-sessions' },
			{ label: 'UX-Agent-Settings' }
		];
		console.log("agent-settings ngOnInit called ");
		this.start();
		this.adminflag = this.sessionstateservice.isAdminUser();
		console.log("ADMIN", this.adminflag)
	}



	start() {
		this.metadataService.getMetadata().subscribe(response => {
			this.metadata = response;
			let channelm: any[] = Array.from(this.metadata.channelMap.keys());
			this.nchannel = channelm.map(key => {
				return {
					label: this.metadata.channelMap.get(key).name,
					value: this.metadata.channelMap.get(key).id
				}
			});
			this.getcarddata(response);
		});

		this.ntype = [{
			label: 'Web Application ',
			value: "0"
		},
		{
			label: 'Ios Application ',
			value: "3"
		},
		{
			label: 'Android App',
			value: "1"
		},
		{
			label: 'Windows App',
			value: "2"
		},
		{
			label: 'React Native App',
			value: "4"
		},

		];
		this.type = "0";
	}




	CloseDialog() {
		document.getElementById("validateAdd")["disabled"] = false;
		this.addnewconfiguration = false;
	}
	// to open fresh config.js gui
	AddNewConfiguration() {
		this.profile_name = [];
		this.addnewconfiguration = true;
		this.name = '';
		this.channel = undefined;
		this.copyProfile = false;
		this.pfname = null;
		this.description = '';
		for (var m of this.tabledatavalue) {
			if (this.type == m.type) {
				this.noprofile = "false"
				this.profile_name.push(
					{ label: m.name, value: m.name }
				)
			}

		}
		if (this.profile_name.length == 0) {
			for (var t of this.ntype) {
				if (this.type == t.value) {
					this.noprofile = "false";
					this.notypename = t.label
				}
			}
		}


	}
	OpenNewConfiguration() {
		document.getElementById("validateAdd")["disabled"] = false;
		this.library = true;
		let format = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
		if (this.name == '') {

			this.messageService.add({ severity: 'warn', summary: 'Please enter  Profile name', detail: '' });
			return;
		}
		if (this.name.match(format)) {
			this.messageService.add({ severity: 'warn', summary: 'Invalid Profile Name as Profile Name  cannot be a Special Character', detail: '' });
			return;
		}
		if (this.name.includes(" ")) {
			this.messageService.add({ severity: 'warn', summary: 'Profile Name Should Not Contain Any spaces', detail: '' });
			return;
		}
		if (this.name.includes(".")) {
			this.messageService.add({ severity: 'warn', summary: 'Profile Name Should Not Contain any Dot', detail: '' });
			return;
		}
		if (this.tabledatavalue.length > 0) {
			for (var k of this.tabledatavalue) {
				if (k.name == this.name) {
					this.messageService.add({ severity: 'warn', summary: 'This Profile name Already Exist Please Enter Other Profile Name ', detail: '' });
					return;
				}
			}
		}
		this.addflag = true;
		if (!this.copyProfile)
			this.copyflag = false;
		if (this.copyProfile) {
			if (this.pfname == null) {
				this.messageService.add({ severity: 'warn', summary: 'Please Select  Profile name ', detail: '' });
				return;
			}
			this.copyflag = true;
			for (var p of this.tabledatavalue) {
				if (this.pfname == p.name) {
					this.copypathname = p.path;
				}
			}

		}


		if (this.description == '') {

			this.messageService.add({ severity: 'warn', summary: 'Please enter Description ', detail: '' });
			return;
		}
		if (this.channel == undefined) {

			this.messageService.add({ severity: 'warn', summary: 'Please Select the Channel Name ', detail: '' });
			return;
		}

		this.addnewconfiguration = false;
		this.router.navigate(["/edit-ux-agent-setting"], {
			replaceUrl: true, queryParams: {
				Description: this.description,
				Type: this.type,
				Channel: this.channel,
				Name: this.name,
				AddFlag: this.addflag,
				CopyFlag: this.copyflag,
				CopyPathName: this.copypathname,
				data: JSON.stringify(this.tabledatavalue)
			}
		});
		this.agentform = true;
	}
	getcarddata(metadata) {
		this.busy = true;
		this.httpService.getAgentDBData().subscribe((state: Store.State) => {
			let response = state['data'];
			if (response != null && response.length > 0) {
				for (var k of response) {
					this.channelvalues = Util.getChannelNames(k.channelId.toString().split(','), metadata);
					k.channel = this.channelvalues;
					k["lasteditsecond"] = k.lastEdit;
					let formattime = (k.lastEdit) * 1000;
					//let date = new Date(formattime)
					//let d = date.getDate()+ "/" + (date.getMonth() + 1) + "/" + date.getFullYear() + " " + ("00" + date.getHours()).slice(-2) + ":" + ("00" + date.getMinutes()).slice(-2) + ":" + ("00" + date.getSeconds()).slice(-2);
					let d = moment.utc(formattime).tz(sessionStorage.getItem('_nvtimezone')).format('DD/MM/YYYY HH:mm:ss');
					k.lastEdit = d;
				}
				this.tabledatavalue = response;
				this.busy = false;
				console.log("lllsee--", this.tabledatavalue);
			} else {
				this.tabledatavalue = [];
				this.busy = false;
			}
		});
	}
	DeleteConfiguration(data) {

		this.confirmationService.confirm({
			message: 'Are you sure that you want to Delete ?',
			header: 'Confirmation Dialog',
			icon: 'pi pi-exclamation-triangle',
			accept: () => {
				this.httpService.deleteCardData(data.name).subscribe(response => {
					if (response) {
						console.log("response : ", response);

						this.getcarddata(this.metadata);
					}
				});
				this.messageService.add({ severity: 'success', summary: 'Deleted Successfully', detail: '' });
			}
		});

	}
	removecontent() {
		this.noprofile = "false";
		document.getElementById("validateAdd")["disabled"] = false;
	}
	checkcontent() {
		if (this.profile_name.length == 0) {
			this.noprofile = "true";
			document.getElementById("validateAdd")["disabled"] = "true";
			for (var t of this.ntype) {
				if (this.type == t.value) {
					this.notypename = t.label
				}
			}
		}
	}

	EditConfiguration(data) {
		if (this.editbutton == false)
			this.readonly = true;
		if (this.editbutton == true)
			this.readonly = false;
		this.copyflag = false;
		this.addflag = false;
		let name = data.name;
		let description = data.description;
		let channel = data.channel;
		let type = data.type;
		let lastactivated = data.lastActivated;
		let lastedit = data.lasteditsecond;
		let path = data.path;
		this.router.navigate(["/edit-ux-agent-setting"], {
			replaceUrl: false, queryParams: {
				Description: description,
				Type: type,
				Channel: channel,
				Name: name,
				Readonly: this.adminflag,
				CopyFlag: this.copyflag,
				AddFlag: this.addflag,
				LastActiavted: lastactivated,
				LastEdit: lastedit,
				CopyPathName: path,
				data: JSON.stringify(this.tabledatavalue)
			}
		});
	}
	getProfileName() {
		if (!this.copyProfile)
			this.noprofile = "false";
		this.profile_name = [];
		for (var k of this.tabledatavalue) {
			if (this.type == k.type) {
				this.profile_name.push(
					{ label: k.name, value: k.name }
				)
				this.noprofile = "false";
			}
		}
		if (this.profile_name.length == 0) {
			for (var t of this.ntype) {
				if (this.type == t.value) {
					this.noprofile = "false";
					this.notypename = t.label
				}
			}
			if (!this.copyProfile)
				this.noprofile = "false";
			else {
				document.getElementById("validateAdd")["disabled"] = "true";
				this.noprofile = "true"
			}
		}
		else {
			document.getElementById("validateAdd")["disabled"] = false;
		}
	}
}




