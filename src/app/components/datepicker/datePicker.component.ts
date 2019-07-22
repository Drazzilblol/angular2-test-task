import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {startCase} from 'lodash';
import moment from 'moment';
import {Subscription} from 'rxjs';

@Component({
    selector: 'datepicker',
    templateUrl: './datePicker.template.html',
})
export class DatePickerComponent implements OnInit, OnDestroy {
    public currentDate: Date = new Date(moment.now());
    public thisMonth: Date[] = [];
    @Output() public onSelectDate = new EventEmitter();
    public firstDate: Date;
    public selectedElement;
    public monthName: string;
    public year: number;
    private subscription: Subscription;
    private formatter: Intl.DateTimeFormat;

    constructor(private translate: TranslateService) {
    }

    public ngOnInit(): void {
        this.formatter = new Intl.DateTimeFormat(this.translate.currentLang, {month: 'long'});
        this.recalculateMonth();

        this.subscription = this.translate.onLangChange.subscribe(() => {
            this.formatter = new Intl.DateTimeFormat(this.translate.currentLang, {month: 'long'});
            this.recalculateMonth();
        });
    }

    private recalculateMonth(): void {
        this.monthName = startCase(this.formatter.format(this.currentDate));
        this.year = this.currentDate.getFullYear();
        const daysInMonth = this.getDaysInMonth(this.currentDate.getMonth(), this.currentDate.getFullYear());
        this.thisMonth = [];
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
        const first = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);

        if (first.getDay() > 0) {
            return Math.floor((date.getDate() + first.getDay() - 2) / 7) + 1;
        } else {
            return Math.floor((date.getDate() + 5) / 7) + 1;
        }
    }

    public selectDate(date: Date, event) {
        if (!this.firstDate) {
            this.firstDate = date;
            this.selectedElement = event.target;
            this.selectedElement.style.backgroundColor = 'blue';
        } else {
            this.onSelectDate.emit(DatePickerComponent.createTimeInterval(this.firstDate, date));
            this.firstDate = null;
            this.selectedElement.style.backgroundColor = 'white';
        }
    }

    private static createTimeInterval(firstDate: Date, secondDate: Date) {
        if (moment(firstDate).isSameOrBefore(secondDate)) {
            return {firstDate, secondDate};
        } else {
            return {firstDate: secondDate, secondDate: firstDate};
        }
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    public nextMonth(): void {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        this.recalculateMonth();
    }

    public previousMonth(): void {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        this.recalculateMonth();
    }
}
