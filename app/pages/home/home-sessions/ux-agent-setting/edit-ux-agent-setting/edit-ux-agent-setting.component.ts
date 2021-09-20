import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { MetadataService } from './../../common/service/metadata.service';
import { Metadata } from '../../common/interfaces/metadata';
import { NvhttpService } from 'src/app/pages/home/home-sessions/common/service/nvhttp.service';
import { Util } from 'src/app/pages/home/home-sessions/common/util/util';
import { MessageService, SelectItem } from 'primeng/api';
import { Store } from 'src/app/core/store/store';
import { ConfirmationService } from 'primeng/api';
import { environment } from 'src/environments/environment';
import { SessionStateService } from '../../session-state.service';

@Component({
	selector: 'app-edit-ux-agent-setting',
	templateUrl: './edit-ux-agent-setting.component.html',
	styleUrls: ['./edit-ux-agent-setting.component.scss'],
	encapsulation: ViewEncapsulation.None,
	providers: [Metadata, MessageService]
})
export class EditUxAgentSettingComponent extends Store.AbstractService implements OnInit {
	base = environment.api.netvision.base.base;
	downloadOptions: MenuItem[];
	isShow: boolean = true;
	items: MenuItem[];
	temp2: any;
	breadcrumb: MenuItem[] = [];
	savebusy = false;
	hpdname: any;
	metadata: Metadata;
	display: boolean;
	selectedItem: any;
	busy: boolean = true;
	readonly: boolean = false;
	hpdloader: any;
	versionprofilename: any;
	readon: any;
	baconurl: any;
	keydata: any[];
	configgui: boolean = false;
	loadedconfig: any;
	versionpath: any;
	valuedata: any[];
	sitedomain: any;
	nchannel: any;
	addflag: any;
	msgs: any;
	profilearray: any[];
	channnel: any;
	Status: string;
	dataflushinterval: any;
	cookiesize: any;
	pagelist: any;
	versionfileupload: any;
	name: any;
	channel: any;
	type: any;
	filelist: any[];
	descriptionvalue: any;
	noversions: string;
	previousversions: string;
	channelarray: any;
	channelvalue: any;
	formSchema: any;
	uploaddata: any;
	data: any;
	npage: any;
	jsonFile: any;
	copypathname: any;
	copyflag: any;
	dynamicmetadata: any = {};
	sidePanelPosition = 'left';
	btnstyle = {
		width: '61px',
		height: '55px',
		'border-radius': '50%',
		position: 'fixed',
		bottom: '30px',
		right: '30px',
		cursor: 'pointer',
		'font-size': '14px',
		'box-shadow': '0px 2px 5px #666'
	};
	//jsonFile = FormSchema['default'];
	tabledata: any;
	lastactivated: any;
	lastedit: any;
	HPDValidate: boolean;
	adminUser: boolean;


	constructor(private router: Router, private confirmationService: ConfirmationService, private messageService: MessageService, private location: Location, private httpService: NvhttpService, private metadataService: MetadataService, private route: ActivatedRoute, private stateService: SessionStateService) {
		super();
		this.metadata = new Metadata();
		this.metadataService.getMetadata().subscribe(response => {
			this.metadata = response;
			let channelm: any[] = Array.from(this.metadata.channelMap.keys());
			this.nchannel = channelm.map(key => {
				return {
					label: this.metadata.channelMap.get(key).name,
					value: this.metadata.channelMap.get(key).id
				}
			});
			const pagem: any[] = Array.from(this.metadata.pageNameMap.keys());
			this.npage = pagem.map(key => {
				return {
					label: this.metadata.pageNameMap.get(key).name,
					value: parseInt(this.metadata.pageNameMap.get(key).id)
				};
			});

			const eventm: any[] = Array.from(this.metadata.eventMap.keys());
			let events = eventm.map(key => {
				return {
					label: this.metadata.eventMap.get(key).name,
					value: this.metadata.eventMap.get(key).name
				}
			});

			const cmetric: any[] = Array.from(this.metadata.customMetricMap.keys());
			const custommetrics: SelectItem[] = cmetric.map(key => {
				return {
					label: this.metadata.customMetricMap.get(key).name,
					value: this.metadata.customMetricMap.get(key).id
				}
			});

			this.dynamicmetadata['events'] = events;
			this.dynamicmetadata["channelMap"] = this.nchannel;
			for (var i = 0; i < this.npage.length; i++) {
				if (this.npage[i].label == "Others")
					this.npage.splice(i, 1);
			}
			this.dynamicmetadata["Pages"] = this.npage;
			this.dynamicmetadata['CustomMetrics'] = custommetrics;

			console.log("metadata", this.dynamicmetadata);

		});
		this.formSchema = "dsd";
		this.httpService = httpService;


	}

	ngOnInit(): void {
		this.breadcrumb = [
			{ label: 'Home', routerLink: '/home/dashboard' },
			{ label: 'Sessions', routerLink: '/home/home-sessions' },
			{ label: 'UX-Agent-Settings', routerLink: '/ux-agent-setting' },
			{ label: 'Edit UX-Agent-Settings' }
		];

		// get the user permission
		this.adminUser = this.stateService.isAdminUser();

		const me = this;
		this.route.queryParams
			.subscribe(params => {
				this.descriptionvalue = params['Description'];
				this.name = params['Name'];
				this.readon = params['Readonly'];
				this.type = params['Type'];
				this.channel = params['Channel'];
				this.addflag = params['AddFlag'];
				this.uploaddata = params['Data'];
				this.lastedit = params['LastEdit'];
				this.lastactivated = params['LastActiavted'];
				this.copypathname = params['CopyPathName'];
				this.copyflag = params['CopyFlag'],
					this.data = params['data'];
				if (this.readon == "false")
					this.readonly = true;
				if (this.readon == "true")
					this.readonly = false;
				this.tabledata = JSON.parse(this.data);
				if (this.addflag == "false") {
					if (this.lastedit > this.lastactivated) {
						this.HPDValidate = false;
						this.Status = "Inactive";
					} else
						this.Status = "Active";
					if (this.readon == "true") {
						//this.readonly = true;
						this.HPDValidate = true;
					}
					this.channelvalue = this.channel;
				}
				if (this.addflag == "true") {
					this.Status = "Inactive";
					this.HPDValidate = true;
					this.configgui = true;
					//this.readonly = false;
					let channelarray = this.channel.toString().split(',')
					//this.busy = false;
					this.channelvalue = Util.getChannelNames(channelarray, this.metadata);
				}

				//load profile on basis of type. 
				if (this.type == 0) {
					let url: any = environment.api.netvision.jsAgentConfigLayout.endpoint;
					this.controller.get(url, null, this.base).subscribe((data1) => {

						this.setDefaultValue(data1);

						let response = data1;
						console.log('JSON File loaded');
						this.jsonFile = response;
						if (this.addflag == "false")
							this.UploadConfig("config.js", this.copypathname);
						if (this.copyflag == "true") {
							this.UploadConfig("config.js", this.copypathname);
							this.configgui = false;
							if (this.temp2 != undefined) {
								this.configgui = true;
								this.jsonFile = this.temp2;
								this.busy = false;
							}
						}
						if (this.copyflag == "false" && this.addflag == "true") {
							this.busy = false;
						}

					});
				} else if (this.type == 3) {

					let url: any = environment.api.netvision.iosSdkConfigLayout.endpoint;
					this.controller.get(url, null, this.base).subscribe((data1) => {

						this.setDefaultValue(data1);

						let response = data1;
						console.log('JSON File loaded');
						this.jsonFile = response;
						if (this.addflag == "false")
							this.UploadConfig("config.js", this.copypathname);
						if (this.copyflag == "true") {
							this.UploadConfig("config.js", this.copypathname);
							this.configgui = false;
							if (this.temp2 != undefined) {
								this.configgui = true;
								this.jsonFile = this.temp2;
								this.busy = false;
							}
						}
						if (this.copyflag == "false" && this.addflag == "true") {
							this.busy = false;
						}
					});

				}
				else if (this.type == 1) {
					let url: any = environment.api.netvision.androidSdkConfigLayout.endpoint;
					this.controller.get(url, null, this.base).subscribe((data1) => {

						this.setDefaultValue(data1);

						let response = data1;
						console.log('JSON File loaded');
						this.jsonFile = response;
						if (this.addflag == "false")
							this.UploadConfig("config.js", this.copypathname);
						if (this.copyflag == "true") {
							this.UploadConfig("config.js", this.copypathname);
							this.configgui = false;
							if (this.temp2 != undefined) {
								this.configgui = true;
								this.jsonFile = this.temp2;
								this.busy = false;
							}
						}
						if (this.copyflag == "false" && this.addflag == "true") {
							this.busy = false;
						}
					});
				}
				else if (this.type == 2) {
					let url: any = environment.api.netvision.winSdkConfigLayout.endpoint;
					this.controller.get(url, null, this.base).subscribe((data1) => {

						this.setDefaultValue(data1);

						let response = data1;
						console.log('JSON File loaded');
						this.jsonFile = response;
						if (this.addflag == "false")
							this.UploadConfig("config.js", this.copypathname);
						if (this.copyflag == "true") {
							this.UploadConfig("config.js", this.copypathname);
							this.configgui = false;
							if (this.temp2 != undefined) {
								this.configgui = true;
								this.jsonFile = this.temp2;
								this.busy = false;
							}
						}
						if (this.copyflag == "false" && this.addflag == "true") {
							this.busy = false;
						}
					});

				}
				else if (this.type == 4) {
					let url: any = environment.api.netvision.reactSdkConfigLayout.endpoint;
					this.controller.get(url, null, this.base).subscribe((data1) => {

						this.setDefaultValue(data1);

						let response = data1;
						console.log('JSON File loaded');
						this.jsonFile = response;
						if (this.addflag == "false")
							this.UploadConfig("config.js", this.copypathname);
						if (this.copyflag == "true") {
							this.UploadConfig("config.js", this.copypathname);
							this.configgui = false;
							if (this.temp2 != undefined) {
								this.configgui = true;
								this.jsonFile = this.temp2;
								this.busy = false;
							}
						}
						if (this.copyflag == "false" && this.addflag == "true") {
							this.busy = false;
						}
					});
				}


			});
	}

	setDefaultValue(arr: any[]): void {
		for (const i of arr) {
			if (i.hasOwnProperty('value')) {
				if (!i.hasOwnProperty('defaultValue')) {
					i.defaultValue = i.value
				}
			}

			if (i.hasOwnProperty('fields')) {
				this.setDefaultValue(i.fields);
			}
		}
	}

	//top open side bar to display pervious versions of config.js
	OpenSideBar() {
		this.filelist = [];
		let monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
			"Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
		];
		for (var w of this.tabledata) {
			if (w.name == this.name) {
				this.versionpath = w.path;
				this.addflag = "false";
				this.versionprofilename = w.name;
			}
		}
		this.display = true;
		if (this.addflag == "true") {
			this.noversions = "true";
		}
		if (this.addflag == "false") {
			this.httpService.getProfileRevisions(this.versionprofilename, this.versionpath).subscribe((state: Store.State) => {
				if (state['data'] != null) {
					let response = state['data'];
					let parsesession = response;
					let filelistdata = JSON.parse(parsesession["data"])
					if (filelistdata != null && filelistdata.length > 0) {
						// sort by latest saved version
						filelistdata.sort();
						filelistdata.reverse();

						this.previousversions = "true";
						this.noversions = "false";
						console.log("lllsee--", response);
						for (var k of filelistdata) {
							let splitdata = k.split("config_");
							let configdate = splitdata[1];
							let configtime = configdate.split(".");
							let timeseperate = configtime[0];
							let seperateddata = timeseperate.split("_");
							let time = new Date(seperateddata[0] + "-" + seperateddata[1] + "-" + seperateddata[2]);
							let formattime = (time.getDate() + '-' + monthNames[time.getMonth()] + '-' + time.getFullYear());
							let lasttimedisplay = seperateddata[3] + ":" + seperateddata[4] + ":" + seperateddata[5]
							//var replacetime = formattime.replace(/-/g," ");
							let displaydata = formattime + " " + lasttimedisplay
							this.filelist.push({
								label: displaydata,
								value: k
							});
						}
					} else {
						this.noversions = "true";
					}
				}
			});
		}
	}
	VersionData(row) {
		this.versionfileupload = row;
		this.confirmationService.confirm({
			message: 'Are you sure that you want to restore ' + row + ' ?',
			header: 'Confirmation Dialog',
			icon: 'pi pi-exclamation-triangle',
			accept: () => {
				this.display = false;
				if (this.type == 0) {
					let url: any = environment.api.netvision.jsAgentConfigLayout.endpoint;
					this.controller.get(url, null, this.base).subscribe((data1) => {
						//let response = data1;
						console.log('JSON File loaded');
						//this.jsonFile = response;
					});
				}
				if (this.type == 3) {
					let url: any = environment.api.netvision.iosSdkConfigLayout.endpoint;
					this.controller.get(url, null, this.base).subscribe((data1) => {
						let response = data1;
						console.log('JSON File loaded');
						this.jsonFile = response;
					});
				}
				if (this.type == 1) {
					let url: any = environment.api.netvision.androidSdkConfigLayout.endpoint;
					this.controller.get(url, null, this.base).subscribe((data1) => {
						let response = data1;
						console.log('JSON File loaded');
						this.jsonFile = response;
					});
				}
				if (this.type == 2) {
					let url: any = environment.api.netvision.winSdkConfigLayout.endpoint;
					this.controller.get(url, null, this.base).subscribe((data1) => {
						let response = data1;
						console.log('JSON File loaded');
						this.jsonFile = response;
					});
				}

				if (this.type == 4) {
					let url: any = environment.api.netvision.reactSdkConfigLayout.endpoint;
					this.controller.get(url, null, this.base).subscribe((data1) => {
						let response = data1;
						console.log('JSON File loaded');
						this.jsonFile = response;
					});
				}

				this.configgui = false;
				this.temp2 = undefined;
				this.busy = true;
				for (var l of this.tabledata) {
					if (l.name == this.name) {
						this.copypathname = l.path;
					}
				}
				this.UploadConfig(this.versionfileupload, this.copypathname)
				if (this.temp2 != undefined) {
					this.configgui = false;
					this.busy = false;
					this.messageService.add({ key: 'edit-ux', severity: 'success', summary: row + ' Restored ', detail: '' });
				}
			}
		});
	}
	//to restart hpd
	Activate() {
		this.confirmationService.confirm({
			message: 'Are you sure that you want to apply your changes?',
			header: 'Apply Changes',
			icon: 'pi pi-exclamation-triangle',
			accept: () => {
				this.hpdloader = null;
				for (var p of this.tabledata) {
					if (p.name == this.name) {
						this.hpdname = p.name;
					}
				}
				this.httpService.HpdRestart(this.hpdname).subscribe((state: Store.State) => {
					if (state['data'] != null) {
						let response = state['data'];
						if (response != null) {
							this.hpdloader = response;
							if (response["status"]) {
								if (response["status"] == "failed") {
									this.messageService.add({ key: 'edit-ux', severity: 'warn', summary: response["error"], detail: '' });
								}
							}
							if (response["data"]) {
								let hpddata = JSON.parse(response["data"]);
								if (hpddata.lastedit < hpddata.lastactivated) {
									this.Status = "Active";
									this.HPDValidate = true;
									this.messageService.add({ key: 'edit-ux', severity: 'success', summary: 'Run time changes applied successfully', detail: '' });
								}
							}
						} else {
							this.hpdloader = response;
						}
					}
				});
			},
			reject: () => {
				this.messageService.add({ key: 'edit-ux', severity: 'info', summary: 'You Abort The Changes', detail: '' });
			}
		});
	}
	getResult(data) {
		this.hpdloader = null;
		this.savebusy = true;
		let dataobject = {};
		dataobject["name"] = this.name;
		dataobject["description"] = this.descriptionvalue;
		dataobject["type"] = this.type;
		dataobject["channelid"] = this.channel;
		this.msgs = [];
		this.keydata = [];
		this.valuedata = [];
		const obj: any = {};
		for (const i in data) {
			if (i != 'general') {
				obj[i] = data[i];
			} else {
				for (const j in data.general) {

					obj[j] = data.general[j]
				}
			}

		}
		console.log('arraystructure : ', obj);
		this.profilearray = [];
		for (var j of this.tabledata) {
			this.profilearray.push(j.name);
		}
		let booleanchecking = this.profilearray.includes(this.name);
		if (booleanchecking == false) {
			this.httpService.AddNewProfile(obj, dataobject).subscribe((state: Store.State) => {
				if (state['data'] != null) {
					this.savebusy = false;
					let response = state['data'];
					this.hpdloader = response;
					let saveddata = JSON.parse(response["data"]);
					console.log("data", saveddata);
					if (saveddata.lastedit > saveddata.lastactivated)
					// enable the activate button if last edit time is greater than the last activated time .
					{
						this.HPDValidate = false;
						this.Status = "Inactive";
					}

					this.httpService.getAgentDBData().subscribe((state: Store.State) => {
						let response = state['data'];
						if (response != null && response.length > 0) {
							this.tabledata = response;
						}
					});
					this.messageService.add({ key: 'edit-ux', severity: 'success', summary: 'Saved successfully', detail: '' });
				} else {
					this.hpdloader = false;
					this.savebusy = false;
				}
			});
		}
		for (var l of this.tabledata) {
			if (l.name == this.name) {
				let path = l.path;
				let name = l.name;
				this.httpService.UpdateAgentProfile(obj, name).subscribe((state: Store.State) => {
					if (state['data'] != null) {
						let response = state['data'];
						this.hpdloader = response;
						this.savebusy = false;
						let data = JSON.parse(response["data"]);
						if (data.lastedit > data.lastactivated)
						// enable the activate button if last edit time is greater than the last activated time .
						{
							this.HPDValidate = false;
							this.Status = "Inactive";
						}
						this.httpService.getAgentDBData().subscribe((state: Store.State) => {
							let response = state['data'];
							if (response != null && response.length > 0) {
								this.tabledata = response;
							}
						});
						this.messageService.add({ key: 'edit-ux', severity: 'success', summary: 'Updated successfully', detail: '' });
					} else {
						this.hpdloader = false;
						this.savebusy = false;
					}
				});
			}
		}
		console.log('arraystructure : ', obj);
	}

	// To uplaod config file from backend
	UploadConfig(versionfilename, copypathname) {
		this.httpService.getAgentProfile(copypathname, versionfilename, this.type).subscribe((state: Store.State) => {
			if (state['data'] != null) {
				this.busy = true;
				let temp = state['data'];
				let response = temp;
				this.loadedconfig = response;
				let jsonparsetemp = response["data"];
				var n = JSON.parse(jsonparsetemp);
				let objectdata = Object.keys(n);
				if (this.jsonFile[11] != undefined && this.jsonFile[11].formName == "ABTesting")
					this.jsonFile[11].fields[1].fields[5].controlType = "input";
				this.temp2 = this.jsonFile;
				let temp1 = n;
				for (var i = 0; i < this.temp2.length; i++) {
					for (var j = 0; j < Object.keys(temp1).length; j++) {
						for (var k = 0; k < this.temp2[i].fields.length; k++) {
							for (var s = 0; s < Object.keys(Object.values(temp1)[j]).length; s++) {


								if (this.temp2[i].fields[k].key == Object.keys(temp1)[j])
									if (this.temp2[i].fields[k].controlType == "json") {
										if (this.temp2[i].fields[k].fields) {
											for (var p = 0; p < this.temp2[i].fields[k].fields.length; p++) {
												if (this.temp2[i].fields[k].fields[p].key == Object.keys(Object.values(temp1)[j])[s])
													this.temp2[i].fields[k].fields[p].value = Object.values(Object.values(temp1)[j])[s]
												if (this.temp2[i].fields[k].fields[p].fields) {
													var d = Object.keys(Object.values(Object.values(temp1)[j])[s])
													for (var m = 0; m < d.length; m++) {
														if (this.temp2[i].fields[k].fields[p].fields[m].key == Object.keys(Object.values(Object.values(temp1)[j])[s])[m])

															this.temp2[i].fields[k].fields[p].fields[m].value = Object.values(Object.values(Object.values(temp1)[j])[s])[m]
													}
												}
											}
										}

									}
							}


							if (this.temp2[i].fields[k].key != undefined) {

								if (this.temp2[i].fields[k].key == Object.keys(temp1)[j]) {
									this.temp2[i].fields[k].value = (Object.values(temp1)[j])
								}
							}
							if (this.temp2[i].key == Object.keys(temp1)[j]) {
								if (this.temp2[i].fields[k].fields && !this.temp2[i].fields[k].value) {
									for (var r in this.temp2[i].fields[k].fields) {
										for (var u in Object.values(Object.values(temp1)[j]))


											if (typeof (Object.values(Object.values(temp1)[j])[u]) == "object") {
												let w = Object.values(Object.values(temp1)[j])[u]
												for (var q = 0; q < Object.values(w).length; q++) {
													if ((this.temp2[i].fields[k].fields[r]).key == Object.keys(w)[q]) {
														(this.temp2[i].fields[k].fields[r]).value = Object.values(w)[q]
													}
													let temp222 = Object.values(Object.values(temp1)[j])[u]
												}
											}
									}
								}
								for (var t = 0; t < Object.keys(Object.values(temp1)[j]).length; t++) {
									if (this.temp2[i].fields[k].key == Object.keys(Object.values(temp1)[j])[t])
										if (this.temp2[i].fields[k].value != undefined || this.temp2[i].fields[k].controlType == "jsonarray")
											this.temp2[i].fields[k].value = Object.values(Object.values(temp1)[j])[t]

									if (this.temp2[i].fields[k].key == "XHRModule" && Object.keys(Object.values(temp1)[j])[t] == "XHRModule") {
										console.log("checking", Object.keys(Object.values(temp1)[j])[t])
										if (typeof Object.values(Object.values(temp1)[j])[t] == "object") {
											for (var v = 0; v < Object.keys(Object.values(Object.values(temp1)[j])[t]).length; v++) {
												this.temp2[i].fields[k].fields[v].value = Object.values(Object.values(Object.values(temp1)[j])[t])[v]
												if (typeof Object.values(Object.values(Object.values(temp1)[j])[t])[v] == "object") {
													for (var e = 0; e < Object.keys(Object.values(Object.values(Object.values(Object.values(temp1)[j])[t]))[v]).length; e++) {
														if (this.temp2[i].fields[k].fields[v].fields[e].key == Object.keys(Object.values(Object.values(Object.values(Object.values(temp1)[j])[t]))[1])[e])
															this.temp2[i].fields[k].fields[v].fields[e].value = Object.values(Object.values(Object.values(Object.values(Object.values(temp1)[j])[t]))[1])[e]
														if (typeof (Object.values(Object.values(Object.values(Object.values(Object.values(temp1)[j])[t]))[v])[e]) == "object") {
															for (var o = 0; o < Object.keys(Object.values(Object.values(Object.values(Object.values(Object.values(temp1)[j])[t]))[v])[e]).length; o++) {
																if (this.temp2[i].fields[k].fields[v].fields[e].fields[o].key == Object.keys(Object.values(Object.values(Object.values(Object.values(Object.values(temp1)[j])[t]))[v])[e])[o])
																	this.temp2[i].fields[k].fields[v].fields[e].fields[o].value = Object.values(Object.values(Object.values(Object.values(Object.values(Object.values(temp1)[j])[t]))[v])[e])[o]
															}

														}
													}
												}
											}
										}
									}


								}
							}
						}
					}
				}
				for (var z = 0; z < this.temp2.length; z++) {
					if (this.temp2[z].key == "ABTesting") {
						for (var a = 0; a < this.temp2[z].fields[1].value.length; a++) {
							if (this.temp2[z].fields[1].value[a]["r"] == null)
								this.temp2[z].fields[1].value[a]["r"] = '-';
							if (typeof (this.temp2[z].fields[1].value[a]["r"]) == "object")
								this.temp2[z].fields[1].value[a]["r"] = JSON.stringify(this.temp2[z].fields[1].value[a]["r"])
							if (typeof this.temp2[z].fields[1].value[a]["g"] == "object")
								this.temp2[z].fields[1].value[a]["g"] = JSON.stringify(this.temp2[z].fields[1].value[a]["g"])
						}
					}
				}

				for (var z = 0; z < this.temp2.length; z++) {
					if (this.temp2[z].key == "CHECKPOINT") {
						for (var a = 0; a < this.temp2[z].fields[1].value.length; a++) {
							if (typeof (this.temp2[z].fields[1].value[a]["arg1"]) == "object")
								this.temp2[z].fields[1].value[a]["arg1"] = JSON.stringify(this.temp2[z].fields[1].value[a]["arg1"])
							if (typeof (this.temp2[z].fields[1].value[a]["rules"]) == "object")
								this.temp2[z].fields[1].value[a]["rules"] = JSON.stringify(this.temp2[z].fields[1].value[a]["rules"])

						}
					}
				}
				this.jsonFile = this.temp2;
				this.configgui = true;
				this.busy = false;
			}
		});

		if (this.temp2 != undefined) {
			this.jsonFile = this.temp2;
			this.busy = false;
		}
	}
	MainUI() {
		this.router.navigate(["home/netvision/agent-settings"], {
			replaceUrl: true
		});
	}

	closeSidePanel() {
		const me = this;
		me.isShow = false;
	}
	openSidePanel() {
		const me = this;
		me.isShow = true;
	}

}



