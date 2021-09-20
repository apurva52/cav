import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
    selector: '[validateFor]'
})
export class ValidationDirective {
    // Allow decimal numbers and negative values
    private regexNum: RegExp = new RegExp(/^-?[0-9]+(\.[0-9]*){0,1}$/g);
    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = ['Backspace', 'Tab', 'End', 'Home'];

    constructor(private el: ElementRef) {
    }
    @Input() validateFor: any;
    @HostListener('keydown', ['$event'])
    onKeyDown(event: KeyboardEvent) {
        // Allow Backspace, tab, end, and home keys
        if (this.validateFor == 'string') {
            alert('string')
        }
        else if (this.validateFor == 'number') {
            if (this.specialKeys.indexOf(event.key) !== -1) {
                return;
            }
            let current: string = this.el.nativeElement.value;
            let next: string = current.concat(event.key);
            if (next && !String(next).match(this.regexNum)) {
                event.preventDefault();
            }
        }
    }
}