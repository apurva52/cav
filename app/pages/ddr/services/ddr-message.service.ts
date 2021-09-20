import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
 
@Injectable()
export class MessageService {
    private subject = new Subject<any>();
 
    sendMessage(message: any) {
        console.log("Message sevice sendMessgae called!!!!");
        this.subject.next(message);
    }
 
    clearMessage() {
        this.subject.next();
    }
 
    getMessage(): Observable<any> {
        console.log("Message sevice getMessgae called!!!!");
        return this.subject.asObservable();
    }
}