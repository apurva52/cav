import { MenuItem } from 'primeng';
import { ObjectUtility } from './object';

export namespace MenuItemUtility {

    export function search(fn: (item: MenuItem) => boolean, items: MenuItem[]): MenuItem {
        let found: MenuItem = null;
        if (items && fn) {
            for (const item of items) {
                if (fn(item)) {
                    found = item;
                    break;
                }

                if (item.items) {
                    found = search(fn, item.items);

                    if (found) {
                        break;
                    }
                }
            }
        }

        return found;
    }

    export function searchById(id: any, items: MenuItem[]): MenuItem {
        return search((item: MenuItem) => {
            return item.id === id;
        }, items);
    }

    export function searchByAnyKey(id: any, items: any[], key: string): MenuItem {
        return search((item: any) => {
            return item[key] === id;
        }, items);
    }

    export function map(fn: (item: MenuItem) => void, items: MenuItem[]) {
        if (items && fn) {
            for (const item of items) {
                if (item.items) {
                    map(fn, item.items);
                } else {
                    fn(item);
                }
            }
        }
    }

    export function filter(fn: (item: MenuItem) => boolean, items: MenuItem[]): MenuItem[] {
        const found: MenuItem[] = [];
        if (items && fn) {
            for (const item of items) {
                if (item.items) {
                    found.push(...filter(fn, item.items));
                } else if (fn(item)) {
                    found.push(item);
                }
            }
        }

        return found;
    }

    export function filterWithParent(fn: (item: MenuItem) => boolean, items: MenuItem[]): MenuItem[] {
        const found: MenuItem[] = [];
        if (items && fn) {
            for (const item of items) {


                if (item.items) {
                    const itemsFound = filterWithParent(fn, item.items);

                    if (itemsFound.length) {
                        const newItem = ObjectUtility.duplicate(item); //JSON.parse(JSON.stringify(item));
                        newItem.items = itemsFound;

                        found.push(newItem);
                    }
                } else if (fn(item)) {
                    found.push(item);
                }else if(item.label == "Auto") {
                  found.push(item);
                 }


            }
        }

        return found;
    }

    export function deepEqual(object1, object2, keysToIgnore?: any[])
    {
        //console.log("object1 == ", object1, " , object2", object2);
        const me = this;
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);

        if (keys1.length !== keys2.length) {
            //console.log("keys1 == ", keys1, ", keys2 == ", keys2)
            return false;
        }

        for (const key of keys1) {

            if(keysToIgnore)
            {
                let isKeyPresent = keysToIgnore.find((keyToIgnore) => key.includes(keyToIgnore));
                if(isKeyPresent)
                  continue;
            }

            const val1 = object1[key];
            const val2 = object2[key];
            const areObjects = isObject(val1) && isObject(val2);
            if (
            areObjects && !deepEqual(val1, val2, keysToIgnore) ||
            !areObjects && val1 !== val2
            ) {
                //console.log("val1 == ", val1, ", val2 == ", val2)
            return false;
            }
        }

        return true;
    }

    export function isObject(object) {
        return object != null && typeof object === 'object';
    }

}
