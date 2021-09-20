import { PipeTransform, Pipe } from '@angular/core';

@Pipe({ name: 'keys',
 	pure: false // Used for detecing changes in pipes input
     })
export class KeysPipe implements PipeTransform {
    transform(value, args: string[]): any {
        let keys = [];
        for (let key in value) {
            keys.push({ key: key, value: value[key] });
        }
        return keys;
    }
}


@Pipe({ name: 'modifiedName',
 	pure: false // Used for detecing changes in pipes input
     })
export class LabelPipe implements PipeTransform {
    transform(value, args: string[]): any {
        if(value.toUpperCase().startsWith("JDBC") || value.toUpperCase().startsWith("DB") || value.toUpperCase().startsWith("HTTP") ||
           value.toUpperCase().startsWith("EHCACHE") || value.toUpperCase().startsWith("LDAP"))
            return value.substring(value.indexOf('_') + 1);
        else 
            return value;
    }
}
