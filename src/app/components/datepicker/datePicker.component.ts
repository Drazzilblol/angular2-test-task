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
    public currentDate: moment.Moment = moment();
    public thisMonth: any[] = [];
    @Output() public onSelectDate = new EventEmitter();
    public firstDate: Date;
    public selectedElement: HTMLElement;
    public monthName: string;
    public year: string;
    private subscription: Subscription;

    constructor(private translate: TranslateService) {
    }

    public ngOnInit(): void {
        this.recalculateMonth();

        this.subscription = this.translate.onLangChange.subscribe(() => {
            this.recalculateMonth();
        });
    }

    /**
     * Перерасчитывает название месяца, год, количество дней в месяце и список дат, согласно выбранному дню.
     */
    public recalculateMonth(): void {
        this.monthName = startCase(this.currentDate.locale(this.translate.currentLang).format('MMMM'));
        this.year = this.currentDate.format('YYYY');
        const daysInMonth = moment(this.currentDate).daysInMonth();
        this.thisMonth = [];
        for (let i = 1; i <= daysInMonth; i++) {
            const date = new Date(this.currentDate.year().valueOf(), this.currentDate.month().valueOf(), i);
            this.thisMonth.push({date, weekDay: this.getDayOfWeek(date), weekOfMonth: this.getWeekNumber(date)});
        }
    }

    /**
     * Рассчитывает день недели.
     */
    public getDayOfWeek(date: Date): number {
        return moment(date).isoWeekday();
    }

    /**
     * Рассчитывает номер недели в месяце.
     */
    public getWeekNumber(date: Date): number {
        return this.calculateWeekNumber(date.getDate(), moment(this.currentDate).startOf('month').isoWeekday());
    }

    public calculateWeekNumber(date: number, firstDay: number): number {
        return Math.floor((date + firstDay - 2) / 7) + 1;
    }

    /**
     * Выделяет выбраную дату, при выборе второй даты отправляет интервал.
     */
    public selectDate(date: Date, event): void {
        if (!this.firstDate) {
            this.firstDate = date;
            this.selectedElement = event.target;
            this.selectedElement.classList.add('selected-date');
        } else {
            this.onSelectDate.emit(this.createTimeInterval(this.firstDate, date));
            this.firstDate = null;
            this.selectedElement.classList.remove('selected-date');
        }
    }

    /**
     * Создает интервал из 2-х дат, если вторая дата меньше чем первая то меняет их местами в интервале.
     */
    public createTimeInterval(firstDate: Date, secondDate: Date): any {
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
        this.currentDate.add(1, 'month');
        this.recalculateMonth();
    }

    /**
     * Переходит на предыдущий месяц.
     */
    public previousMonth(): void {
        this.currentDate.add(-1, 'month');
        this.recalculateMonth();
    }

    public ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }
}
