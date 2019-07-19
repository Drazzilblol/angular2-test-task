import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {now} from 'moment';

@Component({
    selector: 'datepicker',
    templateUrl: './datePicker.template.html',
})
export class DatePickerComponent implements OnInit {
    @Input() public currentDate: Date = new Date(now());
    public thisMonth: Date[] = [];
    @Output() public onSelectDate = new EventEmitter();
    public firstDate: Date;
    public secondDate: Date;
    public selectedElement;

    public ngOnInit(): void {
        const daysInMonth = this.getDaysInMonth(this.currentDate.getMonth(), this.currentDate.getFullYear());
        for (let i = 1; i <= daysInMonth; i++) {
            this.thisMonth.push(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i));
        }
    }

    public getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    public getDayInWeek(date: Date) {
        if (date.getDay() > 0) {
            return date.getDay();
        } else {
            return 7;
        }
    }

    public getWeek(date) {
       /* const first = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
        if (first.getDay() > 0) {
            return Math.floor((date.getDate() + first.getDay() - 1) / 7) + 1;
        } else {
            return Math.floor((date.getDate() + 6) / 7) + 1;
        }*/
    }

    public selectDate(date: Date, event) {
        if (!this.firstDate) {
            this.firstDate = date;
            this.selectedElement = event.target;
            this.selectedElement.style.backgroundColor = 'blue';
        } else {
            this.secondDate = date;
            this.onSelectDate.emit({firstDate: this.firstDate, secondDate: this.secondDate});
            this.firstDate = null;
            this.secondDate = null;
            this.selectedElement.style.backgroundColor = 'white';
        }
    }
}
