import { Injectable } from '@angular/core';
import { SelectItem } from 'primeng/primeng';

@Injectable()
export class UtilityService {

    constructor() { }

    static createDropdown(list: any): SelectItem[] {
        let selectItemList: SelectItem[] = [];

        for (let index in list) {
            if (list[index].indexOf("--Select") != -1) {
                selectItemList.push({ label: list[index], value: '' });
            }
            else {
                selectItemList.push({ label: list[index], value: list[index] });
            }
        }

        return selectItemList;
    }

    static createListWithKeyValue(arrLabel: string[], arrValue: string[]): SelectItem[] {
        let selectItemList = [];

        for (let index in arrLabel) {
            selectItemList.push({ label: arrLabel[index], value: arrValue[index] });
        }

        return selectItemList;
    }

    static push(arr, newEntry) {
        return [...arr, newEntry]
    }

    static delete(arr, index) {
        return arr.slice(0, index).concat(arr.slice(index + 1))
    }

    static replace(arr, newEntry, index) {
        arr[index] = newEntry;
        return arr.slice();
    }

    static unshift(arr, newEntry) {
        return [newEntry, ...arr]
    }

    static splice(arr, start, deleteCount, ...items) {
        return [...arr.slice(0, start), ...items, ...arr.slice(start + deleteCount)]
    }
}



