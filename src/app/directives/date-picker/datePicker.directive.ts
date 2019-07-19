import {Directive, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
    selector: '[date-picker]',
})
export class DatePickerDirective {
    @Output() public onDateClick = new EventEmitter();
    @Input() public isDate: boolean;

    @HostListener('click')
    public onClick(): void {
        if (this.isDate) {
            this.onDateClick.emit();
        }
    }
}
