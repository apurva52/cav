import {Directive, ElementRef, Input} from '@angular/core';

@Directive({
    selector: '[customAutoFocus]'
})

export class autoFocusDirective{
    customAutoFocus: boolean;
    constructor(element: ElementRef){
        element.nativeElement.focus();
    }

    @Input() set autofocus(condition: boolean)
    {
        this.customAutoFocus = condition != false;
    }
}