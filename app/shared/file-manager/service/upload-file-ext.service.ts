import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class FileUploadExtService {

    commonList = ['txt'];
    ExtensionList = {
        "scenario": ['pem', 'cer', 'crt', 'p7b', 'p7r', 'p12', 'pfx'],
        "nd-config": ['txt', 'btr', 'btt', 'cd', 'err', 'mml', 'eml', 'ecf', 'hmc', 'xml', 'adr', 'conf', 'dat', 'json', 'ads', 'tar'],
        "nd-config-secure-mode": ['txt', 'btr', 'btt', 'cd', 'err', 'mml', 'eml', 'ecf', 'hmc', 'xml', 'adr', 'conf', 'dat', 'json', 'ads', 'tar'],
        "tabular-from-file-widget": ['txt', 'csv', 'xls', 'xlsx', 'text'],
        "access-log": ['log', 'txt'],
        "alert": ['json']
    };

    constructor() {
    }

    public fileExtensions(moduleName) {
        for (let key in this.ExtensionList) {
            if (key === moduleName) {
                return this.ExtensionList[key];
            }
        }
    }

}