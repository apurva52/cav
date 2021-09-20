import { SelectItem } from "primeng";


export interface Subject {
	tags?: HierarchyInfo[];
}

export interface HierarchyInfo{
	key?: string;
	value?: string;
	mode?: number;
}

export interface Status {
	code?: number;
	msg?: string;
	detailedMesssage?: string;
}

export interface Cctx{
	cck?: string;
	pk?: string;
	u?: string;
	prodType?: string;
}

export interface ParametersData {
	data?: any[];
	tier : SelectItem[];
	server: SelectItem[];
	instance: SelectItem[];
}


export interface hierarchicalPayload {

	opType: number,
	tr: number,
	cctx: {
			cck: string,
			pk: string,
			u: string,
			prodType: string
	},
	duration: {
			st: number,
			et: number,
			preset: string
	},
	clientId: string,
	appId: string,
	glbMgId: string,
	subject: {
			tags: [
					{
							key: string,
							value: string,
							mode: number
					}

			]
	}

}