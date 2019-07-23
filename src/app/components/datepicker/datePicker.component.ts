import {ChangeDetectionStrategy, Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {startCase} from 'lodash';
import moment from 'moment';
import {Subscription} from 'rxjs';

@Component({
    changeDetection: ChangeDetectionStrategy.OnPush,
    selector: 'datepicker',
    templateUrl: './datePicker.template.html',
})
export class DatePickerComponent implements OnInit, OnDestroy {
    public currentDate: Date = new Date();
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

    /**
     * Перерасчитывает название месяца, год, количество дней в месяце и список дат, согласно выбранному дню.
     */
    public recalculateMonth(): void {
        this.monthName = startCase(this.formatter.format(this.currentDate));
        this.year = this.currentDate.getFullYear();
        const daysInMonth = this.getDaysInMonth(this.currentDate.getMonth(), this.currentDate.getFullYear());
        this.thisMonth = [];
        for (let i = 1; i <= daysInMonth; i++) {
            this.thisMonth.push(new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), i));
        }
    }

    /**
     * Рассчитывает количество дней в месяце.
     */
    public getDaysInMonth(month, year) {
        return new Date(year, month + 1, 0).getDate();
    }

    /**
     * Рассчитывает день недели.
     */
    public getDayInWeek(date: Date) {
        if (date.getDay() > 0) {
            return date.getDay();
        } else {
            return 7;
        }
    }

    /**
     * Рассчитывает номер недели в месяце.
     */
    public getWeekNumber(date) {
        const first = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);

        if (first.getDay() > 0) {
            return DatePickerComponent.calculateWeekNumber(date.getDate(), first.getDay());
        } else {
            return DatePickerComponent.calculateWeekNumber(date.getDate(), 7);
        }
    }

    public static calculateWeekNumber(date, firstDay) {
        return Math.floor((date + firstDay - 2) / 7) + 1;
    }

    /**
     * Выделяет выбраную дату, при выборе второй даты отправляет интервал.
     */
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

    /**
     * Создает интервал из 2-х дат, если вторая дата меньше чем первая то меняет их местами в интервале.
     */
    public static createTimeInterval(firstDate: Date, secondDate: Date) {
        if (moment(firstDate).isSameOrBefore(secondDate)) {
            return {firstDate, secondDate};
        } else {
            return {firstDate: secondDate, secondDate: firstDate};
        }
    }

    /**
     * Переходит на следующий месяц.
     */
    public nextMonth(): void {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
        this.recalculateMonth();
    }

    /**
     * Переходит на предыдущий месяц.
     */
    public previousMonth(): void {
        this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
        this.recalculateMonth();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
